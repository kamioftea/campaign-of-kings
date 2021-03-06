import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'
import {SignUpForm} from "../components/SignUpForm";
import Link from "next/link";
import {DefaultHead} from "../components/DefaultHead";

const SignIn: NextPage = () => {
    return <>
        <DefaultHead title="Sign In"/>

        <div className={styles.content}>
            <h1>Sign Up</h1>
            <SignUpForm/>
            <p><Link href="/sign-in"><a>I already have an account.</a></Link></p>
        </div>
    </>
}

export default SignIn
