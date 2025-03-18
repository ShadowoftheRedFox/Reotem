import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 *
 * Used to send events between services and component withou having circular depencies.
 * SHOULD NEVER INCLUDE A SERVICE IN HIMSELF.
 *
 */

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {

    // event launcher when receiving a notification
    NotifUpdate = new Subject<number>();

    // event launcher to tell if we connect or disconnect
    AuthAccountUpdate = new Subject<boolean>();
    // event launcher on session token received
    AuthTokenUpdate = new Subject<string>();
}
