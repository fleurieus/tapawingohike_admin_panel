import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateEditionDialog';
import {Event} from '@/types/event';
import {Edition} from "@/types/edition";
import {useRouter} from 'next/navigation';
import apiClientClient from "@/lib/apiClientClient";

export type ColumnsProps = {
  organisationId: string
  eventData: Event
  editionData: Edition[];
  onChange: (id: number | undefined) => void;
};

export const useEditionColumns = ({organisationId, eventData, onChange}: ColumnsProps) => {
  const router = useRouter();

  const handleUpdate = async (event: Event, edition: Edition) => {
    await apiClientClient.patch(`/events/${event.id}/editions/${edition.id}`, edition);
    onChange(event.id);
  };

  const handleDelete = async (eventId: number | undefined, editionId: number | undefined) => {
    await apiClientClient.delete(`/events/${eventId}/editions/${editionId}`);
    onChange(eventId);
  };

  const handleCellClick = (organisationId: string, eventId: number| undefined, editionId: number | undefined) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions/${editionId}/routes`);
  };

  const columns: ColumnDef<Edition>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCellClick(organisationId, eventData.id, row.original.id)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start date",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCellClick(organisationId, eventData.id, row.original.id)}
        >
          {row.getValue('startDate')}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End date",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCellClick(organisationId, eventData.id, row.original.id)}
        >
          {row.getValue('endDate')}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {
        const edition = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={edition}
                  onSave={(edition) => handleUpdate(eventData, edition)}
              />
              <button
                  onClick={() => handleDelete(eventData.id, edition.id)}
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
