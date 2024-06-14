"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateDialog';
import { DataTable } from '@/components/ui/data-table';
import { Organisation } from '@/types/organisation';
import { API_BASE_URL } from '@/lib/utils';
import { useOrganisationColumns } from './columns';

type OrganisationsClientProps = {
  initialData: Organisation[];
};

const OrganisationsClient = ({ initialData }: OrganisationsClientProps) => {
  const [data, setData] = useState<Organisation[]>(initialData);

  const refreshData = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/organisations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    const newData = await response.json();
    setData(newData);
  }, []);

  const handleCreate = async (organisation: Organisation) => {
    await fetch(`${API_BASE_URL}/organisations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organisation),
    });
    await refreshData();
  };

  const { columns } = useOrganisationColumns({
    data,
    onChange: refreshData,
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={handleCreate}/>
          <DataTable columns={columns} data={data} />
        </div>
      </main>
  );
};

export default OrganisationsClient;
