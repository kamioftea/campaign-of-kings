import {useEffect, useState} from "react";
import {Warhost, WarhostSummary} from "../model/Warhost";

export default function useWarhost(slug: string) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [warhost, setWarhost] = useState<Warhost | null>(null);
    const [summary, setSummary] = useState<WarhostSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/warhosts/${slug}`, {method: 'GET'})
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then(({warhost, summary}) => {
                setWarhost(warhost);
                setSummary(summary)
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))

    }, [slug])

    return {isLoading, warhost, summary, error}
}
