"use client";
import Link from "next/link";
import React from "react";
import {Home} from "lucide-react";
import {useUser} from "@/context/userContext";

export default function Sidebar() {
  const {role} = useUser();
  return (
      <aside className="hidden border-r bg-muted/40 md:block bg-tapawingo_green text-white">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="">Tapawingo Hike</span>
            </Link>
          </div>
          <div className="flex-1 text-white">
            {role === 'SuperAdmin' && (
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black">
                    <Home className="h-4 w-4"/>
                    Organisations
                  </Link>
                </nav>
            )}
            {role === 'OrganisationManager' || role === 'OrganisationUser' || role === 'SuperAdmin' && (
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black">
                    <Home className="h-4 w-4"/>
                    Events
                  </Link>
                </nav>
            )}
            {role === 'EventUser' || role === 'OrganisationManager' || role === 'OrganisationUser' || role === 'SuperAdmin' && (
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black">
                    <Home className="h-4 w-4"/>
                    Editions
                  </Link>
                </nav>
            )}
            {role === 'EventUser' || role === 'OrganisationManager' || role === 'OrganisationUser' || role === 'SuperAdmin' && (
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black">
                    <Home className="h-4 w-4"/>
                    Routes
                  </Link>
                </nav>
            )}
          </div>
        </div>
      </aside>
  );
}
