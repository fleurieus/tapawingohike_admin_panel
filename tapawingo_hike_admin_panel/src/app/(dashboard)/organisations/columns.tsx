"use client"
import {ColumnDef} from "@tanstack/react-table"
import {FaTrash} from "react-icons/fa6";
import {EditOrCreateDialog} from "@/app/(dashboard)/organisations/EditOrCreateDialog";

export type Organisation = {
  "id": number,
  "name": string,
  "contactPerson": string,
  "contactEmail": string,
}

export const columns: ColumnDef<Organisation>[] = [
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
      const organisation = row.original
      return (
        <div className="flex space-x-2">
          <EditOrCreateDialog
            value={organisation}>
          </EditOrCreateDialog>
          <button
            onClick={() => {
              console.log("Delete", organisation)
            }}
            className="text-red-500"
          >
            <FaTrash/>
          </button>
        </div>
      )
    }
  }
]
