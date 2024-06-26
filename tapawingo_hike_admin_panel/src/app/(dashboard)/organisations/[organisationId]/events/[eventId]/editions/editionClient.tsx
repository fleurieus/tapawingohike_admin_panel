"use client";

import { useState, useCallback } from 'react';
import { EditOrCreateDialog } from './editOrCreateEditionDialog';
import { DataTable } from '@/components/ui/data-table';
import { Event } from '@/types/event';
import { Edition } from '@/types/edition';
import { API_BASE_URL } from '@/lib/utils';
import { useEditionColumns } from './editionColumns';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  EditOrCreateUserOrganisationDialog
} from "@/app/(dashboard)/organisations/[organisationId]/events/editOrCreateUserOrganisationDialog";
import {
  EditOrCreateUserEventDialog
} from "@/app/(dashboard)/organisations/[organisationId]/events/[eventId]/editions/editOrCreateUserEventDialog";
import {
  useUserEventsColumns
} from "@/app/(dashboard)/organisations/[organisationId]/events/[eventId]/editions/userEventsColumns";
import {EventUser} from "@/types/eventUser";
import apiClient from "@/lib/apiClient";

type EditionsClientProps = {
  initialData: {
    organisationId: string;
    eventData: Event; 
    editionData: Edition[];
    userEventData: EventUser[];
  };
};

const EditionsClient = ({ initialData }: EditionsClientProps) => {
  const [eventData, setEventData] = useState<Event>(initialData.eventData);
  const [editionData, setEditionData] = useState<Edition[]>(initialData.editionData);
const [userEventData, setUserEventData] = useState<EventUser[]>(initialData.userEventData);

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

  const refreshUserEventData = useCallback(async (id:number | undefined) => {
    const response = await apiClient.get(`/events/${id}/users`);
    setUserEventData(response.data);
  }, []);

  const handleCreateUserEvent = async (id: number | undefined, user: EventUser) => {
    try {
      await apiClient.post(`/events/${id}/users`, user);
      await refreshUserEventData(id);
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.response.data.message);
    }
  }

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

  const {userEventColumns} = useUserEventsColumns(
    {
      eventData,
      data: userEventData,
      onChange: refreshUserEventData,
    }
  )

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <Tabs defaultValue = "eventData">
          <TabsList className="flex">
            <TabsTrigger value="eventData">Editions</TabsTrigger>
            <TabsTrigger value="userData">Users</TabsTrigger>
          </TabsList>
          <TabsContent value={"eventData"}>
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={(event) => handleCreate(eventData.id, event)} />
          <DataTable columns={columns} data={editionData} />
        </div>
          </TabsContent>
          <TabsContent value={"userData"}>
            <div className="flex flex-col items-end space-y-4 p-4">
              <EditOrCreateUserEventDialog
                  onSave={(user) => handleCreateUserEvent(eventData.id, user)}/>
              <DataTable columns={userEventColumns} data={userEventData}/>
            </div>
          </TabsContent>

        </Tabs>
      </main>
  );
};

export default EditionsClient;
