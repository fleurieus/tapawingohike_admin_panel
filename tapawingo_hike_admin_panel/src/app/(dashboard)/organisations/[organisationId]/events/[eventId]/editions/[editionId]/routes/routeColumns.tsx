import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateRouteDialog';
import { Edition } from "@/types/edition";
import { Route } from "@/types/route";
import {API_BASE_URL} from '@/lib/utils';
import apiClientClient from "@/lib/apiClientClient";
import { useRouter } from 'next/navigation';

export type ColumnsProps = {
  organisationId: string
  eventId: string
  editionData: Edition
  routeData: Route[];
  onChange: (id: number | undefined) => void;
};

export const useRouteColumns = ({organisationId, eventId, editionData, onChange}: ColumnsProps) => {
  const router = useRouter();

  const handleUpdate = async (edition: Edition, route: Route) => {
    await apiClientClient.patch(`/editions/${edition.id}/routes/${route.id}`, route);
    onChange(edition.id);
  };

  const handleDelete = async (editionId: number | undefined, routeId: number | undefined) => {
    await apiClientClient.delete(`/editions/${editionId}/routes/${routeId}`)
    onChange(editionId);
  };

  const handleCellClick = (organisationId: string, eventId: string, editionId: number | undefined, routeId: number | undefined) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions/${editionId}/routes/${routeId}/routeparts`);
  };

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCellClick(organisationId, eventId, editionData.id, row.original.id)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {
        const route = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={route}
                  onSave={(route) => handleUpdate(editionData, route)}
              />
              <button
                  onClick={() => handleDelete(editionData.id, route.id)}
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
