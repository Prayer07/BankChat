'use client'
import './globals.css'
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";


export default function RootLayout({ children }) {
  const [fname, setFname] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const name = sessionStorage.getItem("fname");
    setFname(name || "");
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <html lang="en">
      <body>
        {fname && (
          <div className="flex justify-between items-center bg-blur-500 text-white px-4 py-2 font-semibold">
            <span>Hello, {fname}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 text-sm">
              Logout
            </button>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
