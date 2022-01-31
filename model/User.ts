import mongoose, {Schema} from "mongoose";
import {UserDocument} from "./UserDocument";
import {warhostSchema, WarhostSummary} from "./Warhost";
import {mongooseConnect} from "../lib/mongoose-connect";

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

export function toWarhostSummary(user: UserDocument) {
    const {warhost} = user;
    if (!warhost || !warhost.army) return null;

    return {
        name: warhost.name,
        coverImageUrl: warhost.coverImageUrl,
        user_id: user._id,
        user_name: user.name,
        army: warhost.army.list
    };
}

export async function listWarhostSummaries() {
    await mongooseConnect;

    const users = await User.find({"warhost.slug": {$exists: 1}})
    const summaries: { [key: string]: WarhostSummary } = Object.fromEntries(
        users.flatMap(user => {
            const summary = toWarhostSummary(user);
            if (!user.warhost?.slug || !summary) return [];

            return [[
                user.warhost.slug,
                summary
            ]];
        })
    )

    return summaries
}

export async function warhostFromSummary(slug: string) {
    await mongooseConnect;

    const user = await User.findOne({"warhost.slug": slug})
    if (!user) {
        return null
    }

    return {warhost: user.warhost, summary: toWarhostSummary(user)}
}

