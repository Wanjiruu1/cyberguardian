import React, { useState } from "react";
import axios from "axios";

// Chatbot page for chatting with the AI
function Chatbot() {
  const [ageGroup, setAgeGroup] = useState("10-13");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { sender: 'user' | 'bot', text: string }
  const [loading, setLoading] = useState(false);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: userMsg,
        age_group: ageGroup,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply || "Sorry, I couldn't answer that.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't answer that." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Chatbot</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Age Group: </label>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="7-9">7-9</option>
          <option value="10-13">10-13</option>
          <option value="14-17">14-17</option>
        </select>
      </div>
      <div
        style={{
          minHeight: 200,
          background: "#f9f9f9",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#d1e7ff" : "#e2e2e2",
              color: "#222",
              padding: "0.5rem 1rem",
              borderRadius: 16,
              maxWidth: "80%",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>Thinking...</div>}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          style={{ flex: 1, padding: "0.5rem" }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ padding: "0.5rem 1rem" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
