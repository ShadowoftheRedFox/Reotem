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

export type LoginChallenge = {
    challenge: string;
    salt: string;
}

export type Login = {
    session_id: string;
}