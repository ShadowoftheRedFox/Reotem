import { Component } from '@angular/core';

export interface Service {
    name: string;
    link: string | string[];
    icon: string;
    class: string;
}

export const ServiceNames: Service[] = [
    {
        name: "Gestion d'eau",
        link: "service",
        class: "service-water-icon",
        icon: "water_drop",
    },
    {
        name: "Gestion d'électricité",
        link: "service",
        class: "service-electricity-icon",
        icon: "electric_bolt",
    },
    {
        name: "Maintenance",
        link: "service",
        class: "service-maintenance",
        icon: "handyman",
    }
] as const;

@Component({
    selector: 'app-service-manager',
    imports: [],
    templateUrl: './service-manager.component.html',
    styleUrl: './service-manager.component.scss'
})
export class ServiceManagerComponent {

}
