import {NextApiRequest, NextApiResponse} from "next";
import {userResponse} from "../../model/User";
import {mongooseConnect} from "../../lib/mongoose-connect";
import {parseResetKey, UserError} from "../../lib/auth";
import bcrypt from "bcryptjs";
import {promisify} from "util";

const bcryptHash = promisify(bcrypt.hash);

interface Data {
    email?:string
}

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data | string>) {
    console.log('reset', req.method)
    switch (req.method) {
        case 'GET':
            return await getUserFromKey(req, res);
        case 'PUT':
            return await setPassword(req, res);
        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getUserFromKey(req: NextApiRequest, res: NextApiResponse<Data | string>) {
    let {key} = req.query;

    console.log(req.query);

    if(!key || typeof key !== 'string') {
        console.log('no key')
        return res.status(400).send("No key was provided in the request");
    }

    await mongooseConnect;

    try {
        const user = await parseResetKey(key);
        return res.status(200).json(userResponse(user));
    }
    catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}

async function setPassword(req: NextApiRequest, res: NextApiResponse<Data | string>) {
    let {key, password: rawPassword} = req.body;

    if(!key || typeof key !== 'string') {
        return res.status(400).send("No key was provided in the request");
    }

    await mongooseConnect;

    try {
        const user = await parseResetKey(key);

        user.password = await bcryptHash(rawPassword, 14);
        await user.save();

        return res.status(200).json(userResponse(user));
    }
    catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
