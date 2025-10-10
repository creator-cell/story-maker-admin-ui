'use client';
import React, { useState, useEffect } from "react";
import { Modal, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function EditRole({ show, onHide, data, onUpdate }) {
      const { t } = useTranslation();
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
    const [menuPermissions, setMenuPermissions] = useState({
        Users: {
            read: false,
            write: false,
            both: false
        },
        Roles: {
            read: false,
            write: false,
            both: false
        }
    });

    // Hardcoded menu options to match AddRole
    const availableMenus = [
        { key: "Users", label: "Users" },
        { key: "Roles", label: "Roles" }
    ];

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
            
            // Initialize menu permissions from data
            if (data.menuPermissions) {
                setMenuPermissions(data.menuPermissions);
            } else {
                // Reset to default if no data
                setMenuPermissions({
                    Users: { read: false, write: false, both: false },
                    Roles: { read: false, write: false, both: false }
                });
            }
        }
    }, [data, show, setValue]);

    const handlePermissionChange = (menuKey, permissionType) => {
        setMenuPermissions(prev => {
            const currentMenu = prev[menuKey];
            let newPermissions = { ...currentMenu };

            if (permissionType === "both") {
                newPermissions = {
                    ...newPermissions,
                    read: !currentMenu.both,
                    write: !currentMenu.both,
                    both: !currentMenu.both
                };
            } else {
                newPermissions = {
                    ...newPermissions,
                    [permissionType]: !currentMenu[permissionType]
                };
                // Update 'both' based on read and write
                newPermissions.both = newPermissions.read && newPermissions.write;
            }

            return {
                ...prev,
                [menuKey]: newPermissions
            };
        });
    };

    const handleRoleUpdate = async (formData) => {
        const missingFields = [];

        if (!formData.name) missingFields.push("Role Name");

        // Check if at least one menu has at least one permission
        const hasAnyPermission = Object.keys(menuPermissions).some(menu => {
            const perms = menuPermissions[menu];
            return perms.read || perms.write || perms.both;
        });

        if (!hasAnyPermission) {
            missingFields.push("At least one permission for any menu");
        }

        if (missingFields.length > 0) {
            toast(`${missingFields.join(", ")} is required`, {
                theme: "dark",
                position: "top-right",
                type: "error",
            });
            return;
        }

        try {
            // Filter out menus with no permissions selected
            const filteredMenuPermissions = Object.keys(menuPermissions)
                .filter(menu => {
                    const perms = menuPermissions[menu];
                    return perms.read || perms.write || perms.both;
                })
                .reduce((acc, menu) => {
                    acc[menu] = menuPermissions[menu];
                    return acc;
                }, {});

            // Prepare data for API - matching AddRole structure
            const roleData = {
                name: formData.name,
                menuPermissions: filteredMenuPermissions
            };

            const response = await fetch(`${API_URL}role/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(roleData)
            });
            
            if (response.ok) {
                toast(t("Role updated successfully"), {
                    theme: "dark",
                    position: "top-right",
                    type: "success"
                });
                onHide();
                if (onUpdate) onUpdate();
            } else {
                const errorData = await response.json();
                toast(errorData?.message || t('Failed to update role'), {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            }
        } catch (error) {
            toast(t('Error updating role'), {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
            console.error('Error updating role:', error);
        }
    };

    const getRole = async () => {
        if (!data?._id) return;

        try {
            const response = await fetch(`${API_URL}role/${data._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            
            if (response.ok) {
                const roleData = await response.json();
              
            }
        } catch (error) {
            toast(t('Error getting role'), {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
            console.error('Error getting role:', error);
        }
    };

    useEffect(() => {
        if (data?._id) {
            getRole();
        }
    }, [data?._id]);
    
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
                                        <label htmlFor="role-name">Role Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="role-name"
                                            id="role-name"
                                            placeholder="Enter role name"
                                            value={watch("name") || ""}
                                            {...register("name", { required: "Role name is required" })}
                                        />
                                        {errors.name && (
                                            <small className="text-danger">{errors.name.message}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12 col-md-12 col-12 mb-3">
                                    <div className="form_group">
                                        <label>Menu Access & Permissions <span className="text-danger">*</span></label>
                                        <div className="menu-permissions-table mt-3">
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th style={{ width: '200px' }}>Menu</th>
                                                            <th style={{ width: '150px' }} className="text-center">Read</th>
                                                            <th style={{ width: '150px' }} className="text-center">Write</th>
                                                            <th style={{ width: '150px' }} className="text-center">Both</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {availableMenus.map((menu) => (
                                                            <tr key={menu.key}>
                                                                <td>
                                                                    <strong>{menu.label}</strong>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="form-check d-flex justify-content-center">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={menuPermissions[menu.key]?.read || false}
                                                                            onChange={() => handlePermissionChange(menu.key, 'read')}
                                                                            id={`read-${menu.key}`}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="form-check d-flex justify-content-center">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={menuPermissions[menu.key]?.write || false}
                                                                            onChange={() => handlePermissionChange(menu.key, 'write')}
                                                                            id={`write-${menu.key}`}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="form-check d-flex justify-content-center">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={menuPermissions[menu.key]?.both || false}
                                                                            onChange={() => handlePermissionChange(menu.key, 'both')}
                                                                            id={`both-${menu.key}`}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            Select permissions for each menu. 'Both' automatically selects Read and Write.
                                        </small>
                                    </div>
                                </div>

                                <div className="col-12 mt-3">
                                    <div className="btns d-flex gap-3">
                                        <button type="submit" className="button">
                                            Update
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={onHide} 
                                            className="button"
                                            style={{ backgroundColor: '#6c757d' }}
                                        >
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
