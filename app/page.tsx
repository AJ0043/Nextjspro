// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "My Ecom",
  description: "Ecommerce App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     
      {children}
    </>
  );
}
