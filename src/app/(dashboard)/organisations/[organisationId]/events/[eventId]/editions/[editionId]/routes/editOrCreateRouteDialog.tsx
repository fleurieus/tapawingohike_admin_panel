import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import "react-day-picker/dist/style.css";
import React, { useState, useEffect } from "react";
import { Route } from "@/types/route";

type EditOrCreateDialogProps = {
  value?: Route;
  onSave: (data: Route, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(value?.name || "");

  useEffect(() => {
    setName(value?.name || "");
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: Route = {
      id: value?.id,
      name,
      routeparts: []
    };

    onSave(updatedValue, isEdit);
    setOpen(false);
    setName("");
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isEdit ? (
              <button><FaEdit /></button>
          ) : (
              <Button type="button">Create route</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit route" : "Create route"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your route here. Click save when you're done."
                  : "Fill in the details below to create a new route."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save changes" : "Create route"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
