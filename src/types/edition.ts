import { Route } from "./route"
import { Team } from "./team"

export type Edition = {
    id?: number
    name: string
    startDate: Date //Date String
    endDate: Date // Datae String
    routes?: Route[]
    teams?: Team[]
}
