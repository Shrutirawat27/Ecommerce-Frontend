import React, { useState, useRef } from 'react';
import { getBaseUrl } from '../../utils/baseURL';

const TestUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!file) {
      setError('Please select a file to upload');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('testImage', file);
      
      console.log('Submitting test upload:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? 
          `[File: ${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes]` : 
          pair[1]);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${getBaseUrl()}/api/user/test-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('Upload result:', data);
      
      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error during test upload:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">File Upload Test</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          <p>File uploaded successfully!</p>
          <p className="mt-2"><strong>Path:</strong> {result.relativePath}</p>
          <p className="mt-1"><strong>URL:</strong> {result.fullUrl}</p>
          {result.fullUrl && (
            <div className="mt-3">
              <p className="mb-2"><strong>Image preview:</strong></p>
              <img 
                src={result.fullUrl} 
                alt="Uploaded file" 
                className="max-w-full h-auto rounded-md border"
              />
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Image:</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        {file && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Selected file:</p>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.type} • {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Test Upload'}
        </button>
      </form>
    </div>
  );
};

export default TestUpload; 