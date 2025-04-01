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
import { PopupService } from '../../services/popup.service';

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

    requestedUser = "";
    // if it's the own user looking at his profile
    privateMode = false;

    user: User | null = null;
    maxUserLevel = LevelBeginner;

    imageHover = false;
    imgSource = '';

    usernameGroup = new FormGroup({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
    });
    sexeGroup = new FormGroup({
        sexe: new FormControl<UserSexe>('Autre', [Validators.required]),
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
        private com: CommunicationService,
        private popup: PopupService,
    ) {
        // get the id params
        route.params.subscribe(res => {
            this.requestedUser = res["id"];
            this.privateMode = auth.client?.id === this.requestedUser;

            api.user.get(this.requestedUser, auth.clientToken).subscribe({
                next: (res) => {
                    this.user = res;
                    this.imgSource = this.BaseUrl + this.user.id + '.webp';

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
                        this.user.age = `${new Date(Date.now()).getFullYear() - new Date(this.user?.age).getFullYear()}`;
                        this.sexeGroup.setValue({ sexe: this.user.sexe });
                        this.emailGroup.setValue({ email: this.user.email, password: '' });
                        this.usernameGroup.setValue({ firstname: this.user.firstname, lastname: this.user.lastname });
                    }
                },
                error: () => {
                    this.user = null;
                    this.requestedUser = "";
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
            if (typeof reader.result == 'string') {
                this.api.user.changeImg(
                    this.auth.client?.id as string,
                    reader.result.split(',')[1],
                    this.auth.clientToken
                ).subscribe({
                    next: () => {
                        this.imgSource = reader.result as string;
                        this.com.UpdateUserImage.next(this.imgSource);
                        this.popup.openSnackBar({
                            message: "Image changée"
                        });
                    },
                    error: () => {
                        this.popup.openSnackBar({
                            message: "Échec de l'interaction"
                        });
                    }
                });
            }
        };
        reader.onerror = () => {
            this.popup.openSnackBar({
                message: "Imge invalide"
            });
        };
    }
    // TODO send to api, and like when connecting, use a challenge
    changeUsername() {
        if (this.usernameGroup.invalid) return;

        this.api.user.update(this.auth.client?.id as string, this.auth.clientToken, {
            firstname: this.usernameGroup.value.firstname as string,
            lastname: this.usernameGroup.value.lastname as string,
        }).subscribe({
            next: () => {
                if (this.user) {
                    this.user.firstname = this.usernameGroup.value.firstname as string;
                    this.user.lastname = this.usernameGroup.value.lastname as string;
                }
                this.com.AuthAccountUpdate.next(this.user);
                this.popup.openSnackBar({
                    message: "Nom/Prénom changé(s)"
                });
            },
            error: () => {
                this.popup.openSnackBar({
                    message: "Échec de l'interaction"
                });
            }
        })
    }
    changeEmail() {
        if (this.emailGroup.invalid) return;
        if (this.emailGroup.value.email == this.user?.email) {
            this.emailGroup.controls.email.setErrors({ same: true });
        }
        // TODO update le validated à false
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
        } else if (ctrl.hasError('same')) {
            return 'Nouvelle adresse email identique à l\'ancienne';
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
