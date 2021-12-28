import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'
import {SignInForm} from "../components/SignInForm";
import Link from "next/link";
import {DefaultHead} from "../components/DefaultHead";

const SignIn: NextPage = () => {
    return <>
        <DefaultHead title="Sign In"/>

        <div className={styles.content}>
            <h1>Sign In</h1>
            <SignInForm/>
            <p><Link href="/forgotten-password"><a>I've forgotten my password.</a></Link></p>
            <p><Link href="/sign-up"><a>I don't have an account.</a></Link></p>
        </div>
    </>
}

export default SignIn
