import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateDialog';
import {Organisation} from '@/types/organisation';
import {API_BASE_URL} from '@/lib/utils';

export type ColumnsProps = {
  data: Organisation[];
  onChange: () => void;
};

export const useOrganisationColumns = ({onChange}: ColumnsProps) => {
  const handleUpdate = async (organisation: Organisation) => {
    await fetch(`${API_BASE_URL}/organisations/${organisation.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organisation),
    });
    onChange();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/organisations/${id}`, {
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
