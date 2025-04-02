import { Router } from "express";
import {
    adminValidate,
    getAll
} from "./admin.service";
import logger from "~/util/logger";
import Reotem from "~/util/functions";
import path from "path";

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

AdminRouter.post("/dump/", async (req, res, next) => {
    try {
        logger(`[ADMIN] Dumping data`);
        const user = await Reotem.getSession(req.body.session);
        const code = await Reotem.dataDump(user?.id);
        if (code)
            res.status(code).json({});
        else
            res.status(500).json({})
    } catch (error) {
        next(error);
    }
});

AdminRouter.get('/downloadlogs/', (req, res) => {
    const filePath = path.join(__dirname, "..", "..", "..", "logs", "debug.log");
    console.log(filePath)
    res.download(filePath, 'logs.log', (err) => {
        if (err !== undefined) logger(err.toString());
    });
});

AdminRouter.post("/logs/", async (req, res, next) => {
    try {
        logger(`[ADMIN] Showing logs`);
        res.status(200).json({})
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
