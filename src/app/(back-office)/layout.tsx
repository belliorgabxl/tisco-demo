import BackOfficeNavbar from "../../components/nav/back-office-navbar";

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Top Navigation */}
      <BackOfficeNavbar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
