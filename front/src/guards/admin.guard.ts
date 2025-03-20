import { CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { inject } from '@angular/core';
import { APIService } from '../services/api.service';
import { lastValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {
    const auth = inject(AuthentificationService);
    if (auth.clientToken.length == 0) return false;
    if (auth.client == null) return false;
    if (auth.client.role != "Administrator") return false;

    // TODO now check with api to be sure?
    const api = inject(APIService);
    const res = await lastValueFrom(api.auth.verifyRole(auth.client.role, auth.clientToken));
    console.log("IsAdmin: ", res);
    return res;
};
