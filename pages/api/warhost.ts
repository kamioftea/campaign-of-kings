import {BadRequest, getLoginSession, UserError} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {Role} from "../../model/UserDocument";
import {army_lists, warband_lists, warhost_lists} from "../../model/WarhostData";
import {validUpdateKeys, Warhost, WarhostUpdates} from "../../model/Warhost";
import {userResponse} from "../../model/User";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getWarhostData(req, res);

        case 'PUT':
            return updateWarhost(req, res);

        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getWarhostData(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getLoginSession(req, Role.PLAYER)
        const army = req.query.army_list as string;

        const lists = await warhost_lists;
        const army_list = army ? (await army_lists)[army] : undefined;
        let warbandData = await warband_lists;
        const warband_list = army_list?.vanguardList ? warbandData[army_list.vanguardList] : undefined;

        res.status(200).json({
            lists,
            army_list,
            warband_list
        })
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}

function deepSet(obj: {[keys: string]: any} | undefined, path: string | string[], value: any): {[keys: string]: any} {
    if(!Array.isArray(path)) {
        return deepSet(obj, path.split('.'), value)
    }

    const [key, ...rest] = path;
    obj = obj ?? {};

    if(rest.length === 0) {
        obj[key] = value;

        return obj;
    }
    else
    {
        obj[key] = deepSet(obj[key], rest, value);
        return obj;
    }
}

async function updateWarhost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {user} = await getLoginSession(req, Role.PLAYER)
        const updates = req.body as WarhostUpdates;
        const validators = await validUpdateKeys();
        user.warhost = user.warhost || {name: ''};
        Object.entries(updates).forEach(
            ([key, value]) => {
                if(!validators[key]) {
                    throw new BadRequest(`No validator for ${key}.`);
                }
                value = validators[key].cast(value);
                deepSet(user.warhost as Warhost, key, value);
            }
        );

        await user.save();

        res.status(200).json(userResponse(user))
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
