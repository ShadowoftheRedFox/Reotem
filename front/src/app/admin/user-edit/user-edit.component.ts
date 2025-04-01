import { Component, input } from '@angular/core';
import { User } from '../../../models/api.model';

@Component({
    selector: 'app-user-edit',
    imports: [],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
    selectedUser = input<User | null>();
}
