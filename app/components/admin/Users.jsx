
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import DeleteUser from '../../(adminSide)/model/DeleteUser';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLink from "../CustomLink";

export default function Users() {
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
 

  const getUsers = async (page = 1, sort = sortByValue, search = searchUser, order = sortOrder ? "asc" : "desc") => {
    try {
      let url = `${API_URL}users?page=${page}&limit=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}:${order}`;
      if (search) url += `&name=${search}`;

      const response = await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("res", response.data);
      const userData = response.data;
      setUsers(userData.user);
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

  const handleSearch = () => {
    getUsers(1, sortByValue, searchUser, '');
  }

  const handleClearSearch = () => {
    setSearchUser("");
    getUsers(1, sortByValue, "", '');
  }

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    getUsers(newPage, sortByValue, searchUser, '');
  };

  useEffect(() => {
    getUsers(currentPage + 1);
  }, [currentPage]);

  

  const handleUserDelete = (id) => {
    setUserId(id);
    setDeleteUser(true)
  }

  const handleNewUser = () =>{
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
                      <h3>User List</h3>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-end gap-2">
                  
                    <div className="col-lg-4 col-md-6 col-12 p-0">
                      <div className="filter_field">
                        <div className="form_group">
                          <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="form-control"
                            value={searchUser}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress}
                          />
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        
                        <button className="button" onClick={handleSearch}>
                          Search
                        </button>
                        {searchUser && (
                          <button className="button ms-2" onClick={handleClearSearch} style={{ backgroundColor: '#6c757d' }}>
                            Clear
                          </button>
                        )}
                          <button className="button" onClick={handleNewUser}>
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            First Name
                          </th>

                          <th>Email Address</th>
                          <th>Phone Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {users && users.map((user, index) => {
                        
                            return (
                              <tr key={user._id}>
                                <td data-label="First Name">{user.name} </td>

                                <td data-label="Email Address">{user.email}</td>
                                  <td data-label="Email Address">{user.phone?user.phone:""}</td>

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
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="pagination-container">
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
                    />
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
