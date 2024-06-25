import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Tapawingo Hike Admin Panel",
  description: "Admin panel for managing hikes at Tapawingo Campground.",
};

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar/>
        <Header/>
        {children}
      </div>
      </body>
      </html>
  );
}
