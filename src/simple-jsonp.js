/*jslint maxerr: 50, indent: 2, nomen: true */
/*global document, window*/

(function (ctx) {
  "use strict";

  ctx.JSONP = {

    reqCount: 0,

    request: function (opts) {
      var script = document.createElement('script'),
        url = opts.url,
        queryParams = [],
        prop,
        jsonpName,
        docHead = document.getElementsByTagName('head')[0];

      if (opts.data) {
        for (prop in opts.data) {
          queryParams.push(prop + '=' + encodeURIComponent(opts.data[prop]));
        }
      }

      this.reqCount = this.reqCount + 1;

      if (opts.jsonpCallback) {
        jsonpName = opts.jsonpCallback;
      } else {
        jsonpName = '__jsonp_' + this.reqCount;
      }

      queryParams.unshift('callback=' + jsonpName);

      if (url.match(/\?/)) {
        url = url + '&';
      } else {
        url = url + '?';
      }

      url = url + queryParams.join('&');

      script.type = 'text/javascript';
      script.src  = url;

      window[jsonpName] = function (data) {
        this.jsonpResponse = [data];
      };

      script.onload = script.onerror = script.onreadystatechange = function (res) {
        console.log('script completed, got res: %o, readystate: %o', res, script.readystate);
        if (!script.readystate || script.readystate === 'loaded' || script.readystate === 'complete') {
          // trigger success/error callbacks
          if (this.jsonpResponse) {
            console.log('jsonp request successful');
            if (opts.success && typeof opts.success === 'function') {
              opts.success(this.jsonpResponse[0]);
            } else {
              console.log('no success callback defined');
            }
          } else {
            console.log('jsonp failed somewheres...');
            if (opts.error && typeof opts.error === 'function') {
              opts.error();
            } else {
              console.log('no success callback defined');
            }
          }
        }
      };

      docHead.insertBefore(script, docHead.firstChild);
    }

  };
}(this));
