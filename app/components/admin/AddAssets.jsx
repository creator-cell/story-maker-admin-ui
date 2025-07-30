
"use client";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import {WithContext as ReactTags, SEPARATORS} from "react-tag-input";

import { useRouter } from "next/navigation";

const AddAssets = () => {

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
            name:"",
            document: "",
            type: "",
            format: "",
            description: "",
            tags: []
        },
    });

    useEffect(() => {
    }, []);



    const handleAddAssets = (data) => {
        setLoader(true);
        const newFormData = new FormData();
        newFormData.append("name", data?.name);
        newFormData.append("document", data?.document?.[0]);
        newFormData.append("type", data?.type);
        newFormData.append("format", data?.format);
        newFormData.append("description", data?.description);
        data?.tags?.map((p, index) => {
            newFormData.append(`tags[${index}]`, p?.text)
        });
        // newFormData.append("tags", data?.tags?.map(p => { return p?.text }));
        axios({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_SERVER_URL_ASSETS}assets`,
            headers: {
                "Content-Type" : "multipart/form-data",
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            },
            data: newFormData
        }).then(res => {
            reset({ description:null, document:null, format:null, name:null, tags:[], type:null });
            toast(res?.data?.message || "assets added successfully", {
                type:"success",
                theme:"light",
                position:"top-right"
            });
            router.push("/admin/assets")
        }).catch(err => {
            toast(err?.response?.data?.errors?.[0]?.message ?? err?.response?.data?.message ?? "Failed to add assets", {
                type:"error",
                theme:"light",
                position:"top-right"
            });
        }).finally(() => {
            setLoader(false);
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
                                        <h3>Add New Assets</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="admin_form_panel">
                                <form onSubmit={handleSubmit(handleAddAssets)}>
                                    <div className="row">

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="full-name"
                                                    id="full-name"
                                                    aria-describedby="helpId"
                                                    {...register("name",{
                                                        required: { message:"Name is required.", value:true }
                                                    })}
                                                />
                                            </div>
                                            { errors?.name ? <p className="text-danger">{errors?.name?.message}</p> : null }
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Document <span className="text-danger">*</span></label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="document"
                                                    id="document"
                                                    aria-describedby="helpId"
                                                    {...register("document", {
                                                        required: { "message": "Document is require", value: true }
                                                    })}
                                                />
                                            </div>
                                            { errors?.document ? <p className="text-danger">{errors?.document?.message}</p> : null }
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Type <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="full-name"
                                                    id="full-name"
                                                    aria-describedby="helpId"
                                                    {...register("type", {
                                                        required: { message:"Type is require", value:true }
                                                    })}
                                                />
                                            </div>
                                            { errors?.type ? <p className="text-danger">{errors?.type?.message}</p> : null }
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Format</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="full-name"
                                                    id="full-name"
                                                    aria-describedby="helpId"
                                                    {...register("format")}
                                                />
                                            </div>
                                            { errors?.format ? <p className="text-danger">{errors?.format?.message}</p> : null }
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Description</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="full-name"
                                                    id="full-name"
                                                    aria-describedby="helpId"
                                                    {...register("description")}
                                                />
                                            </div>
                                            { errors?.description ? <p className="text-danger">{errors?.description?.message}</p> : null }
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                                            <div className="form_group">
                                                <label htmlFor="full-name">Tags</label>
                                                <Controller
                                                control={control}
                                                name="tags"
                                                render={({field:{onChange,value}}) => (
                                                    <ReactTags
                                                    tags={value}
                                                    separators={[SEPARATORS.COMMA, SEPARATORS.ENTER]}
                                                    handleDelete={(index) => {
                                                        const filterTags = value?.filter((f,i) => i != index);
                                                        onChange(filterTags);
                                                    }}
                                                    handleAddition={(tag) => {
                                                        if (!value) {
                                                            onChange([tag]);
                                                        } else {
                                                            onChange([...value, tag]);
                                                        }
                                                    }}/>                                              
                                                )}/>
                                            </div>
                                            { errors?.tags ? <p className="text-danger">{errors?.tags?.message}</p> : null }
                                        </div>

                                        <div className="col-12 mt-3 d-flex gap-3">
                                            <button type="submit" className="button">
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="button"
                                                style={{ backgroundColor: '#6c757d' }}
                                                onClick={() => router.push("/admin/assets")}
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

export default AddAssets;
