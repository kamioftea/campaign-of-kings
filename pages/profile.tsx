import type {NextPage} from 'next'
import styles from '../styles/StandardPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";
import {useUser} from "../hooks/use-user";
import {UserLoadingState} from "../components/UserContext";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {ProfileForm} from "../components/ProfileForm";

const Profile: NextPage = () => {
    const {user, loadingState} = useUser();
    const router = useRouter();

    useEffect(() => {
        if(loadingState === UserLoadingState.LOADED && !user) {
            // noinspection JSIgnoredPromiseFromCall
            router.push('/sign-in')
        }
    }, [user, loadingState]);

    return (
        <>
            <DefaultHead title="Profile"/>

            <main className={`${styles.content}`}>
                <h1>Profile</h1>
                <ProfileForm />
            </main>
        </>
    )
}

export default Profile
