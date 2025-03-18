import { Router } from "express";
import * as signup from "./signup/signup.controller";
import * as signin from "./session/session.controller";

const api = Router()
    .use(signup.router)
    .use(signin.router);

const routes = Router().use('/', api);
export default routes;