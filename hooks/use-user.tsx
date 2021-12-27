import {useCallback, useContext, useEffect} from "react";
import {UserContext, UserLoadingState} from "../components/UserContext";
import {UserDocument} from "../model/User";

export const useUser = () => {
    const {user, setUser, loadingState, setLoadingState} = useContext(UserContext);

    useEffect(
        () => {
            if (loadingState === UserLoadingState.UNKNOWN) {
                setLoadingState(UserLoadingState.LOADING)
                fetch('/api/user', {method: 'GET'})
                    .then(res => res.status === 200 ? res.json() : undefined)
                    .then((json: { user: UserDocument } | undefined) => setUser(json?.user))
                    .catch(() => setUser(undefined))
                    .finally(() => setLoadingState(UserLoadingState.LOADED))
            }
        },
        [user, loadingState]
    )

    const handleSignOut = useCallback(() => {
        setLoadingState(UserLoadingState.LOADING)
        fetch('/api/sign-out', {method: 'POST'})
            .finally(() => {
                setUser(undefined);
                setLoadingState(UserLoadingState.UNKNOWN);
            })

    }, [])

    return {
        user,
        setUser,
        loadingState,
        setLoadingState,
        handleSignOut,
    }
}
