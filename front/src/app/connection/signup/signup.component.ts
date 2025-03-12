import { APIService } from '../../../services/api.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { CommunicationService } from '../../../services/communication.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { delay } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    @Output() changeConnection = new EventEmitter<void>();

    signup = new FormGroup({
        name: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
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
        // écoute les changement et lance la fonction si le dernier changement date d'il y a 300ms
        // arrete d'écouter quand le composant n'est plus montré
        this.signup.controls.name.valueChanges.pipe(delay(300), takeUntilDestroyed()).subscribe(res => {
            // check si la combinaison name + surname existe déjà
            if (res) {
                // api.checkPrenomNom(res).subscribe(apires => {
                //     if (apires.success) {
                //         if (apires.data === false) {
                //             this.signup.controls.name.setErrors({ taken: true });
                //         }
                //     }
                // });
            }
        });

        this.signup.controls.email.valueChanges.pipe(delay(300), takeUntilDestroyed()).subscribe(res => {
            // check si c'est un email valide (le validators s'en occupe)
            if (res && this.signup.controls.email.valid) {
                // vérifie qu'il n'est déjà pas utilisé
                // api.checkMail(res).subscribe(apires => {
                //     if (apires.success) {
                //         if (apires.data === false) {
                //             this.signup.controls.email.setErrors({ taken: true });
                //         }
                //     }
                // });
            }
        });
        this.signup.controls.password.valueChanges.pipe(delay(300), takeUntilDestroyed()).subscribe(res => {
            // check si le mdp est valide (maj, chiffre, char spé...)
            if (res) {

            }
        });
        this.signup.controls.passwordConfirm.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            // check si le mdp est valide (maj, chiffre, char spé...)
            if (res != this.signup.controls.password.value && res != null && res.length > 0) {
                this.signup.controls.passwordConfirm.setErrors({ confirm: true });
            }
        });
    }

    mailErrorMessage() {
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

    nameErrorMessage() {
        if (this.signup.controls.name.hasError('required')) {
            return 'Nom requis';
        } else if (this.signup.controls.name.hasError('taken')) {
            return 'Nom déjà utilisé'
        } else {
            return '';
        }
    }

    passwordErrorMessage() {
        if (this.signup.controls.password.hasError('required')) {
            return 'Mot de passe requis';
        } else {
            return '';
        }
    }

    passwordConfirmErrorMessage() {
        if (this.signup.controls.passwordConfirm.hasError('required')) {
            return 'Vous devez confirmer votre mot de passe';
        } else if (this.signup.controls.passwordConfirm.hasError('confirm')) {
            return 'Les mots de passe ne sont pas identiques';
        } else {
            return '';
        }
    }

    testSignup() {
        if (!this.signup.valid) return;
        if (this.signup.value.email && this.signup.value.password && this.signup.value.name) {
            // this.api.signup(this.signup.value.name, this.signup.value.email, this.signup.value.password).subscribe(res => {
            //     if (res.success && res.data) {
            //         this.auth.client = {
            //             id: res.data,
            //             name: this.signup.value.name!,
            //             createdDate: new Date(),
            //         }
            //         this.auth.clientPerms = ComptePermissions.MEMBER;
            //         this.com.AuthAccountUpdate.next(true);
            //         this.route.navigate(["/"]);
            //         // TODO lancer le questionnaire
            //     }
            // });
        }
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
