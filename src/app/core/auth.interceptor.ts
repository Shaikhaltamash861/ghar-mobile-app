
import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: 'authToken' })).pipe(
    switchMap((res) => {
      const token = res.value;
      console.log('Retrieved token:', token);

      let authReq = req;
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: token,
          },
        });
      }

      return next(authReq);
    })
  );
};