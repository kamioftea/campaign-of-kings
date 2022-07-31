import {useCallback, useContext, useEffect} from "react";
import {UserContext, UserLoadingState} from "../components/UserContext";
import {Role} from "../model/UserDocument";
import {useRouter} from "next/router";

const authUrls = [
    '/sign-in',
    '/sign-up',
    '/sign-out',
    '/unauthorised',
    '/forgotten-password',
    '/reset-password',
];

export const useUser = () => {
    const {user, setUser, loadingState, setLoadingState, previousRoute, setPreviousRoute} = useContext(UserContext);
    const router = useRouter();

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

    useEffect(() => {
        if(!authUrls.includes(router.route)) {
            setPreviousRoute(router.route)
        }
    }, [router.route])

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
        previousRoute,
        setPreviousRoute
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

    return  loadingState === UserLoadingState.LOADED && user?.roles?.includes(role) ? user : null;
}
