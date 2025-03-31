import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-test',
    imports: [
        RouterLink,
        MatButtonModule,
        MatTimepickerModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss'
})
export class TestComponent {

}
