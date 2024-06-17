import { Organisation, Event } from '@/types/*';
import { API_BASE_URL } from '@/lib/utils';
import EventsClient from './eventsClient';

async function getOrganisations(organisationId: number): Promise<Organisation> {
  const response = await fetch(`${API_BASE_URL}/organisations/${organisationId}`, {
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

async function getEvents(organisationId: number): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/organisations/${organisationId}/events`, {
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

export default async function EventsPage({ params }: { params: { organisationId: string } }) {
  const organisationData = await getOrganisations(params.organisationId);
  const eventData = await getEvents(params.organisationId);

  console.log("organisationData from getOrganisations: ", organisationData);
  console.log("eventData from getEvents: ", eventData);

  return <EventsClient initialData={{organisationData, eventData}}  />;
}
