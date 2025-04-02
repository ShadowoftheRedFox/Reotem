import {
    AfterViewInit,
    Component,
    Injectable,
    output,
    ViewChild,
} from "@angular/core";
import { APIService } from "../../../services/api.service";
import { AuthentificationService } from "../../../services/authentification.service";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
    MatPaginator,
    MatPaginatorIntl,
    MatPaginatorModule,
} from "@angular/material/paginator";
import { Subject } from "rxjs";
import { AnyObject } from "../../../models/domo.model";
import { CommunicationService } from "../../../services/communication.service";
import { PopupService } from "../../../services/popup.service";
import { MatCheckboxModule } from "@angular/material/checkbox";

type Columns = "selection" | "objectId" | "name" | "userId";

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    // For internationalization, the `$localize` function from
    // the `@angular/localize` package can be used.
    firstPageLabel = `Première page`;
    itemsPerPageLabel = `Demandes par page:`;
    lastPageLabel = `Dernière page`;

    // You can set labels to an arbitrary string too, or dynamically compute
    // it through other third-party internationalization libraries.
    nextPageLabel = "Page suivante";
    previousPageLabel = "Page précédente";

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Page unique`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Page ${page + 1} sur ${amountPages}`;
    }
}
@Component({
    selector: "app-deletion-request",
    imports: [
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatButtonModule,
    ],
    templateUrl: "./deletion-request.component.html",
    styleUrl: "./deletion-request.component.scss",
    providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class DeletionRequestComponent implements AfterViewInit {
    displayedColumns: Columns[] = [
        "selection",
        /* "objectId", */ "name",
        "userId",
    ];
    objects: AnyObject[] = [];
    sortedObjects: AnyObject[] = [];

    dataSource = new MatTableDataSource<AnyObject>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    amount = output<number>();
    selectedAnyObject = output<AnyObject | null>();
    selectedId = "";

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private popup: PopupService
    ) {
        this.getObjectsList();
    }

    getObjectsList() {
        this.api.objects.all({ toDelete: true }).subscribe({
            next: (data) => {
                this.objects = data.objects;
                this.updatObjectsContent();
            },
            error: (err) => {
                console.log(err);
                this.popup.openSnackBar({
                    message: "Échec du chargement: " + err,
                });
            },
        });
    }

    updatObjectsContent() {
        this.amount.emit(this.objects.length);
        this.sortedObjects = this.objects;
        this.dataSource.data = this.objects;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    sortData(sort: Sort) {
        const data = this.objects.slice();
        if (!sort.active || sort.direction === "") {
            this.sortedObjects = data;
            return;
        }

        this.sortedObjects = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";

            switch (sort.active as Columns) {
                case "name":
                    return this.compare(a.name, b.name, isAsc);
                case "objectId":
                    return this.compare(a.id, b.id, isAsc);
                case "userId":
                    return this.compare(
                        a.toDelete?.id as string,
                        b.toDelete?.id as string,
                        isAsc
                    );
                default:
                    return 0;
            }
        });
    }

    private compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    validate(id: string) {
        this.api.objects.delete(id, this.auth.clientToken).subscribe({
            next: () => {
                this.getObjectsList();
                this.popup.openSnackBar({
                    message: "Objet supprimé",
                });
            },
            error: () => {
                this.popup.openSnackBar({
                    message: "Échec de l'interaction",
                });
            },
        });
    }
}
