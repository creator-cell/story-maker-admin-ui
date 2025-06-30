"use client";
import axios from "axios";
import { useRouter,useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const verifyToken = searchParams.get('token');
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

    useEffect(()=>{
        const verifyEmail = async () => {
            try{
                const response = await axios ({
                    url : `${API_URL}/auth/verify-email?token=${verifyToken}`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
          
                
                if (response.data) {
                    toast(response.data?.message || "Your email has been successfully verified.", {
                        theme: "dark",
                        position: "top-right",
                        type: "success"
                    });
                    router.push('/login');
                }
            }catch(error){
                toast(error.response.data?.message || "Try Again", {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            }
        }
        verifyEmail();
    },[])

    return(
        <>Welcome</>
    )
}