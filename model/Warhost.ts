import {Schema} from "mongoose";
import * as yup from "yup";
import {army_lists, UnitCategory} from "./WarhostData";

export interface Army {
    list: string,
    territories: Territory[],
}

const armySchema = new Schema<Army>({
    list: String,
    territories: [new Schema<Territory>({
        type: String,
        name: String,
        slots: [new Schema<TerritorySlot>({
            type: String,
            value: String,
        })]
    })]
});

export interface Warband {
    list: string
}

const warbandSchema = new Schema<Warband>({
    list: String,
})

export type SlotType = UnitCategory | 'Artefact';

export type TerritorySlot = {
    type: SlotType,
    value: undefined | string,
};

export type TerritoryType =
    'Base Camp' | 'Cave' | 'Mountain' | 'Forest' | 'Village' | 'Training Camp' | 'Ancient Ruins';

export interface Territory {
    type: TerritoryType | undefined,
    name: string,
    slots: TerritorySlot[],
}

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
    "army.list"?: string,
    "army.territories"?: Territory[]
}

export const validUpdateKeys = async (): Promise<{ [key in keyof WarhostUpdates]: yup.AnySchema }> => ({
    "army.list": yup.string().oneOf(Object.keys(await army_lists)),
    "army.territories": yup.array().of(
        yup.object().shape({
            type: yup.string().oneOf(['Base Camp', 'Cave', 'Mountain', 'Forest', 'Village', 'Training Camp', 'Ancient Ruins']).optional(),
            name: yup.string().default(''),
            slots: yup.array().of(
                yup.object().shape({
                    type: yup.string().oneOf(['Standard', 'Irregular', 'Monster', 'Titan', 'War Engine', 'Hero', 'Artifact']),
                    value: yup.string().optional(),
                })
            )
        })
    ),
});
