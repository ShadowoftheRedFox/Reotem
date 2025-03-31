import { Component, isDevMode } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { APIService } from '../../../services/api.service';
import { AnyObject, ComputerObject, Connection, DoorObject, LightObject, Mode, ObjectClass, ObjectState, SpeakerObject, ThermostatObject, VideoProjectorObject, WiFiObject, WifiType, WindowStoreObject } from '../../../models/domo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { PopupService } from '../../../services/popup.service';

@Component({
    selector: 'app-edit',
    imports: [
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        RouterLink
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditComponent {

    readonly connextions = Connection;
    readonly states = ObjectState;
    readonly classes = ObjectClass;

    readonly modes = Mode;

    readonly wifis = WifiType;

    //#region Forms
    customValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const e = { subgroupInvalid: true };

        switch (control.value.objectClass as ObjectClass) {
            case 'BaseObject':
                return control.valid ? null : e;
            case 'LightObject':
                return control.valid && control.value.LightObjectGroup.valid ? null : e;
            case 'ThermostatObject':
                return control.valid && control.value.ThermostatObjectGroup.valid ? null : e;
            case 'SpeakerObject':
                return control.valid && control.value.SpeakerObjectGroup.valid ? null : e;
            case 'VideoProjectorObject':
                return control.valid && control.value.VideoProjectorObjectGroup.valid ? null : e;
            case 'ComputerObject':
                return control.valid && control.value.ComputerObjectGroup.valid ? null : e;
            case 'WindowStoreObject':
                return control.valid && control.value.WindowStoreObjectGroup.valid ? null : e;
            case 'DoorObject':
                return control.valid && control.value.DoorObjectGroup.valid ? null : e;
            case 'WiFiObject':
                return control.valid && control.value.WiFiObjectGroup.valid ? null : e;
            default:
                return e;
        }
    };

    formGroup = new FormGroup({
        name: new FormControl<string>("", [Validators.required]),
        room: new FormControl<string>("", [Validators.required]),
        building: new FormControl<string>("", []),
        connection: new FormControl<Connection>("Autre", []),
        state: new FormControl<ObjectState>("Normal", []),
        objectClass: new FormControl<ObjectClass>("BaseObject", [Validators.required]),

        LightObjectGroup: new FormGroup({
            mode: new FormControl<Mode>("Manuel", [Validators.required]),
            consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
            battery: new FormControl(false),
            turnedOn: new FormControl(true),
        }),

        ThermostatObjectGroup: new FormGroup({
            mode: new FormControl<Mode>("Automatique", [Validators.required]),
            consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0), Validators.max(100)]),
            battery: new FormControl(false),
            turnedOn: new FormControl(true),
            targetTemp: new FormControl(19, [Validators.required]),
        }),

        SpeakerObjectGroup: new FormGroup({
            consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
            battery: new FormControl(false),
            turnedOn: new FormControl(true),
        }),

        VideoProjectorObjectGroup: new FormGroup({
            consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
            turnedOn: new FormControl(true),
        }),

        ComputerObjectGroup: new FormGroup({
            mode: new FormControl<Mode>("Manuel", [Validators.required]),
            consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
            battery: new FormControl(false),
            turnedOn: new FormControl(true),
        }),

        WindowStoreObjectGroup: new FormGroup({
            mode: new FormControl<Mode>("Manuel", [Validators.required]),
            closeTime: new FormControl<Date>(new Date(), [Validators.required]),
            openTime: new FormControl<Date>(new Date(), [Validators.required]),
        }),

        DoorObjectGroup: new FormGroup({
            closeTime: new FormControl<Date>(new Date(), [Validators.required]),
            openTime: new FormControl<Date>(new Date(), [Validators.required]),
            locked: new FormControl(false),
            closed: new FormControl(true),
        }),

        WiFiObjectGroup: new FormGroup({
            type: new FormControl<WifiType>("Routeur", [Validators.required]),
            turnedOn: new FormControl(true),
        }),
    }, [this.customValidator]);

    LightObjectGroup = this.formGroup.controls.LightObjectGroup;
    ThermostatObjectGroup = this.formGroup.controls.ThermostatObjectGroup;
    SpeakerObjectGroup = this.formGroup.controls.SpeakerObjectGroup;
    VideoProjectorObjectGroup = this.formGroup.controls.VideoProjectorObjectGroup;
    ComputerObjectGroup = this.formGroup.controls.ComputerObjectGroup;
    WindowStoreObjectGroup = this.formGroup.controls.WindowStoreObjectGroup;
    DoorObjectGroup = this.formGroup.controls.DoorObjectGroup;
    WiFiObjectGroup = this.formGroup.controls.WiFiObjectGroup;
    //#endregion

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
        private popup: PopupService
    ) {
        // TODO fill form and get correct id
        this.ErreurListener();
    }

    //#region Listeners
    ErreurListener() {
        this.formGroup.valueChanges.subscribe(() => {
            if (this.formGroup.value.objectClass == "Erreur" && !isDevMode()) {
                this.formGroup.controls.objectClass.setErrors({ only_dev: true });
            }
        })
    }
    //#endregion

    //#region Errors
    nameErrorMessage() {
        const ctrl = this.formGroup.controls.name;
        if (ctrl.hasError("required")) {
            return "Nom requis";
        }
        return "";
    }

    objectClassErrorMessage() {
        const ctrl = this.formGroup.controls.objectClass;
        if (ctrl.hasError("required")) {
            return "Classe requise";
        } else if (ctrl.hasError("only_dev")) {
            return "Uniquement pour les tests";
        }
        console.log(ctrl.errors)
        // console.log(this.formGroup.errors);
        return "";
    }

    roomErrorMessage() {
        const ctrl = this.formGroup.controls.room;
        if (ctrl.hasError("required")) {
            return "Salle requise";
        }
        return "";
    }

    buildingErrorMessage() {
        const ctrl = this.formGroup.controls.building;
        if (ctrl.hasError("required")) {
            return "Bâtiment requis";
        }
        return "";
    }

    connectionErrorMessage() {
        const ctrl = this.formGroup.controls.connection;
        if (ctrl.hasError("required")) {
            return "Connexion requise";
        }
        return "";
    }

    stateErrorMessage() {
        const ctrl = this.formGroup.controls.state;
        if (ctrl.hasError("required")) {
            return "État requis";
        }
        return "";
    }

    modeErrorMessage(ctrl: FormControl) {
        if (ctrl.hasError("required")) {
            return "État requis";
        }
        return "";
    }

    consomationThresholdErrorMessage(ctrl: FormControl) {
        if (ctrl.hasError("required")) {
            return "Consommation maximale requise";
        }
        return "";
    }

    targetTempErrorMessage() {
        const ctrl = this.ThermostatObjectGroup.controls.targetTemp;
        if (ctrl.hasError("required")) {
            return "Consommation maximale requise";
        }
        return "";
    }

    timeErrorMessage(ctrl: FormControl) {
        if (ctrl.hasError("required")) {
            return "Horaire maximale requise";
        }
        return "";
    }

    typeErrorMessage() {
        const ctrl = this.WiFiObjectGroup.controls.type;
        if (ctrl.hasError("required")) {
            return "Type requis";
        }
        return "";
    }
    //#endregion

    addObject() {
        if (this.formGroup.invalid) return;

        const object: AnyObject = {
            _id: "error",
            name: this.formGroup.value.name as string,
            room: this.formGroup.value.room as string,
            building: this.formGroup.value.building as string | undefined,
            neededRole: "Tester",
            neededLevel: "Débutant",
            lastInteraction: new Date().toISOString(),
            connection: this.formGroup.value.connection as Connection,
            state: this.formGroup.value.state as ObjectState,
            objectClass: this.formGroup.value.objectClass as ObjectClass,
        }

        switch (this.formGroup.value.objectClass as ObjectClass) {
            case 'BaseObject':
                break
            case 'LightObject':
                (object as LightObject).turnedOn = this.formGroup.value.LightObjectGroup?.turnedOn as boolean;
                (object as LightObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as LightObject).consomationThreshold = this.formGroup.value.LightObjectGroup?.consomationThreshold as number;
                (object as LightObject).battery = (this.formGroup.value.LightObjectGroup?.battery ? Math.floor(Math.random() * 100) : undefined);
                (object as LightObject).mode = this.formGroup.value.LightObjectGroup?.mode as Mode;
                break;
            case 'ThermostatObject':
                (object as ThermostatObject).turnedOn = this.formGroup.value.ThermostatObjectGroup?.turnedOn as boolean;
                (object as ThermostatObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as ThermostatObject).consomationThreshold = this.formGroup.value.ThermostatObjectGroup?.consomationThreshold as number;
                (object as ThermostatObject).battery = (this.formGroup.value.ThermostatObjectGroup?.battery ? Math.floor(Math.random() * 100) : undefined);
                (object as ThermostatObject).mode = this.formGroup.value.ThermostatObjectGroup?.mode as Mode;
                (object as ThermostatObject).targetTemp = this.formGroup.value.ThermostatObjectGroup?.targetTemp as number;
                (object as ThermostatObject).currentTemp = 20 + Math.floor(Math.random() * 10);
                break;
            case 'SpeakerObject':
                (object as SpeakerObject).turnedOn = this.formGroup.value.SpeakerObjectGroup?.turnedOn as boolean;
                (object as SpeakerObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as SpeakerObject).consomationThreshold = this.formGroup.value.SpeakerObjectGroup?.consomationThreshold as number;
                (object as SpeakerObject).battery = (this.formGroup.value.SpeakerObjectGroup?.battery ? Math.floor(Math.random() * 100) : undefined);
                break;
            case 'VideoProjectorObject':
                (object as VideoProjectorObject).turnedOn = this.formGroup.value.VideoProjectorObjectGroup?.turnedOn as boolean;
                (object as VideoProjectorObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as VideoProjectorObject).consomationThreshold = this.formGroup.value.VideoProjectorObjectGroup?.consomationThreshold as number;
                break;
            case 'ComputerObject':
                (object as ComputerObject).turnedOn = this.formGroup.value.ComputerObjectGroup?.turnedOn as boolean;
                (object as ComputerObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as ComputerObject).consomationThreshold = this.formGroup.value.ComputerObjectGroup?.consomationThreshold as number;
                (object as ComputerObject).battery = (this.formGroup.value.ComputerObjectGroup?.battery ? Math.floor(Math.random() * 100) : undefined);
                break;
            case 'WindowStoreObject':
                (object as WindowStoreObject).openState = Math.floor(Math.random() * 100);
                (object as WindowStoreObject).closeTime = (this.formGroup.value.WindowStoreObjectGroup?.closeTime as Date).toISOString();
                (object as WindowStoreObject).openTime = (this.formGroup.value.WindowStoreObjectGroup?.openTime as Date).toISOString();
                (object as WindowStoreObject).mode = this.formGroup.value.WindowStoreObjectGroup?.mode as Mode;
                break;
            case 'DoorObject':
                (object as DoorObject).closeTime = (this.formGroup.value.DoorObjectGroup?.closeTime as Date).toISOString();
                (object as DoorObject).openTime = (this.formGroup.value.DoorObjectGroup?.openTime as Date).toISOString();
                (object as DoorObject).locked = this.formGroup.value.DoorObjectGroup?.locked as boolean;
                (object as DoorObject).closed = this.formGroup.value.DoorObjectGroup?.closed as boolean;
                break;
            case 'WiFiObject':
                (object as WiFiObject).turnedOn = this.formGroup.value.WiFiObjectGroup?.turnedOn as boolean;
                (object as WiFiObject).electricityUsage = Math.floor(Math.random() * 100);
                (object as WiFiObject).type = this.formGroup.value.WiFiObjectGroup?.type as WifiType;
                break;
        }

        this.api.objects.update(object._id, this.auth.clientToken, object).subscribe({
            next: () => {
                this.router.navigate(['/object']);
            },
            error: () => {
                this.popup.openSnackBar({
                    message: "Échec de l'interaction"
                });
            }
        })
    }
}
