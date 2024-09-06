import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, VolumeX, Volume2, Loader, Clock, MessageCircle, KeyRound } from 'lucide-react';
import { RingLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import AnalystPopup from './AnalystPopup';
import GeneralAnalystPopup from './GeneralAnalystPopup';

// Demo App Note
const DemoAppNote = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md shadow-md">
    <p className="font-bold text-lg">Demo Application Notice</p>
    <p className="text-base">
      This is a UI Framework deployed directly from my public GitHub repo: <a href="https://github.com/amararun/vtexer-shared" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://github.com/amararun/vtexer-shared</a>. For sharing purposes, I've made adjustments to the app by disconnecting it from my live Make.com workflow and replacing the individual ReAct agents with a single ReAct agent. Additionally, the app is no longer connected to live data sources or databases. To restore full functionality, you'll need to reintegrate the specific ReAct agents, connect to a live Make.com workflow with the correct data sources, and set up the Analyzer Text-to-SQL App. All the necessary steps are covered in detail in my implementation videos, with links provided in the GitHub repo.
    </p>
  </div>
);

const IconButton = ({ onClick, disabled, icon: Icon, size = 'h-12 w-12', className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full transition-all duration-300 flex items-center justify-center ${size} ${className} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
    }`}
  >
    <Icon className="text-white" size={24} />
  </button>
);

const Input = ({ type, placeholder, value, onChange, className }) => (
  <div className="relative">
    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-full px-10 py-2 w-full ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
    />
  </div>
);

const ListeningPopup = ({ onStop }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
    <div className="bg-white p-16 rounded-lg shadow-xl flex flex-col items-center animate-fade-in" style={{ minWidth: '400px', minHeight: '400px' }}>
      <RingLoader color="#4A90E2" size={240} />
      <p className="mt-8 text-2xl font-semibold text-gray-800">Listening...</p>
      <IconButton onClick={onStop} icon={StopCircle} className="mt-8 bg-red-500 hover:bg-red-600" size="h-24 w-24" />
    </div>
  </div>
);

const HeadlineBox = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error("Failed to load the AmarFx logo");
    setImageError(true);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-6xl font-extrabold text-white mb-2">VTEXER</h1>
        <h2 className="text-3xl text-white mb-2">Beyond Chat: Your Task Execution & Research Powerhouse.</h2>
        <p className="text-lg text-white">Command. Automate. Research. | LLM ReAct [Reasoning & Action] Agents</p>
      </div>

      <div className="text-right flex items-center p-4 bg-opacity-20 border border-white border-opacity-30 rounded-lg shadow-lg">
        {!imageError ? (
          <img
            src={process.env.PUBLIC_URL + '/amarFxLogoNobg.png'}
            alt="AmarFx Logo"
            className="h-14 w-auto object-contain mr-4"
            onError={handleImageError}
          />
        ) : (
          <div className="h-14 w-14 bg-gray-300 flex items-center justify-center text-gray-500 mr-4">
            Logo
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-200">Amar Harolikar</h3>
          <p className="text-md text-gray-300">Specialist</p>
          <p className="text-md text-gray-300">Applied Gen AI for Analytics, Data Science & Business</p>
        </div>
      </div>
    </div>
  );
};

const ScrollableBox = ({ title, content, className }) => (
  <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl border border-white border-opacity-20 overflow-hidden p-4 ${className}`}>
    <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
    <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '300px' }}>
      {content}
    </div>
  </div>
);

const AnalystButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
  >
    {children}
  </button>
);

const speechToText = async (audioBlob, apiKey) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.mp3');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error in speech to text:', error);
    return 'Error in transcription. Please try again.';
  }
};

const getChatCompletion = async (message) => {
  const API_URL = "https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae";
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = {
    "question": message
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || data.message || 'No response from the API';
  } catch (error) {
    console.error('Error in chat completion:', error);
    return 'Error in processing. Please try again.';
  }
};

