import { Route } from "./route"
import { Team } from "./team"

export type Edition = {
    id?: number
    name: string
    startDate: string //Date String
    endDate: string // Datae String
    routes?: Route[]
    teams?: Team[]
}