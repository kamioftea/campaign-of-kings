import type {NextPage} from 'next'
import styles from '../../../styles/Admin.module.scss'
import {DefaultHead} from "../../../components/DefaultHead";
import {useRouter} from "next/router";

const ChroniclePage: NextPage = () => {
    const router = useRouter();
    const slug = router.query.slug as string;

    return (
        <>
            <DefaultHead title="Chronicles | Admin"/>

            <main className={`${styles.content}`}>
                <h1>Chronicle {slug}</h1>
            </main>
        </>
    )
}

export default ChroniclePage;
