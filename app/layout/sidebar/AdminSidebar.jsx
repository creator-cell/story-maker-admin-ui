"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { logout, userStore } from "../../redux/UserStore";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    if (path === "/") {
      router.push(path);
      return;
    }
  };

  const [role, setRole] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const [shouldRender, setShouldRender] = useState(true);
  const [userRolePermissions, setUserRolePermissions] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

  useEffect(() => {
    // Check if we should render the sidebar
    const isAdminRoute = pathname?.includes("/admin");
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password";
    setShouldRender(!(isAuthPage || !isAdminRoute));

    // Get role from localStorage in useEffect to avoid SSR issues
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
    setActiveLink(pathname);
  }, [pathname]);

  // Use useEffect to watch for pathname changes
  useEffect(() => {
    // Update active link
    setActiveLink(pathname);
  }, [pathname]);

  const getUser = async () => {
    try {
      const response = await axios({
        url: `${API_URL}me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      
    
     
      if (response.data && response.data.rolePermissions) {
        setUserRolePermissions(response.data.rolePermissions);
        setRole(response.data.role || "");
      }
      
      return response.data;
    } catch (err) {
      console.log("Error fetching user data:", err);
    
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Function to check if user has access to a specific menu
  const hasMenuAccess = (menuName) => {
    if (!userRolePermissions?.menu) {
   
      return false;
    }

    const menuPermission = userRolePermissions.menu.find(
      menu => menu.menuName === menuName
    );

    if (!menuPermission) {
   
      return false;
    }

    // User has access if they have read, write, or both permissions
    const hasAccess = menuPermission.read || menuPermission.write || menuPermission.both;
 
    return hasAccess;
  };

  // Function to check if user has write access to a specific menu
  const hasWriteAccess = (menuName) => {
    if (!userRolePermissions?.menu) return false;

    const menuPermission = userRolePermissions.menu.find(
      menu => menu.menuName === menuName
    );

    if (!menuPermission) return false;

    return menuPermission.write || menuPermission.both;
  };

  return (
    <>
      <div id="admin_header">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* <div className="col-lg-10 col-md-10 col-10">
              <Image src={'/images/logo-white.png'} width={250} height={250} alt="Raivaro Roaming" />
            </div> */}
            <div className="col-lg-2 col-md-2 col-2">
              <button
                className="navbar-toggler admin_menuToggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon">
                  <i className="fa-solid fa-bars-staggered"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-expand-xl">
        <div className="toggle_sideBar collapse navbar-collapse" id="navbarSupportedContent">
          <div id="sidebar">
            <nav className="navbar navbar-expand-lg">
              <div className="container-fluid h-100">
                <div className="side_bar_content">
                  <div className="d-flex flex-column w-100 h-100" id="">
                    <h2>Story </h2>
                    {/* <Image src={'/images/logo-white.png'} width={250} height={250} alt="Raivaro Roaming" /> */}
                    <div className="d-flex justify-content-between flex-column h-100 mt-4">
                      <ul className="navbar-nav mb-2 mb-lg-0">
                        {/* Dashboard - Show to all authenticated users */}
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${activeLink === "/admin/dashboard" ? "active" : ""}`}
                            href={`/admin/dashboard`}
                          >
                            <i className="fa-solid fa-dashboard"></i>
                            Dashboard
                          </CustomLink>
                        </li>
                        
                        {/* Users menu - only show if user has "Users" permission */}
                        {hasMenuAccess("Users") && (
                          <li className="nav-item">
                            <CustomLink
                              className={`nav-link ${activeLink === "/admin/users" ? "active" : ""}`}
                              href={`/admin/users`}
                            >
                              <i className="fa-solid fa-users"></i>
                              Users
                              {!hasWriteAccess("Users") && (
                                <small className="text-muted ms-1">(Read Only)</small>
                              )}
                            </CustomLink>
                          </li>
                        )}
                     
                        {/* Roles menu - only show if user has "Roles" permission */}
                        {hasMenuAccess("Roles") && (
                          <li className="nav-item">
                            <CustomLink
                              className={`nav-link ${activeLink === "/admin/role" ? "active" : ""}`}
                              href={`/admin/role`}
                            >
                              <i className="fa-solid fa-newspaper"></i>
                              Role
                              {!hasWriteAccess("Roles") && (
                                <small className="text-muted ms-1">(Read Only)</small>
                              )}
                            </CustomLink>
                          </li>
                        )}

                        {/* Debug info - remove in production */}
                        {process.env.NODE_ENV === 'development' && (
                          <li className="nav-item">
                            <div className="nav-link text-muted small">
                              <div>Role: {role}</div>
                              <div>Permissions: {userRolePermissions?.menu?.length || 0} menus</div>
                            </div>
                          </li>
                        )}
                   
                        <li className="nav-item">
                          <button className="nav-link"
                            onClick={() => {
                              userStore.dispatch(logout());
                              localStorage.clear();
                              handleNavigation("/");
                            }}
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
