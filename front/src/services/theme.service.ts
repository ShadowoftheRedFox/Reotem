import { Injectable } from '@angular/core';

export interface ThemePalette {
    name: string;
    icon: string;
    trigger: () => void;
};

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    public themeChoosen = 0;

    public themeList: ThemePalette[] = [
        {
            name: "Bleu esprit",
            icon: "light_mode",
            trigger: () => {
                this.themeChoosen = 0;
                this.changeTheme();
            },
        },
        {
            name: "Rouge sombre",
            icon: "dark_mode",
            trigger: () => {
                this.themeChoosen = 1;
                this.changeTheme();
            }
        },
        {
            name: "Vert forêt",
            icon: "light_mode",
            trigger: () => {
                this.themeChoosen = 2;
                this.changeTheme();
            }
        },
        {
            name: "Couché de soleil",
            icon: "light_mode",
            trigger: () => {
                this.themeChoosen = 3;
                this.changeTheme();
            }
        },
        {
            name: "Noir et blanc",
            icon: "dark_mode",
            trigger: () => {
                this.themeChoosen = 4;
                this.changeTheme();
            }
        },
    ];

    private changeTheme() {
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
