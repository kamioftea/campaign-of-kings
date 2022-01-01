import {useCallback, useEffect, useState} from "react";
import {WarhostData} from "../model/WarhostData";
import {WarhostUpdates} from "../model/Warhost";
import {useUser} from "./use-user";
import {UserDocument} from "../model/UserDocument";

export function useWarhostData(army_list: string | undefined) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [warhostData, setWarhostData] = useState<WarhostData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {setUser} = useUser();

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/warhost${army_list ? `?army_list=${army_list}` : ''}`, {method: 'GET'})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then(json => setWarhostData(json))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [army_list])

    const updateWarhost = useCallback((data: WarhostUpdates) => {
        fetch(
            `/api/warhost`,
            {
                method: 'PUT',
                'headers': {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }
            )
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then((json: UserDocument) => setUser(json))
            .catch(err => setError(err.message))
    }, [])

    return {
        warhostData,
        isLoading,
        error,
        updateWarhost
    }
}
