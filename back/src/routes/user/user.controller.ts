import { Router } from "express";
import { checkUserRole, getUser, postImage } from "./user.service";
import NotifRouter from "./notifications/notifications.controller";

export const UserRouter = Router();
export default UserRouter;

UserRouter.use("/notification/", NotifRouter);

UserRouter.post("/verify", async (req, res, next) => {
    try {
        console.log(`Verifying user ${req.body.session} has role...`);
        const hasRole = await checkUserRole(req.body.role, req.body.session);
        res.status(200).json(hasRole);
    } catch (error) {
        next(error);
    }
});

UserRouter.post('/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id}...`);
        const user = await getUser(Number(req.params.id), req.body.session);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

UserRouter.put('/:id/image', async (req, res, next) => {
    try {
        console.log(`Changing user ${req.params.id} image...`);
        const imgString = await postImage(Number(req.params.id), req.body.base64, req.body.session);
        res.status(201).json({ name: imgString });
    } catch (error) {
        next(error);
    }
});