import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const { value } = await Preferences.get({ key: 'authToken' });
  if(!value) {
    return router.navigate(['/auth']);
  }
  return true;
};
