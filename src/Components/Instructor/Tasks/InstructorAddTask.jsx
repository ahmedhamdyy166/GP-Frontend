import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './task.css'
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import InstructorSidebar from '../../ReusedCompenents/InstructorSidebar';


export default function InstructorAddTask() {

    const [userData, setUserData] = useState(null); // State to hold user data

  const formik = useFormik({
    initialValues: {
      taskName: '',
      taskDesc: '',
      dueDate: ''
    },
    onSubmit: async (values) => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:4000/createTasks', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Task added successfully', response.data);
        toast.success('Task added successfully');
      } catch (error) {
        console.error('Error adding task', error);
      }
    }
  });

  useEffect(() => {
    const fetchUserData = () => {
        const userDataFromsSessionStorage = sessionStorage.getItem('userData');
        if (userDataFromsSessionStorage) {
            const parsedUserData = JSON.parse(userDataFromsSessionStorage);
            setUserData(parsedUserData);
           

        }
    };


    fetchUserData();

}, []);


  return (
    
    <div className="flex bg-gray-800 text-gray-100 min-h-screen">
        <InstructorSidebar />
    <main className="flex flex-col flex-grow items-center min-h-screen justify-center ml-[300px] p-6 lg:ml-[350px] kk">



                <div className=" bg-neutral-900 p-4 rounded-xl shadow-md lll">

                    <h1 className="text-3xl font-semibold text-center mb-16 text-white ">Let's remind ourselves with upcoming tasks <i className="fas fa-arrow-down ml-1"></i></h1>
                    
                    <form onSubmit={formik.handleSubmit} className="space-y-4 mm">
                        <div >
                          
                            <label htmlFor="taskName" className="block text-sm font-medium">
                                Task Name
                            </label>
                            <input 
                                id="taskName"
                                name="taskName"
                                type="text"
                                className="w-full px-3 py-2 rounded-md taskcoloring  "
                                onChange={formik.handleChange}
                                value={formik.values.taskName}
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="taskDesc" className="block text-sm font-medium">
                                Task Description
                            </label>
                            <input
                                id="taskDesc"
                                name="taskDesc"
                                type="text"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.taskDesc}
                            />
                        </div>
                        <br />

                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium">
                                Due Date
                            </label>
                            <input
                                id="dueDate"
                                name="dueDate"
                                type="datetime-local"
                                className="w-full px-3 py-2 taskcoloring rounded-md "
                                onChange={formik.handleChange}
                                value={formik.values.dueDate}
                            />
                        </div>
                        <br />

                        <div>
                          <br />
                          
                            <button
                                type="submit"
                                className="w-full px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200"
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            
            
            
               </div>
  );
}