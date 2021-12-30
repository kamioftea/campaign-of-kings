import type {NextPage} from 'next'
import styles from '../../styles/Admin.module.scss'
import {UserTable} from "../../components/admin/UserTable";
import {DefaultHead} from "../../components/DefaultHead";

const Users: NextPage = () => {
    return (
        <>
            <DefaultHead title="Users | Admin"/>

            <main className={`${styles.content}`}>
                <h1>Users</h1>
                <UserTable />
            </main>
        </>
    )
}

export default Users;
