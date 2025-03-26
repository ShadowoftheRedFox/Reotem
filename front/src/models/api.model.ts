import { environment } from "../environments/environment";
import { ObjectClass } from "./domo.model";

export const baseUrl = environment.api_url;

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    age: number;
    role: UserRole;
    level: UserLevel;
    xp: number;
    sexe: UserSexe;
    validated?: false;
    photo: unknown | null;
}

export interface NewUser {
    user: User;
    session: string;
}

export const UserMaxAge = 120;
export const UserMinAge = 18;

export const UserSexe = [
    "Homme", "Femme", "Autre"
];
export type UserSexe = "Homme" | "Femme" | "Autre";

export const UserRole = [
    "Administrator",
    "CEO",
    "CO-CEO",
    "Project Manager",
    "Developper",
    "Tester",
    "Intern",
];
export type UserRole = "Administrator" |
    "CEO" |
    "CO-CEO" |
    "Project Manager" |
    "Developper" |
    "Tester" |
    "Intern";

export const UserLevel = ["Débutant", "Avancé", "Expert"];
export type UserLevel = "Débutant" | "Avancé" | "Expert";

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
    id: number;
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
    id?: number;
}

export interface ObjectQuery extends APIQuery {
    id?: number;
    sort?: "asc" | "desc";
    type?: ObjectClass;
    // TODO find a way to remember recently used object by user, maybe via localStorage,
}
