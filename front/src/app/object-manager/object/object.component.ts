import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { APIService } from '../../../services/api.service';
import { AnyObject, ComputerObject, DoorObject, LightObject, SpeakerObject, ThermostatObject, VideoProjectorObject, WiFiObject, WindowStoreObject } from '../../../models/domo.model';
import { environment } from '../../../environments/environment';

const TITLE_POSTFIX = " - " + environment.title;

@Component({
    selector: 'app-object',
    imports: [],
    templateUrl: './object.component.html',
    styleUrl: './object.component.scss'
})
export class ObjectComponent {
    requestedObject = "error";

    obj: AnyObject | null = null;
    lightObj!: LightObject;
    thermostatObj!: ThermostatObject;
    speakerObj!: SpeakerObject;
    videoprojectorObj!: VideoProjectorObject;
    computerObj!: ComputerObject;
    windowstoreObj!: WindowStoreObject;
    doorObj!: DoorObject;
    wifiObj!: WiFiObject;

    display = "";

    constructor(
        private route: ActivatedRoute,
        private auth: AuthentificationService,
        private api: APIService,
    ) {
        // get the id params
        route.params.subscribe(res => {
            this.requestedObject = res["id"];

            api.objects.get(this.requestedObject).subscribe({
                next: (res) => {
                    this.obj = res;
                    this.display = JSON.stringify(this.obj);
                    window.document.title = res.name + TITLE_POSTFIX;

                    switch (this.obj.objectClass) {
                        case "LightObject":
                            this.lightObj = this.obj as LightObject;
                            break;
                        case "ThermostatObject":
                            this.thermostatObj = this.obj as ThermostatObject;
                            break;
                        case "SpeakerObject":
                            this.speakerObj = this.obj as SpeakerObject;
                            break;
                        case "VideoProjectorObject":
                            this.videoprojectorObj = this.obj as VideoProjectorObject;
                            break;
                        case "ComputerObject":
                            this.computerObj = this.obj as ComputerObject;
                            break;
                        case "WindowStoreObject":
                            this.windowstoreObj = this.obj as WindowStoreObject;
                            break;
                        case "DoorObject":
                            this.doorObj = this.obj as DoorObject;
                            break;
                        case "WiFiObject":
                            this.wifiObj = this.obj as WiFiObject;
                            break;
                        default:
                            console.warn("Unknown class:", this.obj.objectClass);
                            break;
                    }
                },
                error: () => {
                    this.obj = null;
                },
            });
        });
    }
}
