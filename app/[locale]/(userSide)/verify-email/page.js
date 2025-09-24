import React, { Suspense } from 'react';
import Loader from "../../components/Loader";
import VerifyEmail from "../../components/VerifyEmail";

export default function Page(){
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmail/>
    </ Suspense>
  );
};