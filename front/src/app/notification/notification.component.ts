import { AfterViewInit, Component, computed, Injectable, signal, ViewChild } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Notification } from '../../models/api.model';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { PopupService } from '../../services/popup.service';

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

export interface Task {
    checked: boolean;
    subtasks?: Task[];
}

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
        RouterLink
    ],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class NotificationComponent implements AfterViewInit {
    notifications: Notification[] = [];
    sortedNotifications: Notification[] = [];
    readonly displayedColumns: Columns[] = ['selection', /* 'id', */ 'title', 'message', 'menu'];

    dataSource = new MatTableDataSource<Notification>(this.sortedNotifications);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    readonly task = signal<Task>({
        checked: false,
        subtasks: []
    });

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    constructor(
        private com: CommunicationService,
        private api: APIService,
        private auth: AuthentificationService,
        private popup: PopupService,
        private router: Router,
    ) {
        if (auth.client == null) {
            router.navigate(["/"]);
            return;
        }

        api.notifications.getAll(auth.client.id, auth.clientToken, { limit: 10 }).subscribe({
            next: (res) => {
                this.notifications = res;
                this.updateNotifsContent();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateNotifsContent() {
        this.sortedNotifications = this.notifications;

        const subtasks: Task[] = [];
        this.notifications.forEach(() => {
            subtasks.push({ checked: false });
        });

        this.task.set({
            checked: false,
            subtasks: subtasks
        });

        this.dataSource.data = this.notifications;

        this.taskPartiallyComplete = computed(() => {
            const task = this.task();
            if (!task.subtasks) {
                return false;
            }
            return task.subtasks.some(t => t.checked) && !task.subtasks.every(t => t.checked);
        })
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

    // interactions

    notifIdToIndex(id: string) {
        for (let i = 0; i < this.notifications.length; i++) {
            if (this.notifications[i].id == id) return i;
        }
        return -1;
    }

    taskPartiallyComplete = computed(() => {
        const task = this.task();
        if (!task.subtasks) {
            return false;
        }
        return task.subtasks.some(t => t.checked) && !task.subtasks.every(t => t.checked);
    });

    update(checked: boolean, id?: number) {
        this.task.update(task => {
            if (id === undefined) {
                task.checked = checked;
                task.subtasks?.forEach(t => (t.checked = checked));
            } else {
                task.subtasks![id].checked = checked;
                task.checked = task.subtasks?.every(t => t.checked) ?? true;
            }
            return { ...task };
        });
    }

    delete(elementId?: string) {
        const ids: string[] = [];
        const aid: number[] = [];

        this.task().subtasks?.forEach((t, i) => {
            if (t.checked) {
                aid.push(i);
                ids.push(this.notifications[i].id);
            }
        });

        if (elementId != undefined) {
            ids.push(elementId);
        }

        this.api.notifications.delete(ids, this.auth.clientToken).subscribe({
            next: () => {
                if (elementId != undefined) {
                    this.notifications.forEach((n, i) => {
                        if (n.id == elementId) {
                            this.notifications.splice(i, 1);
                        }
                    });
                } else {
                    aid.forEach((i) => {
                        this.notifications.splice(i, 1);
                    });
                }
                this.updateNotifsContent();
                this.sendUnreadNotification();
            },
            error: () => {
                this.popupError();
            },
        })
    }

    read(elementId?: string) {
        const ids: string[] = [];
        const aid: number[] = [];

        this.task().subtasks?.forEach((t, i) => {
            if (t.checked) {
                aid.push(i);
                ids.push(this.notifications[i].id);
            }
        });

        if (elementId != undefined) {
            ids.push(elementId);
        }

        this.api.notifications.read(ids, this.auth.clientToken).subscribe({
            next: () => {
                if (elementId != undefined) {
                    this.notifications.forEach((n, i) => {
                        if (n.id == elementId) {
                            this.notifications[i].read = true;
                        }
                    });
                } else {
                    aid.forEach((i) => {
                        this.notifications[i].read = true;
                    });
                }
                this.updateNotifsContent();
                this.sendUnreadNotification();
            },
            error: () => {
                this.popupError();
            },
        })
    }

    unread(elementId?: string) {
        const ids: string[] = [];
        const aid: number[] = [];

        this.task().subtasks?.forEach((t, i) => {
            if (t.checked) {
                aid.push(i);
                ids.push(this.notifications[i].id);
            }
        });

        if (elementId != undefined) {
            ids.push(elementId);
        }

        this.api.notifications.unread(ids, this.auth.clientToken).subscribe({
            next: () => {
                if (elementId != undefined) {
                    this.notifications.forEach((n, i) => {
                        if (n.id == elementId) {
                            this.notifications[i].read = false;
                        }
                    });
                } else {
                    aid.forEach((i) => {
                        this.notifications[i].read = false;
                    });
                }
                this.updateNotifsContent();
                this.sendUnreadNotification();
            },
            error: () => {
                this.popupError();
            },
        })
    }

    sendUnreadNotification() {
        let count = 0;
        this.notifications.forEach(n => {
            count += Number(!n.read);
        });
        this.com.NotifUpdate.next(count);
    }

    popupError() {
        this.popup.openSnackBar({ message: "Échec de l'interaction", duration: 10000 });
    }
}
