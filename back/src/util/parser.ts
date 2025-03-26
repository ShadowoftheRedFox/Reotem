import { UserSchema } from "~/models/user";
import { User, UserLevel, UserRole, UserSexe } from "../../../front/src/models/api.model";

export const parseUser = (user: UserSchema, sensible = false): Partial<User> => {
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: sensible ? user.email : undefined,
        age: sensible ? user.age : undefined,
        role: user.role as UserRole,
        sexe: user.sexe as UserSexe,
        lvl: sensible ? user.lvl as UserLevel : undefined,
        exp: sensible ? user.exp : undefined,
        validated: sensible ? (user.validated ? false : undefined) : undefined,
        adminValidated: sensible ? (user.validated ? false : undefined) : undefined,
    };
};
