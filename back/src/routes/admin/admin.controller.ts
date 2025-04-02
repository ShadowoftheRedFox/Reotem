import { Router } from "express";
import { adminValidate, getAllUsers, getReport, getLogs, getDump, createDump } from "./admin.service";
import logger from "~/util/logger";
import fs from "fs";

export const AdminRouter = Router();
export default AdminRouter;

AdminRouter.post("/all", async (req, res, next) => {
  try {
    logger(`[ADMIN] Getting all user ${req.body.query != undefined ? JSON.stringify(req.body.query) : {}}`);
    const users = await getAllUsers(req.body.session, req.body.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

AdminRouter.post("/dump/", async (req, res, next) => {
  try {
      logger(`[ADMIN] Dumping data`);
    const code = await createDump(req.body.session);
    res.status(code).json({});
  } catch (error) {
    next(error);
  }
});

AdminRouter.get("/downloadlogs/", async (req, res) => {
  const filePath = await getLogs(req.query);
  res.download(filePath, "logs.log", (err) => {
    if (err !== undefined) logger(err.toString());
  });
});

AdminRouter.get("/downloaddata/", async (req, res) => {
  const filePath = await getDump(req.query);
  res.download(filePath, "backup.json", (err) => {
    if (err !== undefined) logger(err.toString());
  });
});

AdminRouter.get("/logs/", async (req, res, next) => {
  try {
    logger(`[ADMIN] Showing logs`);
      const filePath = await getLogs(req.query);
    const ploof = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json({content: ploof});
  } catch (error) {
    next(error);
  }
});

AdminRouter.get("/downloadreport/", async (req, res, next) => {
  try {
    logger(`[ADMIN] Generating report`);
    const filePath = await getReport(req.query);
    res.download(filePath, "report.txt", (err) => {
        if (err !== undefined) logger(err.toString());
    });
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
