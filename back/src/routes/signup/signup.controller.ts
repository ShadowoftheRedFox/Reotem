import { Router } from "express";
import { createUser, checkTokenExists, validateUser } from "./signup.service";
import logger from "~/util/logger";

const SignupRouter = Router();
export default SignupRouter;

SignupRouter.post('/', async (req, res, next) => {
    try {
        logger("[VALIDATING] creating user...");
        const user = await createUser({ ...req.body });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

SignupRouter.post("/token", async (req, res, next) => {
    try {
        logger("[VALIDATING] Checking token exists");
        const exists = await checkTokenExists(req.body.token);
        res.status(200).json(exists);
    } catch (error) {
        next(error);
    }
});

SignupRouter.post("/validating", async (req, res, next) => {
    try {
        logger("[VALIDATING] Validating token");
        const exists = await validateUser(req.body.token, req.body.session);
        res.status(200).json(exists);
    } catch (error) {
        next(error);
    }
});