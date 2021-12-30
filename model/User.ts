import mongoose, {Schema } from "mongoose";
import {UserDocument} from "./UserDocument";
import {warhostSchema} from "./Warhost";

const userSchema = new Schema<UserDocument>({
    name: String,
    email: String,
    password: String,
    roles: [String],
    warhost: warhostSchema,
});

export const User = mongoose.model<UserDocument>("User", userSchema);

export function userResponse(user: UserDocument) {
    return {...user.toJSON(), password: ''}
}
