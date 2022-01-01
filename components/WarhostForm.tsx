import {UserDocument} from "../model/UserDocument";
import {useWarhostData} from "../hooks/useWarhostData";
import {Alignment, ListSummary} from "../model/WarhostData";
import styles from '../styles/WarhostForm.module.scss';
import {FiAlertTriangle, FiChevronLeft} from "react-icons/fi";
import {KeyboardEvent, MouseEvent, useState} from "react";

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
                    The journey to Hell's Claw has been long and treacherous. Most braved the storms and monsters
                    of the open ocean, but there are other ways. Maybe you have an experimental airship, or opened a
                    portal and fought through the horrors of the Ethereal Plane. One thing however is certain, there is
                    something here you think is worth the cost.
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
                    <FiChevronLeft /> Back
                </button>
            </>
        }
    </>;
}

export function WarhostForm({user}: ForceFormProps) {
    const {warhostData, isLoading, error, updateWarhost} = useWarhostData(user.warhost?.army?.list);

    if (isLoading) {
        return <p>Loading</p>
    }

    if (error || !warhostData) {
        return <div className="callout alert">
            <FiAlertTriangle/>
            <p>{error ?? 'Failed to load army data'}</p>
        </div>
    }

    let elements = [];
    if (!user.warhost) {
        user.warhost = {name: ''};
    }

    if (!user.warhost?.army?.list) {
        elements.push(<ArmyChooser key="army-chooser" lists={warhostData.lists} onSelect={(army) => updateWarhost({"army.list": army})}/>)
    }
    else {
        elements.push(<p>TODO</p>)
    }


    return <>
        {elements}
    </>
}
