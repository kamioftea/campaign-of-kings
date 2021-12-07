import styles from "../styles/TopBar.module.scss"
import Link from "next/link"

export function TopBar() {
    return <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
            <Link href="/">
                <a className="h2">The Conquest of Hell's Claw</a>
            </Link>
            <Link href="/about">
                <a>About</a>
            </Link>

            <Link href="/background">
                <a>Chronicle</a>
            </Link>

            <Link href="/forces">
                <a>Forces</a>
            </Link>
        </div>
        <div className={styles.topBarRight}>
            <Link href="/sign-up">
                <a className="button primary">Sign Up</a>
            </Link>
            <Link href="/sign-in">
                <a className="button secondary">Sign In</a>
            </Link>
        </div>
    </div>;
}
