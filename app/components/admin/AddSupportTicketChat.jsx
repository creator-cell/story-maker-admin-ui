"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_SUPPORT_TICKET;

const AddChatHistory = () => {
  const currentUser = localStorage.getItem("user");
  const [loader, setLoader] = useState(false);

  const [ticket, setTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendChatMessage = async () => {
    setLoader(true);
    if (!chatMessage.trim()) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const newMessage = {
      sender: user._id,
      role: user.role.name,
      message: chatMessage.trim(),
      sentAt: new Date(),
    };

    try {
      await axios.post(
        `${API_URL}tickets`,
        {
          messages: [newMessage],
          userId: user._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Message sent");
      setChatMessage("");

      router.push("/admin/tickets");
    } catch (err) {
    }
  };

  return (
    <div className="chat-container">
      <div className="title_head">
        <h1>Support Ticket Chat</h1>
      </div>
      {loading && <div>Loading...</div>}

      <div className="send-chat d-flex gap-2 mt-4">
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

export default AddChatHistory;
