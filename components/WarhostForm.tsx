import {UserDocument} from "../model/UserDocument";
import {useWarhostData} from "../hooks/useWarhostData";
import {
    Alignment,
    Artefact,
    Equipment,
    ListSummary,
    ModelType,
    UnitBreakdown,
    UnitCategory,
    WarbandData
} from "../model/WarhostData";
import styles from '../styles/WarhostForm.module.scss';
import {FiAlertTriangle, FiCheck, FiChevronLeft, FiInfo, FiPlus, FiTrash, FiX} from "react-icons/fi";
import {ChangeEvent, Fragment, KeyboardEvent, MouseEvent, useState} from "react";
import {
    Model,
    SlotType,
    Territory,
    TerritorySlot,
    TerritoryType,
    Warband,
    Warhost,
    WarhostUpdates
} from "../model/Warhost";
import {label} from "aws-sdk/clients/sns";
import {RichTextbox} from "./RichTextbox";
import {SaveableInput} from "./SaveableInput";
import {ImageUpload} from "./Dropzone";
import Image from "next/image";

type ForceFormProps = { user: UserDocument };

const alignmentCopy: { [a in Alignment]: string } = {
    "Good": "With its isolation, Hell&apos;s Claw has always been a retreat for the most powerful evils in the world. A" +
        " crusade to purge this place has been a long time coming. Maybe you also have more personal reasons, a" +
        " quest for a stolen relic of the Shining Ones, or to serve justice on a fiend that has fled here.",
    "Neutral": "With so much interest in Hell&apos;s Claw, there is a lot of money to be made as a sell-sword here. For" +
        " the more adventurous, if the rumours are true, there will be plenty of opportunities to loot long lost" +
        " hordes. ",
    "Evil": "With its isolation, Hell&apos;s Claw has always been a retreat for the most powerful evils in the world." +
        " If the rumours are true, the power that is awakening here could be a boon to your nefarious plans. Perhaps" +
        " you seek something more specific, a necromantic tome long lost, or vengeance against an old rival?"
}

function ArmyChooser({lists, onSelect}: { lists: ListSummary[], onSelect: (army: string) => void }) {
    const [alignment, setAlignment] = useState<Alignment | null>(null);

    const alignmentClickHandler = (alignment: Alignment | null) => (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAlignment(alignment)
    }

    const factionClickHandler = (army: string) => (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSelect(army)
    }

    const asButton = (summary: ListSummary) =>
        <button className="button dark hollow"
                key={summary.army_list}
                onClick={factionClickHandler(summary.army_list)}
                onKeyUp={factionClickHandler(summary.army_list)}
        >
            <Image className={styles.armyIcon}
                 src={`/images/icons/${summary.army_list}.png`}
                 alt={`${summary.army_label} Icon`}/>
            <span>{summary.army_label}</span>
        </button>

    const byAlignment = (alignment: Alignment) =>
        <div className={styles.alignmentContainer}>
            {
                lists.filter(s => s.alignment === alignment)
                    .sort((a, b) => a.army_label.localeCompare(b.army_label))
                    .map(asButton)
            }
        </div>;

    return <>
        {!alignment
            ?<>
                <p>
                    The journey to Hell&apos;s Claw will be long and treacherous. Most will brave the storms and monsters
                    of the open ocean, but there are other ways. Maybe you have an experimental airship, or can open a
                    portal and quest through the horrors of the Ethereal Plane. One thing however is certain, there is
                    something there you think is worth the cost.
                </p>
                <h2>Where does your allegiance lie?</h2>
            <div className={styles.alignmentContainer}>
                {(['Good', 'Neutral', 'Evil'] as Alignment[]).map((a: Alignment) =>
                    <button key={a}
                            className={`button dark ${a == alignment ? '' : 'hollow'}`}
                            onClick={alignmentClickHandler(a)}
                            onKeyUp={alignmentClickHandler(a)}>
                        <span>{a}</span>
                    </button>
                )}
            </div>
                </>
            : <>
                <h2>{alignment}</h2>
                <p>{alignmentCopy[alignment]}</p>
                <h2>Which Faction do you lead?</h2>
                {byAlignment(alignment)}
                <button className="button primary"
                        onClick={alignmentClickHandler(null)}
                        onKeyUp={alignmentClickHandler(null)}>
                    <FiChevronLeft/> Back
                </button>
            </>
        }
    </>;
}

