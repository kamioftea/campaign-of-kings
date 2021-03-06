import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'
import Link from "next/link";
import {ForgottenPasswordForm} from "../components/ForgottenPasswordForm";
import {DefaultHead} from "../components/DefaultHead";

const ForgottenPassword: NextPage = () => {
    return <>
        <DefaultHead title="Forgotten Password"/>

        <div className={styles.content}>
            <ForgottenPasswordForm/>
            <p><Link href="/sign-in"><a>Back to sign in.</a></Link></p>
            <p><Link href="/sign-up"><a>I don&apos;t have an account.</a></Link></p>
        </div>
    </>
}

export default ForgottenPassword
