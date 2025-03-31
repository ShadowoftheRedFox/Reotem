import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';
import { APIService } from './api.service';
import { AuthentificationService } from './authentification.service';
import { PopupService } from './popup.service';

export type NotificationType = "Image" | "Texte";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private popup: PopupService
    ) {
        com.AuthAccountUpdate.subscribe(user => {
            if (user == null) return;
            api.notifications.getNum(user.id, auth.clientToken).subscribe({
                next: res => {
                    if (res.amount == 0) return;
                    com.NotifUpdate.next(res.amount);
                    const s = res.amount > 1 ? 's' : '';
                    popup.openSnackBar({
                        message: `Vous avez ${res.amount} notification${s} non lue${s}`,
                        duration: 5000,
                        politeness: "polite"
                    });
                },
                error: () => {
                    // catch but do nothing
                }
            });
        });
    }
}
