"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateEditionDialog';
import { DataTable } from '@/components/ui/data-table';
import { Event } from '@/types/event';
import { Edition } from '@/types/edition';
import { API_BASE_URL } from '@/lib/utils';
import { useEditionColumns } from './editionColumns';

type EditionsClientProps = {
  initialData: {
    organisationId: string;
    eventData: Event; 
    editionData: Edition[];
  };
};

const EditionsClient = ({ initialData }: EditionsClientProps) => {
  const [eventData, setEventData] = useState<Event>(initialData.eventData);
  const [editionData, setEditionData] = useState<Edition[]>(initialData.editionData);

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/editions`, {
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
    await fetch(`${API_BASE_URL}/events/${id}/editions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    await refreshData(id);
  };

  const { columns } = useEditionColumns({
    organisationId: initialData.organisationId,
    editionData: editionData,
    eventData: eventData,
    onChange: refreshData,
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={(event) => handleCreate(eventData.id, event)} />
          <DataTable columns={columns} data={editionData} />
        </div>
      </main>
  );
};

export default EditionsClient;
