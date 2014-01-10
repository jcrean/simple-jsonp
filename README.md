simple-jsonp
============

Simple, cross browser JSONP reqeusts

Example:

```
JSONP.request({
  url: 'http://jsonp-enabled-host/api/endpoint',
  success: function (resp) {
    // do stuff with resp
  },
  error: function () {
    // uh-oh, jsonp request failed
  }
})
```
