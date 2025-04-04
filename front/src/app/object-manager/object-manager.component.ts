import { Component, signal, WritableSignal } from "@angular/core";
import { CommunicationService } from "../../services/communication.service";
import { APIService } from "../../services/api.service";
import { AuthentificationService } from "../../services/authentification.service";
import { DomoComponent } from "../../shared/domo/domo.component";
import { Router, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AnyObject } from "../../models/domo.model";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { PopupService } from "../../services/popup.service";

interface Action {
    name: string;
    icon: string;
    callback: () => void;
    link?: string | string[];
    class?: string;
    disabled?: WritableSignal<boolean>;
}

@Component({
    selector: "app-object-manager",
    imports: [
        DomoComponent,
        RouterLink,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
    ],
    templateUrl: "./object-manager.component.html",
    styleUrl: "./object-manager.component.scss",
})
export class ObjectManagerComponent {
    readonly bar_class =
        "w-full flex flex-row flex-wrap justify-start gap-4 items-stretch px-4";
    objectList: AnyObject[] = [];

    filteredObjectList: AnyObject[] = [];

    namedFilter = "";
    noNamedFilterResult = false;

    filteredBuilding = new FormControl<string[]>([]);
    buildingList: string[] = [];

    filteredRoom = new FormControl<string[]>([]);
    roomList: string[] = [];

    selectedObjects = new Map<number, boolean>();
    anySelected = signal(false);
    onlyOne = signal(false);

    readonly actionsList: Action[] = [
        {
            name: "Ajouter",
            icon: "add",
            callback: () => {
                this.router.navigate(["object", "create"]);
            },
        },
        {
            name: "Modifier",
            icon: "edit",
            callback: () => {
                this.router.navigate(["object", "edit", this.objectList[Array.from(this.selectedObjects.keys())[0]].id]);
            },
            disabled: this.onlyOne,
        },
        {
            name: "Effacer",
            icon: "delete",
            callback: () => {
                this.deleteObjects(Array.from(this.selectedObjects.keys()));
            },
            disabled: this.anySelected,
        },
        {
            name: "Dupliquer",
            icon: "content_copy",
            callback: () =>
                this.duplicateObjects(Array.from(this.selectedObjects.keys())),
            disabled: this.anySelected,
        },
        {
            name: "Rafraîchir",
            icon: "refresh",
            callback: () => this.refresh(),
        },
    ];

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
        private popup: PopupService
    ) {
        // listen to event change
        com.DomoAllObjectsUpdate.subscribe((update) => {
            this.updateObjects(update);
        });

        // load objects
        if (com.DomoObjects.length == 0) {
            this.refresh();
        } else {
            this.updateObjects(com.DomoObjects);
        }

        // listen for filters
        this.filteredRoom.valueChanges.subscribe(() => {
            this.applyFilter();
        });
        this.filteredBuilding.valueChanges.subscribe(() => {
            this.applyFilter();
        });
    }

    //#region Filters
    inFilteredRoom(room: string) {
        if (
            this.filteredRoom.value == null ||
            this.filteredRoom.value.length == 0
        )
            return true;
        return this.filteredRoom.value.includes(room);
    }

    inFilteredBuilding(building?: string) {
        if (
            this.filteredBuilding.value == null ||
            this.filteredBuilding.value.length == 0
        )
            return true;
        if (building === undefined) return false;
        return this.filteredBuilding.value.includes(building);
    }

    applyFilter() {
        this.filteredObjectList = [];
        this.objectList.forEach((o) => {
            if (
                this.inFilteredRoom(o.room) &&
                this.inFilteredBuilding(o.building)
            ) {
                this.filteredObjectList.push(o);
            }
        });
    }

    namedFilterChange() {
        let atLeastOneObj = false;
        for (const obj of this.objectList) {
            if (this.applyNamedFilter(obj)) {
                atLeastOneObj = true;
                break;
            }
        }
        this.noNamedFilterResult = !atLeastOneObj;
    }

    applyNamedFilter(obj: AnyObject) {
        const filter = this.namedFilter.toLowerCase();

        let res = false;
        if (
            obj.building != undefined &&
            obj.building.toLowerCase().includes(filter)
        ) {
            res = true;
        }
        if (
            obj.id.toLowerCase().includes(filter) ||
            obj.room.toLowerCase().includes(filter) ||
            obj.name.toLowerCase().includes(filter) ||
            obj.state.toLowerCase().includes(filter) ||
            obj.connection.toLowerCase().includes(filter)
        ) {
            res = true;
        }

        return res;
    }
    //#endregion

    domoSelected(id: string) {
        const index = this.objectList.map((object) => object.id).indexOf(id);
        this.selectedObjects.set(
            index,
            !(this.selectedObjects.get(index) || false)
        );
        let temp = false;
        let count = 0;
        this.selectedObjects.forEach((v) => {
            if (v === true) {
                temp = true;
                count++;
            }
        });
        this.anySelected.set(temp);
        this.onlyOne.set(count === 1);
    }

    deleteObjects(indexes: number[]) {
        console.log("Deleting objects ", indexes);
        indexes.forEach((index) => {
            this.api.objects
                .delete(this.objectList[index].id, this.auth.clientToken)
                .subscribe({
                    next: () => {
                        if (indexes.length === 1) this.popup.openSnackBar({
                            message: `L'objet "${this.objectList[index].name}" a bien été marqué pour la suppression.`,
                            action: "Ok",
                        });
                        this.selectedObjects.delete(index)
                        this.anySelected.set(false)
                        this.onlyOne.set(false)
                        this.refresh();
                    },
                    error: (err) => {
                        this.popup.openSnackBar({
                            message: "Echec de l'interaction",
                            action: "Ok",
                        });
                        console.log(err);
                    },
                });
        });
        if (indexes.length > 1) this.popup.openSnackBar({
            message: `Les objets sélectionnés ont bien été marqués pour la suppression.`,
            action: "Ok",
        });
    }

    duplicateObjects(indexes: number[]) {
        console.log("Dupping objects ", indexes);
        indexes.forEach((index) => {
            this.api.objects
                .dupplicate(this.objectList[index].id, this.auth.clientToken)
                .subscribe({
                    next: () => {
                        if (indexes.length === 1) this.popup.openSnackBar({
                            message: `L'objet "${this.objectList[index].name}" a bien été duppliqué`,
                            action: "Ok",
                        });
                        this.selectedObjects.delete(index)
                        this.anySelected.set(false)
                        this.onlyOne.set(false)
                        this.refresh();
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
        });
        if (indexes.length > 1) this.popup.openSnackBar({
            message: `Les objets sélectionnés ont bien été duppliqués.`,
            action: "Ok",
        });
    }

    refresh() {
        this.api.objects.all({}).subscribe((res) => {
            this.com.DomoObjectsAmount = res.total;
            this.com.DomoAllObjectsUpdate.next(res.objects);
        });
    }

    updateObjects(update: AnyObject[]) {
        this.objectList = update;
        this.buildingList = [];
        this.roomList = [];
        this.filteredBuilding.reset([]);
        this.filteredRoom.reset([]);
        this.namedFilter = "";

        this.objectList.forEach((o) => {
            if (
                o.building != undefined &&
                !this.buildingList.includes(o.building)
            ) {
                this.buildingList.push(o.building);
            }
            if (!this.roomList.includes(o.room)) {
                this.roomList.push(o.room);
            }
        });

        this.applyFilter();
    }
}
