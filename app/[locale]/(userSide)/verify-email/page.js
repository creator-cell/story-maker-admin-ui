import React, { Suspense } from 'react';
import Loader from "@/app/components/Loader";
import VerifyEmail from "@/app/components/auth/VerifyEmail";

export default function Page(){
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmail/>
    </ Suspense>
  );
};