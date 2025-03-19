import { Component, signal } from '@angular/core';
import { AuthentificationService } from '../../../services/authentification.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-lost',
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    templateUrl: './lost.component.html',
    styleUrl: './lost.component.scss'
})
export class LostComponent {
    // switch between password and mail
    lostType = true;

    // once the api call is made
    lostSent = false;

    constructor(private auth: AuthentificationService, private router: Router) {
        if (auth.clientToken.length > 0) {
            // TODO re enable this once finished
            //return router.navigateByUrl("/");
        }

        this.lostPassword.controls.email.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // don't allow "+" in mails
            if (res.includes("+")) return this.lostPassword.controls.email.setErrors({ email: true });
        });

        this.lostMail.controls.firstname.valueChanges.pipe(takeUntilDestroyed()).subscribe((res) => {
            if (res == null) return;
            // valid char
            if (!res.match(/^[a-zA-Z\-éêèñïîûùàã ]+$/gis)) return this.lostMail.controls.firstname.setErrors({ invalid: true });
            // should not have multiple space or dash or start/end by either
            if (res.match(/^[ \-\s]+|(?: {2,}|--|- | -)|[ \-\s]{1}$/)) return this.lostMail.controls.firstname.setErrors({ invalid: true });

        });

        this.lostMail.controls.lastname.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // valid char
            if (!res.match(/^[a-zA-Z\-éêèñïîûùàã ]+$/gis)) return this.lostMail.controls.lastname.setErrors({ invalid: true });
            // should not have multiple space or dash or start/end by either
            if (res.match(/^[ \-\s]+|(?: {2,}|--|- | -)|[ \-\s]{1}$/)) return this.lostMail.controls.lastname.setErrors({ invalid: true });

        });

        this.changingEmail.controls.newEmail.valueChanges.pipe(takeUntilDestroyed()).subscribe(res => {
            if (res == null) return;
            // don't allow "+" in mails
            if (res.includes("+")) return this.changingEmail.controls.newEmail.setErrors({ email: true });
        });
    }

    lostPassword = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email])
    });

    lostMail = new FormGroup({
        firstname: new FormControl("", [Validators.required]),
        lastname: new FormControl("", [Validators.required]),
        password: new FormControl("", [Validators.required]),
        // TODO find another thing to ask, like a secret or something like that
    });

    changingEmail = new FormGroup({
        newEmail: new FormControl("", [Validators.required, Validators.email]),
    });

    emailErrorMessage() {
        if (this.lostPassword.controls.email.hasError('required')) {
            return 'Adresse email requise';
        } else if (this.lostPassword.controls.email.hasError('email')) {
            return 'Adresse email invalide';
        } else {
            return '';
        }
    }

    newEmailErrorMessage() {
        if (this.changingEmail.controls.newEmail.hasError('required')) {
            return 'Adresse email requise';
        } else if (this.changingEmail.controls.newEmail.hasError('email')) {
            return 'Adresse email invalide';
        } else {
            return '';
        }
    }

    firstnameErrorMessage() {
        if (this.lostMail.controls.firstname.hasError('required')) {
            return 'Prénom requis';
        } else if (this.lostMail.controls.firstname.hasError('invalid')) {
            return 'Prénom invalide';
        } else {
            return '';
        }
    }

    lastnameErrorMessage() {
        if (this.lostMail.controls.lastname.hasError('required')) {
            return 'Nom requis';
        } else if (this.lostMail.controls.lastname.hasError('invalid')) {
            return 'Nom invalide';
        } else {
            return '';
        }
    }

    passwordErrorMessage() {
        if (this.lostMail.controls.password.hasError('required')) {
            return 'Mot de passe requis';
        } else {
            return '';
        }
    }

    sendLostPassword() {
        this.lostSent = true;
        // TODO send api request for resetting password
    }

    sendLostEmail() {
        this.lostSent = true;
        // TODO send api request for changing email
    }

    confirmEmailChange() {
        // TODO send api a new password, then send email to tell to validate
        // once validated, change password
        // block any new change

        // TODO make mail validation timeout possible
    }

    toMainMenu() {
        this.router.navigate(["/"]);
    }

    passwordHidden = signal(true);
    hidePassword(event: MouseEvent) {
        this.passwordHidden.set(!this.passwordHidden());
        // empeche les autres objetsqui devrait l'avoir de l'avoir
        event.stopPropagation();
    }
}
