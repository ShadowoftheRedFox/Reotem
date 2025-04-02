import { Router } from "express";
import { createObject, getAll, getOne, dupplicateObject } from "./objects.service";
import { ObjectQuery } from "../../../../front/src/models/api.model";
import Reotem from "~/util/functions";
import { ObjectSchema } from "~/models/object";
import logger from "~/util/logger";

const ObjectsRouter = Router();
export default ObjectsRouter;

ObjectsRouter.get("/", async (req, res, next) => {
  try {
    logger(`getting all object ${JSON.stringify(req.query.data || {})}`);
    const result = await getAll((req.query.data || {}) as ObjectQuery);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.get("/:id", async (req, res, next) => {
  try {
    logger(`getting object ${req.params.id}`);
    const result = await getOne(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.post("/create/", async (req, res, next) => {
  try {
    logger(`creating object ${req.body.object.name}`);
    const newObject = await createObject(req.body.object);
    logger(JSON.stringify(newObject));
    res.status(201).json(newObject);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.put("/update/:id", async (req, res, next) => {
  try {
    logger(`updating object ${req.body.params}`);
    const oldObject = await getOne(req.params.id)
    const userId = (await Reotem.getSession(req.body.session))?.id
    await Reotem.updateObject(oldObject.id, req.body.params, userId)
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.delete("/delete/:id", async (req, res, next) => {
  try {
    logger(`deleting object ${req.params.id}`);
    logger(req.body);
    const object = await Reotem.getObject(req.params.id);
    if (!object) {
      res.status(404).json();
      return;
    }
    const userId = (await Reotem.getSession(req.body.session))?.id;
    const user = await Reotem.getUser(userId);
    if (!user) {
      res.status(404).json();
      return;
    }
    if (user.role === "Administrator") {
      await Reotem.deleteObject(object.id);
    } else {
      logger(`sending deleting request`)
      object.toDelete = { id: user.id, delete: true };
      logger(object.toDelete);
      await Reotem.updateObject(object.id, object, user.id);
    }
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.post("/dupplicate/:id", async (req, res, next) => {
  try {
    logger(`dupping object ${req.params.id}`);
    const objectToDupp = await getOne(req.params.id)
    const namesOccur: string[] = [];
    (await getAll())?.objects?.map(object => { if (object.name === objectToDupp.name) namesOccur.push(object.id) })
    if (objectToDupp.name)
      objectToDupp.name = objectToDupp.name + (namesOccur.length !== 0 ? `-${namesOccur.length}` : "")
    const duppedObject = await dupplicateObject(objectToDupp as ObjectSchema);
    res.status(201).json(duppedObject);
  } catch (error) {
    next(error);
  }
});
