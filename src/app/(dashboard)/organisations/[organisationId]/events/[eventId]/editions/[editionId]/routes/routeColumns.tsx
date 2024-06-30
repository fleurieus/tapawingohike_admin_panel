import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateRouteDialog';
import {Edition} from "@/types/edition";
import {Route} from "@/types/route";
import apiClientClient from "@/lib/apiClientClient";
import {useRouter} from 'next/navigation';
import {FaCircle} from "react-icons/fa";
import Button from "@/components/ui/button";

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

  const setRouteActive = async (route: Route) => {
    await apiClientClient.patch(`/editions/${editionData.id}/routes/${route.id}/active`, {});
    onChange(editionData.id);
  };

  const handleCellClick = (organisationId: string, eventId: string, editionId: number | undefined, routeId: number | undefined) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions/${editionId}/routes/${routeId}/routeparts`);
  };

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({row}) => (
          <div
              className="cursor-pointer"
              onClick={() => handleCellClick(organisationId, eventId, editionData.id, row.original.id)}
          >
            {row.getValue('name')}
          </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({row}) => {
        const route = row.original;
        return (
            <div className="flex items-center space-x-2">
            <span>
              {route.active ? <FaCircle className="text-green-500" title="Active"/> :
                  <FaCircle className="text-red-500" title="Inactive"/>}
            </span>
            </div>
        );
      }
    },
    {
      id: "setActive",
      header: "Set Active",
      cell: ({row}) => {
        const route = row.original;
        return (
            <Button
                onClick={() => setRouteActive(route)}
                disabled={route.active}
                title="Set this route as active"
            >
              {route.active ? "Active" : "Set Active"}
            </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({row}) => {
        const route = row.original;
        return (
            <div className="flex space-x-2 justify-end">
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
