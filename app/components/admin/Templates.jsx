"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Template() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const itemsPerPage = 20;

  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const getTemplates = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let url = `${API_URL}template?page=${page}&pageSize=${itemsPerPage}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setTemplates(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setCurrentPage(res.data.pagination?.currentPage - 1 || 0);
    } catch (err) {
      // toast.error("Failed to fetch templates");
      setTemplates([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates(1);
  }, []);

  const handleEdit = (id) => {
    router.push(`/admin/template/${id}`);
  };

  const handleClone = (id) => {
    router.push(`/admin/template/clone/${id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await axios.delete(`${API_URL}template/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Template deleted");
      getTemplates(currentPage + 1, search);
    } catch (err) {
      toast.error("Failed to delete template");
    }
  };

  const handleNewTemplate = () => {
    router.push(`/admin/template/add-template`);
  };

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container p-0">
          <div id="user" className="comman_admin_layout">
            <div className="container p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="title_head">
                    <h3>Template List</h3>
                  </div>
                </div>
              </div>
              <div className="admin_table">
                {/* Filters */}
                <div className="row table_filter justify-content-between align-items-center mb-3">
                  <div className="col-lg-5"></div>
                  <div className="col-lg-7">
                    <div className="filter_field d-flex gap-2 justify-content-end">
                      <div className="form_group position-relative">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && getTemplates(1, search)
                        }
                      />
                        <i
                            className="fa-solid fa-magnifying-glass position-absolute"
                            style={{
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                            }}
                          ></i>
                      </div>
                      <button
                        className="button"
                        onClick={() => getTemplates(1, search)}
                        disabled={loading}
                      >
                        {loading ? "Searching..." : "Search"}
                      </button>
                      {search && (
                        <button
                          className="button ms-2"
                          onClick={() => {
                            setSearch("");
                            getTemplates(1, "");
                          }}
                          style={{ backgroundColor: "#6c757d" }}
                          disabled={loading}
                        >
                          Clear
                        </button>
                      )}
                      <button className="button" onClick={handleNewTemplate}>
                        Add New Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loader */}
                {loading && (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="table_body">
                      {!loading &&
                        templates.map((tpl) => (
                          <tr key={tpl._id}>
                            <td>{tpl.name}</td>
                            <td>{tpl.category?.name || "-"}</td>
                            <td>{tpl.subCategory?.name || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  tpl.status === "approved"
                                    ? "bg-success"
                                    : "bg-warning"
                                }`}
                              >
                                {tpl.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="button mx-1"
                                onClick={() => handleEdit(tpl._id)}
                              >
                                View/Edit
                              </button>
                              <button
                                className="button mx-1"
                                style={{ backgroundColor: "#6c757d" }}
                                onClick={() => handleClone(tpl._id)}
                              >
                                Clone
                              </button>
                              <button
                                className="button mx-1"
                                style={{ backgroundColor: "#dc3545" }}
                                onClick={() => handleDelete(tpl._id)}
                              >
                                Delete
                              </button>
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
                        Page {currentPage + 1} of {totalPages}
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
    </div>
  );
}
