import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateDialog';
import {Organisation} from '@/types/organisation';
import apiClient from "@/lib/apiClient";

export type ColumnsProps = {
  data: Organisation[];
  onChange: () => void;
};

export const useOrganisationColumns = ({onChange}: ColumnsProps) => {
  const handleUpdate = async (organisation: Organisation) => {
    try {
      await apiClient.patch(`/organisations/${organisation.id}`, organisation);
      onChange();
    } catch (error) {
      console.error('Error updating organisation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/organisations/${id}`);
      onChange();
    } catch (error) {
      console.error('Error deleting organisation:', error);
    }
  };

  const columns: ColumnDef<Organisation>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Organisation",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "contactEmail",
      header: "Contact Email",
    },
    {
      id: "actions",
      cell: ({row}) => {
        const organisation = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={organisation}
                  onSave={handleUpdate}
              />
              <button
                  onClick={() => handleDelete(organisation.id!!)}
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
