import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { AdminQuery, User, UserRole } from "../../../../front/src/models/api.model";
import { adminParseUser } from "~/util/parser";
import logger from "~/util/logger";
import path from "path";
import fs from "fs";

export const getAllUsers = async (session: string, query: AdminQuery) => {
  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  let users: Partial<User>[] = [];
  const reqUsers = await Reotem.getUsers();
  if (reqUsers === undefined) {
    logger("[LOGIC ERROR] found no account but found admin user");
    throw new HttpException(500);
  }

  reqUsers.forEach((u) => users.push(adminParseUser(u)));

  if (query && query.validated != undefined) {
    users = users.filter((u) => u.adminValidated === query.validated || u.adminValidated === undefined);
  }

  return { users: users, number: users.length };
};

export const adminValidate = async (session: string, id: string) => {
  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  const validatedUser = await Reotem.getUser(id);
  if (validatedUser == undefined) {
    throw new HttpException(404, { user: "not found" });
  }

  await Reotem.updateUser(id, { adminValidated: true });
  return;
};

export const createDump = async (session: string) => {
  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  if (!fs.existsSync("dump/")) fs.mkdirSync("dump/");

  const code = await Reotem.dataDump(admin.id);
  return code;
};

export const getDump = async (query: { data?: string }) => {
  if (!query || !query.data || query.data.length < 2) {
    throw new HttpException(422);
  }

  let session = "";
  try {
    session = JSON.parse(query.data).session;
  } catch (err) {
    if (err) logger("failed to parse query");
    throw new HttpException(422);
  }

  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  return path.join(__dirname, "..", "..", "..", "dump", "backup.json");
};

export const getLogs = async (query: { data?: string }) => {
  if (!query || !query.data || query.data.length < 2) {
    throw new HttpException(422);
  }

  let session = "";
  try {
    session = JSON.parse(query.data).session;
  } catch (err) {
    if (err) logger("failed to poarse query");
    throw new HttpException(422);
  }

  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  return path.join(__dirname, "..", "..", "..", "logs", "debug.log");
};

export const getReport = async (query: { data?: string }) => {
  if (!query || !query.data || query.data.length < 2) {
    throw new HttpException(422);
  }

  let session = "";
  try {
    session = JSON.parse(query.data).session;
  } catch (err) {
    if (err) logger("failed to poarse query");
    throw new HttpException(422);
  }

  const currentSession = await Reotem.getSession(session);
  if (currentSession === undefined) {
    throw new HttpException(403);
  }

  const admin = await Reotem.getUser(currentSession.id);
  if (admin == undefined || (admin.role as UserRole) != "Administrator") {
    throw new HttpException(403);
  }

  const data = {
    userNumber: 0,
    objectNumber: 0,
    adminUsersNumber: 0,
    advancedUsersNumber: 0,
    beginnerUsersNumber: 0,
    expertUsersNumber: 0,
    validatingMailPendingNumber: 0,
    validatingAdminPendingNumber: 0,
    totalElectricConsumption: 0,
    totalOpenedObjects: 0,
    totalErrorObjects: 0,
    totalMaintenanceObjects: 0,
    rooms: [] as string[],
    buildings: [] as string[],
  };

  const users = await Reotem.getUsers();
  const objects = await Reotem.getAllObjects();
  if (users === undefined || objects === undefined) return "Un problème est survenu lors de la récuppération des données.";
  data.userNumber = users.length;
  data.objectNumber = objects.length;
  data.adminUsersNumber = users.filter((user) => user.role === "Administrator").length;
  data.advancedUsersNumber = users.filter((user) => user.role === "Avancé").length;
  data.beginnerUsersNumber = users.filter((user) => user.role === "Débutant").length;
  data.expertUsersNumber = users.filter((user) => user.role === "Expert").length;
  data.validatingMailPendingNumber = users.filter((user) => user.validated !== "").length;
  data.validatingAdminPendingNumber = users.filter((user) => user.adminValidated === true).length;
  data.totalOpenedObjects = objects.filter((object) => object.turnedOn === true).length;
  data.totalErrorObjects = objects.filter((object) => object.state === "Erreur").length;
  data.totalMaintenanceObjects = objects.filter((object) => object.state === "Maintenance").length;
  objects.map((object) => {
    data.totalElectricConsumption += isNaN(object.electricityUsage as number) ? 0 : (object.electricityUsage as number);
    data.rooms.push(object.room as string);
    data.buildings.push(object.room as string);
  });

  const reportString = `# Rapport du ${new Date().toLocaleDateString()}
Rapport généré automatiquement par le système 😎  

# Généralité 
> __Nombre d'utilisateurs répertoriés__ : **${data.userNumber}**
> __Nombre d'objets répertoriés__       : **${data.objectNumber}**
 
# Utilisateurs
> __Nombre d'administrateurs__          : **${data.adminUsersNumber}**
> __Nombre d'utilisateurs experts__     : **${data.expertUsersNumber}**
> __Nombre d'utilisateurs avancés__     : **${data.advancedUsersNumber}**
> __Nombre d'utilisateurs débutants__   : **${data.beginnerUsersNumber}**

# Validations
> __Utilisateurs dont l'email n'est pas confirmée__               : **${data.validatingMailPendingNumber}**
> __Utilisateurs dont le profil n'a pas été validé par un admin__ : **${data.validatingAdminPendingNumber}**

# Objets    
> __Nombre d'objets actif__             : **${data.totalOpenedObjects}**
> __Nombre d'objets en état d'erreur__  : **${data.totalErrorObjects}**
> __Nombre d'objets en maintenance__    : **${data.totalMaintenanceObjects}**
> __Consommation total d'électicité__   : **${data.totalElectricConsumption}Wh**

# Lieux
> __**Salles repertoriées**__  : ${Array.from(new Set(data.rooms)).join(" | ").trimEnd()}
> __**Bâtiments repertoriés**__: ${Array.from(new Set(data.buildings)).join(" | ").trimEnd()}

Fin du rapport`;
  if (!fs.existsSync("temp/")) fs.mkdirSync("temp/");
  fs.writeFileSync("temp/report.md", reportString);

  return "temp/report.md";
};
