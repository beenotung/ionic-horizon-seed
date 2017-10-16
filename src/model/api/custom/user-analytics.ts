import {BaseDBObject} from "../base/base-db-object";
import {registryTable} from "../tables";
import {JSONObject} from "typestub-horizon-client";
import {isHorizonDataType} from "@beenotung/tslib/horizon";
import {Obj} from "@beenotung/tslib";

export declare class UserAnalytics {
  constructor(never: never)
}

export interface UserAnalytics extends BaseDBObject {

  user_id?: string;

  navigator: JSONObject;
  device_id: string;

}

export namespace UserAnalytics {
  export const tableName = "UserAnalytics";

  export function init(deviceID: string): UserAnalytics {
    const userAnalytics = BaseDBObject.init() as UserAnalytics;
    userAnalytics.device_id = deviceID;
    const acc: Obj<any> = userAnalytics.navigator = {};
    Object.keys(navigator.constructor.prototype)
      .forEach(x => {
        if (x.startsWith("requestMediaKeySystemAccess")
          || x.startsWith("send")
          || x.startsWith("get")
          || x.startsWith("register")
          || x.startsWith("unregister")) {
          return;
        }
        const f_o = (navigator as any)[x];
        if (typeof f_o === "function") {
          switch (x) {
            case "webkitGetUserMedia":
            case "vibrate":
              return;
          }
          try {
            acc[x] = f_o();
          } catch (e) {
            console.error("failed when mapping navigator field:", x, e);
            debugger;
          }
        } else {
          if (isHorizonDataType(f_o)) {
            acc[x] = f_o;
          } else {
            console.warn("skip navigator field:", x);
          }
        }
      });
    return userAnalytics;
  }
}
registryTable(UserAnalytics);
