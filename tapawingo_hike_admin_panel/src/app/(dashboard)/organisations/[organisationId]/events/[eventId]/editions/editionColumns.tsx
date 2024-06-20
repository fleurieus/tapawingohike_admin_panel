import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateEditionsDialog';
import { Event } from '@/types/event';
import { Edition } from "@/types/edition";
import {API_BASE_URL} from '@/lib/utils';

export type ColumnsProps = {
  eventData: Event
  editionData: Edition[];
  onChange: (id: number | undefined) => void;
};

export const useEditionColumns = ({eventData, onChange}: ColumnsProps) => {

  const handleUpdate = async (event: Event, edition: Edition) => {

    await fetch(`${API_BASE_URL}/events/${event.id}/editions/${edition.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edition),
    });
    onChange(event.id);
  };

  const handleDelete = async (eventId: number | undefined, editionId: number | undefined) => {
    await fetch(`${API_BASE_URL}/events/${eventId}/editions/${editionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    onChange(eventId);
  };

  const columns: ColumnDef<Edition>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startDate",
      header: "Start date",
    },
    {
      accessorKey: "endDate",
      header: "End date",
    },
    {
      id: "actions",
      cell: ({row}) => {
        const edition = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={edition}
                  onSave={(event) => handleUpdate(eventData, event)}
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
