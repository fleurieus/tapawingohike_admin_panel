/* eslint-disable @next/next/no-img-element */
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import "react-day-picker/dist/style.css";
import React, { useState, useEffect } from "react";
import { Routepart } from "@/types/routepart";
import { Destination } from "@/types/destination";
import { routeTypes } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { RoutepartFile } from "@/types/routepartFile";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

type EditOrCreateDialogProps = {
  value?: Routepart;
  onSave: (data: FormData, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [routepartId, setRoutepartId] = useState(value?.id || undefined);
  const [name, setName] = useState(value?.name || "");
  const [routeType, setRouteType] = useState(
    value?.routeType || routeTypes.coördinaat
  );
  const [routepartZoom, setRoutepartZoom] = useState(
    value?.routepartZoom || false
  );
  const [routepartFullscreen, setRoutepartFullscreen] = useState(
    value?.routepartFullscreen || false
  );
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [savedFiles, setSavedFiles] = useState<RoutepartFile[]>([]);

  const iconSettings = {
    mapIconUrl:
      '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>',
    mapIconColor: "#cc756b",
    mapIconColorInnerCircle: "#fff",
    pinInnerCircleRadius: 48,
  };

  // icon normal state
  const divIcon = L.divIcon({
    className: "leaflet-data-marker",
    html: L.Util.template(iconSettings.mapIconUrl, iconSettings), //.replace('#','%23'),
    iconAnchor: [12, 32],
    iconSize: [25, 30],
    popupAnchor: [0, -28],
  });

  useEffect(() => {
    if (value?.files) {
      // @ts-ignore
      setSavedFiles(value.files);
    }
    if (value?.destinations) {
      // @ts-ignore
      setDestinations(value.destinations);
    }
  }, [value]);

  useEffect(() => {
    if (files.length) {
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(filePreviews);
    }
  }, [files]);

  const handleDestinationChange = (
    index: number,
    field: keyof Destination,
    value: string | boolean
  ) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      [field]: value,
    };
    setDestinations(updatedDestinations);
  };

  const handleAddDestination = () => {
    setDestinations([
      ...destinations,
      {
        name: "",
        latitude: 52.21538319124777,
        longitude: 5.964031219482423,
        radius: 0,
        destinationType: "",
        confirmByUser: false,
        hideForUser: false,
      },
    ]);
  };

  const handleRemoveDestination = (index: number) => {
    const updatedDestinations = [...destinations];
    updatedDestinations.splice(index, 1);
    setDestinations(updatedDestinations);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const handleRemoveSavedFile = (index: number) => {
    const updatedSavedFiles = [...savedFiles];
    updatedSavedFiles.splice(index, 1);
    setSavedFiles(updatedSavedFiles);
  };

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    const updatedDestinations = [...destinations];
    const lastIndex = updatedDestinations.length - 1; // Index of the last added destination
    updatedDestinations[lastIndex] = {
      ...updatedDestinations[lastIndex],
      latitude: latlng.lat,
      longitude: latlng.lng,
    };
    setDestinations(updatedDestinations);
  };

  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        handleMapClick(e.latlng);
      },
    });
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let formData = new FormData();
    if (routepartId != undefined) {
      formData.append("id", routepartId.toString());
    }
    formData.append("name", name);
    formData.append("routeType", routeType);
    formData.append("routepartZoom", routepartZoom.toString());
    formData.append("routepartFullscreen", routepartFullscreen.toString());
    formData.append("destinations", JSON.stringify(destinations));

    savedFiles.forEach((file) => {
      files.push(
        new File([file.data], file.fileName, { type: file.contentType })
      );
    });

    files.forEach((file) => {
      formData.append("files", file);
    });

    onSave(formData, isEdit);
    setOpen(false);

    setName(value?.name || "");
    setRouteType(value?.routeType || routeTypes.coördinaat);
    setRoutepartZoom(value?.routepartZoom || false);
    setRoutepartFullscreen(value?.routepartFullscreen || false);
    setDestinations([]);
    setFiles([]);
    setPreviews([]);
    setSavedFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button>
            <FaEdit />
          </button>
        ) : (
          <Button type="button">Create routepart</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit routepart" : "Create routepart"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your routepart here. Click save when you're done."
              : "Fill in the details below to create a new routepart."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <h2>
              <b>Routepart details</b>
            </h2>
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
                Route type
              </Label>
              <div className="col-span-2">
                {/* @ts-ignore enums are being used but get converted to strings so typing doesnt work properly */}
                <Select onValueChange={setRouteType} defaultValue={routeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={routeTypes.coördinaat}>
                      Coördinaat
                    </SelectItem>
                    <SelectItem value={routeTypes.Afbeeldingen}>
                      Afbeelding(en)
                    </SelectItem>
                    <SelectItem value={routeTypes.audio}>Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="routepartZoom" className="text-right">
                Zoom
              </Label>
              <Switch
                checked={routepartZoom}
                onCheckedChange={setRoutepartZoom}
                id="routepartZoom"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="routepartFullscreen" className="text-right">
                Full screen
              </Label>
              <Switch
                checked={routepartFullscreen}
                onCheckedChange={setRoutepartFullscreen}
                id="routepartFullscreen"
              />
            </div>
          </div>
          <h2>
            <b>Destinations</b>
          </h2>
          <div className="grid gap-4 py-4">
            {destinations.map((destination, index) => (
              <div key={index} className="gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor={`destinationName-${index}`}
                    className="text-right"
                  >
                    Name
                  </Label>
                  <Input
                    id={`destinationName-${index}`}
                    value={destination.name}
                    onChange={(e) =>
                      handleDestinationChange(index, "name", e.target.value)
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="">
                  <MapContainer
                    center={[destination.latitude, destination.longitude]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[destination.latitude, destination.longitude]}
                      icon={divIcon}
                    ></Marker>
                    <MapClickHandler />
                  </MapContainer>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`radius-${index}`} className="text-right">
                    Radius
                  </Label>
                  <Input
                    id={`radius-${index}`}
                    type="number"
                    value={destination.radius.toString()}
                    onChange={(e) =>
                      handleDestinationChange(
                        index,
                        "radius",
                        // @ts-ignore
                        parseFloat(e.target.value)
                      )
                    }
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
                    onChange={(e) =>
                      handleDestinationChange(
                        index,
                        "destinationType",
                        e.target.value
                      )
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor={`confirmByUser-${index}`}
                    className="text-right"
                  >
                    Confirm by user
                  </Label>
                  <Switch
                    checked={destination.confirmByUser}
                    onCheckedChange={(value) =>
                      handleDestinationChange(index, "confirmByUser", value)
                    }
                    id={`confirmByUser-${index}`}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor={`hideForUser-${index}`}
                    className="text-right"
                  >
                    Hide for user
                  </Label>
                  <Switch
                    checked={destination.hideForUser}
                    onCheckedChange={(value) =>
                      handleDestinationChange(index, "hideForUser", value)
                    }
                    id={`hideForUser-${index}`}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveDestination(index)}
                  className="col-span-4"
                >
                  Remove Destination
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddDestination}>
              Add Destination
            </Button>
          </div>
          <h2>
            <b>Files</b>
          </h2>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="files" className="text-right">
                Upload Files
              </Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFilesChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="col-span-1 relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-auto"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-0 right-0 mt-2 mr-2 hidden group-hover:block"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {savedFiles.map((file, index) => (
                <div key={index} className="col-span-1 relative group">
                  <img
                    src={`data:${file.contentType};base64,${file.data}`}
                    alt={`Saved File ${index}`}
                    className="w-full h-auto"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveSavedFile(index)}
                    className="absolute top-0 right-0 mt-2 mr-2 hidden group-hover:block"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create routepart"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
