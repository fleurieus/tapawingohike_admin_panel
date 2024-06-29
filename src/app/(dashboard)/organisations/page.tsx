import { Organisation } from "@/types/organisation";
import apiServerClient from "@/lib/apiClientServer";
import OrganisationsClient from "@/app/(dashboard)/organisations/organisationsClient";
import Layout from '@/components/pageLayout';

async function getOrganisations(): Promise<Organisation[]> {
  try {
    const response = await apiServerClient.get('/organisations');
    return response.data;
  } catch (error) {
    console.error('Error during axios request:', error.response || error.message || error);
    throw error;
  }
}

export default async function OrganisationsPage() {
  const data = await getOrganisations();

  return (<Layout>
    <OrganisationsClient initialData={data} />
  </Layout>);
}
