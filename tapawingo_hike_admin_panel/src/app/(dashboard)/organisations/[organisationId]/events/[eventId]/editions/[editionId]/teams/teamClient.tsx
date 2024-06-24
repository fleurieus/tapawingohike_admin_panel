"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateTeamDialog';
import { DataTable } from '@/components/ui/data-table';
import { Event } from '@/types/event';
import { Edition } from '@/types/edition';
import { API_BASE_URL } from '@/lib/utils';
import { useTeamColumns } from './teamColumns';
import { Team } from '@/types/team';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type TeamsClientProps = {
  initialData: {
    organisationId: string;
    eventId: string;
    editionData: Edition; 
    teamData: Team[];
  };
};

const TeamsClient = ({ initialData }: TeamsClientProps) => {
  const [editionData, setEditionData] = useState<Edition>(initialData.editionData);
  const [teamData, setTeamData] = useState<Team[]>(initialData.teamData);
  const router = useRouter();

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = await fetch(`${API_BASE_URL}/editions/${id}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    const newData = await response.json();
    setTeamData(newData);
  }, []);

  const handleCreate = async (id: number | undefined, event: Event) => {
    await fetch(`${API_BASE_URL}/editions/${id}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    await refreshData(id);
  };

  const { columns } = useTeamColumns({
    teamData: teamData,
    editionData: editionData,
    onChange: refreshData,
  });

  const onTabClick = (organisationId: string, eventId: string, editionId: number | undefined) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions/${editionId}/routes`);
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-100">
      <div className="flex flex-col items-end space-y-4 p-4">
        <div className="flex justify-between w-full">
          <Tabs defaultValue="teams" className="w-full max-w-[400px]">
            <TabsList>
              <TabsTrigger value="routes" onClick={() => onTabClick(initialData.organisationId, initialData.eventId, editionData.id)}>Routes</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
          </Tabs>
          <EditOrCreateDialog onSave={(event) => handleCreate(editionData.id, event)} />
        </div>
        <DataTable columns={columns} data={teamData} />
      </div>
    </main>
  );
};

export default TeamsClient;
