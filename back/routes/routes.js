const Router = require("express").Router;
const signupRouter = require("./signup/signup.controller");
const sessionRouter = require("./session/session.controller");

const api = Router()
    .use(signupRouter)
    .use(sessionRouter);

module.exports = Router().use('/', api);