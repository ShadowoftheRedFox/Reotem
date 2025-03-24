import { Component, input, TemplateRef } from '@angular/core';
import { AnyObject, ComputerObject, DoorObject, LightObject, SpeakerObject, ThermostatObject, VideoProjectorObject, WiFiObject, WindowStoreObject } from '../../models/domo.model';
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
    obj = input<AnyObject>({
        id: -1,
        connection: "Déconnecté",
        lastInteraction: new Date(0).toISOString(),
        name: "Erreur",
        neededLevel: "Avancé",
        room: "Erreur",
        building: "Erreur",
        state: "Erreur",
        objectClass: "Erreur"
    });

    lightObj = this.obj() as LightObject;
    thermostatObj = this.obj() as ThermostatObject;
    speakerObj = this.obj() as SpeakerObject;
    videoprojectorObj = this.obj() as VideoProjectorObject;
    computerObj = this.obj() as ComputerObject;
    windowstoreObj = this.obj() as WindowStoreObject;
    doorObj = this.obj() as DoorObject;
    wifiObj = this.obj() as WiFiObject;

    objectClassToTemplate(...templates: TemplateRef<unknown>[]) {
        switch (this.obj().objectClass) {
            case "LightObject":
                this.lightObj = this.obj() as LightObject;
                return templates[0];
            case "ThermostatObject":
                this.thermostatObj = this.obj() as ThermostatObject;
                return templates[1];
            case "SpeakerObject":
                this.speakerObj = this.obj() as SpeakerObject;
                return templates[2];
            case "VideoProjectorObject":
                this.videoprojectorObj = this.obj() as VideoProjectorObject;
                return templates[3];
            case "ComputerObject":
                this.computerObj = this.obj() as ComputerObject;
                return templates[4];
            case "WindowStoreObject":
                this.windowstoreObj = this.obj() as WindowStoreObject;
                return templates[5];
            case "DoorObject":
                this.doorObj = this.obj() as DoorObject;
                return templates[6];
            case "WiFiObject":
                this.wifiObj = this.obj() as WiFiObject;
                return templates[7];
            default:
                return templates[templates.length - 1];
        }
    }

    format() {
        return toDateTime(this.obj().lastInteraction);
    }
}
