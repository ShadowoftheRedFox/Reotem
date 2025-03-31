import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { APIService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgTemplateOutlet } from '@angular/common';
import { CommunicationService } from '../../services/communication.service';
import { AnyObject } from '../../models/domo.model';
import { MatSelectModule } from '@angular/material/select';

export interface Service {
    name: string;
    id: "electricity" | "maintenance",
    link?: string | string[];
    icon?: string;
    class?: string;
}

export const ServiceNames: Service[] = [
    {
        name: "Gestion d'électricité",
        id: "electricity",
        link: ["/service", "electricity"],
        class: "service-electricity-icon",
        icon: "electric_bolt",
    },
    {
        name: "Maintenance",
        id: "maintenance",
        link: ["/service", "maintenance"],
        class: "service-maintenance",
        icon: "handyman",
    }
] as const;

@Component({
    selector: 'app-service-manager',
    imports: [
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        NgTemplateOutlet,
        MatSelectModule
    ],
    templateUrl: './service-manager.component.html',
    styleUrl: './service-manager.component.scss'
})
export class ServiceManagerComponent {
    readonly tabs = ServiceNames;

    filteredBuilding = new FormControl<string>("");
    buildingList: string[] = [];

    filteredRoom = new FormControl<string>("");
    roomList: string[] = [];

    selectedIndex = 0;
    loading = false;
    objList: AnyObject[] = [];

    electricity = {
        global: 0,
        daily: 0,
    }

    constructor(
        private api: APIService,
        private route: ActivatedRoute,
        private com: CommunicationService
    ) {
        route.params.subscribe(res => {
            for (let i = 0; i < ServiceNames.length; i++) {
                if (ServiceNames[i].id === res['tab']) {
                    this.selectedIndex = i;
                    break;
                }
            }
        });

        // listen to object changes
        this.objList = com.DomoObjects;
        com.DomoAllObjectsUpdate.subscribe(update => {
            this.objList = update;
            this.updateData();
        });
        this.api.objects.all({}).subscribe(res => {
            this.com.DomoObjectsAmount = res.total;
            this.com.DomoAllObjectsUpdate.next(res.objects);
        });

        // reset list if we change the other
        this.filteredBuilding.valueChanges.subscribe(() => {
            this.filteredRoom.reset("", { emitEvent: false });
        });
        this.filteredRoom.valueChanges.subscribe(() => {
            this.filteredBuilding.reset("", { emitEvent: false });
        });
    }

    updateData() {
        this.updateElectricity();
        this.updateMaintenance();

        this.objList.forEach(obj => {
            if (obj.building != undefined && !this.buildingList.includes(obj.building)) {
                this.buildingList.push(obj.building);
            }
            if (!this.roomList.includes(obj.room)) {
                this.roomList.push(obj.room);
            }
        });
    }

    updateElectricity() {
        this.objList.forEach(obj => {
            console.log(obj);
        });
    }

    updateMaintenance() {
        console.log("");
    }
}
