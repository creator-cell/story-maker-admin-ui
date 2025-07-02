
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import DeleteUser from '../../(adminSide)/model/DeleteRole';
import EditRole from '../../(adminSide)/model/EditRole'
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLink from "../CustomLink";

export default function Roles() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [userPermissions, setUserPermissions] = useState({
    read: false,
    write: false,
    both: false
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
      console.log("res", response.data);
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
            hasUsersMenu: user.role.menu && user.role.menu.includes("Users")
          };
        }
      }
      return { read: false, write: false, both: false, hasUsersMenu: false };
    } catch (error) {
      console.error("Error parsing user permissions:", error);
      return { read: false, write: false, both: false, hasUsersMenu: false };
    }
  };

  // Check if user has write permissions
  const hasWritePermission = () => {
    return userPermissions.write || userPermissions.both;
  };


  const hasReadPermission = () => {
    return userPermissions.read || userPermissions.both;
  };


  const hasUsersMenuAccess = () => {
    return userPermissions.hasUsersMenu;
  };

  useEffect(() => {
    // Set user permissions on component mount
    const permissions = getUserPermissions();
    setUserPermissions(permissions);

    // Only fetch users if user has read permission and Users menu access
    if ((permissions.read || permissions.both) && permissions.hasUsersMenu) {
      getRole(1);
    } else {
      toast.error("You don't have permission to access this page");
    }
  }, []);
  useEffect(() => {
    getRole();
  }, []);



  const handleUserDelete = (id) => {
    setUserId(id);
    setDeleteUser(true)
  }

  const handleUserUpdate = (id) => {
    setUpdateUser(true);
    setUpdateUserId(id);
  }

  const handleNewUser = () => {
    router.push('/admin/role/add-role');
  }

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
                  <div className="row table_filter justify-content-end gap-2">

                    <div className="col-lg-4 col-md-6 col-12 p-0">
                      <div className="filter_field">

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
                          <th>Menus</th>
                          <th>Read</th>
                          <th>Write</th>
                          <th>Both</th>

                          {hasWritePermission() && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {users && users.map((user, index) => {

                          return (
                            <tr key={user._id}>
                              <td data-label="First Name">{user.name} </td>

                              <td data-label="Email Address">
                                {user.menu ? (Array.isArray(user.menu) ? user.menu.join(', ') : user.menu) : ""}
                              </td>

                              <td data-label="Email Address">{user.read === true ? "Yes" : "No"}</td>

                              <td data-label="Email Address">{user.write === true ? "Yes" : "No"}</td>
                              <td data-label="Email Address">{user.both === true ? "Yes" : "No"}</td>

                              {hasWritePermission() &&
                                <td data-label="Action">
                                  <div className="d-flex justify-content-start align-items-center gap-2">
                                    <button className="admin_action_btn"
                                      onClick={() => handleUserUpdate(user)}>
                                      <i className="fa fa-edit"></i>
                                    </button>

                                    <button className="admin_action_btn"
                                      onClick={() => handleUserDelete(user._id)}>
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </td>}
                            </tr>
                          )

                        })}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="9" className="text-center">
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
