import {DataTable} from "@/components/ui/data-table";
import {columns, Organisation} from "@/app/(dashboard)/organisations/columns";
import {API_BASE_URL} from "@/lib/utils";
import {EditOrCreateDialog} from "@/app/(dashboard)/organisations/EditOrCreateDialog";

async function getData(): Promise<Organisation[]> {
  const response = await fetch(`${API_BASE_URL}/organisations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export default async function Organisations() {
  const data = await getData();
  return (
      <main className="flex min-h-screen items-start justify-center bg-gray-100">
        <div className="flex flex-col items-end space-y-4 p-4">
          <EditOrCreateDialog value={undefined}></EditOrCreateDialog>
          <DataTable columns={columns} data={data}/>
        </div>
      </main>

  )
}
