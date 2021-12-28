import {useCallback, useContext, useEffect} from "react";
import {UserContext, UserLoadingState} from "../components/UserContext";
import {Role} from "../model/UserDocument";
import {useRouter} from "next/router";

export const useUser = () => {
    const {user, setUser, loadingState, setLoadingState} = useContext(UserContext);

    useEffect(
        () => {
            if (loadingState === UserLoadingState.UNKNOWN) {
                setLoadingState(UserLoadingState.LOADING)
                fetch('/api/user', {method: 'GET'})
                    .then(res => res.status === 200 ? res.json() : undefined)
                    .then(setUser)
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

export function useAuthorised(role: Role) {
    const {user, loadingState} = useUser();
    const router = useRouter();

    useEffect(() => {
        if(loadingState !== UserLoadingState.LOADED) {
            return;
        }

        if(!user) {
            // noinspection JSIgnoredPromiseFromCall
            router.push('/sign-in');
            return;
        }

        if(!user.roles.includes(role)) {
            // noinspection JSIgnoredPromiseFromCall
            router.push('/unauthorised');
        }
    }, [user, loadingState]);

    return user?.roles?.includes(role) ? user : null;
}
