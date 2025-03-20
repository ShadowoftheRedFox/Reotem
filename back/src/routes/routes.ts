import { Router } from "express";
import * as signup from "./signup/signup.controller";
import * as signin from "./session/session.controller";
import * as users from "./users/users.controller";
import * as user from "./user/user.controller";

const api = Router()
    .use(signup.router)
    .use(signin.router)
    .use(user.router)
    .use(users.router);

const routes = Router().use('/', api);
export default routes;