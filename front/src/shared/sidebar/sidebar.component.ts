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
import { MediaMatcher } from '@angular/cdk/layout';
import { NgClass, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../environments/environment';
import { DialogComponent, DialogDataType } from '../dialog/dialog.component';

const SiteName = environment.title;

type SideNavItem = {
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
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
    constructor(
        private readonly dialog: MatDialog,
        private api: APIService,
        public theme: ThemeService,
        private router: Router,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener("change", this._mobileQueryListener)

        this.initUpdate();
    }

    isAdmin = false;
    readonly SiteName = SiteName;

    getItem(id: string): SideNavItem | null {
        const total = [...this.SideNavItemsBottom, ...this.SideNavItemsTop];

        for (let i = 0; i < total.length; i++) {
            const item = total[i];
            if (item.id == id) return item;
        }

        return null;
    }

    // lance les écoutes de tout les changements possible
    initUpdate() {
        const decoObj = this.getItem("DéconnexionObj");
        const compteObj = this.getItem("CompteObj");
        const msgObj = this.getItem("MessagesObj");
        const likeObj = this.getItem("LikesObj");
        const notifObj = this.getItem("NotificationsObj");
        const recompenseObj = this.getItem("RécompensesObj");
        const paramObj = this.getItem("ParamètresObj");
        const adminObj = this.getItem("AdminObj")
        // // met à jour si le compte change (connexion ou déconnexion d'un compte)
        // this.com.AuthAccountUpdate.subscribe((isConnected) => {
        //     if (decoObj) {
        //         decoObj.hidden = !isConnected;
        //     }
        //     if (compteObj) {
        //         if (isConnected && this.auth.client) {
        //             compteObj.title = /* this.auth.client.SURNAME + " " + */ this.auth.client.name;
        //             compteObj.image = "Icone";
        //             compteObj.tooltip = "Accéder à votre profil";
        //             compteObj.aria = "Lien vers votre page de profil";
        //             compteObj.link = ["/user", this.auth.client.id + ''];
        //             if (paramObj) {
        //                 paramObj.link = ["/user", this.auth.client.id + "", "settings"];
        //                 paramObj.hidden = !isConnected;
        //             }
        //             if (adminObj) {
        //                 adminObj.hidden = !this.auth.hasMorePermissions(ComptePermissions.ADMIN);
        //             }
        //         } else {
        //             compteObj.title = "Compte";
        //             compteObj.link = "/connection";
        //             compteObj.icon = "account_circle";
        //             compteObj.aria = "Lien pour retourner se connecter";
        //             compteObj.tooltip = "Se connecter";
        //             if (paramObj) {
        //                 paramObj.hidden = !isConnected;
        //             }
        //             if (adminObj) {
        //                 adminObj.hidden = true;
        //             }
        //         }
        //     }
        // });

        // // met à jour les notifications
        // this.com.NotifMessageUpdate.subscribe((res) => {
        //     if (msgObj) {
        //         const num = res > 99 ? "99+" : "" + res;
        //         msgObj.notifications = !res ? undefined : num;
        //         msgObj.tooltip = res > 0 ? res + ` message${res > 1 ? "s" : ""} non lu${res > 1 ? "s" : ""}` : "Messagerie";
        //     }
        // });
        // this.com.NotifLikeUpdate.subscribe((res) => {
        //     if (likeObj) {
        //         const num = res > 99 ? "99+" : "" + res;
        //         likeObj.notifications = !res ? undefined : num;
        //         likeObj.tooltip = res > 0 ? res + ` nouveau${res > 1 ? "x" : ""} like${res > 1 ? "s" : ""}` : "Voir vos likes";
        //     }
        // });
        // this.com.NotifGeneralUpdate.subscribe((res) => {
        //     if (notifObj) {
        //         const num = res > 99 ? "99+" : "" + res;
        //         notifObj.notifications = !res ? undefined : num;
        //         notifObj.tooltip = res > 0 ? res + ` notification${res > 1 ? "s" : ""} non lue${res > 1 ? "s" : ""}` : "Notifications reçues";
        //     }
        // });
        // this.com.NotifRewardUpdate.subscribe((res) => {
        //     if (recompenseObj) {
        //         const num = res > 99 ? "99+" : "" + res;
        //         recompenseObj.notifications = !res ? undefined : num;
        //         recompenseObj.tooltip = res > 0 ? res + ` récompense${res > 1 ? "s" : ""} non réclamée${res > 1 ? "s" : ""}` : "Avantages et récompenses";
        //     }
        // });
    }

    // récupère la fonction qui déclenche l'animation
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
            title: "Messages",
            link: "/message",
            icon: "chat",
            aria: "Lien pour accéder à sa messagerie",
            tooltip: "Messagerie",
            id: "MessagesObj",
            hoverClass: "nav-blue-hover",
        }, {
            title: "Messages",
            link: "/message",
            icon: "chat",
            aria: "Lien pour accéder à sa messagerie",
            tooltip: "Messagerie admin",
            id: "MessagesObj",
            hoverClass: "nav-blue-hover",
        },
        {
            title: "Likes",
            link: "/like",
            icon: "favorite",
            aria: "Lien pour découvrir les personnes qui vous ont likés",
            tooltip: "Voir vos likes",
            id: "LikesObj",
            hoverClass: "nav-red-hover",
        },
        {
            title: "Notifications",
            link: "/notification",
            icon: "notifications",
            aria: "Lien pour voir vos notifications",
            tooltip: "Notifications reçues",
            id: "NotificationsObj",
            hoverClass: "nav-bell-hover",
        },
        {
            title: "Récompenses",
            link: "/reward",
            icon: "star",
            aria: "Lien pour voir vos avantages et futures récompense",
            tooltip: "Avantages et récompenses",
            id: "RécompensesObj",
            hoverClass: "nav-yellow-hover",
        },
        {
            title: "Paramètres",
            link: "/user/0/settings",
            icon: "settings",
            aria: "Lien pour aller dans les paramètres",
            tooltip: "Paramètres",
            id: "ParamètresObj",
            hoverClass: "nav-gear-hover",
        },
    ];

    SideNavItemsBottom: SideNavItem[] = [
        {
            // uniquement quand l'utilisateur est admin
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
            // uniquement quand on développe l'application
            title: "Test",
            link: "/test",
            icon: "bug_report",
            aria: "Lien vers la page de test",
            tooltip: "Page de test",
            id: "TestObj",
            hoverClass: "nav-bug-hover",
            hidden: !isDevMode()
        },
        { // TODO Dans le footer?
            title: "Support",
            link: "/support",
            icon: "help",
            aria: "Lien pour aller sur la page d'aide",
            tooltip: "Aide, support et Q&A",
            id: "SupportObj",
            hoverClass: "nav-blue-hover",
        },
        {
            title: "Déconnexion",
            link: null,
            icon: "logout",
            aria: "Se déconnecter de son compte",
            tooltip: "Se déconnecter",
            id: "DéconnexionObj",
            hoverClass: "nav-red-hover",
            hidden: true,
            callback: () => {
                this.disconnect();
                this.router.navigate(["/"], {
                    preserveFragment: true,
                });
            },
        },
        {
            title: "Compte",
            link: "/connection",
            icon: "account_circle",
            aria: "Lien pour retourner se connecter",
            tooltip: "Se connecter",
            id: "CompteObj",
        },
    ];

    // gère les cas téléphone
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
    }

    // pour l'animation de rotation du bouton
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
                text: "Voulez vous vraiment vous déconnecter? Vous ne receverez plus les notifications.",
                btnNotOk: "Annuler",
                btnOk: "Me déconnecter",
                warn: true,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // 0 == oui, -1 == non, undefined == annuler
            // if (result !== undefined && result >= 0) {
            //     this.api.disconnect();
            // }
        });
    }
}
