import { API_BASE_URL } from '@/lib/utils';
import EditionsClient from './routeClient';
import Layout from '@/components/pageLayout';
import { Edition } from '@/types/edition';
import { Route } from '@/types/route';

async function getEdition(eventId: string, editionId: string): Promise<Edition> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/editions/${editionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function getRoutes(editionId: string): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/editions/${editionId}/routes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (response.status == 404) {
    return [];
  } else if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export default async function EventsPage({ params }: { params: { eventId: string, editionId: string } }) {
  const editionData = await getEdition(params.eventId, params.editionId);
  const routeData = await getRoutes(params.editionId);

  return (<Layout>
    <EditionsClient initialData={{editionData, routeData}} />
  </Layout>);
}
