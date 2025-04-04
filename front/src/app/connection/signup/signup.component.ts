import { APIService } from '../../../services/api.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { CommunicationService } from '../../../services/communication.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from "@angular/material/select"
import { UserMaxAge, UserMinAge, UserRole, UserSexe } from '../../../models/api.model';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    @Output() changeConnection = new EventEmitter<void>();

    readonly userRole = UserRole;
    readonly userSexe = UserSexe;
    readonly userMinAge = UserMinAge;
    readonly userMaxAge = UserMaxAge;

    signup = new FormGroup({
        firstname: new FormControl("", [Validators.required]),
        lastname: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        sexe: new FormControl("", [Validators.required]),
        age: new FormControl(18, [Validators.required, Validators.min(UserMinAge), Validators.max(UserMaxAge)]),
        role: new FormControl("", [Validators.required]),
        password: new FormControl("", [Validators.required]),
        passwordConfirm: new FormControl("", [Validators.required]),
    });

    passwordHidden = signal(true);
    passwordConfirmHidden = signal(true);

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private route: Router,
        private com: CommunicationService,
    ) {
        // take until destro to prevent multiple listener when component is hidden
        // no need to check if username and/or mail is unique, api do that when creating the account
        // they would only know though when hitting create
        this.signup.controls.firstname.valueChanges.pipe(takeUntilDestroyed()).subscribe((res) => {
            if (res == null) return;
            // valid char
            if (!res.match(/^[a-zA-Z\-éêèñïîûùàã ]+$/gis)) return this.signup.controls.firstname.setErrors({ invalid: true });
            // should not have multiple space or dash or start/end by either
            if (res.match(/^[ \-\s]+|(?: {2,}|--|- | -)|[ \-\s]{1}$/)) return this.signup.controls.firstname.setErrors({ invalid: true });

        });
        this.signup.controls.lastname.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // valid char
            if (!res.match(/^[a-zA-Z\-éêèñïîûùàã ]+$/gis)) return this.signup.controls.lastname.setErrors({ invalid: true });
            // should not have multiple space or dash or start/end by either
            if (res.match(/^[ \-\s]+|(?: {2,}|--|- | -)|[ \-\s]{1}$/)) return this.signup.controls.lastname.setErrors({ invalid: true });

        });

        this.signup.controls.email.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // don't allow "+" in mails
            if (res.includes("+")) return this.signup.controls.email.setErrors({ email: true });
        });

        this.signup.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            // check password strength
            if (typeof res != 'string' || res.length < 8) {
                return this.signup.controls.password.setErrors({ short: true });
            }
        });

        this.signup.controls.passwordConfirm.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            // check password equals
            if (res != this.signup.controls.password.value && res != null && res.length > 0) {
                this.signup.controls.passwordConfirm.setErrors({ confirm: true });
            }
        });
    }

    emailErrorMessage() {
        if (this.signup.controls.email.hasError('required')) {
            return 'Adresse email requise';
        } else if (this.signup.controls.email.hasError('email')) {
            return 'Adresse email invalide';
        } else if (this.signup.controls.email.hasError('taken')) {
            return 'Adresse email déjà utilisée';
        } else {
            return '';
        }
    }

    firstnameErrorMessage() {
        if (this.signup.controls.firstname.hasError('required')) {
            return 'Prénom requis';
        } else if (this.signup.controls.firstname.hasError('taken')) {
            return 'Prénom/Nom déjà utilisés';
        } else if (this.signup.controls.firstname.hasError('invalid')) {
            return 'Prénom invalide';
        } else {
            return '';
        }
    }

    lastnameErrorMessage() {
        if (this.signup.controls.lastname.hasError('required')) {
            return 'Nom requis';
        } else if (this.signup.controls.lastname.hasError('taken')) {
            return 'Prénom/Nom déjà utilisés';
        } else if (this.signup.controls.lastname.hasError('invalid')) {
            return 'Nom invalide';
        } else {
            return '';
        }
    }

    ageErrorMessage() {
        if (this.signup.controls.age.errors != null) {
            return "Âge invalide";
        } else {
            return "";
        }
    }

    passwordErrorMessage() {
        if (this.signup.controls.password.hasError('required')) {
            return 'Mot de passe requis';
        } else if (this.signup.controls.password.hasError('short')) {
            return 'Mot de passe trop court';
        } else {
            return '';
        }
    }

    passwordConfirmErrorMessage() {
        if (
            this.signup.controls.passwordConfirm.hasError('required') &&
            this.signup.controls.password.value != null &&
            this.signup.controls.password.value.length > 0
        ) {
            return 'Confirmez votre mot de passe';
        } else if (this.signup.controls.passwordConfirm.hasError('confirm')) {
            return 'Mots de passe différents';
        } else {
            return '';
        }
    }

    testSignup() {
        if (!this.signup.valid) return;

        this.api.auth.create(
            this.signup.value.firstname!,
            this.signup.value.lastname!,
            this.signup.value.email!,
            this.signup.value.age!,
            this.signup.value.role as UserRole,
            this.signup.value.sexe as UserSexe,
            this.signup.value.password!,
        ).subscribe({
            next: res => {
                this.com.AuthTokenUpdate.next(res.session);
                this.com.AuthAccountUpdate.next(res.user);
                this.route.navigate(["user", res.user.id]);
            },
            error: err => {
                if (!err.error.message) {
                    return console.error(err);
                }
                const error = err.error.message;
                console.log(error);
                if (error.email) {
                    this.signup.controls.email.setErrors({ taken: true });
                }
                if (error.name) {
                    this.signup.controls.firstname.setErrors({ taken: true });
                    this.signup.controls.lastname.setErrors({ taken: true });
                }
            }
        });
    }

    hidePassword(event: MouseEvent) {
        this.passwordHidden.set(!this.passwordHidden());
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }

    hideConfirmPassword(event: MouseEvent) {
        this.passwordConfirmHidden.set(!this.passwordConfirmHidden());
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }
}
