import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PopupService } from '../services/popup.service';
import { AuthentificationService } from '../services/authentification.service';
import { inject, isDevMode } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const popup = inject(PopupService);
    const auth = inject(AuthentificationService);

    return next(req).pipe(
        // if no error, go in tap
        tap(() => {
            /* if (event.type === HttpEventType.Response) {
                console.log(req.url, 'returned a response with status', event.status);
            } */

            if (!navigator.onLine && auth.isOnline) {
                popup.openSnackBar({ message: "Connexion réseau perdue", action: "" });
                auth.isOnline = false;
            } else if (navigator.onLine && !auth.isOnline) {
                popup.openSnackBar({ message: "Connexion réseau restaurée", action: "" });
                auth.isOnline = true;
            }
        }),
        // else go here
        catchError((error: HttpErrorResponse) => {
            // don't popup error except server
            if (error.status >= 500) {
                if (isDevMode()) {
                    popup.openSnackBar({ message: "Erreur lors de la requête: " + error.message + " " + error.statusText, action: "Fermer", duration: 10000 });
                } else {
                    popup.openSnackBar({ message: "Erreur lors de la requête", action: "Fermer", });
                }
            }
            if (error.error.message) {
                error.error.message = JSON.parse(error.error.message);
            }
            if (isDevMode()) {
                console.error('Erreur de la requête:', error);
            }
            return throwError(() => error);
        })
    );
};
