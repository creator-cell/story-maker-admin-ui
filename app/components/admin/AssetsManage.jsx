"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
// import DeleteAsset from "../../../(adminSide)/model/DeleteAssets";
import DeleteAsset from "@/app/[locale]/(adminSide)/model/DeleteAssets";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FileIcon, defaultStyles } from "react-file-icon";
import { IconDownload, IconEye, IconView360 } from "@tabler/icons-react";
import useDownloader from "react-use-downloader";
import { FormSelect } from "react-bootstrap";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

const AssetsManage = () => {
  const { t } = useTranslation();
  const { download, isInProgress } = useDownloader();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_ASSETS;
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
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        toast.error(t("You don't have permission to view users 9999"));
        toast.error(t("You don't have permission to view users 9999"));
      } else {
        toast.error(t("Failed to fetch users"));
        toast.error(t("Failed to fetch users"));
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
        toast(t("Status updated successfully"), {
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
        toast(t("Failed to update status"), {
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
    setLoader(true);
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
        toast(t("Assets clone successfully"), {
          type: "success",
          position: "top-right",
          theme: "light",
        });
        router.push(`/admin/assets/${res?.data?.data?.cloneId}`);
      })
      .catch((err) => {
        toast(t("Failed to clone assets"), {
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
      return <span className="badge bg-primary">Approve</span>;
    } else if (status == "Reject") {
      return <span className="badge badge-danger">Reject</span>;
    } else {
      return <span className="badge bg-warning">Pending</span>;
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
  }, []); // Only run on component mount
  useEffect(() => {
    if (assets.length > 0) {
      setTimeout(() => {
        const allRows = document.querySelectorAll(".rdt_TableRow");

        if (allRows.length > 3) {
          allRows.forEach((row) => row.classList.remove("drop-up"));
          const lastThree = Array.from(allRows).slice(-3);
          lastThree.forEach((row) => row.classList.add("drop-up"));
        } else {
          allRows.forEach((row) => row.classList.remove("drop-up"));
        }
      }, 0);
    }
  }, [assets]);
  const columns = [
    {
      name: t("Date"),
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      width: "120px",
    },
    {
      name: t("Name"),
      selector: (row) => row.name,
      maxWidth: "180px",
    },
    {
      name: t("Document"),
      cell: (row) =>
        row.url ? (
          <small className="d-flex align-items-center gap-2">
            <div className="doc-file">
              <FileIcon
                extension={row.url.split("/assets/")[1]?.split(".")[1]}
                {...defaultStyles[row.url.split("/assets/")[1]?.split(".")[1]]}
              />
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={row.url}
              disabled={isInProgress}
              className="button"
            >
              <IconEye size={20} stroke={2} />
            </a>
          </small>
        ) : null,
      width: "100px",
    },
    {
      name: t("Type"),
      selector: (row) => row.type,
      width: "100px",
    },
    {
      name: t("Format") || t("no Format"),
      selector: (row) => row.format,
      width: "100px",
    },
    {
      name: t("Description") || t("no Description"),
      selector: (row) => row.description,
      width: "200px",
      wrap: true,
    },
    {
      name: t("Tags") || t("no Tags"),
      cell: (row) => (
        <div className="d-flex flex-wrap gap-1 justify-content-start">
          {row.tags?.map((p) => (
            <span className="badge text-white m-1" key={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </span>
          ))}
        </div>
      ),
      maxWidth: "180px",
    },
    {
      name: t("Status"),
      cell: (row) =>
        hasWritePermission() ? (
          <FormSelect
            className="status-dropdown"
            onChange={(e) => {
              const value = e.target.value;
              if (value !== "Pending") handleAssetStatus(row._id, value);
            }}
            value={row.status}
          >
            <option value="Pending">{t("Pending")}</option>
            <option value="Approve">{t("Approve")}</option>
            <option value="Reject">{t("Reject")}</option>
          </FormSelect>
        ) : (
          <span>{row.status}</span>
        ),
      width: "150px",
    },
    {
      name: t("Uploaded By"),
      selector: (row) => row.uploadedBy?.email,
      width: "180px",
    },
    {
      name: t("Action"),
      cell: (row) =>
        hasWritePermission() && (
          <div className="d-flex position-relative custom-dropdown" data-label="Action">
            <button
              className="border-0 bg-transparent"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(row._id);
              }}
            >
              <i class="fa fa-ellipsis"></i>
            </button>
            {openDropdownId === row._id && (
              <ul
                className="dropdown-menu show right-side"
              >
                <li>
                  {" "}
                  <button
                    className="admin_action_edit"
                    onClick={(e) =>{ e.stopPropagation();handleEditAssets(row._id);setOpenDropdownId(null);}}
                    title="Edit Asset"
                  >
                    <i className="fa fa-edit me-2"></i> {t("Edit")}
                  </button>
                </li>
                <li>
                  {" "}
                  <button
                    className="admin_action_clone"
                    onClick={(e) => { e.stopPropagation();handleCloneAssets(row._id);setOpenDropdownId(null);}}
                    title="Clone Asset"
                  >
                    <i className="fa fa-clone me-2"></i> {t("Clone")}
                  </button>
                </li>
                <li>
                  {" "}
                  <button
                    className="admin_action_delete"
                    onClick={(e) => { e.stopPropagation();handleAssetDelete(row._id);setOpenDropdownId(null);}}
                    title="Delete User"
                  >
                    <i className="fa fa-trash me-2"></i> {t("Delete")}
                  </button>
                </li>
              </ul>
            )}
          </div>
        ),
    },
  ];
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
                      <h1>{t("Assets List")}</h1>
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
                        {hasWritePermission() && (
                          <button
                            className="button"
                            onClick={() => {
                              setLoader(true);
                              router.push("/admin/assets/addassets");
                            }}
                          >
                            {t("Add Assets")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">
                          {t("Loading...")}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="table-responsive">
                    <DataTable columns={columns} data={assets} noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>} />
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-between align-items-center">
                      <div className="pagination-info">
                        <small className="text-muted">
                          {t("Page")} {currentPage + 1} {t("of")} {totalPages}(
                          {totalItems} {t("total items")})
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
