import {Injectable} from "@angular/core";
import {BaseDBObject} from "../../model/api/base/base-db-object";
import {TranslateService} from "@ngx-translate/core";
import {Platform} from "ionic-angular";
import {autoRetryAsync, createDefer, Defer} from "@beenotung/tslib/async";
import {tryWithDefault} from "@beenotung/tslib/lang";
import {getHorizon, horizon_api_size, toHorizonData} from "@beenotung/tslib/horizon";
import {CreatedObject, FindQuery, Horizon, OldRecord, oneOrList, TableQuery} from "typestub-horizon-client";
import {Config} from "../../model/api/custom/config";
import {getSemverDiffType, SemverDiffType, to_semver} from "@beenotung/tslib/semver";
import {DBConfig} from "./database.service.config";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/mergeMap";
import {HorizonService, ProgressService} from "angularlib";
import {TableType} from "../../model/api/tables";
import {CustomHorizon, toCustomHorizon} from "./database";
import {BaseSearchObject} from "../../model/api/base/base-search-object";
import {isDefined} from "@beenotung/tslib";

export namespace databaseService.hooks {
  export let checkClientVersion: (db: DatabaseService, config: Config) => Promise<any>;
  export let logout: () => void;
}

export class DBCache {
  hz: Horizon;
  hzDefer: Defer<Horizon, any> = createDefer<Horizon, any>();
}

let dbCache = new DBCache();

function toData<A extends BaseDBObject>(x: A): A & OldRecord {
  return toHorizonData(x as any, false) as any;
}

export function toDataF<A extends BaseDBObject>(table: TableType<A>): (x: A) => A & OldRecord {
  return table.toData || toData;
}

export interface QueryChain<Data extends BaseDBObject, Index extends BaseSearchObject> {
  /**@deprecated*/
  use(f: (a: Index) => any): QueryChain<Data, Index>;

  find(): FindQuery<Data>;

  findAll(): TableQuery<Data>;

  /* once, not watch */
  has(): Observable<boolean>;

  /* once, not watch */
  hasSome(): Observable<boolean>;
}

export function createQueryChain<Data extends BaseDBObject
  , Index extends BaseSearchObject>(hz: Horizon, tableType: TableType<Data & Index>
  , acc: Index, ...extra: Index[]): QueryChain<Data, Index> {
  const table = toCustomHorizon(hz)<Data, Index>(tableType);
  const res = {
    use: (f: (a: Index) => void) => {
      f(acc);
      return res;
    }
    , find: () => table.find(acc, ...extra)
    , findAll: () => table.findAll(acc, ...extra)
    , has: () => res.find().fetch().defaultIfEmpty().map(x => isDefined(x))
    , hasSome: () => res.findAll().fetch().map(xs => xs.length > 0)
  };
  return res;
}

export interface UpdateQueryChain<A extends BaseDBObject> {
  use(f: (a: A) => any): UpdateQueryChain<A>;

  store(): Observable<CreatedObject>;

  update(): Observable<oneOrList<A>>;
}

export function createUpdateQueryChain<A extends BaseDBObject>(hz: Horizon, tableType: TableType<A>
  , id: string
  , editorID?: string
  , editTime = Date.now()): UpdateQueryChain<A> {
  const f = tableType.toData || toData;
  const table = hz<A>(tableType.tableName);
  const x: A = {} as any;
  x.id = id;
  if (editorID) {
    x.editor_id = editorID;
  }
  x.edit_time = editTime;
  const res = {
    use: (f: (a: A) => void) => {
      f(x);
      return res;
    }
    , store: () => table.store(f(x))
    , update: () => table.update(f(x))
  };
  return res;
}

@Injectable()
export class DatabaseService {

  // private storage: LargeLocalStorage;//=new LargeLocalStorage({size:this.storageSize,name:'cacheDb'});

  constructor(private httpProgress: ProgressService
    , private horizonService: HorizonService
    , public translate: TranslateService
    , public platform: Platform) {

    if (dbCache.hz) {
      console.log("skip db init");
    } else {
      this.initialize();
    }
  }

  initialize() {
    console.log("bootstrapping horizon...");

    const initTables = async () => {
      return Promise.all([]);
    };

    const onConnected = async () => {
      await initTables();
      return "ok";
    };

    (async () => {
      const sub = this.httpProgress.downloadProgress.asObservable().subscribe((event) => {
        console.log(event.loaded, event.loaded / horizon_api_size * 100 + "%");
      });
      const url = (await DBConfig.initialize()).serverUrlBase() + "horizon/horizon.js";
      const preF = () => console.log("loading horizon...");
      await autoRetryAsync(() => this.horizonService.load_horizon(url, preF), DBConfig.network_retry_interval);
      sub.unsubscribe();

      console.log("connecting to horizon...");
      // let hz = Horizon({host: config.serverIp});
      dbCache.hz = getHorizon()();
      dbCache.hz.onReady(() => {
        console.log("horizon is ready");
        onConnected()
          .then(_ => dbCache.hzDefer.resolve(dbCache.hz))
          .then(_ => this.checkDBVersion())
          .then((xs: [SemverDiffType, Config]) => databaseService.hooks.checkClientVersion(this, xs[1]))
        ;
      });
      dbCache.hz.onSocketError(err => {
        console.log("horizon socket error", err);
      });
      dbCache.hz.connect();
    })();
  }

