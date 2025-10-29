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
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_CATEGORY;
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const itemsPerPage = 20;
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { t } = useTranslation();

  const getCategories = async (page = 1, searchTerm = "") => {
    setLoader(true);
    try {
      let url = `${API_URL}category?`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCategories(res.data.categories || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setCurrentPage(res.data.pagination?.currentPage - 1 || 0);
    } catch (err) {
      toast.error(t("Failed to fetch categories"));
      setCategories([]);
      setTotalPages(0);
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
        <div className="d-flex" data-label="Action">
          <div className="dropdown">
            <button
              className="border-0 bg-transparent"
              type="button"
              id={`dropdownMenuButton-${row._id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa fa-ellipsis"></i>
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby={`dropdownMenuButton-${row._id}`}
            >
              <li>
                <button
                  className={`admin_action_edit`}
                  onClick={() => handleEditCategory(row._id)}
                >
                  <i className="fa-solid fa-pencil me-2"></i> {t("Edit")}
                </button>
              </li>
              <li>
                <button
                  className={`admin_action_delete`}
                  onClick={() => handleDeleteCategory(row._id)}
                >
                  <i className="fa fa-trash me-2"></i> {t("Delete")}
                </button>
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
                    <DataTable columns={columns} data={categories} noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>} />
                    {/* <table className="table">
                      <thead>
                        <tr>
                          <th>{t("Category name")}</th>
                          <th>{t("Category description")}</th>
                          <th>{t("Action")}</th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          categories.map((category) => (
                            <tr key={category._id}>
                              <td data-label="Category name">{category.name}</td>
                              <td data-label="Category description">{category.description}</td>
                              <td data-label="Action">
                                <div className="dropdown">
                                  <button
                                    className="border-0 bg-transparent"
                                    type="button"
                                    id={`dropdownMenuButton-${category._id}`}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i class="fa fa-ellipsis"></i>
                                  </button>
                                  <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${category._id}`}>
                                    <li>   <button
                                      className={`admin_action_edit`}
                                      onClick={() =>
                                        handleEditCategory(category._id)
                                      }
                                    >
                                      <i className="fa-solid fa-pencil me-2"></i> Edit
                                    </button></li>
                                    <li>    <button
                                      className={`admin_action_delete`}
                                      onClick={() =>
                                        handleDeleteCategory(category._id)
                                      }
                                    >
                                      <i className="fa fa-trash me-2"></i> Delete
                                    </button></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {!loading && categories.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              {search
                                ? `No category found matching "${search}"`
                                : "No category found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table> */}
                  </div>
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
                          getCategories(selected.selected + 1, search)
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
      <DeleteCategory
        show={deleteUser}
        data={categoryId}
        onHide={() => (setDeleteUser(false), getCategories())}
      />
    </>
  );
}
