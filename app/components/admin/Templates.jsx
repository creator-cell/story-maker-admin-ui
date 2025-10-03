"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DeleteTemplate from "../../[locale]/(adminSide)/model/DeleteTemplate";
import Loader from "../Loader";
import { jsPDF } from "jspdf";
import ApproveTemplate from "../../[locale]/(adminSide)/model/ApproveTemplate";
import { useTranslation } from "react-i18next";
export default function Template() {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [showDeletedId, setShowDeletedId] = useState(false);
  const itemsPerPage = 20;
  const [loader, setLoader] = useState(false);
  const userStr = localStorage.getItem("user");
  const userObj = userStr ? JSON.parse(userStr) : null;
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [approveModel, setApproveModel] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const getTemplates = async (page = 1, searchTerm = "") => {
    setLoader(true);
    try {
      let url = `${API_URL}template?page=${page}&pageSize=${itemsPerPage}`;

      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      let allTemplates = res.data.data || [];

      let filteredTemplates = allTemplates;

      if (currentUser?.role === "admin") {
        filteredTemplates = allTemplates;
      } else if (currentUser?._id) {
        filteredTemplates = allTemplates.filter(
          (tpl) =>
            tpl.status === "approved" ||
            (tpl.user?._id === currentUser._id &&
              ["pending", "approved"].includes(tpl.status))
        );
      } else {
        filteredTemplates = allTemplates.filter(
          (tpl) => tpl.status === "approved"
        );
      }

      setTemplates(filteredTemplates);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setCurrentPage(res.data.pagination?.currentPage - 1 || 0);
    } catch (err) {
      setTemplates([]);
      setTotalPages(0);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getTemplates(1);
  }, []);

  const handleEdit = (id) => {
    setLoader(true);
    router.push(`/admin/template/${id}`);
  };

  const handleClone = async (id, name, content) => {
    setLoader(true);
    const userStr = localStorage.getItem("user");

    const userObj = userStr ? JSON.parse(userStr) : null;
    //  router.push(`/admin/template/clone/${id}`);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${id}`,
        {
          name: name,

          content: content,
          user: userObj._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Template clone successfully");
      getTemplates();
      router.push("/admin/template");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update template");
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDeletedId(true);
  };

  const handleTemplateSubmit = async () => {

    try {
      setLoader(true);
      const responseData = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template`,
        { name: "Untitle design", content: "", user: currentUser._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLoader(false);
      router.push(`/admin/template/${responseData.data.template._id}`);
    } catch (err) {
      setLoader(false);
      toast.error(err?.response?.data?.message || "Failed to add template");
    }
  };

  const handleDownloadPDF = (tpl) => {
    if (!tpl.content) {
      toast.error("No template data found");
      return;
    }

    const canvas = new fabric.StaticCanvas(null, { width: 800, height: 600 });

    try {
      const jsonData =
        typeof tpl.content === "string" ? JSON.parse(tpl.content) : tpl.content;

      canvas.loadFromJSON(jsonData, () => {
        const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });

        const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
        pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${tpl.name || "template"}.pdf`);
      });
    } catch (err) {
      toast.error("Error exporting PDF");
    }
  };
  const handleDownloadCSV = (tpl) => {
    if (!tpl.content) {
      toast.error("No template data found");
      return;
    }

    try {
      const jsonData =
        typeof tpl.content === "string" ? JSON.parse(tpl.content) : tpl.content;

      // flatten objects
      const rows = [];
      jsonData.objects.forEach((obj) => {
        rows.push({
          type: obj.type,
          text: obj.text || "",
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
          stroke: obj.stroke,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
        });
      });

      // convert to CSV
      const headers = Object.keys(rows[0]).join(",");
      const csv = [
        headers,
        ...rows.map((r) => Object.values(r).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tpl.name || "template"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Error exporting CSV");
    }
  };

  const handleApprove = (id) => {
    setApproveModel(true);
    setDeleteId(id);
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
                      <h1>{t("Template List")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  {/* Filters */}
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-9">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        <div className="form_group position-relative">
                          <input
                            type="text"
                            placeholder={t("Search by name...")}
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && getTemplates(1, search)
                            }
                          />
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <button
                          className="button"
                          onClick={() => getTemplates(1, search)}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : t("Search")}
                        </button>
                        {search && (
                          <button
                            className="button ms-2"
                            onClick={() => {
                              setSearch("");
                              getTemplates(1, "");
                            }}
                            disabled={loading}
                          >
                            {t("Clear")}
                          </button>
                        )}
                        <button
                          className="button"
                          onClick={handleTemplateSubmit}
                        >
                          {t("Add New Template")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Loader */}
                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">{t("Loading...")}</span>
                      </div>
                    </div>
                  )}

                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{t("Name")}</th>
                          <th>{t("Status")}</th>
                          <th>{t("Action")}</th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          templates.map((tpl) => (
                            <tr key={tpl._id}>
                              <td data-label="Name">{tpl.name}</td>
                              <td data-label="Status">
                                <span
                                  className={`badge ${tpl.status === "approved"
                                      ? "bg-success"
                                      : "bg-warning"
                                    }`}
                                >
                                  {tpl.status.charAt(0).toUpperCase() + tpl.status.slice(1)}

                                </span>
                              </td>
                              <td data-label="Action">
                                <div className="template-button">
                                  <button
                                    className="button mx-1 mb-2"
                                    onClick={() => handleEdit(tpl._id)}
                                  >
                                    {t("View/Edit")}
                                  </button>
                                  <button
                                    className="button mx-1 mb-2"
                                    onClick={() =>
                                      handleClone(tpl._id, tpl.name, tpl.content)
                                    }
                                  >
                                    {t("Clone")}
                                  </button>
                                  <button
                                    className="button mx-1 mb-2"
                                    onClick={() => handleDelete(tpl._id)}
                                  >
                                    {t("Delete/Reject")}
                                  </button>
                                  {currentUser.role.name === "Super Admin" &&
                                    tpl.status === "pending" && (
                                      <button
                                        className="button mx-1 mb-2"
                                        onClick={() => handleApprove(tpl._id)}
                                      >
                                        {t("Approve")}
                                      </button>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        {!loading && templates.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              {search
                                ? `No templates found matching "${search}"`
                                : "No templates found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-between align-items-center">
                      <div className="pagination-info">
                        <small className="text-muted">
                          {t("Page")} {currentPage + 1} {t("of")} {totalPages}
                        </small>
                      </div>
                      <ReactPaginate
                        pageCount={totalPages}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={(selected) =>
                          getTemplates(selected.selected + 1, search)
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
      <DeleteTemplate
        show={showDeletedId}
        data={deleteId}
        onHide={() => (setShowDeletedId(false), getTemplates())}
      />
      <ApproveTemplate
        show={approveModel}
        data={deleteId}
        onHide={() => {
          setApproveModel(false), getTemplates();
        }}
      />
    </>
  );
}
