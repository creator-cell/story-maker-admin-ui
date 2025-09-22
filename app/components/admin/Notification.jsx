"use client";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

export default function Notification() {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_NOTIFICATION;

  const handleSend = (type) => {
    if (!message.trim()) return;

    setLoader(true);
    axios({
      url: `${API_URL}notification/${type == "sms" ? 'sms' : 'mail'}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: JSON.stringify({
        message: message
      })
    }).then(res => {
      setMessage("");
      toast(res.data?.message || "Notification sended successfully", {
        theme: "light",
        type: "success",
        position: "top-right"
      });
      getNotifications();
    }).catch(err => {
      console.log(err);
      toast("Something want wrong", {
        theme: "light",
        type: "error",
        position: "top-right"
      });
    }).finally(() => {
      setLoader(false);
    });
  };

  const getNotifications = (page = 1) => {
    setLoader(true);
    axios({
      url: `${API_URL}notification?page=${page}`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      setNotifications(res?.data?.data?.items);
      setTotalPages(res?.data?.data?.pagination?.totalPages);
      setTotalItems(res?.data?.data?.pagination?.totalItems);
      setCurrentPage(res?.data?.data?.pagination?.currentPage - 1);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoader(false);
    });
  }

  const handlePageClick = (selectedPage) => {
    console.log(selectedPage);
    getNotifications(selectedPage?.selected + 1);
  }

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container p-0">
            <div id="user" className="comman_admin_layout">
              <div className="container p-0">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="container mt-4">
                        <h2 className="mb-4">Notifications</h2>

                        <div className="mb-3">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Write your notification..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <button
                        className="button me-2"
                        onClick={() => handleSend("mail")}
                        >
                        Send by Email
                        </button>
                        <button
                        className="button"
                        onClick={() => handleSend("sms")}
                        >
                        Send by SMS
                        </button>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="d-flex gap-2 align-items-center"></div>
                    </div>

                    <div className="notification col-lg-8 col-md-6 col-12">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        <div className="form_group position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Write your notification..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <i class="fa-solid fa-pen"></i>
                        </div>

                        <button
                          className="btn me-2 mail-button" 
                          onClick={() => handleSend("mail")}
                        >
                          Send by <i class="fa-solid fa-envelope"></i>
                          {/* Email */}
                        </button>
                        <button
                          className="btn sms-button"
                          onClick={() => handleSend("sms")}
                        >
                          Send by <i class="fa-solid fa-comment-sms"></i>
                          {/* SMS */}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12">
                    <div className="filter_field d-flex gap-2 justify-content-end">
                      <div className="form_group position-relative">
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
                          <th className="cursor"
                          >
                            Date
                          </th>
                          <th className="cursor"
                          >
                            Message
                            {/* <i
                              className={`fa ${getSortIcon("email")} ms-1`}
                            ></i> */}
                          </th>
                          <th className="cursor"
                          >
                            Send By
                          </th>
                          <th className="cursor"
                          >
                            Type
                            {/* <i
                              className={`fa ${getSortIcon("isActive")} ms-1`}
                            ></i> */}
                          </th>
                          <th className="cursor"
                          >
                            Deliver Count
                            {/* <i
                              className={`fa ${getSortIcon("isActive")} ms-1`}
                            ></i> */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          notifications &&
                          notifications.map((notification, index) => {
                            return (
                              <tr key={index}>
                                <td data-label="Date">{new Date(notification?.updatedAt).toLocaleDateString()}</td>
                                <td data-label="Message">{notification?.message}</td>
                                <td data-label="Send By">{notification?.sendedBy?.name}</td>
                                <td data-label="Type">{notification?.type?.toUpperCase()}</td>
                                <td data-label="Deliver Count">{notification?.deliverCount}</td>
                              </tr>
                            );
                          })}

                        {!loading && notifications.length === 0 && (
                          <tr>
                            <td
                              colSpan={"4"}
                              className="text-center py-4"
                            >
                              No notification found
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
                          Page {currentPage + 1} of {totalPages}({totalItems}{" "}
                          total items)
                        </small>
                      </div>
                      <ReactPaginate
                        pageCount={totalPages}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={handlePageClick}
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
