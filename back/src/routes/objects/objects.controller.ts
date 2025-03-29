import { Router } from "express";
import { getAll, getOne } from "./objects.service";
import { ObjectQuery } from "../../../../front/src/models/api.model";

const ObjectsRouter = Router();
export default ObjectsRouter;

ObjectsRouter.get('/', async (req, res, next) => {
    try {
        console.log(`getting all object ${JSON.stringify(req.query.data || {})}`);
        const result = getAll((req.query.data || {}) as ObjectQuery);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

ObjectsRouter.get('/:id', async (req, res, next) => {
    try {
        console.log(`getting object ${req.params.id}`);
        const result = await getOne(Number(req.params.id));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});