import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-connection',
    standalone: true,
    imports: [NgTemplateOutlet, SigninComponent, SignupComponent],
    templateUrl: './connection.component.html',
    styleUrl: './connection.component.scss'
})
export class ConnectionComponent {
    constructor(private auth: AuthentificationService, private router: Router) {
        if (auth.clientToken.length > 0) {
            router.navigateByUrl("/");
        }
    }

    connection = true;

    changeConnection() {
        this.connection = !this.connection;
    }
}
