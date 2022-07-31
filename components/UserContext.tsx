import {createContext, ReactNode, useState} from "react";
import {UserDocument} from "../model/UserDocument";

export enum UserLoadingState {
    UNKNOWN,
    LOADING,
    LOADED
}

export interface UserState {
    user?: UserDocument
    setUser: (user: UserDocument | undefined) => void
    loadingState: UserLoadingState
    setLoadingState: (state: UserLoadingState) => void
    previousRoute?: string,
    setPreviousRoute: (url?: string) => void,
}

export const UserContext = createContext<UserState>({
    loadingState: UserLoadingState.UNKNOWN,
    setUser: () => {},
    setLoadingState: () => {},
    setPreviousRoute: () => {}
})

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<UserDocument | undefined>();
    const [loadingState, setLoadingState] = useState<UserLoadingState>(UserLoadingState.UNKNOWN);
    const [previousRoute, setPreviousRoute] = useState<string | undefined>();

    return <UserContext.Provider value={{user, setUser, loadingState, setLoadingState, previousRoute, setPreviousRoute}}>
        {children}
    </UserContext.Provider>
}
