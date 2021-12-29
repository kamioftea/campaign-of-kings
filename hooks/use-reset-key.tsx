import {UserDocument} from "../model/UserDocument";
import {useCallback, useEffect, useState} from "react";
import {useUser} from "./use-user";
import {useRouter} from "next/router";
import {UserLoadingState} from "../components/UserContext";

export function useResetKey() {
    const router = useRouter();
    let key = router.query.key;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserDocument | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {user: loggedInUser, setUser: setLoggedInUser, loadingState} = useUser()

    useEffect(() => {
        if(loadingState === UserLoadingState.LOADED && loggedInUser) {
            // noinspection JSIgnoredPromiseFromCall
            router.push('/');
        }
    }, [loggedInUser, loadingState])

    useEffect(() => {
        setIsLoading(true);
        if(!key || typeof key !== 'string') {
            setError('Failed to load reset key from URL')
            return
        }
        else {
            setError(null)
        }
        fetch(`/api/reset-password?key=${key}`, {method: 'GET'})
            .then(async res => { if (res.status == 200) {return res.json();} else { throw new Error(await res.text());} })
            .then((json: UserDocument) => setUser(json))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [])

    const resetPassword = useCallback((password: string) => {
        return fetch(
            `/api/reset-password`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({key, password}),
            })
            .then(res => { if (res.status == 200) {return res.json();} else { throw new Error;} })
            .then((json: UserDocument) => {
                setLoggedInUser(json);
                return router.push('/')
            })
            .catch(err => setError(err.message))
    }, [key])

    return {
        user,
        isLoading: isLoading || loadingState !== UserLoadingState.LOADED || loggedInUser != null,
        error,
        resetPassword
    }
}
