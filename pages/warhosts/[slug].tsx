import {NextPage} from "next";
import useWarhost from "../../hooks/use-warhost";
import {DefaultHead} from "../../components/DefaultHead";
import pageStyles from "../../styles/StandardPage.module.scss";
import {useRouter} from "next/router";
import {FiAlertTriangle} from "react-icons/fi";
import {WarhostBanner} from "../../components/WarhostBanner";
import ReactMarkdown from "react-markdown";
import {Tab, Tabs} from "../../components/Tabs";
import {Army, TerritoryType} from '../../model/Warhost'
import styles from '../../styles/Warhosts.module.scss'
import {
    GiAncientRuins,
    GiForest,
    GiGoblinCamp,
    GiHillFort,
    GiHutsVillage,
    GiMountainCave,
    GiMountains
} from "react-icons/all";
import {cloneElement, ReactElement} from "react";

interface KingsOfWarProps {
    army: Army
}

const territoryIcons: { [T in TerritoryType]: ReactElement } = {
    'Base Camp': <GiHillFort/>,
    'Cave': <GiMountainCave/>,
    'Mountain': <GiMountains/>,
    'Forest': <GiForest/>,
    'Village': <GiHutsVillage/>,
    'Training Camp': <GiGoblinCamp/>,
    'Ancient Ruins': <GiAncientRuins/>
}

const KingsOfWar = ({army}: KingsOfWarProps) => {

    return <>
        <h2>Territories</h2>
        {army.territories.map((territory, index) =>
            <div key={territory.name ?? index} className={styles.territory}>
                {territory.type ? cloneElement(territoryIcons[territory.type], {size: '3em'}) : null}
                {territory.name || territory.type}
            </div>
        )}
    </>
}

const Warhost: NextPage = () => {
    const router = useRouter();

    const slug = router.query.slug as string;
    const {isLoading, warhost, summary, error} = useWarhost(slug)

    return (
        <>
            <DefaultHead title={`${warhost ? `${warhost.name} | ` : ''}Warhosts`}/>
            <main className={`${pageStyles.content}`}>
                {error
                    ? <div key="error" className="callout alert">
                        <p><FiAlertTriangle/> {error}</p>
                    </div>
                    : null
                }
                {isLoading || !warhost || !summary
                    ? <p>Loading</p>
                    : <>
                        <WarhostBanner warhost={summary}/>
                        <Tabs>
                            {warhost.description
                                ? <Tab id="background" label="Background">
                                    {warhost.description
                                        ? <ReactMarkdown>{warhost.description}</ReactMarkdown>
                                        : null
                                    }
                                </Tab>
                                : null
                            }
                            {warhost.army
                                ? <Tab id="kings-of-war" label="Kings Of War">
                                    <KingsOfWar army={warhost.army}/>
                                </Tab>
                                : null
                            }
                            {warhost.skipVanguard
                                ? null
                                : <Tab id={'vanguard'} label={'Vanguard'}>
                                    <h2>Vanguard</h2>
                                </Tab>
                            }
                        </Tabs>
                    </>
                }
            </main>
        </>
    )
}

export default Warhost;
