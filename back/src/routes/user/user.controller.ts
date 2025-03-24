import { Router } from "express";
import { getNotificationAmount, getNotificationQuery, checkUserRole } from "./user.service";

export const UserRouter = Router();
export default UserRouter;

UserRouter.post('/notification/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} amount of notifications...`);
        const amount = await getNotificationAmount(Number(req.params.id), req.body.session);
        res.status(200).json(amount);
    } catch (error) {
        next(error);
    }
});

UserRouter.post('/notifications/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} notifications...`);
        const notifs = await getNotificationQuery(Number(req.params.id), req.body.session, req.body.query);
        res.status(200).json(notifs);
    } catch (error) {
        next(error);
    }
});

UserRouter.post("/verify", async (req, res, next) => {
    try {
        console.log(`Verifying user ${req.body.session} has role...`);
        const hasRole = await checkUserRole(req.body.role, req.body.session);
        res.status(200).json(hasRole);
    } catch (error) {
        next(error);
    }
});