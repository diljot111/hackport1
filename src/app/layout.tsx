import "./globals.css";
import NavbarWrapper from "./navwrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <NavbarWrapper /> {/* This handles Navbar visibility */}
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
