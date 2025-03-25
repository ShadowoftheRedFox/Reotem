import { Component } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AnyObject } from '../../models/domo.model';
import { DomoComponent } from '../../shared/domo/domo.component';
import { CookieTime } from '../../models/cookie.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        DomoComponent,
        RouterLink
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    readonly bar_class = 'bar-class w-full flex flex-row flex-nowrap justify-start overflow-y-auto gap-4 items-stretch px-4';
    objectList: AnyObject[] = [];
    recentlyUsed: AnyObject[] = [];
    problemsObject: AnyObject[] = [];

    constructor(
        private api: APIService
    ) {
        api.objects.all({ limit: 20 }).subscribe(res => {
            this.objectList = res.objects;

            // TODO find a way for recently used (local storage?), we look at the date at the moment
            const now = new Date();
            this.objectList.forEach(o => {
                if (new Date(o.lastInteraction).getTime() >= now.getTime() - CookieTime.Day * 1000) {
                    this.recentlyUsed.push(o);
                }
            })

            this.objectList.forEach(o => {
                if (o.state != "Normal") {
                    this.problemsObject.push(o);
                }
            })

            // console.log(res.objects[0]);
        });
    }
}
