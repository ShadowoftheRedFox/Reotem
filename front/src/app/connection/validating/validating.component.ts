import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../services/api.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '../../../services/communication.service';

@Component({
    selector: 'app-validating',
    imports: [
        MatButtonModule,
    ],
    templateUrl: './validating.component.html',
    styleUrl: './validating.component.scss'
})
export class ValidatingComponent implements OnInit {
    private route = inject(ActivatedRoute);
    token = "";

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private com: CommunicationService,
        private router: Router,
    ) {
        if (auth.clientToken.length > 0) {
            router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.token = params["token"];
        });
    }

    launchValidation() {
        // check if token is the one with the session token
        this.api.auth.validate(this.token, this.auth.clientToken).then(() => {
            this.router.navigate([""]);
        });
    }
}
