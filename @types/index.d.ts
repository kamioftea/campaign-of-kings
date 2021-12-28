import {UserDocument} from "../model/UserDocument";

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}
