import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import img1 from '../../Assets/images/portal.png';
import { Helmet } from 'react-helmet';
import '../Login/Login.css';
import { authContext } from '../../Contexts/AuthContext';

export default function Login() {
  const [errormsg, seterrormsg] = useState('');
  const [isLoading, setisloading] = useState(false);
  const { setUserIsLoggedIn } = useContext(authContext);
  const navigate = useNavigate();

  const validate1 = Yup.object({
    email: Yup.string().required("Email is required").matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Enter valid Email"),
    password: Yup.string().required("Password is required").matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Enter a valid password"),
  });


  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      seterrormsg('');
      try {
        setisloading(true);
        const response = await axios.post('http://127.0.0.1:4000/signIn/', values);
      
        const responseData = response.data;
        if (responseData.message === "success") {
          // Store token in sessionStorage
          sessionStorage.setItem('token', responseData.token);
      
          // Fetch user data using another API call
          const profileResponse = await axios.get('http://127.0.0.1:4000/getUserData', {
            headers: {
              Authorization: `Bearer ${responseData.token}` // Include token in headers
            }
          });
      
          const userData = profileResponse.data.data; // Assuming the structure is { data: { firstName, lastName, email, ... } }
          
          // Store userData in sessionStorage or state (depending on your application design)
          sessionStorage.setItem('userData', JSON.stringify(userData));
      
          setUserIsLoggedIn(true);
          console.log(userData);
      
          // Navigate to different pages based on the user's type
          if (responseData.userType === 'student') {
            navigate('/Home');
          } else if (responseData.userType === 'instructor') {
            navigate('/InstructorHome');
          } else if (responseData.userType === 'admin') {
            navigate('/AdminHome');
          } else {
            // Fallback in case the userType is unexpected
            seterrormsg('Unexpected user type');
          }
        } else {
          // Handle different error messages
          seterrormsg(responseData.message);
        }
      } catch (error) {
        seterrormsg(error.response ? error.response.data.message : 'Network error');
      }
      setisloading(false);
      
    },
    validationSchema: validate1,
  });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>
      <div className="Loginpage">
        <div className="left_content">
          <div className="form_content">
            <h1>Login</h1>
            <p>Enter your account details</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="inputbox">
                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} placeholder="Email" type="text" id='email' name='email' />
                {formik.errors.email && formik.touched.email && <div className="text-red-500 loginAlert pr-8 ">{formik.errors.email}</div>}
              </div>
              <div className="inputbox">
                <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} placeholder="Password" type="password" id='password' name='password' />
                {formik.errors.password && formik.touched.password && <div className="text-red-500 loginAlert pr-5">{formik.errors.password}</div>}
              </div>
              <Link className="forgot-password-btn" to={'/forgetPassword'}>Forgot Password?</Link>
              <br />
              {errormsg && <div className="text-red-500 text-lg">{errormsg}</div>}
              {isLoading ?
                <button type="button" className="login_btn" disabled><i className="fas fa-spinner fa-spin"></i> Loading...</button> :
                <button type='submit' className="login_btn" disabled={!formik.isValid || isLoading}>Login</button>
                


                
              }
            </form>
            <div className="dontHaveAccount-btn">
              <span>Don't have an account? </span>
              <Link to="/Register"><button className="signup_btn">Sign Up</button></Link>
            </div>
          </div>
        </div>
        <div className="right_content w-1/2 flex flex-col items-center justify-center text-white">
          <h1 className="text-black text-6xl font-light mb-4">Welcome <span className="hero-content-words"></span></h1>
          <div className="imgcontent">
            <img src={img1} className="img-fluid mt-5" alt='' />
          </div>
        </div>
      </div>
    </>
  );
}
