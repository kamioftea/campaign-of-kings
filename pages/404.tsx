import {NextPage} from "next";
import Link from "next/link";
import styles from '../styles/SplashPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";

const Error404: NextPage = () => {
    return <>
        <DefaultHead title="Not Found"/>

        <div className={styles.content}>
            <h1><small>404</small> Not Found</h1>
            <p>Sorry this page does not exist</p>
            <Link href={"/"}>
                <a>Return to Conquest of Hell&apos;s Claw Home</a>
            </Link>
        </div>
    </>
}

export default Error404
