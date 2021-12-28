import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../../styles/Admin.module.scss'
import {UserTable} from "../../components/admin/UserTable";

const Users: NextPage = () => {
    return (
        <>
            <Head>
                <title>Users | Admin | The Conquest of Hell's Claw</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={`${styles.content}`}>
                <h1>Users</h1>
                <UserTable />
            </main>
        </>
    )
}

export default Users;
