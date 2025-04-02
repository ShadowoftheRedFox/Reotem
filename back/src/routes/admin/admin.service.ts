import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { AdminQuery, User, UserRole } from "../../../../front/src/models/api.model";
import { adminParseUser } from "~/util/parser";
import logger from "~/util/logger";

export const getAll = async (session: string, query: AdminQuery) => {
    const currentSession = await Reotem.getSession(session);
    if (currentSession === undefined) {
        throw new HttpException(403);
    }

    const admin = await Reotem.getUser(currentSession.id);
    if (admin == undefined || (admin.role as UserRole) != "Administrator") {
        throw new HttpException(403);
    }

    let users: Partial<User>[] = [];
    const reqUsers = (await Reotem.getUsers())
    if (reqUsers === undefined) {
        logger("[LOGIC ERROR] found no account but found admin user");
        throw new HttpException(500);
    }

    reqUsers.forEach(u => users.push(adminParseUser(u)));

    if (query && query.validated != undefined) {
        users = users.filter(u => u.validated === false);
    }

    return { users: users, number: users.length };
}

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
        throw new HttpException(404, { user: 'not found' });
    }

    // TODO check why it's not validating the user
    validatedUser.adminValidated = true;

    await Reotem.updateUser(id, validatedUser);
    return;
}