"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Organisation } from '@/types/organisation';
import { Event } from '@/types/event';
import "./../pageLayout.css";
import { API_BASE_URL } from '@/lib/utils';
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

  const [breadcrumbItems, setBreadcrumbItems] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const items: React.ReactElement[] = [];
      let organisationId = '';
      let eventId = '';

      for (let index = 0; index < path.length; index++) {
        const crumb = path[index];
        const href = '/' + path.slice(0, index + 1).join('/');

        let isNumberCrumb = null;
        if (!isNaN(Number(crumb))) {
          if (index > 0) {
            const parentType = path[index - 1];
            switch (parentType) {
              case 'organisations':
                organisationId = crumb;
                isNumberCrumb = await getOrganisations(crumb);
                break;
              case 'events':
                eventId = crumb;
                isNumberCrumb = await getEvents(organisationId, eventId);
                break;
              default:
                break;
            }
          }
        }


        items.push(
          <BreadcrumbItem key={href}>
            {isNaN(Number(crumb)) ? (
              <BreadcrumbLink href={href}>{crumb}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{isNumberCrumb?.name}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        );

        if (index < path.length - 1) {
          items.push(
            <BreadcrumbSeparator key={`sep-${index}`}>/</BreadcrumbSeparator>
          );
        }
      }

      setBreadcrumbItems(items);
    };

    fetchData();
  }, [pathname]);

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

async function getOrganisations(organisationId: string): Promise<Organisation> {
  const response = await fetch(`${API_BASE_URL}/organisations/${organisationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function getEvents(organisationId: string, eventId: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/organisations/${organisationId}/events/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}