import {NextApiRequest, NextApiResponse} from "next";
import {listWarhostSummaries} from "../../../model/User";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getWarhostsData(req, res);

        default:
            return res.status(405).send("Request method not supported");
    }
}

async function getWarhostsData(req: NextApiRequest, res: NextApiResponse) {
    return res.status(200).json(await listWarhostSummaries());
}

