import {getLoginSession, UserError} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {Role} from "../../model/UserDocument";
import {lists, WarhostData} from "../../model/WarhostData";

export default async function handle(req: NextApiRequest, res: NextApiResponse<WarhostData | string>) {
    switch (req.method) {
        case 'GET':
            return await getWarhostData(req, res);
        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getWarhostData(req: NextApiRequest, res: NextApiResponse<WarhostData | string>) {
    try {
        await getLoginSession(req, Role.PLAYER)

        res.status(200).json({lists: await lists})
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
