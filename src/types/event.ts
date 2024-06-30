import {Edition} from "@/types/edition";

export type Event = {
    id?: number;
    name: string;
    editions: Edition[];
}
