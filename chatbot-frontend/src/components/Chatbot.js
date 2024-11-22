import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);  // Added state for dark mode
  const chatLogRef = useRef(null);

  useEffect(() => {
    // Show a welcome message when the chatbot loads
    setChatLog([
      {
        sender: "bot",
        message: "Hi there! I'm your virtual assistant. How can I help you today? 😊",
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the latest message
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { sender: "user", message: userInput },
      ]);

      const input = userInput;
      setUserInput("");

      setIsTyping(true); // Show typing indicator
      try {
        const response = await axios.post("http://localhost:5000/chat", {
          query: input,
        });

        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { sender: "bot", message: response.data.response },
        ]);
      } catch (error) {
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { sender: "bot", message: "Sorry, I couldn't process your request." },
        ]);
      } finally {
        setIsTyping(false); // Hide typing indicator
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission behavior
      handleSendMessage();
    }
  };

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`chatbot-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div className="bot-info">
          <h3>Virtual Assistant</h3>
          <p>How can I help you?</p>
        </div>
        {/* Dark mode toggle button */}
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="chat-log" ref={chatLogRef}>
        {chatLog.map((entry, index) => (
          <div
            key={index}
            className={`message ${
              entry.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {entry.message}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress}  // Listen for Enter key
        />
        <button onClick={handleSendMessage}>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
