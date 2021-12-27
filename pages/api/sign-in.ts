import {NextApiRequest, NextApiResponse} from "next";
import {User, userResponse} from "../../model/User";
import bcrypt from 'bcryptjs'
import {setLoginSession} from "../../lib/auth";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end("request must be post")
        }

        const {email, password} = req.body;
        if (!email || !password || typeof email !== "string") {
            return res.status(400).end("email and password are required")
        }

        let user = await User.findOne({email})
        if (!user) {
            return res.status(404).end("No user exists with the provided email")
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).end("Provided password did not match")
        }

        await setLoginSession(res, {user});
        return res.status(200).json(userResponse(user))
    } catch (err) {
        console.error(err);
        res.status(500).end("An error occurred processing the login")
    }
}
