import { Event } from "./event";
export type Organisation = {
  id?: number;
  name: string;
  contactPerson: string;
  contactEmail: string;
  events: Event[];
};
