import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { ValidatingComponent } from './validating/validating.component';
import { WebsiteLogsComponent } from './website-logs/website-logs.component';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/api.model';
import { MatBadgeModule } from '@angular/material/badge';
import { DeletionRequestComponent } from './deletion-request/deletion-request.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        MatTabsModule,
        UserEditComponent,
        UserListComponent,
        ValidatingComponent,
        WebsiteLogsComponent,
        MatIconModule,
        MatBadgeModule,
        DeletionRequestComponent
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent {
    selectedUser: User | null = null;
    selectUser(user: User | null) {
        this.selectedUser = user;
    }

    validationBadgeAmount: number | undefined = undefined;
    validationBadge(amount: number) {
        if (amount <= 0) {
            this.validationBadgeAmount = undefined;
        } else {
            this.validationBadgeAmount = amount;
        }
    }

    deletionBadgeAmount: number | undefined = undefined;
    deletionBadge(amount: number) {
        if (amount <= 0) {
            this.deletionBadgeAmount = undefined;
        } else {
            this.deletionBadgeAmount = amount;
        }
    }
}

