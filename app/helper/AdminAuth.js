'use client';

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";

const AdminAuth = (ProtectedComponent) => {
    return (props) => {
        const router = useRouter();
        const isLogin = useSelector((state) => state.isLogin);
        const user = useSelector((state) => state.user);
        const [loader, setLoader] = useState(true);

        const handleAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (!isLogin && !storedToken) {
                return router.push('/login');
            } 
             router.push('/admin/user');
            
            setLoader(false);
        }
        
        
        useEffect(() => {
            handleAuth();
        }, [isLogin, user]);

        return (
            <>
            { loader ? <PageLoader/> : <ProtectedComponent { ...props } /> }
            </>
        );
    }
}

export default AdminAuth;