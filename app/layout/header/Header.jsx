// "use client";
// import Image from "next/image";
// import CustomLink from "../../components/CustomLink";

// import { useSelector, useDispatch } from "react-redux";
// import menuBar from "../../../public/images/burger-bar.png";
// import { useState, useEffect, useRef } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useCurrency } from "../../helper/CurrencyContext";
// import { logout } from "../../redux/UserStore";

// const Header = ({ onCurrencyChange }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
  
//   const [activeLink, setActiveLink] = useState();
//   const collapseRef = useRef(null);

//   const isLogin = useSelector((state) => state.isLogin);

//   // Remove the separate isUser state and use isLogin from Redux instead
//   // const [isUser, setIsUser] = useState(false);

//   // Check if user role is 'user' - you can keep this logic but sync it with Redux
//   const isUser = isLogin && localStorage.getItem('role') === 'user';

//   // Remove this useEffect since we're now using Redux state directly
//   // useEffect(() => {
//   //   const role = localStorage.getItem('role');
//   //   if (role === 'user') {
//   //     setIsUser(true);
//   //   }
//   // }, []);

//   const handleCurrencySelect = (currency) => {
//     localStorage.setItem('currency', currency);
//     setCurrency(currency);
//   };

//   useEffect(() => {
//     setActiveLink(pathname || "/");
//   }, [pathname]);

//   // Function to close the menu
//   const closeMenu = () => {
//     if (collapseRef.current) {
//       // Use Bootstrap's collapse API to hide the menu
//       const bsCollapse = new window.bootstrap.Collapse(collapseRef.current, {
//         toggle: false
//       });
//       bsCollapse.hide();
//     }
//   };

//   // Handle menu item click
//   const handleMenuItemClick = () => {
//     closeMenu();
//   };

//   // Handle logout
//   function handleLogout(e) {
//     closeMenu();
//     dispatch(logout());
//     // Remove the setIsUser(false) since we're not using local state anymore
//     // setIsUser(false);
//     localStorage.removeItem('role'); // Clear role from localStorage
//     // localStorage.clear(); // Uncomment if you want to clear all localStorage
//     router.push("/login"); // Redirect to login page
//   }

//   return (
//     <>
//       <header id="header">
//         <div className="accordion" id="menu-header">
//           <div className="accordion-header">
//             <div className="container">
//               <div className="row">
//                 <div className="col-12">
//                   <div className="head-wrap">
//                     <div className="logo">
//                       <CustomLink href="/" onClick={handleMenuItemClick}>
//                         <Image src={logo} width="250" alt="Logo" />
//                       </CustomLink>
//                     </div>
//                     <div className="right_menu">
//                       <div className="dropdown">
//                         <button
//                           className="button dropdown-toggle"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           {currency}
//                         </button>
//                         <ul className="dropdown-menu">
//                           {["EUR", "USD", "CAD", "AUD", "GBP"].map((cur) => (
//                             <li
//                               key={cur}
//                               onClick={() => handleCurrencySelect(cur)}
//                             >
//                               <span className="dropdown-item">{cur}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div className="auth_buttons">
//                         {!isUser && (
//                           <>
//                             <CustomLink href="/login" className="auth_button" onClick={handleMenuItemClick}>
//                               Login
//                             </CustomLink>
//                             <CustomLink href="/register" className="button" onClick={handleMenuItemClick}>
//                               Register
//                             </CustomLink>
//                           </>
//                         )}
//                         {isUser && (
//                           <CustomLink href="/login" className="button" onClick={handleLogout}>
//                             Logout
//                           </CustomLink>
//                         )}
//                       </div>
//                       <button
//                         className="accordion-button"
//                         type="button"
//                         data-bs-toggle="collapse"
//                         data-bs-target="#collapsemenu"
//                         aria-expanded="false"
//                         aria-controls="collapsemenu"
//                       >
//                         <Image src={menuBar} alt="menuBar" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div
//             id="collapsemenu"
//             className="accordion-collapse collapse"
//             data-bs-parent="#menu-header"
//             ref={collapseRef}
//           >
//             <div className="accordion-body">
//               <div className="container">
//                 <div className="row">
//                   <div className="col-lg-12 col-md-12 col-12 mb-lg-0 mb-3">
//                     <ul>
//                       <li>
//                         <CustomLink href={`/`} className="main" onClick={handleMenuItemClick}>
//                           Home
//                         </CustomLink>
//                       </li>
//                       {isUser && <li>
//                         <CustomLink href="/orders" className="main" onClick={handleMenuItemClick}>
//                           Orders
//                         </CustomLink>
//                       </li>}
//                       <li>
//                         <CustomLink href={`/about`} className="main" onClick={handleMenuItemClick}>
//                           About
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink href={`/contact-us`} className="main" onClick={handleMenuItemClick}>
//                           Contact
//                         </CustomLink>
//                       </li>
//                       {/* </ul> */}
//                       {/* </div>
//                   <div className="col-lg-4 col-md-4 col-12 mb-lg-0 mb-3">
//                     <ul> */}
//                       <li>
//                         <CustomLink href="/local-esim" className="main" onClick={handleMenuItemClick}>
//                           Local eSim
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink href="/regional-esim" className="main" onClick={handleMenuItemClick}>
//                           Regional eSim
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink href="/global-esim" className="main" onClick={handleMenuItemClick}>
//                           Global eSim
//                         </CustomLink>
//                       </li>
//                     </ul>
//                   </div>
//                   {/* <div className="col-lg-4 col-md-4 col-12 mb-lg-0 mb-3">
//                     <ul>
//                       {!isUser && (
//                         <>
//                           <li>
//                             <CustomLink href="/login" className="sub" onClick={handleMenuItemClick}>
//                               Login
//                             </CustomLink>
//                           </li>
//                           <li>
//                             <CustomLink href="/register" className="sub" onClick={handleMenuItemClick}>
//                               Register
//                             </CustomLink>
//                           </li>
//                         </>
//                       )}
//                       {isUser && (
//                         <li>
//                           <CustomLink href="/login" className="sub" onClick={handleLogout}>
//                             Logout
//                           </CustomLink>
//                         </li>
//                       )}
//                     </ul>
//                   </div> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;
