import { UserModel } from "./user";
import { SessionModel } from "./session";
import { NotificationsModel } from "./notification";
import { ObjectModel } from "./object";
import { VerificationModel } from "./verification";


export default {
  User: UserModel,
  Session: SessionModel,
  Verification: VerificationModel,
  Notification: NotificationsModel,
  Object: ObjectModel
};