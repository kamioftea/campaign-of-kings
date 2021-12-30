import {UserDocument} from "../model/UserDocument";
import {useWarhostData} from "../hooks/useWarhostData";
import {Alignment, ListSummary} from "../model/WarhostData";
import styles from '../styles/WarhostForm.module.scss';
import {FiAlertTriangle} from "react-icons/fi";
import {KeyboardEvent, MouseEvent, useState} from "react";

type ForceFormProps = { user: UserDocument };

function ArmyChooser({lists}: { lists: ListSummary[] }) {
    const [alignment, setAlignment] = useState<Alignment | undefined>(undefined);

    const clickHandler = (alignment: Alignment) => (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAlignment(alignment)
    }

    const asButton = (summary: ListSummary) =>
        <button className="button dark hollow" key={summary.army_list}>
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
        <h2>Where does your allegiance lie?</h2>
        <div className={styles.alignmentContainer}>
            {(['Good', 'Neutral', 'Evil'] as Alignment[]).map((a: Alignment) =>
                <button className={`button dark ${a == alignment ? '' : 'hollow'}`}
                        onClick={clickHandler(a)}
                        onKeyPress={clickHandler(a)}>
                    <span>{a}</span>
                </button>
            )}
        </div>
        {alignment
            ? <>
                <h2>Pick Your Faction</h2>
                {byAlignment(alignment)}
            </>
            : null
        }
    </>;
}

export function WarhostForm({user}: ForceFormProps) {
    const {warhostData, isLoading, error} = useWarhostData(user.warhost?.army?.list);

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

    if (!user.warhost || user.warhost.army == null) {
        elements.push(<ArmyChooser key="army-chooser" lists={warhostData.lists}/>)
    }

    return <>
        {elements}
    </>
}
