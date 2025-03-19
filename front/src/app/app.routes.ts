import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { ErrorComponent } from './error/error.component';
import { ConnectionComponent } from './connection/connection.component';
import { LostComponent } from './connection/lost/lost.component';
import { ValidatingComponent } from './connection/validating/validating.component';
import { validatingGuard } from '../guards/validating.guard';
import { UserComponent } from './user/user.component';
import { NotificationComponent } from './notification/notification.component';

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
        path: "connection/validating/:token",
        title: "Vérification" + TITLE_POSTFIX,
        component: ValidatingComponent,
        canActivate: [validatingGuard],
    },
    {
        path: "connection",
        title: "Connection" + TITLE_POSTFIX,
        component: ConnectionComponent,
    },
    {
        path: "user/:id",
        title: "Profil utilisateur" + TITLE_POSTFIX,
        component: UserComponent
    },
    {
        path: "notification",
        title: "Notification" + TITLE_POSTFIX,
        component: NotificationComponent
    },
    {
        path: "**",
        title: "Erreur" + TITLE_POSTFIX,
        component: ErrorComponent
    }
];
