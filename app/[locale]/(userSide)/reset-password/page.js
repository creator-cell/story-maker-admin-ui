import React, { Suspense } from 'react';
import ResetPassword from "@/app/components/auth/ResetPassword"
import Loader from "@/app/components/Loader";

export default function Page(){
  return(
    <Suspense fallback={<Loader />}>
      <ResetPassword />
    </Suspense>
  )
};