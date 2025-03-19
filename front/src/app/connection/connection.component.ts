import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";

@Component({
    selector: 'app-connection',
    standalone: true,
    imports: [NgTemplateOutlet, SigninComponent, SignupComponent],
    templateUrl: './connection.component.html',
    styleUrl: './connection.component.scss'
})
export class ConnectionComponent {
    connection = true;

    changeConnection() {
        this.connection = !this.connection;
    }
}
