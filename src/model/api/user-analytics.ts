import {DataType, JSONObject} from '../../../lib/typestub-horizon-client/index';
import {BaseDBObject} from './base-db-object';
import {registryTable} from '../../providers/database/tables';

export class UserAnalytics extends BaseDBObject {
  id: string;
  [key: string]: DataType;

  user_id: string;

  navigator: JSONObject;

  constructor() {
    super();
    this.navigator = Object.keys(navigator)
      .map(x => {
        if (typeof navigator[x] === 'function') {
          return [x, navigator[x]()];
        } else {
          return [x, navigator[x]];
        }
      })
      .reduce((acc, c) => acc[c[0]] = c[1], {});
  }
}

registryTable(UserAnalytics, 'UserAnalytics');