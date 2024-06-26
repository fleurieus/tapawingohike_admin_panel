import { Event } from '@/types/event';
import EditionsClient from './editionClient';
import Layout from '@/components/pageLayout';
import { Edition } from '@/types/edition';
import apiClient from '@/lib/apiClient';
import {EventUser} from "@/types/eventUser";

async function getEvent(organisationId: string, eventId: string): Promise<Event> {
  const response = await apiClient.get(`/organisations/${organisationId}/events/${eventId}`);
  return response.data;
}

async function getEditions(eventId: string): Promise<Edition[]> {
  const response = await apiClient.get(`/events/${eventId}/editions`);
  return response.data;
}

async function getUsersOnEvent(eventId: number): Promise<EventUser[]> {
  const response = await apiClient.get(`/events/${eventId}/users`);
  return response.data;
}

export default async function EventsPage({ params }: { params: { organisationId: string, eventId: string } }) {
  const eventData = await getEvent(params.organisationId, params.eventId);
  const editionData = await getEditions(params.eventId);
  const userEventData = await getUsersOnEvent(parseInt(params.eventId));
  // you can not put the params directly into the initialData of the client so define the id here
  const organisationId = params.organisationId;

  return (<Layout>
    <EditionsClient initialData={{organisationId, eventData, editionData, userEventData}} />
  </Layout>);
}
