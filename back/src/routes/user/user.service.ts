import { writeFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { UserRole } from "../../../../front/src/models/api.model";
import { parseUser } from "~/util/parser";

const PUBLIC_PATH = path.join(__dirname, "..", "..", "..", "public/");

export const checkUserRole = async (role: UserRole, session: string) => {
  if (!role || !session) {
    throw new HttpException(404);
  }

  if (!UserRole.includes(role)) {
    throw new HttpException(400, { role: "unknown" });
  }

  // TODO Reotem.getSession(session:string) -> user._id | undefined
  const userId = (await Reotem.getSession(session))?._id.toString();

  if (userId === undefined || userId === "") {
    throw new HttpException(401);
  }

  const userRole = (await Reotem.getUser(userId))?.role;

  return userRole == role;
};

export const getUser = async (id: string, session: string = "") => {
  if (id === "") {
    throw new HttpException(400);
  }

  const user = await Reotem.getUser(id);
  const userSession = await Reotem.getSession(session);

  if (user == undefined) {
    throw new HttpException(404);
  }

  //TODO TO DELETE IF ALL USERS HAVE ISO DATE FORMAT (Users Remaining: Ploof and Admin [if admin has age])
  if (!isNaN(parseInt(user.age)) && parseInt(user.age) < 120) {
    user.age = `${new Date(Date.now()).getFullYear() - parseInt(user.age)}-01-01T00:00:01.972Z`;
    await Reotem.updateUser(user._id, user); 
  }

  return parseUser(user, user._id === userSession?.id);
};

export const postImage = async (id: string, base64: string, session: string) => {
  if (id === "") {
    throw new HttpException(400);
  }

  const user = await Reotem.getUser(id);

  if (user == undefined) {
    throw new HttpException(404);
  }

  const currentSession = await Reotem.getSession(session);
  if (currentSession?.id != user._id) {
    throw new HttpException(401);
  }

  // Captured img [base64 string]
  console.log(base64);

  // Convert base64 --> img.jpeg
  const buffer = Buffer.from(base64, "base64");
  console.log(buffer);

  const imgName = id + ".jpeg";

  // save image under the account id
  writeFileSync(PUBLIC_PATH + imgName, buffer);

  return imgName;
};
