import {NextPage} from "next";
import Link from "next/link";
import styles from '../styles/SplashPage.module.scss'

const Error404: NextPage = () => {
    return  <div className={styles.content}>
        <h1><small>404</small> Not Found</h1>
        <p>Sorry this page does not exist</p>
        <Link href={"/"}>
            <a>Return to Conquest of Hell's Claw Home</a>
        </Link>
    </div>
}

export default Error404
