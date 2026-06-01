import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        <main className="relative flex-1">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-blue-100/20 blur-3xl" />
            <div className="absolute bottom-10 right-1/4 h-36 w-36 rounded-full bg-blue-50/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 pt-14 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
