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
import { DomoComponent } from '../../shared/domo/domo.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
        MatSelectModule,
        DomoComponent,
        MatTooltipModule,
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

    electricityData = {
        global: 0,
        daily: 0,
        monthly: 0,
        threshold: 0,
        batteries: 0,
    }

    maintainedObject: AnyObject[] = [];
    errorObject: AnyObject[] = [];

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
        // this.filteredBuilding.valueChanges.subscribe(() => {
        //     this.filteredRoom.reset("", { emitEvent: false });
        //     this.updateData();
        // });
        // this.filteredRoom.valueChanges.subscribe(() => {
        //     this.filteredBuilding.reset("", { emitEvent: false });
        //     this.updateData();
        // });
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
        this.electricityData.global = 0;
        this.electricityData.batteries = 0;

        const series: number[] = [];
        const labels: string[] = [];

        this.objList.forEach(obj => {
            if (obj.electricityUsage &&
                obj.room.includes(this.filteredRoom.value || '') &&
                (obj.building || '').includes(this.filteredBuilding.value || '')) {
                this.electricityData.global += obj.electricityUsage;
                this.electricityData.threshold += obj.consomationThreshold || 0;

                series.push(obj.electricityUsage);
                labels.push(obj.name);
                series.push(obj.electricityUsage);
                labels.push(obj.name);
                series.push(obj.electricityUsage);
                labels.push(obj.name);
            }
            if (obj.battery) {
                this.electricityData.batteries++;
            }
        });

        this.electricityData.daily = this.electricityData.global * 24;
        this.electricityData.monthly = this.electricityData.daily * 30;
    }

    updateMaintenance() {
        this.maintainedObject = [];
        this.errorObject = [];

        this.objList.forEach(obj => {
            if (obj.state === "Maintenance") {
                this.maintainedObject.push(obj);
            }
            if (obj.state === "Erreur") {
                this.errorObject.push(obj);
            }
        });
    }
}
