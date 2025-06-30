// "use client";

// import Link from "next/link";
// import { useLoader } from "../helper/LoaderContext";

// export default function CustomLink({ href, children, ...props }) {
//   const { setLoading } = useLoader();

//   const handleClick = () => {
//     setLoading(true);
//   };

//   return (
//     <Link href={href} onClick={handleClick} {...props}>
//       {children}
//     </Link>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLoader } from "../helper/LoaderContext";

export default function CustomLink({ href, children, onClick, ...props }) {
  const { setLoading } = useLoader();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = async (e) => {
    if (onClick) {
      onClick(e);
    }
    if (e.defaultPrevented) return;
      
    e.preventDefault();
    setLoading(true);

    if (href === pathname) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
    setLoading(true);
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
