import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaLink, FaMapMarkedAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const VotingBoothCard = () => {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const [boothInfo, setBoothInfo] = useState(null);
  const { name, voterId, district, constituency } = location.state || {};

  useEffect(() => {
    const fetchBoothInfo = async () => {
      try {
        const response = await axios.get('https://rajpathbackend.vercel.app/api/get_polling_booth_by_person_id', {
          params: { person_id: voterId }
        });
        setBoothInfo(response.data);
      } catch (error) {
        console.error('Error fetching polling booth info:', error);
      }
    };

    fetchBoothInfo();
  }, [voterId]);

  const handleNavigate = () => {
    if (boothInfo) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(boothInfo.polling_booth_address)}`, "_blank");
    }
  };

  const handleShare = () => {
    if (boothInfo) {
      const shareText = `My voting booth is at: ${boothInfo.polling_booth_address}`;
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(boothInfo.polling_booth_address)}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!boothInfo) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{name}</h1>
        <p className="text-gray-600 text-sm mb-4">{boothInfo.polling_booth_address}</p>
      </div>
      <div className="h-64 w-full">
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(boothInfo.polling_booth_address)}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        title="Voting Booth Location"
      ></iframe>
      </div>
      <div className="px-6 py-4">
        <button
          onClick={handleNavigate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mb-2 w-full flex items-center justify-center"
        >
          <FaMapMarkedAlt className="mr-2" /> Navigate
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mb-2 w-full flex items-center justify-center"
        >
          <FaWhatsapp className="mr-2" /> Share on WhatsApp
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full flex items-center justify-center"
        >
          <FaLink className="mr-2" /> {isCopied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

export default VotingBoothCard;