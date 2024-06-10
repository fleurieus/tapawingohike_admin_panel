import {DataTable} from "@/components/data-table";
import {columns, Organisation} from "@/app/(dashboard)/organisations/columns";
import {API_BASE_URL} from "@/lib/utils";

  async function getData(): Promise<Organisation[]> {
  const response = await fetch(`${API_BASE_URL}/organisations`, {
    headers: {
      'Cache-Control': 'no-cache'
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
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div>
          <DataTable columns={columns} data={data}/>
        </div>
      </main>
  )
}
