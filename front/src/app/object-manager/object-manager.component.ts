import { Component, signal, WritableSignal } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { DomoComponent } from '../../shared/domo/domo.component';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AnyObject } from '../../models/domo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Action {
    name: string;
    icon: string;
    callback: () => void;
    link?: string | string[];
    class?: string;
    disabled?: WritableSignal<boolean>;
}

@Component({
    selector: 'app-object-manager',
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
        MatCheckboxModule
    ],
    templateUrl: './object-manager.component.html',
    styleUrl: './object-manager.component.scss'
})
export class ObjectManagerComponent {
    readonly bar_class = 'w-full flex flex-row flex-wrap justify-start gap-4 items-stretch px-4';
    objectList: AnyObject[] = [];

    filteredObjectList: AnyObject[] = [];

    namedFilter = "";
    noNamedFilterResult = false;

    filteredBuilding = new FormControl<string[]>([]);
    buildingList: string[] = [];

    filteredRoom = new FormControl<string[]>([]);
    roomList: string[] = [];

    selectedObjects = new Map<number, boolean>();
    anySlected = signal(false);

    readonly actionsList: Action[] = [
        {
            name: "Ajouter",
            icon: "add",
            callback: () => {
                this.router.navigate(['object', 'create']);
            }
        },
        {
            name: "Effacer",
            icon: "delete",
            callback: () => this.deleteObjects(),
            disabled: this.anySlected
        },
        {
            name: "Dupliquer",
            icon: "content_copy",
            callback: () => this.duplicateObjects(),
            disabled: this.anySlected
        },
        {
            name: "Rafraîchir",
            icon: "refresh",
            callback: () => this.refresh()
        },
    ];

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router
    ) {
        // listen to event change
        com.DomoAllObjectsUpdate.subscribe(update => {
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
        if (this.filteredRoom.value == null || this.filteredRoom.value.length == 0) return true;
        return this.filteredRoom.value.includes(room);
    }

    inFilteredBuilding(building?: string) {
        if (this.filteredBuilding.value == null || this.filteredBuilding.value.length == 0) return true;
        if (building === undefined) return false;
        return this.filteredBuilding.value.includes(building);
    }

    applyFilter() {
        this.filteredObjectList = [];
        this.objectList.forEach(o => {
            if (this.inFilteredRoom(o.room) && this.inFilteredBuilding(o.building)) {
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
        if (obj.building != undefined && obj.building.toLowerCase().includes(filter)) {
            res = true;
        }
        if (
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

    domoSelected(index: number) {
        this.selectedObjects.set(index, !(this.selectedObjects.get(index) || false));
        let temp = false;
        this.selectedObjects.forEach((v) => {
            if (v === true) {
                temp = true;
            }
        });
        this.anySlected.set(temp);
    }

    deleteObjects() {
        console.log("Not implemented yet");
        // TODO api call
    }

    duplicateObjects() {
        console.log("Not implemented yet");
        // TODO create new objects based on those ones, api call
    }

    refresh() {
        this.api.objects.all({}).subscribe(res => {
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

        this.objectList.forEach(o => {
            if (o.building != undefined && !this.buildingList.includes(o.building)) {
                this.buildingList.push(o.building);
            }
            if (!this.roomList.includes(o.room)) {
                this.roomList.push(o.room);
            }
        });

        this.applyFilter();
    }
}
