import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const testGuard: CanActivateFn = () => {
    if (isDevMode()) {
        return true
    }

    const router = inject(Router);
    return router.createUrlTree(["/404"]);
};
