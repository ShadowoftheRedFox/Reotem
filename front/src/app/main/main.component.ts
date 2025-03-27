import { Component } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AnyObject } from '../../models/domo.model';
import { DomoComponent } from '../../shared/domo/domo.component';
import { CookieTime } from '../../models/cookie.model';
import { RouterLink } from '@angular/router';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        DomoComponent,
        RouterLink,
        CdkDrag,
        CdkDropList,
        MatIconModule
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
        private api: APIService,
        private auth: AuthentificationService
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

        const mainOrder = auth.getCookie("main_order");
        if (mainOrder.length == 0) {
            auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
        } else {
            this.order = JSON.parse(mainOrder);
        }
    }

    order = ["recent", "all", "problem"];

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.order, event.previousIndex, event.currentIndex);
        this.auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
    }
}
