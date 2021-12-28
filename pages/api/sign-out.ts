import {NextApiRequest, NextApiResponse} from "next";
import {clearLoginSession} from "../../lib/auth";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end("request must be post")
        }

        clearLoginSession(res);
        return res.status(200).send("Successfully signed out")
    } catch (err) {
        console.error(err);
        res.status(500).end("An error occurred processing the login")
    }
}
