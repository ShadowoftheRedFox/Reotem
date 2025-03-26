import { Router } from "express";
import SignupRouter from "./signup/signup.controller";
import SessionRouter from "./session/session.controller";
import UserRouter from "./user/user.controller";
import ObjectsRouter from "./objects/objects.controller";

const api = Router()
    .use("/signup/", SignupRouter)
    .use(SessionRouter)
    .use("/user/", UserRouter)
    .use("/objects/", ObjectsRouter);

const routes = Router().use('/', api);
export default routes;