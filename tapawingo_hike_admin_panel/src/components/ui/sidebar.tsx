"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

const userOrganisations = [
  { id: 1, name: "Organisation A" },
  { id: 2, name: "Organisation B" },
  { id: 3, name: "Organisation C" },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); // State om bij te houden welk menu uitgeklapt is

  const toggleMenu = (menuName: any) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
      <aside className="hidden border-r bg-muted/40 md:block bg-tapawingo_green text-white">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white text-2xl">
              <span className="">Tapawingo Hike</span>
            </Link>
          </div>
          <div className="flex-1 text-white">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* Organisations */}
              <div>
                <button
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black w-full"
                    onClick={() => toggleMenu('organisations')}
                >
                  {openMenu === 'organisations' ? (
                      <ChevronUp className="h-4 w-4 transform rotate-0" /> // Pijltje omhoog
                  ) : (
                      <ChevronDown className="h-4 w-4 transform rotate-0" /> // Pijltje omlaag
                  )}
                  Organisations
                </button>
                {/* Submenu Organisations */}
                {openMenu === 'organisations' && (
                    <div className="ml-4 mt-2">
                      {userOrganisations.map((org) => (
                          <Link key={org.id} href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-black">
                            <span className="ml-4">{org.name}</span>
                          </Link>
                      ))}
                    </div>
                )}
              </div>

              {/* Andere menu items hier */}
            </nav>
          </div>
        </div>
      </aside>
  );
};

export default Sidebar;
