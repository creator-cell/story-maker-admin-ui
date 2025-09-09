"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Loader from "../Loader";

export default function EditUser({ userId }) {
    const { handleSubmit, register, reset, watch, setValue, formState: { errors }, trigger } = useForm();
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
    const route = useRouter();
    const router = useRouter();
    const [dob, setDob] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loader, setLoader] = useState(false);
    const getUserDetails = async () => {
        try {
            const response = await axios({
                url: `${API_URL}users/${userId}`,
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const user = response.data.user;

            reset({
                firstName: user.name,

                email: user.email,
                phone: user.phone,
                role: user.role._id
            });

        } catch (error) {
            console.error(error);
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await axios({
                url: `${API_URL}role`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRoles(response.data.roles || []);
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast("Failed to fetch roles", {
                theme: "dark",
                position: "top-right",
                type: "error",
            });
        }
    };

    useEffect(() => {
        getUserDetails();
        fetchRoles();
    }, [])

    const handleUserUpdate = async (data) => {
        console.log(data);
        if (data) {
            try {
                const response = await axios({
                    url: `${API_URL}users/${userId}`,
                    method: "PUT",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    data: {
                        name: data.firstName,
                        phone: data.phone,
                        email: user.email,
                        role: data.role,
                    },
                });

                if (response.status === 200) {
                    toast("User updated successfully.", {
                        theme: "dark",
                        position: "top-right",
                        type: "success"
                    });
                    getUserDetails();
                    route.push('/admin/users');
                }
            } catch (error) {
                toast("Error while updating user.", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
                console.error("error", error);
            }
        }
    }


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
                                            <h1>Edit User</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="admin_forms mt-5">
                                    <form action={handleSubmit(handleUserUpdate)}>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="form_group">
                                                    <label htmlFor="firstName">First Name  <span className="text-danger"> *</span></label>
                                                    <input type="text" name="" id="firstName" className="form-control" {...register("firstName", { required: "First name is required" })} />
                                                    {errors.firstName &&
                                                        (<span className="errMsg">
                                                            {errors.firstName.message}
                                                        </span>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="form_group">
                                                    <label htmlFor="role">Role  <span className="text-danger"> *</span></label>
                                                    <select
                                                        className="form-control"
                                                        name="role"
                                                        id="role"
                                                        {...register("role", { required: "Role is required" })}
                                                    >
                                                        <option value="">Select a role</option>
                                                        {roles.map((role) => (
                                                            <option key={role._id} value={role._id}>
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.role &&
                                                        (<span className="errMsg">
                                                            {errors.role.message}
                                                        </span>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="form_group">
                                                    <label htmlFor="email">Email  <span className="text-danger"> *</span></label>
                                                    <input type="email" name="" id="email" className="form-control" style={{ border: "none" }}
                                                        {...register("email")}
                                                        readOnly disabled />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-12 mb-3">
                                                <div className="form_group">
                                                    <label htmlFor="email">Mobile Number</label>
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
                                            <div className="d-flex gap-3">
                                                <button type="submit" className="button">
                                                    Update User
                                                </button>
                                                <button
                                                    type="button"
                                                    className="button"
                                                    onClick={() => { setLoader(true); router.push("/admin/users") }}
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
        </>
    )
}