import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {config, CustomBrowserXhr} from "../app/config";
import {createDefer, Defer} from "../../lib/tslib/src/async";
import * as typeStubHorizon from "../../lib/typeStub-horizon-client/index";
import {clear} from "../../lib/tslib/src/array";
import {User} from "../model/user";
// import * as LargeLocalStorage from "../../lib/LargeLocalStorage/dist/index";
import {Storage} from "@ionic/storage";
import {Currency} from "../model/currency";
import {StorageKey, StorageService} from "./storage-service";
declare let Horizon: typeStubHorizon.HorizonFunc;

/*
 Generated class for the DatabaseService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class DatabaseService {
  private pendings: Defer<typeStubHorizon.Horizon, any>[] = [];
  progress: number;
  private user: User;
  private dbCache = new DBCache();
  // private storage: LargeLocalStorage;//=new LargeLocalStorage({size:this.storageSize,name:'cacheDb'});

  constructor(private http: Http,
              private storageService: StorageService,
              private storage: Storage,) {
    config.initialize();
    this.initialize();
  }

  initialize() {
    console.log('bootstrapping horizon...');
    let load_horizon = async () => {
      console.log('loading horizon...');
      this.http.get((await config.initialize()).serverUrlBase() + 'horizon/horizon.js')
        .map(res => res.text())
        .subscribe(
          data => {
            console.log('length', data.length);
            let script = document.createElement('script');
            script.innerText = data;
            document.head.appendChild(script);
            if (typeof Horizon != 'function') {
              console.error('failed to inject horizon script');
              setTimeout(load_horizon, 1000);
            } else {
              conn_horizon();
            }
          }
          , err => {
            console.error(err);
            setTimeout(load_horizon, 1000);
          }, () => sub.unsubscribe()
        );
      let sub = CustomBrowserXhr.progressEventEmitter.subscribe((event: any) => {
        console.log(event.loaded, event.loaded / 266826 * 100 + '%');
        this.progress = event.loaded / 266826;
      });
    };

    let conn_horizon = () => {
      console.log('connecting to horizon...');
      // let hz = Horizon({host: config.serverIp});
      this.dbCache.hz = Horizon();
      this.dbCache.hz.onReady(() => {
        console.log('horizon is ready');
        onConnected().then(() =>
          clear(this.pendings).forEach(d => d.resolve(this.dbCache.hz))
        );
      });
      this.dbCache.hz.onSocketError(err => {
        console.log('horizon socket error', err)
      });
      this.dbCache.hz.connect();
    };
    load_horizon();

    let initTables = async () => {
      let hz = await this.getHz();
      return Promise.all([
        Currency.initTable(hz)
      ]);
    };

    let onConnected = async () => {
      await initTables();
      this.user = await this.loadUser();
      return 'ok';
    };
  }

  loadUser: () => Promise<User> = async () => {
    let userId = await this.storageService.get(StorageKey.UserId);
    if (userId) {
      // console.log('old user id', userId);
      return await (await this.getHz())(User.tableName).find(userId).fetch().toPromise();
    } else {
      // console.log('new user');
      let user = new User();
      user.username = '';
      user.holdingCurrencyCode = 'USD';
      user.desiredCurrencyCode = 'HKD';
      let userId = (await (await this.getHz())(User.tableName).store(user).toPromise()).id;
      user.id = userId;
      // console.log('new user id', userId);
      await this.storageService.set(StorageKey.UserId, userId);
      return user;
    }
  };

  logout() {
    return this.storageService.remove(StorageKey.UserId);
  }

  getHz(): Promise<typeStubHorizon.Horizon> {
    let defer = createDefer();
    if (this.dbCache.hz) {
      defer.resolve(this.dbCache.hz);
    }
    else {
      this.pendings.push(defer);
    }
    return defer.promise;
  }

  getTable<A>(name: string): Promise<typeStubHorizon.TableObject<A>> {
    return this.getHz().then(hz => hz(name));
  }

  updateCachedUser: () => Promise<User> = async () => {
    this.user = await this.loadUser();
    return this.user;
  };

  clearCache() {
    this.dbCache = new DBCache();
  }

  getCachedUser: () => Promise<User> = async () => {
    if (this.dbCache.user)
      return this.dbCache.user;
    return await this.updateCachedUser();
  };

  /**
   * @deprecated slow and potentially non-atomic
   * */
  storeCachedUser: () => Promise<any> = async () => {
    if (this.dbCache.user) {
      return await (await this.getTable(User.tableName)).store(await this.getCachedUser()).toPromise();
    }
    throw new Error('no cached user');
  };

  updateUser(partialUser: User): Promise<any> {
    return (async () => {
      let cachedUser = await this.getCachedUser();
      Object.assign(cachedUser, partialUser);
      partialUser.id = cachedUser.id;
      return await (await this.getTable(User.tableName)).update(partialUser).toPromise();
    })()
  }

  getCachedCurrencies() {
    return (async () => {
      if (this.dbCache.currencies)
        return this.dbCache.currencies;
      console.log('not cached currencies');
      this.dbCache.currencies = await Currency.api.loadAll(await this.getHz());
      return this.dbCache.currencies;
    })();
  }
}
class Tables {
  users: typeStubHorizon.TableObject<User>;
  currencies: typeStubHorizon.TableObject<Currency>;
}
class DBCache {
  hz: typeStubHorizon.Horizon;
  user: User;
  currencies: Currency[];
}
