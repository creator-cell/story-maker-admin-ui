"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import DeleteUser from "../../(adminSide)/model/DeleteRole";
import EditRole from "../../(adminSide)/model/EditRole";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLink from "../CustomLink";
import Loader from "../Loader";

export default function Roles() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [loader, setLoader] = useState(false);

  const [userPermissions, setUserPermissions] = useState({
    read: false,
    write: false,
    both: false,
    hasRolesMenu: false,
  });

  const router = useRouter();

  const getRole = async () => {
    try {
      let url = `${API_URL}role`;

      const response = await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const userData = response.data;
      setUsers(userData.roles);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserPermissions = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role) {
          return {
            read: user.role.read || false,
            write: user.role.write || false,
            both: user.role.both || false,
            hasUsersMenu: user.role.menu && user.role.menu.includes("Users"),
          };
        }
      }
      return { read: false, write: false, both: false, hasUsersMenu: false };
    } catch (error) {
      console.error("Error parsing user permissions:", error);
      return { read: false, write: false, both: false, hasUsersMenu: false };
    }
  };

  const getUserDetail = async () => {
    setLoader(true);
    try {
      const response = await axios({
        url: `${API_URL}me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLoader(false);
      return response.data;
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  };

  // Check if user has write permissions
  const hasWritePermission = () => {
    return userPermissions.write || userPermissions.both;
  };

  const hasReadPermission = () => {
    return userPermissions.read || userPermissions.both;
  };

  const hasRolesMenuAccess = () => {
    return userPermissions.hasRolesMenu;
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
          // Find the Users menu permissions
          const usersMenu = userData.rolePermissions.menu.find(
            (menu) => menu.menuName === "Roles"
          );

          if (usersMenu) {
            // Set permissions based on the Users menu
            setUserPermissions({
              read: usersMenu.read || false,
              write: usersMenu.write || false,
              both: usersMenu.both || false,
              hasUsersMenu: true,
            });

            // If user has read permission or both, fetch users
            if (usersMenu.read || usersMenu.both) {
              getRole(1);
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
        console.error("Error initializing user permissions:", error);
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
  }, []);

  const handleUserDelete = (id) => {
    setUserId(id);
    setDeleteUser(true);
  };

  const handleUserUpdate = (id) => {
    setLoader(true);
    router.push(`/admin/role/${id}`);
  };

  const handleNewUser = () => {
    setLoader(true);
    router.push("/admin/role/add-role");
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
                      <h3>Role list</h3>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-end">
                    <div className="col-lg-12 col-md-12 col-12 p-0 flex-end">
                      <div className="form_group position-relative align-items-end">
                        {hasWritePermission() && (
                          <button className="button" onClick={handleNewUser}>
                            Add Role
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Menus & Permissions</th>
                          {hasWritePermission() && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {users &&
                          users.map((user, index) => {
                            return (
                              <tr key={user._id}>
                                <td data-label="Name">{user.name}</td>

                                <td data-label="Menus & Permissions">
                                  {user.menu && user.menu.length > 0 ? (
                                    <div>
                                      {user.menu.map((menuItem, idx) => (
                                        <div
                                          key={idx}
                                          className="permission-item mb-2 p-2 border rounded"
                                        >
                                          <div className="menu-header mb-1">
                                            <strong className="text-primary">
                                              {menuItem.menuName}
                                            </strong>
                                          </div>
                                          <div className="permission-badges">
                                            {menuItem.read && (
                                              <span className="badge bg-success me-1">
                                                Read
                                              </span>
                                            )}
                                            {menuItem.write && (
                                              <span className="badge bg-warning me-1">
                                                Write
                                              </span>
                                            )}
                                            {menuItem.both && (
                                              <span className="badge bg-info me-1">
                                                Both
                                              </span>
                                            )}
                                            {!menuItem.read &&
                                              !menuItem.write &&
                                              !menuItem.both && (
                                                <span className="badge bg-secondary">
                                                  No Access
                                                </span>
                                              )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted">
                                      No permissions assigned
                                    </span>
                                  )}
                                </td>

                                {hasWritePermission() && (
                                  <td data-label="Action">
                                    <div className="d-flex justify-content-start align-items-center gap-2">
                                      <button
                                        className="admin_action_edit"
                                        onClick={() =>
                                          handleUserUpdate(user._id)
                                        }
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                      {!user?.isSuperAdmin ? (
                                        <button
                                          className="admin_action_delete"
                                          onClick={() =>
                                            handleUserDelete(user._id)
                                          }
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      ) : null}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="3" className="text-center">
                              No role found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader && <Loader />}
      </div>
      <DeleteUser
        show={deleteUser}
        data={userId}
        onHide={() => (setDeleteUser(false), getRole())}
      />
      <EditRole
        show={updateUser}
        data={updateUserId}
        onHide={() => (setUpdateUser(false), getRole())}
      />
    </>
  );
}
