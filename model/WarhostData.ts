import fs from "fs/promises";
import cbGlob from 'glob';
import {promisify} from 'util';
import Path from "path";

const glob = promisify(cbGlob);

export interface ListSummary {
    army_list: string,
    army_label: string,
    alignment: Alignment,
    warband_list: string
    warband_label: string
}

export interface WarhostData {
    lists: ListSummary[],
    army?: ArmyData,
    warband?: WarbandData,
    artefacts: {[keys: string]: Artefact},
}

export interface Artefact {
    cost: number,
    hordeCost?:number,
    heroOnly: boolean,
    individualOnly: true,
}

export type UnitCategory = 'Standard' | 'Irregular' | 'Monster' | 'Titan' | 'War Engine' | 'Hero';

type UnitType = "Infantry" | "Heavy Infantry" | "Large Infantry" | "Monstrous Infantry" | "Cavalry" | "Large Cavalry"
    | "Chariot" | "Monster" | "Titan" | "War Engine" | "Hero" | 'Formation';

export interface Unit {
    name: string,
    type: UnitType,
    subType?: "Inf" | "Hv Inf" | "Lrg Inf" | "Mon-Inf" | "Cav" | "Lrg Cav" | "Cht" | "Mon-Cht" | "Ttn",
    irregular: boolean,
    sizes: { [key: string]: number[] },
    options: { [key: string]: number[] }
}

export type Alignment = "Good" | "Neutral" | "Evil";

export type UnitBreakdown = { [category in UnitCategory]: Unit[] };

export interface ArmyData {
    name: string,
    alignment: Alignment,
    vanguardList?: string,
    units: UnitBreakdown,
}

export interface Model {
    name: string,
    type: string,
    points: number,
}

export interface WarbandData {
    name: string,
    units: Model[],
}

const emptyUnitData = (): UnitBreakdown => ({
    Standard: [],
    Irregular: [],
    Monster: [],
    Titan: [],
    'War Engine': [],
    Hero: [],
})

function categoryFromUnit(unit: Unit): UnitCategory | undefined {
    switch (unit.type) {
        case "Monster":
        case "Titan":
        case "War Engine":
        case "Hero":
            return unit.type;
        case "Formation":
            return undefined;
        default:
            return unit.irregular ? 'Irregular' : 'Standard'
    }
}

export const eventual_army_lists: Promise<{ [key: string]: ArmyData }> = glob('./data/kings-of-war/*.json')
    .then(files => Promise.all([...files.map(f => fs.readFile(f, 'utf-8').then(json => [json, f]))]))
    .then(contents =>
        Object.fromEntries(
            contents.map(
                ([json, file]) => {
                    const data = JSON.parse(json);
                    const list_name = Path.parse(file).name;

                    data.units = (data.units as Unit[]).reduce(
                        (acc, unit) => {
                            const category = categoryFromUnit(unit);
                            if(category !== undefined) {
                                acc[category].push(unit)
                            }
                            return acc;
                        },
                        emptyUnitData()
                    )

                    return [
                        list_name,
                        data
                    ]
                }
            )
        )
    );

export const warband_lists: Promise<{ [key: string]: WarbandData }> = glob('./data/vanguard/*.json')
    .then(files => Promise.all([...files.map(f => fs.readFile(f, 'utf-8').then(json => [json, f]))]))
    .then(contents =>
        Object.fromEntries(
            contents.map(
                ([json, file]) => {
                    const data = JSON.parse(json) as WarbandData;
                    let name = Path.parse(file).name.replace('-vanguard', '');
                    return [
                        name,
                        data
                    ]
                }
            )
        )
    );

export const warhost_lists: Promise<ListSummary[]> = Promise.all([eventual_army_lists, warband_lists])
    .then(([armies, warbands]) =>
        Object.entries(armies).map(([key, army_data]) => {
            const warband_list = army_data.vanguardList ?? key;
            const warband_label = warbands[warband_list]?.name ?? ""

            return {
                army_list: key,
                army_label: army_data.name,
                alignment: army_data.alignment,
                warband_list,
                warband_label
            };
        })
    )

export const eventual_artefacts: Promise<{[keys: string]: Artefact}> =
    fs.readFile('./data/artefacts.json', 'utf-8').then(contents => JSON.parse(contents));
