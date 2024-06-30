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
import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";

type EditOrCreateDialogProps = {
  value?: Organisation;
  onSave: (data: Organisation, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(value?.name || "");
  const [contactPerson, setContactPerson] = useState(value?.contactPerson || "");
  const [contactEmail, setContactEmail] = useState(value?.contactEmail || "");

  useEffect(() => {
    setName(value?.name || "");
    setContactPerson(value?.contactPerson || "");
    setContactEmail(value?.contactEmail || "");
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: Organisation = {
      id: value?.id,
      name: name,
      contactPerson: contactPerson,
      contactEmail: contactEmail,
    };
    onSave(updatedValue, isEdit);
    setOpen(false);
    setName("");
    setContactPerson("");
    setContactEmail("");
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isEdit ? (
              <button><FaEdit /></button>
          ) : (
              <Button type="button">Create Organisation</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit organisation" : "Create organisation"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your organisation here. Click save when you're done."
                  : "Fill in the details below to create a new organisation."}
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
                <Label htmlFor="contactperson" className="text-right">
                  Contact Person
                </Label>
                <Input
                    id="contactperson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactemail" className="text-right">
                  Contact Email
                </Label>
                <Input
                    id="contactemail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="col-span-3"
                    type="email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save changes" : "Create organisation"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
