"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verifyToken = searchParams.get("token");
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
  const { t } = useTranslation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios({
          url: `${API_URL}users/verify-email?token=${verifyToken}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data) {
          toast(t("Your email has been successfully verified."),
            {
              theme: "dark",
              position: "top-right",
              type: "success",
            }
          );
          router.push("/login");
        }
      } catch (error) {
        toast(t("Try Again"), {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    };
    verifyEmail();
  }, []);

  return <>Welcome</>;
}
