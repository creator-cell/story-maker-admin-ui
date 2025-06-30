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
            firstName: '',
            lastName: '',
            dob: '',
            email: '',
            address: '',
            address2: '',
            townCity: '',
            state: '',
            zipCode: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            termsCondition: true,
            sendMarketingEmail: false,
            country: '',
            region: '',
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

    const getRegions = async () => {
        try {
            const response = await axios({
                url: `${API_URL}/regional/getAllRegional`,
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const regionsData = response.data;
            console.log("regional", response);
            setRegions(regionsData);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRegions();
    }, []);

    const getCountries = async () => {
        try {
            const response = await axios({
                url: `${API_URL}/country/getAllCountry`,
                method: "GET",
                // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("res", response);
            const filteredCountries = response.data.filter(
                (country) => country.is_type_one === true
            );

            setCountries(filteredCountries);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCountries();
    }, []);
    const handleRegister = async (data) => {

        const birthDate = data.dob.getMonth() + '-' + data.dob.getMonth() + '-' + data.dob.getFullYear();
        setShowLoader(true);
        try {
            const response = await axios({
                url: `${API_URL}/auth/register`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    birthDate: birthDate,
                    address: data.address,
                    address2: data.address2,
                    townCity: data.townCity,
                    state: data.state,
                    zipCode: data.zipCode,
                    email: data.email,
                    password: data.password,
                    phoneNumber: data.phoneNumber,
                    sendMarketingEmail: data.sendMarketingEmail,
                    country: data.country,
                    region: data.region
                })
            })
            const verifyToken = response.data.tokens.access.token;
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
                            <Image src={'/images/register.svg'} width={500} height={500} alt="register image" />
                        </div>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="auth_form">
                                <div className="title-dark">
                                    <h2>Join the Future of Travel</h2>
                                    <span>Sign up in seconds and get instant access to seamless eSIM connectivity in over 190 countries. Travel smart, stay online.</span>
                                </div>
                                <div className="boxwrap">
                                    <form action={handleSubmit(handleRegister)} className="row justify-content-center needs-validation">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="First Name *"
                                                    value={watch("firstName") || ""}
                                                    {...register("firstName", {
                                                        required: { value: true, message: ('First name required.') },
                                                        pattern: {
                                                            value: /^[A-Za-z\s]+$/,
                                                            message: "First name should not contain numbers or special characters",
                                                        },
                                                    })} />
                                                {errors.firstName ? <p className="errMsg">{errors.firstName.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="Last Name *"
                                                    value={watch("lastName") || ""}
                                                    {...register("lastName", {
                                                        required: { value: true, message: ('Last name required.') },
                                                        pattern: {
                                                            value: /^[A-Za-z\s]+$/,
                                                            message: "Last name should not contain numbers or special characters",
                                                        },
                                                    })} />
                                                {errors.lastName ? <p className="errMsg">{errors.lastName.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="mb-input">
                                                <DatePicker
                                                    className="form-control"
                                                    selected={dob}
                                                    onChange={(date) => {
                                                        setDob(date);
                                                        setValue("dob", date, {
                                                            shouldValidate: true,
                                                        });
                                                    }}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Date of Birth *"
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    yearDropdownItemNumber={100}
                                                    maxDate={new Date()}
                                                />
                                                {errors.dob && <p className="errMsg">{errors.dob.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-12 visually-hidden">
                                            {/* Hidden input to register with react-hook-form */}
                                            <input
                                                type="hidden"
                                                {...register("dob", {
                                                    required: { value: true, message: ('Birth date required.') },
                                                    validate: checkAge,
                                                })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-12">
                                            <div className="mb-input">
                                                <PhoneInput
                                                    placeholder="Enter phone number"
                                                    className="form-control"
                                                    value={watch("phoneNumber") || ""}
                                                    onChange={(value) => {
                                                        setValue("phoneNumber", value, { shouldValidate: true });
                                                        trigger("phoneNumber");
                                                    }}
                                                    defaultCountry="GB" // Default country (change as needed)
                                                    international // Shows country code in the input
                                                    countryCallingCodeEditable={false}
                                                    addInternationalOption={false}
                                                />
                                                <input
                                                    type="hidden"
                                                    {...register("phoneNumber", {
                                                        required: {
                                                            value: true,
                                                            message: 'Phone Number Required.'
                                                        },
                                                        validate: {
                                                            validFormat: (value) => {
                                                                if (!value) return "Phone number is required";

                                                                // Check if it's a valid international format
                                                                const phoneRegex = /^\+[1-9]\d{1,14}$/;
                                                                if (!phoneRegex.test(value)) {
                                                                    return "Please enter a valid phone number with country code";
                                                                }

                                                                // Check minimum length (country code + at least 7 digits)
                                                                if (value.length < 8) {
                                                                    return "Phone number is too short";
                                                                }

                                                                // Check maximum length (E.164 format allows up to 15 digits)
                                                                if (value.length > 16) { // +1 for the + sign
                                                                    return "Phone number is too long";
                                                                }

                                                                return true;
                                                            },
                                                            noConsecutiveZeros: (value) => {
                                                                // Prevent numbers with too many consecutive zeros
                                                                if (value && /0{4,}/.test(value)) {
                                                                    return "Invalid phone number format";
                                                                }
                                                                return true;
                                                            }
                                                        }
                                                    })}
                                                />
                                                {errors.phoneNumber ? <p className="errMsg">{errors.phoneNumber.message}</p> : null}
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
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="Address *"
                                                    value={watch("address") || ""}
                                                    {...register("address", {
                                                        required: { value: true, message: ('Address is required.') },
                                                    })} />
                                                {errors.address ? <p className="errMsg">{errors.address.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="Address 2(optional)*"
                                                    value={watch("address2") || ""}
                                                    {...register("address2")} />
                                                {errors.address2 ? <p className="errMsg">{errors.address2.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12 ps-lg-0px 12px">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="City *"
                                                    value={watch("townCity") || ""}
                                                    {...register("townCity", {
                                                        required: { value: true, message: ('City is required.') },
                                                    })} />
                                                {errors.townCity ? <p className="errMsg">{errors.townCity.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="State *"
                                                    value={watch("state") || ""}
                                                    {...register("state", {
                                                        required: { value: true, message: ('State is required.') },
                                                    })} />
                                                {errors.state ? <p className="errMsg">{errors.state.message}</p> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-12 ps-lg-0px 12px">
                                            <div className="mb-input">
                                                <input type="text" className="form-control" placeholder="Zipcode *"
                                                    value={watch("zipCode") || ""}
                                                    {...register("zipCode", {
                                                        required: { value: true, message: ('Zipcode is required.') },
                                                        pattern: {
                                                            value: /^[A-Za-z0-9\s\-]{3,10}$/,
                                                            message: "Invalid zipcode.",
                                                        },
                                                    })} />
                                                {errors.zipCode ? <p className="errMsg">{errors.zipCode.message}</p> : null}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 w-100">
                                            <div className="form_group">
                                                <select
                                                    className="form-control"
                                                    {...register("country", {
                                                        required: "Country is required",
                                                    })}
                                                >
                                                    <option value="">Select Country *</option>
                                                    {countries.map((country) => (
                                                        <option key={country._id} value={country._id}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.country && (
                                                    <span className="errMsg" style={{ color: "red" }}>
                                                        {errors.country.message}
                                                    </span>
                                                )}
                                            </div>
                                        </div>


                                        <div className="col-lg-6 col-md-6 col-12 w-100 ">
                                            <div className="form_group">
                                                <select
                                                    className="form-control"
                                                    {...register("region", {
                                                        required: "Region is required",
                                                    })}
                                                >
                                                    <option value="">Select Region *</option>
                                                    {regions.map((region) => (
                                                        <option key={region._id} value={region._id}>
                                                            {region.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.region && (
                                                    <span className="errMsg" style={{ color: "red" }}>
                                                        {errors.region.message}
                                                    </span>
                                                )}
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
                                                <input className="form-check-input" type="checkbox" id="marketingEmail"
                                                    {...register("sendMarketingEmail")}
                                                />
                                                <label className="form-check-label" htmlFor="marketingEmail">
                                                    Please tick if you consent to receive marketing emails from us.
                                                </label>
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
