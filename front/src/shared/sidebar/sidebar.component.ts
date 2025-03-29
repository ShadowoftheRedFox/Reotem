import { APIService } from '../../services/api.service';
import { ChangeDetectorRef, Component, isDevMode, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../environments/environment';
import { DialogComponent, DialogDataType } from '../dialog/dialog.component';
import { AuthentificationService } from '../../services/authentification.service';
import { CommunicationService } from '../../services/communication.service';
import { NotificationService } from '../../services/notification.service';
import { LevelAdvanced, LevelBeginner, LevelExpert, User } from '../../models/api.model';

const SiteName = environment.title;

interface SideNavItem {
    title: string;
    link: string | string[] | null;
    icon?: string;
    aria: string;
    tooltip: string;
    image?: string;
    hidden?: boolean;
    id: string;
    notifications?: string;
    hover?: boolean;
    hoverClass?: string;
    class?: string;
    callback?: () => void;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterLink,
        NgClass,
        MatProgressBarModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
    constructor(
        private readonly dialog: MatDialog,
        private api: APIService,
        private auth: AuthentificationService,
        private com: CommunicationService,
        public theme: ThemeService,
        private router: Router,
        private notif: NotificationService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener("change", this._mobileQueryListener)

        this.initUpdate();

        com.AuthAccountUpdate.subscribe(u => {
            this.user = u;

            if (this.user) {
                switch (this.user.lvl) {
                    case "Débutant":
                        this.userLevelCompletion = Math.floor((this.user.exp / LevelBeginner) * 100);
                        break;
                    case "Avancé":
                        this.userLevelCompletion = Math.floor((this.user.exp / LevelAdvanced) * 100);
                        break;
                    case "Expert":
                        this.userLevelCompletion = Math.floor((this.user.exp / LevelExpert) * 100);
                        break;
                    default:
                        this.userLevelCompletion = Math.floor(((Math.random() * LevelExpert) / LevelExpert) * 100);
                }
            }
        })
    }

    user: User | null = null;
    isAdmin = false;
    readonly SiteName = SiteName;
    readonly BaseUrl = environment.api_url;

    userLevelCompletion = 0;

    getItem(id: string): SideNavItem | null {
        const total = [...this.SideNavItemsBottom, ...this.SideNavItemsTop];

        for (const item of total) {
            if (item.id == id) return item;
        }

        return null;
    }

    // listen to every event needed
    initUpdate() {
        const decoObj = this.getItem("DeconnectionObj");
        const compteObj = this.getItem("CompteObj");
        const notifObj = this.getItem("NotificationsObj");
        const adminObj = this.getItem("AdminObj")
        const objectManagerObj = this.getItem("ObjectManagerObj");
        const servicesManagerObj = this.getItem("ServiceManagerObj");
        // update at each connection/disconnection
        this.com.AuthAccountUpdate.subscribe((user) => {
            if (decoObj) {
                decoObj.hidden = user == null;
            }
            if (compteObj) {
                if (user != null) {
                    compteObj.title = user.firstname;
                    compteObj.image = "Icone";
                    compteObj.tooltip = "Accéder à votre profil";
                    compteObj.aria = "Lien vers votre page de profil";
                    compteObj.link = ["/user", user.id + ''];

                    if (adminObj) {
                        adminObj.hidden = user.role != "Administrator";
                    }
                    if (notifObj) {
                        notifObj.hidden = false;
                    }
                    if (objectManagerObj) {
                        objectManagerObj.hidden = false;
                    }
                    if (servicesManagerObj) {
                        servicesManagerObj.hidden = false;
                    }
                } else {
                    compteObj.title = "Compte";
                    compteObj.link = "/connection";
                    compteObj.icon = "account_circle";
                    compteObj.aria = "Lien pour retourner se connecter";
                    compteObj.tooltip = "Se connecter";

                    if (adminObj) {
                        adminObj.hidden = true;
                    }
                    if (notifObj) {
                        notifObj.hidden = true;
                    }
                    if (objectManagerObj) {
                        objectManagerObj.hidden = true;
                    }
                    if (servicesManagerObj) {
                        servicesManagerObj.hidden = true;
                    }
                }
            }
        });

        this.com.NotifUpdate.subscribe((res) => {
            if (notifObj) {
                const num = res > 99 ? "99+" : "" + res;
                notifObj.notifications = !res ? undefined : num;
                notifObj.tooltip = res > 0 ? res + ` notification${res > 1 ? "s" : ""} non lue${res > 1 ? "s" : ""}` : "Notifications reçues";
            }
        });
    }

    // get the animation function
    @ViewChildren(MatSidenav) snav!: QueryList<MatSidenav>

    SideNavItemsTop: SideNavItem[] = [
        {
            title: "Accueil",
            link: "/",
            icon: "home",
            aria: "Lien pour aller à a page principale",
            tooltip: "Menu principal",
            id: "AccueilObj",
        },
        {
            title: "Notifications",
            link: "/notification",
            icon: "notifications",
            aria: "Lien pour voir vos notifications",
            tooltip: "Notifications reçues",
            id: "NotificationsObj",
            hoverClass: "nav-bell-hover nav-yellow-hover",
            hidden: true
        },
        {
            title: "Objets",
            link: "/object",
            icon: "view_in_ar",
            aria: "Lien pour voir aller au gestionnaire d'objets",
            tooltip: "Gestionnaire d'objets",
            id: "ObjectManagerObj",
            hoverClass: "nav-obj-manager-hover",
            hidden: true
        },
        {
            title: "Services",
            link: "/service",
            icon: "design_services",
            aria: "Lien pour voir aller aux services",
            tooltip: "Gestionnaire des services",
            id: "ServiceManagerObj",
            hoverClass: "nav-service-manager-hover",
            hidden: true
        },
    ];

    SideNavItemsBottom: SideNavItem[] = [
        {
            // only when user has admin permissions
            title: "Administration",
            link: "/administration",
            icon: "security",
            aria: "Lien vers la page d'administration",
            tooltip: "Page administrateur",
            id: "AdminObj",
            hoverClass: "nav-blue-hover",
            hidden: true,
        },
        {
            // only when developping the app
            title: "Test",
            link: "/test",
            icon: "bug_report",
            aria: "Lien vers la page de test",
            tooltip: "Page de test",
            id: "TestObj",
            hoverClass: "nav-bug-hover",
            hidden: !isDevMode()
        },
        {
            title: "Forum",
            link: "/faq",
            // icon: "auto_stories",
            icon: "category",
            aria: "Lien pour aller sur la page d'aide",
            tooltip: "Aide, support et Q&A",
            id: "FaqObj",
            hoverClass: "nav-blue-hover",
        },
        {
            title: "Compte",
            link: "/connection",
            icon: "account_circle",
            aria: "Lien pour retourner se connecter",
            tooltip: "Se connecter",
            id: "CompteObj",
        },
        {
            title: "Déconnexion",
            link: null,
            icon: "logout",
            aria: "Se déconnecter de son compte",
            tooltip: "Se déconnecter",
            id: "DeconnectionObj",
            class: "nav-red",
            hoverClass: "nav-red-hover",
            hidden: true,
            callback: () => {
                this.disconnect();
                this.router.navigate(["/"], {
                    preserveFragment: true,
                });
            },
        },
    ];

    // manage mobile screen sizes
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
    }

    // buttons animations
    toggled = false;
    toggleSideNav() {
        this.snav.first.toggle();
        this.toggled = this.snav.first.opened;
    }

    disconnect() {
        const dialogRef = this.dialog.open<DialogComponent, DialogDataType, number>(DialogComponent, {
            maxHeight: "90dvh",
            maxWidth: "90dvw",
            data: {
                title: "Déconnexion",
                text: "Voulez vous vraiment vous déconnecter?",
                btnNotOk: "Annuler",
                btnOk: "Me déconnecter",
                warn: true,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // 0 == yes, -1 == no, undefined == cancel (escaped or clicked OOB)
            if (result !== undefined && result >= 0) {
                this.api.auth.disconnect();
            }
        });
    }
}
