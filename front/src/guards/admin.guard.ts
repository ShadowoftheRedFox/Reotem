import { CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthentificationService);
    if (auth.clientToken.length == 0) return false;
    if (auth.client == null) return false;
    if (auth.client.role != "Administrator") return false;

    // TODO now check with api to be sure?

    return true;
};
