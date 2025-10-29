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
import DataTable from "react-data-table-component";
import { useEditorStore } from "@/app/redux/UserStore";

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
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { designId } = useEditorStore();
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

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_CATEGORY}category`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const cats = res.data?.categories || [];
      const parents = cats.filter((c) => !c.parentCategory);
      const subs = cats.filter((c) => c.parentCategory);
      console.log("parents", parents);
      console.log("subs", subs);
      setCategory(parents);
      setSubCategory(subs);
    } catch (err) {
      toast.error(t("Failed to fetch categories"));
      toast.error(t("Failed to fetch categories"));
    }
  };
  const handleCategoryChange = async (templateId, categoryId) => {
    try {
      // Optionally, you can call API to update category
      await axios.put(
        `${API_URL}template/${templateId}`,
        { category: categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update state locally
      setTemplates((prev) =>
        prev.map((tpl) =>
          tpl._id === templateId
            ? { ...tpl, category: { _id: categoryId } }
            : tpl
        )
      );

      toast.success(t("Category updated"));
    } catch (err) {
      toast.error(t("Failed to update category"));
    }
  };

  const handleSubCategoryChange = async (templateId, subCategoryId) => {
    try {
      await axios.put(
        `${API_URL}template/${templateId}`,
        { subCategory: subCategoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTemplates((prev) =>
        prev.map((tpl) =>
          tpl._id === templateId
            ? { ...tpl, subCategory: { _id: subCategoryId } }
            : tpl
        )
      );

      toast.success(t("Subcategory updated"));
    } catch (err) {
      toast.error(t("Failed to update subcategory"));
    }
  };

  useEffect(() => {
    getTemplates(1);
    fetchCategory();
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
      toast.success(t("Template clone successfully"));
      await increaseTemplateUsage(id);
      getTemplates();
      router.push("/admin/template");
    } catch (err) {
      toast.error(t("Failed to update template"));
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDeletedId(true);
  };

  const increaseTemplateUsage = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}template/getUsage`,
        { templateId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
    } catch (err) {}
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
      toast.error(t("Failed to add template"));
    }
  };

  const handleApprove = (id) => {
    setApproveModel(true);
    setDeleteId(id);
  };
  const columns = [
    {
      name: t("Name"),
      selector: (row) => row.name,
    },
    {
      name: t("Status"),
      selector: (row) => row.status,
      cell: (row) => {
        const translatedStatus = t(row.status);
        return (
          <span
            className={`badge ${
              row.status === "approved" ? "bg-success" : "bg-warning"
            }`}
          >
            {translatedStatus}
          </span>
        );
      },
    },
    {
      name: t("Category"),
      cell: (row) => (
        <select
          className="form-select"
          value={row.category?._id || ""}
          onChange={(e) => handleCategoryChange(row._id, e.target.value)}
        >
          <option value="">{t("Select Category")}</option>
          {category?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      ),
      minWidth: "160px",
      wrap: true,
    },
    {
      name: t("Sub Category"),
      cell: (row) => {
        const relatedSubs = subCategory.filter(
          (sub) => sub.parentCategory === row.category?._id
        );
        return (
          <select
            className="form-select"
            value={row.subCategory?._id || ""}
            onChange={(e) => handleSubCategoryChange(row._id, e.target.value)}
          >
            <option value="">{t("Select Sub Category")}</option>
            {relatedSubs.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        );
      },
      minWidth: "160px",
      wrap: true,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex" data-label="Action">
          <div className="dropdown">
            <button
              className="border-0 bg-transparent"
              type="button"
              id={`dropdownMenuButton-${row._id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-ellipsis"></i>
            </button>

            <ul
              className="dropdown-menu"
              aria-labelledby={`ticketDropdownButton-${row._id}`}
            >
              <li>
                <button
                  className="admin_action_edit"
                  onClick={() => handleEdit(row._id)}
                >
                  <i className="fa-solid fa-pencil me-2"></i> {t("Edit")}
                </button>
              </li>
              <li>
                <button
                  className="admin_action_clone"
                  onClick={() => handleClone(row._id, row.name, row.content)}
                >
                  <i className="fa-solid fa-clone"></i> {t("Clone")}
                </button>
              </li>
              <li>
                <button
                  className="admin_action_delete"
                  onClick={() => handleDelete(row._id)}
                >
                  <i className="fa fa-trash me-2"></i> {t("Delete")}
                </button>
              </li>
              <li>
                {currentUser.role.name === "Super Admin" &&
                  row.status === "pending" && (
                    <button
                      className="admin_action_approve"
                      onClick={() => handleApprove(row._id)}
                    >
                      <i className="fa-solid fa-thumbs-up"></i> {t("Approve")}
                    </button>
                  )}
              </li>
            </ul>
          </div>
        </div>
      ),
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
                        <div className="form_group position-relative search-bar">
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
                        <span className="visually-hidden">
                          {t("Loading...")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Table */}
                  <div className="table-responsive">
                    <DataTable columns={columns} data={templates} noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>}/>
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
