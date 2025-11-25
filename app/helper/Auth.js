'use client';

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Auth = (ProtectedComponent) => {
    return (props) => {
        const router = useRouter();
        const isLogin = useSelector((state) => state.isLogin);
        const [loader, setLoader] = useState(true);

        const handleAuth = () => {
            if (!isLogin) {
                return router.push('/login');
            }
            setLoader(false);
        }
        
        useEffect(() => {
            handleAuth();
        }, [isLogin]);

        return (
            <>
            <ProtectedComponent { ...props } />
            </>
        );
    }
}

export default Auth;