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
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {FaEdit} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {OrganisationUser} from "@/types/organisationUser";

type EditOrCreateUserOrganisationDialogProps = {
  value?: OrganisationUser;
  onSave: (data: OrganisationUser, isEdit: boolean) => Promise<void>;
};

export function EditOrCreateUserOrganisationDialog({
                                                     value,
                                                     onSave,
                                                   }: EditOrCreateUserOrganisationDialogProps) {
  const isEdit = !!value;
  const [firstName, setFirstName] = useState(value?.firstName || "");
  const [lastName, setLastName] = useState(value?.lastName || "");
  const [email, setEmail] = useState(value?.email || "");
  const [password, setPassword] = useState(value?.password || "");
  const [isManager, setIsManager] = useState(value?.isManager || false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(value?.firstName || "");
    setLastName(value?.lastName || "");
    setEmail(value?.email || "");
    setIsManager(value?.isManager || false);
    setPassword(value?.password || "");
  }, [value]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedValue: OrganisationUser = {
      id: value?.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      isManager: isManager,
    };
      onSave(updatedValue, isEdit).then(() => {
        setError("");
        setOpen(false);
      }).catch((error: any) => {
        setError(error);
    });
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isEdit ? (
              <button><FaEdit/></button>
          ) : (
              <Button type="button">Create user for organisation</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
            <DialogDescription>
              {isEdit
                  ? "Make changes to your user here. Click save when you're done."
                  : "Fill in the details below to create a new user."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  First name
                </Label>
                <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="col-span-3"
                    required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Last name
                </Label>
                <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="col-span-3"
                    required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    type="email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isManager" className="text-right">
                  Manager
                </Label>
                <Input
                    id="isManager"
                    type="checkbox"
                    checked={isManager}
                    onChange={(e) => setIsManager(e.target.checked)}
                    className="col-span-3"
                />
                {error && (
                    <p className="text-red-500 col-span-4">{error}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save changes" : "Create user"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
