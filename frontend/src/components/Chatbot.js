import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiCopy, FiMoon, FiSun } from "react-icons/fi";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const chatContainer = useRef(null);

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const loadingMessage = { type: "bot", text: "..." };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg === loadingMessage
            ? { type: "bot", text: data.reply }
            : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg === loadingMessage
            ? { type: "bot", text: "⚠️ Error connecting to server" }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className={`chat-wrapper ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="chat-header">
        <h2>🤖ChatBot</h2>
        <button
          className="mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      {/* Messages */}
      <div className="chat-container" ref={chatContainer}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            <p className="text">{msg.text}</p>
            {msg.type === "bot" && msg.text !== "..." && (
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(msg.text)}
              >
                <FiCopy />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
