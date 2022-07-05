import {NextPage} from "next";
import Link from "next/link";
import styles from '../styles/SplashPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";

const Error500: NextPage = () => {
    return <>
        <DefaultHead title="Error"/>

        <div className={styles.content}>
            <h1><small>500</small> Something went wrong</h1>
            <p>
                Sorry there was an unexpected error processing your request. Please try again. If this keeps happening
                you
                can email <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a> for support.
            </p>
            <Link href={"/"}>
                <a>Return to Conquest of Hell&apos;s Claw Home</a>
            </Link>
        </div>
    </>
}

export default Error500
