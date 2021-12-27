import {getLoginSession, setLoginSession} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {User, UserDocument, userResponse} from "../../model/User";
const bcrypt = require('bcryptjs');
const {promisify} = require('util');

const bcryptHash = promisify(bcrypt.hash);

interface Data {
  user: UserDocument
}

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data | string>) {
  switch (req.method) {
    case 'GET':
      return await getUser(req, res);
    case 'POST':
      return await addUser(req, res);
    case 'PUT':
      return await updateUser(req, res);
    default:
      return res.status(405).send("Request method not supported");
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getLoginSession(req)

    res.status(200).json(userResponse(session.user))
  } catch (error) {
    res.status(401).end('Authentication token is invalid, please log in')
  }
}

interface UserData {
  name: string,
  email: string,
  password: string,
}

async function addUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {name, email, password: rawPassword} = req.body as UserData;
    if(!name || !email || !rawPassword) {
      return res.status(400).end("Invalid request")
    }

    const existing = await User.findOne({email});
    if (existing) {
      return res.status(409).json("User already exists.")
    }

    const password = await bcryptHash(rawPassword, 14);

    const user: UserDocument = new User({name, email, password});
    await user.save()

    await setLoginSession(res, {user});

    res.status(201).json(userResponse(user))
  } catch (error) {
    res.status(500).end('Failed to create user')
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  return res.status(501).end("Not Implemented");
}
