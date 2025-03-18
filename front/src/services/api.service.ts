import { Injectable } from '@angular/core';
import * as bcrypt from "bcryptjs";
import { baseUrl, Login, LoginChallenge, User, UserSexe, UserRole } from '../models/api.model';
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

            let hash_password = await bcrypt.hash(password, salt);

            let hash_challenge = await this.hash(challenge + hash_password);

            //the user send the hash of the challenge and the password
            return this.sendApiRequest<Login>("POST", "signin", { mail: mail, hash: hash_challenge }, "Authenticating");
        },
        create(firstname: string, lastname: string, mail: string, age: number, role: UserRole, sexe: UserSexe, password: string) {

        },
        get: (session_id: string) => {
            return this.sendApiRequest<User>("GET", "signin/" + session_id, undefined, "Getting account");
        },
        disconnect: () => {
            if (!this.authis.client) return;
            const session = this.authis.clientToken;
            const id = this.authis.client._id;
            this.sendApiRequest("DELETE", "disconnect/" + id, { session: session }, "Disconnecting").subscribe({
                next: res => {
                    console.log(res);
                    this.authis.deleteCookie("session");
                    this.authis.deleteCookie("UID");
                    this.com.AuthAccountUpdate.next(false);
                    this.com.AuthTokenUpdate.next("");
                },
                error: err => {
                    console.error(err);
                }
            });
        }
    }

    private sendApiRequest<T>(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", endpoint: String, parameters: Object = {}, message: String | undefined = undefined) {
        const urlParameters = JSON.stringify(parameters);
        const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });

        if (message !== undefined) {
            console.info("[API] " + message);
        }

        switch (method) {
            case "GET":
                return this.http.get<T>(baseUrl + endpoint + (parameters != undefined ? "?data=" + urlParameters : ""));
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
        let session = this.authis.getCookie("session");
        if (session.length == 0) return;
        this.auth.get(session).subscribe({
            next: res => {
                this.com.AuthTokenUpdate.next(session);
                this.authis.client = res;
                this.com.AuthAccountUpdate.next(true);
            },
            error: err => {
                console.warn("Unknown token, removing");
                this.authis.deleteCookie("session");
            }
        });
    }
}
