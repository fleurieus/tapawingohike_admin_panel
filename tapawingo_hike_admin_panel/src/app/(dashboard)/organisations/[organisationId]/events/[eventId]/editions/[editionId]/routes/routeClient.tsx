"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateRouteDialog';
import { DataTable } from '@/components/ui/data-table';
import { Event } from '@/types/event';
import { Edition } from '@/types/edition';
import { API_BASE_URL } from '@/lib/utils';
import { useRouteColumns } from './routeColumns';
import { Route } from '@/types/route';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type RoutesClientProps = {
  initialData: {
    organisationId: string;
    eventId: string;
    editionData: Edition; 
    routeData: Route[];
  };
};

const RoutesClient = ({ initialData }: RoutesClientProps) => {
  const [editionData, setEditionData] = useState<Edition>(initialData.editionData);
  const [routeData, setRouteData] = useState<Route[]>(initialData.routeData);
  const router = useRouter();

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = await fetch(`${API_BASE_URL}/editions/${id}/routes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    const newData = await response.json();
    setRouteData(newData);
  }, []);

  const handleCreate = async (id: number | undefined, event: Event) => {
    await fetch(`${API_BASE_URL}/editions/${id}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    await refreshData(id);
  };

  const { columns } = useRouteColumns({
    organisationId: initialData.organisationId,
    eventId: initialData.eventId,
    routeData: routeData,
    editionData: editionData,
    onChange: refreshData,
  });

  const onTabClick = (organisationId: string, eventId: string, editionId: number | undefined) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions/${editionId}/teams`);
  };

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <div className='flex justify-between w-full'>
            <Tabs defaultValue="routes">
            <TabsList>
              <TabsTrigger value="routes" >Routes</TabsTrigger>
              <TabsTrigger value="teams" onClick={() => onTabClick(initialData.organisationId, initialData.eventId, editionData.id)}>Teams</TabsTrigger>
            </TabsList>
            </Tabs>
            <EditOrCreateDialog onSave={(route) => handleCreate(editionData.id, route)} />
          </div>
          <DataTable columns={columns} data={routeData} />
        </div>
      </main>
  );
};

export default RoutesClient;
