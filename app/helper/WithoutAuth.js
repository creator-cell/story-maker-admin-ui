'use client';

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";

const WithoutAuth = (Public) => {
    return (props) => {
        const router = useRouter();
        const isLogin = useSelector((state) => state.isLogin);
        const [loader, setLoader] = useState(true);

        const handleAuth = () => {
            if (isLogin) {
                return router.push('/');
            }
            setLoader(false);
        }
        
        useEffect(() => {
            handleAuth();
        }, [isLogin]);

        return (
            <>
            { loader ? <PageLoader/> : <Public { ...props } /> }
            </>
        );
    }
}

export default WithoutAuth;