import Iron from '@hapi/iron'
import {getTokenCookie, MAX_AGE, removeTokenCookie, setTokenCookie} from './auth-cookies'
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectID} from "bson";
import {User} from "../model/User";
import {Role, UserDocument} from "../model/UserDocument";
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


  constructor(message?: string) {
    this.message = message ?? "You need to log in to access this content";
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

  constructor(message?: string) {
    this.message = message ?? "You do not have permission to access this content";
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

export async function parseResetKey(key: string): Promise<UserDocument> {
  const {id, createdAt} = await Iron.unseal(key, TOKEN_SECRET, Iron.defaults);
  console.log(id, createdAt)
  const expiresAt = createdAt + MAX_AGE * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt || Date.now() < createdAt ) {
    console.log('expired', expiresAt, Date.now())
    throw new Unauthenticated('This password reset link has expired, please request a new one.')
  }

  const user = await User.findById(id);

  if (!user) {
    console.log('no user', user)
    throw new Unauthenticated('This password reset link is invalid, please request a new one.')
  }

  return user;
}
