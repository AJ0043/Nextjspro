import WebsiteHeader from "@/components/WebsiteHeader";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebsiteHeader />
      {children}
    </>
  );
}
