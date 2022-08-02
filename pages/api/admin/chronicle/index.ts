import {NextApiRequest, NextApiResponse} from "next";
import {getLoginSession, UserError} from "../../../../lib/auth";
import {Role, UserDocument} from "../../../../model/UserDocument";
import {ChronicleDocument, ChronicleResponse} from "../../../../model/ChronicleDocument";
import {Chronicle} from "../../../../model/Chronicle";

export default async function handle(req: NextApiRequest, res: NextApiResponse<ChronicleResponse[] | string>) {
    switch (req.method) {
        case 'GET':
            return await getChronicles(req, res);
        case 'POST':
            return
        default:
            return res.status(405).send("Request method not supported");
    }
}

function chronicleLens({
                           _id,
                           chronicleType,
                           author,
                           slug,
                           coverImageUrl,
                           publishedDate,
                           updatedDate,
                           draftContent,
                           approvedContent,
                           reviewStatus,
                           reviewNotes
                       }: Omit<ChronicleDocument, 'author'> & {author: UserDocument}): ChronicleResponse {
 return {
     _id: _id?.toJSON(),
     chronicleType,
     authorName: author.name,
     slug,
     coverImageUrl,
     publishedDate,
     updatedDate,
     draftContent,
     approvedContent,
     reviewStatus,
     reviewNotes,
 }
}

async function getChronicles(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getLoginSession(req, Role.ADMIN)

        let chronicles =
            [...await Chronicle.find({}).populate<{ author: UserDocument }>('author')];

        res.status(200).json(chronicles.map(chronicleLens))
    } catch (error) {
        res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
    }
}