function indefiniteArticle(category: UnitCategory) {
    if (category === 'Irregular') return 'an'
    else return 'a'
}

type TerritoryFormProps = {
    territory: Territory,
    picked: string[],
    units: UnitBreakdown,
    artefacts: { [keys: string]: Artefact },
    onChange: (territory: Territory) => void,
};

function TerritoryForm({territory, picked, units, artefacts, onChange}: TerritoryFormProps) {
    const options = [];
    if (territory.type == undefined) {
        const onSelect = (slotType: TerritoryType) => {
            switch (slotType) {
                case "Base Camp":
                    onChange({type: undefined, name: '', slots: []});
                    break;

                case "Cave":
                    onChange({type: 'Cave', name: '', slots: [emptySlot('Monster')]});
                    break;

                case "Mountain":
                    onChange({type: 'Mountain', name: '', slots: [emptySlot('Titan')]});
                    break;

                case "Forest":
                    onChange({type: 'Forest', name: '', slots: [emptySlot('War Engine')]});
                    break;

                case "Village":
                    onChange({type: 'Village', name: '', slots: [emptySlot('Standard')]});
                    break;

                case "Training Camp":
                    onChange({type: 'Training Camp', name: '', slots: [emptySlot('Irregular')]});
                    break;

                case "Ancient Ruins":
                    onChange({type: 'Ancient Ruins', name: '', slots: [emptySlot('Hero'), emptySlot('Artefact')]});
                    break;
            }
        }

        options.push(<AddTerritory key="add" onSelect={onSelect}/>)
    } else {
        const filterPicked = (arr: string[], val: string | undefined): string[] => arr.filter(v => v === val || !picked.includes(v))
        const updateSlot = (index: number) => (event: ChangeEvent<HTMLSelectElement>) => {
            event.preventDefault();
            territory.slots[index].value = event.currentTarget.value || undefined;
            onChange(territory);
        }

        territory.slots.forEach((slot, i) =>
            options.push(
                <label key={i} className="inline">
                    {slot.type}
                    <select value={slot.value ?? ''} onChange={updateSlot(i)}>
                        <option value={''}>-- Choose {
                            slot.type === 'Artefact'
                                ? 'an Artefact'
                                : `${indefiniteArticle(slot.type)} ${slot.type} Unit`
                        } --
                        </option>
                        {filterPicked(slot.type === 'Artefact' ? Object.keys(artefacts) : units[slot.type].map(u => u.name), slot.value)
                            .sort((a, b) => a.localeCompare(b))
                            .map(opt => <option key={opt} value={opt}>{opt}</option>)
                        }
                    </select>
                </label>
            )
        );
    }

    const onClear = (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault();
        onChange({type: undefined, name: '', slots: []});
    }

    return <fieldset className="fieldset">
        <legend>
            {territory.type ?? 'Unclaimed'}{' '}
            {territory.type && territory.type !== 'Base Camp' ? <a href="#" onClick={onClear} onKeyUp={onClear}>Change</a> : null}
        </legend>
        {options}
    </fieldset>;
}

function emptySlot(slotType: SlotType): TerritorySlot {
    return {type: slotType, value: undefined}
}

type TerritoryChooserProps = {
    territories: Territory[] | undefined,
    units: UnitBreakdown | undefined,
    artefacts: { [keys: string]: Artefact },
    onChange: (territories: Territory[]) => void,
};

function AddTerritory({onSelect}: { onSelect: (type: TerritoryType) => void }) {
    return <label className="inline">
        Type
        <select onChange={e => {
            e.preventDefault();
            onSelect(e.currentTarget.value as TerritoryType)
        }}>
            <option>-- Choose a Territory --</option>
            <option value="Cave">Cave (Monster)</option>
            <option value="Mountain">Mountain (Titan)</option>
            <option value="Forest">Forest (War Machine)</option>
            <option value="Village">Village (Standard)</option>
            <option value="Training Camp">Training Camp (Irregular)</option>
            <option value="Ancient Ruins">Ancient Ruins (Hero & Artefact)</option>
        </select>
    </label>
}

