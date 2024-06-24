import TeamsClient from './teamClient';
import Layout from '@/components/pageLayout';
import { Edition } from '@/types/edition';
import { Team } from '@/types/team';
import apiClient from '@/lib/apiClient';

async function getEdition(eventId: string, editionId: string): Promise<Edition> {
  const response = await apiClient.get(`/events/${eventId}/editions/${editionId}`);
  return response.data;
}

async function getTeams(editionId: string): Promise<Team[]> {
  const response = await apiClient.get(`/editions/${editionId}/teams`);
  return response.data;
}

export default async function EventsPage({ params }: { params: { organisationId: string, eventId: string, editionId: string } }) {
  const editionData = await getEdition(params.eventId, params.editionId);
  const teamData = await getTeams(params.editionId);
  // you can not put the params directly into the initialData of the client so define the id here
  const organisationId = params.organisationId;
  const eventId = params.eventId

  return (<Layout>
    <TeamsClient initialData={{organisationId, eventId, editionData, teamData}} />
  </Layout>);
}
