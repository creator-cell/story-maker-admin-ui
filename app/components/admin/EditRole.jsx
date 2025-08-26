"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditRole({ roleId }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const router = useRouter();
  const [menuPermissions, setMenuPermissions] = useState({
    Users: {
      read: false,
      write: false,
      both: false,
    },
    Roles: {
      read: false,
      write: false,
      both: false,
    },
    Assets: {
      read: false,
      write: false,
      both: false
    },
    Tickets: {
      read: false,
      write: false,
      both: false,
    },
    Category: {
      read: false,
      write: false,
      both: false,
    },
    Template: {
      read: false,
      write: false,
      both: false,
    },
    Plans: {
      read: false,
      write: false,
      both: false
    }
  });

  // Hardcoded menu options
  const availableMenus = [
    { key: "Users", label: "Users" },
    { key: "Roles", label: "Roles" },
    { key: "Assets", label: "Assets" },
    { key: "Tickets", label: "Tickets" },
    { key: "Category", label: "Category" },
    { key: "Template", label: "Template" },
    { key: "Plans", label: "Plans" }
  ];

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const getRoleDetails = async () => {
    try {
      const response = await axios({
        url: `${API_URL}role/${roleId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const role = response.data.role;

      reset({
        name: role.name,
      });
      const defaultPermissions = {
        Users: { read: false, write: false, both: false },
        Roles: { read: false, write: false, both: false },
        Tickets: { read: false, write: false, both: false },
        Category: { read: false, write: false, both: false },
        Assets: { read: false, write: false, both: false },
        Template: { read: false, write: false, both: false },
        Plans: { read: false, write: false, both: false }
      };
      if (role.menuPermissions) {
        setMenuPermissions({
          ...defaultPermissions,
          ...role.menuPermissions,
        });
      } else {
        setMenuPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error(error);
      toast("Failed to fetch role details", {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (roleId) {
      getRoleDetails();
    }
  }, [roleId]);

  const handlePermissionChange = (menuKey, permissionType) => {
    console.log(menuKey, permissionType);
    setMenuPermissions((prev) => {
      const currentMenu = prev[menuKey];
      let newPermissions = { ...currentMenu };

      if (permissionType === "both") {
        newPermissions = {
          ...newPermissions,
          read: !currentMenu.both,
          write: !currentMenu.both,
          both: !currentMenu.both,
        };
      } else {
        newPermissions = {
          ...newPermissions,
          [permissionType]: !currentMenu[permissionType],
        };
        // Update 'both' based on read and write
        newPermissions.both = newPermissions.read && newPermissions.write;
      }

      return {
        ...prev,
        [menuKey]: newPermissions,
      };
    });
  };

  const handleRoleUpdate = async (data) => {
    if (data) {
      const missingFields = [];

      if (!data.name) missingFields.push("Role Name");

      // Check if at least one menu has at least one permission
      const hasAnyPermission = Object.keys(menuPermissions).some((menu) => {
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

      try {
        // Filter out menus with no permissions selected
        const filteredMenuPermissions = Object.keys(menuPermissions)
          .filter((menu) => {
            const perms = menuPermissions[menu];
            return perms.read || perms.write || perms.both;
          })
          .reduce((acc, menu) => {
            acc[menu] = menuPermissions[menu];
            return acc;
          }, {});

        const response = await axios({
          url: `${API_URL}role/${roleId}`,
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: {
            name: data.name,
            menuPermissions: filteredMenuPermissions,
          },
        });

        if (response.status === 200) {
          toast("Role updated successfully.", {
            theme: "dark",
            position: "top-right",
            type: "success",
          });
          getRoleDetails();
          router.push("/admin/role");
        }
      } catch (error) {
        toast("Error while updating role.", {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
        console.error("error", error);
      }
    }
  };

  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container p-0">
            <div id="role" className="comman_admin_layout">
              <div className="container p-0">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="title_head">
                      <h3>Edit Role</h3>
                    </div>
                  </div>
                </div>
                <div className="admin_forms mt-5">
                  <form action={handleSubmit(handleRoleUpdate)}>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="form_group">
                          <label htmlFor="role-name">
                            Role Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="role-name"
                            id="role-name"
                            placeholder="Enter role name"
                            {...register("name", {
                              required: "Role name is required",
                            })}
                          />
                          {errors.name && (
                            <span className="errMsg">
                              {errors.name.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 col-12 mb-3">
                        <div className="form_group">
                          <label>
                            Menu Access & Permissions{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="menu-permissions-table mt-3">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead className="table-light">
                                  <tr>
                                    <th style={{ width: "200px" }}>Menu</th>
                                    <th
                                      style={{ width: "150px" }}
                                      className="text-center"
                                    >
                                      Read
                                    </th>
                                    <th
                                      style={{ width: "150px" }}
                                      className="text-center"
                                    >
                                      Write
                                    </th>
                                    <th
                                      style={{ width: "150px" }}
                                      className="text-center"
                                    >
                                      Both
                                    </th>
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
                                            checked={
                                              menuPermissions[menu.key]?.read ||
                                              false
                                            }
                                            onChange={() =>
                                              handlePermissionChange(
                                                menu.key,
                                                "read"
                                              )
                                            }
                                            id={`read-${menu.key}`}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="form-check d-flex justify-content-center">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={
                                              menuPermissions[menu.key]
                                                ?.write || false
                                            }
                                            onChange={() =>
                                              handlePermissionChange(
                                                menu.key,
                                                "write"
                                              )
                                            }
                                            id={`write-${menu.key}`}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="form-check d-flex justify-content-center">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={
                                              menuPermissions[menu.key]?.both ||
                                              false
                                            }
                                            onChange={() =>
                                              handlePermissionChange(
                                                menu.key,
                                                "both"
                                              )
                                            }
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
                            Select permissions for each menu. 'Both'
                            automatically selects Read and Write.
                          </small>
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 col-12">
                        <input
                          type="submit"
                          value="Update"
                          className="button"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
