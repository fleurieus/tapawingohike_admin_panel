import EditionsClient from './routeClient';
import Layout from '@/components/pageLayout';
import { Edition } from '@/types/edition';
import { Route } from '@/types/route';
import apiClient from '@/lib/apiClient';

async function getEdition(eventId: string, editionId: string): Promise<Edition> {
  const response = await apiClient.get(`/events/${eventId}/editions/${editionId}`);
  return response.data;
}

async function getRoutes(editionId: string): Promise<Route[]> {
  const response = await apiClient.get(`/editions/${editionId}/routes`);
  return response.data;
}

export default async function EventsPage({ params }: { params: { eventId: string, editionId: string } }) {
  const editionData = await getEdition(params.eventId, params.editionId);
  const routeData = await getRoutes(params.editionId);

  return (<Layout>
    <EditionsClient initialData={{editionData, routeData}} />
  </Layout>);
}
