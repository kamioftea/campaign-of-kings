import Iron from '@hapi/iron'
import {getTokenCookie, MAX_AGE, removeTokenCookie, setTokenCookie} from './auth-cookies'
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectID} from "bson";
import {Role, User, UserDocument} from "../model/User";
import {mongooseConnect} from "./mongoose-connect";

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'change-me-to-a-32-character-or-longer-string'

export interface Session {
  user: UserDocument
}

interface SessionStore {
  user_id: ObjectID
  maxAge: number,
  createdAt: number,
}

export interface UserError extends Error {
  status_code: number,
  user_message: string
}

export class Unauthenticated implements UserError {
  message: string;
  name: string;
  status_code: number;
  user_message: string;


  constructor() {
    this.message = "You need to log in to access this content";
    this.name = 'Unauthenticated';
    this.status_code = 401;
    this.user_message = this.message;
  }
}

export class Unauthorised implements UserError {
  message: string;
  name: string;
  status_code: number;
  user_message: string;

  constructor() {
    this.message = "You do not have permission to access this content";
    this.name = 'Unauthorised';
    this.status_code = 403;
    this.user_message = this.message;
  }
}

export async function setLoginSession(res: NextApiResponse, session: Session) {
  const createdAt = Date.now()
  // Create a session object with a max age that we can validate later
  const obj: SessionStore = {user_id: session.user._id, createdAt, maxAge: MAX_AGE}
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)

  setTokenCookie(res, token)
}

export async function getLoginSession(req: NextApiRequest, role?: Role): Promise<Session> {
  const token = getTokenCookie(req)
  if (!token) {
    throw new Unauthenticated()
  }

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults) as SessionStore
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  await mongooseConnect;

  const user = await User.findById(session.user_id)

  if (!user) {
    throw new Unauthenticated()
  }

  if (role != undefined && !user.roles.includes(role)) {
    throw new Unauthorised()
  }

  return {user}
}

export function clearLoginSession(res: NextApiResponse) {
  removeTokenCookie(res)
}

export async function getResetKey(user: UserDocument): Promise<string> {
  return await Iron.seal({id: user._id, createdAt: Date.now()}, TOKEN_SECRET, Iron.defaults);
}
