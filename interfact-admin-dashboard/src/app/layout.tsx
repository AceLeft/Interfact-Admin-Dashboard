'use client';
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); 

  const excludedRoutes = ["/"];

  const isExcluded = excludedRoutes.includes(pathname);

  if (isExcluded) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div></div>
        <div className="nav-container shadow">
          <div className="logo">
            <img src="https://interfact.net/images/logo.png" alt="" />
            <div className="logo-words">
              <span className="logo2">INTERFACT</span>
              <span className="logo3">ADMIN DASHBOARD</span>
            </div>
          </div>
          <Link href={"/"} className="nav-home">
            HOME
          </Link>
          <Link href={"/dashboard"} className="nav-dashboard">
            DASHBOARD
          </Link>
          <Link href={""} className="nav-locations">
            CITIES
          </Link>
          <Link href={""} className="nav-requests">
            REQUESTS
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
