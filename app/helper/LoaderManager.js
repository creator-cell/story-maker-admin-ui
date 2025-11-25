"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/app/helper/LoaderContext";
import Loader from "@/app/components/Loader";

export default function LoaderManager() {
  const { loading, setLoading } = useLoader();
  const pathname = usePathname();

  // Hide loader when route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return loading ? <Loader /> : null;
}
