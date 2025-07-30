"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";

const AddRole = () => {
  const [loader, setLoader] = useState(false);
  const [menuPermissions, setMenuPermissions] = useState({
    Users: {
      read: false,
      write: false,
      both: false
    },
    Roles: {
      read: false,
      write: false,
      both: false
    },
    Assets: {
      read: false,
      write: false,
      both: false
    }
  });
  const router = useRouter();

  // Hardcoded menu options
  const availableMenus = [
    { key: "Users", label: "Users" },
    { key: "Roles", label: "Roles" },
    { key: "Assets", label: "Assets" }
  ];

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const handlePermissionChange = (menuKey, permissionType) => {
    setMenuPermissions(prev => {
      const currentMenu = prev[menuKey];
      let newPermissions = { ...currentMenu };

      if (permissionType === "both") {
        newPermissions = {
          ...newPermissions,
          read: !currentMenu.both,
          write: !currentMenu.both,
          both: !currentMenu.both
        };
      } else {
        newPermissions = {
          ...newPermissions,
          [permissionType]: !currentMenu[permissionType]
        };
        // Update 'both' based on read and write
        newPermissions.both = newPermissions.read && newPermissions.write;
      }

      return {
        ...prev,
        [menuKey]: newPermissions
      };
    });
  };

  const handleRegister = (data) => {
    const missingFields = [];
    
    if (!data.name) missingFields.push("Role Name");

    // Check if at least one menu has at least one permission
    const hasAnyPermission = Object.keys(menuPermissions).some(menu => {
      const perms = menuPermissions[menu];
      return perms.read || perms.write || perms.both;
    });

    if (!hasAnyPermission) {
      missingFields.push("At least one permission for any menu");
    }

    if (missingFields.length > 0) {
      toast(`${missingFields.join(", ")} is required`, {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      return;
    }

    setLoader(true);

    // Filter out menus with no permissions selected
    const filteredMenuPermissions = Object.keys(menuPermissions)
      .filter(menu => {
        const perms = menuPermissions[menu];
        return perms.read || perms.write || perms.both;
      })
      .reduce((acc, menu) => {
        acc[menu] = menuPermissions[menu];
        return acc;
      }, {});

    // Prepare data for API - simplified structure
    const roleData = {
      name: data.name,
      menuPermissions: filteredMenuPermissions
    };

    axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_USER}role`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: roleData,
    })
      .then((res) => {
        setLoader(false);
        toast("Role created successfully", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        reset();
        setMenuPermissions({
          Users: { read: false, write: false, both: false },
          Roles: { read: false, write: false, both: false },
          Assets: { read: false, write: false, both: false }
        });
        router.push("/admin/role");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast(err?.response?.data?.message || "Role creation failed", {
          type: "error",
          theme: "dark",
          position: "top-right",
        });
      });
  };

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="container-lg container-fluid p-0">
              <div className="row mb-4">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="title_head">
                    <h3>Add New Role</h3>
                  </div>
                </div>
              </div>
              
              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleRegister)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="role-name">Role Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="role-name"
                          id="role-name"
                          placeholder="Enter role name"
                          value={watch("name") || ""}
                          {...register("name", { required: "Role name is required" })}
                        />
                        {errors.name && (
                          <small className="text-danger">{errors.name.message}</small>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label>Menu Access & Permissions <span className="text-danger">*</span></label>
                        <div className="menu-permissions-table mt-3">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead className="table-light">
                                <tr>
                                  <th style={{ width: '200px' }}>Menu</th>
                                  <th style={{ width: '150px' }} className="text-center">Read</th>
                                  <th style={{ width: '150px' }} className="text-center">Write</th>
                                  <th style={{ width: '150px' }} className="text-center">Both</th>
                                </tr>
                              </thead>
                              <tbody>
                                {availableMenus.map((menu) => (
                                  <tr key={menu.key}>
                                    <td>
                                      <strong>{menu.label}</strong>
                                    </td>
                                    <td className="text-center">
                                      <div className="form-check d-flex justify-content-center">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={menuPermissions[menu.key].read}
                                          onChange={() => handlePermissionChange(menu.key, 'read')}
                                          id={`read-${menu.key}`}
                                        />
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <div className="form-check d-flex justify-content-center">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={menuPermissions[menu.key].write}
                                          onChange={() => handlePermissionChange(menu.key, 'write')}
                                          id={`write-${menu.key}`}
                                        />
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <div className="form-check d-flex justify-content-center">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={menuPermissions[menu.key].both}
                                          onChange={() => handlePermissionChange(menu.key, 'both')}
                                          id={`both-${menu.key}`}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <small className="text-muted">
                          Select permissions for each menu. 'Both' automatically selects Read and Write.
                        </small>
                      </div>
                    </div>

                    <div className="col-12 mt-3 d-flex gap-3">
                      <button 
                        type="submit" 
                        className="button"
                        disabled={loader}
                      >
                        {loader ? "Creating..." : "Create Role"}
                      </button>
                      <button 
                        type="button" 
                        className="button"
                        onClick={() => router.push("/admin/role")}
                        disabled={loader}
                        style={{ backgroundColor: '#6c757d' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default AddRole;
