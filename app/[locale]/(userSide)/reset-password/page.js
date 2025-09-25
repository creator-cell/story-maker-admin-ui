import React, { Suspense } from 'react';
import ResetPassword from "../../components/ResetPassword"
import Loader from "../../components/Loader";

export default function Page(){
  return(
    <Suspense fallback={<Loader />}>
      <ResetPassword />
    </Suspense>
  )
};