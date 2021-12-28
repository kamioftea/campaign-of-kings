import mongoose, {Schema } from "mongoose";
import {UserDocument} from "./UserDocument";

const userSchema = new Schema<UserDocument>({
    name: String,
    email: String,
    password: String,
    roles: [String],
});

export const User = mongoose.model<UserDocument>("User", userSchema);

export function userResponse(user: UserDocument) {
    return {...user.toJSON(), password: ''}
}
