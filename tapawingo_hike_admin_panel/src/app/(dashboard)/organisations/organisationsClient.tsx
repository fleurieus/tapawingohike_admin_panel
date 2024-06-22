"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateDialog';
import { DataTable } from '@/components/ui/data-table';
import { Organisation } from '@/types/organisation';
import { useOrganisationColumns } from './columns';
import apiClient from "@/lib/apiClient";
import { API_BASE_URL } from '@/lib/utils';

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
    try{
      await fetch(`http://localhost:5175/organisations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organisation),
      });
      await refreshData();
    } catch (err){
      console.error('Error creating organisation:', err);
    }
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
