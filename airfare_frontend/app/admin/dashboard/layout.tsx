import AdminSidebar from "../../Components/SidebarAdmin";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen text-slate-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen overflow-y-auto scroll-smooth">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">{children}</div>
      </main>
    </div>
  );
}
