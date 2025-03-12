import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 *
 * Utilisé pour comminuqer entre les services avec principalement des subjects,
 * Sans avoir l'erreur d'inclusion circulaire
 *
 */

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {

    constructor() { }

    // lanceur d'événement quand les notifications change (message, like, notification, récompense...)
    NotifGeneralUpdate = new Subject<number>();
    NotifRewardUpdate = new Subject<number>();
    NotifMessageUpdate = new Subject<number>();
    NotifLikeUpdate = new Subject<number>();

    // lanceur d'événement quand le compte change (connexion ou déconnexion)
    AuthAccountUpdate = new Subject<boolean>();
    // lanceur d'événement quand on reçoit le token
    AuthTokenUpdate = new Subject<string>();

    // pour se reconnecter au server websocket
    SocketReconnect = new Subject<any>();
}
