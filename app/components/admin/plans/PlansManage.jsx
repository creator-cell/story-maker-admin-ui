"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useDownloader from "react-use-downloader";
import Loader from "@/app/components/Loader";
import DeletePlan from "@/app/[locale]/(adminSide)/model/DeletePlan";
import { useTranslation } from "react-i18next";
import DataTable from 'react-data-table-component';

const PlansManage = () => {
  const { t } = useTranslation();
  const { download, isInProgress } = useDownloader();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
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
    both: false
  });
  const itemsPerPage = 20;
  const router = useRouter();

  const hasWritePermission = () => {
    return userPermissions.write || userPermissions.both;
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
  const getPlans = async (page = 1, sort = sortByValue, search = "", order = sortOrder) => {
    setLoader(true);
    try {
      let url = `${API_URL}billing-subscription/plan?page=${page}&pageSize=${itemsPerPage}`;

      if (sort) url += `&sortBy=${sort}&sortOrder=${order}`;
      if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await axios({
        url: url,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setPlans(response.data?.data?.plan?.items);
      console.log(response.data);

    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        toast.error(t("You don't have permission to view users 9999"));
      } else {
        toast.error(t("Failed to fetch users"));
      }
    } finally {
      setLoader(false);
    }
  };

  const getUserDetail = async () => {
    try {
      const response = await axios({
        url: `${API_URL}billing-subscription/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      return response.data;
    } catch (err) {
      console.log("Error fetching user data:", err);

    }
  };

  const handleEditPlans = (updateAssetId) => {
    setLoader(true);
    router.push(`/admin/plans/${updateAssetId}`);
  }

  const handlePlanDelete = (deletePlanId) => {
    setPlansId(deletePlanId);
    setDeletePlans(true);
  }

  const handleDeleteSuccess = () => {
    setDeletePlans(false);
    getPlans();
  }


  useEffect(() => {
    const initializeUserPermissions = async () => {
      try {
        const userData = await getUserDetail();

        if (userData && userData.rolePermissions && userData.rolePermissions.menu) {
          // Find the Users menu permissions
          const usersMenu = userData.rolePermissions.menu.find(
            menu => menu.menuName === "Plans"
          );

          if (usersMenu) {
            // Set permissions based on the Users menu
            setUserPermissions({
              read: usersMenu.read || false,
              write: usersMenu.write || false,
              both: usersMenu.both || false,
              hasUsersMenu: true
            });

            // If user has read permission or both, fetch users
            if (usersMenu.read || usersMenu.both) {
              getPlans(1);
            } else {
              toast.error(t("You don't have permission to access this page"));
            }
          } else {
            // User doesn't have Users menu access
            setUserPermissions({
              read: false,
              write: false,
              both: false,
              hasUsersMenu: false
            });
            toast.error(t("You don't have permission to access this page"));
          }
        } else {
          // No role permissions found
          setUserPermissions({
            read: false,
            write: false,
            both: false,
            hasUsersMenu: false
          });
          toast.error(t("You don't have permission to access this page"));
        }
      } catch (error) {
        console.error("Error initializing user permissions:", error);
        setUserPermissions({
          read: false,
          write: false,
          both: false,
          hasUsersMenu: false
        });
        toast.error(t("Error loading user permissions"));
      }
    };

    initializeUserPermissions();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
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
  }, [plans]);
  const columns = [
    {
      name: t('Date'),
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: t('Name'),
      selector: row => row.name
    },
    {
      name: t('Title'),
      selector: row => row.title
    },
    {
      name: t('Description') || t("no Description"),
      selector: row => row.description,
      wrap: true,
      minWidth: "250px",
    },
    {
      name: t('Price') || t("no Price"),
      selector: (row) =>
        row.price ? parseFloat(row.price).toFixed(2) : "",
    },
    {
      name: t('Duration'),
      cell: (row) =>
        row.duration ? (
          <span className="badge bg-success text-light m-1">
            {row.duration}
          </span>
        ) : (
          ""
        ),
      width: "120px",
    },
    {
      name: t('Features') || t("no Features"),
      cell: (row) => (
        <div
          className="d-flex flex-wrap gap-2"
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          {row.features?.map((f, i) => (
            <span key={i} className="badge bg-secondary text-light m-1">
              {f}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: t('Uploaded By'),
      selector: (row) => row.uploadedBy?.email,
      minWidth: "200px",
    },
    {
      name: t('Action'),
      cell: row => (
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
              <i className="fa fa-ellipsis"></i>
            </button>
            {openDropdownId === row._id && (
              <ul className="dropdown-menu show right-side">
                <li> <button
                  className="admin_action_edit"
                  onClick={(e) => { e.stopPropagation(); handleEditPlans(row._id); setOpenDropdownId(null); }}
                >
                  <i className="fa fa-edit me-2"></i> {t("Edit")}
                </button></li>
                <li><button
                  className="admin_action_delete"
                  onClick={(e) => { e.stopPropagation(); handlePlanDelete(row._id); setOpenDropdownId(null); }}
                >
                  <i className="fa fa-trash me-2"></i> {t("Delete")}
                </button></li>
              </ul>
            )}
          </div>
        )
      )
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
                      <h1>{t("Plans List")}</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_table">
                  <div className="row table_filter justify-content-between align-items-center mb-3">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="d-flex gap-2 align-items-center">

                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="filter_field d-flex gap-2 justify-content-end">
                        {hasWritePermission() && (
                          <button className="button" onClick={() => { setLoader(true); router.push('/admin/plans/addplans') }}>
                            {t("Add Plan")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">{t("Loading...")}</span>
                      </div>
                    </div>
                  )}

                  <div className="table-responsive">
                    <DataTable
                      columns={columns}
                      data={plans}
                      noDataComponent={<div className="text-center py-4">{t("There are no records to display")}</div>}
                    />
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-between align-items-center">
                      <div className="pagination-info">
                        <small className="text-muted">
                          Page {currentPage + 1} of {totalPages}
                          ({totalItems} total items)
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
        <DeletePlan
          show={deletePlans}
          data={plansId}
          onHide={handleDeleteSuccess}
        />
      )}

    </>
  );
}

export default PlansManage;