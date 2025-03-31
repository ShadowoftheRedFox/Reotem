import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { APIService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface Service {
    name: string;
    id: string,
    link?: string | string[];
    icon?: string;
    class?: string;
}

export const ServiceNames: Service[] = [
    {
        name: "Gestion d'eau",
        id: "water",
        link: ["/service", "water"],
        class: "service-water-icon",
        icon: "water_drop",
    },
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

export interface ServiceTab extends Service {
    // TODO add things to show in the service
    objects: number[],
    consumption: {
        daily: number,
        monthly: number
    }
}

@Component({
    selector: 'app-service-manager',
    imports: [
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './service-manager.component.html',
    styleUrl: './service-manager.component.scss'
})
export class ServiceManagerComponent {
    tabs: ServiceTab[] = [
        {
            name: ServiceNames[0].name,
            icon: ServiceNames[0].icon,
            class: ServiceNames[0].class,
            id: ServiceNames[0].id,
            objects: [9],
            consumption: {
                daily: 0,
                monthly: 0
            }
        },
        {
            name: ServiceNames[1].name,
            icon: ServiceNames[1].icon,
            class: ServiceNames[1].class,
            id: ServiceNames[1].id,
            objects: [9],
            consumption: {
                daily: 0,
                monthly: 0
            }
        },
        {
            name: ServiceNames[2].name,
            icon: ServiceNames[2].icon,
            class: ServiceNames[2].class,
            id: ServiceNames[2].id,
            objects: [9],
            consumption: {
                daily: 0,
                monthly: 0
            }
        },
    ];
    selectedIndex = 0;
    loading = false;

    constructor(
        private api: APIService,
        private route: ActivatedRoute,
    ) {
        // TODO request to api to get info in the service
        route.params.subscribe(res => {
            switch (res['tab']) {
                case "water":
                    this.selectedIndex = 0;
                    break;
                case "electricity":
                    this.selectedIndex = 1;
                    break;
                case "maintenance":
                    this.selectedIndex = 2;
                    break;
                default:
                    break;
            }
        });
    }
}
