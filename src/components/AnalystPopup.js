import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const getAnalystTitle = (analyst) => {
  switch (analyst) {
    case 'e25f7265-8e75-4e34-9566-bcd345f334ae':
      return 'Quick Reaction Analyst';
    case 'e25f7265-8e75-4e34-9566-bcd345f334ae':
      return 'Document Analyst';
    case 'e25f7265-8e75-4e34-9566-bcd345f334ae':
      return 'Data Analyst';
    case 'e25f7265-8e75-4e34-9566-bcd345f334ae':
      return 'Document-PDF Analyst';
    default:
      return 'Analyst';
  }
};

const AnalystPopup = ({ isOpen, onClose, analyst }) => {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    console.log('Current analyst ID:', analyst);
    if (analyst === 'e25f7265-8e75-4e34-9566-bcd345f334ae') {
      setEmbedUrl('https://flowise.tigzig.com/chatbot/e25f7265-8e75-4e34-9566-bcd345f334ae');
    } else if (analyst === '1406178f-b47c-4c35-a3a0-5738c01f9a24') {
      setEmbedUrl('https://flowise.tigzig.com/chatbot/e25f7265-8e75-4e34-9566-bcd345f334ae');
    } else {
      setEmbedUrl(`https://flowise.tigzig.com/chatbot/${analyst}`);
    }
  }, [analyst]);

  // Log the current embedUrl whenever it changes
  useEffect(() => {
    console.log('Current embedUrl:', embedUrl);
  }, [embedUrl]);

  if (!isOpen) return null;

  const analystTitle = getAnalystTitle(analyst);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{analystTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full h-full border-0"
            title={`${analystTitle} Chat`}
          ></iframe>
        </div>
        {/* Updated button with console log */}
        <button
          onClick={() => {
            console.log('Opening URL:', embedUrl);
            window.open(embedUrl, '_blank');
          }}
          className="mt-4 text-blue-500 hover:text-blue-700"
        >
          Open in Full Page
        </button>
      </div>
    </div>
  );
};

export default AnalystPopup;