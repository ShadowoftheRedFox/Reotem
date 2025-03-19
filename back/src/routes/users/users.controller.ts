import { Router } from "express";
import { getUser } from "./users.service";

export const router = Router();

router.get('/users/:id', async (req, res, next) => {
    try {
        console.log(`Getting user ${req.params.id}...`);
        const user = await getUser(Number(req.params.id));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});