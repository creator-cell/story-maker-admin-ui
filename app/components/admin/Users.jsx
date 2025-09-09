"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import DeleteUser from "../../(adminSide)/model/DeleteUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function Users() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
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
  const itemsPerPage = 20;
  const router = useRouter();
  const [role, setRole] = useState("");
  const [userRolePermissions, setUserRolePermissions] = useState(null);

  const updateUserStatus = async (updateUserId) => {
    try {
      const response = await axios({
        url: `${API_URL}users/status/${updateUserId}`,
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
        url: `${API_URL}me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.rolePermissions) {
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
      let url = `${API_URL}users?page=${page}&pageSize=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}&sortOrder=${order}`;
      if (search && search.trim())
        url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

    
      if (response.data) {
        setUsers(response.data.data);
        console.log(response.data);
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
        toast.error("You don't have permission to view users 9999");
      } else {
        toast.error("Failed to fetch users");
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
              toast.error("You don't have permission to access this page");
            }
          } else {
            // User doesn't have Users menu access
            setUserPermissions({
              read: false,
              write: false,
              both: false,
              hasUsersMenu: false,
            });
            toast.error("You don't have permission to access this page");
          }
        } else {
          // No role permissions found
          setUserPermissions({
            read: false,
            write: false,
            both: false,
            hasUsersMenu: false,
          });
          toast.error("You don't have permission to access this page");
        }
      } catch (error) {
        setUserPermissions({
          read: false,
          write: false,
          both: false,
          hasUsersMenu: false,
        });
        toast.error("Error loading user permissions");
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
    //toast.success("User deleted successfully");
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
                      <h1>User List</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="d-flex gap-2 align-items-center"></div>
                    </div>

                    <div className="col-lg-8 col-md-6 col-12">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        <div className="form_group position-relative">
                          <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="form-control"
                            value={searchUser}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress}
                          />
                          <i
                            className="fa-solid fa-magnifying-glass"
                            // style={{
                            //   right: "10px",
                            //   top: "50%",
                            //   transform: "translateY(-50%)",
                            //   color: "#6c757d",
                            // }}
                          ></i>
                        </div>

                        <button
                          className="button"
                          onClick={handleSearch}
                          disabled={loading}
                        >
                          {loading ? "Searching..." : "Search"}
                        </button>

                        {searchUser && (
                          <button
                            className="button ms-2"
                            onClick={handleClearSearch}
                            // style={{ backgroundColor: "#6c757d" }}
                            disabled={loading}
                          >
                            Clear
                          </button>
                        )}

                        {hasWritePermission() && (
                          <button className="button" onClick={handleNewUser}>
                            Add User
                          </button>
                        )}
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
                            // style={{ cursor: "pointer" }}
                            onClick={() => handleSort("name")}
                          >
                            First Name
                            <i className={`fa ${getSortIcon("name")} ms-1`}></i>
                          </th>
                          <th className="cursor"
                            // style={{ cursor: "pointer" }}
                            onClick={() => handleSort("email")}
                          >
                            Email Address
                            <i
                              className={`fa ${getSortIcon("email")} ms-1`}
                            ></i>
                          </th>
                          <th>Phone Number</th>
                          <th className="cursor"
                            // style={{ cursor: "pointer" }}
                            onClick={() => handleSort("isActive")}
                          >
                            Status
                            <i
                              className={`fa ${getSortIcon("isActive")} ms-1`}
                            ></i>
                          </th>

                          {hasWritePermission() && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          users &&
                          users.map((user, index) => {
                            return (
                              <tr key={user._id}>
                                <td data-label="First Name">{user.name}</td>
                                <td data-label="Email Address">{user.email}</td>
                                <td data-label="Phone Number">
                                  {user.phone || user.phone || ""}
                                </td>
                                <td>
                                  {hasWritePermission() ? (
                                    <div class="form-check form-switch">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="flexSwitchCheckChecked"
                                        checked={user?.isActive}
                                        onChange={() => {
                                          updateUserStatus(user._id);
                                        }}
                                      />
                                      <label
                                        class="form-check-label"
                                        for="flexSwitchCheckChecked"
                                      >
                                        Active
                                      </label>
                                    </div>
                                  ) : (
                                    <>
                                      {user?.isActive ? (
                                        <span class="badge bg-primary">
                                          Active
                                        </span>
                                      ) : (
                                        <span class="badge bg-secondary">
                                          Deactivate
                                        </span>
                                      )}
                                    </>
                                  )}
                                </td>

                                {hasWritePermission() && (
                                  <td data-label="Action">
                                    <div className="d-flex justify-content-start align-items-center">
                                      <button
                                        className="admin_action_edit"
                                        onClick={() => handleEditUser(user._id)}
                                        // title="Edit User"
                                      >
                                       <i class="fa-solid fa-pencil"></i>
                                      </button>
                                      <button
                                        className="admin_action_delete"
                                        onClick={() =>
                                          handleUserDelete(user._id)
                                        }
                                        // title="Delete User"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                )}
                            </tr>
                          );
                        })}

                        {!loading && users.length === 0 && (
                          <tr>
                            <td
                              colSpan={hasWritePermission() ? "4" : "3"}
                              className="text-center py-4"
                            >
                              {searchUser
                                ? `No users found matching "${searchUser}"`
                                : "No users found"}
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
