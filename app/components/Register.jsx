'use client';
import Image from "next/image";
import CustomLink from "./CustomLink";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from './Loader';

export default function Register() {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const router = useRouter();
    const [dob, setDob] = useState(null);
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const { control, formState: { errors }, handleSubmit, register, reset, setValue, watch, trigger } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',

        }
    });

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

    const handleRegister = async (data) => {

      console.log(data);
        setShowLoader(true);
        try {
            const response = await axios({
                url: `${API_URL}users/register`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    name: data.firstName,
                  role:"68627f97b3c3ae03656441fa",
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                   
                })
            })
           
            if (verifyToken) {
                setShowLoader(false);
                toast("Registration successfull, please check your email to verify your account.", {
                    theme: "light",
                    position: "top-right",
                    type: "success"
                });
                const verifyEmail = await axios({
                    url: `${API_URL}/auth/send-verification-email`,
                    method: "POST",
                    headers: { Authorization: `Bearer ${verifyToken}` }
                });
                if (verifyEmail.data === '') {
                    router.push('/login');
                } else {
                    toast(verifyEmail.data.message || "Email not sent", {
                        theme: "light",
                        position: "top-right",
                        type: "error"
                    });
                }
            }
            reset({ firstName: '', lastName: '', dob: '', address: '', townCity: '', zipCode: '', state: '', email: '', phoneNumber: '', password: '', confirmPassword: '', termsCondition: false, sendMarketingEmail: false, });
        } catch (error) {
            setShowLoader(false);
            console.log('error ', error.response.data);
            toast(error.response.data?.message || "Somthing went wrong", {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
        }
    }

    return (
        <>
            {showLoader && <Loader />}
            <div className="auth">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-lg-5 col-md-6 col-12 d-lg-flex d-md-flex d-none">
                            <Image src={'/images/register.jpg'} width={500} height={500} alt="register image" />
                        </div>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="auth_form">
                                <div className="title-dark">
                                    <h2>Register Now</h2>
                                </div>
                                <div className="boxwrap">
                                    <form action={handleSubmit(handleRegister)} className="row justify-content-center needs-validation">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="Full Name *"
                                                    value={watch("firstName") || ""}
                                                    {...register("firstName", {
                                                        required: { value: true, message: ('Full name required.') },
                                                        pattern: {
                                                            value: /^[A-Za-z\s]+$/,
                                                            message: "First name should not contain numbers or special characters",
                                                        },
                                                    })} />
                                                {errors.firstName ? <p className="errMsg">{errors.firstName.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Mobile Number *"
                                                    name="text"
                                                    id="text"
                                                    aria-describedby="helpId"
                                                    value={watch("phone") || ""}
                                                    {...register("phone")}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <div className="mb-input">
                                                <input type="email" className="form-control" placeholder="Email address *"
                                                    value={watch("email") || ""}
                                                    {...register("email", {
                                                        required: { value: true, message: ('Email Address Required.') },
                                                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: ("Invalid Email Address") }
                                                    })}
                                                />
                                                {errors.email ? <p className="errMsg">{errors.email.message}</p> : null}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-12 col-12">
                                            <div className="mb-input">
                                                <div className="password_eye">
                                                    <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Password *"
                                                        value={watch("password") || ""}
                                                        {...register("password", {
                                                            required: { value: true, message: ('Password Required') },
                                                            pattern: { value: /^(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/, message: ("Password must be at least 8 characters, include 1 digit and 1 special character.") }
                                                        })}
                                                        required="" />
                                                    {showPassword ? <i onClick={() => setShowPassword(false)} className="fa fa-eye"></i> : <i onClick={() => setShowPassword(true)} className="fa fa-eye-slash"></i>}
                                                </div>
                                                {errors.password ? <p className="errMsg">{errors.password.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-12 ps-lg-0">
                                            <div className="mb-input">
                                                <div className="password_eye">
                                                    <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Re-Type Password *"
                                                        value={watch("confirmPassword") || ''}
                                                        {...register("confirmPassword", {
                                                            required: { value: true, message: ("Confirm Password Required") },
                                                            validate: (value) => {
                                                                return value === watch("password") || ('Passwords Do Not Match')
                                                            }
                                                        })} />
                                                    {showConfirmPassword ? <i onClick={() => setShowConfirmPassword(false)} className="fa fa-eye"></i> : <i onClick={() => setShowConfirmPassword(true)} className="fa fa-eye-slash"></i>}
                                                </div>
                                                {errors.confirmPassword ? <p className="errMsg">{errors.confirmPassword.message}</p> : null}
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-12 mb-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="acceptTerms"
                                                    {...register("termsCondition", { required: { value: true, message: "Please accept the terms and condition." } })} />
                                                <label className="form-check-label" htmlFor="acceptTerms">
                                                    I agree to the <CustomLink href={'/terms-conditions'}>Terms & Conditions </CustomLink>*.
                                                </label>
                                            </div>
                                            {errors.termsCondition ? <p className="errMsg">{errors.termsCondition.message}</p> : null}
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <input type="submit" value="Sign up" className="button w-100" />
                                        </div>
                                        <div className="col-md-12 col-12">
                                            <span className="form_text">* Signifies a compulsory field</span>
                                        </div>
                                        <div className="col-md-12 col-12">
                                            <div className="back_link">
                                                <span>Already have an account?</span>
                                                <CustomLink href="/login" className="">
                                                    Login <i className="fa fa-arrow-right"></i>
                                                </CustomLink>
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
};
