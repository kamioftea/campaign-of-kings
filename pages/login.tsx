import {NextPage} from "next";
import styles from '../styles/SplashPage.module.scss'

const Login: NextPage = () => {
    return  <div className={styles.content}>
        <h1>Log In</h1>
        <form>
            <label>
                Email
                <input type="text"/>
            </label>
            <label>
                Password
                <input type="password"/>
            </label>
            <button className="button primary">Log In</button>
        </form>
    </div>
}

export default Login
