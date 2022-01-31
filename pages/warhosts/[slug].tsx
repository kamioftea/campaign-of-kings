import {NextPage} from "next";
import useWarhost from "../../hooks/use-warhost";
import {DefaultHead} from "../../components/DefaultHead";
import pageStyles from "../../styles/StandardPage.module.scss";
import {useRouter} from "next/router";
import {FiAlertTriangle} from "react-icons/fi";
import {WarhostBanner} from "../../components/WarhostBanner";
import ReactMarkdown from "react-markdown";
import {Tab, Tabs} from "../../components/Tabs";

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
                                ? <Tab id='background' label='Background'>
                                    {warhost.description
                                        ? <ReactMarkdown>{warhost.description}</ReactMarkdown>
                                        : null
                                    }
                                </Tab>
                                : null
                            }
                            <Tab id='kings-of-war' label="Kings Of War">
                                <h2>Kings of War</h2>
                            </Tab>
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