function TerritoryChooser({territories, units, artefacts, onChange}: TerritoryChooserProps) {
    if (units == undefined) {
        return <p>Loading...</p>
    }

    if (!territories || territories.length === 0) {
        territories = [
            {
                type: 'Base Camp',
                name: '',
                slots: [
                    emptySlot('Standard'),
                    emptySlot('Standard'),
                    emptySlot('Hero'),
                    emptySlot('Artefact')
                ],
            },
            {
                type: undefined,
                name: '',
                slots: []
            }
        ];
    }

    const picked: string[] = territories.flatMap(t => t.slots.map(s => s.value).filter(v => v != undefined)) as string[];

    const onTerritoryChange = (index: number) => (territory: Territory) => {
        if (!territories) {
            return
        }
        onChange([...territories.slice(0, index), territory, ...territories.slice(index + 1)])
    }

    return <>
        <p>
            After surviving the dangers of your journey you finally reach on Hell&apos;s Claw. Those who came by sea have to
            pick their way through the icebergs and rocks that loom in the mists that surround the whole island.
            It is a cold and inhospitable place. Rocky ridges extend from the mist shrouded mountains in the centre,
            forming deep valleys and fjords.
        </p>
        <h2>Stake Your Claim</h2>
        <p>
            The bulk of your expeditionary force upload supplies and sets up a makeshift base camp. Your vanguard
            set out to explore the local area and secure useful resources.
        </p>
        {territories.map((t, i) =>
            <TerritoryForm
                key={i}
                territory={t}
                picked={picked}
                units={units}
                artefacts={artefacts}
                onChange={onTerritoryChange(i)}
            />
        )}
    </>
}

interface ModelBuilderProps {
    label: string
    units: ModelType[],
    value: Model | null
    onChange: (model: Model | null) => void
    onSubmit?: () => void
}

function ModelBuilder({label, value, units, onChange, onSubmit}: ModelBuilderProps) {
    const handleAdd = (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault();
        onSubmit?.();
    }
    const selectedModel = units.find(u => u.name === value?.type);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const name = e.currentTarget.value;
        const unit = units.find(u => u.name === name);

        onChange(unit
            ? {
                cost: unit.points,
                options: [],
                type: name,
                upgrades: [],
                xp: 0
            }
            : null,
        );
    }

    const handleChecked = (option: string, cost: number) => (e: ChangeEvent<HTMLInputElement>) => {
        if (value === null) {
            return;
        }

        const updated = {...value}

        if (option.startsWith('Gift of Korgaan:')) {
            const existing = value.options.find(o => o.startsWith('Gift of Korgaan:'));
            const existingCost = existing ? selectedModel?.options[existing] : undefined

            if (existing && existingCost != undefined) {
                updated.cost -= existingCost;
                updated.options = value.options.filter(o => o !== existing)
            }
        }

        onChange({
            ...updated,
            options: e.currentTarget.checked
                ? [...updated.options, option]
                : updated.options.filter(o => o !== option),
            cost: e.currentTarget.checked
                ? updated.cost + cost
                : updated.cost - cost
        })
    }

    return <>
        <label className="inline">
            {label}
            <div className="input-group">
                <select value={value?.type ?? ''} onChange={handleChange}>
                    <option>-- Pick a Model --</option>
                    {units
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(
                            model =>
                                <option key={model.name} value={model.name}>
                                    {model.name}{' '}
                                    [{(model.types as string[]).concat(model.races ?? []).join(', ')}] {model.points}pts
                                </option>
                        )
                    }
                </select>
                {typeof onSubmit === 'function'
                    ? <div className="input-group-button">
                        <button className={`button ${value ? '' : 'disabled'}`}
                                onClick={handleAdd}
                                onKeyUp={handleAdd}
                        >
                            <FiPlus/>
                        </button>
                    </div>
                    : null
                }
            </div>
        </label>
        {Object.entries(selectedModel?.options ?? {}).map(([option, cost]) =>
            <div className="inline" key={option}>
                <div/>
                <label className={styles.optionContainer}>
                    <input type="checkbox"
                           checked={value?.options.includes(option)}
                           onChange={handleChecked(option, cost)}
                    />
                    {option} ({cost}pts)
                </label>
            </div>
        )}
    </>
}

