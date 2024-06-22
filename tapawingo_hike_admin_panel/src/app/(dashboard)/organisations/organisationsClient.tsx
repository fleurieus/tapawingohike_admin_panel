"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateDialog';
import { DataTable } from '@/components/ui/data-table';
import { Organisation } from '@/types/organisation';
import { useOrganisationColumns } from './columns';
import apiClient from "@/lib/apiClient";

type OrganisationsClientProps = {
  initialData: Organisation[];
};

const OrganisationsClient = ({ initialData }: OrganisationsClientProps) => {
  const [data, setData] = useState<Organisation[]>(initialData);

  const refreshData = useCallback(async () => {
    try {
      const response = await apiClient.get('/organisations');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  }, []);

  const handleCreate = async (organisation: Organisation) => {
    try {
      await apiClient.post('/organisations', organisation);
      await refreshData();
    } catch (error) {
      console.error('Error creating organisation:', error);
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
