import {Schema} from "mongoose";

export interface Army {
    list: string
}

const armySchema = new Schema<Army>({
    list: String
});

export interface Warband {
    list: string
}

const warbandSchema = new Schema<Warband>({
    list: String,
})

export interface Warhost {
    name: string,
    army?: Army,
    warband?: Warband,
}

export const warhostSchema = new Schema<Warhost>({
    name: String,
    army: armySchema,
    warband: warbandSchema,
})
