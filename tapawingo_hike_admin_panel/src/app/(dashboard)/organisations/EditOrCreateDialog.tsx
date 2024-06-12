"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Organisation} from "./columns";
import {FaEdit} from "react-icons/fa";
import {API_BASE_URL} from "@/lib/utils";
import React, {useState} from "react";

type EditOrCreateDialogProps = {
  value?: Organisation;

};

export function EditOrCreateDialog({value}: EditOrCreateDialogProps) {
  const isEditDialog = !!value;
  const [name, setName] = useState(isEditDialog ? value.name : '');
  const [contactPerson, setContactPerson] = useState(isEditDialog ? value.contactPerson : '');
  const [contactEmail, setContactEmail] = useState(isEditDialog ? value.contactEmail : '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedValue = {
      name: name,
      contactPerson: contactPerson,
      contactEmail: contactEmail,
    };

    const url = isEditDialog ? `${API_BASE_URL}/organisations/${value.id}` : `${API_BASE_URL}/organisations`;
    const method = isEditDialog ? 'PATCH' : 'POST';
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedValue)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          {isEditDialog ? <button><FaEdit/></button> : <Button>Create Organisation</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditDialog ? 'Edit organisation' : 'Create organisation'}</DialogTitle>
            <DialogDescription>
              {isEditDialog ? 'Make changes to your organisation here. Click save when you\'re done.' : 'Fill in the details below to create a new organisation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactperson" className="text-right">
                Contact Person
              </Label>
              <Input
                  id="contactperson"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
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
                  onChange={e => setContactEmail(e.target.value)}
                  className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>{isEditDialog ? 'Save changes' : 'Create organisation'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
