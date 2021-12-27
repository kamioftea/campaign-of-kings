import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'
import Link from "next/link";
import {ForgottenPasswordForm} from "../components/ForgottenPasswordForm";

const ForgottenPassword: NextPage = () => {
    return <div className={styles.content}>
        <ForgottenPasswordForm/>
        <p><Link href="/sign-in"><a>Back to sign in.</a></Link></p>
        <p><Link href="/sign-up"><a>I don't have an account.</a></Link></p>
    </div>
}

export default ForgottenPassword
