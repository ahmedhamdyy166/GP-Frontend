import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Components/Tailwind/tailwind.css';

import img1 from '../../Assets/images/vecteezy_user-icon-on-transparent-background_19879186.png';


const AdminSidebar = () => {
    const [userData, setUserData] = useState(null); // State to hold user data
    const [error, setError] = useState(null);

    
    const [activeLink, setActiveLink] = useState('');

    const location = useLocation(); // Get current location

    const handleSetActiveLink = (linkName) => {
        setActiveLink(linkName);
    };

    // const { setUserIsLoggedIn, userIsLoggedIn } = useContext(authContext)
  const navigate = useNavigate()

  function logOut() {
    // setUserIsLoggedIn(false)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userData');

    navigate('/Login')
  }




   

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
            
        



        

        fetchUserData();
        // Set active link based on the current path
        const path = location.pathname;
        if (path === '/AdminHome') {
            setActiveLink('AdminHome');
        }  else if (path === '/AdminSettings') {
            setActiveLink('AdminSettings');
        } 
        else if (path=='/AdminCreatecourse'){
            setActiveLink('AdminCreatecourse')
            
        }
        else if(path=='/userlist'){
            setActiveLink('userlist')

        }
        
        // Add other paths as needed

    }, [location]); // Run effect when location changes
        


   
    


   
          
    

    
    return (

        
        
        <div>
        <aside class="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out -translate-x-full lg:translate-x-0 m-0 fixed z-40 inset-y-0 left-0 lg:bg-light/30 bg-light border-r border-r-dashed border-r-neutral-200 sidenav fixed-start loopple-fixed-start" id="sidenav-main">
        <div class="h-full bg-neutral-900">
            <div class="flex shrink-0 px-8 items-center justify-between h-[96px]">
                    <img alt="Logo" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/logos/loopple.svg" class="inline"/>
                <div class="relative ml-5 group">
                    <a href="javascript:void(0)" class="lg:hidden flex" onclick="(function(){document.querySelector('.group\\/sidebar').classList.toggle('-translate-x-full');})();">
                        <span class="p-0 m-0 -mr-1 leading-none shrink-0 rounded-[.195rem] text-secondary-dark  group-hover:text-primary group-[.open]:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
            <div class="hidden border-b border-dashed lg:block border-neutral-700/70"></div>
            <div class="flex items-center justify-between px-8 py-5">
                <div class="flex items-center mr-5">
                    <div class="mr-1">
                        <div class="inline-block relative shrink-0 cursor-pointer rounded-xl">
                            <img class="w-[45px] h-[40px] shrink-0 inline-block rounded-xl" src={img1} alt={img1} />
                        </div>
                    </div>
                    <div class="mr-2 ">
                        <a href="javascript:void(0)" class="dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium  dark:text-neutral-400/90 text-white/90 hover:text-white" >{userData && userData[0].firstName+" "+userData[0].lastName}</a>
                        <span class="text-secondary-dark dark:text-muted font-medium block text-[0.95rem] ">{userData && userData[0].userType}</span>
                    </div>
                </div>
                <Link to={'/AdminSettings'} className="inline-flex relative items-center group justify-end text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-xl transition-colors duration-150 ease-in-out text-dark bg-transparent shadow-none border-0" >
                    <span class="leading-none transition-colors duration-200 ease-in-out peer shrink-0 group-hover:text-white text-secondary-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </span>
                </Link>
            </div>
            <div class="hidden border-b border-dashed lg:block border-neutral-700/70"></div>
            <div class="relative pl-3 overflow-y-scroll">
                <div class="flex flex-col w-full font-medium">
                    {/* <!-- menu item --> */}
                   
                    {/* <!-- menu item --> */}
                    <div>
                        <span class="select-none flex items-center px-4 py-3 cursor-pointer my-[.4rem] rounded-xl">
                            <Link to={'/AdminHome'}className={`flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 hover:text-white ${activeLink === 'AdminHome' ? 'text-white' : 'text-muted'}`} onClick={() => handleSetActiveLink('AdminHome')}>All Courses</Link>
                        </span>
                    </div>
                    <div>
                        <span class="select-none flex items-center px-4 py-3 cursor-pointer my-[.4rem] rounded-xl">
                            <Link to={'/AdminCreatecourse'}className={`flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 hover:text-white ${activeLink === 'AdminCreatecourse' ? 'text-white' : 'text-muted'}`} onClick={() => handleSetActiveLink('AdminCreatecourse')}>Create Courses</Link>
                        </span>
                    </div>
                    <div>
                        <span class="select-none flex items-center px-4 py-3 cursor-pointer my-[.4rem] rounded-xl">
                            <Link to={'/userlist'}className={`flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 hover:text-white ${activeLink === 'userlist' ? 'text-white' : 'text-muted'}`} onClick={() => handleSetActiveLink('userlist')}>Users list</Link>
                        </span>
                    </div>
                    
                    {/* <!-- menu item --> */}
                    <div class="block pt-5 pb-[.15rem]">
                        <div class="px-4 py-[.65rem]">
                            <span class="font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-white/90">More</span>
                        </div>
                    </div>
                    {/* <!-- menu item --> */}
                    
                    {/* <!-- menu item --> */}
                    
                    {/* <!-- menu item --> */}
                    
                    {/* <!-- menu item --> */}
                    <div>
                        <span class="select-none flex items-center px-4 py-3 cursor-pointer my-[.4rem] rounded-xl">
                            <span onClick={logOut} class="flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 text-muted hover:text-white">Log Out</span>
                            
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
    






    </div>






    );
}

export default AdminSidebar;
