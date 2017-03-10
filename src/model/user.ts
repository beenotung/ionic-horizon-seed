import {OldRecord, NewRecord} from "../../lib/typeStub-horizon-client/index";
export class User implements OldRecord {
  static tableName = 'users';
  id: string;
  [key: string]: string | Array<NewRecord> | number | boolean | NewRecord;

  username: string;
  lag: number;
  lng: number;
  // holdingCurrency: string;
  // desiredCurrency: string;
  holdingCurrencyCode: string;
  desiredCurrencyCode: string;
  amount: number;
}
