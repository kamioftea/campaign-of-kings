import {UserDocument} from "../model/UserDocument";
import {useWarhostData} from "../hooks/use-warhost-data";
import {
    Alignment,
    Artefact,
    ListSummary,
    UnitBreakdown,
    UnitCategory,
    WarbandData
} from "../model/WarhostData";
import styles from '../styles/WarhostForm.module.scss';
import {FiAlertTriangle, FiCheck, FiChevronLeft} from "react-icons/fi";
import {ChangeEvent, Fragment, KeyboardEvent, MouseEvent, useState} from "react";
import {
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

type ForceFormProps = { user: UserDocument };

const alignmentCopy: { [a in Alignment]: string } = {
    "Good": "Whatever is causing Mists to flow from the Twilight Glades it is powerful and dangerous. Are you here to " +
        "defend Pannithor from this threat? Is this more personal? Are you on a crusade against the Twilight Kin or" +
        " the Nightstalkers?",
    "Neutral": "With so much interest in the Mists and the Twilight Glades, there is a lot of money to be made as a" +
        " sell-sword here. Or maybe you're here for personal gain? Do the mists hide treasure? Powerful artefacts?" +
        " Arcane secrets? ",
    "Evil": "Whatever is causing Mists to flow from the Twilight Glades it is powerful and dangerous. Will this power" +
        " be a boon to your nefarious plans? Perhaps you seek something more specific, a necromantic tome long lost," +
        " or vengeance against an old rival?"
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
            <img className={styles.armyIcon}
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
                    For better or for worse you have come to lead a warhost into the swirling mists roiling out of the
                    Twilight Glades.
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
            Your troops and resources gathered you pack up your baggage train one last time and set forth into the
            Mists. The Mist swirls and twists around you. Are there things out there or is it just tricks of the
            Shadows? Occasionally clearings open for a fleeting moment before you are swallowed once more.
        </p>
        <h2>Stake Your Claim</h2>
        <p>
            After many hours, as despair grips your host you suddenly break free. Cresting a hill you see the mists fall
            away below you, an endless white sea. You order your followers to make camp. The next day you send out
            scouting parties, and start to find what order you can in this chaotic place.
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
                "army.complete": false,
            });
        }

        elements.push(
            <div key="back-to-warhost" className="left-right-row">
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
