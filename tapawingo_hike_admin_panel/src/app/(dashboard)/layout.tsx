import { UserProvider } from "@/context/userContext";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";

export default function DashboardLayout({
                                          children,
                                        }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <UserProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-row flex-grow overflow-hidden">
            <Sidebar />
            <main className="flex-grow overflow-auto p-4 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </UserProvider>
  );
}
