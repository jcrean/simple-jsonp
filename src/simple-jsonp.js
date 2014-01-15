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
        that = this,
        prop,
        jsonpName,
        docHead = document.getElementsByTagName('head')[0],
        jsonpSuccess,
        jsonpError,
        uninstallHandlers,
        origCallback,
        done = 0,
        jsonp = opts.jsonp || 'callback';

      if (opts.data) {
        for (prop in opts.data) {
          if (opts.data.hasOwnProperty(prop)) {
            queryParams.push(prop + '=' + encodeURIComponent(opts.data[prop]));
          }
        }
      }

      this.reqCount = this.reqCount + 1;

      if (opts.jsonpCallback) {
        jsonpName = opts.jsonpCallback;
      } else {
        jsonpName = '__jsonp_' + this.reqCount;
      }

      queryParams.unshift(jsonp + '=' + jsonpName);

      if (url.match(/\?/)) {
        url = url + '&';
      } else {
        url = url + '?';
      }

      url = url + queryParams.join('&');

      script.type = 'text/javascript';
      script.src  = url;

      origCallback = window[jsonpName];
      window[jsonpName] = function (data) {
        that.jsonpResponse = [data];
      };

      uninstallHandlers = function () {
        script.onload = script.onerror = script.onreadystatechange = null;
        that.jsonpResponse = null;
        docHead.removeChild(script);
        window[jsonpName] = origCallback;
      };

      jsonpSuccess = function (json) {
        if (!(done++)) {
          if (opts.success && typeof opts.success === 'function') {
            opts.success(that.jsonpResponse[0]);
          } else {
            console.log('no success callback defined');
          }
        }
        uninstallHandlers();
      };

      jsonpError = function (error) {
        if (!(done++)) {
          if (opts.error && typeof opts.error === 'function') {
            opts.error();
          } else {
            console.log('no error callback defined');
          }
        }
        uninstallHandlers();
      };

      script.onload = script.onerror = script.onreadystatechange = function (res) {
        if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {
          if (that.jsonpResponse) {
            console.log('jsonp request successful');
            jsonpSuccess(that.jsonpResponse);
          } else {
            console.log('jsonp failed somewheres...');
            jsonpError(res);
          }
        }
      };

      docHead.insertBefore(script, docHead.firstChild);
    }

  };
}(this));
