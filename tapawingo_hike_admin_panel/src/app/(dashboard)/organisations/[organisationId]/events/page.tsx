import { Organisation } from '@/types/organisation';
import { Event } from '@/types/event';
import EventsClient from './eventsClient';
import Layout from '@/components/pageLayout';
import apiServerClient from '@/lib/apiClientServer';
import {OrganisationUser} from "@/types/organisationUser";

async function getOrganisation(organisationId: number): Promise<Organisation> {
  const response = await apiServerClient.get(`/organisations/${organisationId}`);
  return response.data;
}

async function getEventsOnOrganisation(organisationId: number): Promise<Event[]> {
  const response = await apiServerClient.get(`/organisations/${organisationId}/events`);
  return response.data;
}

async function getUsersOnOrganisation(organisationId: number): Promise<OrganisationUser[]> {
  const response = await apiServerClient.get(`/organisations/${organisationId}/users`);
  return response.data;
}

export default async function EventsPage({ params }: { params: { organisationId: number } }) {
  const organisationData = await getOrganisation(params.organisationId);
  const eventData = await getEventsOnOrganisation(params.organisationId);
  const userOrganisationData = await getUsersOnOrganisation(params.organisationId);

  return (<Layout>
    <EventsClient initialData={{organisationData, userOrganisationData, eventData}} />
  </Layout>);
}
