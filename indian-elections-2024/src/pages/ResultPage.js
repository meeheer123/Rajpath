import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaVoteYea, FaMapMarkerAlt, FaLandmark } from 'react-icons/fa';

function ResultPage() {
  const location = useLocation();
  const { district, constituency } = location.state || {};

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaVoteYea className="text-orange-500 mr-2" />
          Election Information
        </h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <span className="font-medium">District:</span>
            <span className="ml-2">{district || 'Not selected'}</span>
          </div>
          <div className="flex items-center">
            <FaLandmark className="text-blue-600 mr-2" />
            <span className="font-medium">Assembly Constituency:</span>
            <span className="ml-2">{constituency || 'Not selected'}</span>
          </div>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="block w-full text-center bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Back to Selection
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;