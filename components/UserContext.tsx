import {createContext, ReactNode, useState} from "react";
import {UserDocument} from "../model/User";

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
}

export const UserContext = createContext<UserState>({
    loadingState: UserLoadingState.UNKNOWN,
    setUser: () => {},
    setLoadingState: () => {}
})

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<UserDocument | undefined>();
    const [loadingState, setLoadingState] = useState<UserLoadingState>(UserLoadingState.UNKNOWN);

    return <UserContext.Provider value={{user, setUser, loadingState, setLoadingState}}>
        {children}
    </UserContext.Provider>
}
