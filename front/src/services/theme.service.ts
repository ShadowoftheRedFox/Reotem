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
            this.setTheme(this.themeList.find(p => p.value == this.themeChoosen)?.value || "azure-blue");
        }
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
            label: "Indigo & Rose",
            value: "indigo-pink"
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
            label: "Violet & Vert",
            value: "purple-green"
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

    private changeTheme() {
        this.auth.setCookie(ThemeCookie, this.themeChoosen.toString(), CookieTime.Year, "/");
        // c'est dans cet élement qu'on stock no variable
        const root = document.querySelector(':root');
        if (!root) {
            console.warn("no root element found");
            return;
        }
        // prend les couleurs de la palette correspondante dans l'élement root
        const pal_1 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-1`);
        const pal_2 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-2`);
        const pal_3 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-3`);
        const pal_4 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-4`);
        const pal_5 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-5`);
        const pal_6 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-6`);
        const pal_7 = getComputedStyle(root).getPropertyValue(`--pal${this.themeChoosen + 1}-7`);

        // change les couleurs selon le theme
        document.documentElement.style.setProperty('--color-1', pal_1);
        document.documentElement.style.setProperty('--color-2', pal_2);
        document.documentElement.style.setProperty('--color-3', pal_3);
        document.documentElement.style.setProperty('--color-4', pal_4);
        document.documentElement.style.setProperty('--color-5', pal_5);
        document.documentElement.style.setProperty('--color-6', pal_6);
        document.documentElement.style.setProperty('--color-7', pal_7);
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
