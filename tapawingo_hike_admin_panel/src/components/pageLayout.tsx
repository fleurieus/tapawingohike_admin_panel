import React, { ReactNode } from 'react';
import Header from '@/components/ui/header';

interface LayoutProps {
  children: ReactNode;
  headerProps: {
    title?: string;
    subtitle?: string;
  };
}

const Layout = ({ children, headerProps }: LayoutProps) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;