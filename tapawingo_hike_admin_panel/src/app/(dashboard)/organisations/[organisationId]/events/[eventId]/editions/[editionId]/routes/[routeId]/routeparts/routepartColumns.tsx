import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateRoutepartDialog';
import { Route } from "@/types/route";
import {API_BASE_URL} from '@/lib/utils';
import { Routepart } from "@/types/routepart";
import apiClient from "@/lib/apiClientClient";
import Cookies from 'js-cookie';

export type ColumnsProps = {
  routeData: Route
  routepartData: Routepart[];
  onChange: (id: number | undefined) => void;
};

export const useRoutepartColumns = ({routeData: routeData, onChange}: ColumnsProps) => {

  const handleUpdate = async (route: Route, routepartData: FormData) => {
    const token = Cookies.get('jwtToken');
    await fetch(`${API_BASE_URL}/routes/${route.id}/routeparts/${routeData.id}`, { //TODO: check if this is correct
      method: 'PUT',
      headers: {
        'Authorization' : `Bearer ${token}`,
      },
      body: routepartData,
    });
    onChange(route.id);
  };

  const handleDelete = async (routeId: number | undefined, routepartId: number | undefined) => {
    await apiClient.delete(`/routes/${routeId}/routeparts/${routepartId}`)
    onChange(routeId);
  };

  const columns: ColumnDef<Routepart>[] = [
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "routeType",
      header: "Type",
    },
    {
      accessorKey: "routepartZoom",
      header: "Zoom",
    },
    {
      accessorKey: "routepartFullscreen",
      header: "Fullscreen",
    },
    {
      accessorKey: "final",
      header: "Final destination",
    },
    {
      id: "actions",
      cell: ({row}) => {
        const routepart = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={routepart}
                  onSave={(routepart) => handleUpdate(routeData, routepart)}
              />
              <button
                  onClick={() => handleDelete(routeData.id, routepart.id)}
                  className="text-red-500"
              >
                <FaTrash/>
              </button>
            </div>
        );
      },
    },
  ];

  return {columns};
};