const getSearchResults = async (question) => {
  const API_URL = "https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae";
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = {
    "question": question
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const mainContent = data.text;

    const sections = mainContent.split(/(?=##\s)/);

    let formattedResults = sections.map(section => {
      const lines = section.split('\n');
      const header = lines[0].replace(/##\s*/, '').trim();
      const paragraph = lines.slice(1).join('\n').trim();
      return { header, paragraph };
    });

    if (formattedResults.length === 0) {
      formattedResults = [{
        header: "Search Result",
        paragraph: mainContent
      }];
    }

    return formattedResults;
  } catch (error) {
    console.error('Error in getting search results:', error);
    return [];
  }
};

const getToolInfo = async (question) => {
  const API_URL = "https://flowise.tigzig.com/api/v1/prediction/e25f7265-8e75-4e34-9566-bcd345f334ae";
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = {
    "question": question
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const mainContent = data.text;

    const sections = mainContent.split(/(?=##\s)/);

    let formattedResults = sections.map(section => {
      const lines = section.split('\n');
      const header = lines[0].replace(/##\s*/, '').trim();
      const paragraph = lines.slice(1).join('\n').trim();
      return { header, paragraph };
    });

    if (formattedResults.length === 0) {
      formattedResults = [{
        header: "About This Tool",
        paragraph: mainContent
      }];
    }

    return formattedResults;
  } catch (error) {
    console.error('Error in getting tool info:', error);
    return [];
  }
};

const textToSpeech = async (text, apiKey) => {
  const url = "https://api.openai.com/v1/audio/speech";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
  const payload = {
    "model": "tts-1",
    "input": text,
    "voice": "alloy"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error in text to speech:', error);
    return null;
  }
};

const SimpleVoiceBot = () => {
  const [apiKey, setApiKey] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [toolInfo, setToolInfo] = useState([]);
  const [activeAnalyst, setActiveAnalyst] = useState(null);
  const [isGeneralAnalystOpen, setIsGeneralAnalystOpen] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    currentAudioRef.onended = () => setIsPlaying(false);
    return () => {
      currentAudioRef.pause();
      currentAudioRef.src = '';
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = processAudio;
        mediaRecorder.current.start();
      })
      .catch(err => {
        console.error("Error accessing the microphone:", err);
        alert("Unable to access the microphone. Please check your browser settings.");
        setIsListening(false);
      });
  };

  const stopListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });

    const transcriptionStartTime = performance.now();
    const transcription = await speechToText(audioBlob, apiKey);
    const transcriptionEndTime = performance.now();
    const transcriptionTime = transcriptionEndTime - transcriptionStartTime;

    const chatStartTime = performance.now();
    const response = await getChatCompletion(transcription);
    const chatEndTime = performance.now();
    const chatTime = chatEndTime - chatStartTime;

    const audioStartTime = performance.now();
    const audioUrl = await textToSpeech(response, apiKey);
    const audioEndTime = performance.now();
    const audioTime = audioEndTime - audioStartTime;

    setConversation(prev => [{
      role: 'user',
      content: transcription,
      transcriptionTime
    }, {
      role: 'assistant',
      content: response,
      audioUrl,
      chatTime,
      audioTime
    }, ...prev]);

    // Start all three actions concurrently
    const [searchResultsData, toolInfoData] = await Promise.all([
      getSearchResults(transcription),
      getToolInfo(transcription),
      playAudio(audioUrl)
    ]);

    setIsProcessing(false);
    audioChunks.current = [];

    setSearchResults(searchResultsData);
    setToolInfo(toolInfoData);
  };

  const playAudio = (audioUrl) => {
    if (isPlaying) {
      audioRef.current.pause();
    }
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    // Return a promise that resolves immediately
    return Promise.resolve();
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const formatTime = (ms) => {
    if (ms < 1000) {
      return `${ms.toFixed(0)} ms`;
    } else {
      return `${(ms / 1000).toFixed(2)} s`;
    }
  };

  const handleAnalystClick = (analystId) => {
    console.log('Setting active analyst to:', analystId);
    setActiveAnalyst(analystId);
  };

  const handleGeneralAnalystClick = () => {
    console.log('Opening General Analyst');
    setIsGeneralAnalystOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 text-white py-12 px-4 sm:px-6 lg:px-8 animate-gradient-x">
      <div className="max-w-7xl mx-auto">
        <HeadlineBox />
        <DemoAppNote />
        
        {/* Analyst Team Section */}
        <div className="mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">ANALYST TEAM</h3>
            <div className="flex space-x-4">
              <AnalystButton onClick={() => handleAnalystClick('e25f7265-8e75-4e34-9566-bcd345f334ae')}>
                Data-SQL Analyst
              </AnalystButton>
              <AnalystButton onClick={() => handleAnalystClick('e25f7265-8e75-4e34-9566-bcd345f334ae')}>
                Document-PDF Analyst
              </AnalystButton>
              <AnalystButton onClick={handleGeneralAnalystClick}>
                General Analyst
              </AnalystButton>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Main content - Voice Bot */}
          <div className="w-full md:w-1/3">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-6 bg-gray-800 text-white placeholder-gray-500 border-gray-700"
            />
            <div className="flex justify-center mb-8 space-x-4">
              <IconButton
                onClick={startListening}
                disabled={!apiKey || isProcessing || isListening}
                icon={Mic}
                size="h-48 w-48"
                className="bg-blue-500 hover:bg-blue-600 shadow-lg"
              />
              {isPlaying && (
                <IconButton
                  onClick={stopAudio}
                  icon={VolumeX}
                  size="h-16 w-16"
                  className="bg-red-500 hover:bg-red-600"
                />
              )}
            </div>
            {isProcessing && (
              <div className="text-center text-gray-300 mb-6 flex items-center justify-center">
                <Loader className="animate-spin mr-2 h-5 w-5" />
                Processing your request...
              </div>
            )}
            {isListening && <ListeningPopup onStop={stopListening} />}
            <div className="space-y-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              {conversation.map((message, index) => (
                <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-blue-500 bg-opacity-20' : 'bg-purple-500 bg-opacity-20'} backdrop-filter backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                      {message.role === 'user' ? <Mic className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{message.role === 'user' ? 'You' : 'Assistant'}</p>
                      <p className="mt-1 text-sm">{message.content}</p>
                      {message.role === 'user' && (
                        <p className="text-xs text-gray-400 mt-1">
                          <Clock className="inline mr-1 h-3 w-3" />
                          Transcription: {formatTime(message.transcriptionTime)}
                        </p>
                      )}
                      {message.role === 'assistant' && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">
                            <Clock className="inline mr-1 h-3 w-3" />
                            Chat: {formatTime(message.chatTime)}
                          </p>
                          {message.audioUrl && (
                            <div className="mt-1">
                              <button onClick={() => playAudio(message.audioUrl)} className="text-blue-300 hover:text-blue-100 transition-colors duration-200">
                                <Volume2 className="inline mr-1 h-4 w-4" /> Play Audio
                              </button>
                              <span className="ml-2 text-xs text-gray-400">
                                <Clock className="inline mr-1 h-3 w-3" />
                                Audio: {formatTime(message.audioTime)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - About and Search Results */}
          <div className="w-full md:w-2/3 space-y-8">
            <ScrollableBox
              title="About"
              className="bg-blue-50"
              content={
                toolInfo.length > 0 ? (
                  <ul className="space-y-4">
                    {toolInfo.map((info, index) => (
                      <li key={index} className="bg-white bg-opacity-70 p-3 rounded-lg">
                        <h4 className="font-medium text-lg text-gray-800">{info.header}</h4>
                        <div className="text-sm mt-1 whitespace-pre-wrap markdown-content text-gray-600">
                          <ReactMarkdown>{info.paragraph}</ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Loading tool information...</p>
                )
              }
            />
            <ScrollableBox
              title="Alternatives To"
              className="bg-purple-50"
              content={
                searchResults.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResults.map((result, index) => (
                      <li key={index} className="bg-white bg-opacity-70 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-800">{result.header}</h4>
                        <div className="text-sm mt-1 whitespace-pre-wrap text-gray-600">
                          <ReactMarkdown>{result.paragraph}</ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No results found. (Results array length: {searchResults.length})</p>
                )
              }
            />
          </div>
        </div>
      </div>
      
      {/* Chat Popup */}
      <AnalystPopup
        isOpen={activeAnalyst !== null}
        onClose={() => setActiveAnalyst(null)}
        analyst={activeAnalyst}
      />
      <GeneralAnalystPopup
        isOpen={isGeneralAnalystOpen}
        onClose={() => setIsGeneralAnalystOpen(false)}
      />
    </div>
  );
};

export default SimpleVoiceBot;