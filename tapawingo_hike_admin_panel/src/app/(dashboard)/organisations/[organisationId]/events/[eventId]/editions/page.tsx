import { Event } from '@/types/event';
import { API_BASE_URL } from '@/lib/utils';
import EditionsClient from './editionClient';
import Layout from '@/components/pageLayout';
import { Edition } from '@/types/edition';

async function getEvent(organisationId: string, eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/organisations/${organisationId}/Events/${eventId}`, {
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

async function getEditions(eventId: string): Promise<Edition[]> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/editions`, {
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

export default async function EventsPage({ params }: { params: { organisationId: string, eventId: string } }) {
  const eventData = await getEvent(params.organisationId, params.eventId);
  const editionData = await getEditions(params.eventId);

  return (<Layout>
    <EditionsClient initialData={{eventData, editionData}} />
  </Layout>);
}
