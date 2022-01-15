import {Schema} from "mongoose";
import * as yup from "yup";
import {ArmyData, Equipment, eventual_army_lists, eventual_artefacts, Unit, UnitCategory} from "./WarhostData";
import {UserDocument} from "./UserDocument";

export interface Army {
    list: string,
    territories: Territory[],
    complete: boolean,
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
    })],
    complete: Boolean,
});

export interface Model {
    type: string,
    name?: string,
    xp: number,
    options: string[],
    upgrades: string[],
    cost: number,
}

export interface Warband {
    list: string,
    totalPoints: number,
    unspent: number,
    retinue: {
        leader?: Model,
    },
    roster: Model[],
    supplyCaravan: Equipment[],
    warbandComplete: boolean,
}

const modelSchema = new Schema<Model>({
    type: String,
    name: String,
    xp: Number,
    options: [String],
    upgrades: [String],
    cost: Number,
})

const equipmentSchema = new Schema<Equipment>({
    name: String,
    cost: Number,
    type: String,
    rarity: String,
})

const warbandSchema = new Schema<Warband>({
    list: String,
    totalPoints: Number,
    unspent: Number,
    retinue: {type: Map, of: modelSchema},
    roster: [modelSchema],
    supplyCaravan: [equipmentSchema],
    warbandComplete: Boolean,
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
    skipVanguard?: boolean,
}

export const warhostSchema = new Schema<Warhost>({
    name: String,
    army: armySchema,
    warband: warbandSchema,
    skipVanguard: Boolean
})

export interface WarhostUpdates {
    "army.list"?: string,
    "army.territories"?: Territory[]
    "army.complete"?: boolean
    "skipVanguard"?: boolean
    "warband"?: Warband
}

export const validUpdateKeys = async (): Promise<(User: UserDocument, updates: WarhostUpdates) => { [key in keyof WarhostUpdates]: yup.AnySchema }> => {
    const army_lists = await eventual_army_lists;
    const artefacts = await eventual_artefacts;

    return (user, updates) => {
        return ({
            "army.list": yup.string().oneOf([...Object.keys(army_lists), '']).optional(),
            "army.territories": yup.array().of(
                yup.object().shape({
                    type: yup.string().oneOf(['Base Camp', 'Cave', 'Mountain', 'Forest', 'Village', 'Training Camp', 'Ancient Ruins']).optional(),
                    name: yup.string().default(''),
                    slots: yup.array().of(
                        yup.object().shape({
                            type: yup.string().oneOf(['Standard', 'Irregular', 'Monster', 'Titan', 'War Engine', 'Hero', 'Artefact']),
                            value: yup.string().optional(),
                        })
                            .test(
                                'validate_slot_value',
                                ({value: slot}) => {
                                    return `${slot.value} is not a valid ${slot.type}${slot.type === 'Artefact' ? '' : ' Unit'}.`;
                                },
                                (slot) => {
                                    if (slot.value === undefined) return true;
                                    if (slot.type === undefined) return false;  // Type can only be undefined if value is
                                    if (slot.type === 'Artefact') return artefacts[slot.value] !== undefined;

                                    const submittedList = updates["army.list"] ?? user.warhost?.army?.list;
                                    const list: ArmyData | undefined = submittedList ? army_lists[submittedList] : undefined;
                                    if (!list || !list.units[slot.type as UnitCategory]) return false;

                                    return list.units[slot.type as UnitCategory].some((unit: Unit) => unit.name === slot.value);
                                })
                    )
                })
                    .test(
                        'validate_slot',
                        ({value}) => `Incorrect slots for territory type ${value.type}`,
                        (obj) => {
                            if(obj.type == undefined) {
                                return true
                            }

                            const expectSlotTypes = (...expected: SlotType[]): boolean => {
                                if (expected.length !== obj.slots?.length) return false;
                                expected.sort()
                                const actual = obj.slots.map(s => s.type).sort();
                                for (const i in expected) {
                                    if (expected[i] !== actual[i]) return false;
                                }
                                return true;
                            }

                            switch (obj.type as TerritoryType) {
                                case "Cave":
                                    return expectSlotTypes("Monster");
                                case "Mountain":
                                    return expectSlotTypes("Titan");
                                case "Forest":
                                    return expectSlotTypes("War Engine");
                                case "Village":
                                    return expectSlotTypes("Standard");
                                case "Training Camp":
                                    return expectSlotTypes("Irregular");
                                case "Ancient Ruins":
                                    return expectSlotTypes("Hero", "Artefact");
                                case 'Base Camp':
                                    return expectSlotTypes('Standard', 'Standard', "Hero", "Artefact");
                            }
                        })
            ),
            "army.complete": yup.boolean(),
            "skipVanguard": yup.boolean(),
            "warband": yup.object(),
        });
    };
};
