import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateEventDialog';
import { Organisation } from '@/types/organisation';
import { Event } from '@/types/event';
import {API_BASE_URL} from '@/lib/utils';
import { useRouter } from 'next/navigation';
import apiClientClient from "@/lib/apiClientClient";

export type ColumnsProps = {
  organisationData: Organisation
  eventData: Event[];
  onChange: (id: number | undefined) => void;
};

export const useEventColumns = ({organisationData, onChange}: ColumnsProps) => {
  const router = useRouter();

  const handleUpdate = async (organisation: Organisation, event: Event) => {
    await apiClientClient.put(`/organisations/${organisation.id}/events/${event.id}`, event);
    onChange(organisation.id);
  };

  const handleDelete = async (orgId: number | undefined, eventId: number | undefined) => {
    await apiClientClient.delete(`/organisations/${orgId}/events/${eventId}`);
    onChange(orgId);
  };

  const handleCellClick = (organisationId: number, eventId: number) => {
    router.push(`/organisations/${organisationId}/events/${eventId}/editions`);
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Event Name",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCellClick(organisationData.id, row.original.id)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {
        const event = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={event}
                  onSave={(event) => handleUpdate(organisationData, event)}
              />
              <button
                  onClick={() => handleDelete(organisationData.id, event.id)}
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
