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
    <>
      {/* <div className="chat-container">
    
      </div> */}
      <div className="chat-container">
        <div className="chat">
          <p className="title">Reply</p>
          <div className="box">
            <div className="type-messages gap-3">
              <span>Your message</span>

              <textarea
                type="text"
                className="form-control"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={4}
              />
              <div className="upload-file gap-4 d-flex">
                <label htmlFor="file-upload" className="upload-text">
                  <i class="fa-solid fa-file-arrow-up"></i> <span> Upload a file </span>
                </label>
                <input 
                className="d-none"
                  id="file-upload"
                  type="file"
                />
              </div>
              <button
                className="button"
                onClick={sendChatMessage}
                disabled={loading || !chatMessage.trim()}
              >
                Reply
              </button>
              {/* <img
                src="/images/send.jpg"
                alt="Send message"
                height={50}
                width={50}
                onClick={sendChatMessage}
                style={{
                  cursor: loading || !chatMessage.trim() ? "default" : "pointer",
                  opacity: loading || !chatMessage.trim() ? 0.5 : 1,
                }}
                role="button"
                aria-label="Send message"
                aria-disabled={loading || !chatMessage.trim()}
                tabIndex={0}
              /> */}
            </div>
          </div>
        </div>
        <br />
        <div className="chat">
          <p className="title">Support Ticket Chat</p>
          {/* {loading && <div>Loading...</div>} */}

          <div className="box">
            {ticket?.messages?.length ? (
              ticket.messages.map((msg) => (
                <div key={msg._id}>
                  <di className="user-chat" >
                    <p>
                      <div className="icon-name">
                        <div>
                          <i
                            className={
                              msg.role === "user"
                                ? "fa-solid fa-user"
                                : "fa-solid fa-user-astronaut"
                            }
                          ></i></div>
                        <div className="name">
                          <small>
                            {msg.role === "user" ? "User" : "Moderator"}
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

                          <span> {msg.message}</span>
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
      </div>
    </>
  );
};

export default ChatHistory;
