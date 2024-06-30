"use client";

import React, {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Organisation} from '@/types/organisation';
import {Event} from '@/types/event';
import "./../pageLayout.css";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Edition} from '@/types/edition';
import {Route} from '@/types/route';
import {Team} from '@/types/team';
import ApiClientClient from "@/lib/apiClientClient";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const path = pathname.split('/').filter((crumb) => crumb);

  const [breadcrumbItems, setBreadcrumbItems] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const items: React.ReactElement[] = [];
      let organisationId = '';
      let eventId = '';
      let editionId = '';
      let routeId = '';
      let teamId = '';

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
                isNumberCrumb = await getOrganisation(crumb);
                break;
              case 'events':
                eventId = crumb;
                isNumberCrumb = await getEvent(organisationId, crumb);
                break;
              case 'editions':
                editionId = crumb;
                isNumberCrumb = await getEdition(eventId, crumb);
                break;
              case 'routes':
                routeId = crumb;
                isNumberCrumb = await getRoute(editionId, crumb);
                break;
              case 'teams':
                teamId = crumb;
                isNumberCrumb = await getTeam(editionId, crumb);
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
        <BreadcrumbLink href="/" className="text-white">Home</BreadcrumbLink>
      </BreadcrumbItem>
      {path.length > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
      {breadcrumbItems}
    </BreadcrumbList>
  );
};

export default DynamicBreadcrumb;

async function getOrganisation(organisationId: string): Promise<Organisation> {
  const response = await ApiClientClient.get(`/organisations/${organisationId}`);
  if (response.status.toString().startsWith('4')) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.data;
}

async function getEvent(organisationId: string, eventId: string): Promise<Event> {
  const response = await ApiClientClient.get(`/organisations/${organisationId}/events/${eventId}`);
  if (response.status.toString().startsWith('4')) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.data;
}

async function getEdition(eventId: string, editionId: string): Promise<Edition> {
  const response = await ApiClientClient.get(`/events/${eventId}/editions/${editionId}`);

  if (response.status.toString().startsWith('4')) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.data;
}

async function getRoute(editionId: string, routeId: string): Promise<Route> {
  const response = await ApiClientClient.get(`/editions/${editionId}/routes/${routeId}`);
  if (response.status.toString().startsWith('4')){
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.data;
}

async function getTeam(editionId: string, routeId: string): Promise<Team> {
  const response = await ApiClientClient.get(`/editions/${editionId}/teams/${routeId}`);

  if (response.status.toString().startsWith('4')) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.data;
}
