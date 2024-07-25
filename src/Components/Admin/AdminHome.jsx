import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Components/Tailwind/tailwind.css';
import '../../Components/Student/Home/Home.css';
import { format } from 'date-fns';
import Footer from '../ReusedCompenents/Footer';
import { toast } from 'react-toastify';
import AdminSidebar from '../ReusedCompenents/AdminSidebar';


const Home = () => {
    const [courses, setCourses] = useState([]);
    const [userData, setUserData] = useState(null); // State to hold user data


    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 5;
    const [courseStatistics, setCourseStatistics] = useState(null); // New state for course statistics



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:4000/getUserData', {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.data) {
                    setUserData(response.data.data);
                } else {
                    setError('User profile not found');
                }
            } catch (error) {
                setError('Failed to fetch user profile');
            }
        };
            
        

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:4000/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchCourseStatistics = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:4000/course/userstatistics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setCourseStatistics(response.data);
                } else {
                    setError('Failed to fetch course statistics');
                }
            } catch (error) {
                console.error('Error fetching course statistics:', error);
                setError('Failed to fetch course statistics');
            }
        };
     
        

        fetchUserData();
        fetchCourses();
        fetchCourseStatistics();
    }, []);

    useEffect(() => {
        if (query) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:4000/courses/search', {
                        params: { course: query }
                    }); 

                    setSuggestions(response.data.courses.slice(0, 5)); // Limit to 5 suggestions
                                        
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const clearInput = () => {
        setQuery('');
        setSuggestions([]);
    };

    

   

   

   

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = Array.isArray(courses) ? courses.slice(indexOfFirstCourse, indexOfLastCourse) : [];
    
    

    
    return (

        
        
        <div>
            
            <AdminSidebar />
       
    <div class="lg:ml-[300px] relative h-full max-h-screen rounded-xl transition-all duration-200 bg-white" id="panel">
        <nav class="flex h-28 mb-5 lg:h-[96px]" id="navbarTop" navbar-scroll="true">
            <div class="sm:flex items-stretch justify-between grow lg:mb-0 mb-5 py-5 px-10">
                <div class="flex flex-col flex-wrap justify-center mb-5 mr-3 lg:mb-0">
                    <span class="my-0 flex text-dark font-semibold text-[1.35rem]/[1.2] flex-col justify-center">Courses</span>
                    {/* <span class="pt-1 text-secondary-dark text-[0.95rem] font-medium">Check all available courses</span> */}
                </div>
                <div class="flex items-center lg:shrink-0 lg:flex-nowrap">
  <div class="relative flex flex-col items-center lg:ml-4 sm:mr-0 mr-2 w-full">
    <div class="relative w-full">
      <span class="absolute ml-4 leading-none -translate-y-1/2 top-1/2 text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
        </svg>
      </span>
      <input
        class="block w-full py-3 pl-12 pr-4 text-base font-medium leading-normal bg-white border border-solid outline-none appearance-none placeholder:text-secondary-dark peer text-stone-500 border-stone-200 bg-clip-padding rounded-2xl"
        placeholder="Search..."
        type="text"
        value={query}
        onChange={handleInputChange}
      />
      <span onClick={clearInput} class="absolute right-0 left-auto mr-4 leading-none -translate-y-1/2 peer-placeholder-shown:hidden top-1/2 hover:text-primary text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </span>
    </div>
    {suggestions.length > 0 && (
      <ul class="absolute w-full bg-white border border-stone-200 rounded-lg shadow-lg mt-12 z-10">
        {suggestions.map((course) => (
          <li key={course.id} class="py-2 px-4 hover:bg-gray-100 cursor-pointer">
          <Link to={`/CourseInfo/${course.courseID}`} >
          {course.courseName} ({course.courseCode})
          </Link>


        </li>
        ))}
      </ul>
    )}
  

            
                    </div>
                    {/* <div class="relative lg:hidden flex items-center sm:ml-2 ml-auto">
                        <a href="javascript:void(0)" class="flex items-center justify-center w-12 h-12 text-base font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out bg-transparent border border-solid shadow-none cursor-pointer rounded-2xl text-stone-500 border-stone-200 hover:text-primary active:text-primary focus:text-primary" onclick="(function(){document.querySelector('.group\\/sidebar').classList.toggle('-translate-x-full');})();">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                            </svg>
                        </a>
                    </div> */}
                    <div class="relative flex items-center ml-2 lg:ml-4">
                        <Link to={'/Settings'} class="flex items-center justify-center w-12 h-12 text-base font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out bg-transparent border border-solid shadow-none cursor-pointer rounded-2xl text-stone-500 border-stone-200 hover:text-primary active:text-primary focus:text-primary ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </Link>
                    </div>
                    <div class="relative flex items-center ml-2 lg:ml-4">
                        <a href="javascript:void(0)" class="flex items-center justify-center w-12 h-12 text-base font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out bg-transparent border border-solid shadow-none cursor-pointer rounded-2xl text-stone-500 border-stone-200 hover:text-primary active:text-primary focus:text-primary ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"></path>
                            </svg>
                            <div class="absolute justify-center w-5 h-5 text-base font-semibold leading-normal text-center text-white text-sm align-middle transition-colors duration-150 ease-in-out shadow-none cursor-pointer rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-dark focus:bg-primary-dark top-0 right-0 -me-1 -mt-2">
                                <span class="text-sm">6</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
        <div class="w-full px-10 py-6 mx-auto loopple-min-height-78vh text-slate-500">
            <div class="flex flex-wrap -mx-3 mb-5 removable">
                <div class="w-full max-w-full px-3 mb-6 lg:w-8/12 sm:flex-none xl:mb-0">
                    <div class="relative flex flex-col break-words min-w-0 bg-clip-border rounded-xl bg-neutral-900 mb-5">
                        {/* <!-- card body  --> */}
                        <div class="flex-auto block py-8 px-9">
                            <div class="m-0 z-20 relative">
                                <div class="relative z-20 text-3xl font-semibold text-white w-3/4">

                                        Hello {userData && userData[0].firstName} !

                                       

                                </div>
                                <p class="mb-7 text-white">We are happy to see you again.</p>
                                <div class="flex flex-col gap-2 xl:gap-4 sm:flex-row">
                                <Link to={'/AdminHome'}>

                                    <a href="javascript:void(0)" class="shrink-0 inline-block text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-[.95rem] transition-colors duration-150 ease-in-out text-dark bg-white border-white shadow-none [border:_0]  px-5 py-3.5 hover:bg-white/90 active:bg-white focus:bg-white
                ">All Courses</a></Link>
                
                                </div>
                            </div>
                            <img src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/bonus.png" class="bottom-0 absolute mr-3 end-0 h-[200px] opacity-40 z-10" alt="" />
                        </div>
                    </div>
                    <h3 class="font-bold mb-4 text-2xl">Courses</h3>
                    <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 mb-5">
                        {/* <!-- card header --> */}
                        <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                            <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                                <span class="mr-3 font-semibold text-dark">All Courses</span>
                                <span class="mt-1 font-medium text-secondary-dark text-lg/normal" >Check all available courses</span>
                            </h3>
                            
                        </div>
                        {/* <!-- end card header --> */}
                        {/* <!-- card body  --> */}
                        <div className="flex-auto block py-8 pt-6 px-9 text-black">
            <div className="overflow-x-auto">
                <table className="w-full my-0 align-middle text-dark border-neutral-200">
                    <thead className="align-bottom">
                        <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                            <th className="pb-3 text-start min-w-[175px]">COURSE</th>
                            <th className="pb-3 text-end min-w-[100px]">INSTRUCTOR</th>
                            <th className="pb-3 text-end min-w-[100px]">CREDIT</th>
                            <th className="pb-3 pr-12 text-end min-w-[175px]">STATUS</th>
                            <th className="pb-3 pr-12 text-end min-w-[100px]">Course Code</th>
                            <th className="pb-3 text-end min-w-[50px]">DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCourses.map((course, index) => (
                            <tr key={index} className="border-b border-dashed last:border-b-0">
                                <td className="p-3 pl-0">
                                    <div className="flex items-center">
                                        <div className="relative inline-block shrink-0 rounded-2xl me-3">
                                            <img src={course.image} className="w-[50px] h-[50px] inline-block shrink-0 rounded-2xl" alt="" />
                                        </div>
                                        <div className="flex flex-col justify-start">
                                            <a href="javascript:void(0)" className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary">
                                                {course.courseName}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 pr-0 text-end">
                                    <span className="font-semibold text-light-inverse text-md/normal">{course.fullName}</span>
                                    
                                </td>
                                <td className="p-3 pr-0 text-end">
                                    <span className="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none text-success bg-success-light rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>{course.credtHours + " Hours"}
                                    </span>
                                </td>
                                <td className="p-3 pr-12 text-end">
                                    <span className={`text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none rounded-lg ${course.status === 'In Progress' ? 'text-primary bg-primary-light' : course.status === 'Done' ? 'text-success bg-success-light' : 'text-warning bg-warning-light'}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="pr-0  text-center">
                                    <span className="font-semibold text-light-inverse text-md/normal">{course.courseCode}</span>
                                </td>
                                <td className="p-3 pr-0 text-end">
                                <Link to={`/AdminMaterials/${course.courseID}`}>
                                <button className="ml-auto relative text-secondary-dark bg-light-dark hover:text-primary flex items-center h-[25px] w-[25px] text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-2xl transition-colors duration-200 ease-in-out shadow-none border-0 justify-center">
                                            <span className="flex items-center justify-center p-0 m-0 leading-none shrink-0 ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
                    </div>
                </div>
                <div class="w-full max-w-full px-3 mb-6 lg:w-4/12 sm:flex-none xl:mb-0">
                    <div class="relative flex flex-col min-w-0 break-words bg-gray-100 border-0 bg-clip-border rounded-2xl mb-5">
                        {/* <!-- card header --> */}
                        <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                            <div class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/normal text-dark">
                                {/* <!--begin::Amount--> */}
                                <span class="text-dark text-5xl/none font-semibold mr-2 tracking-[-0.115rem]">{courseStatistics && courseStatistics.status1Count}</span>
                                {/* <!--end::Amount--> */}

                                {/* <!--begin::Subtitle--> */}
                                <span class="pt-1 font-medium text-dark text-lg/normal">Courses Archived</span>
                                {/* <!--end::Subtitle--> */}
                            </div>
                        </div>
                        {/* <!-- card body  --> */}
                        <div class="flex items-end flex-auto py-8 pt-0 px-9 ">
                            {/* <!--begin::Progress--> */}
                            <div class="flex flex-col items-center w-full mt-3">
                            <div class="flex justify-between w-full mt-auto mb-2 font-semibold text-dark text-lg/normal">
                                <span class="mr-4 text-dark">{courseStatistics && courseStatistics.status0Count} Active</span>
                                <span>{(courseStatistics && courseStatistics.status0Percentage.toFixed(2)) || '0.00'}%</span>
                            </div>

                                <div class="mx-3 rounded-2xl h-[8px] w-full bg-white">
                                    <div class="rounded-2xl bg-dark w-[85%] h-[8px]" style={{ width: `${courseStatistics && courseStatistics.status0Percentage}%`}}></div>
                                </div>
                            </div>
                            {/* <!--end::Progress--> */}
                        </div>
                        {/* <!-- end card body  --> */}
                    </div>
                    {/* <!-- end card body  --> */}
                    <div>
    <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 mb-5">
        <div className="flex-auto block py-8 pt-6 px-9 text-black">
        </div>
    </div>
</div>

                    
                    <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
                        {/* <!-- card header --> */}
                        <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                            <div class="flex flex-col m-2 ml-0 ">
                                {/* <!--begin::Amount--> */}
                                <span class="text-5xl/none tracking-[-0.115rem] font-semibold text-dark mr-2">529</span>
                                {/* <!--end::Amount--> */}
                                {/* <!--begin::Subtitle--> */}
                                <span class="pt-1 font-medium text-secondary-dark text-lg/normal">Atendees</span>
                                {/* <!--end::Subtitle--> */}
                            </div>
                        </div>
                        {/* <!-- card body  --> */}
                        <div class="flex flex-col justify-between flex-auto py-8 px-9">
                            <span class="block mb-2 font-bold text-lg/normal text-secondary-inverse">Top Performers</span>
                            <div class="flex flex-wrap items-center ml-[10px]">
                                {/* <!--begin::User--> */}
                                <div class="group inline-block rounded-full relative z-0 hover:z-10 -ml-[10px] transition-all duration-300 ease-in-out cursor-pointer shrink-0" data-bs-toggle="tooltip" aria-label="Emma Smith" data-kt-initialized="1" data-original-title="" title="">
                                    <img alt="Pic" class="w-[35px] h-[35px] rounded-full inline-block shrink-0 border-2 border-white/50" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg" />
                                    <span class="absolute z-10 self-center hidden px-4 py-3 mb-2 text-sm text-center transform -translate-x-1/2 bg-white shadow-sm whitespace-nowrap rounded-2xl left-1/2 bottom-full text-dark group-hover:block"> Alex Kenzie </span>
                                </div>
                                {/* <!--begin::User--> */}
                                <div class="group inline-block rounded-full relative z-0 hover:z-10 -ml-[10px] transition-all duration-300 ease-in-out cursor-pointer shrink-0" data-bs-toggle="tooltip" aria-label="Rudy Stone" data-kt-initialized="1" data-original-title="" title="">
                                    <img alt="Pic" class="w-[35px] h-[35px] rounded-full inline-block shrink-0 border-2 border-white/50" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar2.jpg" />
                                    <span class="absolute z-10 self-center hidden px-4 py-3 mb-2 text-sm text-center transform -translate-x-1/2 bg-white shadow-sm whitespace-nowrap rounded-2xl left-1/2 bottom-full text-dark group-hover:block"> Roberta Mikolo </span>
                                </div>
                                <div class="group inline-block rounded-full relative z-0 hover:z-10 -ml-[10px] transition-all duration-300 ease-in-out cursor-pointer shrink-0" data-bs-toggle="tooltip" data-kt-initialized="1" data-original-title="" title="">
                                    <span class="relative flex items-center justify-center text-sm font-semibold bg-info text-white border-2 border-white/50 w-[35px] h-[35px] rounded-full shrink-0">S</span>
                                    <span class="absolute z-10 self-center hidden px-4 py-3 mb-2 text-sm text-center transform -translate-x-1/2 bg-white shadow-sm whitespace-nowrap rounded-2xl left-1/2 bottom-full text-dark group-hover:block"> Sima Lucas </span>
                                </div>
                                <div class="group inline-block rounded-full relative z-0 hover:z-10 -ml-[10px] transition-all duration-300 ease-in-out cursor-pointer shrink-0" data-bs-toggle="tooltip" aria-label="Rudy Stone" data-kt-initialized="1" data-original-title="" title="">
                                    <img alt="Pic" class="w-[35px] h-[35px] rounded-full inline-block shrink-0 border-2 border-white/50" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar3.jpg" />
                                    <span class="absolute z-10 self-center hidden px-4 py-3 mb-2 text-sm text-center transform -translate-x-1/2 bg-white shadow-sm whitespace-nowrap rounded-2xl left-1/2 bottom-full text-dark group-hover:block"> Bianca Ornos </span>
                                </div>
                                {/* <!--begin::User--> */}
                                {/* <!--begin::User--> */}
                                <div class="group inline-block rounded-full relative z-0 hover:z-10 -ml-[10px] transition-all duration-300 ease-in-out cursor-pointer shrink-0" data-bs-toggle="tooltip" data-kt-initialized="1" data-original-title="" title="">
                                    <span class="relative flex items-center justify-center text-sm font-semibold bg-dark text-secondary border-2 border-white/50 w-[35px] h-[35px] rounded-full shrink-0">+9</span>
                                    <span class="absolute z-10 self-center hidden px-4 py-3 mb-2 text-sm text-center transform -translate-x-1/2 bg-white shadow-sm whitespace-nowrap rounded-2xl left-1/2 bottom-full text-dark group-hover:block"> +9 others </span>
                                </div>
                                {/* <!--begin::User--> */}
                            </div>
                        </div>
                        {/* <!-- end card body  --> */}
                    </div>
                </div>
            </div>
        </div>
        

            <Footer />

    </div>


    <div className="loopple-badge">Made with <a href="https://www.loopple.com"><img src="https://www.loopple.com/img/loopple-logo.png" className="loopple-ml-1" style={{ width: '55px' }} alt="Loopple Logo" /></a></div>
           









    </div>






    );
}

export default Home;
