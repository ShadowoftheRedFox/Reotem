import { Injectable } from '@angular/core';
import * as bcrypt from "bcryptjs";
import { baseUrl, Login, LoginChallenge, User, UserSexe, UserRole, NewUser, NotificationAmount, NotificationQuery, ObjectQuery, Notification } from '../models/api.model';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { CommunicationService } from './communication.service';
import { AnyObject } from '../models/domo.model';
import { AdminQuery } from '../models/api.model';

@Injectable({
    providedIn: "root",
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

    readonly auth = {
        login: async (mail: string, password: string) => {
            // authenticate the user and return a session token if success
            // the user call the api to get a challenge, which prevent the clear password from being sent

            let res: LoginChallenge;
            try {
                res = await lastValueFrom(
                    this.sendApiRequest<LoginChallenge>(
                        "POST",
                        "signin",
                        { mail: mail },
                        "Challenge auth"
                    )
                );
            } catch (e) {
                console.error(e);
                return throwError(() => e);
            }

            const hash_password = await bcrypt.hash(password, res.salt);
            const hash_challenge = await this.hash(
                res.challenge + hash_password
            );

            //the user send the hash of the challenge and the password
            return this.sendApiRequest<Login>(
                "POST",
                "signin",
                { mail: mail, hash: hash_challenge },
                "Authenticating"
            );
        },
        create: (
            firstname: string,
            lastname: string,
            email: string,
            age: number,
            role: UserRole,
            sexe: UserSexe,
            password: string
        ) => {
            return this.sendApiRequest<NewUser>(
                "POST",
                "signup/",
                {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    age: age,
                    role: role,
                    sexe: sexe,
                    password: password,
                },
                "Creating account"
            );
        },
        get: (sessionid: string) => {
            return this.sendApiRequest<User>(
                "GET",
                "signin/" + sessionid,
                undefined,
                "Getting account"
            );
        },
        disconnect: () => {
            if (!this.authis.client) return;
            const session = this.authis.clientToken;
            const id = this.authis.client.id;
            this.sendApiRequest(
                "DELETE",
                "disconnect/" + id,
                { session: session },
                "Disconnecting"
            ).subscribe({
                next: () => {
                    this.authis.deleteCookie("session");
                    this.authis.deleteCookie("UID");
                    this.com.AuthAccountUpdate.next(null);
                    this.com.AuthTokenUpdate.next("");
                },
                error: (err) => {
                    console.error(err);
                },
            });
        },
        validate: (token: string, session: string) => {
            return lastValueFrom(
                this.sendApiRequest<boolean>("POST", "signup/validating", {
                    token: token,
                    session: session,
                })
            );
        },
        tokenExists: async (token: string) => {
            return lastValueFrom(
                this.sendApiRequest<boolean>("POST", "signup/token", {
                    token: token,
                })
            );
        },
        verifyRole: (role: UserRole, session: string) => {
            return this.sendApiRequest<boolean>(
                "POST",
                "user/verify",
                { role: role, session: session },
                "Verifying role"
            );
        },
    };

    readonly user = {
        get: (id: string, session?: string) => {
            return this.sendApiRequest<User>(
                "POST",
                "user/" + id,
                { session: session },
                `Getting user ${id}`
            );
        },
        changeImg: (id: string, base64: string, session: string) => {
            return this.sendApiRequest<{ name: string }>("PUT", "user/" + id + "/image/", { base64: base64, session: session }, `Changing user ${id} image`);
        },
        update: (id: string, session: string, user: Partial<User>) => {
            return this.sendApiRequest("PUT", "user/" + id, { id: id, session: session, user: user }, "Updating user");
        },
        updateEmail: async (id: string, session: string, newEmail: string, password: string) => {
            let res: LoginChallenge;
            try {
                res = await lastValueFrom(this.sendApiRequest<LoginChallenge>("PUT", "user/" + id + "/email", { session: session }, "Challenge auth"));
            } catch (e) {
                console.error(e)
                return throwError(() => e);
            }

            const hash_password = await bcrypt.hash(password, res.salt);
            const hash_challenge = await this.hash(res.challenge + hash_password);

            //the user send the hash of the challenge and the new email
            return this.sendApiRequest("PUT", "user/" + id + "/email", { session: session, newEmail: newEmail, hash: hash_challenge }, "Updating user");
        },
        updatePassword: async (id: string, session: string, oldpassword: string, newpassword: string) => {
            let res: LoginChallenge;
            try {
                res = await lastValueFrom(this.sendApiRequest<LoginChallenge>("PUT", "user/" + id + "/password", { session: session }, "Challenge auth"));
            } catch (e) {
                console.error(e)
                return throwError(() => e);
            }

            const hash_password = await bcrypt.hash(oldpassword, res.salt);
            const hash_challenge = await this.hash(res.challenge + hash_password);
            return this.sendApiRequest("PUT", "user/" + id + "/password", { session: session, password: newpassword, hash: hash_challenge }, "Updating user");
        },
    }

    readonly notifications = {
        getNum: (id: string, session: string) => {
            return this.sendApiRequest<NotificationAmount>(
                "POST",
                "user/notification/num/" + id,
                { session: session },
                "Getting notifications amount"
            );
        },
        getAll: (id: string, session: string, query: NotificationQuery) => {
            return this.sendApiRequest<Notification[]>(
                "POST",
                "user/notification/" + id,
                { session: session, query: query },
                "Getting notifications"
            );
        },
        delete: (ids: string[], session: string) => {
            return this.sendApiRequest(
                "DELETE",
                "user/notification/",
                { ids: ids, session: session },
                "Delete notification"
            );
        },
        read: (ids: string[], session: string) => {
            return this.sendApiRequest(
                "PUT",
                "user/notification/read",
                { ids: ids, session: session },
                "Read notification"
            );
        },
        unread: (ids: string[], session: string) => {
            return this.sendApiRequest(
                "PUT",
                "user/notification/unread",
                { ids: ids, session: session },
                "Unread notification"
            );
        },
    };

    readonly objects = {
        all: (query: ObjectQuery) => {
            return this.sendApiRequest<{ objects: AnyObject[]; total: number }>(
                "GET",
                "objects",
                query,
                "Getting all objects"
            );
        },
        get: (id: string) => {
            return this.sendApiRequest<AnyObject>(
                "GET",
                "objects/" + id,
                {},
                "Getting object " + id
            );
        },
        update: <T = AnyObject>(
            id: string,
            session: string,
            changes: Partial<{ [key in keyof T]: T[key] }>
        ) => {
            return this.sendApiRequest(
                "PUT",
                "objects/update/" + id,
                { params: changes, session: session },
                "Updating object " + id
            );
        },
        delete: (id: string, session: string) => {
            return this.sendApiRequest(
                "DELETE",
                "objects/delete/" + id,
                { session: session },
                "Deleting " + id
            );
        },
        dupplicate: (id: string, session: string) => {
            return this.sendApiRequest(
                "POST",
                "objects/dupplicate/" + id,
                { session: session },
                "Dupping object"
            );
        },
        create: (object: AnyObject, session: string) => {
            return this.sendApiRequest("POST", "objects/create/", { session: session, object: object }, "Creating object");
        }
    }

    readonly admin = {
        getAllUser: (session: string, query: AdminQuery) => {
            return this.sendApiRequest<{ users: User[], number: number }>("POST", "admin/all", { session: session, query: query }, "[ADMIN] Getting all users");
        },
        validateUser: (session: string, userId: string) => {
            return this.sendApiRequest("POST", "admin/" + userId, { session: session }, "[ADMIN] Validating user " + userId);
        }
    }

    private sendApiRequest<T>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        endpoint: string,
        parameters: object = {},
        message: string | undefined = undefined
    ) {
        const urlParameters =
            parameters != undefined && Object.keys(parameters).length > 0
                ? "?data=" + JSON.stringify(parameters)
                : "";
        // const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });
        // const headers = new HttpHeaders({ "Content-Type": "multipart/form-data" });

        if (message !== undefined) {
            console.info("[API] " + message);
        }

        switch (method) {
            case "GET":
                return this.http.get<T>(baseUrl + endpoint + urlParameters);
            case "POST":
                return this.http.post<T>(baseUrl + endpoint, parameters);
            case "PUT":
                return this.http.put<T>(baseUrl + endpoint, parameters);
            case "PATCH":
                return this.http.patch<T>(baseUrl + endpoint, parameters);
            case "DELETE":
                return this.http.delete<T>(baseUrl + endpoint, {
                    body: parameters,
                });
        }
    }

    //a function to hash a string with sha256 and return the hash in hex
    private async hash(string: string) {
        const sourceBytes = new TextEncoder().encode(string);
        const disgest = await crypto.subtle.digest("SHA-256", sourceBytes);
        const hash = Array.from(new Uint8Array(disgest))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hash;
    }

    private authenticate() {
        // auth is managed by a session with the api
        const session = this.authis.getCookie("session");
        if (session.length == 0) return;
        this.auth.get(session).subscribe({
            next: (res) => {
                this.com.AuthTokenUpdate.next(session);
                this.com.AuthAccountUpdate.next(res);
            },
            error: () => {
                console.warn("Unknown token, removing");
                this.com.AuthAccountUpdate.next(null);
            },
        });
    }
}
