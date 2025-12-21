import WebsiteHeader from "@/components/WebsiteHeader";
import Footer from "@/components/footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebsiteHeader />
      
      {children}
      
      <Footer />
    </>
  );
}
