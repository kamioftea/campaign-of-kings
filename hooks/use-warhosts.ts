import {useEffect, useState} from "react";
import {WarhostSummary} from "../model/Warhost";

export default function useWarhosts() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [warhosts, setWarhosts] = useState<{[key: string]: WarhostSummary}>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(Object.keys(warhosts).length == 0) {
            setIsLoading(true);
            fetch(`/api/warhosts`, {method: 'GET'})
                .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
                .then(json => setWarhosts({...warhosts, ...json}))
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false))
        }
    }, [])

    return {isLoading, warhosts, error}
}
