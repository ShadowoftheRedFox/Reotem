import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { APIService } from '../../../services/api.service';
import { AnyObject, Connection, Mode, ObjectClass, ObjectState, WifiType } from '../../../models/domo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { PopupService } from '../../../services/popup.service';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-create',
    imports: [
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        RouterLink,
        MatTimepickerModule
    ],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateComponent {
    private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

    readonly connextions = Connection;
    readonly states = ObjectState;
    readonly classes = ObjectClass;

    readonly modes = Mode;

    readonly wifis = WifiType;

    //#region Forms
    customValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const e = { subgroupInvalid: true };
        const ctrl = control as FormGroup;

        switch (ctrl.value.objectClass as ObjectClass) {
            case 'BaseObject':
                return ctrl.errors == null ? null : e;
            case 'LightObject':
                return this.LightObjectGroup.valid ? null : (this.LightObjectGroup.errors != null ? this.LightObjectGroup.errors : e);
            case 'ThermostatObject':
                return this.ThermostatObjectGroup.valid ? null : (this.ThermostatObjectGroup.errors != null ? this.ThermostatObjectGroup.errors : e);
            case 'SpeakerObject':
                return this.SpeakerObjectGroup.valid ? null : (this.SpeakerObjectGroup.errors != null ? this.SpeakerObjectGroup.errors : e);
            case 'VideoProjectorObject':
                return this.VideoProjectorObjectGroup.valid ? null : (this.VideoProjectorObjectGroup.errors != null ? this.VideoProjectorObjectGroup.errors : e);
            case 'ComputerObject':
                return this.ComputerObjectGroup.valid ? null : (this.ComputerObjectGroup.errors != null ? this.ComputerObjectGroup.errors : e);
            case 'WindowStoreObject':
                return this.WindowStoreObjectGroup.valid ? null : (this.WindowStoreObjectGroup.errors != null ? this.WindowStoreObjectGroup.errors : e);
            case 'DoorObject':
                return this.DoorObjectGroup.valid ? null : (this.DoorObjectGroup.errors != null ? this.DoorObjectGroup.errors : e);
            case 'WiFiObject':
                return this.WiFiObjectGroup.valid ? null : (this.WiFiObjectGroup.errors != null ? this.WiFiObjectGroup.errors : e);
            default:
                console.warn('default fallthrough')
                return e;
        }
    };

    formGroup = new FormGroup({
        name: new FormControl<string>("", [Validators.required]),
        room: new FormControl<string>("", [Validators.required]),
        building: new FormControl<string>("", []),
        connection: new FormControl<Connection>("Autre", [Validators.required]),
        state: new FormControl<ObjectState>("Normal", [Validators.required]),
        objectClass: new FormControl<ObjectClass>("BaseObject", [Validators.required]),
    }, [this.customValidator]);

    LightObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Manuel", [Validators.required]),
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
    });

    ThermostatObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Automatique", [Validators.required]),
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0), Validators.max(100)]),
        battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
        targetTemp: new FormControl(19, [Validators.required]),
    });

    SpeakerObjectGroup = new FormGroup({
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
    });

    VideoProjectorObjectGroup = new FormGroup({
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        turnedOn: new FormControl(true, []),
    });

    ComputerObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Manuel", [Validators.required]),
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
    });

    WindowStoreObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Manuel", [Validators.required]),
        closeTime: new FormControl<Date | null>(null, [Validators.required]),
        openTime: new FormControl<Date | null>(null, [Validators.required]),
    });

    DoorObjectGroup = new FormGroup({
        closeTime: new FormControl<Date | null>(null, [Validators.required]),
        openTime: new FormControl<Date | null>(null, [Validators.required]),
        locked: new FormControl(false, []),
        closed: new FormControl(true, []),
    });

    WiFiObjectGroup = new FormGroup({
        type: new FormControl<WifiType>("Routeur", [Validators.required]),
        turnedOn: new FormControl(true, []),
    });

    //#endregion

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
        private popup: PopupService
    ) {
        this.ErreurListener();
        // for french date format on time pickers
        this._adapter.setLocale('FR-fr');

        // update main one when sub ones changes
        this.LightObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.ThermostatObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.SpeakerObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.VideoProjectorObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.ComputerObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.WindowStoreObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.DoorObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
        this.WiFiObjectGroup.valueChanges.subscribe(() => { this.formGroup.controls.name.setValue(this.formGroup.value.name || '') });
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
            return "Horaire requis";
        } else if (ctrl.hasError('matTimepickerParse')) {
            return "Date invalide"
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
                (object as Record<string, unknown>)["turnedOn"] = this.LightObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["consomationThreshold"] = this.LightObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["battery"] = (this.LightObjectGroup.value.battery ? Math.floor(Math.random() * 100) : undefined);
                (object as Record<string, unknown>)["mode"] = this.LightObjectGroup.value.mode as Mode;
                break;
            case 'ThermostatObject':
                (object as Record<string, unknown>)["turnedOn"] = this.ThermostatObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["consomationThreshold"] = this.ThermostatObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["battery"] = (this.ThermostatObjectGroup.value.battery ? Math.floor(Math.random() * 100) : undefined);
                (object as Record<string, unknown>)["mode"] = this.ThermostatObjectGroup.value.mode as Mode;
                (object as Record<string, unknown>)["targetTemp"] = this.ThermostatObjectGroup.value.targetTemp as number;
                (object as Record<string, unknown>)["currentTemp"] = 20 + Math.floor(Math.random() * 10);
                break;
            case 'SpeakerObject':
                (object as Record<string, unknown>)["turnedOn"] = this.SpeakerObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["consomationThreshold"] = this.SpeakerObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["battery"] = (this.SpeakerObjectGroup.value.battery ? Math.floor(Math.random() * 100) : undefined);
                break;
            case 'VideoProjectorObject':
                (object as Record<string, unknown>)["turnedOn"] = this.VideoProjectorObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["consomationThreshold"] = this.VideoProjectorObjectGroup.value.consomationThreshold as number;
                break;
            case 'ComputerObject':
                (object as Record<string, unknown>)["turnedOn"] = this.ComputerObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["consomationThreshold"] = this.ComputerObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["battery"] = (this.ComputerObjectGroup.value.battery ? Math.floor(Math.random() * 100) : undefined);
                break;
            case 'WindowStoreObject':
                (object as Record<string, unknown>)["openState"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["closeTime"] = (this.WindowStoreObjectGroup.value.closeTime as Date).toISOString();
                (object as Record<string, unknown>)["openTime"] = (this.WindowStoreObjectGroup.value.openTime as Date).toISOString();
                (object as Record<string, unknown>)["mode"] = this.WindowStoreObjectGroup.value.mode as Mode;
                break;
            case 'DoorObject':
                (object as Record<string, unknown>)["closeTime"] = (this.DoorObjectGroup.value.closeTime as Date).toISOString();
                (object as Record<string, unknown>)["openTime"] = (this.DoorObjectGroup.value.openTime as Date).toISOString();
                (object as Record<string, unknown>)["locked"] = this.DoorObjectGroup.value.locked as boolean;
                (object as Record<string, unknown>)["closed"] = this.DoorObjectGroup.value.closed as boolean;
                break;
            case 'WiFiObject':
                (object as Record<string, unknown>)["turnedOn"] = this.WiFiObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["electricityUsage"] = Math.floor(Math.random() * 100);
                (object as Record<string, unknown>)["type"] = this.WiFiObjectGroup.value.type as WifiType;
                break;
        }

        this.api.objects.create(object, this.auth.clientToken).subscribe({
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
