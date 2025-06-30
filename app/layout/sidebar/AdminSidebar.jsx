"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { logout, userStore } from "../../redux/UserStore";
import { useRouter, usePathname } from "next/navigation";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
console.log("hii");
  const handleNavigation = (path) => {
    if (path === "/") {
      router.push(path);
      return;
    }
  };

  const [role, setRole] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const [shouldRender, setShouldRender] = useState(true);

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

    // const timer = setTimeout(() => {
    //   setIsNavigating(false);
    // }, 1000);
    // return () => clearTimeout(timer);

    // Update active link
    setActiveLink(pathname);

  }, [pathname]);

  // if (!shouldRender) {
  //   return null;
  // }


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
                        {/* <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${activeLink === "/admin/dashboard" ? "active" : ""}`}
                            href={`/admin/dashboard`}
                          >
                            <i className="fa-solid fa-dashboard"></i>
                            Dashboard
                          </CustomLink>
                        </li> */}
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${activeLink === "/admin/users" ? "active" : ""}`}
                            href={`/admin/users`}
                          >
                            <i className="fa-solid fa-users"></i>
                            Users
                          </CustomLink>
                        </li>
                     
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${activeLink === "/admin/cms" ? "active" : ""}`}
                            href={`/admin/cms`}
                          >
                            <i className="fa-solid fa-newspaper"></i>
                            Role
                          </CustomLink>
                        </li>
                   
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
