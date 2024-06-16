import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateEventDialog';
import {Organisation, Event} from '@/types/*';
import {API_BASE_URL} from '@/lib/utils';

export type ColumnsProps = {
  data: Event[];
  onChange: () => void;
};

export const useEventColumns = ({onChange}: ColumnsProps) => {
  const handleUpdate = async (organisation: Organisation, event: Event) => {
    await fetch(`${API_BASE_URL}/organisations/${organisation.id}/events/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organisation),
    });
    onChange();
  };

  const handleDelete = async (orgId: number, eventId: number) => {
    await fetch(`${API_BASE_URL}/organisations/${orgId}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    onChange();
  };

  const columns: ColumnDef<Organisation>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Event",
    },
    {
      id: "actions",
      cell: ({row}) => {
        const event = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={event}
                  onSave={handleUpdate}
              />
              <button
                  onClick={() => handleDelete(event.id!!)}
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
