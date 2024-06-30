import { routeTypes } from "@/lib/utils"
import { Destination } from "./destination"

export type Routepart = {
    id?: number
    name: string
    routeType: routeTypes
    routepartZoom: boolean
    routepartFullscreen: boolean
    order?: number
    final?: boolean
    destinations?: string
    Destinations?: Destination[]
    files?: File[]
}