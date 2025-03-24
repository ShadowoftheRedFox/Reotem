import { Component } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AnyObject } from '../../models/domo.model';
import { DomoComponent } from '../../shared/domo/domo.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        DomoComponent
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    objectList: AnyObject[] = [];

    constructor(
        private api: APIService
    ) {
        api.objects.all({ limit: 20 }).subscribe(res => {
            this.objectList = res.objects;

            // console.log(res.objects[0]);
        });
    }
}
