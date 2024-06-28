"use client";

import { useState, useCallback, useEffect } from 'react';
import { EditOrCreateDialog } from './editOrCreateRoutepartDialog';
import { DataTable } from '@/components/ui/data-table';
import { API_BASE_URL } from '@/lib/utils';
import { useRoutepartColumns } from './routepartColumns';
import { Route } from '@/types/route';
import { Routepart } from '@/types/routepart';
import MapComponent from '@/components/ui/map';
import apiClientClient from "@/lib/apiClientClient";
import Cookies from 'js-cookie';

type RoutepartClientProps = {
  initialData: {
    organisationId: string;
    eventId: string;
    editionId: string;
    routeData: Route; 
    routepartData: Routepart[];
  };
};

const RoutepartClient = ({ initialData }: RoutepartClientProps) => {
  const [routeData, setRoutetData] = useState<Route>(initialData.routeData);
  const [routepartData, setRoutepartData] = useState<Routepart[]>(initialData.routepartData);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      console.log(navigator.geolocation);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  const refreshData = useCallback(async (id:number | undefined) => {
    const response = apiClientClient.get(`${API_BASE_URL}/routes/${id}/routeparts`);
    const newData = await response;
    setRoutepartData(newData.data);
  }, []);

  const handleCreate = async (id: number | undefined, routepartData: FormData) => {
    const token = Cookies.get('jwtToken');
    await fetch(`${API_BASE_URL}/routes/${id}/routeparts`, {
      method: 'POST',
      headers: {
        'Authorization' : `Bearer ${token}`,
      },
      body: routepartData,
    });
    await refreshData(id);
  };

  const { columns } = useRoutepartColumns({
    routepartData: routepartData,
    routeData: routeData,
    onChange: refreshData,
  });

  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog onSave={(route) => handleCreate(routeData.id, route)} />
          <DataTable columns={columns} data={routepartData} />
          {/* <MapComponent /> */}
        </div>
      </main>
  );
};

export default RoutepartClient;
