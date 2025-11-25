// 'use client';

// import { Provider } from "react-redux";
// import { userStore, login } from "../redux/UserStore";

// import { useEffect } from "react";
// import axios from "axios";

// export const UserProvider = ({ children }) => {

//     const handleUser = () => {
//         if (!localStorage.getItem("token")) {
//             return;
//         }
//         axios({
//             url:`${process.env.NEXT_PUBLIC_SERVER_URL_V1}user/users`,
//             method:"GET",
//             headers: {
//                 "Authorization":`Bearer ${localStorage.getItem("token")}`
//             }
//         }).then(res => {

//             userStore.dispatch(login({ user:res.data, token:localStorage.getItem("token")} ));
//         }).catch(err => {
//             console.log(err);
//         });
//     }

//     const handleNomrallUser = () => {
//         if (!localStorage.getItem("token")) {
//             return;
//         }
//        const user=localStorage.getItem("user");

//             userStore.dispatch(login({ user:user, token:localStorage.getItem("token")} ));

//     }
//     useEffect(() => {
//         handleUser();
//         handleNomrallUser();
//     }, []);

//     return (
//         <>
//             <Provider store={userStore}>
//                 {children}
//             </Provider>
//         </>
//     );
// }
"use client";

import { Provider } from "react-redux";
import { userStore, login } from "@/app/redux/UserStore";
import { useEffect } from "react";

export const UserProvider = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Try fetching user from API

    // fallback: restore cached user if API fails
    const user = localStorage.getItem("user");
    if (user) {
      userStore.dispatch(login({ user: JSON.parse(user), token }));
    }
  }, []);

  return <Provider store={userStore}>{children}</Provider>;
};
