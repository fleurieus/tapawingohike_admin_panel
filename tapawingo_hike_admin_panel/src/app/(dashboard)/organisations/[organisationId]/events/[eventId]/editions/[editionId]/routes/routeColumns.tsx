import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateRouteDialog';
import { Edition } from "@/types/edition";
import { Route } from "@/types/route";
import {API_BASE_URL} from '@/lib/utils';

export type ColumnsProps = {
  editionData: Edition
  routeData: Route[];
  onChange: (id: number | undefined) => void;
};

export const useRouteColumns = ({editionData, onChange}: ColumnsProps) => {

  const handleUpdate = async (edition: Edition, route: Route) => {

    await fetch(`${API_BASE_URL}/editions/${edition.id}/routes/${route.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(route),
    });
    onChange(edition.id);
  };

  const handleDelete = async (editionId: number | undefined, routeId: number | undefined) => {
    await fetch(`${API_BASE_URL}/editions/${editionId}/routes/${routeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    onChange(editionId);
  };

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      cell: ({row}) => {
        const route = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={route}
                  onSave={(event) => handleUpdate(editionData, route)}
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
