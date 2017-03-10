import {Injectable} from '@angular/core';
import {Storage} from"@ionic/storage";
import 'rxjs/add/operator/map';

/*
 Generated class for the StorageService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class StorageService {

  constructor(public storage: Storage) {
    console.log('Hello StorageService Provider');
  }

  set(key: StorageKey, value: any): Promise<any> {
    return this.storage.set(StorageKey[key], value);
  }

  get<A>(key: StorageKey): Promise<A> {
    return this.storage.get(StorageKey[key]);
  }

  remove(key: StorageKey): Promise<any> {
    return this.storage.remove(StorageKey[key]);
  }
}
export enum StorageKey{
  UserId
}
