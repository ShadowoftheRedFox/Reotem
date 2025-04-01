import { Router } from "express";
import { createObject, getAll, getOne } from "./objects.service";
import { ObjectQuery } from "../../../../front/src/models/api.model";
import Reotem from "~/util/functions";

const ObjectsRouter = Router();
export default ObjectsRouter;

ObjectsRouter.get("/", async (req, res, next) => {
  try {
    console.log(`getting all object ${JSON.stringify(req.query.data || {})}`);
    const result = await getAll((req.query.data || {}) as ObjectQuery);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.get("/:id", async (req, res, next) => {
  try {
    console.log(`getting object ${req.params.id}`);
    const result = await getOne(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.post("/create/", async (req, res, next) => {
  try {
    console.log(`creating object ${req.body.object.name}`);
    const newObject = await createObject(req.body.object);
    console.log(newObject);
    res.status(201).json(newObject);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.post("/update/", async (req, res, next) => {
  try {
    console.log(`updating object ${JSON.parse(req.body).name} as ${JSON.parse(req.body).objectClass}`);
    res.status(200);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.delete("/delete/:id", async (req, res, next) => {
  try {
    console.log(`deleting object ${req.params.id}`);
    console.log(req.body);
    const object = await Reotem.getObject(req.params.id);
    if (!object) {
      res.status(404);
      return;
    }
    const userId = (await Reotem.getSession(req.body.session))?.id;
    const user = await Reotem.getUser(userId);
    if (!user) {
      res.status(404);
      return;
    }
    if (user.adminValidated || user.role === "Administrator") {
      await Reotem.deleteObject(object.id);
    } else {
      object.toDelete = { id: user.id, delete: true };
      console.log(object.toDelete);
      await Reotem.updateObject(object.id, object);
    }
    res.status(200);
  } catch (error) {
    next(error);
  }
});

ObjectsRouter.post("/dupplicate/:id", async (req, res, next) => {
  try {
    console.log(`dupping object ${req.params.id}`);
    res.status(200);
  } catch (error) {
    next(error);
  }
});
