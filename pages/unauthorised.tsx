import {NextPage} from "next";
import Link from "next/link";
import styles from '../styles/SplashPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";

const Error403: NextPage = () => {
    return <>
        <DefaultHead title="Unauthorised"/>

        <div className={styles.content}>
            <h1><small>403</small> Unauthorised</h1>
            <p className="lead">You do not have permission to access this page.</p>
            <p>
                If you have recently setup your account, it may be that your permissions have not been setup. Please
                wait up to a day for this to be done.
            </p>
            <p>
                If it has been longer that a day, please email
                <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a> for assistance.
            </p>
            <Link href={"/"}>
                <a>Return to Conquest of Hell's Claw Home</a>
            </Link>
        </div>
    </>
}

export default Error403
