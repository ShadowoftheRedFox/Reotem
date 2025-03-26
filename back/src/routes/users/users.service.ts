import { randomInt } from "crypto";
import HttpException from "~/models/HttpException";
import { NotificationSchema, NotifSchema } from "~/models/notification";
import Reotem from "~/util/functions";
import { parseUser } from "~/util/parser";


export const getUser = async (id: number, session?: string) => {
    if (id < 0) {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);
    const userSession = await Reotem.getSession(session!);

    if (user !== undefined) {
        // TODO Reotem.getSession(session:string) -> user.id
        const sensible = session != undefined && userSession?.id == id;
        return parseUser((user) as never, sensible);
    };
}