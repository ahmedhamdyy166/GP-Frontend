import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../ReusedCompenents/AdminSidebar';
import './UserList.css';
import img1 from '../../Assets/images/vecteezy_user-icon-on-transparent-background_19879186.png';
import { toast } from 'react-toastify';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:4000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:4000/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.userID !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user => user.userID.toString().includes(searchTerm));

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Calculate number of pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className='bodyofuserlist'>
      <AdminSidebar />
      <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
        <div className="flex items-center text-center justify-between pb-6 usersmgn">
          <div className='wala'>
            <h2 className="font-semibold text-gray-700">User Accounts</h2>
            <span className="text-xs text-gray-500">View accounts of registered users</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="ml-10 space-x-8 lg:ml-40">
              <input
                className="block w-full py-3 pl-12 pr-4 text-base font-medium leading-normal bg-white border border-solid outline-none appearance-none placeholder:text-secondary-dark peer text-stone-500 border-stone-200 bg-clip-padding rounded-2xl"
                placeholder="Search..."
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-hidden rounded-lg border widthoflist">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-left text-sm font-semibold uppercase tracking-widest text-white fenak">
                  <th className="px-5 py-3">User ID</th>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-5 py-3">User Role</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">User Deletion</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                {currentUsers.map(user => (
                  user.userType !== 'admin' && (
                    <tr key={user.userID}>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap">{user.userID}</p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-full w-full rounded-full" src={img1} alt="" />
                          </div>
                          <div className="ml-3">
                            <p className="whitespace-no-wrap ">{`${user.firstName} ${user.lastName}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap">{user.userType}</p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap">{user.email}</p>
                      </td>
                      <td className='border-b border-gray-200 bg-white px-5 py-5 text-sm'>
                        <button onClick={() => handleDeleteUser(user.userID)} className="text-white font-bold py-2 px-4 rounded-full userlistbtn">
                          Delete User
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
            {totalPages > 1 && (
              <ul className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className="cursor-pointer">
                    <button
                      className={`px-3 py-2 rounded-full border border-gray-300 ${currentPage === index + 1 ? 'bg-blue-600 text-black underline' : 'hover:bg-blue-600 hover:text-black underline'}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
