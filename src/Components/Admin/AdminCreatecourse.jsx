import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "../ReusedCompenents/AdminSidebar";
import './Admincreate.css'
const FormRegistration = () => {
  const [userData, setUserData] = useState(null); // State to hold user data

  const formik = useFormik({
    initialValues: {
      "courseName" :'' ,
      "courseDesc" :'',
      "instructorId" :'' ,
      "creditHours" :'',
      "courseCode" :'',
      "passKey" :'' 
    },
    onSubmit: async (values) => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:4000/admin/create', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Course created successfully', response.data);
        toast.success('Course created successfully');
      } catch (error) {
        console.error('Error adding Course', error);
        toast.error('Error adding course')
      }
    }
  });

//   useEffect(() => {
//     const fetchUserData = () => {
//         const userDataFromsSessionStorage = sessionStorage.getItem('userData');
//         if (userDataFromsSessionStorage) {
//             const parsedUserData = JSON.parse(userDataFromsSessionStorage);
//             setUserData(parsedUserData);
           

//         }
//     };


//     fetchUserData();

// }, []);

  return (
    <div className="flex bg-gray-800 text-gray-100 min-h-screen">
        <AdminSidebar />
    <main className="flex flex-col flex-grow items-center min-h-screen justify-center ml-[300px] p-6 lg:ml-[350px] kk">



                <div className=" bg-neutral-900 p-4 rounded-xl shadow-md meon">

                    <h1 className="text-3xl font-semibold text-center mb-16 text-white ">Hello Admin ! </h1>
                    
                    <form onSubmit={formik.handleSubmit} className="space-y-4 mm">
                        <div >
                          
                            <label htmlFor="courseName" className="block text-sm font-medium">
                                Course Name
                            </label>
                            <input 
                                id="courseName"
                                name="courseName"
                                type="text"
                                className="w-full px-3 py-2 rounded-md taskcoloring  "
                                onChange={formik.handleChange}
                                value={formik.values.courseName}
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="courseDesc" className="block text-sm font-medium">
                                Course Description
                            </label>
                            <textarea
                                id="courseDesc"
                                name="courseDesc"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.courseDesc}
                            />
                        </div>
                        <br />

                        <div>
                            <label htmlFor="instructorId" className="block text-sm font-medium">
                                Instructor Id
                            </label>
                            <input
                                id="instructorId"
                                name="instructorId"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.instructorId}
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="creditHours" className="block text-sm font-medium">
                                Credit Hours
                            </label>
                            <input
                                id="creditHours"
                                name="creditHours"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.creditHours}
                            />
                        </div>
                          <br />
                          <div>
                            <label htmlFor="courseCode" className="block text-sm font-medium">
                                Course Code
                            </label>
                            <input
                                id="courseCode"
                                name="courseCode"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.courseCode}
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="passKey" className="block text-sm font-medium">
                                Pass Key
                            </label>
                            <input
                                id="passKey"
                                name="passKey"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.passKey}
                            />
                        </div>
                        {/* <br />
                        <div>
                            <label htmlFor="Course image" className="block text-sm font-medium">
                                Course image
                            </label>
                            <input
                                id="passKey"
                                name="passKey"
                                type="image"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.dueDate}
                            />
                        </div> */}
                        <div>
                          <br />
                          
                            <button
                                type="submit"
                                className="w-full px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200"
                            >
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            
            
            
               </div>
  );
};

export default FormRegistration;
