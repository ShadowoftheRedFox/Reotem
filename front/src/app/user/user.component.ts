import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service';
import { APIService } from '../../services/api.service';
import { CommunicationService } from '../../services/communication.service';
import { LevelAdvanced, LevelBeginner, LevelExpert, User, UserSexe } from '../../models/api.model';
import { ErrorComponent } from '../error/error.component';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-user',
    imports: [
        ErrorComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTooltipModule,
        MatSelectModule,
        MatExpansionModule,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
    readonly BaseUrl = environment.api_url;
    readonly UserSexe = UserSexe;

    requestedUser = -1;
    // if it's the own user looking at his profile
    privateMode = false;

    user: User | null = null;
    maxUserLevel = LevelBeginner;

    imageHover = false;
    imgSource = '';

    usernameGroup = new FormGroup({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    sexeGroup = new FormGroup({
        sexe: new FormControl<UserSexe>('Autre', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    emailGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    passwordGroup = new FormGroup({
        oldpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        newpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
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
                    this.imgSource = this.BaseUrl + this.user.id + '.jpg';

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

                    if (this.privateMode) {
                        this.sexeGroup.setValue({ sexe: this.user.sexe, password: '' });
                        this.emailGroup.setValue({ email: this.user.email, password: '' });
                        this.usernameGroup.setValue({ firstname: this.user.firstname, lastname: this.user.lastname, password: '' });
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

        this.passwordGroup.controls.newpassword.valueChanges.subscribe(res => {
            // check password strength
            if (typeof res != 'string' || res.length < 8) {
                return this.passwordGroup.controls.newpassword.setErrors({ short: true });
            }
        })
    }

    changeImage(event: Event) {
        if (!event || !event.target) return;
        const input = (event.target as HTMLInputElement);
        if (!input.files || input.files.length == 0) return;
        const file = input.files.item(0) as File;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // TODO send to back
            console.log(reader.result);
            if (typeof reader.result == 'string') {
                this.imgSource = reader.result;
            }
        };
        reader.onerror = (err) => {
            console.warn('Error while reading image: ', err);
        };
    }
    // TODO send to api, and like when connecting, use a challenge
    changeUsername() {
        if (this.usernameGroup.invalid) return;
    }
    changeEmail() {
        if (this.emailGroup.invalid) return;
    }
    changeSexe() {
        if (this.sexeGroup.invalid) return;
    }
    // TODO send password to back, and create formcontrol
    changePaswword() {
        if (this.passwordGroup.invalid) return;
    }

    genericError(ctrl: FormControl) {
        if (ctrl.hasError('required')) {
            return "Champ requis";
        } else if (ctrl.hasError('email')) {
            return "Email invalide";
        } else if (ctrl.hasError('minlength')) {
            return ctrl.getError('minlength').requiredLength + " caractères requis";
        } else if (ctrl.hasError('invalid')) {
            return 'Mot de passe invalide';
        }
        return '';
    }

    usernamePasswordHidden = signal(true);
    hideUsernamePassword(event: MouseEvent) {
        this.usernamePasswordHidden.set(!this.usernamePasswordHidden());
        event.stopPropagation();
    }

    sexePasswordHidden = signal(true);
    hideSexePassword(event: MouseEvent) {
        this.sexePasswordHidden.set(!this.sexePasswordHidden());
        event.stopPropagation();
    }

    emailPasswordHidden = signal(true);
    hideEmailPassword(event: MouseEvent) {
        this.emailPasswordHidden.set(!this.emailPasswordHidden());
        event.stopPropagation();
    }

    oldPasswordHidden = signal(true);
    hideOldPassword(event: MouseEvent) {
        this.oldPasswordHidden.set(!this.oldPasswordHidden());
        event.stopPropagation();
    }

    newPasswordHidden = signal(true);
    hideNewPassword(event: MouseEvent) {
        this.newPasswordHidden.set(!this.newPasswordHidden());
        event.stopPropagation();
    }
}
