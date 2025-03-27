import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service';
import { APIService } from '../../services/api.service';
import { CommunicationService } from '../../services/communication.service';
import { User } from '../../models/api.model';
import { ErrorComponent } from '../error/error.component';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-user',
    imports: [
        ErrorComponent
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
    readonly BaseUrl = environment.api_url;

    requestedUser = -1;
    // if it's the own user looking at his profile
    privateMode = false;

    user: User | null = null;

    constructor(
        private route: ActivatedRoute,
        private auth: AuthentificationService,
        private api: APIService,
        private com: CommunicationService
    ) {
        // get the id params
        route.params.subscribe(res => {
            this.requestedUser = Number(res["id"]);
            this.privateMode = auth.client?.id === this.requestedUser;

            api.user.get(this.requestedUser, this.auth.clientToken).subscribe({
                next: (res) => {
                    this.user = res;
                },
                error: () => {
                    this.user = null;
                    this.requestedUser = -2;
                },
            });
        });
        // check also when user change
        com.AuthAccountUpdate.subscribe(user => {
            if (user == null) {
                this.privateMode = false;
            } else if (user.id == this.requestedUser) {
                this.privateMode = true;
            }
        });
    }

    // TODO create a good ui
}
