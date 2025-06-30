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

export default function EditUser({ userId  }){
    const { handleSubmit, register,reset,watch, setValue, formState: { errors }, trigger } = useForm();
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    const route = useRouter();
    const [dob, setDob] = useState(null);

    const getUserDetails = async ()=>{
        try{
            const response = await axios({
                url: `${API_URL}/users/${userId}`,
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const user = response.data;
         
            const userBirthDate = user.birthDate;
            if (userBirthDate) {
                setDob(new Date(userBirthDate));
            }
            
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                birthDate : user.birthDate,
                townCity: user.townCity,
                state: user.state,
                zipCode: user.zipCode,
                email: user.email,
                phoneNumber: user.phoneNumber
            });

        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        getUserDetails();
    },[])

    const handleUserUpdate = async (data)=>{ 
        const birthDate = data.dob.toISOString().split("T")[0];
       
        if(data){
            try{
                const response = await axios({
                    url: `${API_URL}/users/${userId}`,
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    data:{
                        firstName: data.firstName,
                        lastName: data.lastName,
                        birthDate : birthDate,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        townCity: data.townCity,
                        state: data.state,
                        zipCode: data.zipCode,
                        email: user.email,
                    },
                });
                console.log("Update=> ",response.data);
                
                if(response.status === 200){
                    toast("User updated successfully.", {
                        theme: "dark",
                        position: "top-right",
                        type: "success"
                    });
                    getUserDetails();
                    route.push('/admin/users');
                }
            }catch(error){
                toast("Error while updating user.", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
                console.error("error",error);
            }
        }
    }
    const checkAge = (date) => {
        const today = new Date();
        const dateofBirth = new Date(date);
        const age = today.getFullYear() - dateofBirth.getFullYear();
        const m = today.getMonth() - dateofBirth.getMonth();
        const d = today.getDate() - dateofBirth.getDate();
        return (
            age > 12 || (age === 12 && (m > 0 || (m === 0 && d >= 0))) || "You must be at least 12 years old."
        );
    };

    return(
        <>
        <div id="main_container">
            <div className="inner_container">
                <div className="container p-0">
                    <div id="user" className="comman_admin_layout">
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="title_head">
                                        <h3>Edit User</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="admin_forms mt-5">
                                <form action={handleSubmit(handleUserUpdate)}>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="firstName">First Name *</label>
                                                <input type="text" name="" id="firstName" className="form-control" {...register("firstName",{ required: "First name is required" })} />
                                                {errors.firstName && 
                                                    (<span className="errMsg">
                                                        {errors.firstName.message}
                                                    </span>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="lastName">Last Name *</label>
                                                <input type="text" name="" id="lastName" className="form-control" {...register("lastName",{ required: "Last name is required" })} />
                                                {errors.lastName && 
                                                    (<span className="errMsg">
                                                        {errors.lastName.message}
                                                    </span>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="dob">Date of Birth *</label>
                                                <DatePicker
                                                className="form-control"
                                                selected={dob}
                                                onChange={(date) => {
                                                    setDob(date);
                                                    setValue("dob", date, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                    });
                                                }}
                                                dateFormat="dd-MM-yyyy"
                                                placeholderText="Date of Birth *"
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={100}
                                                maxDate={new Date()}
                                                />
                                                {errors.dob && <p className="errMsg">{errors.dob.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-auto col-md-auto col-12 visually-hidden">
                                            <input
                                                type="hidden"
                                                {...register("dob", {
                                                    required: { value: true, message: "Birth date required." },
                                                    validate: checkAge,
                                                })}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-12">
                                            <div className="form_group">
                                                <label htmlFor="address">Address *</label>
                                                <input type="text" className="form-control" id="address" name="address" placeholder="Address *"
                                                {...register("address", {
                                                    required: { value: true, message: ('Address is required.')},
                                                })} />
                                                {errors.address ? <p className="errMsg">{errors.address.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-12 col-12 ps-lg-0">
                                            <div className="form_group">
                                                <label htmlFor="city">City *</label>
                                                <input type="text" className="form-control" name="city" id="city" placeholder="City *"
                                                {...register("townCity", {
                                                    required: { value: true, message: ('City is required.')},
                                                })} />
                                                {errors.townCity ? <p className="errMsg">{errors.townCity.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="state">State *</label>
                                                <input type="text" className="form-control" name="state" id="state" placeholder="State *"
                                                {...register("state", {
                                                    required: { value: true, message: ('State is required.')},
                                                })} />
                                                {errors.state ? <p className="errMsg">{errors.state.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="zipCode">Zip Code *</label>
                                                <input type="text" className="form-control" placeholder="Zipcode *"
                                                {...register("zipCode", {
                                                    required: { value: true, message: ('Zipcode is required.')},
                                                    pattern: {
                                                        value: /^[A-Za-z0-9\s\-]{3,10}$/,
                                                        message: "Invalid zipcode.",
                                                    },
                                                })} />
                                                {errors.zipCode ? <p className="errMsg">{errors.zipCode.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="email">Email *</label>
                                                <input type="email" name="" id="email" className="form-control" 
                                                {...register("email")}
                                                readOnly disabled />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="form_group">
                                                <label htmlFor="phoneNumber">Phone Number *</label>
                                                <PhoneInput
                                                    placeholder="Enter phone number"
                                                    className="form-control"
                                                    value={watch("phoneNumber") || ""}
                                                    onChange={(value) => {
                                                        setPhoneNumber(value);
                                                        setValue("phoneNumber", value);
                                                        trigger("phoneNumber");
                                                    }}
                                                    {...register("phoneNumber", {
                                                        required: { value: true, message: ('Phone Number Required.') },
                                                    })}
                                                />
                                                {/* <input type="text" name="" id="phoneNumber" className="form-control" 
                                                {...register("phoneNumber",{ required: "Phone Number is required." })} /> */}
                                                {errors.phoneNumber && 
                                                    (<span className="errMsg">
                                                        {errors.phoneNumber.message}
                                                    </span>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <input type="submit" value="Update" className="button" />
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
    )
}