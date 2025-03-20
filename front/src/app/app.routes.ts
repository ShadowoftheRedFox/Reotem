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
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from '../guards/admin.guard';
import { FaqComponent } from './faq/faq.component';

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
        path: "administration",
        title: "Administration" + TITLE_POSTFIX,
        component: AdminComponent,
        canActivate: [adminGuard]
    },
    {
        path: "faq",
        title: "FAQ" + TITLE_POSTFIX,
        component: FaqComponent
    },
    {
        path: "**",
        title: "Erreur" + TITLE_POSTFIX,
        component: ErrorComponent
    }
];
