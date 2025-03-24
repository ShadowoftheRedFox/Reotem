import { isDevMode } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const testGuard: CanActivateFn = () => {
    return isDevMode();
};
