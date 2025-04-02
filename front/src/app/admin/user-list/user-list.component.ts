import { AfterViewInit, Component, Injectable, output, ViewChild } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { User } from '../../../models/api.model';
import { toDateTime } from '../../../models/date.model';
import { CommunicationService } from '../../../services/communication.service';
import { PopupService } from '../../../services/popup.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type Columns = "selection" | "id" | "firstname" | "lastname" | "email" | "lastLogin";

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    // For internationalization, the `$localize` function from
    // the `@angular/localize` package can be used.
    firstPageLabel = `Première page`;
    itemsPerPageLabel = `Utilisateurs par page:`;
    lastPageLabel = `Dernière page`;

    // You can set labels to an arbitrary string too, or dynamically compute
    // it through other third-party internationalization libraries.
    nextPageLabel = 'Page suivante';
    previousPageLabel = 'Page précédente';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Page unique`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Page ${page + 1} sur ${amountPages}`;
    }
}

@Component({
    selector: 'app-user-list',
    imports: [
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class UserListComponent implements AfterViewInit {
    displayedColumns: Columns[] = ["selection",/* "id", */ "firstname", "lastname", "email", "lastLogin"];
    users: User[] = [];
    sortedUsers: User[] = [];
    filteredUsers: User[] = [];

    dataSource = new MatTableDataSource<User>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selectedUser = output<User | null>();
    selectedId = "";

    filterControl = new FormControl("");

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
        this.getUsersList();

        this.filterControl.valueChanges.subscribe((c) => {
            if (!c || c.length == 0) {
                this.dataSource.data = this.users;
                return;
            }
            this.filteredUsers = [];
            this.users.forEach(u => {
                if (
                    u.id.includes(c) ||
                    u.firstname.includes(c) ||
                    u.lastname.includes(c) ||
                    u.email.includes(c)
                ) {
                    this.filteredUsers.push(u);
                }
            });
            this.sortedUsers = this.filteredUsers;
            this.dataSource.data = this.filteredUsers;
        });
    }

    getUsersList() {
        this.api.admin.getAllUser(this.auth.clientToken, {}).subscribe({
            next: (data) => {
                this.users = data.users;
                this.updateUsersContent();
            },
            error: () => {
                this.popup.openSnackBar({
                    message: "Échec du chargement"
                });
            }
        });
    }

    updateUsersContent() {
        this.sortedUsers = this.users;
        this.dataSource.data = this.users;
    }

    formatDate(date?: string) {
        if (date == undefined) {
            return "Aucune connexion"
        }
        return toDateTime(date);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    sortData(sort: Sort) {
        const data = this.users.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedUsers = data;
            return;
        }

        this.sortedUsers = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";

            switch (sort.active as Columns) {
                case "id":
                    return this.compare(a.id, b.id, isAsc);
                case "email":
                    return this.compare(a.email, b.email, isAsc);
                case "firstname":
                    return this.compare(a.firstname, b.firstname, isAsc);
                case "lastname":
                    return this.compare(a.lastname, b.lastname, isAsc);
                case "lastLogin":
                    return this.compare(a.lastLogin, b.lastLogin, isAsc);
                default:
                    return 0;
            }
        })
    }

    private compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    update(id: string, checked: boolean) {
        if (checked) {
            this.selectedId = id;
            this.selectedUser.emit(this.users.find(u => u.id == id) || null);
        } else {
            this.selectedId = '';
            this.selectedUser.emit(null);
        }
    }
}

