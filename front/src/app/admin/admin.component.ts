import { Component, Injectable, ViewChild } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { User } from '../../models/api.model';
import { toDateTime } from '../../models/date.model';

type Columns = "id" | "firstname" | "lastname" | "email" | "lastLogin";

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    // For internationalization, the `$localize` function from
    // the `@angular/localize` package can be used.
    firstPageLabel = `Première page`;
    itemsPerPageLabel = `Notifications par page:`;
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
    selector: 'app-admin',
    standalone: true,
    imports: [
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatPaginatorModule,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
      providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class AdminComponent  {
    displayedColumns: Columns[] = [/* "id", */ "firstname", "lastname", "email", "lastLogin"];
    users: User[] = [];

    dataSource=new MatTableDataSource<User>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private apiService: APIService, private auth: AuthentificationService) {
        this.users.push(auth.client as User);

        this.dataSource.data = this.users;
        this.getUsersList();
    }

    getUsersList() {
        this.apiService.admin.getAllUser(this.auth.clientToken, {}).subscribe({
            next: (data) => {
                this.users = data.users;
            },
            error: (err) => console.error('Erreur lors de la récupération des utilisateurs :', err)
        });
    }

    formatDate(date: string) {
        return toDateTime(date);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    sortData(sort: Sort) {
        console.log(sort);
        return 0;
        /* const data = this.notifications.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedNotifications = data;
            return;
        }

        this.sortedNotifications = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";

            switch (sort.active as Columns) {
                case "id":
                    return this.compare(a.id, b.id, isAsc);
                case "title":
                    return this.compare(a.title, b.title, isAsc);
                case "message":
                    return this.compare(a.message, b.message, isAsc);
                case 'selection':
                case 'menu':
                default:
                    return 0;
            }
        }) */
    }
}

