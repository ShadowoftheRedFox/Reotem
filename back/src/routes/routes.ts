import { Router } from "express";
import SignupRouter from "./signup/signup.controller";
import SessionRouter from "./session/session.controller";
import UserRouter from "./users/users.controller";
import UsersRouter from "./user/user.controller";

const api = Router()
    .use(SignupRouter)
    .use(SessionRouter)
    .use(UserRouter)
    .use(UsersRouter);

const routes = Router().use('/', api);
export default routes;