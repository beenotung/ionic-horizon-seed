import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/observable/fromPromise";
import {LoadingController} from "ionic-angular";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoadingService {

  constructor(private loadingCtl: LoadingController) {
    console.log("Hello LoadingService Provider");
  }

  make<A>() {
    return {
      start: async (f: (() => A) | Promise<A> | Observable<A>) => {
        const loading = this.loadingCtl.create();
        await loading.present();
        let res: any;
        if (typeof f === "function") {
          try {
            res = f();
          } catch (e) {
          }
        } else {
          res = f;
        }
        return Observable.fromPromise(Promise.resolve(res || "ok")).toPromise()
          .then(_ => loading.dismiss());
      }
    };
  }
}
