import {OldRecord, NewRecord, Horizon, TableObject} from "../../lib/typeStub-horizon-client/index";
import * as fetch from "isomorphic-fetch";
import {toNumber, objMap, objForEach, objValues} from "../../lib/tslib/src/lang";
import {unique} from "../../lib/tslib/src/array";
import {concat} from "../../lib/tslib/src/functional";

export class Currency implements OldRecord {
  static tableName = 'currencies';
  id: string;
  [key: string]: string|Array<NewRecord>|number|boolean|NewRecord;

  code: string;
  displayName: string;
  rateToUSD: number; // this = USD * rate
}
export namespace Currency {

  /**
   * init values for db
   *   only used to init DB
   *   should not use them directly
   * */
  namespace initValues {
    export const currencies = <Currency[]>[
      {
        code: 'USD',
        displayName: 'US Dollar',
        rateToUSD: 1,
      },
      {
        code: 'HKD',
        displayName: 'Hong Kong Dollar',
      },
      {
        code: 'EUR',
        displayName: 'European Currency',
      },
      {
        code: 'GBP',
        displayName: 'Pound sterling',
      },
      {
        code: 'EGP',
        displayName: 'Egyptian pound',
        rateToUSD: 18.8416174,
      },
      {
        code: 'LBP',
        displayName: 'Lebanese pound',
        rateToUSD: 1508.29563,
      },
      {
        code: 'SSP',
        displayName: 'South Sudanese pound',
        rateToUSD: 7127.55,
      },
      {
        code: 'SDG',
        displayName: 'Sudanese pound',
        rateToUSD: 6.60500,
      },
      {
        code: 'SYP',
        displayName: 'Syrian pound',
        rateToUSD: 214.350,
      },
      {
        code: 'RMB',
        displayName: '人民币/元/圆/圓',
        rateToUSD: 6.87649134,
      },
      {
        code: 'JPY',
        displayName: 'yen/円/圓/¥',
      },
    ];
  }
  export async function initTable(hz: Horizon): Promise<any> {
    let apiRates = await api.getRates();
    let cs: Currency[] = initValues.currencies.map(x => {
      let rate = apiRates[x.code];
      if (rate) {
        x.rateToUSD = toNumber(rate);
      }
      if (!x.rateToUSD) {
        console.warn('missing currency rate of ' + x.code);
      }
      return x;
    });
    await table(hz).store(cs).toPromise();
    return 'ok';
  }

  function table(hz: Horizon): TableObject<Currency> {
    return hz<Currency>(Currency.tableName);
  }

  export namespace api {
    /**
     * for exchange rate only
     * */
    const baseUrl = 'http://api.fixer.io/latest';
    /**
     * for exchange rate and also display name (in english)
     * */
    const baseUrl2 = 'http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html';

    interface APIResponse {
      base: string;
      date: string;
      rates: APIRates;
    }
    export interface APIRates {
      [currency: string]: number;
    }

    export async function getRates(base: string = 'USD'): Promise<APIRates> {
      let url = `${baseUrl}?base=${base}`;
      let res = await fetch(url);
      if (res.status >= 400)
        throw new Error("Bad response from external api");
      let json = <APIResponse> await res.json();
      return json.rates;
    }

    /**
     * try to get latest exchange rate
     *   success : update db
     *   failed  : get (outdated) from db
     * return the list
     *
     * assume db will never fail, otherwise throw error
     * */
    export async function loadAll(hz: Horizon): Promise<Currency[]> {
      let table = hz<Currency>(Currency.tableName);
      try {
        let apiCurrencies = await getRates();
        let dbCurrencies = (await table.fetch().toPromise());
        let resMap: { [name: string]: Currency } = {};
        dbCurrencies.forEach(x => {
          resMap[x.code] = Object.assign({}, x);
        });
        let toUpdates: Currency[] = [];
        objForEach<number>((v, k) => {
          if (resMap[k]) {
            if (resMap[k].rateToUSD !== v) {
              resMap[k].rateToUSD = v;
              toUpdates.push(<Currency>{
                id: resMap[k].id
                , rateToUSD: v
              });
            }
          } else {
            resMap[k] = <Currency>{code: k, rateToUSD: v};
            toUpdates.push(resMap[k]);
          }
        })(apiCurrencies);
        /* don't wait for update to finish */
        table.upsert(toUpdates);
        return objValues(resMap);
      } catch (e) {
        return table.fetch().toPromise();
      }
    }

    export async function getName(id: string, hz: Horizon): Promise<string> {
      let record = await hz<Currency>(Currency.tableName).find(id).fetch().toPromise();
      if (!record)
        return 'error';
      if (record.displayName)
        return record.displayName;
      else
        return record.code;
    }
  }
}
