import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function ForgetPassword() {
  const navigate = useNavigate();

  async function handleSubmit(values, { setSubmitting }) {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:4000/forgetPassword/",
        values
      );

      if (data.response === "Reset Password OTP Email sent") {
        navigate("/verificationcode", { state: { token: data.token , otp: data.otp } });
      } else {
        console.log("Server response:", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("This field is required")
      .email("Enter a valid email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Forget Password</title>
      </Helmet>
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6" >
        <div className="mt-5 pt-10 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Remember your password?
                <Link className="text-blue-600 decoration-2 hover:underline font-medium" to="/Login">Login Here</Link>
              </p>
            </div>
            <div className="mt-5">
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                        required
                        aria-describedby="email-error"
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <p className="text-xs text-red-600 mt-2" id="email-error">{formik.errors.email}</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-black hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    disabled={formik.isSubmitting}
                  >
                    Send Verification Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
