"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FileIcon, defaultStyles } from "react-file-icon";
import { IconDownload, IconEye, IconView360 } from "@tabler/icons-react";
import useDownloader from "react-use-downloader";
import { FormSelect } from "react-bootstrap";
import Loader from "../Loader";
import DeletePlan from "@/app/(adminSide)/model/DeletePlan";

const PlansManage = () => {
  const { download, isInProgress } = useDownloader();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_PLANS;
  const [loader, setLoader] = useState(false);
  const [plans, setPlans] = useState([]);
  const [deletePlans, setDeletePlans] = useState(false);
  const [plansId, setPlansId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortByValue, setSortByValue] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [userPermissions, setUserPermissions] = useState({
    read: false,
    write: false,
    both: false,
  });
  const itemsPerPage = 20;
  const router = useRouter();

  const hasWritePermission = () => {
    return userPermissions.write || userPermissions.both;
  };

  const getPlans = async (
    page = 1,
    sort = sortByValue,
    search = "",
    order = sortOrder
  ) => {
    try {
      setLoading(true);
      let url = `${API_URL}plan?page=${page}&pageSize=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}&sortOrder=${order}`;
      if (search && search.trim())
        url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await axios({
        url: url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setPlans(response.data?.data?.plan?.items);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to view users 9999");
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setLoading(false);
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

      return response.data;
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  };

  const handleEditPlans = (updateAssetId) => {
    router.push(`/admin/plans/${updateAssetId}`);
  };

  const handlePlanDelete = (deletePlanId) => {
    setPlansId(deletePlanId);
    setDeletePlans(true);
  };

  const handleDeleteSuccess = () => {
    setDeletePlans(false);
    getPlans();
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
            (menu) => menu.menuName === "Plans"
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
              getPlans(1);
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
  }, []); // Only run on component mount

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
                      <h3>Plans List</h3>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="d-flex gap-2 align-items-center"></div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        {/* <div className="form_group position-relative">
                          <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="form-control"
                          />
                          <i className="fa-solid fa-magnifying-glass position-absolute"
                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>
                          </i>
                        </div> */}

                        {/* <button className="button" onClick={handleSearch} disabled={loading}>
                          {loading ? "Searching..." : "Search"}
                        </button> */}

                        {/* {searchUser && (
                          <button 
                            className="button ms-2" 
                            onClick={handleClearSearch} 
                            style={{ backgroundColor: '#6c757d' }}
                            disabled={loading}
                          >
                            Clear
                          </button>
                        )} */}

                        {hasWritePermission() && (
                          <button
                            className="button"
                            onClick={() => {
                              router.push("/admin/plans/addplans");
                            }}
                          >
                            Add Plan
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
                          <th style={{ cursor: "pointer", width: "10%" }}>
                            Date
                          </th>
                          <th style={{ cursor: "pointer", width: "12%" }}>
                            Name
                          </th>
                          <th style={{ cursor: "pointer", width: "10%" }}>
                            Title
                          </th>
                          <th style={{ cursor: "pointer", width: "7%" }}>
                            Description
                          </th>
                          <th style={{ cursor: "pointer", width: "7%" }}>
                            Price
                          </th>
                          <th style={{ cursor: "pointer", width: "20%" }}>
                            Duration
                          </th>
                          <th style={{ cursor: "pointer", width: "15%" }}>
                            Features
                          </th>
                          <th style={{ cursor: "pointer", width: "10%" }}>
                            Uploaded By
                          </th>

                          {hasWritePermission() && (
                            <th style={{ width: "10%" }}>Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="table_body">
                        {!loading &&
                          plans &&
                          plans?.map((plan, index) => {
                            return (
                              <tr key={plan._id}>
                                <td data-label="Date">
                                  {new Date(
                                    plan?.createdAt
                                  )?.toLocaleDateString()}
                                </td>
                                <td data-label="Name">{plan?.name}</td>
                                <td data-label="Title">
                                  <small className="d-flex align-items-center gap-2">
                                    {plan?.title}
                                  </small>
                                </td>
                                <td data-label="Description">
                                  {plan?.description}
                                </td>
                                <td data-label="Price">
                                  {plan?.price
                                    ? parseFloat(plan?.price).toFixed(2)
                                    : ""}
                                </td>
                                <td data-label="Duration">
                                  {plan?.duration ? (
                                    <span className="badge bg-success text-light m-1">
                                      {plan?.duration}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td data-label="Features">
                                  <div className="flex flex-wrap gap-3">
                                    {plan?.features?.map((p) => (
                                      <span className="badge bg-info text-dark m-1">
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td data-label="Uploaded By">
                                  {plan?.uploadedBy?.email}
                                </td>

                                {hasWritePermission() && (
                                  <td data-label="Action">
                                    <div className="d-flex justify-content-start align-items-center gap-2">
                                      <button
                                        className="admin_action_edit"
                                        onClick={() =>
                                          handleEditPlans(plan._id)
                                        }
                                        title="Edit Asset"
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                      <button
                                        className="admin_action_delete"
                                        onClick={() =>
                                          handlePlanDelete(plan._id)
                                        }
                                        title="Delete User"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}

                        {!loading && plans?.length === 0 && (
                          <tr>
                            <td
                              colSpan={hasWritePermission() ? "4" : "3"}
                              className="text-center py-4"
                            >
                              {/* { ? 
                                `No users found matching "${searchUser}"` :  */}
                              No plans found
                              {/* } */}
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
      </div>

      {hasWritePermission() && (
        <DeletePlan
          show={deletePlans}
          data={plansId}
          onHide={handleDeleteSuccess}
          setLoader={setLoader}
        />
      )}
      {loader && <Loader />}
    </>
  );
};

export default PlansManage;
