import { Injectable } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { CookieTime } from '../models/cookie.model';

const ThemeCookie = "theme";

export interface ThemePalette {
    backgroundColor: string;
    buttonColor: string;
    headingColor: string;
    label: string;
    value: string;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    constructor(private auth: AuthentificationService) {
        const CookieContent = auth.getCookie(ThemeCookie);
        if (CookieContent.length > 0) {
            this.themeChoosen = CookieContent;
        } else {
            this.themeChoosen = "azure-blue";
        }
        this.setTheme(this.themeList.find(p => p.value == this.themeChoosen)?.value || "azure-blue");
    }

    public themeChoosen = "azure-blue";

    public themeList: ThemePalette[] = [
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Bleu Azure",
            value: "azure-blue"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Cyan & Orange",
            value: "cyan-orange"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Chartreuse & Vert",
            value: "chartreuse-green"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Mangenta & Violet",
            value: "magenta-violet"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Rose & Bleu-Gris",
            value: "pink-bluegrey"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Violet & Rouge",
            value: "purple-red"
        },
        {
            backgroundColor: "#fff",
            buttonColor: "#ffc107",
            headingColor: "#673ab7",
            label: "Rose & Rouge",
            value: "rose-red"
        },
    ]

    public setTheme(theme: string) {
        this.auth.setCookie(ThemeCookie, theme, CookieTime.Year, "/");
        this.setStyle(
            "theme",
            `/${theme}.css`
        );
    }

    // from teh angular material website
    /**
     * Set the stylesheet with the specified key.
     */
    setStyle(key: string, href: string) {
        getLinkElementForKey(key).setAttribute("href", href);
    }

    /**
     * Remove the stylesheet with the specified key.
     */
    removeStyle(key: string) {
        const existingLinkElement = getExistingLinkElementByKey(key);
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }
}


function getLinkElementForKey(key: string) {
    return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
    return document.head.querySelector(
        `link[rel="stylesheet"].${getClassNameForKey(key)}`
    );
}

function createLinkElementWithKey(key: string) {
    const linkEl = document.createElement("link");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.classList.add(getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
}

function getClassNameForKey(key: string) {
    return `app-${key}`;
}
