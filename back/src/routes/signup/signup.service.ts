import bcrypt from "bcryptjs";
import HttpException from "../../models/HttpException";
import { UserMaxAge, UserMinAge, UserSchema } from "../../models/user";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import { sendMail, template } from "../../util/mailer";
import Reotem from "../../util/functions";
import { User, UserRole, UserSexe } from "../../../../front/src/models/api.model";

const checkUserUniqueness = async (email: string) => {
  if (await Reotem.checkUserUnique(email)) throw new HttpException(422, { email: "has already been taken" });
};

export const createUser = async (input: { [key: string]: string | number }) => {
  const firstname = input.firstname + "";
  const lastname = input.lastname + "";
  const email = input.email + "";
  const age = Number(input.age);
  const role = input.role as UserRole;
  const sexe = input.sexe as UserSexe;
  const password = input.password + "";

  if (!email) {
    throw new HttpException(422, { email: "can't be blank" });
  }

  if (!firstname) {
    throw new HttpException(422, { firstname: "can't be blank" });
  }

  if (!lastname) {
    throw new HttpException(422, { lastname: "can't be blank" });
  }

  if (!password) {
    throw new HttpException(422, { password: "can't be blank" });
  }

  if (password.length < 8) {
    throw new HttpException(422, { password: "must be longer than 8 characters" });
  }

  if (!age) {
    throw new HttpException(422, { age: "can't be blank" });
  }
  if (age < UserMinAge || age > UserMaxAge) {
    throw new HttpException(422, { age: "invalid" });
  }

  if (!role) {
    throw new HttpException(422, { role: "can't be blank" });
  }
  if (!UserRole.includes(role)) {
    throw new HttpException(422, { role: "invalid" });
  }

  if (!sexe) {
    throw new HttpException(422, { sexe: "can't be blank" });
  }
  if (!UserSexe.includes(sexe)) {
    throw new HttpException(422, { sexe: "invalid" });
  }

  await checkUserUniqueness(email);

  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

  const birthDate = new Date(`${new Date().getFullYear() - age}-01-01T00:00:00.000Z`).toISOString();

  let user: Partial<User> = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
    age: birthDate,
    role: role,
    sexe: sexe,
    validated: generateToken(10),
    exp: 0,
    lvl: "Débutant",
    lastLogin: new Date().toISOString()
  };

  const sessionid = generateToken(24);

  (await Reotem.getUsers())?.map(async user => {
    if (user.role === "Administrator") await Reotem.addNotification(user.id, {title: "Un nouvel utilisateur s'est inscrit.", message: `L'utilisateur ${user.lastname} ${user.firstname} s'est inscrit avec cette adresse email : ${user.email}.`, read: false})
  })

  await Reotem.addUser(user);
  await Reotem.addSession({ id: user.id, token: sessionid });
  await Reotem.addVerification({ id: user.id, token: user.validated as string });

  const username = user.firstname + " " + user.lastname;
  // send the mail with the link to validate
  sendMail(user.email as string, "Vérification de votre adresse email", `À l'attention de ${username}`, template.validate(username, user.validated as string), username);

  user = parseUser(user as never);

  return { user: user, session: sessionid };
};

export const getCurrentUser = async (id: string) => {
  let user = (await Reotem.getUser(id)) as Partial<UserSchema>;

  if (!user) return {};

  user = parseUser(user as UserSchema) as Partial<UserSchema>;

  return {
    ...user,
    token: generateToken(0),
  };
};

export const validateUser = async (token: string, session: string) => {
  // 400 because important route, we don't want to tell what went wrong
  if (!token || !session) {
    throw new HttpException(400);
  }

  const validation = await Reotem.getVerification(token);

  const user = (await Reotem.getUser(validation?.id)) as UserSchema;
  if (user === undefined) throw new HttpException(404);

  user.validated = "";

  await Reotem.updateUser(user.id, user);
  await Reotem.deleteVerification(user.id);

  return true;
};

export const checkTokenExists = async (token: string) => {
  if (!token) throw new HttpException(404);

  const verification = await Reotem.getVerification(token);
  if (verification === undefined) throw new HttpException(404);
  return true;
};
