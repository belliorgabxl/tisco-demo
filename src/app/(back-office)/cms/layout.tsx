export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full bg-white">{children}</div>;
}
