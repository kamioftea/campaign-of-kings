import {ReactElement, ReactNode, useState} from "react";
import styles from '../styles/Tabs.module.scss';

export interface TabProps {
    id: string,
    label: string,
    children: ReactNode
}

export function Tab(props: TabProps) {
    return <>{props.children}</>
}

export interface TabsProps {
    children: (ReactElement<TabProps> | null)[]
}

export function Tabs({children}: TabsProps) {
    const filtered = children.filter(c => c != null) as ReactElement<TabProps>[]
    const [selected, setSelected] = useState<string>([...filtered][0]?.props.id ?? '')

    if(filtered.length === 0) {
        return null;
    }

    if(filtered.length === 1) {
        return <>{filtered[0]}</>
    }

    return <>
        <div className={styles.tabsContainer}>
            {filtered.map(c =>
                <div key={c.props.id}
                     className={`${styles.tabSelector} ${c.props.id === selected ? styles.selected : ''}`}
                     onClick={() => setSelected(c.props.id)}
                     tabIndex={0}
                >
                    {c.props.label}
                </div>
            )}
        </div>
        {filtered.find(c => c.props.id === selected)}
    </>
}
