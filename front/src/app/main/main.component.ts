import { Component } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AnyObject } from '../../models/domo.model';
import { DomoComponent } from '../../shared/domo/domo.component';
import { CookieTime } from '../../models/cookie.model';
import { RouterLink } from '@angular/router';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { AuthentificationService } from '../../services/authentification.service';
import { CommunicationService } from '../../services/communication.service';
import { Service, ServiceNames } from '../service-manager/service-manager.component';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// fixed number of items in order, reset automatically the cookie if it changes
const OrderItems = 4;

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        DomoComponent,
        RouterLink,
        CdkDrag,
        CdkDragHandle,
        CdkDropList,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    readonly bar_class = 'bar-class w-full flex flex-row justify-start overflow-y-auto gap-4 items-stretch px-4';
    objectList: AnyObject[] = [];
    recentlyUsed: AnyObject[] = [];

    filteredObjectList: AnyObject[] = [];
    filteredRecentlyUsed: AnyObject[] = [];

    problemsObject: AnyObject[] = [];

    order = ["recent", "service", "all", "problem"];
    readonly servicesList = ServiceNames;

    namedFilter = "";
    noNamedFilterResult = false;

    filteredBuilding = new FormControl<string[]>([]);
    buildingList: string[] = [];

    filteredRoom = new FormControl<string[]>([]);
    roomList: string[] = [];

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private com: CommunicationService
    ) {
        // listen to event change
        com.DomoAllObjectsUpdate.subscribe(update => {
            this.objectList = update;
            this.buildingList = [];
            this.roomList = [];
            this.filteredBuilding.reset([]);
            this.filteredRoom.reset([]);
            this.namedFilter = "";

            const now = new Date();
            this.objectList.forEach(o => {
                if (new Date(o.lastInteraction).getTime() >= now.getTime() - CookieTime.Day * 1000) {
                    this.recentlyUsed.push(o);
                }
                if (o.building != undefined && !this.buildingList.includes(o.building)) {
                    this.buildingList.push(o.building);
                }
                if (!this.roomList.includes(o.room)) {
                    this.roomList.push(o.room);
                }
            });

            this.applyFilter();

            this.objectList.forEach(o => {
                if (o.state != "Normal") {
                    this.problemsObject.push(o);
                }
            })
        });

        // load objects
        api.objects.all({}).subscribe(res => {
            com.DomoObjectsAmount = res.total;
            com.DomoAllObjectsUpdate.next(res.objects);
        });

        // get the wanted order
        const mainOrder = auth.getCookie("main_order");
        if (mainOrder.length != OrderItems) {
            auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
        } else {
            this.order = JSON.parse(mainOrder);
        }

        // listen for filters
        this.filteredRoom.valueChanges.subscribe(() => {
            this.applyFilter();
        });
        this.filteredBuilding.valueChanges.subscribe(() => {
            this.applyFilter();
        });
    }

    resetRoomFilter() {
        this.filteredRoom.setValue([]);
    }
    resetBuildingFilter() {
        this.filteredBuilding.setValue([]);
    }

    inFilteredRoom(room: string) {
        if (this.filteredRoom.value == null || this.filteredRoom.value.length == 0) return true;
        return this.filteredRoom.value.includes(room);
    }

    inFilteredBuilding(building?: string) {
        if (this.filteredBuilding.value == null || this.filteredBuilding.value.length == 0) return true;
        if (building === undefined) return false;
        return this.filteredBuilding.value.includes(building);
    }

    applyFilter() {
        this.filteredObjectList = [];
        this.filteredRecentlyUsed = [];
        this.objectList.forEach(o => {
            if (this.inFilteredRoom(o.room) && this.inFilteredBuilding(o.building)) {
                this.filteredObjectList.push(o);
            }
        });
        this.recentlyUsed.forEach(o => {
            if (this.inFilteredRoom(o.room) && this.inFilteredBuilding(o.building)) {
                this.filteredRecentlyUsed.push(o);
            }
        });
    }

    namedFilterChange() {
        let atLeastOneObj = false;
        for (const obj of this.objectList) {
            if (this.applyNamedFilter(obj)) {
                atLeastOneObj = true;
                break;
            }
        }

        let atLeastOneService = false;
        for (const ser of this.servicesList) {
            if (this.applyNamedFilter(undefined, ser)) {
                atLeastOneService = true;
                break;
            }
        }

        this.noNamedFilterResult = !atLeastOneObj && !atLeastOneService;
    }

    applyNamedFilter(obj?: AnyObject, service?: Service) {
        if (obj === undefined && service === undefined) return false;
        const filter = this.namedFilter.toLowerCase();

        if (service != undefined) {
            return service.name.toLowerCase().includes(filter);
        }

        if (obj != undefined) {
            let res = false;
            if (obj.building != undefined && obj.building.toLowerCase().includes(filter)) {
                res = true;
            }
            if (
                obj.room.toLowerCase().includes(filter) ||
                obj.name.toLowerCase().includes(filter) ||
                obj.state.toLowerCase().includes(filter) ||
                obj.connection.toLowerCase().includes(filter)
            ) {
                res = true;
            }

            return res;
        }

        return false;
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.order, event.previousIndex, event.currentIndex);
        this.auth.setCookie("main_order", JSON.stringify(this.order), CookieTime.Year, "/");
    }
}
