import { Router } from "express";
import { getAll, getOne } from "./objects.service";
import { ObjectQuery } from "../../../../front/src/models/api.model";

const ObjectsRouter = Router();
export default ObjectsRouter;

ObjectsRouter.get('/', async (req, res, next) => {
    try {
        console.log(`getting all object ${JSON.stringify(req.query.data || {})}`);
        const result = await getAll((req.query.data || {}) as ObjectQuery);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

ObjectsRouter.get('/:id', async (req, res, next) => {
    try {
        console.log(`getting object ${req.params.id}`);
        const result = await getOne(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


ObjectsRouter.get('/delete/:id', async (req, res, next) => {
    try {
        console.log(`deleting object ${req.params.id}`);
        res.status(200);
    } catch (error) {
        next(error);
    }
});