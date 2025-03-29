import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { APIService } from '../services/api.service';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
    const router = inject(Router);
    const auth = inject(AuthentificationService);

    if (auth.clientToken.length == 0) {
        console.log("Redirecting...");
        router.navigate(["/connection"]);
        return false;
    }

    const api = inject(APIService);
    const res = await lastValueFrom(api.auth.get(auth.clientToken));

    if (res === undefined) {
        console.log("Redirecting...");
        router.navigate(["/connection"]);
    }

    return res != undefined;
};
