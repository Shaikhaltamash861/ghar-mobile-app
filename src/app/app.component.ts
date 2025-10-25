import { Component, inject, Optional } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CacheService } from 'ionic-cache';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './shared/services/storage';
import { Fcm } from './shared/services/fcm';
import { Chat } from './shared/services/chat';

import { SafeArea } from '@outloud/ionic-safe-area';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private storage = inject(Storage);
  private cache = inject(CacheService);
  private fcm = inject(Fcm);
  private storageService = inject(StorageService);
  private chatService = inject(Chat);
  constructor(private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) {
    this.showSplash();
    this.initializeApp();
    this.platform.ready().then(() => {
      // Platform is ready and plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready');
    });
    SafeArea.enable({config: {
      customColorsForSystemBars: true,
      statusBarColor: '#075e54',
      statusBarContent: 'light',
      navigationBarColor: '#000000',
      navigationBarContent: 'light',
      offset: 0,
    }}).then((data) => {
      console.log('SafeArea enabled', data);
    }).catch((error) => {
      console.error('Error enabling SafeArea:', error);
    });

    this.initializeChatService();

    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.addListener('backButton', ({ canGoBack }) => {
        console.log('Back button pressed', canGoBack);
        if (canGoBack) {
          this.routerOutlet?.pop();
        } else {
          App.minimizeApp();
        }
      });
    });
  }

  async initializeApp() {
    await this.platform.ready();
    await this.storage.create();
    this.fcm.init();              // ✅ make sure storage is ready
    this.cache.setDefaultTTL(60 * 60);         // 1 hour
    this.cache.setOfflineInvalidate(false);    // keep cache when offline
    this.cache.enableCache(true);              // ✅ enable cache

    try {
      // Set background color to black
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });

      // Set status bar icons to light (white icons on black background)
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (err) {
      console.warn('StatusBar plugin not available:', err);
    }
  }


  async showSplash() {
    SplashScreen.show({
      showDuration: 2000,
    }).then(async () => {
      await SplashScreen.hide();
    });


  }

  initializeChatService() {
    this.chatService.init();
  }
}
