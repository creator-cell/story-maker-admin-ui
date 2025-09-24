"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
// import Modal from "react-modal"; // For chat modal
import { useRouter } from "next/navigation";
import Loader from "../Loader";
export default function Tickets() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_SUPPORT_TICKET;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);

  const [moderator, setAllModerator] = useState();
  const itemsPerPage = 20;
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const getTickets = async (page = 1, searchTerm = "") => {
    setLoader(true);
    try {
      let url = `${API_URL}tickets?page=${page}&pageSize=${itemsPerPage}&user=${currentUser._id}&role=${currentUser.role.name}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setTickets(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setCurrentPage(res.data.pagination?.currentPage - 1 || 0);
    } catch (err) {
      toast.error("Failed to fetch tickets");
      setTickets([]);
      setTotalPages(0);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllModerator();
  }, []);
  useEffect(() => {
    getTickets(1);
  }, []);

  const handleUserUpdate = (id) => {
    setLoader(true);
    router.push(`/admin/tickets/${id}`);
  };

  const handleResolve = async (ticketId) => {
    setLoader(true);
    try {
      await axios.put(
        `${API_URL}tickets/${ticketId}`,
        { status: "Resolved" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Ticket Resolved");
      getTickets(currentPage + 1, search);
      setLoader(false);
    } catch (err) {
      toast.error("Failed to assign moderator");
    }
  };

  const handleAssignModerator = async (ticketId, moderatorId) => {
    try {
      await axios.put(
        `${API_URL}tickets/${ticketId}`,
        { moderator: moderatorId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Moderator assigned");
      getTickets(currentPage + 1, search);
    } catch (err) {
      toast.error("Failed to assign moderator");
    }
  };

  const getAllModerator = async () => {
    try {
      const response = await axios.get(
        `${API_URL}tickets/moderator`,

        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAllModerator(response.data);
    } catch (err) { }
  };

  const handleNewChat = () => {
    setLoader(true);
    router.push(`/admin/tickets/add`);
  };

  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container p-0">
            <div id="user" className="comman_admin_layout">
              <div className="container p-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="title_head">
                      <h1>Ticket List</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-8">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        <div className="form_group position-relative">
                          <input
                            type="text"
                            placeholder="Search by user or status..."
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && getTickets(1, search)
                            }
                          />
                          <i
                            className="fa-solid fa-magnifying-glass"
                          ></i>
                        </div>
                        <button
                          className="button"
                          onClick={() => getTickets(1, search)}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : "Search"}
                        </button>
                        {search && (
                          <button
                            className="button ms-2"
                            onClick={() => {
                              setLoader(true);
                              setSearch("");
                              getTickets(1, "");
                            }}
                            disabled={loading}
                          >
                            Clear
                          </button>
                        )}
                        <button className="button" onClick={handleNewChat}>
                          Add New Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Status</th>
                          <th>Moderator</th>
                          <th className="w-25">Last Message</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          tickets.map((ticket) => (
                            <tr key={ticket._id}>
                              <td data-label="User">{ticket.userId.name}</td>
                              <td data-label="Status">{ticket.status}</td>
                              <td data-label="Moderator">
                                <select
                                  value={ticket?.moderator?._id || ""}
                                  onChange={(e) =>
                                    handleAssignModerator(
                                      ticket._id,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Assign Moderator</option>
                                  {moderator &&
                                    moderator.map((item) => (
                                      <option value={item._id}>
                                        {item.name}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td>
                                {ticket.messages?.length
                                  ? ticket.messages[ticket.messages.length - 1]
                                    .message
                                  : ""}
                              </td>
                              <td>
                                <button
                                  className={`resolvebtn button mx-1 ${ticket.status === "Resolved"
                                      ? "btn-resolved"
                                      : "btn-resolve"
                                    }`}
                                  onClick={() => handleUserUpdate(ticket._id)}
                                  disabled={ticket.status === "Resolved"}
                                >
                                  View
                                </button>

                                <button
                                  className={`click-to-resolve button mx-4 ${ticket.status === "Resolved"
                                      ? "btn-resolved"
                                      : "btn-resolve"
                                    }`}
                                  onClick={() => handleResolve(ticket._id)}
                                  disabled={ticket.status === "Resolved"}
                                >
                                  {ticket.status === "Resolved"
                                    ? "Resolved"
                                    : "Click to Resolve"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        {!loading && tickets.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              {search
                                ? `No tickets found matching "${search}"`
                                : "No tickets found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-between align-items-center">
                      <div className="pagination-info">
                        <small className="text-muted">
                          Page {currentPage + 1} of {totalPages}
                        </small>
                      </div>
                      <ReactPaginate
                        pageCount={totalPages}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={(selected) =>
                          getTickets(selected.selected + 1, search)
                        }
                        containerClassName="pagination"
                        activeClassName="active"
                        previousLabel="Previous"
                        nextLabel="Next"
                        breakLabel="..."
                        forcePage={currentPage}
                        disabledClassName="disabled"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader && <Loader />}
      </div>
    </>
  );
}
