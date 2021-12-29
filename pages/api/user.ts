import {getLoginSession, setLoginSession, UserError} from '../../lib/auth'
import {NextApiRequest, NextApiResponse} from "next";
import {User, userResponse} from "../../model/User";
import {UserDocument} from "../../model/UserDocument";
import bcrypt from "bcryptjs";
import {promisify} from "util";

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
  password?: string,
  old_password?: string
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
  try {
    const session = await getLoginSession(req)
    const {name, email, old_password, password: rawPassword} = req.body as UserData;

    if (!name || !email || !old_password) {
      return res.status(400).end("Invalid request")
    }

    if (!await bcrypt.compare(old_password, session.user.password)) {
      return res.status(400).json(
          {
            field_errors: {
              old_password: "Provided password did not match"
            }
          }
      )
    }

    if (email !== session.user.email) {
      const existing = await User.findOne({email});
      if (existing) {
        return res.status(409).json(
            {
              field_errors: {
                email: "Another user with the updated email already exists."
              }
            }
        )
      }
    }

    session.user.name = name;
    session.user.email = email;
    if (rawPassword) {
      session.user.password = await bcryptHash(rawPassword, 14);
    }

    await session.user.save()

    res.status(200).json(userResponse(session.user))
  } catch (error) {
    res.status((error as UserError).status_code ?? 500).end((error as UserError).user_message ?? "Unexpected error")
  }
}
