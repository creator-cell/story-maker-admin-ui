
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import DeleteUser from '../../(adminSide)/model/DeleteUser';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLink from "../CustomLink";

export default function Roles() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [userId, setUserId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortByValue, setSortByValue] = useState("");
  const itemsPerPage = 20;
  const [sortOrder, setSortOrder] = useState(true);
  const router = useRouter();


  const getRole = async () => {
    try {
      let url = `${API_URL}/role?`;

      const response = await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("res", response.data);
      const userData = response.data;
      setUsers(userData);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page - 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  const handleSearchInputChange = (e) => {
    setSearchUser(e.target.value);
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }


  useEffect(() => {
    getRole();
  }, []);



  const handleUserDelete = (id) => {
    setUserId(id);
    setDeleteUser(true)
  }

  const handleNewUser = () => {
    router.push('/admin/users/add-user');
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
                      
                        <button className="button" onClick={handleNewUser}>
                          Add Role
                        </button>
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

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {users && users.map((user, index) => {

                          return (
                            <tr key={user._id}>
                              <td data-label="First Name">{user.name} </td>

                              <td data-label="Email Address">{user.menu ? user.menu : ""}</td>

                              <td data-label="Email Address">{user.read ? user.read : ""}</td>

                              <td data-label="Email Address">{user.write ? user.write : ""}</td>


                              <td data-label="Action">
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                  <CustomLink
                                    href={`/admin/users/${user._id}`} className="admin_action_btn">
                                    <i className="fa fa-edit"></i>
                                  </CustomLink>

                                  <button className="admin_action_btn"
                                    onClick={() => handleUserDelete(user._id)}>
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </td>
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
        onHide={() => (setDeleteUser(false), getUsers())}
      />
    </>
  );
}
