import {UserDocument} from "../model/UserDocument";
import {useWarhostData} from "../hooks/useWarhostData";
import {Alignment, Artefact, ListSummary, UnitBreakdown, UnitCategory} from "../model/WarhostData";
import styles from '../styles/WarhostForm.module.scss';
import {FiAlertTriangle, FiCheck, FiChevronLeft} from "react-icons/fi";
import {ChangeEvent, KeyboardEvent, MouseEvent, useState} from "react";
import {SlotType, Territory, TerritorySlot, TerritoryType} from "../model/Warhost";

type ForceFormProps = { user: UserDocument };

const alignmentCopy: {[a in Alignment]: string} = {
    "Good": "With its isolation, Hell's Claw has always been a retreat for the most powerful evils in the world. A" +
        " crusade to purge this place has been a long time coming. Maybe you also have more personal reasons, a" +
        " quest for a stolen relic of the Shining Ones, or to serve justice on a fiend that has fled here.",
    "Neutral": "With so much interest in Hell's Claw, there is a lot of money to be made as a sell-sword here. For" +
        " the more adventurous, if the rumours are true, there will be plenty of opportunities to loot long lost" +
        " hordes. ",
    "Evil": "With its isolation, Hell's Claw has always been a retreat for the most powerful evils in the world." +
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
                onKeyPress={factionClickHandler(summary.army_list)}
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
                    The journey to Hell's Claw will be long and treacherous. Most will brave the storms and monsters
                    of the open ocean, but there are other ways. Maybe you have an experimental airship, or can open a
                    portal and quest through the horrors of the Ethereal Plane. One thing however is certain, there is
                    something there you think is worth the cost.
                </p>
                <h2>Where does your allegiance lie?</h2>
            <div className={styles.alignmentContainer}>
                {(['Good', 'Neutral', 'Evil'] as Alignment[]).map((a: Alignment) =>
                    <button className={`button dark ${a == alignment ? '' : 'hollow'}`}
                            onClick={alignmentClickHandler(a)}
                            onKeyPress={alignmentClickHandler(a)}>
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
                        onKeyPress={alignmentClickHandler(null)}>
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
            territory.slots[index].value = event.currentTarget.value;
            console.log(territory.slots)
            console.log( event.currentTarget.value)
            onChange(territory);
        }

        territory.slots.forEach((slot, i) =>
            options.push(
                <label key={i} className="inline">
                    {slot.type}
                    <select value={slot.value} onChange={updateSlot(i)}>
                        <option value={undefined}>-- Choose {
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
            {territory.type && territory.type !== 'Base Camp' ? <a href="#" onClick={onClear} onKeyPress={onClear}>Change</a> : null}
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
            After surviving the dangers of your journey you finally reach on Hell's Claw. Those who came by sea have to
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
        return;
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
            <div key="submit-territories" className="submit-row">
                <button className="button primary"
                        onClick={handleBack}
                        onKeyPress={handleBack}>
                    <FiChevronLeft/> Back
                </button>
                <button className={`button ${canProgress ? 'primary' : 'secondary disabled'}`}
                        onClick={handleNext}
                        onKeyPress={handleNext}>
                    <FiCheck/> Next
                </button>
            </div>
        )
    }
    else {
        elements.push(<p>TODO: Vanguard</p>)
    }

    return <>
        {elements}
    </>
}
