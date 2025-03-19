import { Injectable } from '@angular/core';
import * as bcrypt from "bcryptjs";
import { baseUrl, Login, LoginChallenge, User, UserSexe, UserRole, NewUser } from '../models/api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor(
        private http: HttpClient,
        private authis: AuthentificationService,
        private com: CommunicationService
    ) {
        // look is a user is connected
        this.authenticate();
    }


    auth = {
        login: async (mail: string, password: string) => {
            //authentificate the user and return a session id if success
            //the user call the api to get a challenge

            // let { challenge, salt, id } =;
            const res = await lastValueFrom(this.sendApiRequest<LoginChallenge>("POST", "signin", { mail: mail }, "Challenge auth"));
            const challenge: string = res.challenge;
            const salt: string = res.salt;

            const hash_password = await bcrypt.hash(password, salt);

            const hash_challenge = await this.hash(challenge + hash_password);

            //the user send the hash of the challenge and the password
            return this.sendApiRequest<Login>("POST", "signin", { mail: mail, hash: hash_challenge }, "Authenticating");
        },
        create: (firstname: string, lastname: string, email: string, age: number, role: UserRole, sexe: UserSexe, password: string) => {
            return this.sendApiRequest<NewUser>("POST", "signup/", { firstname: firstname, lastname: lastname, email: email, age: age, role: role, sexe: sexe, password: password }, "Creating account");
        },
        get: (sessionid: string) => {
            return this.sendApiRequest<User>("GET", "signin/" + sessionid, undefined, "Getting account");
        },
        disconnect: () => {
            if (!this.authis.client) return;
            const session = this.authis.clientToken;
            const id = this.authis.client.id;
            this.sendApiRequest("DELETE", "disconnect/" + id, { session: session }, "Disconnecting").subscribe({
                next: () => {
                    this.authis.deleteCookie("session");
                    this.authis.deleteCookie("UID");
                    this.com.AuthAccountUpdate.next(null);
                    this.com.AuthTokenUpdate.next("");
                },
                error: err => {
                    console.error(err);
                }
            });
        },
        validate: (token: string, session: string) => {
            return lastValueFrom(this.sendApiRequest<boolean>("POST", "signup/validating", { token: token, session: session }))
        },
        tokenExists: async (token: string) => {
            return lastValueFrom(this.sendApiRequest<boolean>("POST", "signup/token", { token: token }));
        }
    }

    user = {
        get: (id: number, session: string | "") => {
            // TODO with the api, if session not valid or empty, send only public data
            return this.sendApiRequest<User>("GET", "users/" + id, { session: session }, `Getting user ${id}`);
        }
    }

    private sendApiRequest<T>(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", endpoint: string, parameters: object = {}, message: string | undefined = undefined) {
        const urlParameters = (parameters != undefined && Object.keys(parameters).length > 0) ? "?data=" + JSON.stringify(parameters) : "";
        const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });

        if (message !== undefined) {
            console.info("[API] " + message);
        }

        switch (method) {
            case "GET":
                return this.http.get<T>(baseUrl + endpoint + urlParameters);
            case "POST":
                return this.http.post<T>(baseUrl + endpoint, parameters);
            case "PUT":
                return this.http.put<T>(baseUrl + endpoint, parameters, { headers: headers });
            case "PATCH":
                return this.http.patch<T>(baseUrl + endpoint, parameters, { headers: headers });
            case "DELETE":
                return this.http.delete<T>(baseUrl + endpoint, { body: parameters });
        }


    }

    //a function to hash a string with sha256 and return the hash in hex
    private async hash(string: string) {
        const sourceBytes = new TextEncoder().encode(string);
        const disgest = await crypto.subtle.digest("SHA-256", sourceBytes);
        const hash = Array.from(new Uint8Array(disgest)).map(b => b.toString(16).padStart(2, "0")).join("");
        return hash;
    }

    private authenticate() {
        // auth is managed by a session with the api
        const session = this.authis.getCookie("session");
        if (session.length == 0) return;
        this.auth.get(session).subscribe({
            next: res => {
                this.com.AuthTokenUpdate.next(session);
                this.com.AuthAccountUpdate.next(res);
            },
            error: () => {
                console.warn("Unknown token, removing");
                this.authis.deleteCookie("session");
            }
        });
    }
}
