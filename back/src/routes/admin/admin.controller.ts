import { Router } from "express";
import {
    adminValidate,
    getAll
} from "./admin.service";
import logger from "~/util/logger";

export const AdminRouter = Router();
export default AdminRouter;

AdminRouter.post("/all", async (req, res, next) => {
    try {
        logger(`[ADMIN] Getting all user ${req.body.query}`);
        const users = await getAll(req.body.session, req.body.query);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

AdminRouter.post("/:id", async (req, res, next) => {
    try {
        logger(`[ADMIN] Validating user ${req.params.id}`);
        await adminValidate(req.body.session, req.params.id);
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
});
