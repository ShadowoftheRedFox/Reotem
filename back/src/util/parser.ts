import { UserSchema } from "~/models/user";

export const parseUser = (user: UserSchema, sensible = false) => {
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: sensible ? user.email : undefined,
        password: sensible ? user.password : undefined,
        age: sensible ? user.age : undefined,
        role: user.role,
        sexe: user.sexe,
        photo: user.photo,
        challenge: user.challenge,
        validated: sensible ? (user.validated ? false : undefined) : undefined,
    };
};
