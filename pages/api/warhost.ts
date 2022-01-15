import {BadRequest, getLoginSession, UserError} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {Role} from "../../model/UserDocument";
import {
    eventual_army_lists,
    eventual_artefacts,
    eventual_equipment,
    warband_lists,
    warhost_lists,
    WarhostData
} from "../../model/WarhostData";
import {validUpdateKeys, Warhost, WarhostUpdates} from "../../model/Warhost";
import {userResponse} from "../../model/User";
import {ValidationError} from "yup";

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
        const army = army_list ? (await eventual_army_lists)[army_list] : undefined;
        let warbandData = await warband_lists;
        const warband = army?.vanguardList ? warbandData[army.vanguardList] : undefined;

        const data: WarhostData = {
            lists,
            army,
            warband,
            artefacts: await eventual_artefacts,
            equipment: await eventual_equipment,
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
        const validators = (await validUpdateKeys())(user, updates);
        user.warhost = user.warhost || {name: ''};
        await Promise.all(Object.entries(updates).map(
            async ([key, value]) => {
                let validator = validators[key as keyof WarhostUpdates];
                if(!validator) {
                    throw new BadRequest(`No validator for ${key}.`);
                }

                const validated = await validator.validate(value);
                deepSet(user.warhost as Warhost, key, validated);
            }
        ));

        await user.save();

        res.status(200).json(userResponse(user))
    } catch (error) {
        if((error as Error).name === 'ValidationError') {
            const validationError = error as ValidationError;
            return res.status(400).send(validationError.message)
        }
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
