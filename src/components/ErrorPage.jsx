import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-xl mb-2">Something went wrong</p>
        
        <div className="text-gray-600 mb-6">
          <p>{error?.statusText || error?.message || "An unexpected error occurred"}</p>
          {error?.status && <p className="mt-2 font-semibold">Status: {error.status}</p>}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={goBack} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
          <Link 
            to="/" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 