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
import { Team } from "@/types/team";

type EditOrCreateDialogProps = {
  value?: Team;
  onSave: (data: Team, isEdit: boolean) => void;
};

export function EditOrCreateDialog({ value, onSave }: EditOrCreateDialogProps) {
  const isEdit = !!value;
  const [name, setName] = useState(value?.name || "");
  const [code, setCode] = useState(value?.code || "");
  const [contactName, setContactName] = useState(value?.contactName || "");
  const [contactEmail, setContactEmail] = useState(value?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(value?.contactPhone || "");

  useEffect(() => {
    setName(value?.name || "");
    setCode(value?.code || "");
    setContactName(value?.contactName || "");
    setContactEmail(value?.contactEmail || "");
    setContactPhone(value?.contactPhone || "");
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: Team = {
      id: value?.id,
      code,
      name,
      contactName,
      contactEmail,
      contactPhone,
      online: value?.online || false,
    };
    setName("");
    setCode("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    onSave(updatedValue, isEdit);
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          {isEdit ? (
              <button><FaEdit /></button>
          ) : (
              <Button type="button">Create team</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit team" : "Create team"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your team here. Click save when you're done."
                  : "Fill in the details below to create a new team."}
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
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="col-span-3"
                    required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactname" className="text-right">
                  Contact Person
                </Label>
                <Input
                    id="contactname"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactphone" className="text-right">
                  Contact Phone number
                </Label>
                <Input
                    id="contactphone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save changes" : "Create team"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
