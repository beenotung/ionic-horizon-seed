import {BaseDBObject} from "../base/base-db-object";
import {registryTable} from "../tables";

export declare class Config implements BaseDBObject {
}

export interface Config extends BaseDBObject {
  /* common backend */
  db_version: string;

  /* for client app */
  client_version: string;

  /* for admin panel */
  admin_version: string;

  /* for SMS hub */
  sms_version: string;
}

export namespace Config {
  export const tableName = "Config";

  export function init(): Config {
    const res = BaseDBObject.init() as Config;
    res.db_version
      = res.client_version
      = res.admin_version
      = res.sms_version
      = "0.0.0";
    return res;
  }
}

// registryTable(Config, "Config");
registryTable(Config);
