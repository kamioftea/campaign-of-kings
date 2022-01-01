import {NextApiRequest, NextApiResponse} from "next";
import {User} from "../../model/User";
import {UserDocument} from "../../model/UserDocument";
import {mongooseConnect} from "../../lib/mongoose-connect";
import {getResetKey} from "../../lib/auth";
import {sendEmail} from "../../lib/send-email";

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

    try {
        const key = await getResetKey(user);
        const resetUrl = `https://${req.headers.host}/reset-password?key=${key}`

        await sendEmail({
            to: [email],
            subject: 'Password reset for The Conquest of Hell\'s Claw',
            text: `Hi ${user.name},
            
You are receiving this email because someone has requested a password reset for your account in The Conquest of Hell\'s 
Claw Campaign. If this was you, please use the following link to reset your password:

${resetUrl}

Thanks,
Chesterfield Open Gaming Society.`
        });
        return res.status(200).send("Reset email sent.");
    }
    catch (err) {
        console.error('Failed to send email', err)
        return res.status(500).end();
    }
}
