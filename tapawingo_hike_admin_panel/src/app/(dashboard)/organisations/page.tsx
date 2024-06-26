import {Organisation} from "@/types/organisation";
import apiClient from "@/lib/apiClient";
import OrganisationsClient from "@/app/(dashboard)/organisations/organisationsClient";
import React from "react";

async function getOrganisations(): Promise<Organisation[]> {
  const response = await apiClient.get('/organisations');
  return response.data;
}

export default async function OrganisationsPage() {
  const data = await getOrganisations();

  return (
        <OrganisationsClient initialData={data}/>
  );
}
