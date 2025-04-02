import { environment } from "../environments/environment";
import { ObjectClass } from "./domo.model";

export const baseUrl = environment.api_url;

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    age: string;
    role: UserRole;
    lvl: UserLevel;
    exp: number;
    sexe: UserSexe;
    // front should never receive the string
    validated?: boolean | string;
    adminValidated?: boolean;
    // front should never receive the password
    password?: string;
    lastLogin: string;
}

export interface NewUser {
    user: User;
    session: string;
}

export const UserMaxAge = 120;
export const UserMinAge = 18;

export const LevelBeginner = 1000;
export const LevelAdvanced = LevelBeginner * 2;
export const LevelExpert = LevelAdvanced * 2;

export const UserSexe = [
    "Homme",
    "Femme",
    "Autre"
] as const;

export type UserSexe = typeof UserSexe[number];

export const UserRole = [
    "Administrator",
    "CEO",
    "CO-CEO",
    "Project Manager",
    "Developper",
    "Tester",
    "Intern",
] as const;

export type UserRole = typeof UserRole[number];

export const UserLevel = [
    "Débutant",
    "Avancé",
    "Expert"
] as const;
export type UserLevel = typeof UserLevel[number];

export interface LoginChallenge {
    challenge: string;
    salt: string;
}

export interface Login {
    sessionid: string;
}

export interface NotificationAmount {
    amount: number;
}

export interface Notification {
    id: string;
    read: boolean;
    message: string;
    title: string;
}

export interface APIQuery {
    limit?: number;
    step?: number;
}

export interface NotificationQuery extends APIQuery {
    read?: boolean;
    id?: string;
}

export interface ObjectQuery extends APIQuery {
    id?: number;
    sort?: "asc" | "desc";
    type?: ObjectClass;
    toDelete?: boolean;
}

export interface AdminQuery extends APIQuery {
    sort?: "asc" | "desc";
    validated?: false;
}
