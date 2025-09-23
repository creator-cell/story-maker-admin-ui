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
  const [selectedImage, setSelectedImage] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setSelectedImage(null);
    }
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

  const getInitials = (name = "") => {
    if (!name) return "";
    const words = name.trim().split(" ");
    let initials = words[0].charAt(0);
    if (words.length > 1) {
      initials += words[1].charAt(0);
    }
    return initials.toUpperCase();
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (ticket?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  return (
    <>
      <div className="chat-container">
        <div className="chat">
          <p className="title">Reply</p>
          <div className="box">
            <div className="type-messages w-100">
              <div className="d-flex flex-column">
                <span>Your message</span>

                <textarea
                  type="text"
                  className="form-control mt-3"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows={4}
                />

                <div className="upload-file mt-4 gap-4 d-flex">
                  <label htmlFor="file-upload" className="upload-text">
                    <i className="fa-solid fa-file-arrow-up"></i> <span> Upload a file </span>
                  </label>
                  <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} className="mt-4 d-none" />
                </div>
                <button
                  className="button mt-4"
                  onClick={sendChatMessage}
                  disabled={loading || !chatMessage.trim() && !imageFile}
                >
                  Reply
                </button>
              </div>
              <div className="show-file mt-2">
                {selectedImage && (

                  <img
                    src={selectedImage}
                    alt="preview"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="chat">
          <p className="title">Support Ticket Chat</p>

          <div className="box">
            {ticket?.messages?.length ? (
              ticket.messages.map((msg) => (
                <div key={msg._id}>
                  <di className="user-chat" >
                    <p>
                      <div className="icon-name">
                        <div className="user-initials pt-1">
                          {getInitials(msg?.sender?.name)}
                        </div>
                        <div className="name">
                          <small>
                            {msg?.sender?.name}
                          </small>
                          <small>
                            {msg.sentAt ? (() => {
                              const date = new Date(msg.sentAt);
                              const now = new Date();

                              const isToday = date.toDateString() === now.toDateString();

                              const yesterday = new Date();
                              yesterday.setDate(now.getDate() - 1);
                              const isYesterday = date.toDateString() === yesterday.toDateString();

                              let time = date.toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              });
                              time = time.replace("am", "AM").replace("pm", "PM");

                              if (isToday) {
                                return `Today at ${time}`;
                              } else if (isYesterday) {
                                return `Yesterday at ${time}`;
                              } else {
                                const formattedDate = date.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                });
                                return `${formattedDate} ${time}`;
                              }
                            })() : "Just now"}
                          </small>

                          <span> {msg.message}
                            <div className="mt-4">
                              {msg.image && (
                                <div>
                                  <img
                                    src={`${API_URL.replace(/\/$/, "")}${msg.image}`}
                                  />
                                </div>
                              )}
                            </div>
                          </span>
                        </div>
                      </div>
                    </p>
                  </di>
                </div>
              ))
            ) : (
              <div>No messages yet.</div>
            )}
            <div ref={messagesEndRef} />
          </div>

        </div>
      </div >
    </>
  );
};

export default ChatHistory;