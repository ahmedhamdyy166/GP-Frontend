import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import StudentMaterialSidebar from '../Materials/StudentMaterialSidebar';
import './Posts.css';
import { toast } from 'react-toastify';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome

const Posts = () => {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false); // Toggle visibility for new post form
  const [showCommentForms, setShowCommentForms] = useState({}); // Track visible comment forms by postId
  const [comments, setComments] = useState({}); // Store comments for each post
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null); // Track the comment being edited
  const [editCommentPostId, setEditCommentPostId] = useState(null); // Track the post ID of the comment being edited
  
  const formRef = useRef(null); // Reference for the form element
  const postRefs = useRef({}); // Reference for the post elements

  const [voteCounts, setVoteCounts] = useState({}); // State to store vote counts
  const [userDetails, setUserDetails] = useState([]);


  useEffect(() => {
    fetchPosts();
  }, [courseId]);

  useEffect(() => {
    if (isEditing && showPostForm) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isEditing, showPostForm]);

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing');
        return;
      }
      const response = await axios.get(`http://127.0.0.1:4000/post/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (Array.isArray(response.data.posts)) {
        const postsWithUserDetails = await Promise.all(
          response.data.posts.map(async (post) => {
            const userDetails = await fetchUserDetails(post.userId);
            return {
              ...post,
              userDetails: userDetails // Add user details to each post
            };
          })
        );
  
        setPosts(postsWithUserDetails); // Update state with posts including user details
        fetchVoteCounts(postsWithUserDetails); // Fetch vote counts for the posts
      } else {
        setError('Unexpected response format');
        console.error('Unexpected response format:', response.data.error);
      }
    } catch (error) {
      setError('Failed to fetch posts');
      console.error('Failed to fetch posts:', error);
    }
  };
  
  const fetchUserDetails = async (userId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:4000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Assuming backend returns { firstName, lastName, ... }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  };
  
  const fetchComments = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:4000/post/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const commentsWithUserDetails = await Promise.all(
        response.data.map(async (comment) => {
          const userDetails = await fetchUserDetails(comment.userId);
          return {
            ...comment,
            userDetails: userDetails // Add user details to each comment
          };
        })
      );
  
      setComments(prevComments => ({
        ...prevComments,
        [postId]: commentsWithUserDetails
      }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Failed to fetch comments');
    }
  };



  const fetchVoteCounts = async (posts) => {
    try {
      const token = sessionStorage.getItem('token');
      const promises = posts.map(post =>
        axios.get(`http://127.0.0.1:4000/votes/${post.postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      const responses = await Promise.all(promises);
      const voteCounts = {};
      responses.forEach((response, index) => {
        const postId = posts[index].postId;
        voteCounts[postId] = response.data;
      });
      setVoteCounts(voteCounts);
    } catch (error) {
      console.error('Failed to fetch vote counts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing');
        return;
      }

      const response = await axios.delete(`http://127.0.0.1:4000/post/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        // Update state to remove the deleted post
        setPosts(posts => posts.filter(post => post.postId !== postId));
        toast.success('Post deleted successfully');
      } else if (response.status === 403) {
        toast.error('You are not authorized to delete this post');
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('You are not authorized to delete this post');
      } else {
        console.error('Failed to delete post:', error);
        setError('Failed to delete post');
        toast.error('Failed to delete post');
      }
    }
  };

  const deleteComment = async (commentId, postId) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing');
        return;
      }

      const response = await axios.delete(`http://127.0.0.1:4000/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        // Update comments state to remove the deleted comment
        setComments(prevComments => ({
          ...prevComments,
          [postId]: prevComments[postId].filter(comment => comment.commentId !== commentId)
        }));
        toast.success('Comment deleted successfully');
      } else if (response.status === 403 ) {
        toast.error('You are not authorized to delete this comment');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('You are not authorized to delete this comment');
      } else {
        console.error('Failed to delete comment:', error);
        setError('Failed to delete comment');
        toast.error('Failed to delete comment');
      }
    }
  };

  const formikPost = useFormik({
    initialValues: {
      postName: '',
      content: ''
    },
    onSubmit: async (values, { resetForm }) => {
      const token = sessionStorage.getItem('token');
      try {
        if (isEditing) {
          const response = await axios.put(`http://127.0.0.1:4000/post/edit/${editPostId}`, { newContent: values.content }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.status === 200) {
            
            toast.success('Post edited successfully');
          } else if (response.status === 403 ) {
            toast.error('You are not authorized to edit this post');
          } else {
            toast.error('Failed to edit post');
          }
        } else {
          await axios.post(`http://127.0.0.1:4000/post/create/${courseId}`, values, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Post created successfully');
        }

        resetForm();
        setShowPostForm(false); // Hide the form after submitting
        fetchPosts();
        setIsEditing(false);
        setEditPostId(null);

        // Scroll to the edited post
        if (isEditing && postRefs.current[editPostId]) {
          postRefs.current[editPostId].scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error('You are not authorized to edit this post');
        } else {
          console.error('Failed to edit post:', error);
          setError('Failed to edit post');
          toast.error('Failed to edit post');
        }
      }
    }
  });

  const togglePostFormVisibility = () => {
    setShowPostForm(!showPostForm);
    setIsEditing(false);
    setEditPostId(null);
    formikPost.resetForm();
  };

  const startEditing = (postId, content) => {
    setShowPostForm(true);
    setIsEditing(true);
    setEditPostId(postId);
    formikPost.setFieldValue('content', content);
  };

  const toggleCommentFormVisibility = (postId) => {
    setShowCommentForms(prevState => ({ ...prevState, [postId]: !prevState[postId] }));
    if (!showCommentForms[postId]) {
      fetchComments(postId);
    }
  };

  const formikComment = useFormik({
    initialValues: {
      commentBody: '',
      postId: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const token = sessionStorage.getItem('token');
      const postId = values.postId;
  
      try {
        if (editCommentId) {
         const response = await axios.put(
            `http://127.0.0.1:4000/comment/${editCommentId}`,
            { commentBody: values.commentBody },
            { headers: { Authorization: `Bearer ${token}` } }
            
          );
          if(response.data.message === "Comment updated successfully" || response.status === 200 ){
            toast.success('Comment edited successfully');
          }
          else if(response.status === 403) {
            toast.error('You are not authorized to edit this comment');

          }
          else {
            toast.error('Failed to edit comment');
          }
        } else {
          await axios.post(
            `http://127.0.0.1:4000/post/${postId}/addcomment`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Comment added successfully');
        }
  
        resetForm();
        fetchComments(postId);
        setEditCommentId(null); // Reset the edit comment state
        setEditCommentPostId(null);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error('You are not authorized to edit this comment');
        } else {
          console.error('Failed to edit comment:', error);
          setError('Failed to edit comment');
          toast.error('Failed to edit comment');
        }
      }
    }
  });
  const startEditingComment = (commentId, postId, commentBody) => {
    setEditCommentId(commentId);
    setEditCommentPostId(postId);
    formikComment.setFieldValue('commentBody', commentBody);
    formikComment.setFieldValue('postId', postId);
  };
  
  const handleVote = (postId, voteType) => {
    if (voteType === 'upvote') {
      upvotePost(postId);
    } else if (voteType === 'downvote') {
      downvotePost(postId);
    }
  };

  const upvotePost = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://127.0.0.1:4000/upvote/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        fetchVoteCounts(posts); // Refresh vote counts after voting
        toast.success('Upvoted successfully');
      } else if (response.status === 403) {
        toast.error('You are not authorized to upvote this post');
      } else {
        toast.error('Failed to upvote post');
      }
    } catch (error) {
      console.error('Failed to upvote post:', error);
      toast.error('Failed to upvote post');
    }
  };

  const downvotePost = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://127.0.0.1:4000/downvote/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        fetchVoteCounts(posts); // Refresh vote counts after voting
        toast.success('Downvoted successfully');
      } else if (response.status === 403) {
        toast.error('You are not authorized to downvote this post');
      } else {
        toast.error('Failed to downvote post');
      }
    } catch (error) {
      console.error('Failed to downvote post:', error);
      toast.error('Failed to downvote post');
    }
  };

  return (
    
    <div className="bg-gray-50 font-sans sss">
      <div className="xl:container mx-auto backg">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <StudentMaterialSidebar />
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <main className="p-4 md:p-5">
              <div className="bg-white rounded shadow p-6 md:p-7 lg:p-9 formpost">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center cursor-pointer"
                  onClick={togglePostFormVisibility}
                >
                  What's on your mind?
                </h2>

                {showPostForm && (
       <form onSubmit={formikPost.handleSubmit} className="mt-4" ref={formRef}>
        {!isEditing && (
      <>
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
          <select
            id="tag"
            name="tag"
            onChange={formikPost.handleChange}
            onBlur={formikPost.handleBlur}
            value={formikPost.values.tag}
            className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a tag</option>
            <option value="General">General</option>
            <option value="Question">Question</option>
          </select>
          {formikPost.touched.tag && formikPost.errors.tag ? (
            <div className="text-red-500">{formikPost.errors.tag}</div>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="postName" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="postName"
            name="postName"
            type="text"
            onChange={formikPost.handleChange}
            onBlur={formikPost.handleBlur}
            value={formikPost.values.postName}
            className="mt-1 block w-1/2 pl-1 border border-gray-300  shadow-sm"
            required
          />
          {formikPost.touched.postName && formikPost.errors.postName ? (
            <div className="text-red-500">{formikPost.errors.postName}</div>
          ) : null}
        </div>
      </>
    )}
    <div className="mt-4">
      <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
      <textarea
        id="content"
        name="content"
        onChange={formikPost.handleChange}
        onBlur={formikPost.handleBlur}
        value={formikPost.values.content}
        className="mt-1 block w-1/2 pl-1 border border-gray-300 rounded-md shadow-sm"
        required
      />
      {formikPost.touched.content && formikPost.errors.content ? (
        <div className="text-red-500">{formikPost.errors.content}</div>
      ) : null}
    </div>
    <div className="mt-4">
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm postbtn">
        {isEditing ? 'Edit' : 'Post'}
      </button>
    </div>
  </form>
)}

              </div>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.postId} ref={el => (postRefs.current[post.postId] = el)} className="bg-white rounded shadow mt-5 ddjj relative">
                    <h1 className="font-bold text-gray-600 text-center pt-4">{post.userDetails && post.userDetails.firstName} {post.userDetails && post.userDetails.lastName}</h1>  
                    <h1 className="font-bold text-black-500 text-center pt-2 text-xl">{post.tag}</h1>
                      

                    <div className="p-6 md:p-7 lg:p-9">
                      <h1 className="font-bold text-red-500 text-3xl">{post.postName}</h1>
                      <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2">
                        <h2>{post.content} </h2></h3>
                      <div className="mt-3 mb-3 text-sm text-gray-700 flex items-center">
                        {console.log("pa",post)}
                        
                        <span className="ml-1">
                          <div>
                            <i className="fa fa-clock-o"></i>
                            {post.postDate.slice(0, 10) }
                            <br />
                            <i className="fa fa-clock-o"></i>
                            {post.postDate.slice(11, 16)}
                          </div>
                        </span>
                      </div>
                      <div className="text-base md:text-lg text-gray-500">
                        <p className="leading-7 lg:leading-8">{post.excerpt}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className=" bg-gray-200 votingcont text-center">
                          <h1 className="text-sm font-bold text-gray-600">Vote for this post</h1>
                          <div className="flex items-center mt-1 text-center votingmgn ">
                            <button onClick={() => handleVote(post.postId, 'upvote')} className="rounded-full bg-green-200 text-green-500 p-2 mr-2">
                              <i className="fas fa-caret-up"></i>
                            </button>
                            <span>{voteCounts[post.postId]?.upvoteCount || 0}</span>
                            <button onClick={() => handleVote(post.postId, 'downvote')} className="rounded-full bg-red-200 text-red-500 p-2 ml-2">
                              <i className="fas fa-caret-down"></i>
                            </button>
                            <span>{voteCounts[post.postId]?.downvoteCount || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Comment Form */}
                      <button
                        onClick={() => toggleCommentFormVisibility(post.postId)}
                        className="mt-4 inline-block font-bold text-red-500"
                      >
                        <i className="fa fa-commenting"></i> Add Comment
                      </button>

                      {/* Edit Post Button */}
                      <button
                        onClick={() => startEditing(post.postId, post.content)}
                        className="absolute edit-button editbtnj "
                      >
                        Edit Post
                      </button>

                      {/* Delete Post Button */}
                      <button
                        onClick={() => deletePost(post.postId)}
                        className="absolute delete-button "
                      >
                        Delete Post
                      </button>

                      {/* Display Comments */}
                      {showCommentForms[post.postId] && (
                        <>
                          <div className="mt-4">
                            {comments[post.postId] && comments[post.postId].length > 0 ? (
                              <div className="bg-gray-100 p-4 rounded-md w-1/2">
                                {comments[post.postId].map((comment) => (
                                  <div key={comment.commentId} className="mb-4">
                                    <div className="flex items-start">
                                      <div className="mr-3">
                                        <i className="fa fa-user-circle text-2xl text-gray-500"></i>
                                      </div>
                                      <div>
                                      <div className="font-bold text-gray-600">{comment.userDetails.firstName} {comment.userDetails.lastName}</div>                                        <div className="text-sm text-gray-500">
                                          <i className="fa fa-clock-o"></i> {comment.commentDate.slice(0, 10)}
                                          <br />
                                          <i className="fa fa-clock-o"></i> {comment.commentDate.slice(11, 16)}
                                        </div>
                                        <div className="text-gray-700 mt-1">
                                          {comment.commentBody}
                                        </div>
                                        <button
                                          onClick={() => startEditingComment(comment.commentId, post.postId, comment.commentBody)}
                                          className="text-blue-500 mt-1"
                                        >
                                          <i className="fa fa-pencil"></i> Edit
                                        </button>
                                        <button
                                          onClick={() => deleteComment(comment.commentId, post.postId)}
                                          className="text-red-500 mt-1"
                                        >
                                          <i className="fa fa-trash"></i> Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500">No comments yet.</div>
                            )}
                          </div>

                          {/* Comment Form */}
                          <form
                            onSubmit={(event) => {
                              formikComment.setFieldValue('postId', post.postId);
                              formikComment.handleSubmit(event);
                            }}
                            className="mt-4 w-1/2"
                          >
                            <input type="hidden" name="postId" value={post.postId} />
                            <div className="mt-4">
                              <label htmlFor={`commentBody-${post.postId}`} className="block text-sm font-medium text-gray-700">Your Comment</label>
                              <textarea
                                id={`commentBody-${post.postId}`}
                                name="commentBody"
                                onChange={formikComment.handleChange}
                                onBlur={formikComment.handleBlur}
                                value={formikComment.values.commentBody}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-1"
                              />
                              {formikComment.touched.commentBody && formikComment.errors.commentBody ? (
                                <div className="text-red-500">{formikComment.errors.commentBody}</div>
                              ) : null}
                            </div>
                            <div className="mt-4">
                              <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded-md shadow-sm">
                                <i className="fa fa-paper-plane"></i> Add Comment
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-black'></div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;