import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiError, setApiError] = useState(null);
  const [selectedBot, setSelectedBot] = useState('huggingFace'); 

  useEffect(() => {
    setMessages([{ text: 'Hello! How can I help you?', sender: 'bot' }]);
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleBotSelectChange = (e) => {
    setSelectedBot(e.target.value);
  };

  const handleApiSubmit = () => {
    console.log('API Key submitted:', apiKey);
    // Perform actions based on selected bot
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || apiKey.trim() === '') return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chatbot/', {
        message: input,
        api_key: apiKey, 
        bot_type: selectedBot, 
      });

      setMessages([...messages, { text: response.data.message, sender: 'bot' }]);
      setApiError(null); 
    } catch (error) {
      console.error('Error sending message to chatbot:', error);

      if (error.response && error.response.status === 401) {
        setApiError('Invalid API Key. Please check and try again.');
      } else {
        setApiError('Error communicating with the server or Invalid API Key. Please check and try again.');
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="api-key-container">
        {selectedBot === 'huggingFace' ? (
          <>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter Hugging Face API Key..."
            />
            <button onClick={handleApiSubmit}>Submit</button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter OpenAI API Key..."
            />
            <button onClick={handleApiSubmit}>Submit</button>
          </>
        )}
        {apiError && <div className="api-error">{apiError}</div>}
      </div>
      <div className="bot-select-container">
        <label>Select Bot: </label>
        <select value={selectedBot} onChange={handleBotSelectChange}>
          <option value="huggingFace">Hugging Face</option>
          <option value="mathBot">Math Bot</option>
        </select>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input type="text" value={input} onChange={handleInputChange} placeholder="Type your message..." />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
