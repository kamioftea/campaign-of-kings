import mongoose, {Schema, Document } from "mongoose";

export enum Role {
    ADMIN,
    PLAYER
}

export type UserDocument = Document & {
    name: string;
    email: string;
    password: string;
    roles: Role[];
    resetKeys: [String];
};

const userSchema = new Schema<UserDocument>({
    name: String,
    email: String,
    password: String,
    roles: [String],
    resetKeys: [String]
});

export const User = mongoose.model<UserDocument>("User", userSchema);

export function userResponse(user: UserDocument) {
    return {
        user: {...user.toJSON(), password: ''}
    }
}
