"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DeleteCategory from "../../[locale]/(adminSide)/model/DeleteCategory";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

export default function Categories() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const itemsPerPage = 10;
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { t } = useTranslation();
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
  const getCategories = async (page = 1, searchTerm = "") => {
    setLoader(true);
    try {
      let url = `${API_URL}category?page=${page}&pageSize=${itemsPerPage}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.items) {
        setCategories(res.data.items || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalItems(res.data.pagination?.total || 0);
        setCurrentPage((res.data.pagination?.page || 1) -1);
      }

    } catch (err) {
      toast.error(t("Failed to fetch categories"));
      setCategories([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCategories(1);
  }, []);

  const handleEditCategory = (id) => {
    setLoader(true);
    router.push(`/admin/category/${id}`);
  };

  const handleAddCategory = () => {
    setLoader(true);
    router.push(`/admin/category/add-category`);
  };

  const handleDeleteCategory = (id) => {
    setDeleteUser(true);
    setCategoryId(id);
  };
  useEffect(() => {
    if (categories.length > 0) {
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
  }, [categories]);
  const columns = [
    {
      name: t("Category name"),
      selector: (row) => row.name,
    },
    {
      name: t("Category description"),
      selector: (row) => row.description,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex position-relative custom-dropdown" data-label="Action">
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
            <ul
              className="dropdown-menu show right-side"
            >
              <li>
                <button
                  className={`admin_action_edit`}
                  onClick={(e) => { e.stopPropagation(); handleEditCategory(row._id); setOpenDropdownId(null); }}
                >
                  <i className="fa-solid fa-pencil me-2"></i> {t("Edit")}
                </button>
              </li>
              <li>
                <button
                  className={`admin_action_delete`}
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(row._id); setOpenDropdownId(null); }}
                >
                  <i className="fa fa-trash me-2"></i> {t("Delete")}
                </button>
              </li>
            </ul>
          )}
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
                      <h1>{t("Category List")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-9">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        {/* <div className="form_group position-relative search-bar">
                          <input
                            type="text"
                            placeholder={t("Search by user or status...")}
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && getCategories(1, search)
                            }
                          />
                          <i
                            className="fa-solid fa-magnifying-glass"
                          ></i>
                        </div>
                        <button
                          className="button"
                          onClick={() => getCategories(1, search)}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : t("Search")}
                        </button>
                        {search && (
                          <button
                            className="button ms-2"
                            onClick={() => {
                              setSearch("");
                              getCategories(1, "");
                            }}
                            disabled={loading}
                          >
                            {t("Clear")}
                          </button>
                        )} */}
                        <button className="button" onClick={handleAddCategory}>
                          {t("Add New Category")}
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
                    <DataTable columns={columns} data={categories}
                      pagination
                      paginationServer
                      paginationTotalRows={total}
                      paginationDefaultPage={currentPage + 1}
                      onChangePage={(page) => getCategories(page)}
                      paginationPerPage={itemsPerPage}
                      noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>} />
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader && <Loader />}
      </div>
      <DeleteCategory
        show={deleteUser}
        data={categoryId}
        onHide={() => (setDeleteUser(false), getCategories())}
      />
    </>
  );
}
