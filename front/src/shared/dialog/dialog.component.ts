import { Component, Inject, Type } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { NgComponentOutlet, NgStyle } from '@angular/common';

export interface DialogDataType {
    btnOk?: string;
    btnNotOk?: string;
    title?: string;
    text?: string;
    component?: Type<unknown>;
    warn?: boolean;
    data?: never;
};

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        NgComponentOutlet,
        NgStyle,
        MatButton
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogDataType,
        private dialogRef: MatDialogRef<DialogComponent, unknown>
    ) {
        if (!data) data = {};
        if (!data.btnNotOk) data.btnNotOk = "Fermer";
        if (!data.title) data.title = "Dialog";
    }

    output: unknown = undefined;

    getOuput(o: unknown) {
        this.output = o;
    }

    validate() {
        if (this.output == undefined) {
            this.dialogRef.close(0);
        } else {
            this.dialogRef.close(this.output);
        }
    }
}
