'use client';
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter,useSearchParams } from 'next/navigation';

export default function ResetPassword(){
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    const searchParams = useSearchParams();
    const router = useRouter();
    const resetToken = searchParams.get('token');

    const {formState: { errors },handleSubmit,register,reset,watch} = useForm({ defaultValues: {
        newPassword: '',
        confirmPassword: ''
    }});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleResetPassword = async (data) =>{
        try{
            const response = await axios ({
                url : `${API_URL}users/reset-password`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data:JSON.stringify({
                    newpassword: data.newPassword,
                    token:resetToken
                })
            })
            if (response.data === '') {
                toast(response.data?.message || "Your password has been successfully reset.", {
                    theme: "dark",
                    position: "top-right",
                    type: "success"
                });
                router.push('/login');
            }
        }catch(error){
            console.log("error => ",error);
            
            toast(error.response.data?.message || "Try Again", {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
        }
    }

  return(
    <>
        <div className="auth">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-5 col-md-5 col-12 d-lg-flex d-md-flex d-none">
                        <Image src={'/images/reset.svg'} width={400} height={400} alt="reset password"/>    
                    </div>
                    <div className="col-lg-5 col-md-7 col-12">
                        <div className="auth_form">
                            <div className="title-dark">
                                <h2>Reset Your Password</h2>
                                <span>Time to start fresh.</span>
                                <span>Enter your new password below and get ready to roam again. Make sure it’s something secure—but something you’ll remember on your next adventure.</span>
                            </div>
                            <div className="boxwrap">
                                <form action={handleSubmit(handleResetPassword)} className="row justify-content-center needs-validation" noValidate="">
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <div className="mb-input">
                                            <div className="password_eye">
                                                <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="New Password *" value={watch('newPassword' || '')} 
                                                {...register("newPassword", {
                                                    required: { value: true, message: ('Password Required.') },
                                                    pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,}$/, message:("Invalid Password") }
                                                })} 
                                                />
                                                {showPassword ? <i onClick={() => setShowPassword(false)} className="fa fa-eye"></i> : <i onClick={() => setShowPassword(true)} className="fa fa-eye-slash"></i>}
                                            </div>
                                            {errors.newPassword ? <p className="errMsg">{errors.newPassword.message}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <div className="mb-input">
                                            <div className="password_eye">
                                                <input 
                                                type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm Password *" 
                                                value={watch('confirmPassword' || '')}
                                                {...register("confirmPassword", {
                                                    required: { value: true, message: "Confirm Password Required." },
                                                    validate: (value) => {
                                                        return value === watch("newPassword") || "Confirm passwords do not match."
                                                    }
                                                })}
                                                />
                                                {showConfirmPassword ? <i onClick={() => setShowConfirmPassword(false)} className="fa fa-eye"></i> : <i onClick={() => setShowConfirmPassword(true)} className="fa fa-eye-slash"></i>}
                                            </div>
                                            {errors.confirmPassword ? <p className="errMsg">{errors.confirmPassword.message}</p> : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <input type="submit" value="Reset Password" className="button w-100" />
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <span className="form_text">* Signifies a compulsory field</span>
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