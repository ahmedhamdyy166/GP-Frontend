import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import
 
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
 
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
 
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
 
    if (!passwordRegex.test(password)) {
      setError('Enter a valid password. It should contain at least one number, one special character, and be 6-16 characters long.');
      return;
    }
 
    try {
      const token = location.state?.token;
 
      if (!token) {
        setError('Authorization token not found.');
        return;
      }
 
      const decodedToken = jwtDecode(token);
      const email = decodedToken.userEmail;
 
      const response = await axios.put(
        'http://127.0.0.1:4000/changePassword',
        { password, userEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
      console.log('API response:', response.data);
 
      if (response.data === 'Password updated successfully') {
        navigate('/Login'); // Redirect to signin page after successful password reset
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(error.response.data.message || 'Error resetting password. Please try again later.');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response from the server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        setError('Error resetting password. Please try again later.');
      }
    }
  };
 
  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Change Password</title>
      </Helmet>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-black">
          Change Password
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autocomplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full text-black bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Reset Password
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
}