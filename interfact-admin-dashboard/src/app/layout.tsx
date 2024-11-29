import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          
        </div>
        <div className="nav-container shadow">
          <div className="logo"><img src="interfact-logo.webp" alt="" /> <div className="logo-words"><span className="logo2">INTERFACT</span><span className="logo3">ADMIN DASHBOARD</span></div></div>
          <Link href={"/"} className="nav-home">HOME</Link>
          <Link href={"/dashboard"} className="nav-dashboard">DASHBOARD</Link>
          <Link href={""} className="nav-locations">CITIES</Link>
          <Link href={""} className="nav-requests">REQUESTS</Link>
          {/* <Link className="nav-account">account</Link> */}
        </div>
        {children}
      </body>
    </html>
  );
}