interface AddModelProps {
    units: ModelType[]
    onSubmit: (model: Model) => void
}

function AddModel({units, onSubmit}: AddModelProps) {
    const [model, setModel] = useState<Model | null>(null);

    return <ModelBuilder label={'Add Model'}
                         units={units}
                         value={model}
                         onChange={setModel}
                         onSubmit={() => model !== null ? onSubmit(model) : null}
    />
}

interface WarbandRequirementsProps {
    requirements: RequirementResult[]
}

interface RequirementResult {
    message: string,
    passed: boolean
}

export function checkRequirements(warband: Warband, list: WarbandData): RequirementResult[] {
    const units = warband.roster.map(m => list.units.find(u => u.name === m.type));
    const types = units.map(u => u?.types ?? []);
    const troopCount = types.filter(ts => ts.includes('Grunt') || ts.includes('Warrior')).length;

    const requirements = [
        () => ({
            message: 'Must have a Leader',
            passed: (warband.retinue.leader?.type ?? '') != ''
        }),
        () => ({
            message: `${troopCount} / 5 required Grunts or Warriors`,
            passed: troopCount >= 5
        }),
        () => {
            const supportCount = types.filter(ts => ts.includes('Support')).length;
            const supported = Math.floor(troopCount / 3)

            return {
                message: `You have ${supportCount} / ${supported} Support units`,
                passed: supportCount <= supported
            };
        },
        () => {
            const spellcaster = types.filter(ts => ts.includes('Spellcaster')).length;
            const supported = Math.floor(troopCount / 3)

            return {
                message: `You have ${spellcaster} / ${supported} Spellcaster units`,
                passed: spellcaster <= supported
            };
        },
        () => {
            let allowedCommandLargeUsed = false;
            const {count, ignored} = units.reduce(
                ({count, ignored, allowedCommandLargeUsed}, unit) => {
                    if(!unit?.types.includes('Large')) {
                        return {count, ignored, allowedCommandLargeUsed}
                    }
                    if (warband.list === 'ogre' && unit?.races.includes('Ogre')) {
                        return {count, ignored: ignored + 1, allowedCommandLargeUsed}
                    }
                    if (unit?.types.includes('Command') && !allowedCommandLargeUsed) {
                        return {count, ignored: ignored + 1, allowedCommandLargeUsed: true}
                    }
                    return {count: count + 1, ignored, allowedCommandLargeUsed}
                },
                {
                    count: 0,
                    ignored: 0,
                    allowedCommandLargeUsed,
                }
            )
            const supported = Math.floor(warband.totalPoints / 150) + (warband.list === 'northern-alliance' ? 1 : 0);

            return {
                message: `You have ${count} / ${supported} Large units${ignored ? ` (${ignored} Large units ignored)` : ''}`,
                passed: count <= supported
            };
        },
        () => ({
            message: `You have spent ${warband.totalPoints - warband.unspent} / ${warband.totalPoints} pts`,
            passed: warband.unspent >= 0
        })
    ]

    return requirements.map(f => f());
}

function WarbandRequirements({requirements}: WarbandRequirementsProps) {
    return <>
        {requirements.map((r, i) =>
            <div className={styles.requirementRow} key={i}>
                {r.passed ? <FiCheck className="text-success"/> : <FiX className="text-alert"/>}{' '}
                {r.message}
            </div>
        )}
    </>
}

interface VanguardRosterBuilderProps {
    list: WarbandData | undefined
    notice?: string
    warband: Warband
    equipment: { [keys: string]: Equipment }
    requirements: RequirementResult[]
    onUpdate: (warband: Warband | undefined, skip?: boolean) => void
}

