import {OrganisationUser} from "@/types/organisationUser";
import {Event} from "@/types/event";
import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import apiClient from "@/lib/apiClientServer";
import {
  EditOrCreateUserEventDialog
} from "@/app/(dashboard)/organisations/[organisationId]/events/[eventId]/editions/editOrCreateUserEventDialog";
import {EventUser} from "@/types/eventUser";
import apiClientClient from "@/lib/apiClientClient";

export type ColumnsProps = {
  eventData: Event;
  data: EventUser[];
  onChange: (id: number | undefined) => void;
};

export const useUserEventsColumns = ({eventData, onChange}: ColumnsProps) => {

  const handleDelete = async (id: number) => {
    await apiClientClient.delete(`events/${eventData.id}/users/${id}`);
    onChange(eventData.id);
  }

  const handleUpdate = async (event: Event, user: EventUser) => {
    await apiClientClient.patch(`/events/${event.id}/users/${user.id}`, user);
    onChange(event.id);
  }

  const userEventColumns: ColumnDef<EventUser>[] = [
    {
      accessorKey: "firstName",
      header: "First name",
      cell: ({ row }) => (
          <div className="capitalize">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last name",
      cell: ({ row }) => (
          <div className="capitalize">{row.getValue("lastName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
          <div className="capitalize">{row.getValue("email")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {
        const user = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateUserEventDialog
                  value={user}
                  onSave={(user) => handleUpdate(eventData, user)} />
              <button
                  onClick= {() => handleDelete(user.id!)}
                  className="text-red-500"
              >
                <FaTrash/>
              </button>
            </div>
        );
      },
    },
  ];
  return {userEventColumns};
};


