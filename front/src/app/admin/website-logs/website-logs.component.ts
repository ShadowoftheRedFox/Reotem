import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthentificationService } from '../../../services/authentification.service';
import { APIService } from '../../../services/api.service';
import { PopupService } from '../../../services/popup.service';

@Component({
    selector: 'app-website-logs',
    imports: [
        MatButtonModule
    ],
    templateUrl: './website-logs.component.html',
    styleUrl: './website-logs.component.scss'
})

export class WebsiteLogsComponent {
    constructor(
        private auth: AuthentificationService,
        private api: APIService,
        private popup: PopupService
    ) {

    }
    dataDumpLauncher() {
        this.api.admin.dbDumb(this.auth.clientToken).subscribe(
            {
                next: () => {
                    this.popup.openSnackBar({ message: "Backup effectuée avec succès.", action: "Ok" })
                },
                error: (err) => {
                    console.log(JSON.stringify(err))
                }
            }
        );
    }
    showLogs() {
        this.api.admin.showLogs(this.auth.clientToken).subscribe()
    }
    downloadLogs() {
        this.api.admin.downloadLogs(this.auth.clientToken).subscribe(res => {
            console.log(res)
        })
    }
}

