import {ColumnDef} from "@tanstack/react-table";
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from './editOrCreateTeamDialog';
import { Edition } from "@/types/edition";
import {API_BASE_URL} from '@/lib/utils';
import { Team } from "@/types/team";

export type ColumnsProps = {
  editionData: Edition
  teamData: Team[];
  onChange: (id: number | undefined) => void;
};

export const useTeamColumns = ({editionData, onChange}: ColumnsProps) => {

  const handleUpdate = async (edition: Edition, team: Team) => {

    await fetch(`${API_BASE_URL}/editions/${edition.id}/teams/${team.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(team),
    });
    onChange(edition.id);
  };

  const handleDelete = async (editionId: number | undefined, teamId: number | undefined) => {
    await fetch(`${API_BASE_URL}/editions/${editionId}/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    onChange(editionId);
  };

  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "contactName",
      header: "Contact Person",
    },
    {
      accessorKey: "contactEmail",
      header: "Contact Email",
    },
    {
      accessorKey: "contactPhone",
      header: "Contact Phone number",
    },
    {
      accessorKey: "online",
      header: "online status"
    },
    {
      id: "actions",
      cell: ({row}) => {
        const team = row.original;
        return (
            <div className="flex space-x-2">
              <EditOrCreateDialog
                  value={team}
                  onSave={(team) => handleUpdate(editionData, team)}
              />
              <button
                  onClick={() => handleDelete(editionData.id, team.id)}
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
