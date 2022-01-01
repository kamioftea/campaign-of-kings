import {Schema} from "mongoose";
import * as yup from "yup";
import {army_lists} from "./WarhostData";

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

export interface WarhostUpdates {
    "army.list": string,
}

export const validUpdateKeys = async (): Promise<{[keys: string]: yup.AnySchema}> => ({
    "army.list": yup.string().oneOf(Object.keys(await army_lists)),
});
