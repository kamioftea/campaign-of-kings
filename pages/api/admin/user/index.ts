import {NextApiRequest, NextApiResponse} from "next";
import {getLoginSession, UserError} from "../../../../lib/auth";
import {User, userResponse} from "../../../../model/User";
import {Role, UserDocument} from "../../../../model/UserDocument";

export default async function handle(req: NextApiRequest, res: NextApiResponse<UserDocument[] | string>) {
    switch (req.method) {
        case 'GET':
            return await getUsers(req, res);
        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getLoginSession(req, Role.ADMIN)

        let users = [...await User.find({})].map(u => userResponse(u));

        res.status(200).json(users)
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
