import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-test',
    imports: [
        RouterLink,
        MatButtonModule
    ],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss'
})
export class TestComponent {

}
