import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Notification } from '../../models/api.model';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';

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

type Columns = "selection" | "title" | "message" | "menu" | "id";

@Component({
    selector: 'app-notification',
    imports: [
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatPaginatorModule,
    ],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class NotificationComponent implements AfterViewInit {
    notifications: Notification[] = [];
    sortedNotifications: Notification[] = [];
    displayedColumns: Columns[] = ['selection', 'id', 'title', 'message', 'menu'];

    selectedItems: boolean[] = [];

    dataSource = new MatTableDataSource<Notification>(this.sortedNotifications);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private router: Router,
    ) {
        if (auth.client == null) {
            router.navigate(["/"]);
            return;
        }

        api.notifications.getAll(auth.client.id, auth.clientToken, { limit: 10 }).subscribe({
            next: (res) => {
                this.notifications = res;
                this.sortedNotifications = this.notifications;

                this.notifications.forEach(() => {
                    this.selectedItems.push(false);
                });

                this.dataSource.data = this.notifications;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    sortNotif(sort: Sort) {
        const data = this.notifications.slice();
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
        })
    }

    private compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    // TODO interactions
}
