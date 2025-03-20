import { Router } from "express";
import { getUser } from "./users.service";

const UserRouter = Router();
export default UserRouter;

UserRouter.post('/users/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id}...`);
        const user = await getUser(Number(req.params.id), req.body.session);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});