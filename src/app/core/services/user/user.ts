import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class User {

  async setUser(user: any) {
    return await Preferences.set({
      key: 'user',
      value: JSON.stringify(user),
    });
  }

  async getUser(): Promise<any> {
    const { value } = await Preferences.get({ key: 'user' });
    return value ? JSON.parse(value) : null;
  }

  async isOwner(): Promise<any> {
    const user = await this.getUser();
    return user && user['role'] === 'owner'? user : null;
  } 
  
}
