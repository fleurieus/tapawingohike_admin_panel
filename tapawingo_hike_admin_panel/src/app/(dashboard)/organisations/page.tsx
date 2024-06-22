import { Organisation } from "@/types/organisation";
import apiClient from "@/lib/apiClient";
import OrganisationsClient from "@/app/(dashboard)/organisations/organisationsClient";
import Layout from '@/components/pageLayout';

async function getOrganisations(): Promise<Organisation[]> {
  const response = await apiClient.get('/organisations');
  return response.data;
}

export default async function OrganisationsPage() {
  const data = await getOrganisations();

  return (<Layout>
    <OrganisationsClient initialData={data} />
  </Layout>);
}
