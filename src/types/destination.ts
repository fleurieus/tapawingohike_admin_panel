export type Destination = {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    destinationType: string;
    confirmByUser: boolean;
    hideForUser: boolean;
}