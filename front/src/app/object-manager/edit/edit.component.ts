import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { APIService } from '../../../services/api.service';
import { AnyObject, ComputerObject, Connection, DoorObject, LightObject, Mode, ObjectClass, ObjectState, SpeakerObject, ThermostatObject, VideoProjectorObject, WiFiObject, WifiType, WindowStoreObject } from '../../../models/domo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../services/authentification.service';
import { PopupService } from '../../../services/popup.service';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ErrorComponent } from '../../error/error.component';

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
        RouterLink,
        MatTimepickerModule,
        ErrorComponent
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditComponent {
    private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

    readonly connextions = Connection;
    readonly states = ObjectState;
    readonly classes = ObjectClass;

    readonly modes = Mode;

    readonly wifis = WifiType;

    obj: AnyObject | null = null;
    notFound = signal(false);

    // TODO disable.enable some things depending on the user level and color them with teh sad color in the faq

    //#region Forms
    customValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (this.obj === null) return { no_obj: true };
        const e = { subgroupInvalid: true };
        const ctrl = control as FormGroup;

        switch (this.obj.objectClass) {
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
        // objectClass: new FormControl<ObjectClass>("BaseObject", [Validators.required]),
    }, [this.customValidator]);

    LightObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Manuel", [Validators.required]),
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        // battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
    });

    ThermostatObjectGroup = new FormGroup({
        mode: new FormControl<Mode>("Automatique", [Validators.required]),
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0), Validators.max(100)]),
        // battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
        targetTemp: new FormControl(19, [Validators.required]),
    });

    SpeakerObjectGroup = new FormGroup({
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        // battery: new FormControl(false, []),
        turnedOn: new FormControl(true, []),
    });

    VideoProjectorObjectGroup = new FormGroup({
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        turnedOn: new FormControl(true, []),
    });

    ComputerObjectGroup = new FormGroup({
        consomationThreshold: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
        // battery: new FormControl(false, []),
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
        // type: new FormControl<WifiType>("Routeur", [Validators.required]),
        turnedOn: new FormControl(true, []),
    });

    //#endregion

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
        private route: ActivatedRoute,
        private popup: PopupService
    ) {
        // for french date format on time pickers
        this._adapter.setLocale('FR-fr');
        route.params.subscribe(res => {
            const objId = res['id'] || -1;
            api.objects.get(objId).subscribe({
                error: () => {
                    this.notFound.set(true);
                },
                next: (res) => {
                    this.obj = res;

                    // fill forms with current value
                    // and disabled unchangeable ones

                    this.formGroup.controls.name.setValue(this.obj.name);
                    this.formGroup.controls.room.setValue(this.obj.room);
                    this.formGroup.controls.building.setValue(this.obj.building || '');
                    this.formGroup.controls.connection.setValue(this.obj.connection);
                    this.formGroup.controls.state.setValue(this.obj.state);
                    // this.formGroup.controls.objectClass.setValue(this.obj.objectClass);
                    // this.formGroup.controls.objectClass.disable();

                    switch (this.obj.objectClass) {
                        case 'LightObject':
                            {
                                const o = this.obj as LightObject;
                                this.LightObjectGroup.controls.mode.setValue(o.mode)
                                this.LightObjectGroup.controls.consomationThreshold.setValue(o.consomationThreshold)
                                // this.LightObjectGroup.controls.battery.setValue(typeof o.battery == 'number')
                                // this.LightObjectGroup.controls.battery.disable();
                                this.LightObjectGroup.controls.turnedOn.setValue(o.turnedOn)
                                break;
                            }
                        case 'ThermostatObject':
                            {
                                const o = this.obj as ThermostatObject;
                                this.ThermostatObjectGroup.controls.mode.setValue(o.mode)
                                this.ThermostatObjectGroup.controls.consomationThreshold.setValue(o.consomationThreshold)
                                // this.ThermostatObjectGroup.controls.battery.setValue(typeof o.battery == 'number')
                                // this.ThermostatObjectGroup.controls.battery.disable();
                                this.ThermostatObjectGroup.controls.turnedOn.setValue(o.turnedOn)
                                this.ThermostatObjectGroup.controls.targetTemp.setValue(o.targetTemp)
                                break;
                            }
                        case 'SpeakerObject':
                            {
                                const o = this.obj as SpeakerObject;
                                this.SpeakerObjectGroup.controls.consomationThreshold.setValue(o.consomationThreshold);
                                // this.SpeakerObjectGroup.controls.battery.setValue(typeof o.battery == "number");
                                // this.SpeakerObjectGroup.controls.battery.disable();
                                this.SpeakerObjectGroup.controls.turnedOn.setValue(o.turnedOn);
                                break;
                            }
                        case 'VideoProjectorObject':
                            {
                                const o = this.obj as VideoProjectorObject;
                                this.VideoProjectorObjectGroup.controls.consomationThreshold.setValue(o.consomationThreshold);
                                this.VideoProjectorObjectGroup.controls.turnedOn.setValue(o.turnedOn);
                                break;
                            }
                        case 'ComputerObject':
                            {
                                const o = this.obj as ComputerObject;
                                this.ComputerObjectGroup.controls.consomationThreshold.setValue(o.consomationThreshold);
                                // this.ComputerObjectGroup.controls.battery.setValue(typeof o.battery == "number");
                                // this.ComputerObjectGroup.controls.battery.disable();
                                this.ComputerObjectGroup.controls.turnedOn.setValue(o.turnedOn);
                                break;
                            }
                        case 'WindowStoreObject':
                            {
                                const o = this.obj as WindowStoreObject;
                                this.WindowStoreObjectGroup.controls.mode.setValue(o.mode);
                                this.WindowStoreObjectGroup.controls.closeTime.setValue(new Date(o.closeTime));
                                this.WindowStoreObjectGroup.controls.openTime.setValue(new Date(o.openTime));
                                break;
                            }
                        case 'DoorObject':
                            {
                                const o = this.obj as DoorObject;
                                this.DoorObjectGroup.controls.closeTime.setValue(new Date(o.closeTime));
                                this.DoorObjectGroup.controls.openTime.setValue(new Date(o.openTime));
                                this.DoorObjectGroup.controls.locked.setValue(o.locked);
                                this.DoorObjectGroup.controls.closed.setValue(o.closed);
                                break;
                            }
                        case 'WiFiObject':
                            {
                                const o = this.obj as WiFiObject;
                                // this.WiFiObjectGroup.controls.type.setValue(o.type);
                                // this.WiFiObjectGroup.controls.type.disable();
                                this.WiFiObjectGroup.controls.turnedOn.setValue(o.turnedOn);
                                break;
                            }
                        default:
                            break;
                    }
                }
            })
        });

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

    //#region Errors
    nameErrorMessage() {
        const ctrl = this.formGroup.controls.name;
        if (ctrl.hasError("required")) {
            return "Nom requis";
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
    //#endregion

    updateObject() {
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
            objectClass: this.obj?.objectClass as ObjectClass,
        }

        switch (this.obj?.objectClass as ObjectClass) {
            case 'BaseObject':
                break
            case 'LightObject':
                (object as Record<string, unknown>)["turnedOn"] = this.LightObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["consomationThreshold"] = this.LightObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["mode"] = this.LightObjectGroup.value.mode as Mode;
                break;
            case 'ThermostatObject':
                (object as Record<string, unknown>)["turnedOn"] = this.ThermostatObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["consomationThreshold"] = this.ThermostatObjectGroup.value.consomationThreshold as number;
                (object as Record<string, unknown>)["mode"] = this.ThermostatObjectGroup.value.mode as Mode;
                (object as Record<string, unknown>)["targetTemp"] = this.ThermostatObjectGroup.value.targetTemp as number;
                break;
            case 'SpeakerObject':
                (object as Record<string, unknown>)["turnedOn"] = this.SpeakerObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["consomationThreshold"] = this.SpeakerObjectGroup.value.consomationThreshold as number;
                break;
            case 'VideoProjectorObject':
                (object as Record<string, unknown>)["turnedOn"] = this.VideoProjectorObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["consomationThreshold"] = this.VideoProjectorObjectGroup.value.consomationThreshold as number;
                break;
            case 'ComputerObject':
                (object as Record<string, unknown>)["turnedOn"] = this.ComputerObjectGroup.value.turnedOn as boolean;
                (object as Record<string, unknown>)["consomationThreshold"] = this.ComputerObjectGroup.value.consomationThreshold as number;
                break;
            case 'WindowStoreObject':
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
                break;
        }

        this.api.objects.update(object._id, this.auth.clientToken, this.obj as never).subscribe({
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
