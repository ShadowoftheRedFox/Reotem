import { Router } from "express";
import { deletingNotification, getNotificationAmount, getNotificationQuery, setNotificationRead, setNotificationUnread } from "./notifications.service";

export const NotifRouter = Router();
export default NotifRouter;

NotifRouter.post('/num/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} amount of notifications...`);
        const amount = await getNotificationAmount(req.params.id, req.body.session);
        res.status(200).json(amount);
    } catch (error) {
        next(error);
    }
});

NotifRouter.post('/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id} notifications...`);
        const notifs = await getNotificationQuery(req.params.id, req.body.session, req.body.query);
        res.status(200).json(notifs);
    } catch (error) {
        next(error);
    }
});

NotifRouter.put('/read', async (req, res, next) => {
    try {
        console.log(`Setting some notifications from user ${req.body.session} to read...`);
        await setNotificationRead(req.body.ids, req.body.session);
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
});

NotifRouter.put('/unread', async (req, res, next) => {
    try {
        console.log(`Setting some notifications from user ${req.body.session} to unread...`);
        await setNotificationUnread(req.body.ids, req.body.session);
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
});

NotifRouter.delete('/', async (req, res, next) => {
    try {
        console.log(`Deleting some notifications from user ${req.body.session}...`);
        await deletingNotification(req.body.ids, req.body.session);
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
});