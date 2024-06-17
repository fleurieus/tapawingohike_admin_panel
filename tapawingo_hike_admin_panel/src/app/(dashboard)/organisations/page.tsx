import { Organisation } from '@/types/organisation';
import { API_BASE_URL } from '@/lib/utils';
import OrganisationsClient from './organisationsClient';
import Layout from '@/components/pageLayout';

async function getOrganisations(): Promise<Organisation[]> {
  const response = await fetch(`${API_BASE_URL}/organisations`, {
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

const headerProps = {
    title: 'Home Page',
    subtitle: 'Welcome to the home page',
};

export default async function OrganisationsPage() {
  const data = await getOrganisations();

  return (<Layout headerProps={headerProps}>
    <OrganisationsClient initialData={data} />
  </Layout>);
}
