"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_SUPPORT_TICKET;

const ChatHistory = ({ ticketId }) => {
  const currentUser = localStorage.getItem("user");

  const [ticket, setTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Ref for auto scroll
  const messagesEndRef = useRef(null);

  const getTicket = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTicket(response.data.ticket);
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
    if (!chatMessage.trim() && !imageFile) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role.name === "Moderator" ? "moderator" : "user";

    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("role", role);
    formData.append("messages", chatMessage.trim());
    if (imageFile) formData.append("image", imageFile);
    console.log("imageFile", imageFile);
    try {
      await axios.put(`${API_URL}tickets/${ticketId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Message sent");
      setChatMessage("");
      setImageFile(null);
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
        <h1>Support Ticket Chat</h1>
        {/* {loading && <div>Loading...</div>} */}
        <div className="box">
          {ticket?.messages?.length ? (
            ticket.messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  paddingLeft: "10px",
                  marginBottom: 12,
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="user-chat"
                  style={{
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {/* Message */}
                  <p
                    className="mt-3"
                    style={{
                      background: msg.role === "user" ? "#DCF8C6" : "#E8E8E8",
                    }}
                  >
                    <div className="icon-name">
                      <i
                        className={
                          msg.role === "user"
                            ? "fa-solid fa-user"
                            : "fa-solid fa-user-astronaut"
                        }
                      ></i>
                      <div className="name">
                        <small>
                          {/* {msg.role === "user" ? "User" : "Moderator"} */}
                          {msg?.sender?.name}
                        </small>
                      </div>
                    </div>
                    {msg.message}
                    {msg.image && (
                      <div>
                        <img
                          src={`${API_URL.replace(/\/$/, "")}${msg.image}`}
                        />
                      </div>
                    )}
                    <small>
                      {msg.sentAt
                        ? new Date(msg.sentAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </small>
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

          {/* File input for images */}
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <img
            src="/images/send.jpg"
            alt="Send message"
            height={50}
            width={50}
            onClick={sendChatMessage}
            style={{
              cursor:
                loading || (!chatMessage.trim() && !imageFile)
                  ? "default"
                  : "pointer",
              opacity: loading || (!chatMessage.trim() && !imageFile) ? 0.5 : 1,
            }}
            role="button"
          />
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
