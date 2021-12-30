import {NextApiRequest, NextApiResponse} from "next";
import {Role, roles, UserDocument} from "../../../../../model/UserDocument";
import {getLoginSession, UserError} from "../../../../../lib/auth";
import {User, userResponse} from "../../../../../model/User";

export default async function handle(req: NextApiRequest, res: NextApiResponse<UserDocument[] | string>) {
    switch (req.method) {
        case 'PUT':
            return await updateRole(req, res);
        default:
            return res.status(405).send("Request method not supported");
    }
}

async function updateRole(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getLoginSession(req, Role.ADMIN)

        let user = await User.findById(req.query.id);
        if(!user) {
            return res.status(404).send("User not found");
        }
        const {role, setActive} = req.body;
        if(!roles().includes(role)) {
            return res.status(400).send("Role is not valid")
        }
        if(setActive) {
            user.roles.push(role);
        }
        else {
            user.roles = user.roles.filter(r => r != role)
        }
        user.save();

        res.status(200).json(userResponse(user))
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
