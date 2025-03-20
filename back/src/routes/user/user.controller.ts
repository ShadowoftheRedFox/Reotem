import { Router } from "express";
import { getNotificationAmount, getNotificationQuery } from "./user.service";

export const UserRouter = Router();
export default UserRouter;

UserRouter.post('/user/notification/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} amount of notifications...`);
        const amount = await getNotificationAmount(Number(req.params.id), req.body.session);
        res.status(200).json(amount);
    } catch (error) {
        next(error);
    }
});

UserRouter.post('/user/notifications/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} notifications...`);
        const notifs = await getNotificationQuery(Number(req.params.id), req.body.session, req.body.query);
        res.status(200).json(notifs);
    } catch (error) {
        next(error);
    }
});