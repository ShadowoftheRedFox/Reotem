import { Component, Input, OnChanges } from '@angular/core';
import { User, UserLevel, UserRole, UserSexe } from '../../../models/api.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { APIService } from '../../../services/api.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { toDateTime } from '../../../models/date.model';
import { environment } from '../../../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupService } from '../../../services/popup.service';

@Component({
    selector: 'app-user-edit',
    imports: [
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        ClipboardModule,
        MatTooltipModule
    ],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnChanges {
    @Input({ required: true }) selectedUser: User | null = null;

    readonly BaseUrl = environment.api_url;
    readonly userSexe = UserSexe;
    readonly userRole = UserRole;
    readonly userLvl = UserLevel;

    format(date: string) {
        return toDateTime(date);
    }

    getAge(date?: string) {
        const now = new Date();
        const then = new Date(date as string);
        return now.getFullYear() - then.getFullYear();
    }

    formGroup = new FormGroup({
        firstname: new FormControl("None", [Validators.required]),
        lastname: new FormControl("None", [Validators.required]),
        role: new FormControl<UserRole>("Tester", [Validators.required]),
        lvl: new FormControl<UserLevel>("Débutant", [Validators.required]),
        exp: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
        adminValidated: new FormControl<boolean>(false, [Validators.required]),
    });

    ngOnChanges(): void {
        this.formGroup.controls.firstname.setValue(this.selectedUser?.firstname || "None",);
        this.formGroup.controls.lastname.setValue(this.selectedUser?.lastname || "None",);
        this.formGroup.controls.role.setValue(this.selectedUser?.role || "Tester",);
        this.formGroup.controls.lvl.setValue(this.selectedUser?.lvl || "Débutant",);
        this.formGroup.controls.exp.setValue(this.selectedUser?.exp || 0,);
        this.formGroup.controls.adminValidated.setValue(this.selectedUser?.adminValidated || false,);
    }

    constructor(
        private api: APIService,
        private auth: AuthentificationService,
        private popup: PopupService,
    ) { }

    genericError(ctrl: FormControl) {
        if (ctrl.hasError("required")) {
            return "Champ requis";
        } else if (ctrl.hasError("min")) {
            return "La valeur minimale est " + (ctrl.getError("min").min)
        } else if (ctrl.hasError("max")) {
            return "La valeur maximale est " + (ctrl.getError("max").max)
        }

        if (ctrl.errors != null) {
            console.log(ctrl.errors);
        }
        return "";
    }

    submitEdit() {
        if (this.formGroup.invalid || !this.selectedUser) return;
        this.api.user.update(this.selectedUser.id as string, this.auth.clientToken, {
            firstname: this.formGroup.value.firstname as string,
            lastname: this.formGroup.value.lastname as string,
            role: this.formGroup.value.role as UserRole,
            lvl: this.formGroup.value.lvl as UserLevel,
            exp: this.formGroup.value.exp as number,
            adminValidated: this.formGroup.value.adminValidated as false,
        }).subscribe({
            next: () => {
                this.popup.openSnackBar({ message: "Utilisateur modifié" });
            },
            error: () => {
                this.popup.openSnackBar({ message: "Échec de l'interaction" });
            }
        })
    }

    copyToolTip = "Cliquez pour copier!";
    afterCopy() {
        this.copyToolTip = "Copié!"
        setTimeout(() => {
            this.copyToolTip = "Cliquez pour copier!";
        }, 500);
    }
}
