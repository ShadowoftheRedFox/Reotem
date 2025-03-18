import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { ErrorComponent } from './error/error.component';
import { ConnectionComponent } from './connection/connection.component';
import { LostComponent } from './connection/lost/lost.component';

const TITLE_POSTFIX = " - " + environment.title;

export const routes: Routes = [
    {
        path: "",
        title: "Accueil" + TITLE_POSTFIX,
        component: MainComponent
    },
    {
        path: "connection/lost",
        title: "Identifiant oublié" + TITLE_POSTFIX,
        component: LostComponent,
    },
    {
        path: "connection",
        title: "Connection" + TITLE_POSTFIX,
        component: ConnectionComponent,
    },
    {
        path: "**",
        title: "Erreur" + TITLE_POSTFIX,
        component: ErrorComponent
    }
];
