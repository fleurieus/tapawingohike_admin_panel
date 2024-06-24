"use client";

import {useState, useCallback} from 'react';
import {EditOrCreateDialog} from './editOrCreateEventDialog';
import {DataTable} from '@/components/ui/data-table';
import {Organisation} from '@/types/organisation';
import {Event} from '@/types/event';
import {API_BASE_URL} from '@/lib/utils';
import {useEventColumns} from './eventColumns';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  useUserOrganisationColumns
} from "@/app/(dashboard)/organisations/[organisationId]/events/userOrganisationColumns";
import {User} from "@/types/user";
import apiClient from "@/lib/apiClient";
import {
  EditOrCreateUserOrganisationDialog
} from "@/app/(dashboard)/organisations/[organisationId]/events/editOrCreateUserOrganisationDialog";

type EventsClientProps = {
  initialData: {
    organisationData: Organisation; // Adjust if organisationData is an array or different type
    eventData: Event[];
    userOrganisationData: User[];
  };
};
const EventsClient = ({initialData}: EventsClientProps) => {
  const [organisationData, setOrganisationData] = useState<Organisation>(initialData.organisationData);
  const [eventData, setEventData] = useState<Event[]>(initialData.eventData);
  const [userOrganisationData, setUserOrganisationData] = useState<User[]>(initialData.userOrganisationData);

  const refreshData = useCallback(async (id: number | undefined) => {
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

  const refreshUserOrganisationData = useCallback(async (id: number | undefined) => {
    const response = await apiClient.get(`/organisations/${id}/users`);
    setUserOrganisationData(response.data);
  }, []);

  const handleCreateUserOrganisation = async (id: number | undefined, user: User) => {
    try {
      await apiClient.post(`/organisations/${id}/users`, user);
      await refreshUserOrganisationData(id);
      return Promise.resolve();
    } catch (error: any) {
     return Promise.reject(error.response.data.message);
    }
  };
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

  const {columns} = useEventColumns({
    eventData,
    organisationData,
    onChange: refreshData,
  });

  const {userOrganisationColumns} = useUserOrganisationColumns({
    organisationData,
    data: userOrganisationData,
    onChange: refreshUserOrganisationData
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <Tabs defaultValue="eventData">
          <TabsList className="flex">
            <TabsTrigger value="eventData">Events</TabsTrigger>
            <TabsTrigger value="userData">Users</TabsTrigger>
          </TabsList>
          <TabsContent value={"eventData"}>
            <div className="flex flex-col items-end space-y-4 p-4">
              <EditOrCreateDialog onSave={(event) => handleCreate(organisationData.id, event)}/>
              <DataTable columns={columns} data={eventData}/>
            </div>
          </TabsContent>
          <TabsContent value={"userData"}>
            <div className="flex flex-col items-end space-y-4 p-4">
              <EditOrCreateUserOrganisationDialog
                  onSave={(user) => handleCreateUserOrganisation(organisationData.id, user)}/>
              <DataTable columns={userOrganisationColumns} data={userOrganisationData}/>
            </div>
          </TabsContent>
        </Tabs>
      </main>
  );
};

export default EventsClient;
