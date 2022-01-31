import type {NextPage} from 'next'
import pageStyles from '../../styles/StandardPage.module.scss'
import {DefaultHead} from "../../components/DefaultHead";
import useWarhosts from "../../hooks/use-warhosts";
import {FiAlertTriangle} from "react-icons/fi";
import {WarhostBanner} from "../../components/WarhostBanner";

const Warhosts: NextPage = () => {
    const {isLoading, warhosts, error} = useWarhosts()

    return (
        <>
            <DefaultHead title="Warhosts"/>
            <main className={`${pageStyles.content}`}>
                <h1>Warhosts</h1>
                {error
                    ? <div key="error" className="callout alert">
                        <p><FiAlertTriangle/> {error}</p>
                    </div>
                    : null
                }
                {
                    isLoading
                        ? <p>Loading ...</p>
                        : Object.entries(warhosts).map(([slug, warhost]) =>
                            <WarhostBanner key={slug} slug={slug} warhost={warhost} />
                        )
                }
            </main>
        </>
    )
}

export default Warhosts;
