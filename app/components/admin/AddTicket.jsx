"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

const AddTicket = () => {
  const [ticket, setTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    let role = "";
    if (currentUser?.role === "Moderator") {
      role = "moderator";
    } else {
      role = "user";
    }
    const newMessage = {
      sender: currentUser?._id,
      role: role,
      message: chatMessage.trim(),
      sentAt: new Date(),
    };

    try {
      await axios.post(
        `${API_URL}tickets`,
        { messages: [newMessage] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Message sent");
      setChatMessage("");
      getTicket();
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="chat-container">
      <h3>Support Ticket Chat</h3>
      {loading && <div>Loading...</div>}
      <div
        style={{
          maxHeight: 350,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 16,
          marginBottom: 16,
        }}
      >
        {ticket?.messages?.length ? (
          ticket.messages.map((msg) => (
            <div key={msg._id} style={{ marginBottom: 12 }}>
              <b>{msg.role === "user" ? "User" : "Moderator"}:</b> {msg.message}
              <br />
              <small style={{ color: "#888" }}>
                {msg.sentAt
                  ? new Date(msg.sentAt).toLocaleString()
                  : "Just now"}
              </small>
            </div>
          ))
        ) : (
          <div>No messages yet.</div>
        )}
      </div>
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="button"
          onClick={sendChatMessage}
          disabled={loading || !chatMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AddTicket;
