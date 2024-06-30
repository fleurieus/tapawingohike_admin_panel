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
import { Edition } from "@/types/edition";
import { FaEdit } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React, { useState, useEffect } from "react";

type EditOrCreateDialogProps = {
  value?: Edition;
  onSave: (data: Edition, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(value?.name || "");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    setName(value?.name || "");
    if (value) {
      setStartDate(new Date(value.startDate));
      setEndDate(new Date(value.endDate));
    } else {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: Edition = {
      id: value?.id,
      name,
      // @ts-ignore
      startDate,
      // @ts-ignore
      endDate,
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
              <Button type="button">Create edition</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit edition" : "Create edition"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your edition here. Click save when you're done."
                  : "Fill in the details below to create a new edition."}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  startDate
                </Label>
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  endDate
                </Label>
                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save changes" : "Create edition"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