  logout() {
    if (typeof databaseService.hooks.logout === "function") {
      databaseService.hooks.logout();
    }
  }

  getRawHz(): Promise<Horizon> {
    return dbCache.hzDefer.promise;
  }

  observeRawHz(): Observable<Horizon> {
    return Observable.fromPromise(dbCache.hzDefer.promise);
  }

  getHz(): Promise<CustomHorizon> {
    return dbCache.hzDefer.promise
      .then(hz => toCustomHorizon(hz));
  }

  observeHz(): Observable<CustomHorizon> {
    return Observable.fromPromise(this.getHz());
  }

  // getTable<A extends BaseDBObject>(table: TableType<A>): Promise<CustomTableObject<A, any>> {
  //   return this.getHz().then(hz => hz(table));
  // }
  //
  // observeTable<A extends BaseDBObject>(table: TableType<A>): Observable<CustomTableObject<A, any>> {
  //   return Observable.fromPromise(this.getTable(table));
  // }

  clearCache() {
    dbCache = new DBCache();
  }

  /**
   * return [db_semver_diff, Config]
   * */
  async checkDBVersion(): Promise<[SemverDiffType, Config]> {
    const table = (await this.getRawHz())<Config>(Config.tableName);
    const configs = await table.order(BaseDBObject._create_time, "descending").fetch().toPromise();
    if (configs.length === 0) {
      const o = Config.init();
      o.db_version = DBConfig.db_version;
      o.id = "singleton";
      await table.store(o).toPromise();
      return [SemverDiffType.newer, o];
    }
    const remote_config = configs[0];
    if (DBConfig.db_version === remote_config.db_version) {
      return [SemverDiffType.same, remote_config];
    }

    const res = tryWithDefault<void, SemverDiffType>(
      () => getSemverDiffType(to_semver(remote_config.db_version), to_semver(DBConfig.db_version))
      , SemverDiffType.newer);
    switch (res) {
      case SemverDiffType.same:
        break;
      case SemverDiffType.newer:
        const config = Config.init();
        config.id = "singleton";
        config.db_version = DBConfig.db_version;
        await table.store(config).toPromise();
        break;
      case SemverDiffType.compatible:
        console.log("db has updated, recommend to update");
        break;
      case SemverDiffType.breaking:
        dbCache = new DBCache();
        console.log("db has updated, required to update");
        break;
    }
    return [res, remote_config];
  }

  store<A extends BaseDBObject>(table: TableType<A>, x: A) {
    return this.observeHz()
      .mergeMap(hz => hz<A, any>(table).store(x));
  }

  insert<A extends BaseDBObject>(table: TableType<A>, x: A) {
    return this.observeHz()
      .mergeMap(hz => hz<A, any>(table).insert(x));
  }

  update<A extends BaseDBObject>(table: TableType<A>, x: A) {
    return this.observeHz()
      .mergeMap(hz => hz<A, any>(table).update((table.toData || toData)(x)));
  }

  updateAll<A extends BaseDBObject>(table: TableType<A>, xs: A[]) {
    const f = table.toData || toData;
    return this.observeHz()
      .mergeMap(hz => hz<A, any>(table).update(xs.map(x => f(x))));
  }

  find<Data extends BaseDBObject
    , Index extends BaseSearchObject>(table: TableType<Data & Index>, xs: Index[]): Observable<FindQuery<Data>> {
    if (xs.length == 0) {
      return Observable.empty();
    }
    const f = table.toData || toData;
    const y = f(xs.pop() as Index as any as Data);
    const ys = xs.map(x => f(x as Index as any as Data));
    return this.observeRawHz()
      .map(hz => hz<Data>(table.tableName).find(y, ...ys));
  }

  findAll<Data extends BaseDBObject
    , Index extends BaseSearchObject>(table: TableType<Data & Index>, xs: Index[]): Observable<TableQuery<Data>> {
    if (xs.length == 0) {
      return Observable.empty();
    }
    const f = table.toData || toData;
    const y = f(xs.pop() as Index as any as Data);
    const ys = xs.map(x => f(x as Index as any as Data));
    return this.observeRawHz()
      .map(hz => hz<Data>(table.tableName).findAll(y, ...ys));
  }

  async findByID<A extends BaseDBObject>(table: TableType<A>, id: string): Promise<A | null> {
    return (await this.getRawHz())<A>(table.tableName).find(id).fetch().defaultIfEmpty().toPromise();
  }

  watchByID<A extends BaseDBObject>(table: TableType<A>, id: string) {
    return this.observeRawHz()
      .mergeMap(hz => hz<A>(table.tableName).find(id).watch());
  }

  createUpdate<A extends BaseDBObject>(table: TableType<A>, id: string, editorID: string) {
    return this.observeRawHz()
      .map(hz => createUpdateQueryChain(hz, table, id, editorID));
  }

  query<Data extends BaseDBObject, Index extends BaseSearchObject>(table: TableType<Data & Index>, query: Index, ...extra: Index[]) {
    return this.observeRawHz()
      .map(hz => createQueryChain<Data, Index>(hz, table, query, ...extra));
  }
}
