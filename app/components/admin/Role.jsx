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
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [loader, setLoader] = useState(false);
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
  const [userPermissions, setUserPermissions] = useState({
    read: false,
    write: false,
    both: false,
    hasRolesMenu: false,
  });

  const router = useRouter();

  const getRole = async () => {
    try {
      let url = `${API_URL}user/role`;

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
        url: `${API_URL}user/me`,
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
        console.error("Error initializing user permissions:", error);
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
    useEffect(() => {
        if (users.length > 0) {
          setTimeout(() => {
            const allRows = document.querySelectorAll(".rdt_TableRow");
    
            if (allRows.length > 4) {
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
                  className="admin_action_edit"
                  onClick={(e) => { e.stopPropagation();handleUserUpdate(row._id);  setOpenDropdownId(null);}}
                >
                  <i className="fa fa-edit me-1"></i> {t("Edit")}
                </button>
              </li>
              {!row?.isSuperAdmin && (
                <li>
                  <button
                    className="admin_action_delete"
                    onClick={(e) => {e.stopPropagation(); handleUserDelete(row._id);setOpenDropdownId(null);}}
                  >
                    <i className="fa fa-trash me-1"></i> {t("Delete")}
                  </button>
                </li>
              )}
            </ul>
          )}
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
