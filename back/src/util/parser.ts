import { userSchema } from "~/models/user";
import { InferSchemaType } from "mongoose";

export const parseUser = (user: InferSchemaType<typeof userSchema>) => {
    user.password = undefined!;
    user.challenge = undefined;
    if (user.validated) { user.validated = "false"; }
    return user;
};
