import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { ErrorComponent } from './error/error.component';

const TITLE_POSTFIX = " - " + environment.title;

export const routes: Routes = [
    {
        path: "",
        title: "Accueil" + TITLE_POSTFIX,
        component: MainComponent
    }, {
        path: "**",
        title: "Erreur" + TITLE_POSTFIX,
        component: ErrorComponent
    }
];
