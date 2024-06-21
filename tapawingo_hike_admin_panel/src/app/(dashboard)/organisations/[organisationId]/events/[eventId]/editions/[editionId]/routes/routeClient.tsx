"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateRouteDialog';
import { DataTable } from '@/components/ui/data-table';
import { Event } from '@/types/event';
import { Edition } from '@/types/edition';
import { API_BASE_URL } from '@/lib/utils';
import { useRouteColumns } from './routeColumns';
import { Route } from '@/types/route';

type EventsClientProps = {
  initialData: {
    editionData: Edition; 
    routeData: Route[];
  };
};

const EditionsClient = ({ initialData }: EventsClientProps) => {
  const [editionData, setEventData] = useState<Edition>(initialData.editionData);
  const [routeData, setEditionData] = useState<Route[]>(initialData.routeData);

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = await fetch(`${API_BASE_URL}/editions/${id}/routes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    const newData = await response.json();
    setEditionData(newData);
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
    routeData: routeData,
    editionData: editionData,
    onChange: refreshData,
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={(event) => handleCreate(editionData.id, event)} />
          <DataTable columns={columns} data={routeData} />
        </div>
      </main>
  );
};

export default EditionsClient;
