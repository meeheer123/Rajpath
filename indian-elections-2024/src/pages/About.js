import React from 'react';
import { FaInfoCircle, FaMapMarkedAlt, FaVoteYea } from 'react-icons/fa';

function AboutPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaInfoCircle className="text-blue-500 mr-2 text-2xl" />
          About Election Navigator
        </h1>
        
        <div className="space-y-4 text-gray-700 text-center">
          <p className="text-lg">
            Election Navigator is a one-stop platform to help voters easily navigate the upcoming Indian Elections 2024.
          </p>
          
          <p className="text-md">
            With the app, you can:
          </p>
          
          <ul className="list-disc list-inside text-left space-y-2">
            <li className="flex items-center">
              <FaMapMarkedAlt className="text-green-500 mr-2 text-xl" />
              Get your Polling Booth details in a few clicks
            </li>
            <li className="flex items-center">
              <FaVoteYea className="text-orange-500 mr-2 text-xl" />
              Just enter district, constituency, and voter ID to locate your destination
            </li>
          </ul>

          <p className="text-md">
            Our mission is to empower voters by providing accurate and accessible election information.
          </p>

          <div className="mt-8 text-sm text-gray-600">
            <p>Let your voice be heard. Make informed decisions. Every vote counts!</p>
            <div className="flex justify-center items-center space-x-2 mt-4">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
