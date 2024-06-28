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
import { Destination } from "@/types/destination";
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
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [files, setFiles] = useState<File[]>(value?.files || []);

  useEffect(() => {
    if (isEdit) {
      setFiles(value?.files || []);
    }
  }, [isEdit]);

  const handleDeleteFile = (fileId: number) => {
    const updatedFiles = files.filter(file => 2 !== fileId);
    setFiles(updatedFiles);
  };

  const handleUploadFile = (file: File) => {
    const updatedFiles = [...files, file];
    setFiles(updatedFiles);
  };

  const handleDestinationChange = (index: number, field: keyof Destination, value: string | boolean) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      [field]: value
    };
    setDestinations(updatedDestinations);
  };

  const handleAddDestination = () => {
    setDestinations([...destinations, {
      name: "",
      latitude: 0,
      longitude: 0,
      radius: 0,
      destinationType: "",
      confirmByUser: false,
      hideForUser: false
    }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append('name', name);
    formData.append('routeType', routeType);
    formData.append('routepartZoom', routepartZoom.toString());
    formData.append('routepartFullscreen', routepartFullscreen.toString());

    formData.append('destinations', JSON.stringify(destinations));

    onSave(formData, isEdit);

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
            <div className="grid gap-4 py-4">
                {destinations.map((destination, index) => (
                  <div key={index} className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`destinationName-${index}`} className="text-right">
                        Name
                      </Label>
                      <Input
                        id={`destinationName-${index}`}
                        value={destination.name}
                        onChange={(e) => handleDestinationChange(index, "name", e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`latitude-${index}`} className="text-right">
                        Latitude
                      </Label>
                      <Input
                        id={`latitude-${index}`}
                        type="number"
                        value={destination.latitude.toString()}
                        onChange={(e) => handleDestinationChange(index, "latitude", parseFloat(e.target.value))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`longitude-${index}`} className="text-right">
                        Longitude
                      </Label>
                      <Input
                        id={`longitude-${index}`}
                        type="number"
                        value={destination.longitude.toString()}
                        onChange={(e) => handleDestinationChange(index, "longitude", parseFloat(e.target.value))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`radius-${index}`} className="text-right">
                        Radius
                      </Label>
                      <Input
                        id={`radius-${index}`}
                        type="number"
                        value={destination.radius.toString()}
                        onChange={(e) => handleDestinationChange(index, "radius", parseFloat(e.target.value))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`type-${index}`} className="text-right">
                        Destination type
                      </Label>
                      <Input
                        id={`type-${index}`}
                        value={destination.destinationType}
                        onChange={(e) => handleDestinationChange(index, "destinationType", e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`confirmByUser-${index}`} className="text-right">
                        Confirm by user
                      </Label>
                      <Switch
                        checked={destination.confirmByUser}
                        onCheckedChange={(value) => handleDestinationChange(index, "confirmByUser", value)}
                        id={`confirmByUser-${index}`}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`hideForUser-${index}`} className="text-right">
                        Hide for user
                      </Label>
                      <Switch
                        checked={destination.hideForUser}
                        onCheckedChange={(value) => handleDestinationChange(index, "hideForUser", value)}
                        id={`hideForUser-${index}`}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleAddDestination} className="mt-4">
                  Add Destination
                </Button>
              </div>
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
