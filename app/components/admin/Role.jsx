"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import DeleteUser from "../../[locale]/(adminSide)/model/DeleteRole";
import EditRole from "../../[locale]/(adminSide)/model/EditRole";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLink from "../CustomLink";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import DataTable from 'react-data-table-component';

export default function Roles() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

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
  const columns = [
    {
      name: t('Name'),
      selector: row => row.name,
      cell: row => <span>{row.name}</span>,
    },
    {
      name: t('Menus & Permissions'),
      cell: row =>
        row.menu && row.menu.length > 0 ? (
          <div>
            {row.menu.map((item, i) => (
              <div key={i}>{item.menuName}</div>
            ))}
          </div>
        ) : (
          <span className="text-muted">{t("No permissions assigned")}</span>
        ),
    },
    {
      name: t('Read'),
      cell: row =>
        row.menu && row.menu.length > 0 ? (
          <div>
            {row.menu.map((item, i) => (
              <div key={i}>
                <input type="checkbox" checked={item.read} readOnly />
              </div>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      name: t('Write'),
      cell: row =>
        row.menu && row.menu.length > 0 ? (
          <div>
            {row.menu.map((item, i) => (
              <div key={i}>
                <input type="checkbox" checked={item.write} readOnly />
              </div>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      name: t('Both'),
      cell: row =>
        row.menu && row.menu.length > 0 ? (
          <div>
            {row.menu.map((item, i) => (
              <div key={i}>
                <input type="checkbox" checked={item.both} readOnly />
              </div>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      name: t('Action'),
      cell: row => (
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
              aria-labelledby={`dropdownMenuButton-${row._id}`}
            >
              <li>
                <button
                  className="admin_action_edit"
                  onClick={() => handleUserUpdate(row._id)}
                >
                  <i className="fa fa-edit me-1"></i> {t("Edit")}
                </button>
              </li>
              {!row?.isSuperAdmin && (
                <li>
                  <button
                    className="admin_action_delete"
                    onClick={() => handleUserDelete(row._id)}
                  >
                    <i className="fa fa-trash me-1"></i> {t("Delete")}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      ),
      width: "120px",
    }
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
                      <h1>{t("Role list")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-end">
                    <div className="col-lg-12 col-md-12 col-12 p-0 flex-end">
                      <div className="form_group position-relative align-items-end">
                        {hasWritePermission() && (
                          <button className="button" onClick={handleNewUser}>
                            {t("Add Role")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <DataTable
                      columns={columns}
                      data={users}
                      pointerOnHover
                      noDataComponent={t("No role found")}
                    />

                    {/* <table className="table">
                      <thead>
                        <tr>
                          <th>{t("Name")}</th>
                          <th>{t("Menus & Permissions")}</th>
                          <th>{t("Read")}</th>
                          <th>{t("Write")}</th>
                          <th>{t("Both")}</th>
                          {hasWritePermission() && <th>{t("Action")}</th>}
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {users &&
                          users.map((user) =>
                            user.menu && user.menu.length > 0 ? (
                              user.menu.map((menuItem, idx) => (
                                <tr key={`${user._id}-${idx}`}>
                                  {idx === 0 && <td data-label="Name" className="checkbox" rowSpan={user.menu.length}>{user.name}</td>}

                                  <td className="checkbox" data-label="Menus & Permissions" >{menuItem.menuName}</td>

                                  <td data-label="Read" className="checkbox border-1">
                                    <div className="form-check">
                                      <input type="checkbox" className="form-check-input" checked={menuItem.read} readOnly />
                                    </div>
                                  </td>
                                  <td className="checkbox" data-label="Write">
                                    <div className="form-check">
                                      <input type="checkbox" className="form-check-input" checked={menuItem.write} readOnly />
                                    </div>
                                  </td>
                                  <td className="checkbox" data-label="Both">
                                    <div className="form-check">
                                      <input type="checkbox" className="form-check-input" checked={menuItem.both} readOnly />
                                    </div>
                                  </td>

                                  {hasWritePermission() && idx === 0 && (
                                    <td rowSpan={user.menu.length} data-label="Action">
                                      <div className="dropdown">
                                        <button
                                          className="border-0 bg-transparent"
                                          type="button"
                                          id={`dropdownMenuButton-${user._id}`}
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i class="fa fa-ellipsis"></i>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${user._id}`}>
                                          <li><button
                                            className="admin_action_edit"
                                            onClick={() => handleUserUpdate(user._id)}
                                          >
                                            <i className="fa fa-edit me-2"></i>Edit
                                          </button></li>
                                          <li> {!user?.isSuperAdmin ? (
                                            <button
                                              className="admin_action_delete"
                                              onClick={() => handleUserDelete(user._id)}
                                            >
                                              <i className="fa fa-trash me-2"></i>Delete
                                            </button>
                                          ) : null}</li>
                                        </ul>


                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr key={user._id}>
                                <td>{user.name}</td>
                                <td colSpan="4" className="text-muted">
                                  {t("No permissions assigned")}
                                </td>
                                {hasWritePermission() && (
                                  <td>
                                    <button
                                      className="admin_action_edit"
                                      onClick={() => handleUserUpdate(user._id)}
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                    {!user?.isSuperAdmin ? (
                                      <button
                                        className="admin_action_delete"
                                        onClick={() => handleUserDelete(user._id)}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    ) : null}
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center">
                              {t("No role found")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table> */}
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
