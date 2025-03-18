import { environment } from "../environments/environment";

export const baseUrl = environment.api_url;

export type User = {
    _id: number;
    first_name: string;
    last_name: string;
    login: string;
    password: string;
    age: number;
}

export const UserMaxAge = 120;
export const UserMinAge = 18;

export const UserSexe = [
    "Homme", "Femme", "Autre"
];
export type UserSexe = "Homme" | "Femme" | "Autre";

export const UserRole = [
    "Employé"
];
export type UserRole = "Employé";

export type LoginChallenge = {
    challenge: string;
    salt: string;
}

export type Login = {
    session_id: string;
}
