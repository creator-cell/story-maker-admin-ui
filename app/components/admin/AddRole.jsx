"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
// import { Plus, X } from "lucide-react";

const AddRole = () => {
  const [loader, setLoader] = useState(false);
  const [menus, setMenus] = useState([""]);
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    both: false
  });
  const router = useRouter();

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

  const addMenu = () => {
    setMenus([...menus, ""]);
  };

  const removeMenu = (index) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const updateMenu = (index, value) => {
    const newMenus = [...menus];
    newMenus[index] = value;
    setMenus(newMenus);
  };

  const handlePermissionChange = (type) => {
    setPermissions(prev => {
      if (type === "both") {
        return {
          read: !prev.both,
          write: !prev.both,
          both: !prev.both
        };
      } else {
        const newPermissions = { ...prev, [type]: !prev[type] };
        newPermissions.both = newPermissions.read && newPermissions.write;
        return newPermissions;
      }
    });
  };

  const handleRegister = (data) => {
    const missingFields = [];

    if (!data.name) missingFields.push("Role Name");
    if (menus.filter(menu => menu.trim() !== "").length === 0) missingFields.push("Menus");

    if (missingFields.length > 0) {
      toast(`${missingFields.join(", ")} is required`, {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      return;
    }

    setLoader(true);

    axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}role`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        name: data.name,
        menu: menus.filter(menu => menu.trim() !== ""),
        read: permissions.read,
        write: permissions.write,
        both: permissions.both
      },
    })
      .then((res) => {
        setLoader(false);
        toast("Role created successfully", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        reset();
        setMenus([""]);
        setPermissions({ read: false, write: false, both: false });
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
                        <label htmlFor="role-name">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="role-name"
                          id="role-name"
                          aria-describedby="helpId"
                          value={watch("name") || ""}
                          {...register("name")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label>Menus</label>
                        {menus.map((menu, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <input
                              type="text"
                              className="form-control me-2"
                              value={menu}
                              onChange={(e) => updateMenu(index, e.target.value)}
                              placeholder="Enter menu name"
                            />
                            {menus.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMenu(index)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                Remove
                                {/* <X size={16} /> */}
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addMenu}
                          className="btn btn-outline-primary btn-sm d-flex align-items-center"
                        >
                          {/* <Plus size={16} className="me-1" /> */}
                          Add Menu
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label>Permissions</label>
                        <div className="d-flex gap-3 mt-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={permissions.read}
                              onChange={() => handlePermissionChange("read")}
                              id="readPermission"
                            />
                            <label className="form-check-label" htmlFor="readPermission">
                              Read
                            </label>
                          </div>
                          
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={permissions.write}
                              onChange={() => handlePermissionChange("write")}
                              id="writePermission"
                            />
                            <label className="form-check-label" htmlFor="writePermission">
                              Write
                            </label>
                          </div>
                          
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={permissions.both}
                              onChange={() => handlePermissionChange("both")}
                              id="bothPermission"
                            />
                            <label className="form-check-label" htmlFor="bothPermission">
                              Both (Read & Write)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="admin_button">
                        Submit
                      </button>
                      <button 
                        type="button" 
                        className="admin_button cancel_button"
                        onClick={() => router.push("/admin/role")}
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
