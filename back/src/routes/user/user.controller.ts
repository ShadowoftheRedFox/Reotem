import { Router } from "express";
import {
    checkUserRole, getUser, postImage, updateUser, updateUserEmail, updateUserPassword
} from "./user.service";
import NotifRouter from "./notifications/notifications.controller";
import logger from "~/util/logger";

export const UserRouter = Router();
export default UserRouter;

UserRouter.use("/notification/", NotifRouter);

UserRouter.post("/verify", async (req, res, next) => {
    try {
        logger(`Verifying user ${req.body.session} has role...`);
        const hasRole = await checkUserRole(req.body.role, req.body.session);
        res.status(200).json(hasRole);
    } catch (error) {
        next(error);
    }
});

UserRouter.post('/:id', async (req, res, next) => {
    try {
        logger(`Getting user ${req.params.id}...`);
        const user = await getUser(req.params.id, req.body.session);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

UserRouter.put('/:id', async (req, res, next) => {
    try {
        logger(`Updating user ${req.params.id}...`);
        const user = await updateUser(req.params.id, req.body.session, req.body.user);
        if (user) {
            res.status(200).json({});
        } else {
            res.status(422).json()
        }
    } catch (error) {
        next(error);
    }
});

UserRouter.put('/:id/password', async (req, res, next) => {
    try {
        logger(`Updating user password ${req.params.id}...`);
        const user = await updateUserPassword(req.params.id, req.body.session, req.body.hash, req.body.password);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

UserRouter.put('/:id/email', async (req, res, next) => {
    try {
        logger(`Updating user email ${req.params.id}...`);
        const user = await updateUserEmail(req.params.id, req.body.session, req.body.hash, req.body.newEmail);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

UserRouter.put('/:id/image', async (req, res, next) => {
    try {
        logger(`Changing user ${req.params.id} image...`);
        const imgString = await postImage(req.params.id, req.body.base64, req.body.session);
        res.status(201).json({ name: imgString });
    } catch (error) {
        next(error);
    }
});