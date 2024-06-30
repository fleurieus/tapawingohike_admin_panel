"use client";

import React from "react";
import DynamicBreadcrumb from "./dynamicBreadcrumb";

const Header = () => {
  return (
      <header className="z-10 h-14 bg-tapawingo_green shadow-md sticky top-0 flex items-center">
        <DynamicBreadcrumb />
      </header>
  );
};

export default Header;
