import { inject, Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';

const FCM_Token = 'fcmToken';
@Injectable({
  providedIn: 'root'
})
export class Fcm {
  init() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }

  }

  async getDiliverdNotification() {
    try {
      const notification = await PushNotifications.getDeliveredNotifications();
      console.log('Delivered notifications: ', notification);
    } catch (error) {
      console.error(error);
    }
  }

  async addListener() {
    let deviceToken;
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token) => {
      const fcmToken = token.value;
      const saved_token = await Preferences.get({ key: FCM_Token });
      console.log('saved_token', saved_token);
      deviceToken = saved_token
      if(saved_token){
        if(saved_token.value !== fcmToken){
          await Preferences.set({ key: FCM_Token, value: fcmToken });
        }
      } else {
        await Preferences.set({ key: FCM_Token, value: fcmToken });
      }
    });
    console.log('Device token: ' + deviceToken);

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
      // alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
      // alert('Push received: ' + JSON.stringify(notification));
    });
  }

  async registerPush() {
    try {
      await this.addListener();
      PushNotifications.checkPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          PushNotifications.requestPermissions().then((result) => {
            if (result.receive === 'granted') {
              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register();
            } else {
              // Show some error
            }
          });
        }
      });

    } catch (error) {
      console.error(error);
    }

  }
}
