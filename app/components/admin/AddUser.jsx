
"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";

import { useRouter } from "next/navigation";

const AddUserPage = () => {

  const [loader, setLoader] = useState(false);
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
      
    
    },
  });

 

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
    if (!data.name) missingFields.push("Full Name");
    if (!data.email) missingFields.push("Email");
    
    if (!data.role) missingFields.push("Role");

   
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
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}users`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        name: data.name,
        email: data.email,
      
        role: data.role,
       
      },
    })
      .then((res) => {
        setLoader(false);
      
        toast("Registration successful", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        reset();
        // Navigate back to user list page
        router.push("/admin/user");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast(err?.response?.data?.message || "Registration failed", {
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
                    <h3>Add New User</h3>
                  </div>
                </div>
              </div>
              
              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleRegister)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">Full Name</label>
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
                        <label htmlFor="role">Role</label>
                        <input
                          type="text"
                          className="form-control"
                          name="role"
                          id="role"
                          value={watch("role") || ""}
                          {...register("role")}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="email">Email</label>
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
                  
                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="admin_button">
                        Submit
                      </button>
                      <button 
                        type="button" 
                        className="admin_button cancel_button"
                        onClick={() => router.push("/admin/user")}
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

export default AddUserPage;
