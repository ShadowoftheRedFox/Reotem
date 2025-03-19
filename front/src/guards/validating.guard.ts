import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { APIService } from '../services/api.service';

export const validatingGuard: CanActivateFn = async (route, state) => {
    const api = inject(APIService);
    const token = route.params['token'];

    if (!token || token.length < 64) {
        return false;
    }

    // check if api has this token, otherwise redirect to 404
    // await api.auth.tokenExists(token);
    const res = await api.auth.tokenExists(token);
    return res;
};
