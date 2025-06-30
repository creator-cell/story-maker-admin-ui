"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "./LoaderContext";
import Loader from "../components/Loader";

export default function LoaderManager() {
  const { loading, setLoading } = useLoader();
  const pathname = usePathname();

  // Hide loader when route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return loading ? <Loader /> : null;
}
