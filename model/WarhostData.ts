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
}

export interface Unit {
    name: string,
    type: "Infantry" | "Heavy Infantry" | "Large Infantry" | "Monstrous Infantry" | "Cavalry" | "Large Cavalry"
        | "Chariot" | "Monster" | "Titan" | "War Engine" | "Hero" | 'Formation',
    subType?: "Inf" | "Hv Inf" | "Lrg Inf" | "Mon-Inf" | "Cav" | "Lrg Cav" | "Cht" | "Mon-Cht" | "Ttn",
    irregular: boolean,
    sizes: { [key: string]: number[] },
    options: { [key: string]: number[] }
}

export type Alignment = "Good" | "Neutral" | "Evil";

export interface ArmyData {
    name: string,
    alignment: Alignment,
    vanguardList: string,
    units: Unit[],
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


export const army_lists: Promise<{ [key: string]: ArmyData }> = glob('./data/kings-of-war/*.json')
    .then(files => Promise.all([...files.map(f => fs.readFile(f, 'utf-8').then(json => [json, f]))]))
    .then(contents =>
        Object.fromEntries(
            contents.map(
                ([json, file]) => {
                    const data = JSON.parse(json) as ArmyData;
                    return [
                        Path.parse(file).name,
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
                    return [
                        Path.parse(file).name.replace('-vanguard', ''),
                        data
                    ]
                }
            )
        )
    );

export const lists: Promise<ListSummary[]> = Promise.all([army_lists, warband_lists])
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
