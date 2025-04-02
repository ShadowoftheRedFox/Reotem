import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthentificationService } from '../../../services/authentification.service';
import { DialogComponent, DialogDataType } from '../../../shared/dialog/dialog.component';
import { APIService } from '../../../services/api.service';
import { PopupService } from '../../../services/popup.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: "app-website-logs",
    imports: [MatButtonModule],
    templateUrl: "./website-logs.component.html",
    styleUrl: "./website-logs.component.scss",
})
export class WebsiteLogsComponent {
    constructor(
        private auth: AuthentificationService,
        private api: APIService,
        private popup: PopupService,
        private dialog: MatDialog
    ) {}
    dataDumpLauncher() {
        this.api.admin.dbDumb(this.auth.clientToken).subscribe({
            next: () => {
                this.popup.openSnackBar({
                    message: "Backup effectuée avec succès.",
                    action: "Ok",
                });
            },
            error: (err) => {
                console.log(JSON.stringify(err));
            },
        });
    }

    showLogs() {
        this.api.admin.showLogs(this.auth.clientToken).subscribe({
            next: (res) => {
                this.opendialog(res.content.replaceAll("\n", "<br>"));
            }
        });
    }

    downloadLogs() {
        this.api.admin.downloadLogs(this.auth.clientToken).subscribe((blob) => {
            const a = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = "logs.log";
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    downloadDump() {
        this.api.admin.downloadData(this.auth.clientToken).subscribe((blob) => {
            const a = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = "data.json";
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    generateReport() {
        this.api.admin.generateReport(this.auth.clientToken).subscribe((blob) => {
            const a = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = "report.txt";
            a.click();
            URL.revokeObjectURL(objectUrl);
        })
    }

    opendialog(text: string) {
        this.dialog.open<DialogComponent, DialogDataType>(DialogComponent, {
            minWidth: '80dvw',
            minHeight: '80dvh',
            enterAnimationDuration: 500,
            data: {
                title: "Logs",
                text: text,
                btnNotOk: "Fermer",
                text_style: "text-align: start; overflow-wrap: anywhere;"
            }
        });
    }
}

