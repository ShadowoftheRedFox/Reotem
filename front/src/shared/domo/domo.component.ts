import { Component, Input, TemplateRef } from '@angular/core';
import { AnyObject } from '../../models/domo.model';
import { NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toDateTime } from '../../models/date.model';

@Component({
    selector: 'app-domo',
    imports: [
        NgTemplateOutlet,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './domo.component.html',
    styleUrl: './domo.component.scss'
})
export class DomoComponent {
    @Input() obj: AnyObject = {
        id: -1,
        connection: "Déconnecté",
        lastInteraction: new Date(0).toISOString(),
        name: "Erreur",
        neededLevel: "Avancé",
        room: "Erreur",
        building: "Erreur",
        state: "Erreur",
        objectClass: "Erreur"
    };

    objectClassToTemplate(...templates: TemplateRef<unknown>[]) {
        switch (this.obj.objectClass) {
            case "LightObject":
                return templates[0];
            case "ThermostatObject":
                return templates[1];
            case "SpeakerObject":
                return templates[2];
            case "VideoProjectorObject":
                return templates[3];
            case "ComputerObject":
                return templates[4];
            case "WindowStoreObject":
                return templates[5];
            case "DoorObject":
                return templates[6];
            case "WiFiObject":
                return templates[7];
            default:
            case "Erreur":
                return templates[templates.length - 1];
        }
    }

    format() {
        return toDateTime(this.obj.lastInteraction);
    }
}
