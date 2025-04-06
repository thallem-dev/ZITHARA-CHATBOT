import React, { useState } from "react";
import "./ChatPage.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const faqs = JSON.parse(localStorage.getItem("faqs")) || [];
      const matched = faqs.find((faq) =>
        input.toLowerCase().includes(faq.question.toLowerCase())
      );

      const botMsg = {
        sender: "bot",
        text: matched
          ? matched.answer
          : "I'm sorry, I don't have an answer to that yet.",
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing">AI is typing...</div>}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
