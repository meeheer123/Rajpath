import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';

const ResultPage = () => {
  const location = useLocation();
  const { name, voterId, district, constituency } = location.state || {};

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaThumbsUp className="text-green-500 mr-2" />
          Thank You for Voting!
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          We appreciate your participation in the electoral process. Here are your details:
        </p>
        <div className="space-y-2">
          <p className="text-gray-800 font-semibold">Name: {name || 'N/A'}</p>
          <p className="text-gray-800 font-semibold">Voter ID: {voterId || 'N/A'}</p>
          <p className="text-gray-800 font-semibold">District: {district}</p>
          <p className="text-gray-800 font-semibold">Constituency: {constituency}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
