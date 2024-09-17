import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVoteYea, FaMapMarkerAlt, FaLandmark } from 'react-icons/fa';

function ElectionPage() {
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/districts');
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();
      setDistricts(data);
    } catch (err) {
      setError('Error fetching districts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConstituencies = async (districtId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/constituencies?district=${districtId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch constituencies');
      }
      const data = await response.json();
      setConstituencies(data);
    } catch (err) {
      setError('Error fetching constituencies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedConstituency('');
    if (value) {
      fetchConstituencies(value);
    } else {
      setConstituencies([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDistrict && selectedConstituency) {
      navigate('/getDetails', { 
        state: { 
          district: districts.find(d => d.id === selectedDistrict)?.name,
          constituency: constituencies.find(c => c.id === selectedConstituency)?.name
        } 
      });
    } else {
      setError('Please select both a district and a constituency.');
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <FaVoteYea className="text-orange-500 mr-2" />
          Indian Elections 2024
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaMapMarkerAlt className="text-green-600 mr-2" />
              District
            </label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border-2"
              disabled={isLoading}
            >
              <option value="">Select your district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaLandmark className="text-blue-600 mr-2" />
              Assembly Constituency
            </label>
            <select
              id="constituency"
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              disabled={!selectedDistrict || isLoading}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border-2"
            >
              <option value="">Select your assembly constituency</option>
              {constituencies.map((constituency) => (
                <option key={constituency.id} value={constituency.id}>
                  {constituency.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50"
            disabled={isLoading || !selectedDistrict || !selectedConstituency}
          >
            {isLoading ? 'Loading...' : 'Submit'}
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
}

export default ElectionPage;