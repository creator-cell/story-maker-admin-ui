"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Loader from "../Loader";
import Categories from "./Category";
export default function EditCategory({ userId }) {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const route = useRouter();
  const [dob, setDob] = useState(null);
  const [roles, setRoles] = useState([]);
  const router = useRouter();
  const getUserDetails = async () => {
    try {
      const response = await axios({
        url: `${API_URL}category/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const user = response.data.category;

      reset({
        name: user.name,

        description: user.description,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleUserUpdate = async (data) => {
    if (data) {
      try {
        const response = await axios({
          url: `${API_URL}category/${userId}`,
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: {
            name: data.name,
            description: data.description,
          },
        });

        if (response.status === 200) {
          toast("User updated successfully.", {
            theme: "dark",
            position: "top-right",
            type: "success",
          });
          getUserDetails();
          route.push("/admin/category");
        }
      } catch (error) {
        toast("Error while updating user.", {
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
          <div className="container-lg container-fluid p-0">
            <div className="comman_admin_layout flex-column p-0">
              <div className="container-lg container-fluid p-0">
                <div className="row mb-4">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="title_head">
                      <h3>Edit Category</h3>
                    </div>
                  </div>
                </div>

                <div className="admin_form_panel">
                  <form onSubmit={handleSubmit(handleUserUpdate)}>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="form_group">
                          <label htmlFor="full-name">Category Name</label>
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

                      <div className="col-lg-12 col-md-12 col-12 mb-3">
                        <div className="form_group">
                          <label htmlFor="email">Description</label>
                          <textarea
                            type="textarea"
                            className="form-control"
                            name="Description"
                            id="Description"
                            row={3}
                            cols={3}
                            aria-describedby="helpId"
                            value={watch("description") || ""}
                            {...register("description")}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="form_group">
                          <label htmlFor="full-name">Sub Category Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            id="fname"
                            aria-describedby="helpId"
                            value={watch("subname") || ""}
                            {...register("subname")}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 col-12 mb-3">
                        <div className="form_group">
                          <label htmlFor="email">
                            Sub Category Description
                          </label>
                          <textarea
                            type="textarea"
                            className="form-control"
                            name="subDescription"
                            id="subDescription"
                            row={3}
                            cols={3}
                            aria-describedby="helpId"
                            value={watch("subdescription") || ""}
                            {...register("subdescription")}
                          />
                        </div>
                      </div>

                      <div className="col-12 mt-3 d-flex gap-3">
                        <button type="submit" className="button">
                          Update
                        </button>
                        <button
                          type="button"
                          className="button"
                          style={{ backgroundColor: "#6c757d" }}
                          onClick={() => router.push("/admin/category")}
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
        {/* {loader && <Loader />} */}
      </div>
    </>
  );
}
