
"use client";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const AddUserPage = () => {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState([]);
  const router = useRouter();
 
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone:"",
    },
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL_USER}role`,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setRoles(response.data?.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast(t("Failed to fetch roles"), {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
    }
  };

 

  const handleRegister = (data) => {
    var selectedInterests = Object.keys(data.areaInterest || {}).reduce(
      (acc, key) => {
        acc[key] = !!data.areaInterest[key];
        return acc;
      },
      {}
    );
    const missingFields = [];

    // Check all required fields
    if (!data.name) missingFields.push(t("Full Name"));
    if (!data.email) missingFields.push(t("Email"));
    
    if (!data.role) missingFields.push(t("Role"));
  if (!data.phone) missingFields.push(t("Phone number"));

   
    if (missingFields.length > 0) {
      toast(`${missingFields.join(", ")} ${t("is required")}`, {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      return;
    }
    setLoader(true);

    axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_USER}users`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        name: data.name,
        email: data.email,
      phone:data.phone,
        role: data.role,
       
      },
    })
      .then((res) => {
        setLoader(false);
      
        toast(t("Registration successfully"), {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        reset();
        // Navigate back to user list page
        router.push("/admin/users");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast(err?.response?.data?.message || t("Registration failed"), {
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
                    <h1>{t("Add New User")}</h1>
                  </div>
                </div>
              </div>
              
              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleRegister)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Full Name")}  <span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          value={watch("name") || ""}
                          {...register("name")}
                        />
                      </div>
                    </div>
                   
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="role">{t("Role")}  <span className="text-danger"> *</span></label>
                        <select
                          className="form-control"
                          name="role"
                          id="role"
                          value={watch("role") || ""}
                          {...register("role")}
                        >
                          <option value="">{t("Select a role")}</option>
                          {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="email">{t("Email")}  <span className="text-danger"> *</span></label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          aria-describedby="helpId"
                          value={watch("email") || ""}
                          {...register("email")}
                        />
                      </div>
                    </div>

                       <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="email">{t("Mobile Number")}  <span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="text"
                          id="text"
                          aria-describedby="helpId"
                          value={watch("phone") || ""}
                          {...register("phone")}
                        />
                      </div>
                    </div>
                  
                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="button">
                       {t("Submit")} 
                      </button>
                      <button 
                        type="button" 
                        className="button"
                        onClick={() =>  {setLoader(true); 
                           router.push("/admin/users")}}
                      >
                        {t("Cancel")} 
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

export default AddUserPage;
