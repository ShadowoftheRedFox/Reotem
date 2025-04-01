import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink
    ],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent implements AfterViewInit {
    directory = window.location.pathname;
    count = 0;
    number = 0;

    ngAfterViewInit(): void {
        const inter = setInterval(() => {
            this.count += 1;
            this.number = Math.floor(Math.random() * 999);
            if (this.count >= 404) {
                this.number = 404;
                clearInterval(inter);
            }
        }, 5)
    }
}
