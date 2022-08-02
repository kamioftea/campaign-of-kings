import type {NextPage} from 'next'
import styles from '../../../styles/Admin.module.scss'
import {DefaultHead} from "../../../components/DefaultHead";
import {ChronicleTable} from "../../../components/admin/ChronicleTable";

const Chronicles: NextPage = () => {
    return (
        <>
            <DefaultHead title="Chronicles | Admin"/>

            <main className={`${styles.content}`}>
                <h1>Chronicles</h1>
                <ChronicleTable />
            </main>
        </>
    )
}

export default Chronicles;
