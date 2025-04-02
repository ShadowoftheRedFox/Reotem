import { User } from '../models/api.model';
import { CommunicationService } from './communication.service';
import { CookieConsentName, CookieTime } from '../models/cookie.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationService {
    isOnline = true;

    connected = false;

    // if cookies are enabled
    cookieEnables = navigator.cookieEnabled;
    // if users consented to cookies
    cookiesConsent = false;

    client: User | null = null;
    clientToken = this.getCookie("session");

    constructor(
        private com: CommunicationService,
    ) {
        // écoute les événements
        com.AuthAccountUpdate.subscribe(res => {
            this.connected = res != null;
            com.UpdateUserImage.next("");
            if (res == null) {
                this.client = null;
                this.clientToken = "";
                this.deleteCookie("session");
                this.deleteCookie("UID");
            } else {
                this.client = res;
                this.setCookie("UID", this.client.id + "", CookieTime.Day, "/");
            }
        });

        com.AuthTokenUpdate.subscribe(res => {
            this.clientToken = res;
            this.setCookie("session", res, CookieTime.Year, "/");
        });

        com.AuthTokenUpdate.next(this.getCookie("session"));
    }

    public getCookie(name: string) {
        const ca: string[] = (window.document).cookie.split(';');
        const caLen: number = ca.length;
        const cookieName = `${name}=`;
        let c: string;

        for (let i = 0; i < caLen; i += 1) {
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

    public setCookie(name: string, value: string, expireSeconds: number, path = '') {
        if (value == undefined) return;
        const d: Date = new Date();
        d.setTime(d.getTime() + expireSeconds * 1000);
        const expires = `expires=${d.toUTCString()}`;
        const cpath: string = path ? `; path=${path}` : '';
        window.document.cookie = `${name}=${value}; ${expires}${cpath};`; //SameSite=None; seulement sur https
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
