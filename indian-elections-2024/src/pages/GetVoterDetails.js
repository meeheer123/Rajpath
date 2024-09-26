import React, { useState } from 'react';
import { FaUser, FaIdCard, FaVoteYea } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const VoterDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate
  const [name, setName] = useState('');
  const { district, constituency } = location.state || {};
  const [voterId, setVoterId] = useState('');
  const [errors, setErrors] = useState({ name: '', voterId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim() && !voterId.trim()) {
      newErrors.name = 'Either Name or Voter ID is required';
      newErrors.voterId = 'Either Name or Voter ID is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, navigate to the results page
      console.log(district, constituency);
      console.log('Form submitted:', { name, voterId });



      // Redirect to the result page and pass necessary state
      navigate('/result', {
        state: { name, voterId, district, constituency },
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaVoteYea className="text-orange-500 mr-2" />
          Submit Voter Details
        </h1>

        {Object.values(errors).some(err => err) && (
          <p className="text-red-500 text-center mb-4">Please fix the errors below.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaUser className="text-gray-500 mr-2" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={voterId.trim() !== ''}
              className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border-2 ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name}</p>
            )}
          </div>

          <div className="flex items-center justify-center my-4 mt-7">
            <div className="w-full border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500">OR</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div>
            <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaIdCard className="text-gray-500 mr-2" />
              Voter ID
            </label>
            <input
              type="text"
              id="voterId"
              name="voterId"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              disabled={name.trim() !== ''}
              className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border-2 ${
                errors.voterId ? 'border-red-500' : ''
              }`}
              placeholder="Enter your Voter ID"
            />
            {errors.voterId && (
              <p className="text-red-500 text-sm mt-2">{errors.voterId}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim() && !voterId.trim()}
            className={`w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform ${
              (!name.trim() && !voterId.trim())
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-orange-600 hover:to-orange-800 hover:-translate-y-1 hover:scale-105'
            }`}
          >
            Submit
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Exercise your right to vote!</p>
          <div className="flex justify-center space-x-2 mt-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDetailsForm;
