"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import axios from "axios";
import { useForm } from "react-hook-form";
import { setCookie } from "cookies-next/client";
import { login, userStore } from "../redux/UserStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from './Loader';

export default function Login() {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    const { control, formState: { errors }, handleSubmit, register, reset, watch } = useForm({
        defaultValues: { email: '', password: '' }
    });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(false);
    const [showVerifyLink, setShowVerifyLink] = useState(false);
    const [verifyToken, setVerifyToken] = useState('');

    const handleLogin = async (data) => {
        setShowLoader(true);
        try {
            const response = await axios({
                url: `${API_URL}users/login`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            })

            localStorage.setItem('role', response.data?.user.role.name);
            // setVerifyToken(response.data.tokens.access.token);
            if (response.data) {

                toast(response.data?.message || "Login Successfully", {
                    theme: "dark",
                    position: "top-right",
                    type: "success"
                });

                const adminUser = {
                    ...response.data?.user,
                    isAdmin: true,
                    role: response.data?.user.role
                };

                localStorage.setItem('user', JSON.stringify(adminUser));

                const adminToken = {
                    ...response.data?.token,
                    isAdmin: true
                };
                console.log("token", response.data.token);
                setCookie('token', response.data.token);
           
                userStore.dispatch(login({
                    user: adminUser,
                    token: response.data.token
                }));
                router.push('/admin/users');
                console.log("pushed");
                setShowLoader(false);

            }

            else {
                setShowLoader(false);
                toast("Please verify your account.", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
                setShowVerifyLink(true);
            }
        } catch (error) {
            setShowLoader(false);
            if (error.response.data?.code === 500) {
                toast("Email not found.", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            } else {
                toast(error.response.data?.message || "Invalid Credentials", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            }
        }
    }



    return (
        <>
            {showLoader ? <Loader /> :
                <div className="auth">
                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-lg-5 col-md-5 col-12 d-lg-flex d-md-flex d-none">
                                <Image src={'/images/auth.jpg'} width={400} height={400} alt="Login Image" />
                            </div>
                            <div className="col-lg-5 col-md-7 col-12">
                                <div className="auth_form">
                                    <div className="title-dark">
                                        <h2>Welcome Back</h2>

                                    </div>
                                    <div className="boxwrap">
                                        <form action={handleSubmit(handleLogin)} className="row justify-content-center needs-validation">
                                            <div className="col-lg-12 col-md-12 col-12">
                                                <div className="mb-input">
                                                    <input type="email" className="form-control" placeholder="Email address *"
                                                        value={watch("email") || ""}
                                                        {...register("email", {
                                                            required: { value: true, message: ('Email Address Required.') },
                                                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: ("Invalid Email Address") }
                                                        })}
                                                        required="" />
                                                    {errors.email ? <p className="errMsg">{errors.email.message}</p> : null}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12">
                                                <div className="mb-input">
                                                    <div className="password_eye">
                                                        <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Password *"
                                                            value={watch("password") || ""}
                                                            {...register("password", {
                                                                required: { value: true, message: ('Password Required') },
                                                                pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,}$/, message: ("Invalid Password") }
                                                            })}
                                                            required="" />
                                                        {showPassword ? <i onClick={() => setShowPassword(false)} className="fa fa-eye"></i> : <i onClick={() => setShowPassword(true)} className="fa fa-eye-slash"></i>}
                                                    </div>
                                                    {errors.password ? <p className="errMsg">{errors.password.message}</p> : null}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12">
                                                <input type="submit" value="Log in" className="button w-100" />
                                            </div>

                                            <div className="col-lg-8 col-md-12 col-12 mt-2">
                                                <span className="form_text">* Signifies a compulsory field</span>
                                            </div>
                                            <div className="col-lg-4 col-md-12 col-12 mt-2">
                                                <div className="back_link">
                                                    <CustomLink href={'/forget-password'}>Forget Password?</CustomLink>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 mt-4">
                                                <div className="back_link justify-content-center">
                                                    <span>Don't have an account? </span>
                                                    <CustomLink href={'/register'}> Register now <i className="fa fa-arrow-right"></i></CustomLink>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};
