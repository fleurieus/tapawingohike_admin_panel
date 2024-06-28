import React, { useState } from "react";
import Button from "@/components/ui/button";

type FileManagerProps = {
  files: File[];
  onDelete: (fileId: number) => void;
  onUpload: (file: File) => void;
};

const FileManager: React.FC<FileManagerProps> = ({ files, onDelete, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile({ id: Date.now(), name: file.name }); // Assign a temporary ID for the new file
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null); // Clear the selected file after upload
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <h3 className="text-lg font-medium">Files</h3>
      <ul className="list-disc list-inside">
        {files.map(file => (
          <li key={file.id} className="flex justify-between items-center">
            <span>{file.name}</span>
            <Button variant="destructive" onClick={() => onDelete(file.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!selectedFile} className="ml-2">
          Upload
        </Button>
      </div>
    </div>
  );
};

export default FileManager;
