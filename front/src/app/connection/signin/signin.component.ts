import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { APIService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { CommunicationService } from '../../../services/communication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
//import Reotem from '../../../../../back/src/util/functions'

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent {
    @Output() changeConnection = new EventEmitter<void>();

    signin = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });

    passwordHidden = true;

    constructor(
        private api: APIService,
        private router: Router,
        private auth: AuthentificationService,
        private com: CommunicationService,
    ) {
        this.signin.controls.email.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // don't allow "+" in mails
            if (res.includes("+")) return this.signin.controls.email.setErrors({ email: true });
        });
    }

    emailErrorMessage() {
        if (this.signin.controls.email.hasError('required')) {
            return 'Adresse email requise';
        } else if (this.signin.controls.email.hasError('email')) {
            return 'Adresse email invalide';
        } else {
            return '';
        }
    }

    formErrorMessage() {
        if (this.signin.hasError("invalid")) {
            return "Email ou mot de passe incorrect";
        } else if (this.signin.hasError("timeout")) {
            return "Trop de tentatives, réessayez plus tard";
            // TODO envoyer un mail et faire un timeout pour cette utilisateur
        } else {
            return "";
        }
    }

    passwordErrorMessage() {
        if (this.signin.controls.password.hasError('required')) {
            return 'Mot de passe requis';
        } else {
            return '';
        }
    }

    testSignin() {
        if (!this.signin.valid) return;

        if (this.signin.controls.email.value && this.signin.controls.password.value) {
            this.api.auth.login(this.signin.controls.email.value, this.signin.controls.password.value).then(ob => ob.subscribe({
                next: (res) => {
                    const session = res.sessionid;
                    this.com.AuthTokenUpdate.next(session);
                    this.api.auth.get(session).subscribe(res => {
                        this.com.AuthAccountUpdate.next(res);
                        this.router.navigate(["/"]);
                    });
                }, error: (err: HttpErrorResponse) => {
                    if (err.error.message.error == "invalid credentials" || err.error.message == "") {
                        this.signin.setErrors({ invalid: true });
                    }
                }
            }));
        }
    }

    hidePassword(event: MouseEvent) {
        this.passwordHidden = !this.passwordHidden;
        // prevent other element from catching the event
        event.stopPropagation();
    }

    forgotCredentials() {
        this.router.navigate(["connection", "lost"]);
    }
}
