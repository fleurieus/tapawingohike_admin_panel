import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import "react-day-picker/dist/style.css";
import React, { useState, useEffect } from "react";
import { Routepart } from "@/types/routepart";
import { routeTypes } from "@/lib/utils";
import { Switch } from "@/components/ui/switch"
import FileManager from "./filemanager"; 

type EditOrCreateDialogProps = {
  value?: Routepart;
  onSave: (data: FormData, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [name, setName] = useState(value?.name || "");
  const [routeType, setRouteType] = useState(value?.routeType || routeTypes.coördinaat);
  const [routepartZoom, setRoutepartZoom] = useState(value?.routepartZoom || false);
  const [routepartFullscreen, setRoutepartFullscreen] = useState(value?.routepartFullscreen || false);
  const [destinations, setDestinations] = useState([]);
  const [files, setFiles] = useState<File[]>(value?.files || []);

  useEffect(() => {
    // Fetch files for the current routepart if in edit mode
    if (isEdit) {
      // Replace with actual API call to fetch files
      setFiles(value?.files || []);
    }
  }, [isEdit]);

  // const fetchFiles = async () => {
  //   // Dummy data for illustration
  //   const fetchedFiles = [
  //     { id: 1, name: "file1.txt" },
  //     { id: 2, name: "file2.jpg" }
  //   ];
  //   setFiles(fetchedFiles);
  // };

  const handleDeleteFile = (fileId: number) => {
    // Perform file deletion logic here
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
  };

  const handleUploadFile = (file: File) => {
    // Perform file upload logic here
    const updatedFiles = [...files, file];
    setFiles(updatedFiles);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Note: routeparts post and put take in formData
    let formData = new FormData();
    formData.append('name', name);
    formData.append('routeType', routeType);
    formData.append('routepartZoom', routepartZoom.toString());
    formData.append('routepartFullscreen', routepartFullscreen.toString());

    // Add these back when their tabs work
    // formData.append('destinations', destinations);
    formData.append('files', files.map(f => ({
      f.file, f.file.name
    })));
    formData.append("file",uploadedFile,uploadedFile.name);

    onSave(formData, isEdit);

    // Reset to default values
    setName(value?.name || "");
    setRouteType(value?.routeType || routeTypes.coördinaat);
    setRoutepartZoom(value?.routepartZoom || false);
    setRoutepartFullscreen(value?.routepartFullscreen || false);
    setDestinations([]);
    setFiles([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit ? (
          <button><FaEdit /></button>
        ) : (
          <Button type="button">Create routepart</Button>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit routepart" : "Create routepart"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your routepart here. Click save when you're done."
              : "Fill in the details below to create a new routepart."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="flex-column">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routeType" className="text-right col-span-1">
                    route type
                  </Label>
                  <div className="col-span-2">
                    {/* @ts-ignore enums are being used but get converted to strings so typing doesnt work properly */}
                    <Select onValueChange={setRouteType} defaultValue={routeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={routeTypes.coördinaat}>Coordinates</SelectItem>
                        <SelectItem value={routeTypes.Afbeelding}>Pictures</SelectItem>
                        <SelectItem value={routeTypes.audio}>Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routepartZoom" className="text-right">
                    Zoom
                  </Label>
                  <Switch checked={routepartZoom} onCheckedChange={setRoutepartZoom} id="routepartZoom" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routepartFullscreen" className="text-right">
                    Full screen
                  </Label>
                  <Switch checked={routepartFullscreen} onCheckedChange={setRoutepartFullscreen} id="routepartFullscreen" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="destinations">
              {/* Content for destinations tab */}
            </TabsContent>
            <TabsContent value="files">
              <FileManager files={files} onDelete={handleDeleteFile} onUpload={handleUploadFile} />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Save changes" : "Create routepart"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
