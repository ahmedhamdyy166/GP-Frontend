import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import img1 from '../../Assets/images/portal.png';
import { Helmet } from 'react-helmet';
import '../Register/Register.css';

export default function Register() {
    const [errormsg, seterrormsg] = useState('');
    const [isLoading, setisloading] = useState(false);
    const navigator = useNavigate();

    const validate1 = Yup.object({
        firstName: Yup.string().required("First Name is required").min(3, "Min length is 3 characters"),
        lastName: Yup.string().required("Last Name is required").min(3, "Min length is 3 characters"),
        email: Yup.string().required("Email is required").matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Enter a valid Email"),
        password: Yup.string().required("Password is required").matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Enter a valid password"),
        address: Yup.string().required("Address is required"),
        bDate: Yup.string().required("Enter your date"),
        userType: Yup.string().required("Enter your role")
    });

    const { values, handleSubmit, errors, handleChange, handleBlur, touched, isValid } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            address: '',
            bDate: '',
            userType: ''
        },
        onSubmit: async () => {
            seterrormsg('');
            try {
                setisloading(true);
                const response = await axios.post('http://127.0.0.1:4000/signUp/', values);
                const responseData = response.data;
                console.log(responseData.message);
                console.log(responseData.userId);
                if (responseData.message === "success") {
                    console.log("Registration successful");
                    navigator('/Login');
                } else {
                    seterrormsg(responseData.error);
                }
            } catch (error) {
                seterrormsg(error.response.data.error);
            }
            setisloading(false);
        },
        validationSchema: validate1
    });

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Register</title>
            </Helmet>

            <div className="flex h-screen Registerpage">
                <div className="left_content w-1/2 flex items-center justify-center">
                    <div className="register_form_content mx-auto">
                        <h2 className="Registerheading pt-2 text-center text-white text-2xl mb-6">Register Here <i className="fas fa-arrow-down pl-2"></i></h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.firstName}
                                placeholder='First Name'
                                type="text"
                                className='form-control mb-3'
                                id='firstName'
                                name='firstName'
                            />
                            {errors.firstName && touched.firstName && <div className="text-red-500 signupAlert">{errors.firstName}</div>}

                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lastName}
                                placeholder='Last Name'
                                type="text"
                                className='form-control mb-3'
                                id='lastName'
                                name='lastName'
                            />
                            {errors.lastName && touched.lastName && <div className="text-red-500 signupAlert">{errors.lastName}</div>}

                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                placeholder='Email'
                                type="email"
                                className='form-control mb-3'
                                id='email'
                                name='email'
                            />
                            {errors.email && touched.email && <div className="text-red-500 signupAlert2">{errors.email}</div>}

                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                placeholder='Password'
                                type="password"
                                className='form-control mb-3'
                                id='password'
                                name='password'
                            />
                            {errors.password && touched.password && <div className="text-red-500 signupAlert pr-4">{errors.password}</div>}

                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                placeholder='Address'
                                type="text"
                                className='form-control mb-3'
                                id='address'
                                name='address'
                            />
                            {errors.address && touched.address && <div className="text-red-500 signupAlert">{errors.address}</div>}

                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.bDate}
                                placeholder='Birth Date'
                                type="date"
                                className='form-control mb-3'
                                id='bDate'
                                name='bDate'
                            />
                            {errors.bDate && touched.bDate && <div className="text-red-500 signupAlert2 pr-4">{errors.bDate}</div>}

                            <select
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.userType}
                                className='form-control mb-3 type-btn'
                                id='userType'
                                name='userType'
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                            {errors.userType && touched.userType && <div className="text-red-500 signupAlert2 pr-4">{errors.userType}</div>}

                            {errormsg !== '' && <div className="alert alert-danger text-red-500 text-lg ">{errormsg}</div>}

                            {isLoading ? (
                                <button disabled type='button' className='btn bg-main px-4 text-white ms-auto block'>
                                    <i className='fas fa-spin fa-spinner px-3'></i>
                                </button>
                            ) : (
                                <button type='submit' disabled={!isValid || isLoading} className='btn login_btn px-3 text-white mx-auto block custom-bg-color'>
                                    Register
                                </button>
                            )}
                        </form>
                        <div className="dontHaveAccount-btn">
              <span>Already have an account? </span>
              <Link to="/Login"><button className="signup_btn">Login</button></Link>
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
