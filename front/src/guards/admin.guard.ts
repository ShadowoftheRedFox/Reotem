import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { inject } from '@angular/core';
import { APIService } from '../services/api.service';
import { lastValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {
    const auth = inject(AuthentificationService);
    const router = inject(Router);
    const falsy = router.createUrlTree(["/404"]);
    if (auth.clientToken.length == 0) return falsy;
    if (auth.client == null) return falsy;
    if (auth.client.role != "Administrator") return falsy;

    const api = inject(APIService);
    const res = await lastValueFrom(api.auth.verifyRole("Administrator", auth.clientToken));

    if (res === false) {
        return falsy;
    } else {
        return true;
    }
};
