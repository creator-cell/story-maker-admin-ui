"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { logout, userStore } from "../../redux/UserStore";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Loader from "../../components/Loader";

const AdminSidebar = ({ locale }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState(locale || "en");
  const handleNavigation = (path) => {
    if (path === "/") {
      router.push(path);
      return;
    }
  };
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const [shouldRender, setShouldRender] = useState(true);
  const [userRolePermissions, setUserRolePermissions] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;

  useEffect(() => {
    const isAdminRoute = pathname?.includes("/admin");
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password";
    setShouldRender(!(isAuthPage || !isAdminRoute));

    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const getUser = async () => {
    try {
      const response = await axios({
        url: `${API_URL}me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const hasMenuAccess = (menuName) => {
    if (!userRolePermissions?.menu) {
      return false;
    }

    const menuPermission = userRolePermissions.menu.find(
      (menu) => menu.menuName === menuName
    );

    if (!menuPermission) {
      return false;
    }

    const hasAccess =
      menuPermission.read || menuPermission.write || menuPermission.both;

    return hasAccess;
  };

  const hasWriteAccess = (menuName) => {
    if (!userRolePermissions?.menu) return false;

    const menuPermission = userRolePermissions.menu.find(
      (menu) => menu.menuName === menuName
    );

    if (!menuPermission) return false;

    return menuPermission.write || menuPermission.both;
  };

  const handleChangeLanguage = (newLang) => {
    setLang(newLang);
    const localePrefix = `/${locale}`;
    let basePath = pathname.startsWith(localePrefix)
      ? pathname.substring(localePrefix.length)
      : pathname;
    if (basePath === "") {
      basePath = "/";
    }

    let newPath = `/${newLang}${basePath}`;
    newPath = newPath.replace(/\/\//g, "/");
    router.replace(newPath);
    setLoader(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const themeRef = useRef(null);
  const langRef = useRef(null);

  // Handles closing both dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      {loader && <Loader />}
      <div id="admin_header">
        <div className="container-fluid">
          <div className="row">
            <div className="logo-img col-lg-5 col-md-2 col-4">
              <div className="toggle-btn">
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
            <div className="dark-mode col-lg-7 col-md-10 col-8">
              <div className="header_right">
                <div className="togglers">
                  <div className="toggle_theme" ref={themeRef}>
                    <button
                      className="dropdown-toggle"
                      onClick={() => setIsOpen(isOpen ? false : true)}
                    >
                      {theme === "dark" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-moon"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-brightness-high"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                        </svg>
                      )}
                    </button>
                    {isOpen && (
                      <div
                        className="dropdown-menu"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setTheme("light");
                            setIsOpen(false);
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="items">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="bi bi-brightness-high"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                              </svg>
                              <span>{t("Light")}</span>
                            </div>
                            {theme === "light" && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setTheme("dark");
                            setIsOpen(false);
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="items">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="bi bi-moon"
                                viewBox="0 0 16 16"
                              >
                                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286" />
                              </svg>
                              <span>{t("Dark")}</span>
                            </div>
                            {theme === "dark" && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="toggle_theme" ref={langRef}>
                    <button
                      className="dropdown-toggle"
                      onClick={() => setIsLangOpen(isLangOpen ? false : true)}
                    >
                      {lang === "en" ? (
                        <Image
                          src="/flags/gb.svg"
                          alt="english"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <Image
                          src="/flags/ar.svg"
                          alt="arabic"
                          width={20}
                          height={20}
                        />
                      )}
                    </button>
                    {isLangOpen && (
                      <div
                        className="dropdown-menu dropright"
                        style={{ display: isLangOpen ? "block" : "none" }}
                      >
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setLoader(true);
                            handleChangeLanguage("en");
                            setIsLangOpen(false);
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="items">
                              <Image
                                src="/flags/gb.svg"
                                alt="english"
                                width={20}
                                height={20}
                              />
                              <span>{t("English")}</span>
                            </div>
                            {lang === "en" && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setLoader(true);
                            handleChangeLanguage("ar");
                            setIsLangOpen(false);
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="items">
                              <Image
                                src="/flags/ar.svg"
                                alt="arabic"
                                width={20}
                                height={20}
                              />
                              <span>{t("Arabic")}</span>
                            </div>
                            {lang === "ar" && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`toggle_sideBar collapse navbar-collapse ${
          lang === "ar" ? "sidebar_right" : ""
        }`}
        id="navbarSupportedContent"
      >
        <div id="sidebar">
          <button
            className="navbar-toggler close_box"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i className="fa-solid fa-xmark"></i>
            </span>
          </button>
          <nav className="navbar">
            <div className="container-fluid h-100">
              <div className="side_bar_content">
                <div className="d-flex flex-column w-100 h-100" id="">
                  <img src="/frontCloud.png" alt="Story maker" loading="lazy" />
                  <div className="d-flex justify-content-between flex-column h-100 mt-2">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                      {hasMenuAccess("Dashboard") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/dashboard" ? "active" : ""
                            }`}
                            href={`/admin/dashboard`}
                          >
                            <i className="fa-solid fa-grip"></i>
                            {t("Analytic Dashboard")}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Users") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/users" ? "active" : ""
                            }`}
                            href={`/admin/users`}
                          >
                            <i className="fa-solid fa-users"></i>
                            {t("Users")}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Users") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/tickets" ? "active" : ""
                            }`}
                            href={`/admin/tickets`}
                          >
                            <i className="fa-solid fa-ticket"></i>
                            {t("Ticket")}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Roles") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/role" ? "active" : ""
                            }`}
                            href={`/admin/role`}
                          >
                            <i className="fa-solid fa-users-gear"></i>
                            {t("Role")}
                            {!hasWriteAccess("Roles") && (
                              <small className="text-muted ms-1">
                                ({t("Read Only")})
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Category") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/category" ? "active" : ""
                            }`}
                            href={`/admin/category`}
                          >
                            <i className="fa-solid fa-camera"></i>
                            {t("Category")}
                            {!hasWriteAccess("Category") && (
                              <small className="text-muted ms-1">
                                ({t("Read Only")})
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Template") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/template" ? "active" : ""
                            }`}
                            href={`/admin/template`}
                          >
                            <i className="fas fa-file"></i>
                            {t("Template")}
                            {!hasWriteAccess("Template") && (
                              <small className="text-muted ms-1">
                                ({t("Read Only")})
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Assets") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/assets" ? "active" : ""
                            }`}
                            href={`/admin/assets`}
                          >
                            <i className="fa-solid fa-newspaper"></i>
                            {t("Assets")}
                            {!hasWriteAccess("Assets") && (
                              <small className="text-muted ms-1">
                                ({t("Read Only")})
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}

                      {hasMenuAccess("Notification") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/notification"
                                ? "active"
                                : ""
                            }`}
                            href={`/admin/notification`}
                          >
                            <i className="fa-solid fa-bell"></i>
                            {t("Notification")}
                            {!hasWriteAccess("Notification") && (
                              <small className="text-muted ms-1">
                                (Read Only)
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}
                      {hasMenuAccess("Plans") && (
                        <li className="nav-item">
                          <CustomLink
                            className={`nav-link ${
                              activeLink === "/admin/plans" ? "active" : ""
                            }`}
                            href={`/admin/plans`}
                          >
                            <i className="fa-solid fa-clipboard-list"></i>
                            {t("Plans")}
                            {!hasWriteAccess("Plans") && (
                              <small className="text-muted ms-1">
                                (Read Only)
                              </small>
                            )}
                          </CustomLink>
                        </li>
                      )}
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          onClick={() => {
                            userStore.dispatch(logout());
                            localStorage.clear();
                            handleNavigation("/");
                          }}
                        >
                          <i className="fa-solid fa-arrow-right-from-bracket"></i>
                          {t("Log out")}
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
    </>
  );
};

export default AdminSidebar;
