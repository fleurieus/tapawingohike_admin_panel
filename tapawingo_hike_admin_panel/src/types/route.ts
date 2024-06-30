import { Routepart } from "./routepart"

export type Route = {
    id?: number
    name: string
    routeparts: Routepart[]
}