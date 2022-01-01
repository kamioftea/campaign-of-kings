import type {NextPage} from 'next'
import styles from '../../styles/StandardPage.module.scss'
import {DefaultHead} from "../../components/DefaultHead";
import {useAuthorised} from "../../hooks/use-user";
import {Role} from "../../model/UserDocument";
import {ReactNode} from "react";
import {WarhostForm} from "../../components/WarhostForm";

const WarhostPage: NextPage = () => {
    const user = useAuthorised(Role.PLAYER);
    let content: ReactNode;

    if(!user) {
        content = <p>Loading ...</p>
    }
    else {
        content = <WarhostForm user={user} />
    }

    return (
        <>
            <DefaultHead title="Warhost"/>

            <main className={`${styles.content}`}>
                <h1>Your Warhost</h1>
                {content}
            </main>
        </>
    )
}

export default WarhostPage;
