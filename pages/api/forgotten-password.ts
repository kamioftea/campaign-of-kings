import {NextApiRequest, NextApiResponse} from "next";
import {User} from "../../model/User";
import {UserDocument} from "../../model/UserDocument";
import {mongooseConnect} from "../../lib/mongoose-connect";
import {getResetKey} from "../../lib/auth";

interface Data {
    email?:string
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') {
       return res.status(405).send("Only POST requests are accepted")
    }

    let {email} = req.body || {} as Data
    if(!email || typeof email !== 'string') {
        return res.status(400).send("User's email must be a non-empty string")
    }

    await mongooseConnect;

    let user: UserDocument | null = await User.findOne({email});

    if(!user) {
        return res.status(404).send("No user account for the provided email has been setup");
    }

    // TODO: send email
    console.log(`Reset key for ${user.email}: `, await getResetKey(user));
}
