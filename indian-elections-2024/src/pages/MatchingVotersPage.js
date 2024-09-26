import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const MatchingVotersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchingVoters, district, constituency } = location.state || {};

  const handleVoterClick = (voter) => {
    navigate('/voting-booth', {
      state: { name: voter.name, voterId: voter.voter_id, district, constituency }
    });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaUser className="text-orange-500 mr-2" />
          Matching Voters
        </h1>
        {matchingVoters.length === 0 ? (
          <p className="text-center text-gray-600">No matching voters found.</p>
        ) : (
          <ul className="space-y-4">
            {matchingVoters.map((voter) => (
              <li key={voter.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
                <button
                  onClick={() => handleVoterClick(voter)}
                  className="w-full text-left"
                >
                  <p className="font-semibold">{voter.name}</p>
                  <p className="text-sm text-gray-600">Age: {voter.age} | Gender: {voter.gender}</p>
                  <p className="text-sm text-gray-600">Voter ID: {voter.voter_id}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MatchingVotersPage;