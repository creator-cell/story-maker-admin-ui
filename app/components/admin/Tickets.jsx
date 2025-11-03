"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
// import Modal from "react-modal"; // For chat modal
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

export default function Tickets() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_SUPPORT_TICKET;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [moderator, setAllModerator] = useState();
  const itemsPerPage = 10;
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };
  const getTickets = async (page = 1, searchTerm = "") => {
    setLoader(true);
    try {
      let url = `${API_URL}tickets?page=${page}&pageSize=${itemsPerPage}&user=${currentUser._id}&role=${currentUser.role.name}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data) {
        setTickets(res.data.data || []);

        setTotalItems(res.data.total || 0);
        setCurrentPage((res.data.page || 1) - 1);
      }
    } catch (err) {
      toast.error(t("Failed to fetch tickets"));
      setTickets([]);

      setTotalItems(0);
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
      toast.success(t("Ticket Resolved"));

      getTickets(currentPage + 1, search);
      setLoader(false);
    } catch (err) {
      toast.error(t("Failed to assign moderator"));
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
      toast.success(t("Moderator assigned"));
      getTickets(currentPage + 1, search);
    } catch (err) {
      toast.error(t("Failed to assign moderator"));
    }
  };

  const getAllModerator = async () => {
    try {
      const response = await axios.get(`${API_URL}tickets/moderator`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAllModerator(response.data);
    } catch (err) {}
  };

  const handleNewChat = () => {
    setLoader(true);
    router.push(`/admin/tickets/add`);
  };
  useEffect(() => {
    if (tickets.length > 0) {
      setTimeout(() => {
        const allRows = document.querySelectorAll(".rdt_TableRow");

        if (allRows.length > 5) {
          allRows.forEach((row) => row.classList.remove("drop-up"));
          const lastThree = Array.from(allRows).slice(-3);
          lastThree.forEach((row) => row.classList.add("drop-up"));
        } else {
          allRows.forEach((row) => row.classList.remove("drop-up"));
        }
      }, 0);
    }
  }, [tickets]);

  const columns = [
    {
      name: t("User"),
      selector: (row) => row?.userId?.name || t("No User"),
      wrap: true,
      width: "200px",
    },
    {
      name: t("Status"),
      selector: (row) => row.status,
      width: "200px",
    },
    ...(currentUser?.role?.name === "Super Admin"
      ? [
          {
            name: t("Moderator"),
            cell: (row) => (
              <select
                value={row?.moderator?._id || ""}
                onChange={(e) => handleAssignModerator(row._id, e.target.value)}
              >
                <option value="">{t("Assign Moderator")}</option>
                {moderator?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ),
            minWidth: "160px",
            wrap: true,
          },
        ]
      : []),
    {
      name: t("Last Message"),
      cell: (row) => (
        <div>
          {row.messages?.length
            ? row.messages[row.messages.length - 1].message
            : ""}
        </div>
      ),
      minWidth: "200px",
      maxWidth: "400px",
      wrap: true,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <div
          className="d-flex position-relative custom-dropdown"
          data-label="Action"
        >
          <button
            className="border-0 bg-transparent"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(row._id);
            }}
          >
            <i className="fa fa-ellipsis"></i>
          </button>
          {openDropdownId === row._id && (
            <ul className="dropdown-menu show right-side">
              <li>
                <button
                  className="admin_action_edit dropdown-item d-flex align-items-center gap-2 "
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserUpdate(row._id);
                    setOpenDropdownId(null);
                  }}
                  disabled={row.status === "Resolved"}
                >
                  <div className="eye-icon">
                    <i className="fa-solid fa-eye"></i>
                  </div>
                  <span> {t("View")}</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin_action_resolve dropdown-item d-flex align-items-center gap-2 `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResolve(row._id);
                    setOpenDropdownId(null);
                  }}
                  disabled={row.status === "Resolved"}
                >
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    {row.status === "Resolved"
                      ? t("Resolved")
                      : t("Click to Resolve")}
                  </span>
                </button>
              </li>
            </ul>
          )}
        </div>
      ),
      width: "100px",
    },
  ];

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
                      <h1>{t("Ticket List")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-9">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        <div className="form_group position-relative search-bar">
                          <input
                            type="text"
                            placeholder={t("Search by user or status...")}
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && getTickets(1, search)
                            }
                          />
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <button
                          className="button"
                          onClick={() => getTickets(1, search)}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : t("Search")}
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
                            {t("Clear")}
                          </button>
                        )}
                        <button className="button" onClick={handleNewChat}>
                          {t("Add New Ticket")}
                        </button>
                      </div>
                    </div>
                  </div>
                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">
                          {t("Loading...")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="table-responsive">
                    <DataTable
                      columns={columns}
                      data={tickets}
                      pagination
                      paginationServer
                      paginationTotalRows={total}
                      paginationDefaultPage={currentPage + 1}
                      onChangePage={(page) => getTickets(page)}
                      paginationPerPage={itemsPerPage}
                      noDataComponent={
                        <div className="text-center py-4">
                          {t("There are no records to display")}
                        </div>
                      }
                    />
                  </div>
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
