"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { logout, userStore } from "../../redux/UserStore";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const AdminSidebar = ({ locale }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  console.log("locale", locale);
  const [lang, setLang] = useState(locale || "en");
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
  };
  return (
    <>
      <div id="admin_header">
        <div className="container-fluid">
          <div className="row">
            <div className="logo-img col-7">
              <img className="" src="/frontCloud.png" alt="Raivaro Roaming" />
            </div>
            <div className="dark-mode col-5">
              <div className="toggle_theme">
                <input
                  type="checkbox"
                  id="toggle_checkbox"
                  checked={theme === "dark"}
                  onChange={(e) =>
                    setTheme(e.target.checked ? "dark" : "light")
                  }
                />
                <label htmlFor="toggle_checkbox">
                  <div id="star"></div>
                  <div id="moon"></div>
                </label>
              </div>
              <div className="">
                <select
                  value={lang}
                  onChange={(e) => handleChangeLanguage(e.target.value)}
                >
                  <option value="en" checked={lang === "en" ? true : false}>
                    {t("English")}
                  </option>
                  <option value="ar" checked={lang === "ar" ? true : false}>
                    {t("Arabic")}
                  </option>
                </select>
              </div>
              <div className="toggle-btn">
                <button
                  className="navbar-toggler admin_menuToggler d-lg-none"
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
      </div>
      <div className="navbar-expand-lg">
        <div
          className="toggle_sideBar collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <div id="sidebar">
            <nav className="navbar navbar-expand-xl">
              <div className="container-fluid h-100">
                <div className="side_bar_content">
                  <div className="d-flex flex-column w-100 h-100" id="">
                    <img
                      className="mx-auto d-grid"
                      style={{ width: "100px" }}
                      src="/frontCloud.png"
                      alt="Raivaro Roaming"
                    />
                    <div className="d-flex justify-content-between flex-column h-100 mt-4">
                      <ul className="navbar-nav mb-2 mb-lg-0">
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
                              <i className="fa-solid fa-newspaper"></i>
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
                              <i className="fa-solid fa-newspaper"></i>
                              {t("Notification")}
                              {!hasWriteAccess("Notification") && (
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
      </div>
    </>
  );
};

export default AdminSidebar;
