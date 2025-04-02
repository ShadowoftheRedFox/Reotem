import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/api.model';
import { AnyObject } from '../models/domo.model';

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
    AuthAccountUpdate = new Subject<User | null>();
    // event launcher on session token received
    AuthTokenUpdate = new Subject<string>();

    // event to update all objects
    DomoAllObjectsUpdate = new Subject<AnyObject[]>();
    // event to update only a subset of objects
    DomoSubsetObjectsUpdate = new Subject<AnyObject[]>();

    // will carry the last requested objects
    DomoObjects: AnyObject[] = [];
    DomoSubsetObjects: AnyObject[] = [];
    // will carry the total amount found by the api
    DomoObjectsAmount = 0;
    DomoSubsetObjectsAmount = 0;

    // event when image changes
    UpdateUserImage = new Subject<string>();

    constructor() {
        // listen to the update to remember them (prevent multiple api request)
        this.DomoAllObjectsUpdate.subscribe(res => {
            this.DomoObjects = res;
        });
        this.DomoSubsetObjectsUpdate.subscribe(res => {
            this.DomoSubsetObjects = res;
        });
    }
}
