"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

const ChatHistory = ({ ticketId }) => {
  const currentUser = localStorage.getItem("user");

  const [ticket, setTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref for auto scroll
  const messagesEndRef = useRef(null);

  const getTicket = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTicket(response.data.user);
    } catch (err) {
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicket();
  }, [ticketId]);

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    const user = JSON.parse(localStorage.getItem("user"));
    let role = "";
    if (user?.role.name === "Moderator") {
      role = "moderator";
    } else {
      role = "user";
    }
    const newMessage = {
      sender: user._id,
      role: role,
      message: chatMessage.trim(),
      sentAt: new Date(),
    };
    console.log("new message", newMessage);

    try {
      await axios.put(
        `${API_URL}tickets/${ticketId}`,
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (ticket?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  return (
    <div className="chat-container">
      <div className="chat">
        <h3>Support Ticket Chat</h3>
        {/* {loading && <div>Loading...</div>} */}
        <div
          className="box"
          style={{
            height: 350,
            maxHeight: 350,
            overflowY: "auto",
            padding: 16,
            marginBottom: 16,
          }}
        >
          {ticket?.messages?.length ? (
            ticket.messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                  }}
                >
                  {/* Icon + Time */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i
                      className={
                        msg.role === "user"
                          ? "fa-solid fa-user"
                          : "fa-solid fa-user-astronaut"
                      }
                      style={{
                        fontSize: 18,
                        border: "2px solid black",
                        padding: "4px",
                        borderRadius: "20px",
                      }}
                    ></i>
                    <small style={{ color: "#888" }}>
                      {msg.sentAt
                        ? new Date(msg.sentAt).toLocaleString()
                        : "Just now"}
                    </small>
                  </div>
                  {/* Message */}
                  <p
                    className="mt-3"
                    style={{
                      margin: "4px 0 0",
                      background: msg.role === "user" ? "#DCF8C6" : "#E8E8E8",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}

          <div ref={messagesEndRef} />
        </div>
        <div className="type-message d-flex gap-2">
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
    </div>
  );
};

export default ChatHistory;
