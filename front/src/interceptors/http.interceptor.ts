import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PopupService } from '../services/popup.service';
import { AuthentificationService } from '../services/authentification.service';
import { inject, isDevMode } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const popup = inject(PopupService);
    const auth = inject(AuthentificationService);

    return next(req).pipe(
        // si il n'y a pas d'erreur, vas dans tap
        tap(() => {
            /* if (event.type === HttpEventType.Response) {
                console.log(req.url, 'returned a response with status', event.status);
            } */

            if (!navigator.onLine && auth.isOnline) {
                popup.openSnackBar({ message: "Connection réseau perdue", action: "" });
                auth.isOnline = false;
            } else if (navigator.onLine && !auth.isOnline) {
                popup.openSnackBar({ message: "Connection réseau restaurée", action: "" });
                auth.isOnline = true;
            }
        }),
        // sinon vas ici
        catchError((error: HttpErrorResponse) => {
            // on ne popup pas les bad request (400)
            if (error.status != 400 && error.status != 404) {
                if (isDevMode()) {
                    popup.openSnackBar({ message: "Erreur lors de la requête: " + error.message + " " + error.statusText, action: "Fermer", duration: 10000 });
                } else {
                    popup.openSnackBar({ message: "Erreur lors de la requête", action: "Fermer", });
                }
            }
            // console.error('Erreur de la requête:', error);
            return throwError(() => new Error(error.message));
        })
    );
};
