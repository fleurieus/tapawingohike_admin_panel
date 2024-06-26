import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
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
        <div>
          <Header/>
          {children}
        </div>
        </body>
        </html>
  );
}
