'use client';
import React, { useState, useEffect } from "react";
import { Modal, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { Plus, X } from "lucide-react";

export default function EditRole({ show, onHide, data, onUpdate }) {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    const [menus, setMenus] = useState([""]);
    const [permissions, setPermissions] = useState({
        read: false,
        write: false,
        both: false
    });
console.log(data);
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (data && show) {
            setValue("name", data.name || "");
            setMenus(data.menu || [""]);
            setPermissions( { read: data.read, write: data.write, both: data.both });
        }
    }, [data, show, setValue]);

    const addMenu = () => {
        setMenus([...menus, ""]);
    };

    const removeMenu = (index) => {
        setMenus(menus.filter((_, i) => i !== index));
    };

    const updateMenu = (index, value) => {
        const newMenus = [...menus];
        newMenus[index] = value;
        setMenus(newMenus);
    };

    const handlePermissionChange = (type) => {
        setPermissions(prev => {
            if (type === "both") {
                return {
                    read: !prev.both,
                    write: !prev.both,
                    both: !prev.both
                };
            } else {
                const newPermissions = { ...prev, [type]: !prev[type] };
                newPermissions.both = newPermissions.read && newPermissions.write;
                return newPermissions;
            }
        });
    };

   
    const handleRoleUpdate = async (formData) => {
        const missingFields = [];

        if (!formData.name) missingFields.push("Role Name");
        if (menus.filter(menu => menu.trim() !== "").length === 0) missingFields.push("Menus");

        if (missingFields.length > 0) {
            toast(`${missingFields.join(", ")} is required`, {
                theme: "dark",
                position: "top-right",
                type: "error",
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}role/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    menu: menus.filter(menu => menu.trim() !== ""),
                    read: permissions.read,
                    write: permissions.write,
                    both: permissions.both
                })
            });
            
            if (response.ok) {
                toast("Role updated successfully.", {
                    theme: "dark",
                    position: "top-right",
                    type: "success"
                });
                onHide();
                if (onUpdate) onUpdate();
            } else {
                toast('Failed to update role.', {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            }
        } catch (error) {
            toast('Error updating role.', {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
            console.error('Error updating role:', error);
        }
    };

      const getRole = async () => {
     

        try {
            const response = await fetch(`${API_URL}role/${data}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
              
            });
            console.log("get res",response);
           
            
        } catch (error) {
            toast('Error getting role.', {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
            console.error('Error updating role:', error);
        }
    };

    useEffect(()=>{
        getRole();
    },[])
    
    return (
        <>
            <Modal show={show} onHide={onHide} className="user_delete" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <form onSubmit={handleSubmit(handleRoleUpdate)}>
                            <Row>
                                <div className="col-lg-6 col-md-6 col-12 mb-3">
                                    <div className="form_group">
                                        <label htmlFor="role-name">Role Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="role-name"
                                            id="role-name"
                                            value={watch("name") || ""}
                                            {...register("name")}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-12 col-md-12 col-12 mb-3">
                                    <div className="form_group">
                                        <label>Menus</label>
                                        {menus.map((menu, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    value={menu}
                                                    onChange={(e) => updateMenu(index, e.target.value)}
                                                    placeholder="Enter menu name"
                                                />
                                                {menus.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMenu(index)}
                                                        className="btn btn-outline-danger btn-sm"
                                                    >
                                                     Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addMenu}
                                            className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                        >
                                            {/* <Plus size={16} className="me-1" /> */}
                                            Add Menu
                                        </button>
                                    </div>
                                </div>

                                <div className="col-lg-12 col-md-12 col-12 mb-3">
                                    <div className="form_group">
                                        <label>Permissions</label>
                                        <div className="d-flex gap-3 mt-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={permissions.read}
                                                    onChange={() => handlePermissionChange("read")}
                                                    id="readPermission"
                                                />
                                                <label className="form-check-label" htmlFor="readPermission">
                                                    Read
                                                </label>
                                            </div>
                                            
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={permissions.write}
                                                    onChange={() => handlePermissionChange("write")}
                                                    id="writePermission"
                                                />
                                                <label className="form-check-label" htmlFor="writePermission">
                                                    Write
                                                </label>
                                            </div>
                                            
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={permissions.both}
                                                    onChange={() => handlePermissionChange("both")}
                                                    id="bothPermission"
                                                />
                                                <label className="form-check-label" htmlFor="bothPermission">
                                                    Both (Read & Write)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-3">
                                    <div className="btns d-flex gap-3">
                                        <button type="submit" className="button">
                                            Update
                                        </button>
                                        <button type="button" onClick={onHide} className="button">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Row>
                        </form>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}