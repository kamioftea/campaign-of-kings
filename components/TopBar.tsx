import styles from "../styles/TopBar.module.scss"
import Link from "next/link"
import {useUser} from "../hooks/use-user";
import {UserLoadingState} from "./UserContext";
import {buttonTrigger, DropdownHeader, DropdownMenu} from "./Dropdown";
import {Role} from "../model/UserDocument";
import {ReactNode} from "react";

export function TopBar() {
    return <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
            <Link href="/">
                <a className="h2">The Conquest of Hell's Claw</a>
            </Link>
            <Link href="/about">
                <a>About</a>
            </Link>

            <Link href="/chronicle">
                <a>Chronicle</a>
            </Link>

            <Link href="/forces">
                <a>War Hosts</a>
            </Link>
        </div>
        <div className={styles.topBarRight}>
            <UserDropdown/>
        </div>
    </div>;
}

const UserDropdown = () => {
    const {user, loadingState, handleSignOut} = useUser();

    if (loadingState != UserLoadingState.LOADED) {
        return <button className="hollow button secondary disabled">Loading...</button>
    }

    if (!user) {
        return (
            <>
                <Link href="/sign-up">
                    <a className="button primary">Sign Up</a>
                </Link>
                <Link href="/sign-in">
                    <a className="button secondary">Sign In</a>
                </Link>
            </>
        )
    }

    const menuItems: { [keys: string]: ReactNode } = {
        profile: <Link href={'/profile'}><a>User Profile</a></Link>,
        force: <Link href={'/warhost'}><a>Manage Your Warhost</a></Link>,
        divider: <hr/>,
        signOut: <a href="#" onClick={(e) => {
            e.preventDefault();
            handleSignOut()
        }}>Sign Out</a>,
    }

    if (user.roles.includes(Role.ADMIN)) {
        menuItems.adminDivider = <DropdownHeader label="Admin" />;
        menuItems.adminUsers = <Link href={'/admin/users'}><a>User Admin</a></Link>;
        menuItems.adminChronicles = <Link href={'/admin/chronicle'}><a>Chronicle Admin</a></Link>;
    }

    return <DropdownMenu
        trigger_content={buttonTrigger({label: user.name})}
        align="right"
        options={menuItems}
    />

}
