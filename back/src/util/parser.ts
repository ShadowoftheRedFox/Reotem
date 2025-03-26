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
        level: sensible ? user.level as UserLevel : undefined,
        xp: sensible ? user.xp : undefined,
        photo: user.photo,
        validated: sensible ? (user.validated ? false : undefined) : undefined,
    };
};
