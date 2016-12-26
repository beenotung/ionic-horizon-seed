import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {config, progressEventEmitter} from "../app/config";
import {Defer, createDefer} from "../../lib/tslib/src/async";
import * as Horizon from "@horizon/client/dist/horizon";
import * as typeStubHorizon from "../../lib/typeStub-horizon-client/index";
import {clear} from "../../lib/tslib/src/array";
import {User} from "../model/user";
// import * as LargeLocalStorage from "../../lib/LargeLocalStorage/dist/index";
import {TranslateService} from "ng2-translate";
import {CommonService} from "./commonService";
import {Storage} from "@ionic/storage"
import {Currency} from "../model/currency";
import {TableObject} from "../../lib/typeStub-horizon-client/index";

/*
 Generated class for the DatabaseService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
// const url = config.serverUrlBase + 'horizon/horizon.js';
// const url = '/horizon/horizon.js';
let cached: {
  user: User
  , currencies: Currency[]
  , hz: typeStubHorizon.Horizon
} = <any>{};
@Injectable()
export class DatabaseService {
  // private hz: typeStubHorizon.Horizon;
  private pendings: Defer<typeStubHorizon.Horizon,any>[] = [];
  // private user: User;
  // private currencies: Currency[];
  progress: number;
  // userModel: (userId: string) => FinalQuery<User>;

  // private storage: LargeLocalStorage;//=new LargeLocalStorage({size:this.storageSize,name:'cacheDb'});

  constructor(private http: Http,
              private storage: Storage,
              private common: CommonService,
              private translate: TranslateService,) {
    config.initialize();
    this.initialize();
  }

  initialize() {
    console.log('bootstrapping horizon...');
    let load_horizon = async() => {
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
      let sub = progressEventEmitter.subscribe((event: any) => {
        console.log(event.loaded, event.loaded / 266826 * 100 + '%');
        this.progress = event.loaded / 266826;
      });
    };

    let conn_horizon = () => {
      console.log('connecting to horizon...');
      // let hz = Horizon({host: config.serverIp});
      cached.hz = Horizon();
      cached.hz.onReady(() => {
        console.log('horizon is ready');
        onConnected().then(() =>
          clear(this.pendings).forEach(d => d.resolve(cached.hz))
        );
      });
      cached.hz.onSocketError(err => {
        console.log('horizon socket error', err)
      });
      cached.hz.connect();
    };
    load_horizon();

    let initTables = async() => {
      let hz = await this.getHz();
      return Promise.all([
        Currency.initTable(hz)
      ]);
    };

    let onConnected = async() => {
      await initTables();
      cached.user = await this.loadUser();
      return 'ok';
    };
  }

  loadUser: () => Promise<User> = async() => {
    let userId = await this.storage.get('userId');
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
      await this.storage.set('userId', userId);
      return user;
    }
  };

  logout() {
    return this.storage.remove('userId');
  }

  getHz(): Promise<typeStubHorizon.Horizon> {
    let defer = createDefer();
    if (cached.hz) {
      defer.resolve(cached.hz);
    }
    else {
      this.pendings.push(defer);
    }
    return defer.promise;
  }

  getTable<A>(name: string): Promise<typeStubHorizon.TableObject<A>> {
    return this.getHz().then(hz => hz(name));
  }

  updateCachedUser: () => Promise<User> = async() => {
    cached.user = await this.loadUser();
    return cached.user;
  };

  clearCache() {
    cached = <any>{};
  }

  getCachedUser: () => Promise<User> = async() => {
    if (cached.user)
      return cached.user;
    return await this.updateCachedUser();
  };

  /**
   * @deprecated slow and potentially non-atomic
   * */
  storeCachedUser: () => Promise<any> = async() => {
    if (cached.user) {
      return await (await this.getTable(User.tableName)).store(await this.getCachedUser()).toPromise();
    }
    throw new Error('no cached user');
  };

  updateUser(partialUser: User): Promise<any> {
    return (async() => {
      let cachedUser = await this.getCachedUser();
      Object.assign(cachedUser, partialUser);
      partialUser.id = cachedUser.id;
      return await (await this.getTable(User.tableName)).update(partialUser).toPromise();
    })()
  }

  getCachedCurrencies() {
    return (async() => {
      if (cached.currencies)
        return cached.currencies;
      console.log('not cached currencies');
      cached.currencies = await Currency.api.loadAll(await this.getHz());
      return cached.currencies;
    })();
  }
}
class Tables {
  users: TableObject<User>;
  currencies: TableObject<Currency>;
}
