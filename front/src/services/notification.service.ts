import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';

export type NotificationType = "Image" | "Texte";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private com: CommunicationService) { }
    // TODO check notif with api and show badge with com service
}
