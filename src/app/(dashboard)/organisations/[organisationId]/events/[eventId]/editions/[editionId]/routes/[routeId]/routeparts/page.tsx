import RoutepartClient from './routepartClient';
import Layout from '@/components/pageLayout';
import { Route } from '@/types/route';
import apiServerClient from '@/lib/apiClientServer';
import { Routepart } from '@/types/routepart';

async function getRoute(editionId: string, routeId: string): Promise<Route> {
  const response = await apiServerClient.get(`/editions/${editionId}/routes/${routeId}`);
  return response.data;
}

async function getRouteparts(routeId: string): Promise<Routepart[]> {
  const response = await apiServerClient.get(`/routes/${routeId}/routeparts`);
  return response.data;
}

export default async function EventsPage({ params }: { params: { organisationId: string, eventId: string, editionId: string, routeId: string } }) {
  const routeData = await getRoute(params.editionId, params.routeId);
  const routepartData = await getRouteparts(params.routeId);
  // you can not put the params directly into the initialData of the client so define the id here
  const organisationId = params.organisationId;
  const eventId = params.eventId
  const editionId = params.editionId

  return (<Layout>
    <RoutepartClient initialData={{organisationId, eventId, editionId, routeData, routepartData}} />
  </Layout>);
}
