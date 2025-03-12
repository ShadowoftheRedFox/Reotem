import { Component, EventEmitter, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { APIService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { CommunicationService } from '../../../services/communication.service';

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
        // arrete d'écouter quand le composant n'est plus montré
        this.signin.controls.email.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            // check si c'est un email valide
            if (res) {
                // le validators s'en occupe
            }
        });
        this.signin.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            // check si le password est valide
            // TODO nombre d'essais?
            if (res) {

            }
        });
    }

    mailErrorMessage() {
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
            // this.api.signin(this.signin.controls.email.value, this.signin.controls.password.value).subscribe({
            //     next: res => {
            //         if (res.success) {
            //             if (res.data == 0) {
            //                 // incorrect
            //                 // TODO un timeout ici ou via l'api?
            //                 setTimeout(() => {
            //                     this.signin.setErrors({ invalid: true });
            //                 }, 3000);
            //             } else if (res.data == -1) {
            //                 // timeout
            //                 // TODO un spinner/décompte ici et sur l'API
            //                 this.signin.setErrors({ timeout: true });
            //             } else if (res.data != null && res.data >= 1) {
            //                 this.api.sidUpdate.next("");
            //                 this.com.AuthAccountUpdate.next(false);
            //                 this.api.sidUpdate.next(res.sid);
            //                 // se connecter: récupérer le nom etc
            //                 this.api.authenticate(res.data);
            //                 // se reconnecte au websocket pour le token
            //                 this.socket.socketReconnect();
            //                 // redirige à la page pricipale
            //                 this.router.navigate(["/"], {
            //                     preserveFragment: true,
            //                 });
            //             }
            //         }
            //     },
            //     error: err => {
            //         // console.error(err);
            //     }
            // });
        }
    }

    hidePassword(event: MouseEvent) {
        this.passwordHidden = !this.passwordHidden;
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }

    oublie() {
        // TODO
    }
}
