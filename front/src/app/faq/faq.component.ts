import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-faq',
    imports: [
        MatExpansionModule,
        MatIcon
    ],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent {

}
