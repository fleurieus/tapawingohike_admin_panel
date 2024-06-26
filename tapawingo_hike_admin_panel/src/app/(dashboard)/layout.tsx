import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import {UserProvider} from "@/context/userContext";

export default function DashboardLayout({
                                          children
                                        }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <UserProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar/>
          <Header/>
          {children}
        </div>
      </UserProvider>
  );
}
