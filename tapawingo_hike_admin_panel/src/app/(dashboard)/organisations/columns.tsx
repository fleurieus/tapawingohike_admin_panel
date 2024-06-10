"use client"
import {ColumnDef} from "@tanstack/react-table"
import {FaEdit} from "react-icons/fa";
import {FaDeleteLeft, FaTrash} from "react-icons/fa6";

export type Organisation = {
  "id": number,
  "name": string,
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
    id: "actions",
    cell: ({row}) => {
      const organisation = row.original
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              console.log("Edit", organisation)
            }}
            className="text-blue-500"
          >
            <FaEdit/>
          </button>
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
