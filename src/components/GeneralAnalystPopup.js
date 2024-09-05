import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ArrowUpRight } from 'lucide-react';

const options = [
  { label: 'Fast', value: 'fast', description: 'Groq with Llama3-70b - Simple Chat', url: 'https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae' },
  { label: 'Good', value: 'good', description: 'gpt-4o-mini- ReAct Agent with Perplexity Search Tool', url: 'https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae' },
  { label: 'Best - OpenAI', value: 'best-openai', description: 'gpt-4o-2024-08-06 - ReAct Agent with Perplexity Search Tool', url: 'https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae' },
  { label: 'Best - Anthropic', value: 'best-anthropic', description: 'claude-sonnet-3.5 - ReAct Agent with Perplexity Search Tool', url: 'https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae' },
];

const GeneralAnalystPopup = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);
  const [isFullPage, setIsFullPage] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Generate a new session ID when the component mounts
    setSessionId(generateSessionId());
  }, []);

  const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleOptionChange = (e) => {
    const selected = options.find(option => option.value === e.target.value);
    setSelectedOption(selected);
    setMessages([]);
    // Generate a new session ID when changing options
    setSessionId(generateSessionId());
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch(selectedOption.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: inputMessage,
          overrideConfig: {
            sessionId: sessionId
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.text || data.message || 'No response from the API' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Error: Unable to get a response. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleFullPage = () => {
    setIsFullPage(!isFullPage);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setMessages([]);
    setSessionId(generateSessionId());
  };

  if (!isOpen) return null;

  const popupClass = isFullPage 
    ? "fixed inset-0 bg-white z-50 overflow-auto"
    : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const contentClass = isFullPage
    ? "p-6 w-full h-full flex flex-col"
    : "bg-white rounded-lg p-6 w-3/4 max-w-4xl h-5/6 flex flex-col";

  return (
    <div className={popupClass}>
      <div className={contentClass}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">General Analyst</h2>
          <div className="flex items-center">
            <button onClick={toggleFullPage} className="mr-2 text-blue-500 hover:text-blue-700">
              {isFullPage ? 'Exit Full Page' : 'Full Page'}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="mb-4 relative">
          <div
            className="w-full p-2 border rounded text-gray-700 bg-white cursor-pointer flex justify-between items-center"
            onClick={toggleDropdown}
          >
            <span>{selectedOption.label}</span>
            <ChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="text-gray-800">{option.label}</span>
                  <span className="text-gray-500 text-sm">{option.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 p-4 border rounded">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l text-gray-800 placeholder-gray-400"
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralAnalystPopup;