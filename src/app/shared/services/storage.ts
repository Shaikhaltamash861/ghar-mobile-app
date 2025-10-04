import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _ready: Promise<void>;

  constructor(private storage: Storage) {
    this._ready = this.init();
  }

  /**
   * Initialize storage with driver priority
   */
  private async init(): Promise<void> {
    // define extra driver for SQLite (on device)
    await this.storage.defineDriver(CordovaSQLiteDriver);

    this._storage = await this.storage.create();
  }

  private async ready() {
    return this._ready;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ready();
    await this._storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ready();
    return this._storage ? await this._storage.get(key) : null;
  }

  async remove(key: string): Promise<void> {
    await this.ready();
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this.ready();
    await this._storage?.clear();
  }

  async keys(): Promise<string[]> {
    await this.ready();
    return this._storage ? await this._storage.keys() : [];
  }
}
