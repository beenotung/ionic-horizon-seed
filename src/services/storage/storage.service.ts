import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import "rxjs/add/operator/map";
import {enum_only_string} from "@beenotung/tslib/enum";
import {isDefined} from "@beenotung/tslib/lang";
import {config} from "../../app/app.config";
import {setWindowProp} from "@beenotung/tslib";

export enum StorageKey {
  lang
  , role
  , notices
  , device_id
}

enum_only_string(StorageKey);

/*
  Generated class for the StorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageService {
  constructor(public storage: Storage) {
    if (config.mode === "dev") {
      setWindowProp(this.constructor.name, this);
    }
  }

  async has(key: StorageKey) {
    return isDefined(await this.get(key));
  }

  async set(key: StorageKey, value: any) {
    return this.storage.set(StorageKey[key], value);
  }

  async get<A>(key: StorageKey): Promise<A> {
    return this.storage.get(StorageKey[key]);
  }

  async remove(key: StorageKey) {
    return this.storage.remove(StorageKey[key]);
  }

  async append<A>(key: StorageKey, x: A) {
    const xs: A[] = await this.get(key)  as A[] || [];
    xs.push(x);
    return this.set(key, xs);
  }

  async clear() {
    return this.storage.clear();
  }

  /**
   * preserve device id
   * */
  async reset() {
    const id = await this.get(StorageKey.device_id);
    await this.clear();
    return this.set(StorageKey.device_id, id);
  }
}
