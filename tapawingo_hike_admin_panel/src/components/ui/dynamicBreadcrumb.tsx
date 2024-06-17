"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import "./../pageLayout.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const path = pathname.split('/').filter((crumb) => crumb);

  const breadcrumbItems = [];
  path.forEach((crumb, index) => {
    const href = '/' + path.slice(0, index + 1).join('/');

    breadcrumbItems.push(
      <BreadcrumbItem key={href}>
        <BreadcrumbLink href={href}>{crumb}</BreadcrumbLink>
      </BreadcrumbItem>
    );

    if (index < path.length - 1) {
      breadcrumbItems.push(
        <BreadcrumbSeparator key={`sep-${index}`}>/</BreadcrumbSeparator>
      );
    }
  });

  return (
    <BreadcrumbList className="breadcrumb">
      <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      {path.length > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
      {breadcrumbItems}
    </BreadcrumbList>
  );
};

export default DynamicBreadcrumb;