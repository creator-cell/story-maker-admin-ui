"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import DeleteAsset from "../../(adminSide)/model/DeleteAssets";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FileIcon, defaultStyles } from "react-file-icon";
import { IconDownload, IconEye, IconView360 } from "@tabler/icons-react";
import useDownloader from "react-use-downloader";
import { FormSelect } from "react-bootstrap";
import Loader from "../Loader";

const AssetsManage = () => {
  const { download, isInProgress } = useDownloader();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_ASSET;
  const USER_API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
  const [loader, setLoader] = useState(false);
  const [assets, setAssets] = useState([]);
  const [deleteAssets, setDeleteAssets] = useState(false);
  const [assetsId, setAssetsId] = useState();
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

  const hasReadPermission = () => {
    return userPermissions.read || userPermissions.both;
  };

  const hasUsersMenuAccess = () => {
    return userPermissions.hasUsersMenu;
  };

  const getAssets = async (
    page = 1,
    sort = sortByValue,
    search = "",
    order = sortOrder
  ) => {
    try {
      setLoader(true);
      let url = `${API_URL}assets?page=${page}&pageSize=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}&sortOrder=${order}`;
      if (search && search.trim())
        url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await axios({
        url: url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAssets(response.data?.data?.assets?.items);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to view users 9999");
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleAssetStatus = (assetId, status) => {
    const allAssetStatus = ["Pending", "Reject", "Approve"];
    if (!allAssetStatus.includes(status)) {
      return;
    }
    setLoader(true);
    axios({
      method: "PUT",
      url: `${API_URL}assets/status/${assetId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: JSON.stringify({
        status: status,
      }),
    })
      .then((res) => {
        toast(res?.data?.message || "Status updated successfully", {
          type: "success",
          theme: "light",
          position: "top-right",
        });
        setAssets((prevState) =>
          prevState?.map((p) => {
            if (p?._id == assetId) {
              return { ...p, status: status };
            } else {
              return p;
            }
          })
        );
      })
      .catch((err) => {
        toast("Failed to update status", {
          type: "error",
          theme: "light",
          position: "top-right",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const getUserDetail = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL_USER}me`,
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

  const handleEditAssets = (updateAssetId) => {
    router.push(`/admin/assets/${updateAssetId}`);
  };

  const handleCloneAssets = (cloneAssetId) => {
    setLoader(true);
    axios({
      url: `${API_URL}assets/clone`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        assetId: cloneAssetId,
      },
    })
      .then((res) => {
        toast(res.data?.message || "Assets clone successfully", {
          type: "success",
          position: "top-right",
          theme: "light",
        });
        router.push(`/admin/assets/${res?.data?.data?.cloneId}`);
      })
      .catch((err) => {
        toast(err?.response?.data?.message || "Failed to clone assets", {
          type: "error",
          position: "top-right",
          theme: "light",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleAssetDelete = (deleteAssetId) => {
    setAssetsId(deleteAssetId);
    setDeleteAssets(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteAssets(false);
    getAssets();
  };

  const showAssetsStatus = (status) => {
    if (status == "Approve") {
      return <span class="badge bg-primary">Approve</span>;
    } else if (status == "Reject") {
      return <span class="badge badge-danger">Reject</span>;
    } else {
      return <span class="badge bg-warning">Pending</span>;
    }
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
            (menu) => menu.menuName === "Assets"
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
              // getAssets(1);
              getAssets(1);
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
                      <h3>Assets List</h3>
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
                              router.push("/admin/assets/addassets");
                            }}
                          >
                            Add Assets
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
                            Document
                          </th>
                          <th style={{ cursor: "pointer", width: "7%" }}>
                            Type
                          </th>
                          <th style={{ cursor: "pointer", width: "7%" }}>
                            Format
                          </th>
                          <th style={{ cursor: "pointer", width: "20%" }}>
                            Description
                          </th>
                          <th style={{ cursor: "pointer", width: "15%" }}>
                            Tags
                          </th>
                          <th style={{ cursor: "pointer", width: "15%" }}>
                            Status
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
                          assets &&
                          assets?.map((asset, index) => {
                            return (
                              <tr key={asset._id}>
                                <td data-label="Date">
                                  {new Date(
                                    asset?.createdAt
                                  )?.toLocaleDateString()}
                                </td>
                                <td data-label="Name">{asset?.name}</td>
                                <td data-label="Document">
                                  {asset?.url ? (
                                    <>
                                      <small className="d-flex align-items-center gap-2">
                                        <div
                                          className="doc-file"
                                          style={{ width: 50, height: 50 }}
                                        >
                                          <FileIcon
                                            extension={
                                              asset?.url
                                                ?.split("/assets/")[1]
                                                ?.split(".")[1]
                                            }
                                            {...defaultStyles[
                                              asset?.url
                                                ?.split("/assets/")[1]
                                                ?.split(".")[1]
                                            ]}
                                          />
                                        </div>
                                        {/* <button disabled={isInProgress} className='button align-self-end yellow p-1 rounded-pill' onClick={() => download(asset?.url, asset?.url?.split('/assets/')[1])}>
                                      <IconDownload size={20} stroke={2} />
                                    </button> */}
                                        <a
                                          target="_blank"
                                          href={asset?.url}
                                          disabled={isInProgress}
                                          className="button align-self-end yellow p-1 rounded-pill"
                                        >
                                          <IconEye size={20} stroke={2} />
                                        </a>
                                      </small>
                                    </>
                                  ) : null}
                                  {}
                                </td>
                                <td data-label="Type">{asset?.type}</td>
                                <td data-label="Format">{asset?.format}</td>
                                <td data-label="Description">
                                  {asset?.description}
                                </td>
                                <td data-label="Tags">
                                  <div class="flex flex-wrap gap-3">
                                    {asset?.tags?.map((p) => (
                                      <span class="badge bg-info text-dark m-1">
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td data-label="Status">
                                  {hasWritePermission() ? (
                                    <FormSelect
                                      style={{
                                        width: "80%",
                                        fontSize: 10,
                                        margin: 1,
                                      }}
                                      onChange={(t) => {
                                        const currentValue = t.target.value;
                                        if (currentValue == "Pending") {
                                          return;
                                        } else {
                                          handleAssetStatus(
                                            asset?._id,
                                            currentValue
                                          );
                                        }
                                      }}
                                    >
                                      <option
                                        value="Pending"
                                        selected={asset?.status == "Pending"}
                                      >
                                        <small>Pending</small>
                                      </option>
                                      <option
                                        value="Approve"
                                        selected={asset?.status == "Approve"}
                                      >
                                        <small>Approve</small>
                                      </option>
                                      <option
                                        value="Reject"
                                        selected={asset?.status == "Reject"}
                                      >
                                        <small>Reject</small>
                                      </option>
                                    </FormSelect>
                                  ) : (
                                    showAssetsStatus()
                                  )}
                                </td>
                                <td data-label="Uploaded By">
                                  {asset?.uploadedBy?.email}
                                </td>

                                {hasWritePermission() && (
                                  <td data-label="Action">
                                    <div className="d-flex justify-content-start align-items-center gap-2">
                                      <button
                                        className="admin_action_edit"
                                        onClick={() =>
                                          handleEditAssets(asset._id)
                                        }
                                        title="Edit Asset"
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                      <button
                                        className="admin_action_edit"
                                        onClick={() =>
                                          handleCloneAssets(asset._id)
                                        }
                                        title="Clone Asset"
                                      >
                                        <i className="fa fa-clone"></i>
                                      </button>
                                      <button
                                        className="admin_action_delete"
                                        onClick={() =>
                                          handleAssetDelete(asset._id)
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

                        {!loading && assets?.length === 0 && (
                          <tr>
                            <td
                              colSpan={hasWritePermission() ? "4" : "3"}
                              className="text-center py-4"
                            >
                              {/* { ? 
                                `No users found matching "${searchUser}"` :  */}
                              No assets found
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
        <DeleteAsset
          show={deleteAssets}
          data={assetsId}
          onHide={handleDeleteSuccess}
          setLoader={setLoader}
        />
      )}
      {loader && <Loader />}
    </>
  );
};

export default AssetsManage;
