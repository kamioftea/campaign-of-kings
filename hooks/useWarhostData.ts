import {useEffect, useState} from "react";
import {WarhostData} from "../model/WarhostData";

export function useWarhostData(army_list: string | undefined) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [warhostData, setWarhostData] = useState<WarhostData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/warhost${army_list ? `?army_list=${army_list}` : ''}`, {method: 'GET'})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then(json => setWarhostData(json))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [army_list])

    return {
        warhostData,
        isLoading,
        error,
    }
}
