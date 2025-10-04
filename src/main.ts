import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/auth.interceptor';
import { IonicStorageModule, provideStorage } from '@ionic/storage-angular';
import { storageConfig } from './storage-config';
import { CacheModule } from 'ionic-cache';
import { importProvidersFrom } from '@angular/core';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(CacheModule.forRoot({ keyPrefix: 'my-app-cache' })),
    importProvidersFrom(IonicStorageModule.forRoot({
     name: '__mydb',
     driverOrder: [CordovaSQLiteDriver._driver, Drivers.LocalStorage,Drivers.IndexedDB,]
   })),
  ],
});
