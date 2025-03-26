import { Component, input, TemplateRef } from '@angular/core';
import { AnyObject, ComputerObject, DoorObject, LightObject, SpeakerObject, ThermostatObject, VideoProjectorObject, WiFiObject, WindowStoreObject } from '../../models/domo.model';
import { NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toDateTime } from '../../models/date.model';
import { MatMenuModule } from '@angular/material/menu';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';
import { PopupService } from '../../services/popup.service';

@Component({
    selector: 'app-domo',
    imports: [
        NgTemplateOutlet,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    templateUrl: './domo.component.html',
    styleUrl: './domo.component.scss'
})
export class DomoComponent {
    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
        private popup: PopupService
    ) { }

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
        this.updateState();
        switch (this.obj().objectClass) {
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
                return templates[templates.length - 1];
        }
    }

    updateState() {
        this.lightObj = this.obj() as LightObject;
        this.thermostatObj = this.obj() as ThermostatObject;
        this.speakerObj = this.obj() as SpeakerObject;
        this.videoprojectorObj = this.obj() as VideoProjectorObject;
        this.computerObj = this.obj() as ComputerObject;
        this.windowstoreObj = this.obj() as WindowStoreObject;
        this.doorObj = this.obj() as DoorObject;
        this.wifiObj = this.obj() as WiFiObject;
    }

    format() {
        return toDateTime(this.obj().lastInteraction);
    }

    objDetail() {
        this.router.navigate(["object", this.obj().id]);
    }

    objTurnOnOff() {
        this.api.objects.update<SpeakerObject>(this.obj().id, this.auth.clientToken, { "turnedOn": !this.speakerObj.turnedOn }).subscribe({
            next: () => {
                (this.obj() as SpeakerObject).turnedOn = !this.speakerObj.turnedOn;
                this.updateState();
            }, error: () => {
                this.popupError();
            }
        });
    }

    doorLock() {
        this.api.objects.update<DoorObject>(this.obj().id, this.auth.clientToken, { "locked": !this.doorObj.locked }).subscribe({
            next: () => {
                (this.obj() as DoorObject).locked = !this.doorObj.locked;
                this.updateState();
            }, error: () => {
                this.popupError()
            }
        });
    }

    popupError() {
        this.popup.openSnackBar({ message: "Erreur, changement annulé", duration: 10, action: "Fermer" });
    }

    rngClass1 = this.rngClass();
    rngClass2 = this.rngClass();
    rngClass3 = this.rngClass();
    rngClass4 = this.rngClass();
    rngClass5 = this.rngClass();

    rngClass() {
        const v = ["rplaceholder1", "rplaceholder2", "rplaceholder3", "rplaceholder4", "rplaceholder5"];
        return v[Math.floor(v.length * Math.random())];
    }
}
