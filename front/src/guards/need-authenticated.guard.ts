import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { APIService } from '../services/api.service';
import { lastValueFrom } from 'rxjs';

export const needAuthenticatedGuard: CanActivateFn = async () => {
    const auth = inject(AuthentificationService);
    if (auth.clientToken.length == 0) return false;

    const api = inject(APIService);
    const res = await lastValueFrom(api.auth.get(auth.clientToken));
    console.log("IsAuthenticated: ", res);
    return res != undefined;
};
