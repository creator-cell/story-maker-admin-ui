"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "../../helper/LoaderContext";

export default function CustomLink({ href, children, onClick, ...props }) {
  const { setLoading } = useLoader();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const handleClick = async (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    e.preventDefault();
    setLoading(true);

    if (href === pathname) {
      setTimeout(() => setLoading(false), 500);
      return;
    }

    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
