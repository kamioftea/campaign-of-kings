import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";
import {ResetPasswordForm} from "../components/ResetPasswordForm";

const ForgottenPassword: NextPage = () => {
    return <>
        <DefaultHead title="Reset Password"/>
        <div className={styles.content}>
            <h1>Reset Password</h1>
            <ResetPasswordForm/>
        </div>
    </>
}

export default ForgottenPassword
