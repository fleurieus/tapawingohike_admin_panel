"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateEventDialog';
import { DataTable } from '@/components/ui/data-table';
import { Organisation } from '@/types/organisation';
import { Event } from '@/types/event';
import { API_BASE_URL } from '@/lib/utils';
import { useEventColumns } from './eventColumns';

type EventsClientProps = {
  initialData: {
    organisationData: Organisation; // Adjust if organisationData is an array or different type
    eventData: Event[];
  };
};

const EventsClient = ({ initialData }: EventsClientProps) => {
  const [organisationData, setOrganisationData] = useState<Organisation>(initialData.organisationData);
  const [eventData, setEventData] = useState<Event[]>(initialData.eventData);

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = await fetch(`${API_BASE_URL}/organisations/${id}/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    const newData = await response.json();
    setEventData(newData);
  }, []);

  const handleCreate = async (id: number | undefined, event: Event) => {
    await fetch(`${API_BASE_URL}/organisations/${id}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    await refreshData(id);
  };

  const { columns } = useEventColumns({
    eventData,
    organisationData,
    onChange: refreshData,
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={(event) => handleCreate(organisationData.id, event)} />
          <DataTable columns={columns} data={eventData} />
        </div>
      </main>
  );
};

export default EventsClient;
