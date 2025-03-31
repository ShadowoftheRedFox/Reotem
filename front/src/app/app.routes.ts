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
import { TestComponent } from './test/test.component';
import { testGuard } from '../guards/test.guard';
import { ObjectComponent } from './object-manager/object/object.component';
import { ObjectManagerComponent } from './object-manager/object-manager.component';
import { ServiceManagerComponent } from './service-manager/service-manager.component';
import { authGuard } from '../guards/auth.guard';
import { CreateComponent } from './object-manager/create/create.component';

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
        path: "object/create",
        title: "Création d'objet" + TITLE_POSTFIX,
        component: CreateComponent,
        canActivate: [authGuard]
    },
    {
        path: "object/:id",
        title: "Objet" + TITLE_POSTFIX,
        component: ObjectComponent,
        canActivate: [authGuard]
    },
    {
        path: "object",
        title: "Gestionnaire d'objet" + TITLE_POSTFIX,
        component: ObjectManagerComponent,
        canActivate: [authGuard]
    },
    {
        path: "service/:tab",
        title: "Services" + TITLE_POSTFIX,
        component: ServiceManagerComponent,
        canActivate: [authGuard]
    },
    {
        path: "service",
        title: "Services" + TITLE_POSTFIX,
        component: ServiceManagerComponent,
        canActivate: [authGuard]
    },
    {
        path: "notification",
        title: "Notification" + TITLE_POSTFIX,
        component: NotificationComponent,
        canActivate: [authGuard]
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
        path: "test",
        title: "Page de test" + TITLE_POSTFIX,
        component: TestComponent,
        canActivate: [testGuard]
    },
    {
        path: "**",
        title: "Erreur" + TITLE_POSTFIX,
        component: ErrorComponent
    }
];
