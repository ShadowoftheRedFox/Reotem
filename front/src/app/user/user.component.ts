import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service';
import { APIService } from '../../services/api.service';
import { CommunicationService } from '../../services/communication.service';
import { LevelAdvanced, LevelBeginner, LevelExpert, User } from '../../models/api.model';
import { ErrorComponent } from '../error/error.component';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user',
    imports: [
        ErrorComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule
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

    maxUserLevel = LevelBeginner;

    imageHover = false;
    changingPassword = false;
    changingPasswordGroup = new FormGroup({
        oldpassword: new FormControl('', [Validators.required]),
        newpassword: new FormControl('', [Validators.required]),
    });

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

            api.user.get(this.requestedUser, auth.clientToken).subscribe({
                next: (res) => {
                    this.user = res;
                    switch (this.user.lvl) {
                        case 'Débutant':
                            this.maxUserLevel = LevelBeginner;
                            break;
                        case 'Avancé':
                            this.maxUserLevel = LevelAdvanced;
                            break;
                        case 'Expert':
                            this.maxUserLevel = LevelExpert;
                            break;
                    }
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

        this.changingPasswordGroup.controls.newpassword.valueChanges.subscribe(res => {
            // check password strength
            if (typeof res != 'string' || res.length < 8) {
                return this.changingPasswordGroup.controls.newpassword.setErrors({ short: true });
            }
        })
    }

    // TODO send password to back, and create formcontrol
    changePaswword() {
        if (this.changingPasswordGroup.invalid) return;
        this.changingPassword = false;
    }

    oldpasswordError() {
        const ctrl = this.changingPasswordGroup.controls.oldpassword;
        if (ctrl.hasError('required')) {
            return 'Mot de passe requis';
        } else if (ctrl.hasError('invalid')) {
            return 'Mot de passe incorrect'
        } else {
            return '';
        }
    }

    newpasswordError() {
        const ctrl = this.changingPasswordGroup.controls.newpassword;
        if (ctrl.hasError('required')) {
            return 'Mot de passe requis';
        } else if (ctrl.hasError('short')) {
            return 'Mot de passe trop court'
        } else {
            return '';
        }
    }

    oldPasswordHidden = signal(true);
    hideOldPassword(event: MouseEvent) {
        this.oldPasswordHidden.set(!this.oldPasswordHidden());
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }

    newPasswordHidden = signal(true);
    hideNewPassword(event: MouseEvent) {
        this.newPasswordHidden.set(!this.newPasswordHidden());
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }
}
