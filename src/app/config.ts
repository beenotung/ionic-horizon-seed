import {createAsyncLazy} from "../../lib/tslib/src/lazy";
import {createDefer} from "../../lib/tslib/src/async";
import {externalAPI} from "../../lib/tslib/src/externAPI";
import {bindFunction} from "../../lib/tslib/src/lang";
import {setProp} from "../../lib/tslib/src/functional";

export namespace config {
  const version = "0.1.1";
  export const fallbackLang = 'en';
  export let typingSpeed = 1000 / 30;

  const server_name = "STUB";
  class Delayed {
    serverIp: string;
    serverPort: number;
    serverHost = () => `${this.serverIp}:${this.serverPort}`;
    serverUrlBase = () => `http://${this.serverIp}:${this.serverPort}/`;
  }
  let delayed = new Delayed();

  /**@remark must be called before loading horizon */
  export const initialize = createAsyncLazy<Delayed>(async () => {
    /* check local storage version */
    if (localStorage['version'] != version) {
      console.log('Incompatible update: reset localStorage');
      localStorage.clear();
    }
    localStorage['version'] = version;

    // console.log('config initializing...');
    let defer = createDefer<Delayed, any>();

    if (server_name != "STUB") {
      let host = await externalAPI.getHostByName(server_name);
      // console.debug('host', host);
      delayed.serverIp = host.ip;
      delayed.serverPort = host.port;
    } else {
      delayed.serverIp = 'localhost';
      delayed.serverPort = 8181;
    }


    let RealWebSocket = WebSocket;

    function WrappedWebSocket(url: string, protocols?: string | string[]) {
      if (url.match(/\/horizon$/i)) {
        let parser = document.createElement('a');
        parser.href = url;
        parser.hostname = delayed.serverIp;
        parser.port = delayed.serverPort + '';
        url = parser.href;
      }
      if (arguments.length == 1)
        return new RealWebSocket(url);
      else
        return new RealWebSocket(url, protocols);
    }

    WrappedWebSocket.prototype = RealWebSocket.prototype;
    setProp(bindFunction(WrappedWebSocket), 'WebSocket', window);

    defer.resolve(delayed);
    return defer.promise;
  });
}


config.initialize();
