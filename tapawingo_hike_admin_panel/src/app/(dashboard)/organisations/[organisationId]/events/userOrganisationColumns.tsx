import {OrganisationUser} from "@/types/organisationUser";
import {ColumnDef} from "@tanstack/react-table";
import {Organisation} from "@/types/organisation";
import {
  EditOrCreateUserOrganisationDialog
} from "@/app/(dashboard)/organisations/[organisationId]/events/editOrCreateUserOrganisationDialog";
import {FaTrash} from "react-icons/fa6";
import apiClient from "@/lib/apiClient";

export type ColumnsProps = {
  organisationData: Organisation;
  data: OrganisationUser[];
  onChange: (id: number | undefined) => void;
};

export const useUserOrganisationColumns = ({organisationData, onChange}: ColumnsProps) => {

  const handleDelete = async (id: number) => {
    await apiClient.delete(`/organisations/${organisationData.id}/users/${id}`);
    onChange(organisationData.id);
  }

  const handleUpdate = async (organisation: Organisation, user: OrganisationUser) => {
    await apiClient.patch(`/organisations/${organisation.id}/users/${user.id}`, user);
    onChange(organisation.id);
  }

  const userOrganisationColumns: ColumnDef<OrganisationUser>[] = [
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
      accessorKey: "isManager",
      header: "Manager",
      cell: ({ row }) => (
          <div className="flex items-center">
            <input
                type="checkbox"
                checked={row.getValue('isManager')}
                disabled
                className="cursor-default"
                aria-label="Manager status"
            />
          </div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {
        const user = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateUserOrganisationDialog
                  value={user}
                  onSave={(user) => handleUpdate(organisationData, user)} />
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
  return {userOrganisationColumns};
};


