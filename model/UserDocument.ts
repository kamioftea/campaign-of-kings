import {Document} from "mongoose";

export enum Role {
    ADMIN = "Admin",
    PLAYER = "Player",
}

export const roles = () => {
    const roles: Role[] = [];
    for (const key in Role) {
        roles.push(Role[key as keyof typeof Role])
    }
    return roles;
}

export type UserDocument = Document & {
    name: string;
    email: string;
    password: string;
    roles: Role[];
};
