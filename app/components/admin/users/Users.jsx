"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import DeleteUser from "@/app/[locale]/(adminSide)/model/DeleteUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader";
import { useTranslation } from "react-i18next";
import DataTable from 'react-data-table-component';

export default function Users() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortByValue, setSortByValue] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userPermissions, setUserPermissions] = useState({
    read: false,
    write: false,
    both: false,
  });
  const itemsPerPage = 10;
  const router = useRouter();
  const [role, setRole] = useState("");
  const [userRolePermissions, setUserRolePermissions] = useState(null);

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
  const updateUserStatus = async (updateUserId) => {
    try {
      const response = await axios({
        url: `${API_URL}user/users/status/${updateUserId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.status == "success") {
        setUsers((prevState) =>
          prevState.map((p) => {
            if (p?._id == updateUserId) {
              return {
                ...p,
                isActive: !p?.isActive,
              };
            } else {
              return p;
            }
          })
        );
      }
    } catch (error) {
      console.log("Error update user status :", error);
    }
  };

  const getUserDetail = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}user/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.items && response.data.rolePermissions) {
        setUserRolePermissions(response.data.rolePermissions);
        setRole(response.data.role || "");
      }

      return response.data;
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  };
  const hasWritePermission = () => {
    return userPermissions.write || userPermissions.both;
  };

  const hasReadPermission = () => {
    return userPermissions.read || userPermissions.both;
  };

  const hasUsersMenuAccess = () => {
    return userPermissions.hasUsersMenu;
  };

  const getUsers = async (
    page = 1,
    sort = sortByValue,
    search = searchUser,
    order = sortOrder
  ) => {
    try {
      setLoader(true);
      let url = `${API_URL}user/users?page=${page}&pageSize=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}&sortOrder=${order}`;
      if (search && search.trim())
        url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data) {
        setUsers(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(response.data.pagination.currentPage - 1);
      } else {
        setUsers(response.data.data || response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.totalItems || 0);
        setCurrentPage(page - 1);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(t("You don't have permission to view users 9999"));
      } else {
        toast.error(t("Failed to fetch users"));
      }
      setUsers([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchUser(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    getUsers(1, sortByValue, searchUser, sortOrder);
  };

  const handleClearSearch = () => {
    setSearchUser("");
    setCurrentPage(0);
    getUsers(1, sortByValue, "", sortOrder);
  };

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setCurrentPage(selectedPage.selected);
    getUsers(newPage, sortByValue, searchUser, sortOrder);
  };

  const handleSort = (field) => {
    const newOrder =
      sortByValue === field && sortOrder === "asc" ? "desc" : "asc";
    setSortByValue(field);
    setSortOrder(newOrder);
    setCurrentPage(0);
    getUsers(1, field, searchUser, newOrder);
  };

  const getSortIcon = (field) => {
    if (sortByValue !== field) return "fa-sort";
    return sortOrder === "asc" ? "fa-sort-up" : "fa-sort-down";
  };
useEffect(() => {
    if (users.length > 0) {
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
  }, [users]);

  const columns = [
    {
      name: (
        <div onClick={() => handleSort("name")} className="cursor">
          {t("First Name")}
          <i className={`fa ${getSortIcon("name")} ms-1`}></i>
        </div>
      ),
      selector: row => row.name,
    },
    {
      name: (
        <div onClick={() => handleSort("email")} className="cursor d-flex align-items-center">
          {t("Email Address")}
          <i className={`fa ${getSortIcon("email")} ms-1`}></i>
        </div>
      ),
      selector: row => row.email,
    },
    {
      name: t('Phone Number'),
      selector: row => row.phone
    },
    {
      name: (
        <div onClick={() => handleSort("isActive")} className="cursor d-flex align-items-center">
          {t("Status")}
          <i className={`fa ${getSortIcon("isActive")} ms-1`}></i>
        </div>
      ),
      selector: row => row.isActive ? 'Active' : 'Deactivate',
      cell: row => (
        hasWritePermission() ? (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`flexSwitchCheckChecked-${row._id}`}
              checked={row.isActive}
              onChange={() => updateUserStatus(row._id)}
            />
          </div>
        )
          : (
            <>
              {row.isActive ? (
                <span className="badge bg-primary">Active</span>
              ) : (
                <span className="badge bg-secondary">Deactivate</span>
              )}
            </>
          )
      )
    },
    {
      name: t('Action'),
      cell: row => (
        hasWritePermission() && (
          <div className="d-flex position-relative custom-dropdown"
            data-label="Action">

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
              <ul className="dropdown-menu show right-side"
              >
                <li>
                  <button
                    className="admin_action_edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(row._id);
                      setOpenDropdownId(null);
                    }
                    }
                  >
                    <i className="fa-solid fa-pencil me-1"></i> {t("Edit")}
                  </button>
                </li>
                <li>
                  <button
                    className="admin_action_delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserDelete(row._id);
                      setOpenDropdownId(null);
                    }}
                  >
                    <i className="fa fa-trash me-1"></i> {t("Delete")}
                  </button>
                </li>
              </ul>
            )}
          </div>
        )
      )
    }
  ];
  useEffect(() => {
    const initializeUserPermissions = async () => {
      try {
        const userData = await getUserDetail();

        if (
          userData &&
          userData.rolePermissions &&
          userData.rolePermissions.menu
        ) {
          const usersMenu = userData.rolePermissions.menu.find(
            (menu) => menu.menuName === "Users"
          );

          if (usersMenu) {
            setUserPermissions({
              read: usersMenu.read || false,
              write: usersMenu.write || false,
              both: usersMenu.both || false,
              hasUsersMenu: true,
            });

            if (usersMenu.read || usersMenu.both) {
              getUsers(1);
            } else {
              toast.error(t("You don't have permission to access this page"));
            }
          } else {
            // User doesn't have Users menu access
            setUserPermissions({
              read: false,
              write: false,
              both: false,
              hasUsersMenu: false,
            });
            toast.error(t("You don't have permission to access this page"));
          }
        } else {
          // No role permissions found
          setUserPermissions({
            read: false,
            write: false,
            both: false,
            hasUsersMenu: false,
          });
          toast.error(t("You don't have permission to access this page"));
        }
      } catch (error) {
        setUserPermissions({
          read: false,
          write: false,
          both: false,
          hasUsersMenu: false,
        });
        toast.error(t("Error loading user permissions"));
      }
    };

    initializeUserPermissions();
  }, []); // Only run on component mount

  const handleUserDelete = (id) => {
    setUserId(id);
    setDeleteUser(true);
  };

  const handleNewUser = () => {
    setLoader(true);
    router.push("/admin/users/add-user");
  };

  const handleEditUser = (userId) => {
    setLoader(true);
    router.push(`/admin/users/${userId}`);
  };

  const handleDeleteSuccess = () => {
    setDeleteUser(false);
    getUsers(currentPage + 1, sortByValue, searchUser, sortOrder);
    // toast.success("User deleted successfully");
  };

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
                      <h1>{t("User List")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-3 col-md-4 col-12">
                      <div className="d-flex gap-2 align-items-center"></div>
                    </div>

                    <div className="col-lg-9 col-md-8 col-12">
                      <div className="filter_field">
                        <div className="form_group position-relative search-bar">
                          <input
                            type="text"
                            placeholder={t("Search by name, email, or phone...")}
                            className="form-control"
                            value={searchUser}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress}
                          />
                          <i
                            className="fa-solid fa-magnifying-glass"
                          ></i>
                        </div>

                        <button
                          className="button"
                          onClick={handleSearch}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : t("Search")}
                        </button>

                        {searchUser && (
                          <button
                            className="button ms-2"
                            onClick={handleClearSearch}
                            disabled={loading}
                          >
                            {t("Clear")}
                          </button>
                        )}

                        {hasWritePermission() && (
                          <button className="button" onClick={handleNewUser}>
                            {t("Add User")}
                          </button>
                        )}
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
                      data={users}
                      pagination
                      paginationServer
                      paginationTotalRows={totalItems}
                      paginationDefaultPage={currentPage + 1}
                      onChangePage={(page)=> getUsers(page, sortByValue, searchUser, sortOrder)}
                      paginationPerPage={itemsPerPage}
                      noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader && <Loader />}
      </div>

      {hasWritePermission() && (
        <DeleteUser
          show={deleteUser}
          data={userId}
          onHide={handleDeleteSuccess}
        />
      )}
    </>
  );
}
