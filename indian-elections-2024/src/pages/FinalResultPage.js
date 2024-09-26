import React, { useState } from "react";
import { FaWhatsapp, FaLink, FaMapMarkedAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

  const VotingBoothCard = () => {
  const location = useLocation()
  const [isCopied, setIsCopied] = useState(false);
  const { name, voterId, district, constituency  } = location.state || {};

  const personName = name;
  const votingBoothAddress = "123 Main St, Anytown, USA 12345";
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1023192748304!2d-73.98731708459415!3d40.75895797932614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635445243242!5m2!1sen!2sus";

  const handleNavigate = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(votingBoothAddress)}`, "_blank");
  };

  const handleShare = () => {
    const shareText = `My voting booth is at: ${votingBoothAddress}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{personName}</h1>
        <p className="text-gray-600 text-sm mb-4">{votingBoothAddress}</p>
      </div>
      <div className="h-64 w-full">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
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