function VanguardRosterBuilder({list, notice, warband, equipment, requirements, onUpdate}: VanguardRosterBuilderProps) {
    const [skipBoxChecked, toggleSkipBox] = useState<boolean>(false);
    const [skipBoxClosed, setSkipBoxClosed] = useState<boolean>(false);
    const [noticeClosed, setNoticeClosed] = useState<boolean>(false);

    if (!list) {
        return <p>Loading...</p>
    }

    const handleRetinueChange = (key: keyof typeof warband.retinue) => (model: Model | null) => {
        warband.unspent = warband.unspent + (warband.retinue[key]?.cost ?? 0) - (model?.cost ?? 0)
        if (model) {
            model.upgrades = ['Leader Bonus: +1 Red Power Die'];
        }

        warband.retinue[key] = model ?? undefined;
        onUpdate(warband);
    }

    const handleAddModel = (model: Model) => {
        warband.unspent = warband.unspent - model.cost;
        warband.roster.push(model);

        onUpdate(warband);
    }

    const handleRemoveModel = (index: number) => (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault()
        const [model] = warband.roster.splice(index, 1)
        warband.unspent = warband.unspent + model.cost;

        onUpdate(warband);
    }

    const handleAddEquipment = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const selectedEquipment = equipment[e.currentTarget.value];
        if (!selectedEquipment) {
            return;
        }
        warband.unspent = warband.unspent - selectedEquipment.cost;
        warband.supplyCaravan.push(selectedEquipment);

        onUpdate(warband);
    }

    const handleRemoveEquipment = (index: number) => (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault()
        const [equipment] = warband.supplyCaravan.splice(index, 1)
        warband.unspent = warband.unspent + equipment.cost;

        onUpdate(warband);
    }

    const handleSkip = (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault()
        onUpdate(undefined, true)
    }

    const commonEquipmentCount = warband.supplyCaravan.filter(i => i.rarity === 'Common').length;

    const takenUnique = [...(warband.retinue.leader ? [warband.retinue.leader] : []), ...warband.roster]
        .map(m => m.type)
        .filter(t => t.includes('*'));

    return <>
        <p>
            Having secured your landing site, you start to plan your next moves. If your campaign is going to succeed
            you need more information. Hell&apos;s Claw is keeping its secrets shrouded in thick mists, and you suspect your
            force is not the only one to take interest in the power here. You assemble your elite scouts...
        </p>
        <h2>Vanguard Roster</h2>
        {!skipBoxClosed
            ? <div className="callout info">
                <button className="close-button" aria-label="Close skip vanguard information box"
                        type="button"
                        onClick={() => setSkipBoxClosed(true)}
                        onKeyUp={() => setSkipBoxClosed(true)}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <p>
                    <FiInfo/>{' '}
                    <small>
                        The Vanguard campaign is optional. If you&apos;d rather just play Kings of War you can skip
                        this section. <br/>
                        <em>Note</em>: This will mean you can roll at most three dice on the territory table per game.
                        You will lose out on the bonus die for winning the Vanguard game.
                    </small>
                </p>
                <div className="left-right-row">
                    <label>
                        <input type="checkbox"
                               checked={skipBoxChecked}
                               onChange={() => { toggleSkipBox(!skipBoxChecked)}}
                        />
                        I do not want to play in the Vanguard Campaign
                    </label>
                    <button className={`button info ${skipBoxChecked ? '' : 'disabled'} margin-bottom-0 small`}
                            onClick={handleSkip}
                            onKeyUp={handleSkip}
                    >
                        Skip
                    </button>
                </div>
            </div>
            : null
        }
        {
            notice && !noticeClosed
                ? <div className="callout warning">
                    <button className="close-button" aria-label="Close different warband notice"
                            type="button"
                            onClick={() => setNoticeClosed(true)}
                            onKeyUp={() => setNoticeClosed(true)}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p>{notice}</p>
                </div>
                : null
        }
        <div className={styles.warbandHeader}>
            <fieldset className="fieldset">
                <legend>Retinue</legend>
                <ModelBuilder
                    units={list.units.filter(u =>
                        u.types.includes("Command")
                        && ((!takenUnique.includes(u.name)) || u.name === warband.retinue.leader?.type))}
                    label={'Leader'}
                    onChange={handleRetinueChange('leader')}
                    value={warband.retinue.leader ?? null}
                />
            </fieldset>
            <fieldset className="fieldset">
                <legend>Unspent</legend>
                <div className="stat">{warband.unspent}</div>
            </fieldset>
        </div>
        <fieldset className="fieldset">
            <legend>Roster</legend>
            <AddModel units={list.units.filter(u => !takenUnique.includes(u.name))}
                      onSubmit={handleAddModel}/>

            {warband.roster.map((model, i) => {
                    const stats = list?.units.find(m => m.name === model.type)
                    return <div className={styles.modelContainer} key={i}>
                        <div className={styles.modelLabel}>{model.type}</div>
                        <div
                            className={styles.modelTypes}>{(stats?.types as string[]).concat(stats?.races ?? []).join(', ')}</div>
                        <div className={styles.modelCost}>{model.cost}pts</div>
                        <div className={styles.modelActions}>
                            <button className="button alert hollow"
                                    onClick={handleRemoveModel(i)}
                                    onKeyUp={handleRemoveModel(i)}
                            >
                                <FiTrash/>
                            </button>
                        </div>
                        {model.options.map(option =>
                            <div key={option} className={styles.modelOptions}>{option}</div>
                        )}
                    </div>;
                }
            )}

        </fieldset>
        <div className="split-row">
            <fieldset className="fieldset">
                <legend>Supply Caravan</legend>
                <label className="inline">
                    Add Item
                    <select value="" onChange={handleAddEquipment}>
                        <option>-- Pick Equipment --</option>
                        {Object.values(equipment)
                            .filter(i => i.rarity === "Common" ? commonEquipmentCount < 6 : warband.supplyCaravan.find(sc => sc.name === i.name) == undefined)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(
                                (item) =>
                                    <option key={item.name} value={item.name}>
                                        {item.name}{' '}
                                        [{item.type}, {item.rarity}]{' '}
                                        {item.cost} pts
                                    </option>
                            )
                        }
                    </select>
                </label>
                {warband.supplyCaravan
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item, i) =>
                        <div className={styles.equipmentRow} key={i}>
                            <div className={styles.equipmentLabel}>
                                {item.name}{' '}
                                <small>{item.type}, {item.rarity}</small>
                            </div>
                            <div className={styles.equipmentActions}>
                                <button className="button alert hollow"
                                        onClick={handleRemoveEquipment(i)}
                                        onKeyUp={handleRemoveEquipment(i)}
                                >
                                    <FiTrash/>
                                </button>
                            </div>
                        </div>
                    )}
            </fieldset>
            <fieldset className="fieldset">
                <legend>Requirements</legend>
                <WarbandRequirements requirements={requirements}/>
            </fieldset>
        </div>
    </>
}

