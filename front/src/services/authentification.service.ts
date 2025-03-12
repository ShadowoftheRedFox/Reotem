import { User } from '../models/api.model';
import { CommunicationService } from './communication.service';
import { CookieConsentName, CookieTime } from '../models/cookie.models';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationService {
    isOnline = true;

    connected = false;
    perms = 0;

    // si les cookie sont activés
    cookieEnables = navigator.cookieEnabled;
    // si l'utilisateur authorise les cookies
    cookiesConsent = false;

    client: User | null = null;
    clientPerms: number = 0;
    clientToken = "";
    // nouveau token à chaque sessions
    clientTokenID = this.generateToken(8);
    clientDisabled = false;
    clientBanned = false;
    clientDidPresentation = true;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private com: CommunicationService,
    ) {
        // écoute les événements
        com.AuthAccountUpdate.subscribe(res => {
            this.connected = res;
            if (!this.connected) {
                this.client = null;
                this.clientPerms = 0;
                this.clientDisabled = false;
                this.clientBanned = false;
                this.deleteCookie("UID");
                this.deleteCookie("APISID");
            } else if (this.client) {
                this.setCookie("UID", this.client._id + "", CookieTime.Day, "/");
            }
        });

        com.AuthTokenUpdate.subscribe(res => {
            this.clientToken = res;
        });
    }

    private token() {
        return Math.random().toString(Math.floor(Math.random() * 25) + 11).substring(2);
    }

    public generateToken(n: number) {
        if (!n || n <= 0) n = 3;
        let t = "";
        for (let i = 0; i < n; i++) {
            t += this.token();
        }
        return t.substring(0, 255);
    }

    // public hasAllPermissions(...perm: ComptePermissions[]) {
    //     return hasAllPermissions(this.clientPerms, ...perm);
    // }

    // public hasOnePermission(...perm: ComptePermissions[]) {
    //     return hasOnePermission(this.clientPerms, ...perm);
    // }

    // public hasMorePermissions(perm: ComptePermissions) {
    //     return hasMorePermissions(this.clientPerms, perm);
    // }

    public getCookie(name: string) {
        let ca: Array<string> = this.document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    public deleteCookie(name: string) {
        this.setCookie(name, '', -1);
    }

    public setCookie(name: string, value: string, expireSeconds: number, path: string = '') {
        if (value == undefined) return;
        let d: Date = new Date();
        d.setTime(d.getTime() + expireSeconds * 1000);
        let expires: string = `expires=${d.toUTCString()}`;
        let cpath: string = path ? `; path=${path}` : '';
        this.document.cookie = `${name}=${value}; ${expires}${cpath};`; //SameSite=None; seulement sur https
    }

    public consent(isConsent: boolean, e: Event) {
        if (isConsent) {
            this.setCookie(CookieConsentName, '1', CookieTime.Year);
            this.cookiesConsent = true;
            e.preventDefault();
        }
        return this.cookiesConsent;
    }

}
