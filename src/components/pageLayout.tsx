import React, { ReactNode } from 'react';
import Header from '@/components/ui/header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  );
};

export default Layout;