interface PersonaliseWarhostProps {
    warhost: Warhost,
    onUpdate: (updates: WarhostUpdates) => void
}

function PersonaliseWarhost({warhost, onUpdate}: PersonaliseWarhostProps) {
    return <>
        <ImageUpload imageUrl={warhost.coverImageUrl ?? 'https://placehold.it/600x200'} onDrop={coverImageUrl => onUpdate({coverImageUrl})}/>
        <label className="inline">
            Name
            <SaveableInput type="text" value={warhost.name} onSave={(name) => onUpdate({name})}/>
        </label>
        <label className="inline">
            Description
            {window ?
                <RichTextbox value={warhost.description || ''}
                             onSave={(description) => onUpdate({description})}/>
                : null
            }
        </label>
    </>
}

export function WarhostForm({user}: ForceFormProps) {
    const {warhostData, isLoading, error, updateWarhost} = useWarhostData(user.warhost?.army?.list);

    if (isLoading) {
        return <p>Loading</p>
    }

    let elements = [];

    if (error || !warhostData) {
        elements.push(
            <div key="error" className="callout alert">
                <p><FiAlertTriangle/> {error?.message ?? 'Failed to load army data'}</p>
            </div>
        )
    }

    if (!user.warhost) {
        user.warhost = {name: ''};
    }

    if ((error && !error.renderPage) || !warhostData) {
        return null;
    } else if (!user.warhost?.army?.list) {
        elements.push(<ArmyChooser key="army-chooser" lists={warhostData.lists}
                                   onSelect={(army) => updateWarhost({"army.list": army})}/>)
    } else if (!user.warhost.army.complete) {
        elements.push(
            <TerritoryChooser
                key="territory-chooser"
                territories={user.warhost.army.territories}
                units={warhostData.army?.units}
                artefacts={warhostData.artefacts}
                onChange={(territories) => updateWarhost({"army.territories": territories})}
            />
        )

        const handleBack = (e: MouseEvent | KeyboardEvent) => {
            e.preventDefault();
            updateWarhost({
                "army.list": '',
                "army.territories": [],
            });
        }

        const canProgress =
            user.warhost.army.territories.length === 2
            && user.warhost.army.territories
                .flatMap(t => t.slots)
                .every(s => s.type != undefined && s.value != undefined);

        const handleNext = (e: MouseEvent | KeyboardEvent) => {
            e.preventDefault();
            if(canProgress) {
                updateWarhost({
                    "army.complete": true,
                });
            }
        }

        elements.push(
            <div key="submit-territories" className="left-right-row">
                <button className="button primary"
                        onClick={handleBack}
                        onKeyUp={handleBack}>
                    <FiChevronLeft/> Back
                </button>
                <button className={`button ${canProgress ? 'primary' : 'secondary disabled'}`}
                        onClick={handleNext}
                        onKeyUp={handleNext}>
                    <FiCheck/> Next
                </button>
            </div>
        )
    } else if (user.warhost.warband?.warbandComplete !== true && !user.warhost.skipVanguard) {
        if (user.warhost.warband?.list !== warhostData.army?.vanguardList) {
            user.warhost.warband = undefined
        }

        const warband = user.warhost.warband ?? {
            list: warhostData.army?.vanguardList ?? '',
            totalPoints: 200,
            unspent: 200,
            retinue: {
                leader: undefined
            },
            roster: [],
            supplyCaravan: [],
            warbandComplete: false,
        };

        warband.totalPoints = warband.totalPoints ?? 200

        const requirements: RequirementResult[] = warhostData.warband
            ? checkRequirements(warband, warhostData.warband)
            : [{message: 'No warband assigned', passed: false}];

        elements.push(
            <VanguardRosterBuilder key="vanguard-roster-builder"
                                   list={warhostData.warband}
                                   notice={warhostData.army?.vanguardNotice}
                                   warband={warband}
                                   equipment={warhostData.equipment}
                                   requirements={requirements}
                                   onUpdate={(warband, skip = false) => updateWarhost({
                                       "warband": warband,
                                       "skipVanguard": skip
                                   })}

            />
        )

        const handleBack = (e: MouseEvent | KeyboardEvent) => {
            e.preventDefault();
            updateWarhost({
                "army.complete": false,
            });
        }

        const canProgress = requirements.every(r => r.passed);

        const handleNext = (e: MouseEvent | KeyboardEvent) => {
            e.preventDefault();
            if (canProgress) {
                warband.warbandComplete = true
                updateWarhost({
                    "warband": warband,
                });
            }
        }

        elements.push(
            <div key="submit-vanguard" className="left-right-row">
                <button className="button primary"
                        onClick={handleBack}
                        onKeyUp={handleBack}>
                    <FiChevronLeft/> Back
                </button>
                <button className={`button ${canProgress ? 'primary' : 'secondary disabled'}`}
                        onClick={handleNext}
                        onKeyUp={handleNext}>
                    <FiCheck/> Next
                </button>
            </div>
        )
    } else {
        elements.push(<PersonaliseWarhost key="personalise-warhost" warhost={user.warhost} onUpdate={updateWarhost}/>)

        elements.push(
            <Fragment key={"kow-summary"}>
                <h2>Kings of War</h2>
            </Fragment>
        )


        const handleBack = (e: MouseEvent | KeyboardEvent) => {
            e.preventDefault();
            if (user.warhost?.warband) {
                user.warhost.warband.warbandComplete = false;
            }

            updateWarhost({
                "skipVanguard": false,
                "warband": user.warhost?.warband
            });
        }

        elements.push(
            <div key="submit-vanguard" className="left-right-row">
                <button className="button primary"
                        onClick={handleBack}
                        onKeyUp={handleBack}>
                    <FiChevronLeft/> Back
                </button>
            </div>
        )
    }


    return <>
        {elements}
    </>
}
