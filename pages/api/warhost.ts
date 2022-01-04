import {BadRequest, getLoginSession, UserError} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {Role} from "../../model/UserDocument";
import {army_lists, artefacts, warband_lists, warhost_lists, WarhostData} from "../../model/WarhostData";
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
        const army_list = req.query.army_list as string;

        const lists = await warhost_lists;
        const army = army_list ? (await army_lists)[army_list] : undefined;
        let warbandData = await warband_lists;
        const warband = army?.vanguardList ? warbandData[army.vanguardList] : undefined;

        const data: WarhostData = {
            lists,
            army,
            warband,
            artefacts: await artefacts,
        }

        res.status(200).json(data);
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
                let validator = validators[key as keyof WarhostUpdates];
                if(!validator) {
                    throw new BadRequest(`No validator for ${key}.`);
                }
                value = validator.cast(value);
                deepSet(user.warhost as Warhost, key, value);
            }
        );

        await user.save();

        res.status(200).json(userResponse(user))
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
