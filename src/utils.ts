import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/observable/fromPromise";
import {clear} from "@beenotung/tslib/array";
import {DatabaseService} from "./services/database/database.service";
import {UserSessionService} from "./services/user-session/user-session.service";
import {Horizon} from "typestub-horizon-client";

export function subToList<A>(sub: Observable<A>, list: A[], replace = true): Subscription {
  /* TODO [later] change subscribe function to this (need mapping) */
  let first = replace;
  return sub.subscribe(
    x => {
      if (first) {
        clear(list);
        first = false;
      }
      list.push(x);
    }
    , err => {
      /* TODO [later][ui] use toast to display error */
      console.error(err);
    });
}

// export interface DBAuthPair{
//   hz:CustomHorizon;
//   user_id:string;
// }
/** type [Horizon, user_id] */
export type DBAuthPair = [Horizon, string];

export function subDBAuthPair(db: DatabaseService, userSession: UserSessionService): Observable<DBAuthPair> {
  return Observable.fromPromise(Promise.all([db.getRawHz(), userSession.getUserID()]));
}
