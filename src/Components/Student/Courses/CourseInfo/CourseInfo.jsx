import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import portalImage from '../../../../Assets/images/portal.png';
import '../../../Tailwind/theme.css';
import axios from 'axios';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import './CourseInfo.css';
import Sidebar from '../../../ReusedCompenents/Sidebar';


const Courseinfo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [course, setCourse] = useState(null);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track enrollment status
  useEffect(() => {
    const fetchUserData = () => {
      const userDataFromSessionStorage = sessionStorage.getItem('userData');
      if (userDataFromSessionStorage) {
        const parsedUserData = JSON.parse(userDataFromSessionStorage);
        setUserData(parsedUserData);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchUserData();
    fetchCourseDetails();
  }, [courseId]);

  const handleEnrollClick = () => {
    // Set the passkey value as initial value for formik
    setPasskeyModalOpen(true);
    setPasskey(''); // Reset passkey state
  };

  const handleModalClose = () => {
    setPasskeyModalOpen(false);
    setPasskey('');
  };

  const handleConfirmPasskey = async (values) => {
    try {
      const token = sessionStorage.getItem('token');
  
      const response = await axios.post(
        'http://127.0.0.1:4000/courses/register',
        {
          passKey: values.passkey,
          courseCode: course.course.courseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        const { message } = response.data;
        if (message === 'Successfully registered in course') {
          console.log('Enrollment successful');
          navigate(`/Materials/${courseId}`);
        } else if (message === 'User already registered in this course') {
          console.log('Already registered');
          toast.info('You are already registered in this course.');
        } else {
          console.log('Unknown response:', message);
          toast.error('Failed to enroll. Please try again.');
        }
      } else {
        console.log('Enrollment failed');
        toast.error('Failed to enroll. Please check the passkey and try again.');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll. Please check the passkey and try again.');
    } finally {
      setPasskeyModalOpen(false);
      setPasskey('');
    }
  };
  

 
  
  

  const formik = useFormik({
    initialValues: {
      passkey: passkey,
    },
    onSubmit: (values) => {
      handleConfirmPasskey(values);
    },
  });


  return (
    <div className="flex bg-gray-800 text-gray-100 min-h-screen crsinfo">
      <Sidebar />
      <main className="flex flex-col flex-grow items-center mainofpg min-h-screen justify-center ml-[300px] p-6 lg:ml-[350px]">
        <Helmet>
          <title>Course Information</title>
        </Helmet>
        <div className="colorofinfo p-4 rounded-xl shadow-md sourceof">
          <h1 className="text-4xl font-semibold text-center infocrs text-black">Course Information</h1>
        
          <div className='hellocontainer mt-8'>
            <div className='hellowords'>
              <h2 className='text-4xl text-black'>Course Name: {course && course.course.courseName}</h2>
              <br />
              <h2 className='text-4xl text-black'>Course Description: {course && course.course.courseDesc}</h2>
              <br />
              <h2 className='text-4xl text-black'>Course Code: {course && course.course.courseCode}</h2>
              <br />
              <h2 className='text-4xl text-black'>Instructor: {course && course.course.fullName}</h2>
              <br />
              <h2 className='text-4xl text-black'>Credit Hours: {course && course.course.credtHours}</h2>
            </div>
            <div className='helloimg'>
              <img src={portalImage} alt="" />
            </div>
          </div>
        
          <div className='text-center'>
            <br />
            <br />
            {isEnrolled ? (
              <button onClick={() => navigate(`/Materials/${courseId}`)} className="buttoning px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200 text-center">
                Open
              </button>
            ) : (
              <button onClick={handleEnrollClick} className="buttoning px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200 text-center">
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Passkey Modal */}
      {passkeyModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 passkeyContainer">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black ">
            <h2 className="text-2xl font-semibold mb-4 text-black">Enter Course Passkey</h2>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                name="passkey"
                value={formik.values.passkey}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4"
                placeholder="Enter passkey..."
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md mr-2 hover:bg-primary-dark transition duration-200"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courseinfo;