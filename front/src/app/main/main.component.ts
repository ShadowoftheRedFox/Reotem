import { Component } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AnyObject } from '../../models/domo.model';
import { DomoComponent } from '../../shared/domo/domo.component';
import { CookieTime } from '../../models/cookie.model';
import { RouterLink } from '@angular/router';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { AuthentificationService } from '../../services/authentification.service';
import { CommunicationService } from '../../services/communication.service';
import { ServiceNames } from '../service-manager/service-manager.component';

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

    order = ["recent", "service", "all", "problem"];
    readonly serviceNames = ServiceNames;


    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private com: CommunicationService
    ) {
        // listen to event change
        com.DomoAllObjectsUpdate.subscribe(update => {
            this.objectList = update;

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
        });

        api.objects.all({}).subscribe(res => {
            com.DomoObjectsAmount = res.total;
            com.DomoAllObjectsUpdate.next(res.objects);
        });

        const mainOrder = auth.getCookie("main_order");
        if (mainOrder.length == 0) {
            auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
        } else {
            this.order = JSON.parse(mainOrder);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.order, event.previousIndex, event.currentIndex);
        this.auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
    }
}
