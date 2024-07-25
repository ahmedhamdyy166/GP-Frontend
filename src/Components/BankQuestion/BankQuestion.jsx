import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StudentMaterialSidebar from '../Student/Materials/StudentMaterialSidebar';
import InstructormaterialSidebar from '../Instructor/InstructorMaterials/InstructormaterialSidebar';

const BankQuestion = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

  const fetchQuestions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      const response = await axios.get(`http://127.0.0.1:4000/post/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data.posts)) {
        const questionPosts = response.data.posts.filter(post => post.tag === 'Question');
        setQuestions(questionPosts);
      } else {
        setError('Unexpected response format');
        console.error('Unexpected response format:', response.data.error);
      }
    } catch (error) {
      setError('Failed to fetch questions');
      console.error('Failed to fetch questions:', error);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
        <InstructormaterialSidebar />
      <div className="xl:container mx-auto">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12">
            <main className="p-4 md:p-5">
              {questions.length > 0 ? (
                questions.map((post) => (
                  <div key={post.postId} className="bg-white rounded shadow mt-5">
                    <h1 className="font-bold text-gray-600 text-center pt-4">{post.userDetails && `${post.userDetails.firstName} ${post.userDetails.lastName}`}</h1>
                    <h1 className="font-bold text-black-500 text-center pt-2 text-xl">{post.tag}</h1>

                    <div className="p-6 md:p-7 lg:p-9">
                      <h1 className="font-bold text-red-500 text-3xl">{post.postName}</h1>
                      <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2">{post.content}</h3>
                      <div className="mt-3 mb-3 text-sm text-gray-700 flex items-center">
                        <span className="ml-1">
                          <div>
                            <i className="fa fa-clock-o"></i> {post.postDate.slice(0, 10)}
                            <br />
                            <i className="fa fa-clock-o"></i> {post.postDate.slice(11, 16)}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-black text-center text-2xl '>No questions available.</div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankQuestion;
