import { Router } from "express";
import { getAll } from "./objects.service";
import { ObjectQuery } from "../../../../front/src/models/api.model";

const ObjectsRouter = Router();
export default ObjectsRouter;

ObjectsRouter.get('/', async (req, res, next) => {
    try {
        console.log(`getting all object ${req.query.data}`);
        const result = getAll(req.query.data as ObjectQuery);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});