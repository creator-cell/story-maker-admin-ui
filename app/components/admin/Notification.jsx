"use client";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
import DataTable from 'react-data-table-component';

export default function Notification() {
  const { t } = useTranslation();
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
      toast(t("Notification sended successfully"), {
        theme: "light",
        type: "success",
        position: "top-right"
      });
      getNotifications();
    }).catch(err => {
      console.log(err);
      toast(t("Something want wrong"), {
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
  const columns = [
    {
      name: t('Date'),
      selector: (row) => new Date(row.updatedAt).toLocaleDateString()
    },
    {
      name: t('Message'),
      selector: (row) => row.message,
      wrap: true,
      minWidth: "200px",

    },
    {
      name: t('Send By'),
      selector: (row) => row.sendedBy?.name,
      width: "150px",
    },
    {
      name: t('Type'),
      selector: (row) => row.type?.toUpperCase(),
      width: "120px",
    },
    {
      name: t('Deliver Count'),
      selector: (row) => row.deliverCount,
      width: "150px",
    },
  ]
  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container p-0">
            <div id="user" className="comman_admin_layout">
              <div className="container p-0">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="title_head">
                      <h1>{t("Notifications")}</h1>
                    </div>
                  </div>
                </div>

                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-3 col-md-4 col-12">
                      <div className="d-flex gap-2 align-items-center"></div>
                    </div>

                    <div className="notification col-lg-9 col-md-8 col-12">
                      <div className="filter_field">
                        <div className="form_group position-relative search-bar">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("Write your notification...")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <i className="fa-solid fa-pen"></i>
                        </div>

                        <button
                          className="button"
                          title="Send By Email"
                          onClick={() => handleSend("mail")}
                        >
                          {t("Send by")} <i className="fa-solid fa-envelope"></i>
                        </button>
                        <button
                          className="button"
                          title="Send By SMS"
                          onClick={() => handleSend("sms")}
                        >
                          {t("Send by")} <i className="fa-solid fa-comment-sms"></i>
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
                        <span className="visually-hidden">{t("Loading...")}</span>
                      </div>
                    </div>
                  )}

                  <div className="table-responsive">
                    <DataTable
                      columns={columns}
                      data={notifications}
                    />
                    {/* <table className="table">
                      <thead>
                        <tr>
                          <th className="cursor">{t("Date")}</th>
                          <th className="cursor"> {t("Message")}</th>
                          <th className="cursor">{t("Send By")}</th>
                          <th className="cursor">{t("Type")}</th>
                          <th className="cursor">{t("Deliver Count")}</th>
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
                              {t("No notification found")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table> */}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-between align-items-center flex-wrap">
                      <div className="pagination-info">
                        <small>
                          {t("Page")} {currentPage + 1} {t("of")} {totalPages}({totalItems}{" "}
                          {t("total items")})
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