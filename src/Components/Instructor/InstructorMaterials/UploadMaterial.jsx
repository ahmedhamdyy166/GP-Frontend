import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './UploadMaterial.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import InstructormaterialSidebar from './InstructormaterialSidebar';

const UploadMaterial = () => {
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const { courseId } = useParams();

  const formik = useFormik({
    initialValues: {
      materialName: '',
      materialDesc: '',
      courseId: courseId,
      file: null,
    },
    validationSchema: Yup.object({
      materialName: Yup.string().required('Title is required'),
      materialDesc: Yup.string().required('Description is required'),
      file: Yup.mixed().required('A file is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append('materialName', values.materialName);
      formData.append('materialDesc', values.materialDesc);
      formData.append('courseId', courseId);
      formData.append('file', values.file);

      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:4000/material/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Ensure correct content type for FormData
          },
        });
        console.log('File uploaded successfully:', response.data);
        setUploadStatus({ success: true, message: 'File uploaded successfully!' });
        resetForm();
        setSelectedFileName('');
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus({ success: false, message: 'Error uploading file. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileSelect = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('file', file);
    setSelectedFileName(file.name); // Set selected file name
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center takee">
      <InstructormaterialSidebar /> 
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10 designing">
        <div className="text-center">
          <h2 className="mt-5 text-3xl font-bold text-gray-900">File Upload!</h2>
        </div>
        {uploadStatus && (
          <div
            className={`text-center mb-4 p-2 rounded ${uploadStatus.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            role="alert"
          >
            {uploadStatus.message}
          </div>
        )}
        <form className="mt-8 space-y-3" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 space-y-2">
            <label htmlFor="materialName" className="text-sm font-bold text-gray-500 tracking-wide">Title</label>
            <input
              id="materialName"
              className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              type="text"
              name="materialName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.materialName}
              placeholder="Title"
              aria-describedby="materialNameError"
              aria-invalid={formik.touched.materialName && formik.errors.materialName ? "true" : "false"}
            />
            {formik.touched.materialName && formik.errors.materialName ? (
              <div id="materialNameError" className="text-red-500 text-sm">{formik.errors.materialName}</div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 space-y-2">
            <label htmlFor="materialDesc" className="text-sm font-bold text-gray-500 tracking-wide">Description</label>
            <textarea
              id="materialDesc"
              className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              name="materialDesc"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.materialDesc}
              placeholder="Description"
              aria-describedby="materialDescError"
              aria-invalid={formik.touched.materialDesc && formik.errors.materialDesc ? "true" : "false"}
            />
            {formik.touched.materialDesc && formik.errors.materialDesc ? (
              <div id="materialDescError" className="text-red-500 text-sm">{formik.errors.materialDesc}</div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 space-y-2">
            <label htmlFor="courseId" className="text-sm font-bold text-gray-500 tracking-wide">Course ID</label>
            <input
              id="courseId"
              className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              type="text"
              name="courseId"
              disabled
              value={courseId}
              placeholder="Course ID"
            />
          </div>
          <div className="grid grid-cols-1 space-y-2">
            <label htmlFor="file" className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                    <img
                      className="has-mask h-36 object-center"
                      src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                      alt="Upload"
                    />
                  </div>
                  <p className="pointer-none text-gray-500">
                    {selectedFileName ? (
                      <span>{selectedFileName}</span>
                    ) : (
                      <span>
                        
                        <a href="#" className="text-blue-600 hover:underline ddd" onClick={handleFileSelect}>
                          select a file
                        </a>{' '}
                        from your computer
                      </span>
                    )}
                  </p>
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  name="file"
                  onChange={handleFileChange}
                  aria-describedby="fileError"
                  aria-invalid={formik.touched.file && formik.errors.file ? "true" : "false"}
                />
              </label>
            </div>
            {formik.touched.file && formik.errors.file ? (
              <div id="fileError" className="text-red-500 text-sm">{formik.errors.file}</div>
            ) : null}
          </div>
          <p className="text-sm text-gray-300">
            <span>File type: doc, pdf, types of images</span>
          </p>
          <div className='uploadMaterialdiv'>
            <button
              type="submit"
              className="bg-black text-black my-5 uploadMaterialBtn rounded"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;
