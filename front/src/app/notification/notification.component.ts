import { Component } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notification',
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss'
})
export class NotificationComponent {
    notifications: Notification[] = [];

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
    ) {
        if (auth.client == null) {
            router.navigate(["/"]);
            return;
        }

        api.notifications.getAll(auth.client.id, auth.clientToken, { limit: 10 }).subscribe({
            next: (res) => {
                this.notifications = res;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    // TODO use a paginator to swtch page between each paquet of notifications
    // TODO button on each notification to mark as read/unread or delete
}
