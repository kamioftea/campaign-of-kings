import {useAuthorised} from "./use-user";
import {Role, UserDocument} from "../model/UserDocument";
import {useCallback, useEffect, useState} from "react";

export function useAdminUsers() {
    const user = useAuthorised(Role.ADMIN);
    const [isLoading, setIsLoading] = useState<boolean>(user == null);
    const [users, setUsers] = useState<UserDocument[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/admin/user', {method: 'GET'})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then(json => setUsers(json))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [])

    let updateRole = useCallback((user: UserDocument, role: Role, setActive: boolean) => {
        const body = JSON.stringify({role, setActive});
        console.log(users)

        fetch(`/api/admin/user/${user._id}/role`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then((json: UserDocument) =>
                setUsers((users) => users.filter(u => u._id !== json._id).concat(json))
            )
            .catch(err => setError(err.message))
            .finally()
    }, []);

    return {
        user,
        isLoading,
        error,
        users,
        updateRole
    }
}
