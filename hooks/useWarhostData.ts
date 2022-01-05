import {useCallback, useEffect, useState} from "react";
import {WarhostData} from "../model/WarhostData";
import {WarhostUpdates} from "../model/Warhost";
import {useUser} from "./use-user";

export interface ErrorMessage {
    message: string,
    renderPage: boolean,
}

export function useWarhostData(army_list: string | undefined) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [warhostData, setWarhostData] = useState<WarhostData | null>(null);
    const [error, setError] = useState<ErrorMessage | null>(null);
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
            .then(async res => {
                if (res.status == 200) setUser(await res.json());
                else if (res.status == 400) setError({message: await res.text(), renderPage: true});
                else throw new Error()
            })
            .catch(() => {
                setError({message: 'Failed to send the request to the server, please try again', renderPage: false});
            })
    }, [])

    return {
        warhostData,
        isLoading,
        error,
        updateWarhost
    }
}
