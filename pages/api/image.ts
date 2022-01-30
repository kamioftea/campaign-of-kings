import {NextApiRequest, NextApiResponse} from 'next';
import {getLoginSession} from "../../lib/auth";
import {saveFile} from '../../lib/spaces';
import {Role} from "../../model/UserDocument";

import middleware from '../../middleware/multiparty'
import nextConnect from 'next-connect'
import {File} from "multiparty";
import {readFile, rm} from 'fs/promises'

const handler = nextConnect<NextApiRequest & {files: {[key: string]: File[]}}, NextApiResponse>()
handler.use(middleware)

handler.post(async (req, res) => {
    try {
        await getLoginSession(req, [Role.PLAYER, Role.ADMIN]);
        const path = req.files.file[0].path;
        const contents = await readFile(path);
        const extension = req.files.file[0].originalFilename.split('.').pop();

        const url = await saveFile(contents, extension);

        res.status(201).json({url});

        await rm(path);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Failed to upload file");
    }
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler
