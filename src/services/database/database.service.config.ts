import {createAsyncLazy} from "@beenotung/tslib/lazy";
import {createDefer} from "@beenotung/tslib/async";
import {setProp} from "@beenotung/tslib/functional";
import {bindFunction} from "@beenotung/tslib/lang";
import {externalAPI} from "@beenotung/tslib/externAPI";
import {config} from "../../app/app.config";

export namespace DBConfig {
  export const db_version = "0.4.0";
  export let network_retry_interval = config.network_retry_interval;

  export const mode: "dev" | "test" | "prod" = "dev";
  // export const mode: 'dev' | 'test' | 'prod' = 'test';

  const app_name = "peer-coin-exchange";
  const server_name = mode as any === "dev" && location.host == "localhost:8100" ? "STUB" : app_name;

  export class Delayed {
    serverIp: string;
    serverPort: number;
    serverHost = () => `${this.serverIp}:${this.serverPort}`;
    serverUrlBase = () => `http://${this.serverHost()}/`;
  }

  const delayed = new Delayed();

  /**@remark must be called before loading horizon */
  export const initialize = createAsyncLazy<Delayed>(async () => {
    const defer = createDefer<Delayed, any>();

    /* redirect horizon websocket */
    const RealWebSocket = WebSocket;

    function WrappedWebSocket(url: string, protocols?: string | string[]) {
      if (url.match(/\/horizon$/i)) {
        const parser = document.createElement("a");
        parser.href = url;
        parser.hostname = delayed.serverIp;
        parser.port = delayed.serverPort + "";
        url = parser.href;
      }
      if (arguments.length == 1) {
        return new RealWebSocket(url);
      } else {
        return new RealWebSocket(url, protocols);
      }
    }

    /* tslint:disable:no-invalid-this */
    const realSend = RealWebSocket.prototype.send;
    RealWebSocket.prototype.send = function () {
      // console.debug("[ws] send:", arguments);
      realSend.apply(this, arguments);
    };
    /* tslint:enable:no-invalid-this */

    WrappedWebSocket.prototype = RealWebSocket.prototype;

    setProp(bindFunction(WrappedWebSocket), "WebSocket", window);

    /* resolve backend url */
    if (server_name == "STUB" || location.hostname == "localhost") {
      delayed.serverIp = location.hostname;
      delayed.serverPort = 8181;
    } else {
      /* it wont work without CORS ... */
      try {
        const host = await externalAPI.getHostByName(server_name);
        delayed.serverIp = host.ip;
        delayed.serverPort = host.port;
      } catch (e) {
        delayed.serverIp = location.hostname;
        delayed.serverPort = +location.port;
      }
    }

    defer.resolve(delayed);
    return defer.promise;
  });
}
