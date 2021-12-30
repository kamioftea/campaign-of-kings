import {useAuthorised} from "./use-user";
import {Role} from "../model/UserDocument";
import {useEffect, useState} from "react";
import {ChronicleDocument} from "../model/ChronicleDocument";

export function useAdminUsers() {
    const user = useAuthorised(Role.ADMIN);
    const [isLoading, setIsLoading] = useState<boolean>(user == null);
    const [chronicles, setChronicles] = useState<ChronicleDocument[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/admin/chronicle', {method: 'GET'})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then(json => setChronicles(json))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [])

    return {
        user,
        isLoading,
        error,
        chronicles
    }
}
