import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import correctly

export default function CheckOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = location.state?.token;
      const sentotp = location.state?.otp;

      if (!token) {
        setError('Authorization token not found.');
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.userEmail;
      

      const response = await axios.post(
        'http://127.0.0.1:4000/checkOTP',
        { providedOTP: otp, userEmail: email ,sentOTP : sentotp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data === 'verified') {
        navigate('/resetpassword' , { state: { token:token } });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Error verifying OTP. Please try again later.');
    }
  };

  return (
    <div className="items-center mt-10">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Verification Code</title>
      </Helmet>
      <div className="flex flex-1 flex-col justify-center space-y-5 max-w-md mx-auto mt-24">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Confirm OTP</h2>
          <p className="text-md md:text-xl">Enter the OTP we just sent you.</p>
        </div>
        <div className="flex flex-col max-w-md space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-white text-black hover:bg-gray-900"
          >
            Confirm
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
