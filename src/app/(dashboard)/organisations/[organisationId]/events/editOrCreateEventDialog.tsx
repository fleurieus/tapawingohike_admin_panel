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
import { Organisation } from '@/types/organisation';
import { Event } from '@/types/event';
import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";

type EditOrCreateDialogProps = {
  value?: Event;
  onSave: (data: Event, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [name, setName] = useState(value?.name || "");

  useEffect(() => {
    setName(value?.name || "");
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: Event = {
      id: value?.id,
      name,
    };
    setName("");
    onSave(updatedValue, isEdit);
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          {isEdit ? (
              <button> <FaEdit /></button>
          ) : (
              <Button type="button">Create Event</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit event" : "Create event"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your event here. Click save when you're done."
                  : "Fill in the details below to create a new event."}
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
              <Button type="submit">{isEdit ? "Save changes" : "Create event"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
