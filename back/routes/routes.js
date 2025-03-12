const Router = require("express").Router;
const signupRouter = require("./signup/signup.controller");

const api = Router()
    .use(signupRouter)

module.exports = Router().use('/', api);