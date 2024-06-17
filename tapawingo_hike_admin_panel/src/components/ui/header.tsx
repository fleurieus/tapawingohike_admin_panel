"use client"

import React from 'react';
import DynamicBreadcrumb from './dynamicBreadcrumb';
import "./../pageLayout.css"

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="pageHeader">
      <DynamicBreadcrumb />
    </header>
  );
};

export default Header;