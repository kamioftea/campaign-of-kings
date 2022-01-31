import {NextApiRequest, NextApiResponse} from "next";
import {warhostFromSummary} from "../../../model/User";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getWarhostsData(req, res);

        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getWarhostsData(req: NextApiRequest, res: NextApiResponse) {
    const data = await warhostFromSummary(req.query.slug as string);

    if(!data) {
        return res.status(404).send("Not Found")
    }

    return res.status(200).json(data);
}

