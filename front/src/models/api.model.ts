import { environment } from "../environments/environment";

export const baseUrl = environment.api_url;

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    age: number;
    role: UserRole;
    sexe: UserSexe;
    validated?: false;
    photo: string | null;
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

export interface LoginChallenge {
    challenge: string;
    salt: string;
}

export interface Login {
    sessionid: string;
}
