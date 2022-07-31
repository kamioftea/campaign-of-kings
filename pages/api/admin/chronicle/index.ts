import {NextApiRequest, NextApiResponse} from "next";
import {getLoginSession, UserError} from "../../../../lib/auth";
import {Role} from "../../../../model/UserDocument";
import {ChronicleDocument} from "../../../../model/ChronicleDocument";
import {Chronicle} from "../../../../model/Chronicle";

export default async function handle(req: NextApiRequest, res: NextApiResponse<ChronicleDocument[] | string>) {
    switch (req.method) {
        case 'GET':
            return await getChronicles(req, res);
        case 'POST':
            return
        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getChronicles(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getLoginSession(req, Role.ADMIN)

        let chronicles = [...await Chronicle.find({})];

        res.status(200).json(chronicles)
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
