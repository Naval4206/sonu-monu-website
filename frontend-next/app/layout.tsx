"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {!isAdminRoute && <Navbar />}
        {children}
      </body>
    </html>
  );
}
