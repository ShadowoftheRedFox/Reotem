import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PopupOptions {
    message?: string;
    action?: string;
    /** En milisecondes */
    duration?: number;
    verticalPositon?: "top" | "bottom";
    horizontalPositon?: "start" | "center" | "end" | "left" | "right";
    textDirection?: "ltr" | "rtl";
    politeness?: AriaLivePoliteness;
    class?: string | string[];
}

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor(
        private snackbar: MatSnackBar,
    ) { }

    openSnackBar(options?: PopupOptions) {
        if (!options) options = {};
        if (!options.action) options.action = "Fermer";
        if (!options.message) options.message = "Erreur reçue";
        if (!options.duration) options.duration = 5000;
        if (!options.verticalPositon) options.verticalPositon = "top";
        if (!options.horizontalPositon) options.horizontalPositon = "right";
        if (!options.textDirection) options.textDirection = "ltr";

        return this.snackbar.open(options.message, options.action, {
            duration: options.duration,
            direction: options.textDirection,
            verticalPosition: options.verticalPositon,
            horizontalPosition: options.horizontalPositon,
            politeness: options.politeness,
            panelClass: options.class,
        }).afterDismissed();
    }
}
