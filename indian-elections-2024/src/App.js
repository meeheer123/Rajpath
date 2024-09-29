import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ElectionPage from './pages/ElectionPage';
import ResultPage from './pages/FinalResultPage';
import VoterDetailsForm from './pages/VoterDetailsForm.js';
import MatchingVotersPage from './pages/MatchingVotersPage.js';
import About from './pages/About.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-orange-500">Indian Elections 2024</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="border-orange-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    About
                  </Link>
                  <Link to="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
        <Route path="/" element={<ElectionPage />} />
        <Route path="/getDetails" element={<VoterDetailsForm />} />
        <Route path="/matching-voters" element={<MatchingVotersPage />} />
        <Route path="/voting-booth" element={<ResultPage />} />
        <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;