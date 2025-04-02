import { Router } from "express";
import { deleteSession, getSession, createSession } from "./session.service";
import logger from "~/util/logger";

const SessionRouter = Router();
export default SessionRouter;

SessionRouter.get('/signin/:id', async (req, res, next) => {
    try {
        logger(`[SESSIONS] getting sessions ${req.params.id}`);
        const session = await getSession(req.params.id);

        if (session != undefined) {
            res.status(200).json(session);
        } else {
            res.status(404).json();
        }
    } catch (error) {
        next(error);
    }
});

SessionRouter.post('/signin', async (req, res, next) => {
    try {
        logger(`[SESSIONS] creating sessions ${JSON.stringify(req.body)}`); // expect id and an optional hash
        const session = await createSession(req.body.mail, req.body.hash);
        res.status(201).json({ ...session });
    } catch (error) {
        next(error);
    }
});

SessionRouter.delete('/disconnect/:id', async (req, res, next) => {
    try {
        logger(`[SESSIONS] disconnecting ${req.params.id}`);
        if (await deleteSession(req.params.id, req.body.session)) {
            res.status(200).json();
        } else {
            res.status(400).json();
        }
    } catch (error) {
        next(error);
    }
});
