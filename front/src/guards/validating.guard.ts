import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { APIService } from '../services/api.service';

export const validatingGuard: CanActivateFn = async (route) => {
    const api = inject(APIService);
    const token = route.params['token'];

    if (!token || token.length < 10) {
        return false;
    }

    // check if api has this token, otherwise redirect to 404
    const res = await api.auth.tokenExists(token);
    return res;
};
