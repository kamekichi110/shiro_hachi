/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/node_modules/whatwg-fetch/fetch.js":
/*!**********************************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/node_modules/whatwg-fetch/fetch.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMException: function() { return /* binding */ DOMException; },
/* harmony export */   Headers: function() { return /* binding */ Headers; },
/* harmony export */   Request: function() { return /* binding */ Request; },
/* harmony export */   Response: function() { return /* binding */ Response; },
/* harmony export */   fetch: function() { return /* binding */ fetch; }
/* harmony export */ });
var global =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global)

var support = {
  searchParams: 'URLSearchParams' in global,
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this)
        if (isConsumed) {
          return isConsumed
        }
        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = global.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer &&
        request.headers.get('Content-Type') &&
        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!global.fetch) {
  global.fetch = fetch
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
}


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/cubismdefaultparameterid.ts":
/*!*****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/cubismdefaultparameterid.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismDefaultParameterId = void 0;
/**
 * @brief パラメータIDのデフォルト値を保持する定数<br>
 *         デフォルト値の仕様は以下のマニュアルに基づく<br>
 *         https://docs.live2d.com/cubism-editor-manual/standard-parametor-list/
 */
exports.CubismDefaultParameterId = Object.freeze({
    // パーツID
    HitAreaPrefix: 'HitArea',
    HitAreaHead: 'Head',
    HitAreaBody: 'Body',
    PartsIdCore: 'Parts01Core',
    PartsArmPrefix: 'Parts01Arm_',
    PartsArmLPrefix: 'Parts01ArmL_',
    PartsArmRPrefix: 'Parts01ArmR_',
    // パラメータID
    ParamAngleX: 'ParamAngleX',
    ParamAngleY: 'ParamAngleY',
    ParamAngleZ: 'ParamAngleZ',
    ParamEyeLOpen: 'ParamEyeLOpen',
    ParamEyeLSmile: 'ParamEyeLSmile',
    ParamEyeROpen: 'ParamEyeROpen',
    ParamEyeRSmile: 'ParamEyeRSmile',
    ParamEyeBallX: 'ParamEyeBallX',
    ParamEyeBallY: 'ParamEyeBallY',
    ParamEyeBallForm: 'ParamEyeBallForm',
    ParamBrowLY: 'ParamBrowLY',
    ParamBrowRY: 'ParamBrowRY',
    ParamBrowLX: 'ParamBrowLX',
    ParamBrowRX: 'ParamBrowRX',
    ParamBrowLAngle: 'ParamBrowLAngle',
    ParamBrowRAngle: 'ParamBrowRAngle',
    ParamBrowLForm: 'ParamBrowLForm',
    ParamBrowRForm: 'ParamBrowRForm',
    ParamMouthForm: 'ParamMouthForm',
    ParamMouthOpenY: 'ParamMouthOpenY',
    ParamCheek: 'ParamCheek',
    ParamBodyAngleX: 'ParamBodyAngleX',
    ParamBodyAngleY: 'ParamBodyAngleY',
    ParamBodyAngleZ: 'ParamBodyAngleZ',
    ParamBreath: 'ParamBreath',
    ParamArmLA: 'ParamArmLA',
    ParamArmRA: 'ParamArmRA',
    ParamArmLB: 'ParamArmLB',
    ParamArmRB: 'ParamArmRB',
    ParamHandL: 'ParamHandL',
    ParamHandR: 'ParamHandR',
    ParamHairFront: 'ParamHairFront',
    ParamHairSide: 'ParamHairSide',
    ParamHairBack: 'ParamHairBack',
    ParamHairFluffy: 'ParamHairFluffy',
    ParamShoulderY: 'ParamShoulderY',
    ParamBustX: 'ParamBustX',
    ParamBustY: 'ParamBustY',
    ParamBaseX: 'ParamBaseX',
    ParamBaseY: 'ParamBaseY',
    ParamNONE: 'NONE:',
});
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismdefaultparameterid */ "../../../../CubismSdkForWeb/Framework/src/cubismdefaultparameterid.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.HitAreaBody = $.CubismDefaultParameterId.HitAreaBody;
    Live2DCubismFramework.HitAreaHead = $.CubismDefaultParameterId.HitAreaHead;
    Live2DCubismFramework.HitAreaPrefix = $.CubismDefaultParameterId.HitAreaPrefix;
    Live2DCubismFramework.ParamAngleX = $.CubismDefaultParameterId.ParamAngleX;
    Live2DCubismFramework.ParamAngleY = $.CubismDefaultParameterId.ParamAngleY;
    Live2DCubismFramework.ParamAngleZ = $.CubismDefaultParameterId.ParamAngleZ;
    Live2DCubismFramework.ParamArmLA = $.CubismDefaultParameterId.ParamArmLA;
    Live2DCubismFramework.ParamArmLB = $.CubismDefaultParameterId.ParamArmLB;
    Live2DCubismFramework.ParamArmRA = $.CubismDefaultParameterId.ParamArmRA;
    Live2DCubismFramework.ParamArmRB = $.CubismDefaultParameterId.ParamArmRB;
    Live2DCubismFramework.ParamBaseX = $.CubismDefaultParameterId.ParamBaseX;
    Live2DCubismFramework.ParamBaseY = $.CubismDefaultParameterId.ParamBaseY;
    Live2DCubismFramework.ParamBodyAngleX = $.CubismDefaultParameterId.ParamBodyAngleX;
    Live2DCubismFramework.ParamBodyAngleY = $.CubismDefaultParameterId.ParamBodyAngleY;
    Live2DCubismFramework.ParamBodyAngleZ = $.CubismDefaultParameterId.ParamBodyAngleZ;
    Live2DCubismFramework.ParamBreath = $.CubismDefaultParameterId.ParamBreath;
    Live2DCubismFramework.ParamBrowLAngle = $.CubismDefaultParameterId.ParamBrowLAngle;
    Live2DCubismFramework.ParamBrowLForm = $.CubismDefaultParameterId.ParamBrowLForm;
    Live2DCubismFramework.ParamBrowLX = $.CubismDefaultParameterId.ParamBrowLX;
    Live2DCubismFramework.ParamBrowLY = $.CubismDefaultParameterId.ParamBrowLY;
    Live2DCubismFramework.ParamBrowRAngle = $.CubismDefaultParameterId.ParamBrowRAngle;
    Live2DCubismFramework.ParamBrowRForm = $.CubismDefaultParameterId.ParamBrowRForm;
    Live2DCubismFramework.ParamBrowRX = $.CubismDefaultParameterId.ParamBrowRX;
    Live2DCubismFramework.ParamBrowRY = $.CubismDefaultParameterId.ParamBrowRY;
    Live2DCubismFramework.ParamBustX = $.CubismDefaultParameterId.ParamBustX;
    Live2DCubismFramework.ParamBustY = $.CubismDefaultParameterId.ParamBustY;
    Live2DCubismFramework.ParamCheek = $.CubismDefaultParameterId.ParamCheek;
    Live2DCubismFramework.ParamEyeBallForm = $.CubismDefaultParameterId.ParamEyeBallForm;
    Live2DCubismFramework.ParamEyeBallX = $.CubismDefaultParameterId.ParamEyeBallX;
    Live2DCubismFramework.ParamEyeBallY = $.CubismDefaultParameterId.ParamEyeBallY;
    Live2DCubismFramework.ParamEyeLOpen = $.CubismDefaultParameterId.ParamEyeLOpen;
    Live2DCubismFramework.ParamEyeLSmile = $.CubismDefaultParameterId.ParamEyeLSmile;
    Live2DCubismFramework.ParamEyeROpen = $.CubismDefaultParameterId.ParamEyeROpen;
    Live2DCubismFramework.ParamEyeRSmile = $.CubismDefaultParameterId.ParamEyeRSmile;
    Live2DCubismFramework.ParamHairBack = $.CubismDefaultParameterId.ParamHairBack;
    Live2DCubismFramework.ParamHairFluffy = $.CubismDefaultParameterId.ParamHairFluffy;
    Live2DCubismFramework.ParamHairFront = $.CubismDefaultParameterId.ParamHairFront;
    Live2DCubismFramework.ParamHairSide = $.CubismDefaultParameterId.ParamHairSide;
    Live2DCubismFramework.ParamHandL = $.CubismDefaultParameterId.ParamHandL;
    Live2DCubismFramework.ParamHandR = $.CubismDefaultParameterId.ParamHandR;
    Live2DCubismFramework.ParamMouthForm = $.CubismDefaultParameterId.ParamMouthForm;
    Live2DCubismFramework.ParamMouthOpenY = $.CubismDefaultParameterId.ParamMouthOpenY;
    Live2DCubismFramework.ParamNONE = $.CubismDefaultParameterId.ParamNONE;
    Live2DCubismFramework.ParamShoulderY = $.CubismDefaultParameterId.ParamShoulderY;
    Live2DCubismFramework.PartsArmLPrefix = $.CubismDefaultParameterId.PartsArmLPrefix;
    Live2DCubismFramework.PartsArmPrefix = $.CubismDefaultParameterId.PartsArmPrefix;
    Live2DCubismFramework.PartsArmRPrefix = $.CubismDefaultParameterId.PartsArmRPrefix;
    Live2DCubismFramework.PartsIdCore = $.CubismDefaultParameterId.PartsIdCore;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/cubismframeworkconfig.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/cubismframeworkconfig.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CSM_LOG_LEVEL = exports.CSM_LOG_LEVEL_OFF = exports.CSM_LOG_LEVEL_ERROR = exports.CSM_LOG_LEVEL_WARNING = exports.CSM_LOG_LEVEL_INFO = exports.CSM_LOG_LEVEL_DEBUG = exports.CSM_LOG_LEVEL_VERBOSE = void 0;
//========================================================
//  ログ出力関数の設定
//========================================================
//---------- ログ出力レベル 選択項目 定義 ----------
// 詳細ログ出力設定
exports.CSM_LOG_LEVEL_VERBOSE = 0;
// デバッグログ出力設定
exports.CSM_LOG_LEVEL_DEBUG = 1;
// Infoログ出力設定
exports.CSM_LOG_LEVEL_INFO = 2;
// 警告ログ出力設定
exports.CSM_LOG_LEVEL_WARNING = 3;
// エラーログ出力設定
exports.CSM_LOG_LEVEL_ERROR = 4;
// ログ出力オフ設定
exports.CSM_LOG_LEVEL_OFF = 5;
/**
 * ログ出力レベル設定。
 *
 * 強制的にログ出力レベルを変える時に定義を有効にする。
 * CSM_LOG_LEVEL_VERBOSE ～ CSM_LOG_LEVEL_OFF を選択する。
 */
exports.CSM_LOG_LEVEL = exports.CSM_LOG_LEVEL_VERBOSE;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/cubismmodelsettingjson.ts":
/*!***************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/cubismmodelsettingjson.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismModelSettingJson = void 0;
var icubismmodelsetting_1 = __webpack_require__(/*! ./icubismmodelsetting */ "../../../../CubismSdkForWeb/Framework/src/icubismmodelsetting.ts");
var live2dcubismframework_1 = __webpack_require__(/*! ./live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmvector_1 = __webpack_require__(/*! ./type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismjson_1 = __webpack_require__(/*! ./utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
/**
 * Model3Jsonのキー文字列
 */
// JSON Keys
var Version = 'Version';
var FileReferences = 'FileReferences';
var Groups = 'Groups';
var Layout = 'Layout';
var HitAreas = 'HitAreas';
var Moc = 'Moc';
var Textures = 'Textures';
var Physics = 'Physics';
var Pose = 'Pose';
var Expressions = 'Expressions';
var Motions = 'Motions';
var UserData = 'UserData';
var Name = 'Name';
var FilePath = 'File';
var Id = 'Id';
var Ids = 'Ids';
var Target = 'Target';
// Motions
var Idle = 'Idle';
var TapBody = 'TapBody';
var PinchIn = 'PinchIn';
var PinchOut = 'PinchOut';
var Shake = 'Shake';
var FlickHead = 'FlickHead';
var Parameter = 'Parameter';
var SoundPath = 'Sound';
var FadeInTime = 'FadeInTime';
var FadeOutTime = 'FadeOutTime';
// Layout
var CenterX = 'CenterX';
var CenterY = 'CenterY';
var X = 'X';
var Y = 'Y';
var Width = 'Width';
var Height = 'Height';
var LipSync = 'LipSync';
var EyeBlink = 'EyeBlink';
var InitParameter = 'init_param';
var InitPartsVisible = 'init_parts_visible';
var Val = 'val';
var FrequestNode;
(function (FrequestNode) {
    FrequestNode[FrequestNode["FrequestNode_Groups"] = 0] = "FrequestNode_Groups";
    FrequestNode[FrequestNode["FrequestNode_Moc"] = 1] = "FrequestNode_Moc";
    FrequestNode[FrequestNode["FrequestNode_Motions"] = 2] = "FrequestNode_Motions";
    FrequestNode[FrequestNode["FrequestNode_Expressions"] = 3] = "FrequestNode_Expressions";
    FrequestNode[FrequestNode["FrequestNode_Textures"] = 4] = "FrequestNode_Textures";
    FrequestNode[FrequestNode["FrequestNode_Physics"] = 5] = "FrequestNode_Physics";
    FrequestNode[FrequestNode["FrequestNode_Pose"] = 6] = "FrequestNode_Pose";
    FrequestNode[FrequestNode["FrequestNode_HitAreas"] = 7] = "FrequestNode_HitAreas";
})(FrequestNode || (FrequestNode = {}));
/**
 * Model3Jsonパーサー
 *
 * model3.jsonファイルをパースして値を取得する
 */
var CubismModelSettingJson = /** @class */ (function (_super) {
    __extends(CubismModelSettingJson, _super);
    /**
     * 引数付きコンストラクタ
     *
     * @param buffer    Model3Jsonをバイト配列として読み込んだデータバッファ
     * @param size      Model3Jsonのデータサイズ
     */
    function CubismModelSettingJson(buffer, size) {
        var _this = _super.call(this) || this;
        _this._json = cubismjson_1.CubismJson.create(buffer, size);
        if (_this._json) {
            _this._jsonValue = new csmvector_1.csmVector();
            // 順番はenum FrequestNodeと一致させる
            _this._jsonValue.pushBack(_this._json.getRoot().getValueByString(Groups));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Moc));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Motions));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Expressions));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Textures));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Physics));
            _this._jsonValue.pushBack(_this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(Pose));
            _this._jsonValue.pushBack(_this._json.getRoot().getValueByString(HitAreas));
        }
        return _this;
    }
    /**
     * デストラクタ相当の処理
     */
    CubismModelSettingJson.prototype.release = function () {
        cubismjson_1.CubismJson.delete(this._json);
        this._jsonValue = null;
    };
    /**
     * CubismJsonオブジェクトを取得する
     *
     * @return CubismJson
     */
    CubismModelSettingJson.prototype.GetJson = function () {
        return this._json;
    };
    /**
     * Mocファイルの名前を取得する
     * @return Mocファイルの名前
     */
    CubismModelSettingJson.prototype.getModelFileName = function () {
        if (!this.isExistModelFile()) {
            return '';
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_Moc).getRawString();
    };
    /**
     * モデルが使用するテクスチャの数を取得する
     * テクスチャの数
     */
    CubismModelSettingJson.prototype.getTextureCount = function () {
        if (!this.isExistTextureFiles()) {
            return 0;
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_Textures).getSize();
    };
    /**
     * テクスチャが配置されたディレクトリの名前を取得する
     * @return テクスチャが配置されたディレクトリの名前
     */
    CubismModelSettingJson.prototype.getTextureDirectory = function () {
        var texturePath = this._jsonValue
            .at(FrequestNode.FrequestNode_Textures)
            .getValueByIndex(0)
            .getRawString();
        var pathArray = texturePath.split('/');
        // 最後の要素はテクスチャ名なので不要
        var arrayLength = pathArray.length - 1;
        var textureDirectoryStr = '';
        // 分割したパスを結合
        for (var i = 0; i < arrayLength; i++) {
            textureDirectoryStr += pathArray[i];
            if (i < arrayLength - 1) {
                textureDirectoryStr += '/';
            }
        }
        return textureDirectoryStr;
    };
    /**
     * モデルが使用するテクスチャの名前を取得する
     * @param index 配列のインデックス値
     * @return テクスチャの名前
     */
    CubismModelSettingJson.prototype.getTextureFileName = function (index) {
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Textures)
            .getValueByIndex(index)
            .getRawString();
    };
    /**
     * モデルに設定された当たり判定の数を取得する
     * @return モデルに設定された当たり判定の数
     */
    CubismModelSettingJson.prototype.getHitAreasCount = function () {
        if (!this.isExistHitAreas()) {
            return 0;
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_HitAreas).getSize();
    };
    /**
     * 当たり判定に設定されたIDを取得する
     *
     * @param index 配列のindex
     * @return 当たり判定に設定されたID
     */
    CubismModelSettingJson.prototype.getHitAreaId = function (index) {
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(this._jsonValue
            .at(FrequestNode.FrequestNode_HitAreas)
            .getValueByIndex(index)
            .getValueByString(Id)
            .getRawString());
    };
    /**
     * 当たり判定に設定された名前を取得する
     * @param index 配列のインデックス値
     * @return 当たり判定に設定された名前
     */
    CubismModelSettingJson.prototype.getHitAreaName = function (index) {
        return this._jsonValue
            .at(FrequestNode.FrequestNode_HitAreas)
            .getValueByIndex(index)
            .getValueByString(Name)
            .getRawString();
    };
    /**
     * 物理演算設定ファイルの名前を取得する
     * @return 物理演算設定ファイルの名前
     */
    CubismModelSettingJson.prototype.getPhysicsFileName = function () {
        if (!this.isExistPhysicsFile()) {
            return '';
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_Physics).getRawString();
    };
    /**
     * パーツ切り替え設定ファイルの名前を取得する
     * @return パーツ切り替え設定ファイルの名前
     */
    CubismModelSettingJson.prototype.getPoseFileName = function () {
        if (!this.isExistPoseFile()) {
            return '';
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_Pose).getRawString();
    };
    /**
     * 表情設定ファイルの数を取得する
     * @return 表情設定ファイルの数
     */
    CubismModelSettingJson.prototype.getExpressionCount = function () {
        if (!this.isExistExpressionFile()) {
            return 0;
        }
        return this._jsonValue.at(FrequestNode.FrequestNode_Expressions).getSize();
    };
    /**
     * 表情設定ファイルを識別する名前（別名）を取得する
     * @param index 配列のインデックス値
     * @return 表情の名前
     */
    CubismModelSettingJson.prototype.getExpressionName = function (index) {
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Expressions)
            .getValueByIndex(index)
            .getValueByString(Name)
            .getRawString();
    };
    /**
     * 表情設定ファイルの名前を取得する
     * @param index 配列のインデックス値
     * @return 表情設定ファイルの名前
     */
    CubismModelSettingJson.prototype.getExpressionFileName = function (index) {
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Expressions)
            .getValueByIndex(index)
            .getValueByString(FilePath)
            .getRawString();
    };
    /**
     * モーショングループの数を取得する
     * @return モーショングループの数
     */
    CubismModelSettingJson.prototype.getMotionGroupCount = function () {
        if (!this.isExistMotionGroups()) {
            return 0;
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getKeys()
            .getSize();
    };
    /**
     * モーショングループの名前を取得する
     * @param index 配列のインデックス値
     * @return モーショングループの名前
     */
    CubismModelSettingJson.prototype.getMotionGroupName = function (index) {
        if (!this.isExistMotionGroups()) {
            return null;
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getKeys()
            .at(index);
    };
    /**
     * モーショングループに含まれるモーションの数を取得する
     * @param groupName モーショングループの名前
     * @return モーショングループの数
     */
    CubismModelSettingJson.prototype.getMotionCount = function (groupName) {
        if (!this.isExistMotionGroupName(groupName)) {
            return 0;
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getSize();
    };
    /**
     * グループ名とインデックス値からモーションファイル名を取得する
     * @param groupName モーショングループの名前
     * @param index     配列のインデックス値
     * @return モーションファイルの名前
     */
    CubismModelSettingJson.prototype.getMotionFileName = function (groupName, index) {
        if (!this.isExistMotionGroupName(groupName)) {
            return '';
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(FilePath)
            .getRawString();
    };
    /**
     * モーションに対応するサウンドファイルの名前を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return サウンドファイルの名前
     */
    CubismModelSettingJson.prototype.getMotionSoundFileName = function (groupName, index) {
        if (!this.isExistMotionSoundFile(groupName, index)) {
            return '';
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(SoundPath)
            .getRawString();
    };
    /**
     * モーション開始時のフェードイン処理時間を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return フェードイン処理時間[秒]
     */
    CubismModelSettingJson.prototype.getMotionFadeInTimeValue = function (groupName, index) {
        if (!this.isExistMotionFadeIn(groupName, index)) {
            return -1.0;
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(FadeInTime)
            .toFloat();
    };
    /**
     * モーション終了時のフェードアウト処理時間を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return フェードアウト処理時間[秒]
     */
    CubismModelSettingJson.prototype.getMotionFadeOutTimeValue = function (groupName, index) {
        if (!this.isExistMotionFadeOut(groupName, index)) {
            return -1.0;
        }
        return this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(FadeOutTime)
            .toFloat();
    };
    /**
     * ユーザーデータのファイル名を取得する
     * @return ユーザーデータのファイル名
     */
    CubismModelSettingJson.prototype.getUserDataFile = function () {
        if (!this.isExistUserDataFile()) {
            return '';
        }
        return this._json
            .getRoot()
            .getValueByString(FileReferences)
            .getValueByString(UserData)
            .getRawString();
    };
    /**
     * レイアウト情報を取得する
     * @param outLayoutMap csmMapクラスのインスタンス
     * @return true レイアウト情報が存在する
     * @return false レイアウト情報が存在しない
     */
    CubismModelSettingJson.prototype.getLayoutMap = function (outLayoutMap) {
        // 存在しない要素にアクセスするとエラーになるためValueがnullの場合はnullを代入する
        var map = this._json
            .getRoot()
            .getValueByString(Layout)
            .getMap();
        if (map == null) {
            return false;
        }
        var ret = false;
        for (var ite = map.begin(); ite.notEqual(map.end()); ite.preIncrement()) {
            outLayoutMap.setValue(ite.ptr().first, ite.ptr().second.toFloat());
            ret = true;
        }
        return ret;
    };
    /**
     * 目パチに関連付けられたパラメータの数を取得する
     * @return 目パチに関連付けられたパラメータの数
     */
    CubismModelSettingJson.prototype.getEyeBlinkParameterCount = function () {
        if (!this.isExistEyeBlinkParameters()) {
            return 0;
        }
        var num = 0;
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
            var refI = this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i);
            if (refI.isNull() || refI.isError()) {
                continue;
            }
            if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                num = refI.getValueByString(Ids).getVector().getSize();
                break;
            }
        }
        return num;
    };
    /**
     * 目パチに関連付けられたパラメータのIDを取得する
     * @param index 配列のインデックス値
     * @return パラメータID
     */
    CubismModelSettingJson.prototype.getEyeBlinkParameterId = function (index) {
        if (!this.isExistEyeBlinkParameters()) {
            return null;
        }
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
            var refI = this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i);
            if (refI.isNull() || refI.isError()) {
                continue;
            }
            if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                return live2dcubismframework_1.CubismFramework.getIdManager().getId(refI.getValueByString(Ids).getValueByIndex(index).getRawString());
            }
        }
        return null;
    };
    /**
     * リップシンクに関連付けられたパラメータの数を取得する
     * @return リップシンクに関連付けられたパラメータの数
     */
    CubismModelSettingJson.prototype.getLipSyncParameterCount = function () {
        if (!this.isExistLipSyncParameters()) {
            return 0;
        }
        var num = 0;
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
            var refI = this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i);
            if (refI.isNull() || refI.isError()) {
                continue;
            }
            if (refI.getValueByString(Name).getRawString() == LipSync) {
                num = refI.getValueByString(Ids).getVector().getSize();
                break;
            }
        }
        return num;
    };
    /**
     * リップシンクに関連付けられたパラメータの数を取得する
     * @param index 配列のインデックス値
     * @return パラメータID
     */
    CubismModelSettingJson.prototype.getLipSyncParameterId = function (index) {
        if (!this.isExistLipSyncParameters()) {
            return null;
        }
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
            var refI = this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i);
            if (refI.isNull() || refI.isError()) {
                continue;
            }
            if (refI.getValueByString(Name).getRawString() == LipSync) {
                return live2dcubismframework_1.CubismFramework.getIdManager().getId(refI.getValueByString(Ids).getValueByIndex(index).getRawString());
            }
        }
        return null;
    };
    /**
     * モデルファイルのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistModelFile = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Moc);
        return !node.isNull() && !node.isError();
    };
    /**
     * テクスチャファイルのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistTextureFiles = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Textures);
        return !node.isNull() && !node.isError();
    };
    /**
     * 当たり判定のキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistHitAreas = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_HitAreas);
        return !node.isNull() && !node.isError();
    };
    /**
     * 物理演算ファイルのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistPhysicsFile = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Physics);
        return !node.isNull() && !node.isError();
    };
    /**
     * ポーズ設定ファイルのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistPoseFile = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Pose);
        return !node.isNull() && !node.isError();
    };
    /**
     * 表情設定ファイルのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistExpressionFile = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Expressions);
        return !node.isNull() && !node.isError();
    };
    /**
     * モーショングループのキーが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistMotionGroups = function () {
        var node = this._jsonValue.at(FrequestNode.FrequestNode_Motions);
        return !node.isNull() && !node.isError();
    };
    /**
     * 引数で指定したモーショングループのキーが存在するかどうかを確認する
     * @param groupName  グループ名
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistMotionGroupName = function (groupName) {
        var node = this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName);
        return !node.isNull() && !node.isError();
    };
    /**
     * 引数で指定したモーションに対応するサウンドファイルのキーが存在するかどうかを確認する
     * @param groupName  グループ名
     * @param index 配列のインデックス値
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistMotionSoundFile = function (groupName, index) {
        var node = this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(SoundPath);
        return !node.isNull() && !node.isError();
    };
    /**
     * 引数で指定したモーションに対応するフェードイン時間のキーが存在するかどうかを確認する
     * @param groupName  グループ名
     * @param index 配列のインデックス値
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistMotionFadeIn = function (groupName, index) {
        var node = this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(FadeInTime);
        return !node.isNull() && !node.isError();
    };
    /**
     * 引数で指定したモーションに対応するフェードアウト時間のキーが存在するかどうかを確認する
     * @param groupName  グループ名
     * @param index 配列のインデックス値
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistMotionFadeOut = function (groupName, index) {
        var node = this._jsonValue
            .at(FrequestNode.FrequestNode_Motions)
            .getValueByString(groupName)
            .getValueByIndex(index)
            .getValueByString(FadeOutTime);
        return !node.isNull() && !node.isError();
    };
    /**
     * UserDataのファイル名が存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistUserDataFile = function () {
        var node = this._json
            .getRoot()
            .getValueByString(FileReferences)
            .getValueByString(UserData);
        return !node.isNull() && !node.isError();
    };
    /**
     * 目ぱちに対応付けられたパラメータが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistEyeBlinkParameters = function () {
        if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
            this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
            return false;
        }
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
            if (this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i)
                .getValueByString(Name)
                .getRawString() == EyeBlink) {
                return true;
            }
        }
        return false;
    };
    /**
     * リップシンクに対応付けられたパラメータが存在するかどうかを確認する
     * @return true キーが存在する
     * @return false キーが存在しない
     */
    CubismModelSettingJson.prototype.isExistLipSyncParameters = function () {
        if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
            this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
            return false;
        }
        for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
            if (this._jsonValue
                .at(FrequestNode.FrequestNode_Groups)
                .getValueByIndex(i)
                .getValueByString(Name)
                .getRawString() == LipSync) {
                return true;
            }
        }
        return false;
    };
    return CubismModelSettingJson;
}(icubismmodelsetting_1.ICubismModelSetting));
exports.CubismModelSettingJson = CubismModelSettingJson;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodelsettingjson */ "../../../../CubismSdkForWeb/Framework/src/cubismmodelsettingjson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelSettingJson = $.CubismModelSettingJson;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/effect/cubismbreath.ts":
/*!************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/effect/cubismbreath.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.BreathParameterData = exports.CubismBreath = void 0;
/**
 * 呼吸機能
 *
 * 呼吸機能を提供する。
 */
var CubismBreath = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismBreath() {
        this._currentTime = 0.0;
    }
    /**
     * インスタンスの作成
     */
    CubismBreath.create = function () {
        return new CubismBreath();
    };
    /**
     * インスタンスの破棄
     * @param instance 対象のCubismBreath
     */
    CubismBreath.delete = function (instance) {
        if (instance != null) {
            instance = null;
        }
    };
    /**
     * 呼吸のパラメータの紐づけ
     * @param breathParameters 呼吸を紐づけたいパラメータのリスト
     */
    CubismBreath.prototype.setParameters = function (breathParameters) {
        this._breathParameters = breathParameters;
    };
    /**
     * 呼吸に紐づいているパラメータの取得
     * @return 呼吸に紐づいているパラメータのリスト
     */
    CubismBreath.prototype.getParameters = function () {
        return this._breathParameters;
    };
    /**
     * モデルのパラメータの更新
     * @param model 対象のモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     */
    CubismBreath.prototype.updateParameters = function (model, deltaTimeSeconds) {
        this._currentTime += deltaTimeSeconds;
        var t = this._currentTime * 2.0 * 3.14159;
        for (var i = 0; i < this._breathParameters.getSize(); ++i) {
            var data = this._breathParameters.at(i);
            model.addParameterValueById(data.parameterId, data.offset + data.peak * Math.sin(t / data.cycle), data.weight);
        }
    };
    return CubismBreath;
}());
exports.CubismBreath = CubismBreath;
/**
 * 呼吸のパラメータ情報
 */
var BreathParameterData = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param parameterId   呼吸をひもづけるパラメータID
     * @param offset        呼吸を正弦波としたときの、波のオフセット
     * @param peak          呼吸を正弦波としたときの、波の高さ
     * @param cycle         呼吸を正弦波としたときの、波の周期
     * @param weight        パラメータへの重み
     */
    function BreathParameterData(parameterId, offset, peak, cycle, weight) {
        this.parameterId = parameterId == undefined ? null : parameterId;
        this.offset = offset == undefined ? 0.0 : offset;
        this.peak = peak == undefined ? 0.0 : peak;
        this.cycle = cycle == undefined ? 0.0 : cycle;
        this.weight = weight == undefined ? 0.0 : weight;
    }
    return BreathParameterData;
}());
exports.BreathParameterData = BreathParameterData;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismbreath */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismbreath.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.BreathParameterData = $.BreathParameterData;
    Live2DCubismFramework.CubismBreath = $.CubismBreath;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/effect/cubismeyeblink.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/effect/cubismeyeblink.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.EyeState = exports.CubismEyeBlink = void 0;
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
/**
 * 自動まばたき機能
 *
 * 自動まばたき機能を提供する。
 */
var CubismEyeBlink = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param modelSetting モデルの設定情報
     */
    function CubismEyeBlink(modelSetting) {
        this._blinkingState = EyeState.EyeState_First;
        this._nextBlinkingTime = 0.0;
        this._stateStartTimeSeconds = 0.0;
        this._blinkingIntervalSeconds = 4.0;
        this._closingSeconds = 0.1;
        this._closedSeconds = 0.05;
        this._openingSeconds = 0.15;
        this._userTimeSeconds = 0.0;
        this._parameterIds = new csmvector_1.csmVector();
        if (modelSetting == null) {
            return;
        }
        for (var i = 0; i < modelSetting.getEyeBlinkParameterCount(); ++i) {
            this._parameterIds.pushBack(modelSetting.getEyeBlinkParameterId(i));
        }
    }
    /**
     * インスタンスを作成する
     * @param modelSetting モデルの設定情報
     * @return 作成されたインスタンス
     * @note 引数がNULLの場合、パラメータIDが設定されていない空のインスタンスを作成する。
     */
    CubismEyeBlink.create = function (modelSetting) {
        if (modelSetting === void 0) { modelSetting = null; }
        return new CubismEyeBlink(modelSetting);
    };
    /**
     * インスタンスの破棄
     * @param eyeBlink 対象のCubismEyeBlink
     */
    CubismEyeBlink.delete = function (eyeBlink) {
        if (eyeBlink != null) {
            eyeBlink = null;
        }
    };
    /**
     * まばたきの間隔の設定
     * @param blinkingInterval まばたきの間隔の時間[秒]
     */
    CubismEyeBlink.prototype.setBlinkingInterval = function (blinkingInterval) {
        this._blinkingIntervalSeconds = blinkingInterval;
    };
    /**
     * まばたきのモーションの詳細設定
     * @param closing   まぶたを閉じる動作の所要時間[秒]
     * @param closed    まぶたを閉じている動作の所要時間[秒]
     * @param opening   まぶたを開く動作の所要時間[秒]
     */
    CubismEyeBlink.prototype.setBlinkingSetting = function (closing, closed, opening) {
        this._closingSeconds = closing;
        this._closedSeconds = closed;
        this._openingSeconds = opening;
    };
    /**
     * まばたきさせるパラメータIDのリストの設定
     * @param parameterIds パラメータのIDのリスト
     */
    CubismEyeBlink.prototype.setParameterIds = function (parameterIds) {
        this._parameterIds = parameterIds;
    };
    /**
     * まばたきさせるパラメータIDのリストの取得
     * @return パラメータIDのリスト
     */
    CubismEyeBlink.prototype.getParameterIds = function () {
        return this._parameterIds;
    };
    /**
     * モデルのパラメータの更新
     * @param model 対象のモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     */
    CubismEyeBlink.prototype.updateParameters = function (model, deltaTimeSeconds) {
        this._userTimeSeconds += deltaTimeSeconds;
        var parameterValue;
        var t = 0.0;
        switch (this._blinkingState) {
            case EyeState.EyeState_Closing:
                t =
                    (this._userTimeSeconds - this._stateStartTimeSeconds) /
                        this._closingSeconds;
                if (t >= 1.0) {
                    t = 1.0;
                    this._blinkingState = EyeState.EyeState_Closed;
                    this._stateStartTimeSeconds = this._userTimeSeconds;
                }
                parameterValue = 1.0 - t;
                break;
            case EyeState.EyeState_Closed:
                t =
                    (this._userTimeSeconds - this._stateStartTimeSeconds) /
                        this._closedSeconds;
                if (t >= 1.0) {
                    this._blinkingState = EyeState.EyeState_Opening;
                    this._stateStartTimeSeconds = this._userTimeSeconds;
                }
                parameterValue = 0.0;
                break;
            case EyeState.EyeState_Opening:
                t =
                    (this._userTimeSeconds - this._stateStartTimeSeconds) /
                        this._openingSeconds;
                if (t >= 1.0) {
                    t = 1.0;
                    this._blinkingState = EyeState.EyeState_Interval;
                    this._nextBlinkingTime = this.determinNextBlinkingTiming();
                }
                parameterValue = t;
                break;
            case EyeState.EyeState_Interval:
                if (this._nextBlinkingTime < this._userTimeSeconds) {
                    this._blinkingState = EyeState.EyeState_Closing;
                    this._stateStartTimeSeconds = this._userTimeSeconds;
                }
                parameterValue = 1.0;
                break;
            case EyeState.EyeState_First:
            default:
                this._blinkingState = EyeState.EyeState_Interval;
                this._nextBlinkingTime = this.determinNextBlinkingTiming();
                parameterValue = 1.0;
                break;
        }
        if (!CubismEyeBlink.CloseIfZero) {
            parameterValue = -parameterValue;
        }
        for (var i = 0; i < this._parameterIds.getSize(); ++i) {
            model.setParameterValueById(this._parameterIds.at(i), parameterValue);
        }
    };
    /**
     * 次の瞬きのタイミングの決定
     *
     * @return 次のまばたきを行う時刻[秒]
     */
    CubismEyeBlink.prototype.determinNextBlinkingTiming = function () {
        var r = Math.random();
        return (this._userTimeSeconds + r * (2.0 * this._blinkingIntervalSeconds - 1.0));
    };
    /**
     * IDで指定された目のパラメータが、0のときに閉じるなら true 、1の時に閉じるなら false 。
     */
    CubismEyeBlink.CloseIfZero = true;
    return CubismEyeBlink;
}());
exports.CubismEyeBlink = CubismEyeBlink;
/**
 * まばたきの状態
 *
 * まばたきの状態を表す列挙型
 */
var EyeState;
(function (EyeState) {
    EyeState[EyeState["EyeState_First"] = 0] = "EyeState_First";
    EyeState[EyeState["EyeState_Interval"] = 1] = "EyeState_Interval";
    EyeState[EyeState["EyeState_Closing"] = 2] = "EyeState_Closing";
    EyeState[EyeState["EyeState_Closed"] = 3] = "EyeState_Closed";
    EyeState[EyeState["EyeState_Opening"] = 4] = "EyeState_Opening";
})(EyeState || (exports.EyeState = EyeState = {}));
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismeyeblink */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismeyeblink.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismEyeBlink = $.CubismEyeBlink;
    Live2DCubismFramework.EyeState = $.EyeState;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/effect/cubismpose.ts":
/*!**********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/effect/cubismpose.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.PartData = exports.CubismPose = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismjson_1 = __webpack_require__(/*! ../utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
var Epsilon = 0.001;
var DefaultFadeInSeconds = 0.5;
// Pose.jsonのタグ
var FadeIn = 'FadeInTime';
var Link = 'Link';
var Groups = 'Groups';
var Id = 'Id';
/**
 * パーツの不透明度の設定
 *
 * パーツの不透明度の管理と設定を行う。
 */
var CubismPose = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismPose() {
        this._fadeTimeSeconds = DefaultFadeInSeconds;
        this._lastModel = null;
        this._partGroups = new csmvector_1.csmVector();
        this._partGroupCounts = new csmvector_1.csmVector();
    }
    /**
     * インスタンスの作成
     * @param pose3json pose3.jsonのデータ
     * @param size pose3.jsonのデータのサイズ[byte]
     * @return 作成されたインスタンス
     */
    CubismPose.create = function (pose3json, size) {
        var ret = new CubismPose();
        var json = cubismjson_1.CubismJson.create(pose3json, size);
        var root = json.getRoot();
        // フェード時間の指定
        if (!root.getValueByString(FadeIn).isNull()) {
            ret._fadeTimeSeconds = root
                .getValueByString(FadeIn)
                .toFloat(DefaultFadeInSeconds);
            if (ret._fadeTimeSeconds <= 0.0) {
                ret._fadeTimeSeconds = DefaultFadeInSeconds;
            }
        }
        // パーツグループ
        var poseListInfo = root.getValueByString(Groups);
        var poseCount = poseListInfo.getSize();
        for (var poseIndex = 0; poseIndex < poseCount; ++poseIndex) {
            var idListInfo = poseListInfo.getValueByIndex(poseIndex);
            var idCount = idListInfo.getSize();
            var groupCount = 0;
            for (var groupIndex = 0; groupIndex < idCount; ++groupIndex) {
                var partInfo = idListInfo.getValueByIndex(groupIndex);
                var partData = new PartData();
                var parameterId = live2dcubismframework_1.CubismFramework.getIdManager().getId(partInfo.getValueByString(Id).getRawString());
                partData.partId = parameterId;
                // リンクするパーツの設定
                if (!partInfo.getValueByString(Link).isNull()) {
                    var linkListInfo = partInfo.getValueByString(Link);
                    var linkCount = linkListInfo.getSize();
                    for (var linkIndex = 0; linkIndex < linkCount; ++linkIndex) {
                        var linkPart = new PartData();
                        var linkId = live2dcubismframework_1.CubismFramework.getIdManager().getId(linkListInfo.getValueByIndex(linkIndex).getString());
                        linkPart.partId = linkId;
                        partData.link.pushBack(linkPart);
                    }
                }
                ret._partGroups.pushBack(partData.clone());
                ++groupCount;
            }
            ret._partGroupCounts.pushBack(groupCount);
        }
        cubismjson_1.CubismJson.delete(json);
        return ret;
    };
    /**
     * インスタンスを破棄する
     * @param pose 対象のCubismPose
     */
    CubismPose.delete = function (pose) {
        if (pose != null) {
            pose = null;
        }
    };
    /**
     * モデルのパラメータの更新
     * @param model 対象のモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     */
    CubismPose.prototype.updateParameters = function (model, deltaTimeSeconds) {
        // 前回のモデルと同じでない場合は初期化が必要
        if (model != this._lastModel) {
            // パラメータインデックスの初期化
            this.reset(model);
        }
        this._lastModel = model;
        // 設定から時間を変更すると、経過時間がマイナスになる事があるので、経過時間0として対応
        if (deltaTimeSeconds < 0.0) {
            deltaTimeSeconds = 0.0;
        }
        var beginIndex = 0;
        for (var i = 0; i < this._partGroupCounts.getSize(); i++) {
            var partGroupCount = this._partGroupCounts.at(i);
            this.doFade(model, deltaTimeSeconds, beginIndex, partGroupCount);
            beginIndex += partGroupCount;
        }
        this.copyPartOpacities(model);
    };
    /**
     * 表示を初期化
     * @param model 対象のモデル
     * @note 不透明度の初期値が0でないパラメータは、不透明度を１に設定する
     */
    CubismPose.prototype.reset = function (model) {
        var beginIndex = 0;
        for (var i = 0; i < this._partGroupCounts.getSize(); ++i) {
            var groupCount = this._partGroupCounts.at(i);
            for (var j = beginIndex; j < beginIndex + groupCount; ++j) {
                this._partGroups.at(j).initialize(model);
                var partsIndex = this._partGroups.at(j).partIndex;
                var paramIndex = this._partGroups.at(j).parameterIndex;
                if (partsIndex < 0) {
                    continue;
                }
                model.setPartOpacityByIndex(partsIndex, j == beginIndex ? 1.0 : 0.0);
                model.setParameterValueByIndex(paramIndex, j == beginIndex ? 1.0 : 0.0);
                for (var k = 0; k < this._partGroups.at(j).link.getSize(); ++k) {
                    this._partGroups.at(j).link.at(k).initialize(model);
                }
            }
            beginIndex += groupCount;
        }
    };
    /**
     * パーツの不透明度をコピー
     *
     * @param model 対象のモデル
     */
    CubismPose.prototype.copyPartOpacities = function (model) {
        for (var groupIndex = 0; groupIndex < this._partGroups.getSize(); ++groupIndex) {
            var partData = this._partGroups.at(groupIndex);
            if (partData.link.getSize() == 0) {
                continue; // 連動するパラメータはない
            }
            var partIndex = this._partGroups.at(groupIndex).partIndex;
            var opacity = model.getPartOpacityByIndex(partIndex);
            for (var linkIndex = 0; linkIndex < partData.link.getSize(); ++linkIndex) {
                var linkPart = partData.link.at(linkIndex);
                var linkPartIndex = linkPart.partIndex;
                if (linkPartIndex < 0) {
                    continue;
                }
                model.setPartOpacityByIndex(linkPartIndex, opacity);
            }
        }
    };
    /**
     * パーツのフェード操作を行う。
     * @param model 対象のモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     * @param beginIndex フェード操作を行うパーツグループの先頭インデックス
     * @param partGroupCount フェード操作を行うパーツグループの個数
     */
    CubismPose.prototype.doFade = function (model, deltaTimeSeconds, beginIndex, partGroupCount) {
        var visiblePartIndex = -1;
        var newOpacity = 1.0;
        var phi = 0.5;
        var backOpacityThreshold = 0.15;
        // 現在、表示状態になっているパーツを取得
        for (var i = beginIndex; i < beginIndex + partGroupCount; ++i) {
            var partIndex = this._partGroups.at(i).partIndex;
            var paramIndex = this._partGroups.at(i).parameterIndex;
            if (model.getParameterValueByIndex(paramIndex) > Epsilon) {
                if (visiblePartIndex >= 0) {
                    break;
                }
                visiblePartIndex = i;
                newOpacity = model.getPartOpacityByIndex(partIndex);
                // 新しい不透明度を計算
                newOpacity += deltaTimeSeconds / this._fadeTimeSeconds;
                if (newOpacity > 1.0) {
                    newOpacity = 1.0;
                }
            }
        }
        if (visiblePartIndex < 0) {
            visiblePartIndex = 0;
            newOpacity = 1.0;
        }
        // 表示パーツ、非表示パーツの不透明度を設定する
        for (var i = beginIndex; i < beginIndex + partGroupCount; ++i) {
            var partsIndex = this._partGroups.at(i).partIndex;
            // 表示パーツの設定
            if (visiblePartIndex == i) {
                model.setPartOpacityByIndex(partsIndex, newOpacity); // 先に設定
            }
            // 非表示パーツの設定
            else {
                var opacity = model.getPartOpacityByIndex(partsIndex);
                var a1 = // 計算によって求められる不透明度
                 void 0; // 計算によって求められる不透明度
                if (newOpacity < phi) {
                    a1 = (newOpacity * (phi - 1)) / phi + 1.0; // (0,1),(phi,phi)を通る直線式
                }
                else {
                    a1 = ((1 - newOpacity) * phi) / (1.0 - phi); // (1,0),(phi,phi)を通る直線式
                }
                // 背景の見える割合を制限する場合
                var backOpacity = (1.0 - a1) * (1.0 - newOpacity);
                if (backOpacity > backOpacityThreshold) {
                    a1 = 1.0 - backOpacityThreshold / (1.0 - newOpacity);
                }
                if (opacity > a1) {
                    opacity = a1; // 計算の不透明度よりも大きければ（濃ければ）不透明度を上げる
                }
                model.setPartOpacityByIndex(partsIndex, opacity);
            }
        }
    };
    return CubismPose;
}());
exports.CubismPose = CubismPose;
/**
 * パーツにまつわるデータを管理
 */
var PartData = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function PartData(v) {
        this.parameterIndex = 0;
        this.partIndex = 0;
        this.link = new csmvector_1.csmVector();
        if (v != undefined) {
            this.partId = v.partId;
            for (var ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
                this.link.pushBack(ite.ptr().clone());
            }
        }
    }
    /**
     * =演算子のオーバーロード
     */
    PartData.prototype.assignment = function (v) {
        this.partId = v.partId;
        for (var ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
            this.link.pushBack(ite.ptr().clone());
        }
        return this;
    };
    /**
     * 初期化
     * @param model 初期化に使用するモデル
     */
    PartData.prototype.initialize = function (model) {
        this.parameterIndex = model.getParameterIndex(this.partId);
        this.partIndex = model.getPartIndex(this.partId);
        model.setParameterValueByIndex(this.parameterIndex, 1);
    };
    /**
     * オブジェクトのコピーを生成する
     */
    PartData.prototype.clone = function () {
        var clonePartData = new PartData();
        clonePartData.partId = this.partId;
        clonePartData.parameterIndex = this.parameterIndex;
        clonePartData.partIndex = this.partIndex;
        clonePartData.link = new csmvector_1.csmVector();
        for (var ite = this.link.begin(); ite.notEqual(this.link.end()); ite.increment()) {
            clonePartData.link.pushBack(ite.ptr().clone());
        }
        return clonePartData;
    };
    return PartData;
}());
exports.PartData = PartData;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismpose */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismpose.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPose = $.CubismPose;
    Live2DCubismFramework.PartData = $.PartData;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/icubismmodelsetting.ts":
/*!************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/icubismmodelsetting.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.ICubismModelSetting = void 0;
/**
 * モデル設定情報を取り扱う関数を宣言した純粋仮想クラス。
 *
 * このクラスを継承することで、モデル設定情報を取り扱うクラスになる。
 */
var ICubismModelSetting = /** @class */ (function () {
    function ICubismModelSetting() {
    }
    return ICubismModelSetting;
}());
exports.ICubismModelSetting = ICubismModelSetting;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./icubismmodelsetting */ "../../../../CubismSdkForWeb/Framework/src/icubismmodelsetting.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.ICubismModelSetting = $.ICubismModelSetting;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/id/cubismid.ts":
/*!****************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/id/cubismid.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismId = void 0;
var csmstring_1 = __webpack_require__(/*! ../type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
/**
 * パラメータ名・パーツ名・Drawable名を保持
 *
 * パラメータ名・パーツ名・Drawable名を保持するクラス。
 */
var CubismId = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismId(id) {
        if (typeof id === 'string') {
            this._id = new csmstring_1.csmString(id);
            return;
        }
        this._id = id;
    }
    /**
     * ID名を取得する
     */
    CubismId.prototype.getString = function () {
        return this._id;
    };
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    CubismId.prototype.isEqual = function (c) {
        if (typeof c === 'string') {
            return this._id.isEqual(c);
        }
        else if (c instanceof csmstring_1.csmString) {
            return this._id.isEqual(c.s);
        }
        else if (c instanceof CubismId) {
            return this._id.isEqual(c._id.s);
        }
        return false;
    };
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    CubismId.prototype.isNotEqual = function (c) {
        if (typeof c == 'string') {
            return !this._id.isEqual(c);
        }
        else if (c instanceof csmstring_1.csmString) {
            return !this._id.isEqual(c.s);
        }
        else if (c instanceof CubismId) {
            return !this._id.isEqual(c._id.s);
        }
        return false;
    };
    return CubismId;
}());
exports.CubismId = CubismId;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismid */ "../../../../CubismSdkForWeb/Framework/src/id/cubismid.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismId = $.CubismId;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/id/cubismidmanager.ts":
/*!***********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/id/cubismidmanager.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismIdManager = void 0;
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismid_1 = __webpack_require__(/*! ./cubismid */ "../../../../CubismSdkForWeb/Framework/src/id/cubismid.ts");
/**
 * ID名の管理
 *
 * ID名を管理する。
 */
var CubismIdManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismIdManager() {
        this._ids = new csmvector_1.csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    CubismIdManager.prototype.release = function () {
        for (var i = 0; i < this._ids.getSize(); ++i) {
            this._ids.set(i, void 0);
        }
        this._ids = null;
    };
    /**
     * ID名をリストから登録
     *
     * @param ids ID名リスト
     * @param count IDの個数
     */
    CubismIdManager.prototype.registerIds = function (ids) {
        for (var i = 0; i < ids.length; i++) {
            this.registerId(ids[i]);
        }
    };
    /**
     * ID名を登録
     *
     * @param id ID名
     */
    CubismIdManager.prototype.registerId = function (id) {
        var result = null;
        if ('string' == typeof id) {
            if ((result = this.findId(id)) != null) {
                return result;
            }
            result = new cubismid_1.CubismId(id);
            this._ids.pushBack(result);
        }
        else {
            return this.registerId(id.s);
        }
        return result;
    };
    /**
     * ID名からIDを取得する
     *
     * @param id ID名
     */
    CubismIdManager.prototype.getId = function (id) {
        return this.registerId(id);
    };
    /**
     * ID名からIDの確認
     *
     * @return true 存在する
     * @return false 存在しない
     */
    CubismIdManager.prototype.isExist = function (id) {
        if ('string' == typeof id) {
            return this.findId(id) != null;
        }
        return this.isExist(id.s);
    };
    /**
     * ID名からIDを検索する。
     *
     * @param id ID名
     * @return 登録されているID。なければNULL。
     */
    CubismIdManager.prototype.findId = function (id) {
        for (var i = 0; i < this._ids.getSize(); ++i) {
            if (this._ids.at(i).getString().isEqual(id)) {
                return this._ids.at(i);
            }
        }
        return null;
    };
    return CubismIdManager;
}());
exports.CubismIdManager = CubismIdManager;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismidmanager */ "../../../../CubismSdkForWeb/Framework/src/id/cubismidmanager.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismIdManager = $.CubismIdManager;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.LogLevel = exports.Option = exports.CubismFramework = exports.csmDelete = exports.Constant = exports.strtod = void 0;
var cubismidmanager_1 = __webpack_require__(/*! ./id/cubismidmanager */ "../../../../CubismSdkForWeb/Framework/src/id/cubismidmanager.ts");
var cubismrenderer_1 = __webpack_require__(/*! ./rendering/cubismrenderer */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts");
var cubismdebug_1 = __webpack_require__(/*! ./utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismjson_1 = __webpack_require__(/*! ./utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
function strtod(s, endPtr) {
    var index = 0;
    for (var i = 1;; i++) {
        var testC = s.slice(i - 1, i);
        // 指数・マイナスの可能性があるのでスキップする
        if (testC == 'e' || testC == '-' || testC == 'E') {
            continue;
        } // 文字列の範囲を広げていく
        var test = s.substring(0, i);
        var number = Number(test);
        if (isNaN(number)) {
            // 数値として認識できなくなったので終了
            break;
        } // 最後に数値としてできたindexを格納しておく
        index = i;
    }
    var d = parseFloat(s); // パースした数値
    if (isNaN(d)) {
        // 数値として認識できなくなったので終了
        d = NaN;
    }
    endPtr[0] = s.slice(index); // 後続の文字列
    return d;
}
exports.strtod = strtod;
// ファイルスコープの変数を初期化
var s_isStarted = false;
var s_isInitialized = false;
var s_option = null;
var s_cubismIdManager = null;
/**
 * Framework内で使う定数の宣言
 */
exports.Constant = Object.freeze({
    vertexOffset: 0, // メッシュ頂点のオフセット値
    vertexStep: 2, // メッシュ頂点のステップ値
});
function csmDelete(address) {
    if (!address) {
        return;
    }
    address = void 0;
}
exports.csmDelete = csmDelete;
/**
 * Live2D Cubism SDK Original Workflow SDKのエントリポイント
 * 利用開始時はCubismFramework.initialize()を呼び、CubismFramework.dispose()で終了する。
 */
var CubismFramework = /** @class */ (function () {
    /**
     * 静的クラスとして使用する
     * インスタンス化させない
     */
    function CubismFramework() {
    }
    /**
     * Cubism FrameworkのAPIを使用可能にする。
     *  APIを実行する前に必ずこの関数を実行すること。
     *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
     *
     * @param    option      Optionクラスのインスタンス
     *
     * @return   準備処理が完了したらtrueが返ります。
     */
    CubismFramework.startUp = function (option) {
        if (option === void 0) { option = null; }
        if (s_isStarted) {
            (0, cubismdebug_1.CubismLogInfo)('CubismFramework.startUp() is already done.');
            return s_isStarted;
        }
        s_option = option;
        if (s_option != null) {
            Live2DCubismCore.Logging.csmSetLogFunction(s_option.logFunction);
        }
        s_isStarted = true;
        // Live2D Cubism Coreバージョン情報を表示
        if (s_isStarted) {
            var version = Live2DCubismCore.Version.csmGetVersion();
            var major = (version & 0xff000000) >> 24;
            var minor = (version & 0x00ff0000) >> 16;
            var patch = version & 0x0000ffff;
            var versionNumber = version;
            (0, cubismdebug_1.CubismLogInfo)("Live2D Cubism Core version: {0}.{1}.{2} ({3})", ('00' + major).slice(-2), ('00' + minor).slice(-2), ('0000' + patch).slice(-4), versionNumber);
        }
        (0, cubismdebug_1.CubismLogInfo)('CubismFramework.startUp() is complete.');
        return s_isStarted;
    };
    /**
     * StartUp()で初期化したCubismFrameworkの各パラメータをクリアします。
     * Dispose()したCubismFrameworkを再利用する際に利用してください。
     */
    CubismFramework.cleanUp = function () {
        s_isStarted = false;
        s_isInitialized = false;
        s_option = null;
        s_cubismIdManager = null;
    };
    /**
     * Cubism Framework内のリソースを初期化してモデルを表示可能な状態にします。<br>
     *     再度Initialize()するには先にDispose()を実行する必要があります。
     *
     * @param memorySize 初期化時メモリ量 [byte(s)]
     *    複数モデル表示時などにモデルが更新されない際に使用してください。
     *    指定する際は必ず1024*1024*16 byte(16MB)以上の値を指定してください。
     *    それ以外はすべて1024*1024*16 byteに丸めます。
     */
    CubismFramework.initialize = function (memorySize) {
        if (memorySize === void 0) { memorySize = 0; }
        (0, cubismdebug_1.CSM_ASSERT)(s_isStarted);
        if (!s_isStarted) {
            (0, cubismdebug_1.CubismLogWarning)('CubismFramework is not started.');
            return;
        }
        // --- s_isInitializedによる連続初期化ガード ---
        // 連続してリソース確保が行われないようにする。
        // 再度Initialize()するには先にDispose()を実行する必要がある。
        if (s_isInitialized) {
            (0, cubismdebug_1.CubismLogWarning)('CubismFramework.initialize() skipped, already initialized.');
            return;
        }
        //---- static 初期化 ----
        cubismjson_1.Value.staticInitializeNotForClientCall();
        s_cubismIdManager = new cubismidmanager_1.CubismIdManager();
        // --- HACK: 初期化時メモリ量の拡張(単位byte) ---
        // 複数モデル表示時などにモデルが更新されない際に使用してください。
        // 指定する際は必ず1024*1024*16 byte(16MB)以上の値を指定してください。
        // それ以外はすべて1024*1024*16 byteに丸めます。
        Live2DCubismCore.Memory.initializeAmountOfMemory(memorySize);
        s_isInitialized = true;
        (0, cubismdebug_1.CubismLogInfo)('CubismFramework.initialize() is complete.');
    };
    /**
     * Cubism Framework内の全てのリソースを解放します。
     *      ただし、外部で確保されたリソースについては解放しません。
     *      外部で適切に破棄する必要があります。
     */
    CubismFramework.dispose = function () {
        (0, cubismdebug_1.CSM_ASSERT)(s_isStarted);
        if (!s_isStarted) {
            (0, cubismdebug_1.CubismLogWarning)('CubismFramework is not started.');
            return;
        }
        // --- s_isInitializedによる未初期化解放ガード ---
        // dispose()するには先にinitialize()を実行する必要がある。
        if (!s_isInitialized) {
            // false...リソース未確保の場合
            (0, cubismdebug_1.CubismLogWarning)('CubismFramework.dispose() skipped, not initialized.');
            return;
        }
        cubismjson_1.Value.staticReleaseNotForClientCall();
        s_cubismIdManager.release();
        s_cubismIdManager = null;
        // レンダラの静的リソース（シェーダプログラム他）を解放する
        cubismrenderer_1.CubismRenderer.staticRelease();
        s_isInitialized = false;
        (0, cubismdebug_1.CubismLogInfo)('CubismFramework.dispose() is complete.');
    };
    /**
     * Cubism FrameworkのAPIを使用する準備が完了したかどうか
     * @return APIを使用する準備が完了していればtrueが返ります。
     */
    CubismFramework.isStarted = function () {
        return s_isStarted;
    };
    /**
     * Cubism Frameworkのリソース初期化がすでに行われているかどうか
     * @return リソース確保が完了していればtrueが返ります
     */
    CubismFramework.isInitialized = function () {
        return s_isInitialized;
    };
    /**
     * Core APIにバインドしたログ関数を実行する
     *
     * @praram message ログメッセージ
     */
    CubismFramework.coreLogFunction = function (message) {
        // Return if logging not possible.
        if (!Live2DCubismCore.Logging.csmGetLogFunction()) {
            return;
        }
        Live2DCubismCore.Logging.csmGetLogFunction()(message);
    };
    /**
     * 現在のログ出力レベル設定の値を返す。
     *
     * @return  現在のログ出力レベル設定の値
     */
    CubismFramework.getLoggingLevel = function () {
        if (s_option != null) {
            return s_option.loggingLevel;
        }
        return LogLevel.LogLevel_Off;
    };
    /**
     * IDマネージャのインスタンスを取得する
     * @return CubismManagerクラスのインスタンス
     */
    CubismFramework.getIdManager = function () {
        return s_cubismIdManager;
    };
    return CubismFramework;
}());
exports.CubismFramework = CubismFramework;
var Option = /** @class */ (function () {
    function Option() {
    }
    return Option;
}());
exports.Option = Option;
/**
 * ログ出力のレベル
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["LogLevel_Verbose"] = 0] = "LogLevel_Verbose";
    LogLevel[LogLevel["LogLevel_Debug"] = 1] = "LogLevel_Debug";
    LogLevel[LogLevel["LogLevel_Info"] = 2] = "LogLevel_Info";
    LogLevel[LogLevel["LogLevel_Warning"] = 3] = "LogLevel_Warning";
    LogLevel[LogLevel["LogLevel_Error"] = 4] = "LogLevel_Error";
    LogLevel[LogLevel["LogLevel_Off"] = 5] = "LogLevel_Off";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.Constant = $.Constant;
    Live2DCubismFramework.csmDelete = $.csmDelete;
    Live2DCubismFramework.CubismFramework = $.CubismFramework;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts":
/*!********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMath = void 0;
var cubismvector2_1 = __webpack_require__(/*! ./cubismvector2 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts");
/**
 * 数値計算などに使用するユーティリティクラス
 */
var CubismMath = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMath() {
    }
    /**
     * 第一引数の値を最小値と最大値の範囲に収めた値を返す
     *
     * @param value 収められる値
     * @param min   範囲の最小値
     * @param max   範囲の最大値
     * @return 最小値と最大値の範囲に収めた値
     */
    CubismMath.range = function (value, min, max) {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    };
    /**
     * サイン関数の値を求める
     *
     * @param x 角度値（ラジアン）
     * @return サイン関数sin(x)の値
     */
    CubismMath.sin = function (x) {
        return Math.sin(x);
    };
    /**
     * コサイン関数の値を求める
     *
     * @param x 角度値(ラジアン)
     * @return コサイン関数cos(x)の値
     */
    CubismMath.cos = function (x) {
        return Math.cos(x);
    };
    /**
     * 値の絶対値を求める
     *
     * @param x 絶対値を求める値
     * @return 値の絶対値
     */
    CubismMath.abs = function (x) {
        return Math.abs(x);
    };
    /**
     * 平方根(ルート)を求める
     * @param x -> 平方根を求める値
     * @return 値の平方根
     */
    CubismMath.sqrt = function (x) {
        return Math.sqrt(x);
    };
    /**
     * 立方根を求める
     * @param x -> 立方根を求める値
     * @return 値の立方根
     */
    CubismMath.cbrt = function (x) {
        if (x === 0) {
            return x;
        }
        var cx = x;
        var isNegativeNumber = cx < 0;
        if (isNegativeNumber) {
            cx = -cx;
        }
        var ret;
        if (cx === Infinity) {
            ret = Infinity;
        }
        else {
            ret = Math.exp(Math.log(cx) / 3);
            ret = (cx / (ret * ret) + 2 * ret) / 3;
        }
        return isNegativeNumber ? -ret : ret;
    };
    /**
     * イージング処理されたサインを求める
     * フェードイン・アウト時のイージングに利用できる
     *
     * @param value イージングを行う値
     * @return イージング処理されたサイン値
     */
    CubismMath.getEasingSine = function (value) {
        if (value < 0.0) {
            return 0.0;
        }
        else if (value > 1.0) {
            return 1.0;
        }
        return 0.5 - 0.5 * this.cos(value * Math.PI);
    };
    /**
     * 大きい方の値を返す
     *
     * @param left 左辺の値
     * @param right 右辺の値
     * @return 大きい方の値
     */
    CubismMath.max = function (left, right) {
        return left > right ? left : right;
    };
    /**
     * 小さい方の値を返す
     *
     * @param left  左辺の値
     * @param right 右辺の値
     * @return 小さい方の値
     */
    CubismMath.min = function (left, right) {
        return left > right ? right : left;
    };
    /**
     * 角度値をラジアン値に変換する
     *
     * @param degrees   角度値
     * @return 角度値から変換したラジアン値
     */
    CubismMath.degreesToRadian = function (degrees) {
        return (degrees / 180.0) * Math.PI;
    };
    /**
     * ラジアン値を角度値に変換する
     *
     * @param radian    ラジアン値
     * @return ラジアン値から変換した角度値
     */
    CubismMath.radianToDegrees = function (radian) {
        return (radian * 180.0) / Math.PI;
    };
    /**
     * ２つのベクトルからラジアン値を求める
     *
     * @param from  始点ベクトル
     * @param to    終点ベクトル
     * @return ラジアン値から求めた方向ベクトル
     */
    CubismMath.directionToRadian = function (from, to) {
        var q1 = Math.atan2(to.y, to.x);
        var q2 = Math.atan2(from.y, from.x);
        var ret = q1 - q2;
        while (ret < -Math.PI) {
            ret += Math.PI * 2.0;
        }
        while (ret > Math.PI) {
            ret -= Math.PI * 2.0;
        }
        return ret;
    };
    /**
     * ２つのベクトルから角度値を求める
     *
     * @param from  始点ベクトル
     * @param to    終点ベクトル
     * @return 角度値から求めた方向ベクトル
     */
    CubismMath.directionToDegrees = function (from, to) {
        var radian = this.directionToRadian(from, to);
        var degree = this.radianToDegrees(radian);
        if (to.x - from.x > 0.0) {
            degree = -degree;
        }
        return degree;
    };
    /**
     * ラジアン値を方向ベクトルに変換する。
     *
     * @param totalAngle    ラジアン値
     * @return ラジアン値から変換した方向ベクトル
     */
    CubismMath.radianToDirection = function (totalAngle) {
        var ret = new cubismvector2_1.CubismVector2();
        ret.x = this.sin(totalAngle);
        ret.y = this.cos(totalAngle);
        return ret;
    };
    /**
     * 三次方程式の三次項の係数が0になったときに補欠的に二次方程式の解をもとめる。
     * a * x^2 + b * x + c = 0
     *
     * @param   a -> 二次項の係数値
     * @param   b -> 一次項の係数値
     * @param   c -> 定数項の値
     * @return  二次方程式の解
     */
    CubismMath.quadraticEquation = function (a, b, c) {
        if (this.abs(a) < CubismMath.Epsilon) {
            if (this.abs(b) < CubismMath.Epsilon) {
                return -c;
            }
            return -c / b;
        }
        return -(b + this.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
    };
    /**
     * カルダノの公式によってベジェのt値に該当する３次方程式の解を求める。
     * 重解になったときには0.0～1.0の値になる解を返す。
     *
     * a * x^3 + b * x^2 + c * x + d = 0
     *
     * @param   a -> 三次項の係数値
     * @param   b -> 二次項の係数値
     * @param   c -> 一次項の係数値
     * @param   d -> 定数項の値
     * @return  0.0～1.0の間にある解
     */
    CubismMath.cardanoAlgorithmForBezier = function (a, b, c, d) {
        if (this.sqrt(a) < CubismMath.Epsilon) {
            return this.range(this.quadraticEquation(b, c, d), 0.0, 1.0);
        }
        var ba = b / a;
        var ca = c / a;
        var da = d / a;
        var p = (3.0 * ca - ba * ba) / 3.0;
        var p3 = p / 3.0;
        var q = (2.0 * ba * ba * ba - 9.0 * ba * ca + 27.0 * da) / 27.0;
        var q2 = q / 2.0;
        var discriminant = q2 * q2 + p3 * p3 * p3;
        var center = 0.5;
        var threshold = center + 0.01;
        if (discriminant < 0.0) {
            var mp3 = -p / 3.0;
            var mp33 = mp3 * mp3 * mp3;
            var r = this.sqrt(mp33);
            var t = -q / (2.0 * r);
            var cosphi = this.range(t, -1.0, 1.0);
            var phi = Math.acos(cosphi);
            var crtr = this.cbrt(r);
            var t1 = 2.0 * crtr;
            var root1_1 = t1 * this.cos(phi / 3.0) - ba / 3.0;
            if (this.abs(root1_1 - center) < threshold) {
                return this.range(root1_1, 0.0, 1.0);
            }
            var root2 = t1 * this.cos((phi + 2.0 * Math.PI) / 3.0) - ba / 3.0;
            if (this.abs(root2 - center) < threshold) {
                return this.range(root2, 0.0, 1.0);
            }
            var root3 = t1 * this.cos((phi + 4.0 * Math.PI) / 3.0) - ba / 3.0;
            return this.range(root3, 0.0, 1.0);
        }
        if (discriminant == 0.0) {
            var u1_1;
            if (q2 < 0.0) {
                u1_1 = this.cbrt(-q2);
            }
            else {
                u1_1 = -this.cbrt(q2);
            }
            var root1_2 = 2.0 * u1_1 - ba / 3.0;
            if (this.abs(root1_2 - center) < threshold) {
                return this.range(root1_2, 0.0, 1.0);
            }
            var root2 = -u1_1 - ba / 3.0;
            return this.range(root2, 0.0, 1.0);
        }
        var sd = this.sqrt(discriminant);
        var u1 = this.cbrt(sd - q2);
        var v1 = this.cbrt(sd + q2);
        var root1 = u1 - v1 - ba / 3.0;
        return this.range(root1, 0.0, 1.0);
    };
    CubismMath.Epsilon = 0.00001;
    return CubismMath;
}());
exports.CubismMath = CubismMath;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmath */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMath = $.CubismMath;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts":
/*!************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMatrix44 = void 0;
/**
 * 4x4の行列
 *
 * 4x4行列の便利クラス。
 */
var CubismMatrix44 = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMatrix44() {
        this._tr = new Float32Array(16); // 4 * 4のサイズ
        this.loadIdentity();
    }
    /**
     * 受け取った２つの行列の乗算を行う。
     *
     * @param a 行列a
     * @param b 行列b
     * @return 乗算結果の行列
     */
    CubismMatrix44.multiply = function (a, b, dst) {
        var c = new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0,
        ]);
        var n = 4;
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < n; ++j) {
                for (var k = 0; k < n; ++k) {
                    c[j + i * 4] += a[k + i * 4] * b[j + k * 4];
                }
            }
        }
        for (var i = 0; i < 16; ++i) {
            dst[i] = c[i];
        }
    };
    /**
     * 単位行列に初期化する
     */
    CubismMatrix44.prototype.loadIdentity = function () {
        var c = new Float32Array([
            1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
            1.0,
        ]);
        this.setMatrix(c);
    };
    /**
     * 行列を設定
     *
     * @param tr 16個の浮動小数点数で表される4x4の行列
     */
    CubismMatrix44.prototype.setMatrix = function (tr) {
        for (var i = 0; i < 16; ++i) {
            this._tr[i] = tr[i];
        }
    };
    /**
     * 行列を浮動小数点数の配列で取得
     *
     * @return 16個の浮動小数点数で表される4x4の行列
     */
    CubismMatrix44.prototype.getArray = function () {
        return this._tr;
    };
    /**
     * X軸の拡大率を取得
     * @return X軸の拡大率
     */
    CubismMatrix44.prototype.getScaleX = function () {
        return this._tr[0];
    };
    /**
     * Y軸の拡大率を取得する
     *
     * @return Y軸の拡大率
     */
    CubismMatrix44.prototype.getScaleY = function () {
        return this._tr[5];
    };
    /**
     * X軸の移動量を取得
     * @return X軸の移動量
     */
    CubismMatrix44.prototype.getTranslateX = function () {
        return this._tr[12];
    };
    /**
     * Y軸の移動量を取得
     * @return Y軸の移動量
     */
    CubismMatrix44.prototype.getTranslateY = function () {
        return this._tr[13];
    };
    /**
     * X軸の値を現在の行列で計算
     *
     * @param src X軸の値
     * @return 現在の行列で計算されたX軸の値
     */
    CubismMatrix44.prototype.transformX = function (src) {
        return this._tr[0] * src + this._tr[12];
    };
    /**
     * Y軸の値を現在の行列で計算
     *
     * @param src Y軸の値
     * @return 現在の行列で計算されたY軸の値
     */
    CubismMatrix44.prototype.transformY = function (src) {
        return this._tr[5] * src + this._tr[13];
    };
    /**
     * X軸の値を現在の行列で逆計算
     */
    CubismMatrix44.prototype.invertTransformX = function (src) {
        return (src - this._tr[12]) / this._tr[0];
    };
    /**
     * Y軸の値を現在の行列で逆計算
     */
    CubismMatrix44.prototype.invertTransformY = function (src) {
        return (src - this._tr[13]) / this._tr[5];
    };
    /**
     * 現在の行列の位置を起点にして移動
     *
     * 現在の行列の位置を起点にして相対的に移動する。
     *
     * @param x X軸の移動量
     * @param y Y軸の移動量
     */
    CubismMatrix44.prototype.translateRelative = function (x, y) {
        var tr1 = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            x,
            y,
            0.0,
            1.0,
        ]);
        CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * 現在の行列の位置を移動
     *
     * 現在の行列の位置を指定した位置へ移動する
     *
     * @param x X軸の移動量
     * @param y y軸の移動量
     */
    CubismMatrix44.prototype.translate = function (x, y) {
        this._tr[12] = x;
        this._tr[13] = y;
    };
    /**
     * 現在の行列のX軸の位置を指定した位置へ移動する
     *
     * @param x X軸の移動量
     */
    CubismMatrix44.prototype.translateX = function (x) {
        this._tr[12] = x;
    };
    /**
     * 現在の行列のY軸の位置を指定した位置へ移動する
     *
     * @param y Y軸の移動量
     */
    CubismMatrix44.prototype.translateY = function (y) {
        this._tr[13] = y;
    };
    /**
     * 現在の行列の拡大率を相対的に設定する
     *
     * @param x X軸の拡大率
     * @param y Y軸の拡大率
     */
    CubismMatrix44.prototype.scaleRelative = function (x, y) {
        var tr1 = new Float32Array([
            x,
            0.0,
            0.0,
            0.0,
            0.0,
            y,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
        ]);
        CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * 現在の行列の拡大率を指定した倍率に設定する
     *
     * @param x X軸の拡大率
     * @param y Y軸の拡大率
     */
    CubismMatrix44.prototype.scale = function (x, y) {
        this._tr[0] = x;
        this._tr[5] = y;
    };
    /**
     * 現在の行列に行列を乗算
     *
     * @param m 行列
     */
    CubismMatrix44.prototype.multiplyByMatrix = function (m) {
        CubismMatrix44.multiply(m.getArray(), this._tr, this._tr);
    };
    /**
     * オブジェクトのコピーを生成する
     */
    CubismMatrix44.prototype.clone = function () {
        var cloneMatrix = new CubismMatrix44();
        for (var i = 0; i < this._tr.length; i++) {
            cloneMatrix._tr[i] = this._tr[i];
        }
        return cloneMatrix;
    };
    return CubismMatrix44;
}());
exports.CubismMatrix44 = CubismMatrix44;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMatrix44 = $.CubismMatrix44;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismmodelmatrix.ts":
/*!***************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismmodelmatrix.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismModelMatrix = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! ./cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
/**
 * モデル座標設定用の4x4行列
 *
 * モデル座標設定用の4x4行列クラス
 */
var CubismModelMatrix = /** @class */ (function (_super) {
    __extends(CubismModelMatrix, _super);
    /**
     * コンストラクタ
     *
     * @param w 横幅
     * @param h 縦幅
     */
    function CubismModelMatrix(w, h) {
        var _this = _super.call(this) || this;
        _this._width = w !== undefined ? w : 0.0;
        _this._height = h !== undefined ? h : 0.0;
        _this.setHeight(2.0);
        return _this;
    }
    /**
     * 横幅を設定
     *
     * @param w 横幅
     */
    CubismModelMatrix.prototype.setWidth = function (w) {
        var scaleX = w / this._width;
        var scaleY = scaleX;
        this.scale(scaleX, scaleY);
    };
    /**
     * 縦幅を設定
     * @param h 縦幅
     */
    CubismModelMatrix.prototype.setHeight = function (h) {
        var scaleX = h / this._height;
        var scaleY = scaleX;
        this.scale(scaleX, scaleY);
    };
    /**
     * 位置を設定
     *
     * @param x X軸の位置
     * @param y Y軸の位置
     */
    CubismModelMatrix.prototype.setPosition = function (x, y) {
        this.translate(x, y);
    };
    /**
     * 中心位置を設定
     *
     * @param x X軸の中心位置
     * @param y Y軸の中心位置
     *
     * @note widthかheightを設定したあとでないと、拡大率が正しく取得できないためずれる。
     */
    CubismModelMatrix.prototype.setCenterPosition = function (x, y) {
        this.centerX(x);
        this.centerY(y);
    };
    /**
     * 上辺の位置を設定する
     *
     * @param y 上辺のY軸位置
     */
    CubismModelMatrix.prototype.top = function (y) {
        this.setY(y);
    };
    /**
     * 下辺の位置を設定する
     *
     * @param y 下辺のY軸位置
     */
    CubismModelMatrix.prototype.bottom = function (y) {
        var h = this._height * this.getScaleY();
        this.translateY(y - h);
    };
    /**
     * 左辺の位置を設定
     *
     * @param x 左辺のX軸位置
     */
    CubismModelMatrix.prototype.left = function (x) {
        this.setX(x);
    };
    /**
     * 右辺の位置を設定
     *
     * @param x 右辺のX軸位置
     */
    CubismModelMatrix.prototype.right = function (x) {
        var w = this._width * this.getScaleX();
        this.translateX(x - w);
    };
    /**
     * X軸の中心位置を設定
     *
     * @param x X軸の中心位置
     */
    CubismModelMatrix.prototype.centerX = function (x) {
        var w = this._width * this.getScaleX();
        this.translateX(x - w / 2.0);
    };
    /**
     * X軸の位置を設定
     *
     * @param x X軸の位置
     */
    CubismModelMatrix.prototype.setX = function (x) {
        this.translateX(x);
    };
    /**
     * Y軸の中心位置を設定
     *
     * @param y Y軸の中心位置
     */
    CubismModelMatrix.prototype.centerY = function (y) {
        var h = this._height * this.getScaleY();
        this.translateY(y - h / 2.0);
    };
    /**
     * Y軸の位置を設定する
     *
     * @param y Y軸の位置
     */
    CubismModelMatrix.prototype.setY = function (y) {
        this.translateY(y);
    };
    /**
     * レイアウト情報から位置を設定
     *
     * @param layout レイアウト情報
     */
    CubismModelMatrix.prototype.setupFromLayout = function (layout) {
        var keyWidth = 'width';
        var keyHeight = 'height';
        var keyX = 'x';
        var keyY = 'y';
        var keyCenterX = 'center_x';
        var keyCenterY = 'center_y';
        var keyTop = 'top';
        var keyBottom = 'bottom';
        var keyLeft = 'left';
        var keyRight = 'right';
        for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
            var key = ite.ptr().first;
            var value = ite.ptr().second;
            if (key == keyWidth) {
                this.setWidth(value);
            }
            else if (key == keyHeight) {
                this.setHeight(value);
            }
        }
        for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
            var key = ite.ptr().first;
            var value = ite.ptr().second;
            if (key == keyX) {
                this.setX(value);
            }
            else if (key == keyY) {
                this.setY(value);
            }
            else if (key == keyCenterX) {
                this.centerX(value);
            }
            else if (key == keyCenterY) {
                this.centerY(value);
            }
            else if (key == keyTop) {
                this.top(value);
            }
            else if (key == keyBottom) {
                this.bottom(value);
            }
            else if (key == keyLeft) {
                this.left(value);
            }
            else if (key == keyRight) {
                this.right(value);
            }
        }
    };
    return CubismModelMatrix;
}(cubismmatrix44_1.CubismMatrix44));
exports.CubismModelMatrix = CubismModelMatrix;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodelmatrix */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmodelmatrix.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelMatrix = $.CubismModelMatrix;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismtargetpoint.ts":
/*!***************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismtargetpoint.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismTargetPoint = void 0;
var cubismmath_1 = __webpack_require__(/*! ./cubismmath */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts");
var FrameRate = 30;
var Epsilon = 0.01;
/**
 * 顔の向きの制御機能
 *
 * 顔の向きの制御機能を提供するクラス。
 */
var CubismTargetPoint = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismTargetPoint() {
        this._faceTargetX = 0.0;
        this._faceTargetY = 0.0;
        this._faceX = 0.0;
        this._faceY = 0.0;
        this._faceVX = 0.0;
        this._faceVY = 0.0;
        this._lastTimeSeconds = 0.0;
        this._userTimeSeconds = 0.0;
    }
    /**
     * 更新処理
     */
    CubismTargetPoint.prototype.update = function (deltaTimeSeconds) {
        // デルタ時間を加算する
        this._userTimeSeconds += deltaTimeSeconds;
        // 首を中央から左右に振るときの平均的な速さは 秒速度。加速・減速を考慮して、その２倍を最高速度とする
        // 顔の振り具合を、中央（0.0）から、左右は（+-1.0）とする
        var faceParamMaxV = 40.0 / 10.0; // 7.5秒間に40分移動(5.3/sc)
        var maxV = (faceParamMaxV * 1.0) / FrameRate; // 1frameあたりに変化できる速度の上限
        if (this._lastTimeSeconds == 0.0) {
            this._lastTimeSeconds = this._userTimeSeconds;
            return;
        }
        var deltaTimeWeight = (this._userTimeSeconds - this._lastTimeSeconds) * FrameRate;
        this._lastTimeSeconds = this._userTimeSeconds;
        // 最高速度になるまでの時間を
        var timeToMaxSpeed = 0.15;
        var frameToMaxSpeed = timeToMaxSpeed * FrameRate; // sec * frame/sec
        var maxA = (deltaTimeWeight * maxV) / frameToMaxSpeed; // 1frameあたりの加速度
        // 目指す向きは、（dx, dy）方向のベクトルとなる
        var dx = this._faceTargetX - this._faceX;
        var dy = this._faceTargetY - this._faceY;
        if (cubismmath_1.CubismMath.abs(dx) <= Epsilon && cubismmath_1.CubismMath.abs(dy) <= Epsilon) {
            return; // 変化なし
        }
        // 速度の最大よりも大きい場合は、速度を落とす
        var d = cubismmath_1.CubismMath.sqrt(dx * dx + dy * dy);
        // 進行方向の最大速度ベクトル
        var vx = (maxV * dx) / d;
        var vy = (maxV * dy) / d;
        // 現在の速度から、新規速度への変化（加速度）を求める
        var ax = vx - this._faceVX;
        var ay = vy - this._faceVY;
        var a = cubismmath_1.CubismMath.sqrt(ax * ax + ay * ay);
        // 加速のとき
        if (a < -maxA || a > maxA) {
            ax *= maxA / a;
            ay *= maxA / a;
        }
        // 加速度を元の速度に足して、新速度とする
        this._faceVX += ax;
        this._faceVY += ay;
        // 目的の方向に近づいたとき、滑らかに減速するための処理
        // 設定された加速度で止まる事の出来る距離と速度の関係から
        // 現在とりうる最高速度を計算し、それ以上の時は速度を落とす
        // ※本来、人間は筋力で力（加速度）を調整できるため、より自由度が高いが、簡単な処理で済ませている
        {
            // 加速度、速度、距離の関係式。
            //            2  6           2               3
            //      sqrt(a  t  + 16 a h t  - 8 a h) - a t
            // v = --------------------------------------
            //                    2
            //                 4 t  - 2
            // (t=1)
            // 	時刻tは、あらかじめ加速度、速度を1/60(フレームレート、単位なし)で
            // 	考えているので、t＝１として消してよい（※未検証）
            var maxV_1 = 0.5 *
                (cubismmath_1.CubismMath.sqrt(maxA * maxA + 16.0 * maxA * d - 8.0 * maxA * d) -
                    maxA);
            var curV = cubismmath_1.CubismMath.sqrt(this._faceVX * this._faceVX + this._faceVY * this._faceVY);
            if (curV > maxV_1) {
                // 現在の速度 > 最高速度のとき、最高速度まで減速
                this._faceVX *= maxV_1 / curV;
                this._faceVY *= maxV_1 / curV;
            }
        }
        this._faceX += this._faceVX;
        this._faceY += this._faceVY;
    };
    /**
     * X軸の顔の向きの値を取得
     *
     * @return X軸の顔の向きの値（-1.0 ~ 1.0）
     */
    CubismTargetPoint.prototype.getX = function () {
        return this._faceX;
    };
    /**
     * Y軸の顔の向きの値を取得
     *
     * @return Y軸の顔の向きの値（-1.0 ~ 1.0）
     */
    CubismTargetPoint.prototype.getY = function () {
        return this._faceY;
    };
    /**
     * 顔の向きの目標値を設定
     *
     * @param x X軸の顔の向きの値（-1.0 ~ 1.0）
     * @param y Y軸の顔の向きの値（-1.0 ~ 1.0）
     */
    CubismTargetPoint.prototype.set = function (x, y) {
        this._faceTargetX = x;
        this._faceTargetY = y;
    };
    return CubismTargetPoint;
}());
exports.CubismTargetPoint = CubismTargetPoint;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismtargetpoint */ "../../../../CubismSdkForWeb/Framework/src/math/cubismtargetpoint.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismTargetPoint = $.CubismTargetPoint;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts":
/*!***********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismVector2 = void 0;
/**
 * 2次元ベクトル型
 *
 * 2次元ベクトル型の機能を提供する。
 */
var CubismVector2 = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismVector2(x, y) {
        this.x = x;
        this.y = y;
        this.x = x == undefined ? 0.0 : x;
        this.y = y == undefined ? 0.0 : y;
    }
    /**
     * ベクトルの加算
     *
     * @param vector2 加算するベクトル値
     * @return 加算結果 ベクトル値
     */
    CubismVector2.prototype.add = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x + vector2.x;
        ret.y = this.y + vector2.y;
        return ret;
    };
    /**
     * ベクトルの減算
     *
     * @param vector2 減算するベクトル値
     * @return 減算結果 ベクトル値
     */
    CubismVector2.prototype.substract = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x - vector2.x;
        ret.y = this.y - vector2.y;
        return ret;
    };
    /**
     * ベクトルの乗算
     *
     * @param vector2 乗算するベクトル値
     * @return 乗算結果 ベクトル値
     */
    CubismVector2.prototype.multiply = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x * vector2.x;
        ret.y = this.y * vector2.y;
        return ret;
    };
    /**
     * ベクトルの乗算(スカラー)
     *
     * @param scalar 乗算するスカラー値
     * @return 乗算結果 ベクトル値
     */
    CubismVector2.prototype.multiplyByScaler = function (scalar) {
        return this.multiply(new CubismVector2(scalar, scalar));
    };
    /**
     * ベクトルの除算
     *
     * @param vector2 除算するベクトル値
     * @return 除算結果 ベクトル値
     */
    CubismVector2.prototype.division = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x / vector2.x;
        ret.y = this.y / vector2.y;
        return ret;
    };
    /**
     * ベクトルの除算(スカラー)
     *
     * @param scalar 除算するスカラー値
     * @return 除算結果 ベクトル値
     */
    CubismVector2.prototype.divisionByScalar = function (scalar) {
        return this.division(new CubismVector2(scalar, scalar));
    };
    /**
     * ベクトルの長さを取得する
     *
     * @return ベクトルの長さ
     */
    CubismVector2.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    /**
     * ベクトルの距離の取得
     *
     * @param a 点
     * @return ベクトルの距離
     */
    CubismVector2.prototype.getDistanceWith = function (a) {
        return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
    };
    /**
     * ドット積の計算
     *
     * @param a 値
     * @return 結果
     */
    CubismVector2.prototype.dot = function (a) {
        return this.x * a.x + this.y * a.y;
    };
    /**
     * 正規化の適用
     */
    CubismVector2.prototype.normalize = function () {
        var length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
        this.x = this.x / length;
        this.y = this.y / length;
    };
    /**
     * 等しさの確認（等しいか？）
     *
     * 値が等しいか？
     *
     * @param rhs 確認する値
     * @return true 値は等しい
     * @return false 値は等しくない
     */
    CubismVector2.prototype.isEqual = function (rhs) {
        return this.x == rhs.x && this.y == rhs.y;
    };
    /**
     * 等しさの確認（等しくないか？）
     *
     * 値が等しくないか？
     *
     * @param rhs 確認する値
     * @return true 値は等しくない
     * @return false 値は等しい
     */
    CubismVector2.prototype.isNotEqual = function (rhs) {
        return !this.isEqual(rhs);
    };
    return CubismVector2;
}());
exports.CubismVector2 = CubismVector2;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismvector2 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismVector2 = $.CubismVector2;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/math/cubismviewmatrix.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/math/cubismviewmatrix.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismViewMatrix = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! ./cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
/**
 * カメラの位置変更に使うと便利な4x4行列
 *
 * カメラの位置変更に使うと便利な4x4行列のクラス。
 */
var CubismViewMatrix = /** @class */ (function (_super) {
    __extends(CubismViewMatrix, _super);
    /**
     * コンストラクタ
     */
    function CubismViewMatrix() {
        var _this = _super.call(this) || this;
        _this._screenLeft = 0.0;
        _this._screenRight = 0.0;
        _this._screenTop = 0.0;
        _this._screenBottom = 0.0;
        _this._maxLeft = 0.0;
        _this._maxRight = 0.0;
        _this._maxTop = 0.0;
        _this._maxBottom = 0.0;
        _this._maxScale = 0.0;
        _this._minScale = 0.0;
        return _this;
    }
    /**
     * 移動を調整
     *
     * @param x X軸の移動量
     * @param y Y軸の移動量
     */
    CubismViewMatrix.prototype.adjustTranslate = function (x, y) {
        if (this._tr[0] * this._maxLeft + (this._tr[12] + x) > this._screenLeft) {
            x = this._screenLeft - this._tr[0] * this._maxLeft - this._tr[12];
        }
        if (this._tr[0] * this._maxRight + (this._tr[12] + x) < this._screenRight) {
            x = this._screenRight - this._tr[0] * this._maxRight - this._tr[12];
        }
        if (this._tr[5] * this._maxTop + (this._tr[13] + y) < this._screenTop) {
            y = this._screenTop - this._tr[5] * this._maxTop - this._tr[13];
        }
        if (this._tr[5] * this._maxBottom + (this._tr[13] + y) >
            this._screenBottom) {
            y = this._screenBottom - this._tr[5] * this._maxBottom - this._tr[13];
        }
        var tr1 = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            x,
            y,
            0.0,
            1.0,
        ]);
        cubismmatrix44_1.CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * 拡大率を調整
     *
     * @param cx 拡大を行うX軸の中心位置
     * @param cy 拡大を行うY軸の中心位置
     * @param scale 拡大率
     */
    CubismViewMatrix.prototype.adjustScale = function (cx, cy, scale) {
        var maxScale = this.getMaxScale();
        var minScale = this.getMinScale();
        var targetScale = scale * this._tr[0];
        if (targetScale < minScale) {
            if (this._tr[0] > 0.0) {
                scale = minScale / this._tr[0];
            }
        }
        else if (targetScale > maxScale) {
            if (this._tr[0] > 0.0) {
                scale = maxScale / this._tr[0];
            }
        }
        var tr1 = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            cx,
            cy,
            0.0,
            1.0,
        ]);
        var tr2 = new Float32Array([
            scale,
            0.0,
            0.0,
            0.0,
            0.0,
            scale,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
        ]);
        var tr3 = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            -cx,
            -cy,
            0.0,
            1.0,
        ]);
        cubismmatrix44_1.CubismMatrix44.multiply(tr3, this._tr, this._tr);
        cubismmatrix44_1.CubismMatrix44.multiply(tr2, this._tr, this._tr);
        cubismmatrix44_1.CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * デバイスに対応する論理座養生の範囲の設定
     *
     * @param left      左辺のX軸の位置
     * @param right     右辺のX軸の位置
     * @param bottom    下辺のY軸の位置
     * @param top       上辺のY軸の位置
     */
    CubismViewMatrix.prototype.setScreenRect = function (left, right, bottom, top) {
        this._screenLeft = left;
        this._screenRight = right;
        this._screenBottom = bottom;
        this._screenTop = top;
    };
    /**
     * デバイスに対応する論理座標上の移動可能範囲の設定
     * @param left      左辺のX軸の位置
     * @param right     右辺のX軸の位置
     * @param bottom    下辺のY軸の位置
     * @param top       上辺のY軸の位置
     */
    CubismViewMatrix.prototype.setMaxScreenRect = function (left, right, bottom, top) {
        this._maxLeft = left;
        this._maxRight = right;
        this._maxTop = top;
        this._maxBottom = bottom;
    };
    /**
     * 最大拡大率の設定
     * @param maxScale 最大拡大率
     */
    CubismViewMatrix.prototype.setMaxScale = function (maxScale) {
        this._maxScale = maxScale;
    };
    /**
     * 最小拡大率の設定
     * @param minScale 最小拡大率
     */
    CubismViewMatrix.prototype.setMinScale = function (minScale) {
        this._minScale = minScale;
    };
    /**
     * 最大拡大率の取得
     * @return 最大拡大率
     */
    CubismViewMatrix.prototype.getMaxScale = function () {
        return this._maxScale;
    };
    /**
     * 最小拡大率の取得
     * @return 最小拡大率
     */
    CubismViewMatrix.prototype.getMinScale = function () {
        return this._minScale;
    };
    /**
     * 拡大率が最大になっているかを確認する
     *
     * @return true 拡大率は最大
     * @return false 拡大率は最大ではない
     */
    CubismViewMatrix.prototype.isMaxScale = function () {
        return this.getScaleX() >= this._maxScale;
    };
    /**
     * 拡大率が最小になっているかを確認する
     *
     * @return true 拡大率は最小
     * @return false 拡大率は最小ではない
     */
    CubismViewMatrix.prototype.isMinScale = function () {
        return this.getScaleX() <= this._minScale;
    };
    /**
     * デバイスに対応する論理座標の左辺のＸ軸位置を取得する
     * @return デバイスに対応する論理座標の左辺のX軸位置
     */
    CubismViewMatrix.prototype.getScreenLeft = function () {
        return this._screenLeft;
    };
    /**
     * デバイスに対応する論理座標の右辺のＸ軸位置を取得する
     * @return デバイスに対応する論理座標の右辺のX軸位置
     */
    CubismViewMatrix.prototype.getScreenRight = function () {
        return this._screenRight;
    };
    /**
     * デバイスに対応する論理座標の下辺のY軸位置を取得する
     * @return デバイスに対応する論理座標の下辺のY軸位置
     */
    CubismViewMatrix.prototype.getScreenBottom = function () {
        return this._screenBottom;
    };
    /**
     * デバイスに対応する論理座標の上辺のY軸位置を取得する
     * @return デバイスに対応する論理座標の上辺のY軸位置
     */
    CubismViewMatrix.prototype.getScreenTop = function () {
        return this._screenTop;
    };
    /**
     * 左辺のX軸位置の最大値の取得
     * @return 左辺のX軸位置の最大値
     */
    CubismViewMatrix.prototype.getMaxLeft = function () {
        return this._maxLeft;
    };
    /**
     * 右辺のX軸位置の最大値の取得
     * @return 右辺のX軸位置の最大値
     */
    CubismViewMatrix.prototype.getMaxRight = function () {
        return this._maxRight;
    };
    /**
     * 下辺のY軸位置の最大値の取得
     * @return 下辺のY軸位置の最大値
     */
    CubismViewMatrix.prototype.getMaxBottom = function () {
        return this._maxBottom;
    };
    /**
     * 上辺のY軸位置の最大値の取得
     * @return 上辺のY軸位置の最大値
     */
    CubismViewMatrix.prototype.getMaxTop = function () {
        return this._maxTop;
    };
    return CubismViewMatrix;
}(cubismmatrix44_1.CubismMatrix44));
exports.CubismViewMatrix = CubismViewMatrix;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismviewmatrix */ "../../../../CubismSdkForWeb/Framework/src/math/cubismviewmatrix.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismViewMatrix = $.CubismViewMatrix;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts":
/*!********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMoc = void 0;
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmodel_1 = __webpack_require__(/*! ./cubismmodel */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodel.ts");
/**
 * Mocデータの管理
 *
 * Mocデータの管理を行うクラス。
 */
var CubismMoc = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMoc(moc) {
        this._moc = moc;
        this._modelCount = 0;
        this._mocVersion = 0;
    }
    /**
     * Mocデータの作成
     */
    CubismMoc.create = function (mocBytes, shouldCheckMocConsistency) {
        var cubismMoc = null;
        if (shouldCheckMocConsistency) {
            // .moc3の整合性を確認
            var consistency = this.hasMocConsistency(mocBytes);
            if (!consistency) {
                // 整合性が確認できなければ処理しない
                (0, cubismdebug_1.CubismLogError)("Inconsistent MOC3.");
                return cubismMoc;
            }
        }
        var moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);
        if (moc) {
            cubismMoc = new CubismMoc(moc);
            cubismMoc._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(moc, mocBytes);
        }
        return cubismMoc;
    };
    /**
     * Mocデータを削除
     *
     * Mocデータを削除する
     */
    CubismMoc.delete = function (moc) {
        moc._moc._release();
        moc._moc = null;
        moc = null;
    };
    /**
     * モデルを作成する
     *
     * @return Mocデータから作成されたモデル
     */
    CubismMoc.prototype.createModel = function () {
        var cubismModel = null;
        var model = Live2DCubismCore.Model.fromMoc(this._moc);
        if (model) {
            cubismModel = new cubismmodel_1.CubismModel(model);
            cubismModel.initialize();
            ++this._modelCount;
        }
        return cubismModel;
    };
    /**
     * モデルを削除する
     */
    CubismMoc.prototype.deleteModel = function (model) {
        if (model != null) {
            model.release();
            model = null;
            --this._modelCount;
        }
    };
    /**
     * デストラクタ相当の処理
     */
    CubismMoc.prototype.release = function () {
        (0, cubismdebug_1.CSM_ASSERT)(this._modelCount == 0);
        this._moc._release();
        this._moc = null;
    };
    /**
     * 最新の.moc3 Versionを取得
     */
    CubismMoc.prototype.getLatestMocVersion = function () {
        return Live2DCubismCore.Version.csmGetLatestMocVersion();
    };
    /**
     * 読み込んだモデルの.moc3 Versionを取得
     */
    CubismMoc.prototype.getMocVersion = function () {
        return this._mocVersion;
    };
    /**
     * .moc3 の整合性を検証する
     */
    CubismMoc.hasMocConsistency = function (mocBytes) {
        var isConsistent = Live2DCubismCore.Moc.prototype.hasMocConsistency(mocBytes);
        return isConsistent === 1 ? true : false;
    };
    return CubismMoc;
}());
exports.CubismMoc = CubismMoc;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmoc */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMoc = $.CubismMoc;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodel.ts":
/*!**********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/model/cubismmodel.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismModel = exports.DrawableCullingData = exports.PartColorData = exports.DrawableColorData = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismrenderer_1 = __webpack_require__(/*! ../rendering/cubismrenderer */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts");
var csmmap_1 = __webpack_require__(/*! ../type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
/**
 * SDK側から与えられたDrawableの乗算色・スクリーン色上書きフラグと
 * その色を保持する構造体
 */
var DrawableColorData = /** @class */ (function () {
    function DrawableColorData(isOverwritten, color) {
        if (isOverwritten === void 0) { isOverwritten = false; }
        if (color === void 0) { color = new cubismrenderer_1.CubismTextureColor(); }
        this.isOverwritten = isOverwritten;
        this.Color = color;
    }
    return DrawableColorData;
}());
exports.DrawableColorData = DrawableColorData;
/**
 * @brief テクスチャの色をRGBAで扱うための構造体
 */
var PartColorData = /** @class */ (function () {
    function PartColorData(isOverwritten, color) {
        if (isOverwritten === void 0) { isOverwritten = false; }
        if (color === void 0) { color = new cubismrenderer_1.CubismTextureColor(); }
        this.isOverwritten = isOverwritten;
        this.Color = color;
    }
    return PartColorData;
}());
exports.PartColorData = PartColorData;
/**
 * テクスチャのカリング設定を管理するための構造体
 */
var DrawableCullingData = /** @class */ (function () {
    /**
     * コンストラクタ
     *
     * @param isOverwritten
     * @param isCulling
     */
    function DrawableCullingData(isOverwritten, isCulling) {
        if (isOverwritten === void 0) { isOverwritten = false; }
        if (isCulling === void 0) { isCulling = false; }
        this.isOverwritten = isOverwritten;
        this.isCulling = isCulling;
    }
    return DrawableCullingData;
}());
exports.DrawableCullingData = DrawableCullingData;
/**
 * モデル
 *
 * Mocデータから生成されるモデルのクラス。
 */
var CubismModel = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param model モデル
     */
    function CubismModel(model) {
        this._model = model;
        this._parameterValues = null;
        this._parameterMaximumValues = null;
        this._parameterMinimumValues = null;
        this._partOpacities = null;
        this._savedParameters = new csmvector_1.csmVector();
        this._parameterIds = new csmvector_1.csmVector();
        this._drawableIds = new csmvector_1.csmVector();
        this._partIds = new csmvector_1.csmVector();
        this._isOverwrittenModelMultiplyColors = false;
        this._isOverwrittenModelScreenColors = false;
        this._isOverwrittenCullings = false;
        this._modelOpacity = 1.0;
        this._userMultiplyColors = new csmvector_1.csmVector();
        this._userScreenColors = new csmvector_1.csmVector();
        this._userCullings = new csmvector_1.csmVector();
        this._userPartMultiplyColors = new csmvector_1.csmVector();
        this._userPartScreenColors = new csmvector_1.csmVector();
        this._partChildDrawables = new csmvector_1.csmVector();
        this._notExistPartId = new csmmap_1.csmMap();
        this._notExistParameterId = new csmmap_1.csmMap();
        this._notExistParameterValues = new csmmap_1.csmMap();
        this._notExistPartOpacities = new csmmap_1.csmMap();
    }
    /**
     * モデルのパラメータの更新
     */
    CubismModel.prototype.update = function () {
        // Update model
        this._model.update();
        this._model.drawables.resetDynamicFlags();
    };
    /**
     * PixelsPerUnitを取得する
     * @returns PixelsPerUnit
     */
    CubismModel.prototype.getPixelsPerUnit = function () {
        if (this._model == null) {
            return 0.0;
        }
        return this._model.canvasinfo.PixelsPerUnit;
    };
    /**
     * キャンバスの幅を取得する
     */
    CubismModel.prototype.getCanvasWidth = function () {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit);
    };
    /**
     * キャンバスの高さを取得する
     */
    CubismModel.prototype.getCanvasHeight = function () {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit);
    };
    /**
     * パラメータを保存する
     */
    CubismModel.prototype.saveParameters = function () {
        var parameterCount = this._model.parameters.count;
        var savedParameterCount = this._savedParameters.getSize();
        for (var i = 0; i < parameterCount; ++i) {
            if (i < savedParameterCount) {
                this._savedParameters.set(i, this._parameterValues[i]);
            }
            else {
                this._savedParameters.pushBack(this._parameterValues[i]);
            }
        }
    };
    /**
     * 乗算色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableの乗算色(RGBA)
     */
    CubismModel.prototype.getMultiplyColor = function (index) {
        // Drawableとモデル全体の乗算色上書きフラグがどちらもtrueな場合、モデル全体の上書きフラグが優先される
        if (this.getOverwriteFlagForModelMultiplyColors() ||
            this.getOverwriteFlagForDrawableMultiplyColors(index)) {
            return this._userMultiplyColors.at(index).Color;
        }
        var color = this.getDrawableMultiplyColor(index);
        return color;
    };
    /**
     * スクリーン色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableのスクリーン色(RGBA)
     */
    CubismModel.prototype.getScreenColor = function (index) {
        // Drawableとモデル全体のスクリーン色上書きフラグがどちらもtrueな場合、モデル全体の上書きフラグが優先される
        if (this.getOverwriteFlagForModelScreenColors() ||
            this.getOverwriteFlagForDrawableScreenColors(index)) {
            return this._userScreenColors.at(index).Color;
        }
        var color = this.getDrawableScreenColor(index);
        return color;
    };
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    CubismModel.prototype.setMultiplyColorByTextureColor = function (index, color) {
        this.setMultiplyColorByRGBA(index, color.R, color.G, color.B, color.A);
    };
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    CubismModel.prototype.setMultiplyColorByRGBA = function (index, r, g, b, a) {
        if (a === void 0) { a = 1.0; }
        this._userMultiplyColors.at(index).Color.R = r;
        this._userMultiplyColors.at(index).Color.G = g;
        this._userMultiplyColors.at(index).Color.B = b;
        this._userMultiplyColors.at(index).Color.A = a;
    };
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    CubismModel.prototype.setScreenColorByTextureColor = function (index, color) {
        this.setScreenColorByRGBA(index, color.R, color.G, color.B, color.A);
    };
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    CubismModel.prototype.setScreenColorByRGBA = function (index, r, g, b, a) {
        if (a === void 0) { a = 1.0; }
        this._userScreenColors.at(index).Color.R = r;
        this._userScreenColors.at(index).Color.G = g;
        this._userScreenColors.at(index).Color.B = b;
        this._userScreenColors.at(index).Color.A = a;
    };
    /**
     * partの乗算色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartの乗算色
     */
    CubismModel.prototype.getPartMultiplyColor = function (partIndex) {
        return this._userPartMultiplyColors.at(partIndex).Color;
    };
    /**
     * partのスクリーン色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartのスクリーン色
     */
    CubismModel.prototype.getPartScreenColor = function (partIndex) {
        return this._userPartScreenColors.at(partIndex).Color;
    };
    /**
     * partのOverwriteColor setter関数
     * @param partIndex partのインデックス
     * @param r 設定する色のR値
     * @param g 設定する色のG値
     * @param b 設定する色のB値
     * @param a 設定する色のA値
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    CubismModel.prototype.setPartColor = function (partIndex, r, g, b, a, partColors, drawableColors) {
        partColors.at(partIndex).Color.R = r;
        partColors.at(partIndex).Color.G = g;
        partColors.at(partIndex).Color.B = b;
        partColors.at(partIndex).Color.A = a;
        if (partColors.at(partIndex).isOverwritten) {
            for (var i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
                var drawableIndex = this._partChildDrawables.at(partIndex).at(i);
                drawableColors.at(drawableIndex).Color.R = r;
                drawableColors.at(drawableIndex).Color.G = g;
                drawableColors.at(drawableIndex).Color.B = b;
                drawableColors.at(drawableIndex).Color.A = a;
            }
        }
    };
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    CubismModel.prototype.setPartMultiplyColorByTextureColor = function (partIndex, color) {
        this.setPartMultiplyColorByRGBA(partIndex, color.R, color.G, color.B, color.A);
    };
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    CubismModel.prototype.setPartMultiplyColorByRGBA = function (partIndex, r, g, b, a) {
        this.setPartColor(partIndex, r, g, b, a, this._userPartMultiplyColors, this._userMultiplyColors);
    };
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    CubismModel.prototype.setPartScreenColorByTextureColor = function (partIndex, color) {
        this.setPartScreenColorByRGBA(partIndex, color.R, color.G, color.B, color.A);
    };
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    CubismModel.prototype.setPartScreenColorByRGBA = function (partIndex, r, g, b, a) {
        this.setPartColor(partIndex, r, g, b, a, this._userPartScreenColors, this._userScreenColors);
    };
    /**
     * SDKから指定したモデルの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteFlagForModelMultiplyColors = function () {
        return this._isOverwrittenModelMultiplyColors;
    };
    /**
     * SDKから指定したモデルのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteFlagForModelScreenColors = function () {
        return this._isOverwrittenModelScreenColors;
    };
    /**
     * SDKから指定したモデルの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteFlagForModelMultiplyColors = function (value) {
        this._isOverwrittenModelMultiplyColors = value;
    };
    /**
     * SDKから指定したモデルのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteFlagForModelScreenColors = function (value) {
        this._isOverwrittenModelScreenColors = value;
    };
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteFlagForDrawableMultiplyColors = function (drawableindex) {
        return this._userMultiplyColors.at(drawableindex).isOverwritten;
    };
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteFlagForDrawableScreenColors = function (drawableindex) {
        return this._userScreenColors.at(drawableindex).isOverwritten;
    };
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteFlagForDrawableMultiplyColors = function (drawableindex, value) {
        this._userMultiplyColors.at(drawableindex).isOverwritten = value;
    };
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteFlagForDrawableScreenColors = function (drawableindex, value) {
        this._userScreenColors.at(drawableindex).isOverwritten = value;
    };
    /**
     * SDKからpartの乗算色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteColorForPartMultiplyColors = function (partIndex) {
        return this._userPartMultiplyColors.at(partIndex).isOverwritten;
    };
    /**
     * SDKからpartのスクリーン色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    CubismModel.prototype.getOverwriteColorForPartScreenColors = function (partIndex) {
        return this._userPartScreenColors.at(partIndex).isOverwritten;
    };
    /**
     * partのOverwriteFlag setter関数
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    CubismModel.prototype.setOverwriteColorForPartColors = function (partIndex, value, partColors, drawableColors) {
        partColors.at(partIndex).isOverwritten = value;
        for (var i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
            var drawableIndex = this._partChildDrawables.at(partIndex).at(i);
            drawableColors.at(drawableIndex).isOverwritten = value;
            if (value) {
                drawableColors.at(drawableIndex).Color.R =
                    partColors.at(partIndex).Color.R;
                drawableColors.at(drawableIndex).Color.G =
                    partColors.at(partIndex).Color.G;
                drawableColors.at(drawableIndex).Color.B =
                    partColors.at(partIndex).Color.B;
                drawableColors.at(drawableIndex).Color.A =
                    partColors.at(partIndex).Color.A;
            }
        }
    };
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteColorForPartMultiplyColors = function (partIndex, value) {
        this._userPartMultiplyColors.at(partIndex).isOverwritten = value;
        this.setOverwriteColorForPartColors(partIndex, value, this._userPartMultiplyColors, this._userMultiplyColors);
    };
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    CubismModel.prototype.setOverwriteColorForPartScreenColors = function (partIndex, value) {
        this._userPartScreenColors.at(partIndex).isOverwritten = value;
        this.setOverwriteColorForPartColors(partIndex, value, this._userPartScreenColors, this._userScreenColors);
    };
    /**
     * Drawableのカリング情報を取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @return  Drawableのカリング情報
     */
    CubismModel.prototype.getDrawableCulling = function (drawableIndex) {
        if (this.getOverwriteFlagForModelCullings() ||
            this.getOverwriteFlagForDrawableCullings(drawableIndex)) {
            return this._userCullings.at(drawableIndex).isCulling;
        }
        var constantFlags = this._model.drawables.constantFlags;
        return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
    };
    /**
     * Drawableのカリング情報を設定する。
     *
     * @param drawableIndex Drawableのインデックス
     * @param isCulling カリング情報
     */
    CubismModel.prototype.setDrawableCulling = function (drawableIndex, isCulling) {
        this._userCullings.at(drawableIndex).isCulling = isCulling;
    };
    /**
     * SDKからモデル全体のカリング設定を上書きするか。
     *
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    CubismModel.prototype.getOverwriteFlagForModelCullings = function () {
        return this._isOverwrittenCullings;
    };
    /**
     * SDKからモデル全体のカリング設定を上書きするかを設定する。
     *
     * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    CubismModel.prototype.setOverwriteFlagForModelCullings = function (isOverwrittenCullings) {
        this._isOverwrittenCullings = isOverwrittenCullings;
    };
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    CubismModel.prototype.getOverwriteFlagForDrawableCullings = function (drawableIndex) {
        return this._userCullings.at(drawableIndex).isOverwritten;
    };
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    CubismModel.prototype.setOverwriteFlagForDrawableCullings = function (drawableIndex, isOverwrittenCullings) {
        this._userCullings.at(drawableIndex).isOverwritten = isOverwrittenCullings;
    };
    /**
     * モデルの不透明度を取得する
     *
     * @returns 不透明度の値
     */
    CubismModel.prototype.getModelOapcity = function () {
        return this._modelOpacity;
    };
    /**
     * モデルの不透明度を設定する
     *
     * @param value 不透明度の値
     */
    CubismModel.prototype.setModelOapcity = function (value) {
        this._modelOpacity = value;
    };
    /**
     * モデルを取得
     */
    CubismModel.prototype.getModel = function () {
        return this._model;
    };
    /**
     * パーツのインデックスを取得
     * @param partId パーツのID
     * @return パーツのインデックス
     */
    CubismModel.prototype.getPartIndex = function (partId) {
        var partIndex;
        var partCount = this._model.parts.count;
        for (partIndex = 0; partIndex < partCount; ++partIndex) {
            if (partId == this._partIds.at(partIndex)) {
                return partIndex;
            }
        }
        // モデルに存在していない場合、非存在パーツIDリスト内にあるかを検索し、そのインデックスを返す
        if (this._notExistPartId.isExist(partId)) {
            return this._notExistPartId.getValue(partId);
        }
        // 非存在パーツIDリストにない場合、新しく要素を追加する
        partIndex = partCount + this._notExistPartId.getSize();
        this._notExistPartId.setValue(partId, partIndex);
        this._notExistPartOpacities.appendKey(partIndex);
        return partIndex;
    };
    /**
     * パーツのIDを取得する。
     *
     * @param partIndex 取得するパーツのインデックス
     * @return パーツのID
     */
    CubismModel.prototype.getPartId = function (partIndex) {
        var partId = this._model.parts.ids[partIndex];
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(partId);
    };
    /**
     * パーツの個数の取得
     * @return パーツの個数
     */
    CubismModel.prototype.getPartCount = function () {
        var partCount = this._model.parts.count;
        return partCount;
    };
    /**
     * パーツの不透明度の設定(Index)
     * @param partIndex パーツのインデックス
     * @param opacity 不透明度
     */
    CubismModel.prototype.setPartOpacityByIndex = function (partIndex, opacity) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            this._notExistPartOpacities.setValue(partIndex, opacity);
            return;
        }
        // インデックスの範囲内検知
        (0, cubismdebug_1.CSM_ASSERT)(0 <= partIndex && partIndex < this.getPartCount());
        this._partOpacities[partIndex] = opacity;
    };
    /**
     * パーツの不透明度の設定(Id)
     * @param partId パーツのID
     * @param opacity パーツの不透明度
     */
    CubismModel.prototype.setPartOpacityById = function (partId, opacity) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        var index = this.getPartIndex(partId);
        if (index < 0) {
            return; // パーツがないのでスキップ
        }
        this.setPartOpacityByIndex(index, opacity);
    };
    /**
     * パーツの不透明度の取得(index)
     * @param partIndex パーツのインデックス
     * @return パーツの不透明度
     */
    CubismModel.prototype.getPartOpacityByIndex = function (partIndex) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            // モデルに存在しないパーツIDの場合、非存在パーツリストから不透明度を返す。
            return this._notExistPartOpacities.getValue(partIndex);
        }
        // インデックスの範囲内検知
        (0, cubismdebug_1.CSM_ASSERT)(0 <= partIndex && partIndex < this.getPartCount());
        return this._partOpacities[partIndex];
    };
    /**
     * パーツの不透明度の取得(id)
     * @param partId パーツのＩｄ
     * @return パーツの不透明度
     */
    CubismModel.prototype.getPartOpacityById = function (partId) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        var index = this.getPartIndex(partId);
        if (index < 0) {
            return 0; // パーツが無いのでスキップ
        }
        return this.getPartOpacityByIndex(index);
    };
    /**
     * パラメータのインデックスの取得
     * @param パラメータID
     * @return パラメータのインデックス
     */
    CubismModel.prototype.getParameterIndex = function (parameterId) {
        var parameterIndex;
        var idCount = this._model.parameters.count;
        for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
            if (parameterId != this._parameterIds.at(parameterIndex)) {
                continue;
            }
            return parameterIndex;
        }
        // モデルに存在していない場合、非存在パラメータIDリスト内を検索し、そのインデックスを返す
        if (this._notExistParameterId.isExist(parameterId)) {
            return this._notExistParameterId.getValue(parameterId);
        }
        // 非存在パラメータIDリストにない場合新しく要素を追加する
        parameterIndex =
            this._model.parameters.count + this._notExistParameterId.getSize();
        this._notExistParameterId.setValue(parameterId, parameterIndex);
        this._notExistParameterValues.appendKey(parameterIndex);
        return parameterIndex;
    };
    /**
     * パラメータの個数の取得
     * @return パラメータの個数
     */
    CubismModel.prototype.getParameterCount = function () {
        return this._model.parameters.count;
    };
    /**
     * パラメータの種類の取得
     * @param parameterIndex パラメータのインデックス
     * @return csmParameterType_Normal -> 通常のパラメータ
     *          csmParameterType_BlendShape -> ブレンドシェイプパラメータ
     */
    CubismModel.prototype.getParameterType = function (parameterIndex) {
        return this._model.parameters.types[parameterIndex];
    };
    /**
     * パラメータの最大値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最大値
     */
    CubismModel.prototype.getParameterMaximumValue = function (parameterIndex) {
        return this._model.parameters.maximumValues[parameterIndex];
    };
    /**
     * パラメータの最小値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最小値
     */
    CubismModel.prototype.getParameterMinimumValue = function (parameterIndex) {
        return this._model.parameters.minimumValues[parameterIndex];
    };
    /**
     * パラメータのデフォルト値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータのデフォルト値
     */
    CubismModel.prototype.getParameterDefaultValue = function (parameterIndex) {
        return this._model.parameters.defaultValues[parameterIndex];
    };
    /**
     * パラメータの値の取得
     * @param parameterIndex    パラメータのインデックス
     * @return パラメータの値
     */
    CubismModel.prototype.getParameterValueByIndex = function (parameterIndex) {
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            return this._notExistParameterValues.getValue(parameterIndex);
        }
        // インデックスの範囲内検知
        (0, cubismdebug_1.CSM_ASSERT)(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        return this._parameterValues[parameterIndex];
    };
    /**
     * パラメータの値の取得
     * @param parameterId    パラメータのID
     * @return パラメータの値
     */
    CubismModel.prototype.getParameterValueById = function (parameterId) {
        // 高速化のためにparameterIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        var parameterIndex = this.getParameterIndex(parameterId);
        return this.getParameterValueByIndex(parameterIndex);
    };
    /**
     * パラメータの値の設定
     * @param parameterIndex パラメータのインデックス
     * @param value パラメータの値
     * @param weight 重み
     */
    CubismModel.prototype.setParameterValueByIndex = function (parameterIndex, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            this._notExistParameterValues.setValue(parameterIndex, weight == 1
                ? value
                : this._notExistParameterValues.getValue(parameterIndex) *
                    (1 - weight) +
                    value * weight);
            return;
        }
        // インデックスの範囲内検知
        (0, cubismdebug_1.CSM_ASSERT)(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        if (this._model.parameters.maximumValues[parameterIndex] < value) {
            value = this._model.parameters.maximumValues[parameterIndex];
        }
        if (this._model.parameters.minimumValues[parameterIndex] > value) {
            value = this._model.parameters.minimumValues[parameterIndex];
        }
        this._parameterValues[parameterIndex] =
            weight == 1
                ? value
                : (this._parameterValues[parameterIndex] =
                    this._parameterValues[parameterIndex] * (1 - weight) +
                        value * weight);
    };
    /**
     * パラメータの値の設定
     * @param parameterId パラメータのID
     * @param value パラメータの値
     * @param weight 重み
     */
    CubismModel.prototype.setParameterValueById = function (parameterId, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        var index = this.getParameterIndex(parameterId);
        this.setParameterValueByIndex(index, value, weight);
    };
    /**
     * パラメータの値の加算(index)
     * @param parameterIndex パラメータインデックス
     * @param value 加算する値
     * @param weight 重み
     */
    CubismModel.prototype.addParameterValueByIndex = function (parameterIndex, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) + value * weight);
    };
    /**
     * パラメータの値の加算(id)
     * @param parameterId パラメータＩＤ
     * @param value 加算する値
     * @param weight 重み
     */
    CubismModel.prototype.addParameterValueById = function (parameterId, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        var index = this.getParameterIndex(parameterId);
        this.addParameterValueByIndex(index, value, weight);
    };
    /**
     * パラメータの値の乗算
     * @param parameterId パラメータのID
     * @param value 乗算する値
     * @param weight 重み
     */
    CubismModel.prototype.multiplyParameterValueById = function (parameterId, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        var index = this.getParameterIndex(parameterId);
        this.multiplyParameterValueByIndex(index, value, weight);
    };
    /**
     * パラメータの値の乗算
     * @param parameterIndex パラメータのインデックス
     * @param value 乗算する値
     * @param weight 重み
     */
    CubismModel.prototype.multiplyParameterValueByIndex = function (parameterIndex, value, weight) {
        if (weight === void 0) { weight = 1.0; }
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) *
            (1.0 + (value - 1.0) * weight));
    };
    /**
     * Drawableのインデックスの取得
     * @param drawableId DrawableのID
     * @return Drawableのインデックス
     */
    CubismModel.prototype.getDrawableIndex = function (drawableId) {
        var drawableCount = this._model.drawables.count;
        for (var drawableIndex = 0; drawableIndex < drawableCount; ++drawableIndex) {
            if (this._drawableIds.at(drawableIndex) == drawableId) {
                return drawableIndex;
            }
        }
        return -1;
    };
    /**
     * Drawableの個数の取得
     * @return drawableの個数
     */
    CubismModel.prototype.getDrawableCount = function () {
        var drawableCount = this._model.drawables.count;
        return drawableCount;
    };
    /**
     * DrawableのIDを取得する
     * @param drawableIndex Drawableのインデックス
     * @return drawableのID
     */
    CubismModel.prototype.getDrawableId = function (drawableIndex) {
        var parameterIds = this._model.drawables.ids;
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(parameterIds[drawableIndex]);
    };
    /**
     * Drawableの描画順リストの取得
     * @return Drawableの描画順リスト
     */
    CubismModel.prototype.getDrawableRenderOrders = function () {
        var renderOrders = this._model.drawables.renderOrders;
        return renderOrders;
    };
    /**
     * @deprecated
     * 関数名が誤っていたため、代替となる getDrawableTextureIndex を追加し、この関数は非推奨となりました。
     *
     * Drawableのテクスチャインデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックスリスト
     */
    CubismModel.prototype.getDrawableTextureIndices = function (drawableIndex) {
        return this.getDrawableTextureIndex(drawableIndex);
    };
    /**
     * Drawableのテクスチャインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックス
     */
    CubismModel.prototype.getDrawableTextureIndex = function (drawableIndex) {
        var textureIndices = this._model.drawables.textureIndices;
        return textureIndices[drawableIndex];
    };
    /**
     * DrawableのVertexPositionsの変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
     * @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
     */
    CubismModel.prototype.getDrawableDynamicFlagVertexPositionsDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
    };
    /**
     * Drawableの頂点インデックスの個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスの個数
     */
    CubismModel.prototype.getDrawableVertexIndexCount = function (drawableIndex) {
        var indexCounts = this._model.drawables.indexCounts;
        return indexCounts[drawableIndex];
    };
    /**
     * Drawableの頂点の個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点の個数
     */
    CubismModel.prototype.getDrawableVertexCount = function (drawableIndex) {
        var vertexCounts = this._model.drawables.vertexCounts;
        return vertexCounts[drawableIndex];
    };
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex drawableのインデックス
     * @return drawableの頂点リスト
     */
    CubismModel.prototype.getDrawableVertices = function (drawableIndex) {
        return this.getDrawableVertexPositions(drawableIndex);
    };
    /**
     * Drawableの頂点インデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスリスト
     */
    CubismModel.prototype.getDrawableVertexIndices = function (drawableIndex) {
        var indicesArray = this._model.drawables.indices;
        return indicesArray[drawableIndex];
    };
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点リスト
     */
    CubismModel.prototype.getDrawableVertexPositions = function (drawableIndex) {
        var verticesArray = this._model.drawables.vertexPositions;
        return verticesArray[drawableIndex];
    };
    /**
     * Drawableの頂点のUVリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点UVリスト
     */
    CubismModel.prototype.getDrawableVertexUvs = function (drawableIndex) {
        var uvsArray = this._model.drawables.vertexUvs;
        return uvsArray[drawableIndex];
    };
    /**
     * Drawableの不透明度の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの不透明度
     */
    CubismModel.prototype.getDrawableOpacity = function (drawableIndex) {
        var opacities = this._model.drawables.opacities;
        return opacities[drawableIndex];
    };
    /**
     * Drawableの乗算色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの乗算色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    CubismModel.prototype.getDrawableMultiplyColor = function (drawableIndex) {
        var multiplyColors = this._model.drawables.multiplyColors;
        var index = drawableIndex * 4;
        var multiplyColor = new cubismrenderer_1.CubismTextureColor();
        multiplyColor.R = multiplyColors[index];
        multiplyColor.G = multiplyColors[index + 1];
        multiplyColor.B = multiplyColors[index + 2];
        multiplyColor.A = multiplyColors[index + 3];
        return multiplyColor;
    };
    /**
     * Drawableのスクリーン色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのスクリーン色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    CubismModel.prototype.getDrawableScreenColor = function (drawableIndex) {
        var screenColors = this._model.drawables.screenColors;
        var index = drawableIndex * 4;
        var screenColor = new cubismrenderer_1.CubismTextureColor();
        screenColor.R = screenColors[index];
        screenColor.G = screenColors[index + 1];
        screenColor.B = screenColors[index + 2];
        screenColor.A = screenColors[index + 3];
        return screenColor;
    };
    /**
     * Drawableの親パーツのインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの親パーツのインデックス
     */
    CubismModel.prototype.getDrawableParentPartIndex = function (drawableIndex) {
        return this._model.drawables.parentPartIndices[drawableIndex];
    };
    /**
     * Drawableのブレンドモードを取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのブレンドモード
     */
    CubismModel.prototype.getDrawableBlendMode = function (drawableIndex) {
        var constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
            ? cubismrenderer_1.CubismBlendMode.CubismBlendMode_Additive
            : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                ? cubismrenderer_1.CubismBlendMode.CubismBlendMode_Multiplicative
                : cubismrenderer_1.CubismBlendMode.CubismBlendMode_Normal;
    };
    /**
     * Drawableのマスクの反転使用の取得
     *
     * Drawableのマスク使用時の反転設定を取得する。
     * マスクを使用しない場合は無視される。
     *
     * @param drawableIndex Drawableのインデックス
     * @return Drawableの反転設定
     */
    CubismModel.prototype.getDrawableInvertedMaskBit = function (drawableIndex) {
        var constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
    };
    /**
     * Drawableのクリッピングマスクリストの取得
     * @return Drawableのクリッピングマスクリスト
     */
    CubismModel.prototype.getDrawableMasks = function () {
        var masks = this._model.drawables.masks;
        return masks;
    };
    /**
     * Drawableのクリッピングマスクの個数リストの取得
     * @return Drawableのクリッピングマスクの個数リスト
     */
    CubismModel.prototype.getDrawableMaskCounts = function () {
        var maskCounts = this._model.drawables.maskCounts;
        return maskCounts;
    };
    /**
     * クリッピングマスクの使用状態
     *
     * @return true クリッピングマスクを使用している
     * @return false クリッピングマスクを使用していない
     */
    CubismModel.prototype.isUsingMasking = function () {
        for (var d = 0; d < this._model.drawables.count; ++d) {
            if (this._model.drawables.maskCounts[d] <= 0) {
                continue;
            }
            return true;
        }
        return false;
    };
    /**
     * Drawableの表示情報を取得する
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableが表示
     * @return false Drawableが非表示
     */
    CubismModel.prototype.getDrawableDynamicFlagIsVisible = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    };
    /**
     * DrawableのDrawOrderの変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
     * drawOrderはartMesh上で指定する0から1000の情報
     * @param drawableIndex drawableのインデックス
     * @return true drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false drawableの不透明度が直近のCubismModel.update関数で変化している
     */
    CubismModel.prototype.getDrawableDynamicFlagVisibilityDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(dynamicFlags[drawableIndex]);
    };
    /**
     * Drawableの不透明度の変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
     *
     * @param drawableIndex drawableのインデックス
     * @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
     */
    CubismModel.prototype.getDrawableDynamicFlagOpacityDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasOpacityDidChangeBit(dynamicFlags[drawableIndex]);
    };
    /**
     * Drawableの描画順序の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
     * @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
     */
    CubismModel.prototype.getDrawableDynamicFlagRenderOrderDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(dynamicFlags[drawableIndex]);
    };
    /**
     * Drawableの乗算色・スクリーン色の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの乗算色・スクリーン色が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化した
     * @return false Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化してない
     */
    CubismModel.prototype.getDrawableDynamicFlagBlendColorDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasBlendColorDidChangeBit(dynamicFlags[drawableIndex]);
    };
    /**
     * 保存されたパラメータの読み込み
     */
    CubismModel.prototype.loadParameters = function () {
        var parameterCount = this._model.parameters.count;
        var savedParameterCount = this._savedParameters.getSize();
        if (parameterCount > savedParameterCount) {
            parameterCount = savedParameterCount;
        }
        for (var i = 0; i < parameterCount; ++i) {
            this._parameterValues[i] = this._savedParameters.at(i);
        }
    };
    /**
     * 初期化する
     */
    CubismModel.prototype.initialize = function () {
        (0, cubismdebug_1.CSM_ASSERT)(this._model);
        this._parameterValues = this._model.parameters.values;
        this._partOpacities = this._model.parts.opacities;
        this._parameterMaximumValues = this._model.parameters.maximumValues;
        this._parameterMinimumValues = this._model.parameters.minimumValues;
        {
            var parameterIds = this._model.parameters.ids;
            var parameterCount = this._model.parameters.count;
            this._parameterIds.prepareCapacity(parameterCount);
            for (var i = 0; i < parameterCount; ++i) {
                this._parameterIds.pushBack(live2dcubismframework_1.CubismFramework.getIdManager().getId(parameterIds[i]));
            }
        }
        var partCount = this._model.parts.count;
        {
            var partIds = this._model.parts.ids;
            this._partIds.prepareCapacity(partCount);
            for (var i = 0; i < partCount; ++i) {
                this._partIds.pushBack(live2dcubismframework_1.CubismFramework.getIdManager().getId(partIds[i]));
            }
            this._userPartMultiplyColors.prepareCapacity(partCount);
            this._userPartScreenColors.prepareCapacity(partCount);
            this._partChildDrawables.prepareCapacity(partCount);
        }
        {
            var drawableIds = this._model.drawables.ids;
            var drawableCount = this._model.drawables.count;
            this._userMultiplyColors.prepareCapacity(drawableCount);
            this._userScreenColors.prepareCapacity(drawableCount);
            // カリング設定
            this._userCullings.prepareCapacity(drawableCount);
            var userCulling = new DrawableCullingData(false, false);
            // Part
            {
                for (var i = 0; i < partCount; ++i) {
                    var multiplyColor = new cubismrenderer_1.CubismTextureColor(1.0, 1.0, 1.0, 1.0);
                    var screenColor = new cubismrenderer_1.CubismTextureColor(0.0, 0.0, 0.0, 1.0);
                    var userMultiplyColor = new PartColorData(false, multiplyColor);
                    var userScreenColor = new PartColorData(false, screenColor);
                    this._userPartMultiplyColors.pushBack(userMultiplyColor);
                    this._userPartScreenColors.pushBack(userScreenColor);
                    this._partChildDrawables.pushBack(new csmvector_1.csmVector());
                    this._partChildDrawables.at(i).prepareCapacity(drawableCount);
                }
            }
            // Drawables
            {
                for (var i = 0; i < drawableCount; ++i) {
                    var multiplyColor = new cubismrenderer_1.CubismTextureColor(1.0, 1.0, 1.0, 1.0);
                    var screenColor = new cubismrenderer_1.CubismTextureColor(0.0, 0.0, 0.0, 1.0);
                    var userMultiplyColor = new DrawableColorData(false, multiplyColor);
                    var userScreenColor = new DrawableColorData(false, screenColor);
                    this._drawableIds.pushBack(live2dcubismframework_1.CubismFramework.getIdManager().getId(drawableIds[i]));
                    this._userMultiplyColors.pushBack(userMultiplyColor);
                    this._userScreenColors.pushBack(userScreenColor);
                    this._userCullings.pushBack(userCulling);
                    var parentIndex = this.getDrawableParentPartIndex(i);
                    if (parentIndex >= 0) {
                        this._partChildDrawables.at(parentIndex).pushBack(i);
                    }
                }
            }
        }
    };
    /**
     * デストラクタ相当の処理
     */
    CubismModel.prototype.release = function () {
        this._model.release();
        this._model = null;
    };
    return CubismModel;
}());
exports.CubismModel = CubismModel;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodel */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodel.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModel = $.CubismModel;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdata.ts":
/*!******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdata.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismModelUserData = exports.CubismModelUserDataNode = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmstring_1 = __webpack_require__(/*! ../type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismmodeluserdatajson_1 = __webpack_require__(/*! ./cubismmodeluserdatajson */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdatajson.ts");
var ArtMesh = 'ArtMesh';
/**
 * ユーザーデータインターフェース
 *
 * Jsonから読み込んだユーザーデータを記録しておくための構造体
 */
var CubismModelUserDataNode = /** @class */ (function () {
    function CubismModelUserDataNode() {
    }
    return CubismModelUserDataNode;
}());
exports.CubismModelUserDataNode = CubismModelUserDataNode;
/**
 * ユーザデータの管理クラス
 *
 * ユーザデータをロード、管理、検索インターフェイス、解放までを行う。
 */
var CubismModelUserData = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismModelUserData() {
        this._userDataNodes = new csmvector_1.csmVector();
        this._artMeshUserDataNode = new csmvector_1.csmVector();
    }
    /**
     * インスタンスの作成
     *
     * @param buffer    userdata3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     * @return 作成されたインスタンス
     */
    CubismModelUserData.create = function (buffer, size) {
        var ret = new CubismModelUserData();
        ret.parseUserData(buffer, size);
        return ret;
    };
    /**
     * インスタンスを破棄する
     *
     * @param modelUserData 破棄するインスタンス
     */
    CubismModelUserData.delete = function (modelUserData) {
        if (modelUserData != null) {
            modelUserData.release();
            modelUserData = null;
        }
    };
    /**
     * ArtMeshのユーザーデータのリストの取得
     *
     * @return ユーザーデータリスト
     */
    CubismModelUserData.prototype.getArtMeshUserDatas = function () {
        return this._artMeshUserDataNode;
    };
    /**
     * userdata3.jsonのパース
     *
     * @param buffer    userdata3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     */
    CubismModelUserData.prototype.parseUserData = function (buffer, size) {
        var json = new cubismmodeluserdatajson_1.CubismModelUserDataJson(buffer, size);
        var typeOfArtMesh = live2dcubismframework_1.CubismFramework.getIdManager().getId(ArtMesh);
        var nodeCount = json.getUserDataCount();
        for (var i = 0; i < nodeCount; i++) {
            var addNode = new CubismModelUserDataNode();
            addNode.targetId = json.getUserDataId(i);
            addNode.targetType = live2dcubismframework_1.CubismFramework.getIdManager().getId(json.getUserDataTargetType(i));
            addNode.value = new csmstring_1.csmString(json.getUserDataValue(i));
            this._userDataNodes.pushBack(addNode);
            if (addNode.targetType == typeOfArtMesh) {
                this._artMeshUserDataNode.pushBack(addNode);
            }
        }
        json.release();
        json = void 0;
    };
    /**
     * デストラクタ相当の処理
     *
     * ユーザーデータ構造体配列を解放する
     */
    CubismModelUserData.prototype.release = function () {
        for (var i = 0; i < this._userDataNodes.getSize(); ++i) {
            this._userDataNodes.set(i, null);
        }
        this._userDataNodes = null;
    };
    return CubismModelUserData;
}());
exports.CubismModelUserData = CubismModelUserData;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodeluserdata */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdata.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelUserData = $.CubismModelUserData;
    Live2DCubismFramework.CubismModelUserDataNode = $.CubismModelUserDataNode;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdatajson.ts":
/*!**********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdatajson.ts ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismModelUserDataJson = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismjson_1 = __webpack_require__(/*! ../utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
var Meta = 'Meta';
var UserDataCount = 'UserDataCount';
var TotalUserDataSize = 'TotalUserDataSize';
var UserData = 'UserData';
var Target = 'Target';
var Id = 'Id';
var Value = 'Value';
var CubismModelUserDataJson = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param buffer    userdata3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     */
    function CubismModelUserDataJson(buffer, size) {
        this._json = cubismjson_1.CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    CubismModelUserDataJson.prototype.release = function () {
        cubismjson_1.CubismJson.delete(this._json);
    };
    /**
     * ユーザーデータ個数の取得
     * @return ユーザーデータの個数
     */
    CubismModelUserDataJson.prototype.getUserDataCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(UserDataCount)
            .toInt();
    };
    /**
     * ユーザーデータ総文字列数の取得
     *
     * @return ユーザーデータ総文字列数
     */
    CubismModelUserDataJson.prototype.getTotalUserDataSize = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalUserDataSize)
            .toInt();
    };
    /**
     * ユーザーデータのタイプの取得
     *
     * @return ユーザーデータのタイプ
     */
    CubismModelUserDataJson.prototype.getUserDataTargetType = function (i) {
        return this._json
            .getRoot()
            .getValueByString(UserData)
            .getValueByIndex(i)
            .getValueByString(Target)
            .getRawString();
    };
    /**
     * ユーザーデータのターゲットIDの取得
     *
     * @param i インデックス
     * @return ユーザーデータターゲットID
     */
    CubismModelUserDataJson.prototype.getUserDataId = function (i) {
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(UserData)
            .getValueByIndex(i)
            .getValueByString(Id)
            .getRawString());
    };
    /**
     * ユーザーデータの文字列の取得
     *
     * @param i インデックス
     * @return ユーザーデータ
     */
    CubismModelUserDataJson.prototype.getUserDataValue = function (i) {
        return this._json
            .getRoot()
            .getValueByString(UserData)
            .getValueByIndex(i)
            .getValueByString(Value)
            .getRawString();
    };
    return CubismModelUserDataJson;
}());
exports.CubismModelUserDataJson = CubismModelUserDataJson;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodeluserdatajson */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdatajson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelUserDataJson = $.CubismModelUserDataJson;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/model/cubismusermodel.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/model/cubismusermodel.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismUserModel = void 0;
var cubismbreath_1 = __webpack_require__(/*! ../effect/cubismbreath */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismbreath.ts");
var cubismeyeblink_1 = __webpack_require__(/*! ../effect/cubismeyeblink */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismeyeblink.ts");
var cubismpose_1 = __webpack_require__(/*! ../effect/cubismpose */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismpose.ts");
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismmodelmatrix_1 = __webpack_require__(/*! ../math/cubismmodelmatrix */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmodelmatrix.ts");
var cubismtargetpoint_1 = __webpack_require__(/*! ../math/cubismtargetpoint */ "../../../../CubismSdkForWeb/Framework/src/math/cubismtargetpoint.ts");
var cubismexpressionmotion_1 = __webpack_require__(/*! ../motion/cubismexpressionmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismexpressionmotion.ts");
var cubismmotion_1 = __webpack_require__(/*! ../motion/cubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotion.ts");
var cubismmotionmanager_1 = __webpack_require__(/*! ../motion/cubismmotionmanager */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionmanager.ts");
var cubismphysics_1 = __webpack_require__(/*! ../physics/cubismphysics */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysics.ts");
var cubismrenderer_webgl_1 = __webpack_require__(/*! ../rendering/cubismrenderer_webgl */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer_webgl.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmoc_1 = __webpack_require__(/*! ./cubismmoc */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts");
var cubismmodeluserdata_1 = __webpack_require__(/*! ./cubismmodeluserdata */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmodeluserdata.ts");
/**
 * ユーザーが実際に使用するモデル
 *
 * ユーザーが実際に使用するモデルの基底クラス。これを継承してユーザーが実装する。
 */
var CubismUserModel = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismUserModel() {
        /**
         * モーションデータを読み込む
         * @param buffer motion3.jsonファイルが読み込まれているバッファ
         * @param size バッファのサイズ
         * @param name モーションの名前
         * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
         * @return モーションクラス
         */
        this.loadMotion = function (buffer, size, name, onFinishedMotionHandler) { return cubismmotion_1.CubismMotion.create(buffer, size, onFinishedMotionHandler); };
        // 各変数初期化
        this._moc = null;
        this._model = null;
        this._motionManager = null;
        this._expressionManager = null;
        this._eyeBlink = null;
        this._breath = null;
        this._modelMatrix = null;
        this._pose = null;
        this._dragManager = null;
        this._physics = null;
        this._modelUserData = null;
        this._initialized = false;
        this._updating = false;
        this._opacity = 1.0;
        this._lipsync = true;
        this._lastLipSyncValue = 0.0;
        this._dragX = 0.0;
        this._dragY = 0.0;
        this._accelerationX = 0.0;
        this._accelerationY = 0.0;
        this._accelerationZ = 0.0;
        this._mocConsistency = false;
        this._debugMode = false;
        this._renderer = null;
        // モーションマネージャーを作成
        this._motionManager = new cubismmotionmanager_1.CubismMotionManager();
        this._motionManager.setEventCallback(CubismUserModel.cubismDefaultMotionEventCallback, this);
        // 表情マネージャーを作成
        this._expressionManager = new cubismmotionmanager_1.CubismMotionManager();
        // ドラッグによるアニメーション
        this._dragManager = new cubismtargetpoint_1.CubismTargetPoint();
    }
    /**
     * 初期化状態の取得
     *
     * 初期化されている状態か？
     *
     * @return true     初期化されている
     * @return false    初期化されていない
     */
    CubismUserModel.prototype.isInitialized = function () {
        return this._initialized;
    };
    /**
     * 初期化状態の設定
     *
     * 初期化状態を設定する。
     *
     * @param v 初期化状態
     */
    CubismUserModel.prototype.setInitialized = function (v) {
        this._initialized = v;
    };
    /**
     * 更新状態の取得
     *
     * 更新されている状態か？
     *
     * @return true     更新されている
     * @return false    更新されていない
     */
    CubismUserModel.prototype.isUpdating = function () {
        return this._updating;
    };
    /**
     * 更新状態の設定
     *
     * 更新状態を設定する
     *
     * @param v 更新状態
     */
    CubismUserModel.prototype.setUpdating = function (v) {
        this._updating = v;
    };
    /**
     * マウスドラッグ情報の設定
     * @param ドラッグしているカーソルのX位置
     * @param ドラッグしているカーソルのY位置
     */
    CubismUserModel.prototype.setDragging = function (x, y) {
        this._dragManager.set(x, y);
    };
    /**
     * 加速度の情報を設定する
     * @param x X軸方向の加速度
     * @param y Y軸方向の加速度
     * @param z Z軸方向の加速度
     */
    CubismUserModel.prototype.setAcceleration = function (x, y, z) {
        this._accelerationX = x;
        this._accelerationY = y;
        this._accelerationZ = z;
    };
    /**
     * モデル行列を取得する
     * @return モデル行列
     */
    CubismUserModel.prototype.getModelMatrix = function () {
        return this._modelMatrix;
    };
    /**
     * 不透明度の設定
     * @param a 不透明度
     */
    CubismUserModel.prototype.setOpacity = function (a) {
        this._opacity = a;
    };
    /**
     * 不透明度の取得
     * @return 不透明度
     */
    CubismUserModel.prototype.getOpacity = function () {
        return this._opacity;
    };
    /**
     * モデルデータを読み込む
     *
     * @param buffer    moc3ファイルが読み込まれているバッファ
     */
    CubismUserModel.prototype.loadModel = function (buffer, shouldCheckMocConsistency) {
        if (shouldCheckMocConsistency === void 0) { shouldCheckMocConsistency = false; }
        this._moc = cubismmoc_1.CubismMoc.create(buffer, shouldCheckMocConsistency);
        if (this._moc == null) {
            (0, cubismdebug_1.CubismLogError)('Failed to CubismMoc.create().');
            return;
        }
        this._model = this._moc.createModel();
        if (this._model == null) {
            (0, cubismdebug_1.CubismLogError)('Failed to CreateModel().');
            return;
        }
        this._model.saveParameters();
        this._modelMatrix = new cubismmodelmatrix_1.CubismModelMatrix(this._model.getCanvasWidth(), this._model.getCanvasHeight());
    };
    /**
     * 表情データの読み込み
     * @param buffer expファイルが読み込まれているバッファ
     * @param size バッファのサイズ
     * @param name 表情の名前
     */
    CubismUserModel.prototype.loadExpression = function (buffer, size, name) {
        return cubismexpressionmotion_1.CubismExpressionMotion.create(buffer, size);
    };
    /**
     * ポーズデータの読み込み
     * @param buffer pose3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    CubismUserModel.prototype.loadPose = function (buffer, size) {
        this._pose = cubismpose_1.CubismPose.create(buffer, size);
    };
    /**
     * モデルに付属するユーザーデータを読み込む
     * @param buffer userdata3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    CubismUserModel.prototype.loadUserData = function (buffer, size) {
        this._modelUserData = cubismmodeluserdata_1.CubismModelUserData.create(buffer, size);
    };
    /**
     * 物理演算データの読み込み
     * @param buffer  physics3.jsonが読み込まれているバッファ
     * @param size    バッファのサイズ
     */
    CubismUserModel.prototype.loadPhysics = function (buffer, size) {
        this._physics = cubismphysics_1.CubismPhysics.create(buffer, size);
    };
    /**
     * 当たり判定の取得
     * @param drawableId 検証したいDrawableのID
     * @param pointX X位置
     * @param pointY Y位置
     * @return true ヒットしている
     * @return false ヒットしていない
     */
    CubismUserModel.prototype.isHit = function (drawableId, pointX, pointY) {
        var drawIndex = this._model.getDrawableIndex(drawableId);
        if (drawIndex < 0) {
            return false; // 存在しない場合はfalse
        }
        var count = this._model.getDrawableVertexCount(drawIndex);
        var vertices = this._model.getDrawableVertices(drawIndex);
        var left = vertices[0];
        var right = vertices[0];
        var top = vertices[1];
        var bottom = vertices[1];
        for (var j = 1; j < count; ++j) {
            var x = vertices[live2dcubismframework_1.Constant.vertexOffset + j * live2dcubismframework_1.Constant.vertexStep];
            var y = vertices[live2dcubismframework_1.Constant.vertexOffset + j * live2dcubismframework_1.Constant.vertexStep + 1];
            if (x < left) {
                left = x; // Min x
            }
            if (x > right) {
                right = x; // Max x
            }
            if (y < top) {
                top = y; // Min y
            }
            if (y > bottom) {
                bottom = y; // Max y
            }
        }
        var tx = this._modelMatrix.invertTransformX(pointX);
        var ty = this._modelMatrix.invertTransformY(pointY);
        return left <= tx && tx <= right && top <= ty && ty <= bottom;
    };
    /**
     * モデルの取得
     * @return モデル
     */
    CubismUserModel.prototype.getModel = function () {
        return this._model;
    };
    /**
     * レンダラの取得
     * @return レンダラ
     */
    CubismUserModel.prototype.getRenderer = function () {
        return this._renderer;
    };
    /**
     * レンダラを作成して初期化を実行する
     * @param maskBufferCount バッファの生成数
     */
    CubismUserModel.prototype.createRenderer = function (maskBufferCount) {
        if (maskBufferCount === void 0) { maskBufferCount = 1; }
        if (this._renderer) {
            this.deleteRenderer();
        }
        this._renderer = new cubismrenderer_webgl_1.CubismRenderer_WebGL();
        this._renderer.initialize(this._model, maskBufferCount);
    };
    /**
     * レンダラの解放
     */
    CubismUserModel.prototype.deleteRenderer = function () {
        if (this._renderer != null) {
            this._renderer.release();
            this._renderer = null;
        }
    };
    /**
     * イベント発火時の標準処理
     *
     * Eventが再生処理時にあった場合の処理をする。
     * 継承で上書きすることを想定している。
     * 上書きしない場合はログ出力をする。
     *
     * @param eventValue 発火したイベントの文字列データ
     */
    CubismUserModel.prototype.motionEventFired = function (eventValue) {
        (0, cubismdebug_1.CubismLogInfo)('{0}', eventValue.s);
    };
    /**
     * イベント用のコールバック
     *
     * CubismMotionQueueManagerにイベント用に登録するためのCallback。
     * CubismUserModelの継承先のEventFiredを呼ぶ。
     *
     * @param caller 発火したイベントを管理していたモーションマネージャー、比較用
     * @param eventValue 発火したイベントの文字列データ
     * @param customData CubismUserModelを継承したインスタンスを想定
     */
    CubismUserModel.cubismDefaultMotionEventCallback = function (caller, eventValue, customData) {
        var model = customData;
        if (model != null) {
            model.motionEventFired(eventValue);
        }
    };
    /**
     * デストラクタに相当する処理
     */
    CubismUserModel.prototype.release = function () {
        if (this._motionManager != null) {
            this._motionManager.release();
            this._motionManager = null;
        }
        if (this._expressionManager != null) {
            this._expressionManager.release();
            this._expressionManager = null;
        }
        if (this._moc != null) {
            this._moc.deleteModel(this._model);
            this._moc.release();
            this._moc = null;
        }
        this._modelMatrix = null;
        cubismpose_1.CubismPose.delete(this._pose);
        cubismeyeblink_1.CubismEyeBlink.delete(this._eyeBlink);
        cubismbreath_1.CubismBreath.delete(this._breath);
        this._dragManager = null;
        cubismphysics_1.CubismPhysics.delete(this._physics);
        cubismmodeluserdata_1.CubismModelUserData.delete(this._modelUserData);
        this.deleteRenderer();
    };
    return CubismUserModel;
}());
exports.CubismUserModel = CubismUserModel;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismusermodel */ "../../../../CubismSdkForWeb/Framework/src/model/cubismusermodel.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismUserModel = $.CubismUserModel;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts":
/*!*************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.ACubismMotion = void 0;
var cubismmath_1 = __webpack_require__(/*! ../math/cubismmath */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
/**
 * モーションの抽象基底クラス
 *
 * モーションの抽象基底クラス。MotionQueueManagerによってモーションの再生を管理する。
 */
var ACubismMotion = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function ACubismMotion() {
        var _this = this;
        /**
         * モーション再生終了コールバックの登録
         *
         * モーション再生終了コールバックを登録する。
         * isFinishedフラグを設定するタイミングで呼び出される。
         * 以下の状態の際には呼び出されない:
         *   1. 再生中のモーションが「ループ」として設定されているとき
         *   2. コールバックが登録されていない時
         *
         * @param onFinishedMotionHandler モーション再生終了コールバック関数
         */
        this.setFinishedMotionHandler = function (onFinishedMotionHandler) { return (_this._onFinishedMotion = onFinishedMotionHandler); };
        /**
         * モーション再生終了コールバックの取得
         *
         * モーション再生終了コールバックを取得する。
         *
         * @return 登録されているモーション再生終了コールバック関数
         */
        this.getFinishedMotionHandler = function () { return _this._onFinishedMotion; };
        this._fadeInSeconds = -1.0;
        this._fadeOutSeconds = -1.0;
        this._weight = 1.0;
        this._offsetSeconds = 0.0; // 再生の開始時刻
        this._firedEventValues = new csmvector_1.csmVector();
    }
    /**
     * インスタンスの破棄
     */
    ACubismMotion.delete = function (motion) {
        motion.release();
        motion = null;
    };
    /**
     * デストラクタ相当の処理
     */
    ACubismMotion.prototype.release = function () {
        this._weight = 0.0;
    };
    /**
     * モデルのパラメータ
     * @param model 対象のモデル
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     * @param userTimeSeconds デルタ時間の積算値[秒]
     */
    ACubismMotion.prototype.updateParameters = function (model, motionQueueEntry, userTimeSeconds) {
        if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
            return;
        }
        if (!motionQueueEntry.isStarted()) {
            motionQueueEntry.setIsStarted(true);
            motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds); // モーションの開始時刻を記録
            motionQueueEntry.setFadeInStartTime(userTimeSeconds); // フェードインの開始時刻
            var duration = this.getDuration();
            if (motionQueueEntry.getEndTime() < 0) {
                // 開始していないうちに終了設定している場合がある。
                motionQueueEntry.setEndTime(duration <= 0 ? -1 : motionQueueEntry.getStartTime() + duration);
                // duration == -1 の場合はループする
            }
        }
        var fadeWeight = this._weight; // 現在の値と掛け合わせる割合
        //---- フェードイン・アウトの処理 ----
        // 単純なサイン関数でイージングする
        var fadeIn = this._fadeInSeconds == 0.0
            ? 1.0
            : cubismmath_1.CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                this._fadeInSeconds);
        var fadeOut = this._fadeOutSeconds == 0.0 || motionQueueEntry.getEndTime() < 0.0
            ? 1.0
            : cubismmath_1.CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                this._fadeOutSeconds);
        fadeWeight = fadeWeight * fadeIn * fadeOut;
        motionQueueEntry.setState(userTimeSeconds, fadeWeight);
        (0, cubismdebug_1.CSM_ASSERT)(0.0 <= fadeWeight && fadeWeight <= 1.0);
        //---- 全てのパラメータIDをループする ----
        this.doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry);
        // 後処理
        // 終了時刻を過ぎたら終了フラグを立てる(CubismMotionQueueManager)
        if (motionQueueEntry.getEndTime() > 0 &&
            motionQueueEntry.getEndTime() < userTimeSeconds) {
            motionQueueEntry.setIsFinished(true); // 終了
        }
    };
    /**
     * フェードインの時間を設定する
     * @param fadeInSeconds フェードインにかかる時間[秒]
     */
    ACubismMotion.prototype.setFadeInTime = function (fadeInSeconds) {
        this._fadeInSeconds = fadeInSeconds;
    };
    /**
     * フェードアウトの時間を設定する
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     */
    ACubismMotion.prototype.setFadeOutTime = function (fadeOutSeconds) {
        this._fadeOutSeconds = fadeOutSeconds;
    };
    /**
     * フェードアウトにかかる時間の取得
     * @return フェードアウトにかかる時間[秒]
     */
    ACubismMotion.prototype.getFadeOutTime = function () {
        return this._fadeOutSeconds;
    };
    /**
     * フェードインにかかる時間の取得
     * @return フェードインにかかる時間[秒]
     */
    ACubismMotion.prototype.getFadeInTime = function () {
        return this._fadeInSeconds;
    };
    /**
     * モーション適用の重みの設定
     * @param weight 重み（0.0 - 1.0）
     */
    ACubismMotion.prototype.setWeight = function (weight) {
        this._weight = weight;
    };
    /**
     * モーション適用の重みの取得
     * @return 重み（0.0 - 1.0）
     */
    ACubismMotion.prototype.getWeight = function () {
        return this._weight;
    };
    /**
     * モーションの長さの取得
     * @return モーションの長さ[秒]
     *
     * @note ループの時は「-1」。
     *       ループでない場合は、オーバーライドする。
     *       正の値の時は取得される時間で終了する。
     *       「-1」の時は外部から停止命令がない限り終わらない処理となる。
     */
    ACubismMotion.prototype.getDuration = function () {
        return -1.0;
    };
    /**
     * モーションのループ1回分の長さの取得
     * @return モーションのループ一回分の長さ[秒]
     *
     * @note ループしない場合は、getDuration()と同じ値を返す
     *       ループ一回分の長さが定義できない場合(プログラム的に動き続けるサブクラスなど)の場合は「-1」を返す
     */
    ACubismMotion.prototype.getLoopDuration = function () {
        return -1.0;
    };
    /**
     * モーション再生の開始時刻の設定
     * @param offsetSeconds モーション再生の開始時刻[秒]
     */
    ACubismMotion.prototype.setOffsetTime = function (offsetSeconds) {
        this._offsetSeconds = offsetSeconds;
    };
    /**
     * モデルのパラメータ更新
     *
     * イベント発火のチェック。
     * 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
     *
     * @param beforeCheckTimeSeconds 前回のイベントチェック時間[秒]
     * @param motionTimeSeconds 今回の再生時間[秒]
     */
    ACubismMotion.prototype.getFiredEvent = function (beforeCheckTimeSeconds, motionTimeSeconds) {
        return this._firedEventValues;
    };
    /**
     * 透明度のカーブが存在するかどうかを確認する
     *
     * @returns true  -> キーが存在する
     *          false -> キーが存在しない
     */
    ACubismMotion.prototype.isExistModelOpacity = function () {
        return false;
    };
    /**
     * 透明度のカーブのインデックスを返す
     *
     * @returns success:透明度のカーブのインデックス
     */
    ACubismMotion.prototype.getModelOpacityIndex = function () {
        return -1;
    };
    /**
     * 透明度のIdを返す
     *
     * @param index モーションカーブのインデックス
     * @returns success:透明度のId
     */
    ACubismMotion.prototype.getModelOpacityId = function (index) {
        return null;
    };
    /**
     * 指定時間の透明度の値を返す
     *
     * @returns success:モーションの現在時間におけるOpacityの値
     *
     * @note  更新後の値を取るにはUpdateParameters() の後に呼び出す。
     */
    ACubismMotion.prototype.getModelOpacityValue = function () {
        return 1.0;
    };
    return ACubismMotion;
}());
exports.ACubismMotion = ACubismMotion;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./acubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.ACubismMotion = $.ACubismMotion;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismexpressionmotion.ts":
/*!**********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismexpressionmotion.ts ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.ExpressionParameter = exports.ExpressionBlendType = exports.CubismExpressionMotion = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismjson_1 = __webpack_require__(/*! ../utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
var acubismmotion_1 = __webpack_require__(/*! ./acubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts");
// exp3.jsonのキーとデフォルト
var ExpressionKeyFadeIn = 'FadeInTime';
var ExpressionKeyFadeOut = 'FadeOutTime';
var ExpressionKeyParameters = 'Parameters';
var ExpressionKeyId = 'Id';
var ExpressionKeyValue = 'Value';
var ExpressionKeyBlend = 'Blend';
var BlendValueAdd = 'Add';
var BlendValueMultiply = 'Multiply';
var BlendValueOverwrite = 'Overwrite';
var DefaultFadeTime = 1.0;
/**
 * 表情のモーション
 *
 * 表情のモーションクラス。
 */
var CubismExpressionMotion = /** @class */ (function (_super) {
    __extends(CubismExpressionMotion, _super);
    /**
     * コンストラクタ
     */
    function CubismExpressionMotion() {
        var _this = _super.call(this) || this;
        _this._parameters = new csmvector_1.csmVector();
        return _this;
    }
    /**
     * インスタンスを作成する。
     * @param buffer expファイルが読み込まれているバッファ
     * @param size バッファのサイズ
     * @return 作成されたインスタンス
     */
    CubismExpressionMotion.create = function (buffer, size) {
        var expression = new CubismExpressionMotion();
        expression.parse(buffer, size);
        return expression;
    };
    /**
     * モデルのパラメータの更新の実行
     * @param model 対象のモデル
     * @param userTimeSeconds デルタ時間の積算値[秒]
     * @param weight モーションの重み
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     */
    CubismExpressionMotion.prototype.doUpdateParameters = function (model, userTimeSeconds, weight, motionQueueEntry) {
        for (var i = 0; i < this._parameters.getSize(); ++i) {
            var parameter = this._parameters.at(i);
            switch (parameter.blendType) {
                case ExpressionBlendType.ExpressionBlendType_Add: {
                    model.addParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                case ExpressionBlendType.ExpressionBlendType_Multiply: {
                    model.multiplyParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                case ExpressionBlendType.ExpressionBlendType_Overwrite: {
                    model.setParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                default:
                    // 仕様にない値を設定した時はすでに加算モードになっている
                    break;
            }
        }
    };
    CubismExpressionMotion.prototype.parse = function (buffer, size) {
        var json = cubismjson_1.CubismJson.create(buffer, size);
        var root = json.getRoot();
        this.setFadeInTime(root.getValueByString(ExpressionKeyFadeIn).toFloat(DefaultFadeTime)); // フェードイン
        this.setFadeOutTime(root.getValueByString(ExpressionKeyFadeOut).toFloat(DefaultFadeTime)); // フェードアウト
        // 各パラメータについて
        var parameterCount = root
            .getValueByString(ExpressionKeyParameters)
            .getSize();
        this._parameters.prepareCapacity(parameterCount);
        for (var i = 0; i < parameterCount; ++i) {
            var param = root
                .getValueByString(ExpressionKeyParameters)
                .getValueByIndex(i);
            var parameterId = live2dcubismframework_1.CubismFramework.getIdManager().getId(param.getValueByString(ExpressionKeyId).getRawString()); // パラメータID
            var value = param
                .getValueByString(ExpressionKeyValue)
                .toFloat(); // 値
            // 計算方法の設定
            var blendType = void 0;
            if (param.getValueByString(ExpressionKeyBlend).isNull() ||
                param.getValueByString(ExpressionKeyBlend).getString() == BlendValueAdd) {
                blendType = ExpressionBlendType.ExpressionBlendType_Add;
            }
            else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                BlendValueMultiply) {
                blendType = ExpressionBlendType.ExpressionBlendType_Multiply;
            }
            else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                BlendValueOverwrite) {
                blendType = ExpressionBlendType.ExpressionBlendType_Overwrite;
            }
            else {
                // その他 仕様にない値を設定した時は加算モードにすることで復旧
                blendType = ExpressionBlendType.ExpressionBlendType_Add;
            }
            // 設定オブジェクトを作成してリストに追加する
            var item = new ExpressionParameter();
            item.parameterId = parameterId;
            item.blendType = blendType;
            item.value = value;
            this._parameters.pushBack(item);
        }
        cubismjson_1.CubismJson.delete(json); // JSONデータは不要になったら削除する
    };
    return CubismExpressionMotion;
}(acubismmotion_1.ACubismMotion));
exports.CubismExpressionMotion = CubismExpressionMotion;
/**
 * 表情パラメータ値の計算方式
 */
var ExpressionBlendType;
(function (ExpressionBlendType) {
    ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Add"] = 0] = "ExpressionBlendType_Add";
    ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Multiply"] = 1] = "ExpressionBlendType_Multiply";
    ExpressionBlendType[ExpressionBlendType["ExpressionBlendType_Overwrite"] = 2] = "ExpressionBlendType_Overwrite";
})(ExpressionBlendType || (exports.ExpressionBlendType = ExpressionBlendType = {}));
/**
 * 表情のパラメータ情報
 */
var ExpressionParameter = /** @class */ (function () {
    function ExpressionParameter() {
    }
    return ExpressionParameter;
}());
exports.ExpressionParameter = ExpressionParameter;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismexpressionmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismexpressionmotion.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismExpressionMotion = $.CubismExpressionMotion;
    Live2DCubismFramework.ExpressionBlendType = $.ExpressionBlendType;
    Live2DCubismFramework.ExpressionParameter = $.ExpressionParameter;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotion.ts":
/*!************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotion.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMotion = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismmath_1 = __webpack_require__(/*! ../math/cubismmath */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts");
var csmstring_1 = __webpack_require__(/*! ../type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var acubismmotion_1 = __webpack_require__(/*! ./acubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts");
var cubismmotioninternal_1 = __webpack_require__(/*! ./cubismmotioninternal */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotioninternal.ts");
var cubismmotionjson_1 = __webpack_require__(/*! ./cubismmotionjson */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionjson.ts");
var EffectNameEyeBlink = 'EyeBlink';
var EffectNameLipSync = 'LipSync';
var TargetNameModel = 'Model';
var TargetNameParameter = 'Parameter';
var TargetNamePartOpacity = 'PartOpacity';
// Id
var IdNameOpacity = 'Opacity';
/**
 * Cubism SDK R2 以前のモーションを再現させるなら true 、アニメータのモーションを正しく再現するなら false 。
 */
var UseOldBeziersCurveMotion = false;
function lerpPoints(a, b, t) {
    var result = new cubismmotioninternal_1.CubismMotionPoint();
    result.time = a.time + (b.time - a.time) * t;
    result.value = a.value + (b.value - a.value) * t;
    return result;
}
function linearEvaluate(points, time) {
    var t = (time - points[0].time) / (points[1].time - points[0].time);
    if (t < 0.0) {
        t = 0.0;
    }
    return points[0].value + (points[1].value - points[0].value) * t;
}
function bezierEvaluate(points, time) {
    var t = (time - points[0].time) / (points[3].time - points[0].time);
    if (t < 0.0) {
        t = 0.0;
    }
    var p01 = lerpPoints(points[0], points[1], t);
    var p12 = lerpPoints(points[1], points[2], t);
    var p23 = lerpPoints(points[2], points[3], t);
    var p012 = lerpPoints(p01, p12, t);
    var p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
}
function bezierEvaluateBinarySearch(points, time) {
    var x_error = 0.01;
    var x = time;
    var x1 = points[0].time;
    var x2 = points[3].time;
    var cx1 = points[1].time;
    var cx2 = points[2].time;
    var ta = 0.0;
    var tb = 1.0;
    var t = 0.0;
    var i = 0;
    for (var var33 = true; i < 20; ++i) {
        if (x < x1 + x_error) {
            t = ta;
            break;
        }
        if (x2 - x_error < x) {
            t = tb;
            break;
        }
        var centerx = (cx1 + cx2) * 0.5;
        cx1 = (x1 + cx1) * 0.5;
        cx2 = (x2 + cx2) * 0.5;
        var ctrlx12 = (cx1 + centerx) * 0.5;
        var ctrlx21 = (cx2 + centerx) * 0.5;
        centerx = (ctrlx12 + ctrlx21) * 0.5;
        if (x < centerx) {
            tb = (ta + tb) * 0.5;
            if (centerx - x_error < x) {
                t = tb;
                break;
            }
            x2 = centerx;
            cx2 = ctrlx12;
        }
        else {
            ta = (ta + tb) * 0.5;
            if (x < centerx + x_error) {
                t = ta;
                break;
            }
            x1 = centerx;
            cx1 = ctrlx21;
        }
    }
    if (i == 20) {
        t = (ta + tb) * 0.5;
    }
    if (t < 0.0) {
        t = 0.0;
    }
    if (t > 1.0) {
        t = 1.0;
    }
    var p01 = lerpPoints(points[0], points[1], t);
    var p12 = lerpPoints(points[1], points[2], t);
    var p23 = lerpPoints(points[2], points[3], t);
    var p012 = lerpPoints(p01, p12, t);
    var p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
}
function bezierEvaluateCardanoInterpretation(points, time) {
    var x = time;
    var x1 = points[0].time;
    var x2 = points[3].time;
    var cx1 = points[1].time;
    var cx2 = points[2].time;
    var a = x2 - 3.0 * cx2 + 3.0 * cx1 - x1;
    var b = 3.0 * cx2 - 6.0 * cx1 + 3.0 * x1;
    var c = 3.0 * cx1 - 3.0 * x1;
    var d = x1 - x;
    var t = cubismmath_1.CubismMath.cardanoAlgorithmForBezier(a, b, c, d);
    var p01 = lerpPoints(points[0], points[1], t);
    var p12 = lerpPoints(points[1], points[2], t);
    var p23 = lerpPoints(points[2], points[3], t);
    var p012 = lerpPoints(p01, p12, t);
    var p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
}
function steppedEvaluate(points, time) {
    return points[0].value;
}
function inverseSteppedEvaluate(points, time) {
    return points[1].value;
}
function evaluateCurve(motionData, index, time) {
    // Find segment to evaluate.
    var curve = motionData.curves.at(index);
    var target = -1;
    var totalSegmentCount = curve.baseSegmentIndex + curve.segmentCount;
    var pointPosition = 0;
    for (var i = curve.baseSegmentIndex; i < totalSegmentCount; ++i) {
        // Get first point of next segment.
        pointPosition =
            motionData.segments.at(i).basePointIndex +
                (motionData.segments.at(i).segmentType ==
                    cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Bezier
                    ? 3
                    : 1);
        // Break if time lies within current segment.
        if (motionData.points.at(pointPosition).time > time) {
            target = i;
            break;
        }
    }
    if (target == -1) {
        return motionData.points.at(pointPosition).value;
    }
    var segment = motionData.segments.at(target);
    return segment.evaluate(motionData.points.get(segment.basePointIndex), time);
}
/**
 * モーションクラス
 *
 * モーションのクラス。
 */
var CubismMotion = /** @class */ (function (_super) {
    __extends(CubismMotion, _super);
    /**
     * コンストラクタ
     */
    function CubismMotion() {
        var _this = _super.call(this) || this;
        _this._sourceFrameRate = 30.0;
        _this._loopDurationSeconds = -1.0;
        _this._isLoop = false; // trueから false へデフォルトを変更
        _this._isLoopFadeIn = true; // ループ時にフェードインが有効かどうかのフラグ
        _this._lastWeight = 0.0;
        _this._motionData = null;
        _this._modelCurveIdEyeBlink = null;
        _this._modelCurveIdLipSync = null;
        _this._modelCurveIdOpacity = null;
        _this._eyeBlinkParameterIds = null;
        _this._lipSyncParameterIds = null;
        _this._modelOpacity = 1.0;
        return _this;
    }
    /**
     * インスタンスを作成する
     *
     * @param buffer motion3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @return 作成されたインスタンス
     */
    CubismMotion.create = function (buffer, size, onFinishedMotionHandler) {
        var ret = new CubismMotion();
        ret.parse(buffer, size);
        ret._sourceFrameRate = ret._motionData.fps;
        ret._loopDurationSeconds = ret._motionData.duration;
        ret._onFinishedMotion = onFinishedMotionHandler;
        // NOTE: Editorではループありのモーション書き出しは非対応
        // ret->_loop = (ret->_motionData->Loop > 0);
        return ret;
    };
    /**
     * モデルのパラメータの更新の実行
     * @param model             対象のモデル
     * @param userTimeSeconds   現在の時刻[秒]
     * @param fadeWeight        モーションの重み
     * @param motionQueueEntry  CubismMotionQueueManagerで管理されているモーション
     */
    CubismMotion.prototype.doUpdateParameters = function (model, userTimeSeconds, fadeWeight, motionQueueEntry) {
        if (this._modelCurveIdEyeBlink == null) {
            this._modelCurveIdEyeBlink =
                live2dcubismframework_1.CubismFramework.getIdManager().getId(EffectNameEyeBlink);
        }
        if (this._modelCurveIdLipSync == null) {
            this._modelCurveIdLipSync =
                live2dcubismframework_1.CubismFramework.getIdManager().getId(EffectNameLipSync);
        }
        if (this._modelCurveIdOpacity == null) {
            this._modelCurveIdOpacity =
                live2dcubismframework_1.CubismFramework.getIdManager().getId(IdNameOpacity);
        }
        var timeOffsetSeconds = userTimeSeconds - motionQueueEntry.getStartTime();
        if (timeOffsetSeconds < 0.0) {
            timeOffsetSeconds = 0.0; // エラー回避
        }
        var lipSyncValue = Number.MAX_VALUE;
        var eyeBlinkValue = Number.MAX_VALUE;
        //まばたき、リップシンクのうちモーションの適用を検出するためのビット（maxFlagCount個まで
        var MaxTargetSize = 64;
        var lipSyncFlags = 0;
        var eyeBlinkFlags = 0;
        //瞬き、リップシンクのターゲット数が上限を超えている場合
        if (this._eyeBlinkParameterIds.getSize() > MaxTargetSize) {
            (0, cubismdebug_1.CubismLogDebug)('too many eye blink targets : {0}', this._eyeBlinkParameterIds.getSize());
        }
        if (this._lipSyncParameterIds.getSize() > MaxTargetSize) {
            (0, cubismdebug_1.CubismLogDebug)('too many lip sync targets : {0}', this._lipSyncParameterIds.getSize());
        }
        var tmpFadeIn = this._fadeInSeconds <= 0.0
            ? 1.0
            : cubismmath_1.CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                this._fadeInSeconds);
        var tmpFadeOut = this._fadeOutSeconds <= 0.0 || motionQueueEntry.getEndTime() < 0.0
            ? 1.0
            : cubismmath_1.CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                this._fadeOutSeconds);
        var value;
        var c, parameterIndex;
        // 'Repeat' time as necessary.
        var time = timeOffsetSeconds;
        if (this._isLoop) {
            while (time > this._motionData.duration) {
                time -= this._motionData.duration;
            }
        }
        var curves = this._motionData.curves;
        // Evaluate model curves.
        for (c = 0; c < this._motionData.curveCount &&
            curves.at(c).type ==
                cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Model; ++c) {
            // Evaluate curve and call handler.
            value = evaluateCurve(this._motionData, c, time);
            if (curves.at(c).id == this._modelCurveIdEyeBlink) {
                eyeBlinkValue = value;
            }
            else if (curves.at(c).id == this._modelCurveIdLipSync) {
                lipSyncValue = value;
            }
            else if (curves.at(c).id == this._modelCurveIdOpacity) {
                this._modelOpacity = value;
                model.setModelOapcity(this.getModelOpacityValue());
            }
        }
        var parameterMotionCurveCount = 0;
        for (; c < this._motionData.curveCount &&
            curves.at(c).type ==
                cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter; ++c) {
            parameterMotionCurveCount++;
            // Find parameter index.
            parameterIndex = model.getParameterIndex(curves.at(c).id);
            // Skip curve evaluation if no value in sink.
            if (parameterIndex == -1) {
                continue;
            }
            var sourceValue = model.getParameterValueByIndex(parameterIndex);
            // Evaluate curve and apply value.
            value = evaluateCurve(this._motionData, c, time);
            if (eyeBlinkValue != Number.MAX_VALUE) {
                for (var i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                    if (this._eyeBlinkParameterIds.at(i) == curves.at(c).id) {
                        value *= eyeBlinkValue;
                        eyeBlinkFlags |= 1 << i;
                        break;
                    }
                }
            }
            if (lipSyncValue != Number.MAX_VALUE) {
                for (var i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                    if (this._lipSyncParameterIds.at(i) == curves.at(c).id) {
                        value += lipSyncValue;
                        lipSyncFlags |= 1 << i;
                        break;
                    }
                }
            }
            var v = void 0;
            // パラメータごとのフェード
            if (curves.at(c).fadeInTime < 0.0 && curves.at(c).fadeOutTime < 0.0) {
                // モーションのフェードを適用
                v = sourceValue + (value - sourceValue) * fadeWeight;
            }
            else {
                // パラメータに対してフェードインかフェードアウトが設定してある場合はそちらを適用
                var fin = void 0;
                var fout = void 0;
                if (curves.at(c).fadeInTime < 0.0) {
                    fin = tmpFadeIn;
                }
                else {
                    fin =
                        curves.at(c).fadeInTime == 0.0
                            ? 1.0
                            : cubismmath_1.CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                                curves.at(c).fadeInTime);
                }
                if (curves.at(c).fadeOutTime < 0.0) {
                    fout = tmpFadeOut;
                }
                else {
                    fout =
                        curves.at(c).fadeOutTime == 0.0 ||
                            motionQueueEntry.getEndTime() < 0.0
                            ? 1.0
                            : cubismmath_1.CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                                curves.at(c).fadeOutTime);
                }
                var paramWeight = this._weight * fin * fout;
                // パラメータごとのフェードを適用
                v = sourceValue + (value - sourceValue) * paramWeight;
            }
            model.setParameterValueByIndex(parameterIndex, v, 1.0);
        }
        {
            if (eyeBlinkValue != Number.MAX_VALUE) {
                for (var i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                    var sourceValue = model.getParameterValueById(this._eyeBlinkParameterIds.at(i));
                    // モーションでの上書きがあった時にはまばたきは適用しない
                    if ((eyeBlinkFlags >> i) & 0x01) {
                        continue;
                    }
                    var v = sourceValue + (eyeBlinkValue - sourceValue) * fadeWeight;
                    model.setParameterValueById(this._eyeBlinkParameterIds.at(i), v);
                }
            }
            if (lipSyncValue != Number.MAX_VALUE) {
                for (var i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                    var sourceValue = model.getParameterValueById(this._lipSyncParameterIds.at(i));
                    // モーションでの上書きがあった時にはリップシンクは適用しない
                    if ((lipSyncFlags >> i) & 0x01) {
                        continue;
                    }
                    var v = sourceValue + (lipSyncValue - sourceValue) * fadeWeight;
                    model.setParameterValueById(this._lipSyncParameterIds.at(i), v);
                }
            }
        }
        for (; c < this._motionData.curveCount &&
            curves.at(c).type ==
                cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity; ++c) {
            // Find parameter index.
            parameterIndex = model.getParameterIndex(curves.at(c).id);
            // Skip curve evaluation if no value in sink.
            if (parameterIndex == -1) {
                continue;
            }
            // Evaluate curve and apply value.
            value = evaluateCurve(this._motionData, c, time);
            model.setParameterValueByIndex(parameterIndex, value);
        }
        if (timeOffsetSeconds >= this._motionData.duration) {
            if (this._isLoop) {
                motionQueueEntry.setStartTime(userTimeSeconds); // 最初の状態へ
                if (this._isLoopFadeIn) {
                    // ループ内でループ用フェードインが有効の時は、フェードイン設定し直し
                    motionQueueEntry.setFadeInStartTime(userTimeSeconds);
                }
            }
            else {
                if (this._onFinishedMotion) {
                    this._onFinishedMotion(this);
                }
                motionQueueEntry.setIsFinished(true);
            }
        }
        this._lastWeight = fadeWeight;
    };
    /**
     * ループ情報の設定
     * @param loop ループ情報
     */
    CubismMotion.prototype.setIsLoop = function (loop) {
        this._isLoop = loop;
    };
    /**
     * ループ情報の取得
     * @return true ループする
     * @return false ループしない
     */
    CubismMotion.prototype.isLoop = function () {
        return this._isLoop;
    };
    /**
     * ループ時のフェードイン情報の設定
     * @param loopFadeIn  ループ時のフェードイン情報
     */
    CubismMotion.prototype.setIsLoopFadeIn = function (loopFadeIn) {
        this._isLoopFadeIn = loopFadeIn;
    };
    /**
     * ループ時のフェードイン情報の取得
     *
     * @return  true    する
     * @return  false   しない
     */
    CubismMotion.prototype.isLoopFadeIn = function () {
        return this._isLoopFadeIn;
    };
    /**
     * モーションの長さを取得する。
     *
     * @return  モーションの長さ[秒]
     */
    CubismMotion.prototype.getDuration = function () {
        return this._isLoop ? -1.0 : this._loopDurationSeconds;
    };
    /**
     * モーションのループ時の長さを取得する。
     *
     * @return  モーションのループ時の長さ[秒]
     */
    CubismMotion.prototype.getLoopDuration = function () {
        return this._loopDurationSeconds;
    };
    /**
     * パラメータに対するフェードインの時間を設定する。
     *
     * @param parameterId     パラメータID
     * @param value           フェードインにかかる時間[秒]
     */
    CubismMotion.prototype.setParameterFadeInTime = function (parameterId, value) {
        var curves = this._motionData.curves;
        for (var i = 0; i < this._motionData.curveCount; ++i) {
            if (parameterId == curves.at(i).id) {
                curves.at(i).fadeInTime = value;
                return;
            }
        }
    };
    /**
     * パラメータに対するフェードアウトの時間の設定
     * @param parameterId     パラメータID
     * @param value           フェードアウトにかかる時間[秒]
     */
    CubismMotion.prototype.setParameterFadeOutTime = function (parameterId, value) {
        var curves = this._motionData.curves;
        for (var i = 0; i < this._motionData.curveCount; ++i) {
            if (parameterId == curves.at(i).id) {
                curves.at(i).fadeOutTime = value;
                return;
            }
        }
    };
    /**
     * パラメータに対するフェードインの時間の取得
     * @param    parameterId     パラメータID
     * @return   フェードインにかかる時間[秒]
     */
    CubismMotion.prototype.getParameterFadeInTime = function (parameterId) {
        var curves = this._motionData.curves;
        for (var i = 0; i < this._motionData.curveCount; ++i) {
            if (parameterId == curves.at(i).id) {
                return curves.at(i).fadeInTime;
            }
        }
        return -1;
    };
    /**
     * パラメータに対するフェードアウトの時間を取得
     *
     * @param   parameterId     パラメータID
     * @return   フェードアウトにかかる時間[秒]
     */
    CubismMotion.prototype.getParameterFadeOutTime = function (parameterId) {
        var curves = this._motionData.curves;
        for (var i = 0; i < this._motionData.curveCount; ++i) {
            if (parameterId == curves.at(i).id) {
                return curves.at(i).fadeOutTime;
            }
        }
        return -1;
    };
    /**
     * 自動エフェクトがかかっているパラメータIDリストの設定
     * @param eyeBlinkParameterIds    自動まばたきがかかっているパラメータIDのリスト
     * @param lipSyncParameterIds     リップシンクがかかっているパラメータIDのリスト
     */
    CubismMotion.prototype.setEffectIds = function (eyeBlinkParameterIds, lipSyncParameterIds) {
        this._eyeBlinkParameterIds = eyeBlinkParameterIds;
        this._lipSyncParameterIds = lipSyncParameterIds;
    };
    /**
     * デストラクタ相当の処理
     */
    CubismMotion.prototype.release = function () {
        this._motionData = void 0;
        this._motionData = null;
    };
    /**
     * motion3.jsonをパースする。
     *
     * @param motionJson  motion3.jsonが読み込まれているバッファ
     * @param size        バッファのサイズ
     */
    CubismMotion.prototype.parse = function (motionJson, size) {
        this._motionData = new cubismmotioninternal_1.CubismMotionData();
        var json = new cubismmotionjson_1.CubismMotionJson(motionJson, size);
        this._motionData.duration = json.getMotionDuration();
        this._motionData.loop = json.isMotionLoop();
        this._motionData.curveCount = json.getMotionCurveCount();
        this._motionData.fps = json.getMotionFps();
        this._motionData.eventCount = json.getEventCount();
        var areBeziersRestructed = json.getEvaluationOptionFlag(cubismmotionjson_1.EvaluationOptionFlag.EvaluationOptionFlag_AreBeziersRistricted);
        if (json.isExistMotionFadeInTime()) {
            this._fadeInSeconds =
                json.getMotionFadeInTime() < 0.0 ? 1.0 : json.getMotionFadeInTime();
        }
        else {
            this._fadeInSeconds = 1.0;
        }
        if (json.isExistMotionFadeOutTime()) {
            this._fadeOutSeconds =
                json.getMotionFadeOutTime() < 0.0 ? 1.0 : json.getMotionFadeOutTime();
        }
        else {
            this._fadeOutSeconds = 1.0;
        }
        this._motionData.curves.updateSize(this._motionData.curveCount, cubismmotioninternal_1.CubismMotionCurve, true);
        this._motionData.segments.updateSize(json.getMotionTotalSegmentCount(), cubismmotioninternal_1.CubismMotionSegment, true);
        this._motionData.points.updateSize(json.getMotionTotalPointCount(), cubismmotioninternal_1.CubismMotionPoint, true);
        this._motionData.events.updateSize(this._motionData.eventCount, cubismmotioninternal_1.CubismMotionEvent, true);
        var totalPointCount = 0;
        var totalSegmentCount = 0;
        // Curves
        for (var curveCount = 0; curveCount < this._motionData.curveCount; ++curveCount) {
            if (json.getMotionCurveTarget(curveCount) == TargetNameModel) {
                this._motionData.curves.at(curveCount).type =
                    cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
            }
            else if (json.getMotionCurveTarget(curveCount) == TargetNameParameter) {
                this._motionData.curves.at(curveCount).type =
                    cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter;
            }
            else if (json.getMotionCurveTarget(curveCount) == TargetNamePartOpacity) {
                this._motionData.curves.at(curveCount).type =
                    cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity;
            }
            else {
                (0, cubismdebug_1.CubismLogWarning)('Warning : Unable to get segment type from Curve! The number of "CurveCount" may be incorrect!');
            }
            this._motionData.curves.at(curveCount).id =
                json.getMotionCurveId(curveCount);
            this._motionData.curves.at(curveCount).baseSegmentIndex =
                totalSegmentCount;
            this._motionData.curves.at(curveCount).fadeInTime =
                json.isExistMotionCurveFadeInTime(curveCount)
                    ? json.getMotionCurveFadeInTime(curveCount)
                    : -1.0;
            this._motionData.curves.at(curveCount).fadeOutTime =
                json.isExistMotionCurveFadeOutTime(curveCount)
                    ? json.getMotionCurveFadeOutTime(curveCount)
                    : -1.0;
            // Segments
            for (var segmentPosition = 0; segmentPosition < json.getMotionCurveSegmentCount(curveCount);) {
                if (segmentPosition == 0) {
                    this._motionData.segments.at(totalSegmentCount).basePointIndex =
                        totalPointCount;
                    this._motionData.points.at(totalPointCount).time =
                        json.getMotionCurveSegment(curveCount, segmentPosition);
                    this._motionData.points.at(totalPointCount).value =
                        json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                    totalPointCount += 1;
                    segmentPosition += 2;
                }
                else {
                    this._motionData.segments.at(totalSegmentCount).basePointIndex =
                        totalPointCount - 1;
                }
                var segment = json.getMotionCurveSegment(curveCount, segmentPosition);
                switch (segment) {
                    case cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Linear: {
                        this._motionData.segments.at(totalSegmentCount).segmentType =
                            cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Linear;
                        this._motionData.segments.at(totalSegmentCount).evaluate =
                            linearEvaluate;
                        this._motionData.points.at(totalPointCount).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                        this._motionData.points.at(totalPointCount).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                        totalPointCount += 1;
                        segmentPosition += 3;
                        break;
                    }
                    case cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Bezier: {
                        this._motionData.segments.at(totalSegmentCount).segmentType =
                            cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Bezier;
                        if (areBeziersRestructed || UseOldBeziersCurveMotion) {
                            this._motionData.segments.at(totalSegmentCount).evaluate =
                                bezierEvaluate;
                        }
                        else {
                            this._motionData.segments.at(totalSegmentCount).evaluate =
                                bezierEvaluateCardanoInterpretation;
                        }
                        this._motionData.points.at(totalPointCount).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                        this._motionData.points.at(totalPointCount).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                        this._motionData.points.at(totalPointCount + 1).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 3);
                        this._motionData.points.at(totalPointCount + 1).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 4);
                        this._motionData.points.at(totalPointCount + 2).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 5);
                        this._motionData.points.at(totalPointCount + 2).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 6);
                        totalPointCount += 3;
                        segmentPosition += 7;
                        break;
                    }
                    case cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Stepped: {
                        this._motionData.segments.at(totalSegmentCount).segmentType =
                            cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_Stepped;
                        this._motionData.segments.at(totalSegmentCount).evaluate =
                            steppedEvaluate;
                        this._motionData.points.at(totalPointCount).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                        this._motionData.points.at(totalPointCount).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                        totalPointCount += 1;
                        segmentPosition += 3;
                        break;
                    }
                    case cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped: {
                        this._motionData.segments.at(totalSegmentCount).segmentType =
                            cubismmotioninternal_1.CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped;
                        this._motionData.segments.at(totalSegmentCount).evaluate =
                            inverseSteppedEvaluate;
                        this._motionData.points.at(totalPointCount).time =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                        this._motionData.points.at(totalPointCount).value =
                            json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                        totalPointCount += 1;
                        segmentPosition += 3;
                        break;
                    }
                    default: {
                        (0, cubismdebug_1.CSM_ASSERT)(0);
                        break;
                    }
                }
                ++this._motionData.curves.at(curveCount).segmentCount;
                ++totalSegmentCount;
            }
        }
        for (var userdatacount = 0; userdatacount < json.getEventCount(); ++userdatacount) {
            this._motionData.events.at(userdatacount).fireTime =
                json.getEventTime(userdatacount);
            this._motionData.events.at(userdatacount).value =
                json.getEventValue(userdatacount);
        }
        json.release();
        json = void 0;
        json = null;
    };
    /**
     * モデルのパラメータ更新
     *
     * イベント発火のチェック。
     * 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
     *
     * @param beforeCheckTimeSeconds   前回のイベントチェック時間[秒]
     * @param motionTimeSeconds        今回の再生時間[秒]
     */
    CubismMotion.prototype.getFiredEvent = function (beforeCheckTimeSeconds, motionTimeSeconds) {
        this._firedEventValues.updateSize(0);
        // イベントの発火チェック
        for (var u = 0; u < this._motionData.eventCount; ++u) {
            if (this._motionData.events.at(u).fireTime > beforeCheckTimeSeconds &&
                this._motionData.events.at(u).fireTime <= motionTimeSeconds) {
                this._firedEventValues.pushBack(new csmstring_1.csmString(this._motionData.events.at(u).value.s));
            }
        }
        return this._firedEventValues;
    };
    /**
     * 透明度のカーブが存在するかどうかを確認する
     *
     * @returns true  -> キーが存在する
     *          false -> キーが存在しない
     */
    CubismMotion.prototype.isExistModelOpacity = function () {
        for (var i = 0; i < this._motionData.curveCount; i++) {
            var curve = this._motionData.curves.at(i);
            if (curve.type != cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
                continue;
            }
            if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
                return true;
            }
        }
        return false;
    };
    /**
     * 透明度のカーブのインデックスを返す
     *
     * @returns success:透明度のカーブのインデックス
     */
    CubismMotion.prototype.getModelOpacityIndex = function () {
        if (this.isExistModelOpacity()) {
            for (var i = 0; i < this._motionData.curveCount; i++) {
                var curve = this._motionData.curves.at(i);
                if (curve.type != cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
                    continue;
                }
                if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
                    return i;
                }
            }
        }
        return -1;
    };
    /**
     * 透明度のIdを返す
     *
     * @param index モーションカーブのインデックス
     * @returns success:透明度のカーブのインデックス
     */
    CubismMotion.prototype.getModelOpacityId = function (index) {
        if (index != -1) {
            var curve = this._motionData.curves.at(index);
            if (curve.type == cubismmotioninternal_1.CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
                if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
                    return live2dcubismframework_1.CubismFramework.getIdManager().getId(curve.id.getString().s);
                }
            }
        }
        return null;
    };
    /**
     * 現在時間の透明度の値を返す
     *
     * @returns success:モーションの当該時間におけるOpacityの値
     */
    CubismMotion.prototype.getModelOpacityValue = function () {
        return this._modelOpacity;
    };
    return CubismMotion;
}(acubismmotion_1.ACubismMotion));
exports.CubismMotion = CubismMotion;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotion.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotion = $.CubismMotion;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotioninternal.ts":
/*!********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotioninternal.ts ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMotionData = exports.CubismMotionEvent = exports.CubismMotionCurve = exports.CubismMotionSegment = exports.CubismMotionPoint = exports.CubismMotionSegmentType = exports.CubismMotionCurveTarget = void 0;
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
/**
 * @brief モーションカーブの種類
 *
 * モーションカーブの種類。
 */
var CubismMotionCurveTarget;
(function (CubismMotionCurveTarget) {
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Model"] = 0] = "CubismMotionCurveTarget_Model";
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Parameter"] = 1] = "CubismMotionCurveTarget_Parameter";
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_PartOpacity"] = 2] = "CubismMotionCurveTarget_PartOpacity";
})(CubismMotionCurveTarget || (exports.CubismMotionCurveTarget = CubismMotionCurveTarget = {}));
/**
 * @brief モーションカーブのセグメントの種類
 *
 * モーションカーブのセグメントの種類。
 */
var CubismMotionSegmentType;
(function (CubismMotionSegmentType) {
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Linear"] = 0] = "CubismMotionSegmentType_Linear";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Bezier"] = 1] = "CubismMotionSegmentType_Bezier";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Stepped"] = 2] = "CubismMotionSegmentType_Stepped";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_InverseStepped"] = 3] = "CubismMotionSegmentType_InverseStepped";
})(CubismMotionSegmentType || (exports.CubismMotionSegmentType = CubismMotionSegmentType = {}));
/**
 * @brief モーションカーブの制御点
 *
 * モーションカーブの制御点。
 */
var CubismMotionPoint = /** @class */ (function () {
    function CubismMotionPoint() {
        this.time = 0.0; // 時間[秒]
        this.value = 0.0; // 値
    }
    return CubismMotionPoint;
}());
exports.CubismMotionPoint = CubismMotionPoint;
/**
 * @brief モーションカーブのセグメント
 *
 * モーションカーブのセグメント。
 */
var CubismMotionSegment = /** @class */ (function () {
    /**
     * @brief コンストラクタ
     *
     * コンストラクタ。
     */
    function CubismMotionSegment() {
        this.evaluate = null;
        this.basePointIndex = 0;
        this.segmentType = 0;
    }
    return CubismMotionSegment;
}());
exports.CubismMotionSegment = CubismMotionSegment;
/**
 * @brief モーションカーブ
 *
 * モーションカーブ。
 */
var CubismMotionCurve = /** @class */ (function () {
    function CubismMotionCurve() {
        this.type = CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
        this.segmentCount = 0;
        this.baseSegmentIndex = 0;
        this.fadeInTime = 0.0;
        this.fadeOutTime = 0.0;
    }
    return CubismMotionCurve;
}());
exports.CubismMotionCurve = CubismMotionCurve;
/**
 * イベント。
 */
var CubismMotionEvent = /** @class */ (function () {
    function CubismMotionEvent() {
        this.fireTime = 0.0;
    }
    return CubismMotionEvent;
}());
exports.CubismMotionEvent = CubismMotionEvent;
/**
 * @brief モーションデータ
 *
 * モーションデータ。
 */
var CubismMotionData = /** @class */ (function () {
    function CubismMotionData() {
        this.duration = 0.0;
        this.loop = false;
        this.curveCount = 0;
        this.eventCount = 0;
        this.fps = 0.0;
        this.curves = new csmvector_1.csmVector();
        this.segments = new csmvector_1.csmVector();
        this.points = new csmvector_1.csmVector();
        this.events = new csmvector_1.csmVector();
    }
    return CubismMotionData;
}());
exports.CubismMotionData = CubismMotionData;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotioninternal */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotioninternal.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionCurve = $.CubismMotionCurve;
    Live2DCubismFramework.CubismMotionCurveTarget = $.CubismMotionCurveTarget;
    Live2DCubismFramework.CubismMotionData = $.CubismMotionData;
    Live2DCubismFramework.CubismMotionEvent = $.CubismMotionEvent;
    Live2DCubismFramework.CubismMotionPoint = $.CubismMotionPoint;
    Live2DCubismFramework.CubismMotionSegment = $.CubismMotionSegment;
    Live2DCubismFramework.CubismMotionSegmentType = $.CubismMotionSegmentType;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionjson.ts":
/*!****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionjson.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.EvaluationOptionFlag = exports.CubismMotionJson = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmstring_1 = __webpack_require__(/*! ../type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var cubismjson_1 = __webpack_require__(/*! ../utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
// JSON keys
var Meta = 'Meta';
var Duration = 'Duration';
var Loop = 'Loop';
var AreBeziersRestricted = 'AreBeziersRestricted';
var CurveCount = 'CurveCount';
var Fps = 'Fps';
var TotalSegmentCount = 'TotalSegmentCount';
var TotalPointCount = 'TotalPointCount';
var Curves = 'Curves';
var Target = 'Target';
var Id = 'Id';
var FadeInTime = 'FadeInTime';
var FadeOutTime = 'FadeOutTime';
var Segments = 'Segments';
var UserData = 'UserData';
var UserDataCount = 'UserDataCount';
var TotalUserDataSize = 'TotalUserDataSize';
var Time = 'Time';
var Value = 'Value';
/**
 * motion3.jsonのコンテナ。
 */
var CubismMotionJson = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param buffer motion3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    function CubismMotionJson(buffer, size) {
        this._json = cubismjson_1.CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    CubismMotionJson.prototype.release = function () {
        cubismjson_1.CubismJson.delete(this._json);
    };
    /**
     * モーションの長さを取得する
     * @return モーションの長さ[秒]
     */
    CubismMotionJson.prototype.getMotionDuration = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Duration)
            .toFloat();
    };
    /**
     * モーションのループ情報の取得
     * @return true ループする
     * @return false ループしない
     */
    CubismMotionJson.prototype.isMotionLoop = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Loop)
            .toBoolean();
    };
    CubismMotionJson.prototype.getEvaluationOptionFlag = function (flagType) {
        if (EvaluationOptionFlag.EvaluationOptionFlag_AreBeziersRistricted == flagType) {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(AreBeziersRestricted)
                .toBoolean();
        }
        return false;
    };
    /**
     * モーションカーブの個数の取得
     * @return モーションカーブの個数
     */
    CubismMotionJson.prototype.getMotionCurveCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(CurveCount)
            .toInt();
    };
    /**
     * モーションのフレームレートの取得
     * @return フレームレート[FPS]
     */
    CubismMotionJson.prototype.getMotionFps = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Fps)
            .toFloat();
    };
    /**
     * モーションのセグメントの総合計の取得
     * @return モーションのセグメントの取得
     */
    CubismMotionJson.prototype.getMotionTotalSegmentCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalSegmentCount)
            .toInt();
    };
    /**
     * モーションのカーブの制御店の総合計の取得
     * @return モーションのカーブの制御点の総合計
     */
    CubismMotionJson.prototype.getMotionTotalPointCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalPointCount)
            .toInt();
    };
    /**
     * モーションのフェードイン時間の存在
     * @return true 存在する
     * @return false 存在しない
     */
    CubismMotionJson.prototype.isExistMotionFadeInTime = function () {
        return !this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(FadeInTime)
            .isNull();
    };
    /**
     * モーションのフェードアウト時間の存在
     * @return true 存在する
     * @return false 存在しない
     */
    CubismMotionJson.prototype.isExistMotionFadeOutTime = function () {
        return !this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(FadeOutTime)
            .isNull();
    };
    /**
     * モーションのフェードイン時間の取得
     * @return フェードイン時間[秒]
     */
    CubismMotionJson.prototype.getMotionFadeInTime = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(FadeInTime)
            .toFloat();
    };
    /**
     * モーションのフェードアウト時間の取得
     * @return フェードアウト時間[秒]
     */
    CubismMotionJson.prototype.getMotionFadeOutTime = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(FadeOutTime)
            .toFloat();
    };
    /**
     * モーションのカーブの種類の取得
     * @param curveIndex カーブのインデックス
     * @return カーブの種類
     */
    CubismMotionJson.prototype.getMotionCurveTarget = function (curveIndex) {
        return this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(Target)
            .getRawString();
    };
    /**
     * モーションのカーブのIDの取得
     * @param curveIndex カーブのインデックス
     * @return カーブのID
     */
    CubismMotionJson.prototype.getMotionCurveId = function (curveIndex) {
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(Id)
            .getRawString());
    };
    /**
     * モーションのカーブのフェードイン時間の存在
     * @param curveIndex カーブのインデックス
     * @return true 存在する
     * @return false 存在しない
     */
    CubismMotionJson.prototype.isExistMotionCurveFadeInTime = function (curveIndex) {
        return !this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(FadeInTime)
            .isNull();
    };
    /**
     * モーションのカーブのフェードアウト時間の存在
     * @param curveIndex カーブのインデックス
     * @return true 存在する
     * @return false 存在しない
     */
    CubismMotionJson.prototype.isExistMotionCurveFadeOutTime = function (curveIndex) {
        return !this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(FadeOutTime)
            .isNull();
    };
    /**
     * モーションのカーブのフェードイン時間の取得
     * @param curveIndex カーブのインデックス
     * @return フェードイン時間[秒]
     */
    CubismMotionJson.prototype.getMotionCurveFadeInTime = function (curveIndex) {
        return this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(FadeInTime)
            .toFloat();
    };
    /**
     * モーションのカーブのフェードアウト時間の取得
     * @param curveIndex カーブのインデックス
     * @return フェードアウト時間[秒]
     */
    CubismMotionJson.prototype.getMotionCurveFadeOutTime = function (curveIndex) {
        return this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(FadeOutTime)
            .toFloat();
    };
    /**
     * モーションのカーブのセグメントの個数を取得する
     * @param curveIndex カーブのインデックス
     * @return モーションのカーブのセグメントの個数
     */
    CubismMotionJson.prototype.getMotionCurveSegmentCount = function (curveIndex) {
        return this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(Segments)
            .getVector()
            .getSize();
    };
    /**
     * モーションのカーブのセグメントの値の取得
     * @param curveIndex カーブのインデックス
     * @param segmentIndex セグメントのインデックス
     * @return セグメントの値
     */
    CubismMotionJson.prototype.getMotionCurveSegment = function (curveIndex, segmentIndex) {
        return this._json
            .getRoot()
            .getValueByString(Curves)
            .getValueByIndex(curveIndex)
            .getValueByString(Segments)
            .getValueByIndex(segmentIndex)
            .toFloat();
    };
    /**
     * イベントの個数の取得
     * @return イベントの個数
     */
    CubismMotionJson.prototype.getEventCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(UserDataCount)
            .toInt();
    };
    /**
     *  イベントの総文字数の取得
     * @return イベントの総文字数
     */
    CubismMotionJson.prototype.getTotalEventValueSize = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalUserDataSize)
            .toInt();
    };
    /**
     * イベントの時間の取得
     * @param userDataIndex イベントのインデックス
     * @return イベントの時間[秒]
     */
    CubismMotionJson.prototype.getEventTime = function (userDataIndex) {
        return this._json
            .getRoot()
            .getValueByString(UserData)
            .getValueByIndex(userDataIndex)
            .getValueByString(Time)
            .toFloat();
    };
    /**
     * イベントの取得
     * @param userDataIndex イベントのインデックス
     * @return イベントの文字列
     */
    CubismMotionJson.prototype.getEventValue = function (userDataIndex) {
        return new csmstring_1.csmString(this._json
            .getRoot()
            .getValueByString(UserData)
            .getValueByIndex(userDataIndex)
            .getValueByString(Value)
            .getRawString());
    };
    return CubismMotionJson;
}());
exports.CubismMotionJson = CubismMotionJson;
/**
 * @brief ベジェカーブの解釈方法のフラグタイプ
 */
var EvaluationOptionFlag;
(function (EvaluationOptionFlag) {
    EvaluationOptionFlag[EvaluationOptionFlag["EvaluationOptionFlag_AreBeziersRistricted"] = 0] = "EvaluationOptionFlag_AreBeziersRistricted";
})(EvaluationOptionFlag || (exports.EvaluationOptionFlag = EvaluationOptionFlag = {}));
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionjson */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionjson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionJson = $.CubismMotionJson;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionmanager.ts":
/*!*******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionmanager.ts ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMotionManager = void 0;
var cubismmotionqueuemanager_1 = __webpack_require__(/*! ./cubismmotionqueuemanager */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueuemanager.ts");
/**
 * モーションの管理
 *
 * モーションの管理を行うクラス
 */
var CubismMotionManager = /** @class */ (function (_super) {
    __extends(CubismMotionManager, _super);
    /**
     * コンストラクタ
     */
    function CubismMotionManager() {
        var _this = _super.call(this) || this;
        _this._currentPriority = 0;
        _this._reservePriority = 0;
        return _this;
    }
    /**
     * 再生中のモーションの優先度の取得
     * @return  モーションの優先度
     */
    CubismMotionManager.prototype.getCurrentPriority = function () {
        return this._currentPriority;
    };
    /**
     * 予約中のモーションの優先度を取得する。
     * @return  モーションの優先度
     */
    CubismMotionManager.prototype.getReservePriority = function () {
        return this._reservePriority;
    };
    /**
     * 予約中のモーションの優先度を設定する。
     * @param   val     優先度
     */
    CubismMotionManager.prototype.setReservePriority = function (val) {
        this._reservePriority = val;
    };
    /**
     * 優先度を設定してモーションを開始する。
     *
     * @param motion          モーション
     * @param autoDelete      再生が狩猟したモーションのインスタンスを削除するならtrue
     * @param priority        優先度
     * @return                開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するIsFinished()の引数で使用する。開始できない時は「-1」
     */
    CubismMotionManager.prototype.startMotionPriority = function (motion, autoDelete, priority) {
        if (priority == this._reservePriority) {
            this._reservePriority = 0; // 予約を解除
        }
        this._currentPriority = priority; // 再生中モーションの優先度を設定
        return _super.prototype.startMotion.call(this, motion, autoDelete, this._userTimeSeconds);
    };
    /**
     * モーションを更新して、モデルにパラメータ値を反映する。
     *
     * @param model   対象のモデル
     * @param deltaTimeSeconds    デルタ時間[秒]
     * @return  true    更新されている
     * @return  false   更新されていない
     */
    CubismMotionManager.prototype.updateMotion = function (model, deltaTimeSeconds) {
        this._userTimeSeconds += deltaTimeSeconds;
        var updated = _super.prototype.doUpdateMotion.call(this, model, this._userTimeSeconds);
        if (this.isFinished()) {
            this._currentPriority = 0; // 再生中のモーションの優先度を解除
        }
        return updated;
    };
    /**
     * モーションを予約する。
     *
     * @param   priority    優先度
     * @return  true    予約できた
     * @return  false   予約できなかった
     */
    CubismMotionManager.prototype.reserveMotion = function (priority) {
        if (priority <= this._reservePriority ||
            priority <= this._currentPriority) {
            return false;
        }
        this._reservePriority = priority;
        return true;
    };
    return CubismMotionManager;
}(cubismmotionqueuemanager_1.CubismMotionQueueManager));
exports.CubismMotionManager = CubismMotionManager;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionmanager */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionmanager.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionManager = $.CubismMotionManager;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueueentry.ts":
/*!**********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueueentry.ts ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismMotionQueueEntry = void 0;
var acubismmotion_1 = __webpack_require__(/*! ./acubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts");
/**
 * CubismMotionQueueManagerで再生している各モーションの管理クラス。
 */
var CubismMotionQueueEntry = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMotionQueueEntry() {
        this._autoDelete = false;
        this._motion = null;
        this._available = true;
        this._finished = false;
        this._started = false;
        this._startTimeSeconds = -1.0;
        this._fadeInStartTimeSeconds = 0.0;
        this._endTimeSeconds = -1.0;
        this._stateTimeSeconds = 0.0;
        this._stateWeight = 0.0;
        this._lastEventCheckSeconds = 0.0;
        this._motionQueueEntryHandle = this;
        this._fadeOutSeconds = 0.0;
        this._isTriggeredFadeOut = false;
    }
    /**
     * デストラクタ相当の処理
     */
    CubismMotionQueueEntry.prototype.release = function () {
        if (this._autoDelete && this._motion) {
            acubismmotion_1.ACubismMotion.delete(this._motion); //
        }
    };
    /**
     * フェードアウト時間と開始判定の設定
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     */
    CubismMotionQueueEntry.prototype.setFadeOut = function (fadeOutSeconds) {
        this._fadeOutSeconds = fadeOutSeconds;
        this._isTriggeredFadeOut = true;
    };
    /**
     * フェードアウトの開始
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     * @param userTimeSeconds デルタ時間の積算値[秒]
     */
    CubismMotionQueueEntry.prototype.startFadeOut = function (fadeOutSeconds, userTimeSeconds) {
        var newEndTimeSeconds = userTimeSeconds + fadeOutSeconds;
        this._isTriggeredFadeOut = true;
        if (this._endTimeSeconds < 0.0 ||
            newEndTimeSeconds < this._endTimeSeconds) {
            this._endTimeSeconds = newEndTimeSeconds;
        }
    };
    /**
     * モーションの終了の確認
     *
     * @return true モーションが終了した
     * @return false 終了していない
     */
    CubismMotionQueueEntry.prototype.isFinished = function () {
        return this._finished;
    };
    /**
     * モーションの開始の確認
     * @return true モーションが開始した
     * @return false 開始していない
     */
    CubismMotionQueueEntry.prototype.isStarted = function () {
        return this._started;
    };
    /**
     * モーションの開始時刻の取得
     * @return モーションの開始時刻[秒]
     */
    CubismMotionQueueEntry.prototype.getStartTime = function () {
        return this._startTimeSeconds;
    };
    /**
     * フェードインの開始時刻の取得
     * @return フェードインの開始時刻[秒]
     */
    CubismMotionQueueEntry.prototype.getFadeInStartTime = function () {
        return this._fadeInStartTimeSeconds;
    };
    /**
     * フェードインの終了時刻の取得
     * @return フェードインの終了時刻の取得
     */
    CubismMotionQueueEntry.prototype.getEndTime = function () {
        return this._endTimeSeconds;
    };
    /**
     * モーションの開始時刻の設定
     * @param startTime モーションの開始時刻
     */
    CubismMotionQueueEntry.prototype.setStartTime = function (startTime) {
        this._startTimeSeconds = startTime;
    };
    /**
     * フェードインの開始時刻の設定
     * @param startTime フェードインの開始時刻[秒]
     */
    CubismMotionQueueEntry.prototype.setFadeInStartTime = function (startTime) {
        this._fadeInStartTimeSeconds = startTime;
    };
    /**
     * フェードインの終了時刻の設定
     * @param endTime フェードインの終了時刻[秒]
     */
    CubismMotionQueueEntry.prototype.setEndTime = function (endTime) {
        this._endTimeSeconds = endTime;
    };
    /**
     * モーションの終了の設定
     * @param f trueならモーションの終了
     */
    CubismMotionQueueEntry.prototype.setIsFinished = function (f) {
        this._finished = f;
    };
    /**
     * モーション開始の設定
     * @param f trueならモーションの開始
     */
    CubismMotionQueueEntry.prototype.setIsStarted = function (f) {
        this._started = f;
    };
    /**
     * モーションの有効性の確認
     * @return true モーションは有効
     * @return false モーションは無効
     */
    CubismMotionQueueEntry.prototype.isAvailable = function () {
        return this._available;
    };
    /**
     * モーションの有効性の設定
     * @param v trueならモーションは有効
     */
    CubismMotionQueueEntry.prototype.setIsAvailable = function (v) {
        this._available = v;
    };
    /**
     * モーションの状態の設定
     * @param timeSeconds 現在時刻[秒]
     * @param weight モーション尾重み
     */
    CubismMotionQueueEntry.prototype.setState = function (timeSeconds, weight) {
        this._stateTimeSeconds = timeSeconds;
        this._stateWeight = weight;
    };
    /**
     * モーションの現在時刻の取得
     * @return モーションの現在時刻[秒]
     */
    CubismMotionQueueEntry.prototype.getStateTime = function () {
        return this._stateTimeSeconds;
    };
    /**
     * モーションの重みの取得
     * @return モーションの重み
     */
    CubismMotionQueueEntry.prototype.getStateWeight = function () {
        return this._stateWeight;
    };
    /**
     * 最後にイベントの発火をチェックした時間を取得
     *
     * @return 最後にイベントの発火をチェックした時間[秒]
     */
    CubismMotionQueueEntry.prototype.getLastCheckEventSeconds = function () {
        return this._lastEventCheckSeconds;
    };
    /**
     * 最後にイベントをチェックした時間を設定
     * @param checkSeconds 最後にイベントをチェックした時間[秒]
     */
    CubismMotionQueueEntry.prototype.setLastCheckEventSeconds = function (checkSeconds) {
        this._lastEventCheckSeconds = checkSeconds;
    };
    /**
     * フェードアウト開始判定の取得
     * @return フェードアウト開始するかどうか
     */
    CubismMotionQueueEntry.prototype.isTriggeredFadeOut = function () {
        return this._isTriggeredFadeOut;
    };
    /**
     * フェードアウト時間の取得
     * @return フェードアウト時間[秒]
     */
    CubismMotionQueueEntry.prototype.getFadeOutSeconds = function () {
        return this._fadeOutSeconds;
    };
    return CubismMotionQueueEntry;
}());
exports.CubismMotionQueueEntry = CubismMotionQueueEntry;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionqueueentry */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueueentry.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionQueueEntry = $.CubismMotionQueueEntry;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueuemanager.ts":
/*!************************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueuemanager.ts ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.InvalidMotionQueueEntryHandleValue = exports.CubismMotionQueueManager = void 0;
var cubismmotionqueueentry_1 = __webpack_require__(/*! ./cubismmotionqueueentry */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueueentry.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
/**
 * モーション再生の管理
 *
 * モーション再生の管理用クラス。CubismMotionモーションなどACubismMotionのサブクラスを再生するために使用する。
 *
 * @note 再生中に別のモーションが StartMotion()された場合は、新しいモーションに滑らかに変化し旧モーションは中断する。
 *       表情用モーション、体用モーションなどを分けてモーション化した場合など、
 *       複数のモーションを同時に再生させる場合は、複数のCubismMotionQueueManagerインスタンスを使用する。
 */
var CubismMotionQueueManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMotionQueueManager() {
        this._userTimeSeconds = 0.0;
        this._eventCallBack = null;
        this._eventCustomData = null;
        this._motions = new csmvector_1.csmVector();
    }
    /**
     * デストラクタ
     */
    CubismMotionQueueManager.prototype.release = function () {
        for (var i = 0; i < this._motions.getSize(); ++i) {
            if (this._motions.at(i)) {
                this._motions.at(i).release();
                this._motions.set(i, null);
            }
        }
        this._motions = null;
    };
    /**
     * 指定したモーションの開始
     *
     * 指定したモーションを開始する。同じタイプのモーションが既にある場合は、既存のモーションに終了フラグを立て、フェードアウトを開始させる。
     *
     * @param   motion          開始するモーション
     * @param   autoDelete      再生が終了したモーションのインスタンスを削除するなら true
     * @param   userTimeSeconds デルタ時間の積算値[秒]
     * @return                      開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するIsFinished()の引数で使用する。開始できない時は「-1」
     */
    CubismMotionQueueManager.prototype.startMotion = function (motion, autoDelete, userTimeSeconds) {
        if (motion == null) {
            return exports.InvalidMotionQueueEntryHandleValue;
        }
        var motionQueueEntry = null;
        // 既にモーションがあれば終了フラグを立てる
        for (var i = 0; i < this._motions.getSize(); ++i) {
            motionQueueEntry = this._motions.at(i);
            if (motionQueueEntry == null) {
                continue;
            }
            motionQueueEntry.setFadeOut(motionQueueEntry._motion.getFadeOutTime()); // フェードアウト設定
        }
        motionQueueEntry = new cubismmotionqueueentry_1.CubismMotionQueueEntry(); // 終了時に破棄する
        motionQueueEntry._autoDelete = autoDelete;
        motionQueueEntry._motion = motion;
        this._motions.pushBack(motionQueueEntry);
        return motionQueueEntry._motionQueueEntryHandle;
    };
    /**
     * 全てのモーションの終了の確認
     * @return true 全て終了している
     * @return false 終了していない
     */
    CubismMotionQueueManager.prototype.isFinished = function () {
        // ------- 処理を行う -------
        // 既にモーションがあれば終了フラグを立てる
        for (var ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
            var motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                ite = this._motions.erase(ite); // 削除
                continue;
            }
            var motion = motionQueueEntry._motion;
            if (motion == null) {
                motionQueueEntry.release();
                motionQueueEntry = null;
                ite = this._motions.erase(ite); // 削除
                continue;
            }
            // ----- 終了済みの処理があれば削除する ------
            if (!motionQueueEntry.isFinished()) {
                return false;
            }
            else {
                ite.preIncrement();
            }
        }
        return true;
    };
    /**
     * 指定したモーションの終了の確認
     * @param motionQueueEntryNumber モーションの識別番号
     * @return true 全て終了している
     * @return false 終了していない
     */
    CubismMotionQueueManager.prototype.isFinishedByHandle = function (motionQueueEntryNumber) {
        for (var ite = this._motions.begin(); ite.notEqual(this._motions.end()); ite.increment()) {
            var motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                continue;
            }
            if (motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber &&
                !motionQueueEntry.isFinished()) {
                return false;
            }
        }
        return true;
    };
    /**
     * 全てのモーションを停止する
     */
    CubismMotionQueueManager.prototype.stopAllMotions = function () {
        // ------- 処理を行う -------
        // 既にモーションがあれば終了フラグを立てる
        for (var ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
            var motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                ite = this._motions.erase(ite);
                continue;
            }
            // ----- 終了済みの処理があれば削除する ------
            motionQueueEntry.release();
            motionQueueEntry = null;
            ite = this._motions.erase(ite); // 削除
        }
    };
    /**
         * 指定したCubismMotionQueueEntryの取得
  
          * @param   motionQueueEntryNumber  モーションの識別番号
          * @return  指定したCubismMotionQueueEntry
          * @return  null   見つからなかった
          */
    CubismMotionQueueManager.prototype.getCubismMotionQueueEntry = function (motionQueueEntryNumber) {
        //------- 処理を行う -------
        for (var ite = this._motions.begin(); ite.notEqual(this._motions.end()); ite.preIncrement()) {
            var motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                continue;
            }
            if (motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber) {
                return motionQueueEntry;
            }
        }
        return null;
    };
    /**
     * イベントを受け取るCallbackの登録
     *
     * @param callback コールバック関数
     * @param customData コールバックに返されるデータ
     */
    CubismMotionQueueManager.prototype.setEventCallback = function (callback, customData) {
        if (customData === void 0) { customData = null; }
        this._eventCallBack = callback;
        this._eventCustomData = customData;
    };
    /**
     * モーションを更新して、モデルにパラメータ値を反映する。
     *
     * @param   model   対象のモデル
     * @param   userTimeSeconds   デルタ時間の積算値[秒]
     * @return  true    モデルへパラメータ値の反映あり
     * @return  false   モデルへパラメータ値の反映なし(モーションの変化なし)
     */
    CubismMotionQueueManager.prototype.doUpdateMotion = function (model, userTimeSeconds) {
        var updated = false;
        // ------- 処理を行う --------
        // 既にモーションがあれば終了フラグを立てる
        for (var ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
            var motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                ite = this._motions.erase(ite); // 削除
                continue;
            }
            var motion = motionQueueEntry._motion;
            if (motion == null) {
                motionQueueEntry.release();
                motionQueueEntry = null;
                ite = this._motions.erase(ite); // 削除
                continue;
            }
            // ------ 値を反映する ------
            motion.updateParameters(model, motionQueueEntry, userTimeSeconds);
            updated = true;
            // ------ ユーザトリガーイベントを検査する ----
            var firedList = motion.getFiredEvent(motionQueueEntry.getLastCheckEventSeconds() -
                motionQueueEntry.getStartTime(), userTimeSeconds - motionQueueEntry.getStartTime());
            for (var i = 0; i < firedList.getSize(); ++i) {
                this._eventCallBack(this, firedList.at(i), this._eventCustomData);
            }
            motionQueueEntry.setLastCheckEventSeconds(userTimeSeconds);
            // ------ 終了済みの処理があれば削除する ------
            if (motionQueueEntry.isFinished()) {
                motionQueueEntry.release();
                motionQueueEntry = null;
                ite = this._motions.erase(ite); // 削除
            }
            else {
                if (motionQueueEntry.isTriggeredFadeOut()) {
                    motionQueueEntry.startFadeOut(motionQueueEntry.getFadeOutSeconds(), userTimeSeconds);
                }
                ite.preIncrement();
            }
        }
        return updated;
    };
    return CubismMotionQueueManager;
}());
exports.CubismMotionQueueManager = CubismMotionQueueManager;
exports.InvalidMotionQueueEntryHandleValue = -1;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionqueuemanager */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueuemanager.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionQueueManager = $.CubismMotionQueueManager;
    Live2DCubismFramework.InvalidMotionQueueEntryHandleValue = $.InvalidMotionQueueEntryHandleValue;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysics.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/physics/cubismphysics.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.PhysicsOutput = exports.Options = exports.CubismPhysics = void 0;
var cubismmath_1 = __webpack_require__(/*! ../math/cubismmath */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmath.ts");
var cubismvector2_1 = __webpack_require__(/*! ../math/cubismvector2 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismphysicsinternal_1 = __webpack_require__(/*! ./cubismphysicsinternal */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsinternal.ts");
var cubismphysicsjson_1 = __webpack_require__(/*! ./cubismphysicsjson */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsjson.ts");
// physics types tags.
var PhysicsTypeTagX = 'X';
var PhysicsTypeTagY = 'Y';
var PhysicsTypeTagAngle = 'Angle';
// Constant of air resistance.
var AirResistance = 5.0;
// Constant of maximum weight of input and output ratio.
var MaximumWeight = 100.0;
// Constant of threshold of movement.
var MovementThreshold = 0.001;
// Constant of maximum allowed delta time
var MaxDeltaTime = 5.0;
/**
 * 物理演算クラス
 */
var CubismPhysics = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismPhysics() {
        this._physicsRig = null;
        // set default options
        this._options = new Options();
        this._options.gravity.y = -1.0;
        this._options.gravity.x = 0.0;
        this._options.wind.x = 0.0;
        this._options.wind.y = 0.0;
        this._currentRigOutputs = new csmvector_1.csmVector();
        this._previousRigOutputs = new csmvector_1.csmVector();
        this._currentRemainTime = 0.0;
        this._parameterCaches = null;
        this._parameterInputCaches = null;
    }
    /**
     * インスタンスの作成
     * @param buffer    physics3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     * @return 作成されたインスタンス
     */
    CubismPhysics.create = function (buffer, size) {
        var ret = new CubismPhysics();
        ret.parse(buffer, size);
        ret._physicsRig.gravity.y = 0;
        return ret;
    };
    /**
     * インスタンスを破棄する
     * @param physics 破棄するインスタンス
     */
    CubismPhysics.delete = function (physics) {
        if (physics != null) {
            physics.release();
            physics = null;
        }
    };
    /**
     * physics3.jsonをパースする。
     * @param physicsJson physics3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    CubismPhysics.prototype.parse = function (physicsJson, size) {
        this._physicsRig = new cubismphysicsinternal_1.CubismPhysicsRig();
        var json = new cubismphysicsjson_1.CubismPhysicsJson(physicsJson, size);
        this._physicsRig.gravity = json.getGravity();
        this._physicsRig.wind = json.getWind();
        this._physicsRig.subRigCount = json.getSubRigCount();
        this._physicsRig.fps = json.getFps();
        this._physicsRig.settings.updateSize(this._physicsRig.subRigCount, cubismphysicsinternal_1.CubismPhysicsSubRig, true);
        this._physicsRig.inputs.updateSize(json.getTotalInputCount(), cubismphysicsinternal_1.CubismPhysicsInput, true);
        this._physicsRig.outputs.updateSize(json.getTotalOutputCount(), cubismphysicsinternal_1.CubismPhysicsOutput, true);
        this._physicsRig.particles.updateSize(json.getVertexCount(), cubismphysicsinternal_1.CubismPhysicsParticle, true);
        this._currentRigOutputs.clear();
        this._previousRigOutputs.clear();
        var inputIndex = 0, outputIndex = 0, particleIndex = 0;
        for (var i = 0; i < this._physicsRig.settings.getSize(); ++i) {
            this._physicsRig.settings.at(i).normalizationPosition.minimum =
                json.getNormalizationPositionMinimumValue(i);
            this._physicsRig.settings.at(i).normalizationPosition.maximum =
                json.getNormalizationPositionMaximumValue(i);
            this._physicsRig.settings.at(i).normalizationPosition.defalut =
                json.getNormalizationPositionDefaultValue(i);
            this._physicsRig.settings.at(i).normalizationAngle.minimum =
                json.getNormalizationAngleMinimumValue(i);
            this._physicsRig.settings.at(i).normalizationAngle.maximum =
                json.getNormalizationAngleMaximumValue(i);
            this._physicsRig.settings.at(i).normalizationAngle.defalut =
                json.getNormalizationAngleDefaultValue(i);
            // Input
            this._physicsRig.settings.at(i).inputCount = json.getInputCount(i);
            this._physicsRig.settings.at(i).baseInputIndex = inputIndex;
            for (var j = 0; j < this._physicsRig.settings.at(i).inputCount; ++j) {
                this._physicsRig.inputs.at(inputIndex + j).sourceParameterIndex = -1;
                this._physicsRig.inputs.at(inputIndex + j).weight = json.getInputWeight(i, j);
                this._physicsRig.inputs.at(inputIndex + j).reflect =
                    json.getInputReflect(i, j);
                if (json.getInputType(i, j) == PhysicsTypeTagX) {
                    this._physicsRig.inputs.at(inputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_X;
                    this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue =
                        getInputTranslationXFromNormalizedParameterValue;
                }
                else if (json.getInputType(i, j) == PhysicsTypeTagY) {
                    this._physicsRig.inputs.at(inputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_Y;
                    this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue =
                        getInputTranslationYFromNormalizedParamterValue;
                }
                else if (json.getInputType(i, j) == PhysicsTypeTagAngle) {
                    this._physicsRig.inputs.at(inputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_Angle;
                    this._physicsRig.inputs.at(inputIndex + j).getNormalizedParameterValue =
                        getInputAngleFromNormalizedParameterValue;
                }
                this._physicsRig.inputs.at(inputIndex + j).source.targetType =
                    cubismphysicsinternal_1.CubismPhysicsTargetType.CubismPhysicsTargetType_Parameter;
                this._physicsRig.inputs.at(inputIndex + j).source.id =
                    json.getInputSourceId(i, j);
            }
            inputIndex += this._physicsRig.settings.at(i).inputCount;
            // Output
            this._physicsRig.settings.at(i).outputCount = json.getOutputCount(i);
            this._physicsRig.settings.at(i).baseOutputIndex = outputIndex;
            var currentRigOutput = new PhysicsOutput();
            currentRigOutput.outputs.resize(this._physicsRig.settings.at(i).outputCount);
            var previousRigOutput = new PhysicsOutput();
            previousRigOutput.outputs.resize(this._physicsRig.settings.at(i).outputCount);
            for (var j = 0; j < this._physicsRig.settings.at(i).outputCount; ++j) {
                // initialize
                currentRigOutput.outputs.set(j, 0.0);
                previousRigOutput.outputs.set(j, 0.0);
                this._physicsRig.outputs.at(outputIndex + j).destinationParameterIndex =
                    -1;
                this._physicsRig.outputs.at(outputIndex + j).vertexIndex =
                    json.getOutputVertexIndex(i, j);
                this._physicsRig.outputs.at(outputIndex + j).angleScale =
                    json.getOutputAngleScale(i, j);
                this._physicsRig.outputs.at(outputIndex + j).weight =
                    json.getOutputWeight(i, j);
                this._physicsRig.outputs.at(outputIndex + j).destination.targetType =
                    cubismphysicsinternal_1.CubismPhysicsTargetType.CubismPhysicsTargetType_Parameter;
                this._physicsRig.outputs.at(outputIndex + j).destination.id =
                    json.getOutputDestinationId(i, j);
                if (json.getOutputType(i, j) == PhysicsTypeTagX) {
                    this._physicsRig.outputs.at(outputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_X;
                    this._physicsRig.outputs.at(outputIndex + j).getValue =
                        getOutputTranslationX;
                    this._physicsRig.outputs.at(outputIndex + j).getScale =
                        getOutputScaleTranslationX;
                }
                else if (json.getOutputType(i, j) == PhysicsTypeTagY) {
                    this._physicsRig.outputs.at(outputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_Y;
                    this._physicsRig.outputs.at(outputIndex + j).getValue =
                        getOutputTranslationY;
                    this._physicsRig.outputs.at(outputIndex + j).getScale =
                        getOutputScaleTranslationY;
                }
                else if (json.getOutputType(i, j) == PhysicsTypeTagAngle) {
                    this._physicsRig.outputs.at(outputIndex + j).type =
                        cubismphysicsinternal_1.CubismPhysicsSource.CubismPhysicsSource_Angle;
                    this._physicsRig.outputs.at(outputIndex + j).getValue =
                        getOutputAngle;
                    this._physicsRig.outputs.at(outputIndex + j).getScale =
                        getOutputScaleAngle;
                }
                this._physicsRig.outputs.at(outputIndex + j).reflect =
                    json.getOutputReflect(i, j);
            }
            this._currentRigOutputs.pushBack(currentRigOutput);
            this._previousRigOutputs.pushBack(previousRigOutput);
            outputIndex += this._physicsRig.settings.at(i).outputCount;
            // Particle
            this._physicsRig.settings.at(i).particleCount = json.getParticleCount(i);
            this._physicsRig.settings.at(i).baseParticleIndex = particleIndex;
            for (var j = 0; j < this._physicsRig.settings.at(i).particleCount; ++j) {
                this._physicsRig.particles.at(particleIndex + j).mobility =
                    json.getParticleMobility(i, j);
                this._physicsRig.particles.at(particleIndex + j).delay =
                    json.getParticleDelay(i, j);
                this._physicsRig.particles.at(particleIndex + j).acceleration =
                    json.getParticleAcceleration(i, j);
                this._physicsRig.particles.at(particleIndex + j).radius =
                    json.getParticleRadius(i, j);
                this._physicsRig.particles.at(particleIndex + j).position =
                    json.getParticlePosition(i, j);
            }
            particleIndex += this._physicsRig.settings.at(i).particleCount;
        }
        this.initialize();
        json.release();
        json = void 0;
        json = null;
    };
    /**
     * 現在のパラメータ値で物理演算が安定化する状態を演算する。
     * @param model 物理演算の結果を適用するモデル
     */
    CubismPhysics.prototype.stabilization = function (model) {
        var _a, _b, _c, _d;
        var totalAngle;
        var weight;
        var radAngle;
        var outputValue;
        var totalTranslation = new cubismvector2_1.CubismVector2();
        var currentSetting;
        var currentInputs;
        var currentOutputs;
        var currentParticles;
        var parameterValues;
        var parameterMaximumValues;
        var parameterMinimumValues;
        var parameterDefaultValues;
        parameterValues = model.getModel().parameters.values;
        parameterMaximumValues = model.getModel().parameters.maximumValues;
        parameterMinimumValues = model.getModel().parameters.minimumValues;
        parameterDefaultValues = model.getModel().parameters.defaultValues;
        if (((_b = (_a = this._parameterCaches) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < model.getParameterCount()) {
            this._parameterCaches = new Float32Array(model.getParameterCount());
        }
        if (((_d = (_c = this._parameterInputCaches) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) < model.getParameterCount()) {
            this._parameterInputCaches = new Float32Array(model.getParameterCount());
        }
        for (var j = 0; j < model.getParameterCount(); ++j) {
            this._parameterCaches[j] = parameterValues[j];
            this._parameterInputCaches[j] = parameterValues[j];
        }
        for (var settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
            totalAngle = { angle: 0.0 };
            totalTranslation.x = 0.0;
            totalTranslation.y = 0.0;
            currentSetting = this._physicsRig.settings.at(settingIndex);
            currentInputs = this._physicsRig.inputs.get(currentSetting.baseInputIndex);
            currentOutputs = this._physicsRig.outputs.get(currentSetting.baseOutputIndex);
            currentParticles = this._physicsRig.particles.get(currentSetting.baseParticleIndex);
            // Load input parameters
            for (var i = 0; i < currentSetting.inputCount; ++i) {
                weight = currentInputs[i].weight / MaximumWeight;
                if (currentInputs[i].sourceParameterIndex == -1) {
                    currentInputs[i].sourceParameterIndex = model.getParameterIndex(currentInputs[i].source.id);
                }
                currentInputs[i].getNormalizedParameterValue(totalTranslation, totalAngle, parameterValues[currentInputs[i].sourceParameterIndex], parameterMinimumValues[currentInputs[i].sourceParameterIndex], parameterMaximumValues[currentInputs[i].sourceParameterIndex], parameterDefaultValues[currentInputs[i].sourceParameterIndex], currentSetting.normalizationPosition, currentSetting.normalizationAngle, currentInputs[i].reflect, weight);
                this._parameterCaches[currentInputs[i].sourceParameterIndex] =
                    parameterValues[currentInputs[i].sourceParameterIndex];
            }
            radAngle = cubismmath_1.CubismMath.degreesToRadian(-totalAngle.angle);
            totalTranslation.x =
                totalTranslation.x * cubismmath_1.CubismMath.cos(radAngle) -
                    totalTranslation.y * cubismmath_1.CubismMath.sin(radAngle);
            totalTranslation.y =
                totalTranslation.x * cubismmath_1.CubismMath.sin(radAngle) +
                    totalTranslation.y * cubismmath_1.CubismMath.cos(radAngle);
            // Calculate particles position.
            updateParticlesForStabilization(currentParticles, currentSetting.particleCount, totalTranslation, totalAngle.angle, this._options.wind, MovementThreshold * currentSetting.normalizationPosition.maximum);
            // Update output parameters.
            for (var i = 0; i < currentSetting.outputCount; ++i) {
                var particleIndex = currentOutputs[i].vertexIndex;
                if (currentOutputs[i].destinationParameterIndex == -1) {
                    currentOutputs[i].destinationParameterIndex = model.getParameterIndex(currentOutputs[i].destination.id);
                }
                if (particleIndex < 1 ||
                    particleIndex >= currentSetting.particleCount) {
                    continue;
                }
                var translation = new cubismvector2_1.CubismVector2();
                translation = currentParticles[particleIndex].position.substract(currentParticles[particleIndex - 1].position);
                outputValue = currentOutputs[i].getValue(translation, currentParticles, particleIndex, currentOutputs[i].reflect, this._options.gravity);
                this._currentRigOutputs.at(settingIndex).outputs.set(i, outputValue);
                this._previousRigOutputs.at(settingIndex).outputs.set(i, outputValue);
                var destinationParameterIndex = currentOutputs[i].destinationParameterIndex;
                var outParameterCaches = !Float32Array.prototype.slice && 'subarray' in Float32Array.prototype
                    ? JSON.parse(JSON.stringify(parameterValues.subarray(destinationParameterIndex))) // 値渡しするため、JSON.parse, JSON.stringify
                    : parameterValues.slice(destinationParameterIndex);
                updateOutputParameterValue(outParameterCaches, parameterMinimumValues[destinationParameterIndex], parameterMaximumValues[destinationParameterIndex], outputValue, currentOutputs[i]);
                // 値を反映
                for (var offset = destinationParameterIndex, outParamIndex = 0; offset < this._parameterCaches.length; offset++, outParamIndex++) {
                    parameterValues[offset] = this._parameterCaches[offset] =
                        outParameterCaches[outParamIndex];
                }
            }
        }
    };
    /**
     * 物理演算の評価
     *
     * Pendulum interpolation weights
     *
     * 振り子の計算結果は保存され、パラメータへの出力は保存された前回の結果で補間されます。
     * The result of the pendulum calculation is saved and
     * the output to the parameters is interpolated with the saved previous result of the pendulum calculation.
     *
     * 図で示すと[1]と[2]で補間されます。
     * The figure shows the interpolation between [1] and [2].
     *
     * 補間の重みは最新の振り子計算タイミングと次回のタイミングの間で見た現在時間で決定する。
     * The weight of the interpolation are determined by the current time seen between
     * the latest pendulum calculation timing and the next timing.
     *
     * 図で示すと[2]と[4]の間でみた(3)の位置の重みになる。
     * Figure shows the weight of position (3) as seen between [2] and [4].
     *
     * 解釈として振り子計算のタイミングと重み計算のタイミングがズレる。
     * As an interpretation, the pendulum calculation and weights are misaligned.
     *
     * physics3.jsonにFPS情報が存在しない場合は常に前の振り子状態で設定される。
     * If there is no FPS information in physics3.json, it is always set in the previous pendulum state.
     *
     * この仕様は補間範囲を逸脱したことが原因の震えたような見た目を回避を目的にしている。
     * The purpose of this specification is to avoid the quivering appearance caused by deviations from the interpolation range.
     *
     * ------------ time -------------->
     *
     *                 |+++++|------| <- weight
     * ==[1]====#=====[2]---(3)----(4)
     *          ^ output contents
     *
     * 1:_previousRigOutputs
     * 2:_currentRigOutputs
     * 3:_currentRemainTime (now rendering)
     * 4:next particles timing
     * @param model 物理演算の結果を適用するモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     */
    CubismPhysics.prototype.evaluate = function (model, deltaTimeSeconds) {
        var _a, _b, _c, _d;
        var totalAngle;
        var weight;
        var radAngle;
        var outputValue;
        var totalTranslation = new cubismvector2_1.CubismVector2();
        var currentSetting;
        var currentInputs;
        var currentOutputs;
        var currentParticles;
        if (0.0 >= deltaTimeSeconds) {
            return;
        }
        var parameterValues;
        var parameterMaximumValues;
        var parameterMinimumValues;
        var parameterDefaultValues;
        var physicsDeltaTime;
        this._currentRemainTime += deltaTimeSeconds;
        if (this._currentRemainTime > MaxDeltaTime) {
            this._currentRemainTime = 0.0;
        }
        parameterValues = model.getModel().parameters.values;
        parameterMaximumValues = model.getModel().parameters.maximumValues;
        parameterMinimumValues = model.getModel().parameters.minimumValues;
        parameterDefaultValues = model.getModel().parameters.defaultValues;
        if (((_b = (_a = this._parameterCaches) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < model.getParameterCount()) {
            this._parameterCaches = new Float32Array(model.getParameterCount());
        }
        if (((_d = (_c = this._parameterInputCaches) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) < model.getParameterCount()) {
            this._parameterInputCaches = new Float32Array(model.getParameterCount());
            for (var j = 0; j < model.getParameterCount(); ++j) {
                this._parameterInputCaches[j] = parameterValues[j];
            }
        }
        if (this._physicsRig.fps > 0.0) {
            physicsDeltaTime = 1.0 / this._physicsRig.fps;
        }
        else {
            physicsDeltaTime = deltaTimeSeconds;
        }
        while (this._currentRemainTime >= physicsDeltaTime) {
            // copyRigOutputs _currentRigOutputs to _previousRigOutputs
            for (var settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
                currentSetting = this._physicsRig.settings.at(settingIndex);
                currentOutputs = this._physicsRig.outputs.get(currentSetting.baseOutputIndex);
                for (var i = 0; i < currentSetting.outputCount; ++i) {
                    this._previousRigOutputs
                        .at(settingIndex)
                        .outputs.set(i, this._currentRigOutputs.at(settingIndex).outputs.at(i));
                }
            }
            // 入力キャッシュとパラメータで線形補間してUpdateParticlesするタイミングでの入力を計算する。
            // Calculate the input at the timing to UpdateParticles by linear interpolation with the _parameterInputCache and parameterValue.
            // _parameterCacheはグループ間での値の伝搬の役割があるので_parameterInputCacheとの分離が必要。
            // _parameterCache needs to be separated from _parameterInputCache because of its role in propagating values between groups.
            var inputWeight = physicsDeltaTime / this._currentRemainTime;
            for (var j = 0; j < model.getParameterCount(); ++j) {
                this._parameterCaches[j] =
                    this._parameterInputCaches[j] * (1.0 - inputWeight) +
                        parameterValues[j] * inputWeight;
                this._parameterInputCaches[j] = this._parameterCaches[j];
            }
            for (var settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
                totalAngle = { angle: 0.0 };
                totalTranslation.x = 0.0;
                totalTranslation.y = 0.0;
                currentSetting = this._physicsRig.settings.at(settingIndex);
                currentInputs = this._physicsRig.inputs.get(currentSetting.baseInputIndex);
                currentOutputs = this._physicsRig.outputs.get(currentSetting.baseOutputIndex);
                currentParticles = this._physicsRig.particles.get(currentSetting.baseParticleIndex);
                // Load input parameters
                for (var i = 0; i < currentSetting.inputCount; ++i) {
                    weight = currentInputs[i].weight / MaximumWeight;
                    if (currentInputs[i].sourceParameterIndex == -1) {
                        currentInputs[i].sourceParameterIndex = model.getParameterIndex(currentInputs[i].source.id);
                    }
                    currentInputs[i].getNormalizedParameterValue(totalTranslation, totalAngle, this._parameterCaches[currentInputs[i].sourceParameterIndex], parameterMinimumValues[currentInputs[i].sourceParameterIndex], parameterMaximumValues[currentInputs[i].sourceParameterIndex], parameterDefaultValues[currentInputs[i].sourceParameterIndex], currentSetting.normalizationPosition, currentSetting.normalizationAngle, currentInputs[i].reflect, weight);
                }
                radAngle = cubismmath_1.CubismMath.degreesToRadian(-totalAngle.angle);
                totalTranslation.x =
                    totalTranslation.x * cubismmath_1.CubismMath.cos(radAngle) -
                        totalTranslation.y * cubismmath_1.CubismMath.sin(radAngle);
                totalTranslation.y =
                    totalTranslation.x * cubismmath_1.CubismMath.sin(radAngle) +
                        totalTranslation.y * cubismmath_1.CubismMath.cos(radAngle);
                // Calculate particles position.
                updateParticles(currentParticles, currentSetting.particleCount, totalTranslation, totalAngle.angle, this._options.wind, MovementThreshold * currentSetting.normalizationPosition.maximum, physicsDeltaTime, AirResistance);
                // Update output parameters.
                for (var i = 0; i < currentSetting.outputCount; ++i) {
                    var particleIndex = currentOutputs[i].vertexIndex;
                    if (currentOutputs[i].destinationParameterIndex == -1) {
                        currentOutputs[i].destinationParameterIndex =
                            model.getParameterIndex(currentOutputs[i].destination.id);
                    }
                    if (particleIndex < 1 ||
                        particleIndex >= currentSetting.particleCount) {
                        continue;
                    }
                    var translation = new cubismvector2_1.CubismVector2();
                    translation.x =
                        currentParticles[particleIndex].position.x -
                            currentParticles[particleIndex - 1].position.x;
                    translation.y =
                        currentParticles[particleIndex].position.y -
                            currentParticles[particleIndex - 1].position.y;
                    outputValue = currentOutputs[i].getValue(translation, currentParticles, particleIndex, currentOutputs[i].reflect, this._options.gravity);
                    this._currentRigOutputs.at(settingIndex).outputs.set(i, outputValue);
                    var destinationParameterIndex = currentOutputs[i].destinationParameterIndex;
                    var outParameterCaches = !Float32Array.prototype.slice &&
                        'subarray' in Float32Array.prototype
                        ? JSON.parse(JSON.stringify(this._parameterCaches.subarray(destinationParameterIndex))) // 値渡しするため、JSON.parse, JSON.stringify
                        : this._parameterCaches.slice(destinationParameterIndex);
                    updateOutputParameterValue(outParameterCaches, parameterMinimumValues[destinationParameterIndex], parameterMaximumValues[destinationParameterIndex], outputValue, currentOutputs[i]);
                    // 値を反映
                    for (var offset = destinationParameterIndex, outParamIndex = 0; offset < this._parameterCaches.length; offset++, outParamIndex++) {
                        this._parameterCaches[offset] = outParameterCaches[outParamIndex];
                    }
                }
            }
            this._currentRemainTime -= physicsDeltaTime;
        }
        var alpha = this._currentRemainTime / physicsDeltaTime;
        this.interpolate(model, alpha);
    };
    /**
     * 物理演算結果の適用
     * 振り子演算の最新の結果と一つ前の結果から指定した重みで適用する。
     * @param model 物理演算の結果を適用するモデル
     * @param weight 最新結果の重み
     */
    CubismPhysics.prototype.interpolate = function (model, weight) {
        var currentOutputs;
        var currentSetting;
        var parameterValues;
        var parameterMaximumValues;
        var parameterMinimumValues;
        parameterValues = model.getModel().parameters.values;
        parameterMaximumValues = model.getModel().parameters.maximumValues;
        parameterMinimumValues = model.getModel().parameters.minimumValues;
        for (var settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
            currentSetting = this._physicsRig.settings.at(settingIndex);
            currentOutputs = this._physicsRig.outputs.get(currentSetting.baseOutputIndex);
            // Load input parameters.
            for (var i = 0; i < currentSetting.outputCount; ++i) {
                if (currentOutputs[i].destinationParameterIndex == -1) {
                    continue;
                }
                var destinationParameterIndex = currentOutputs[i].destinationParameterIndex;
                var outParameterValues = !Float32Array.prototype.slice && 'subarray' in Float32Array.prototype
                    ? JSON.parse(JSON.stringify(parameterValues.subarray(destinationParameterIndex))) // 値渡しするため、JSON.parse, JSON.stringify
                    : parameterValues.slice(destinationParameterIndex);
                updateOutputParameterValue(outParameterValues, parameterMinimumValues[destinationParameterIndex], parameterMaximumValues[destinationParameterIndex], this._previousRigOutputs.at(settingIndex).outputs.at(i) *
                    (1 - weight) +
                    this._currentRigOutputs.at(settingIndex).outputs.at(i) * weight, currentOutputs[i]);
                // 値を反映
                for (var offset = destinationParameterIndex, outParamIndex = 0; offset < parameterValues.length; offset++, outParamIndex++) {
                    parameterValues[offset] = outParameterValues[outParamIndex];
                }
            }
        }
    };
    /**
     * オプションの設定
     * @param options オプション
     */
    CubismPhysics.prototype.setOptions = function (options) {
        this._options = options;
    };
    /**
     * オプションの取得
     * @return オプション
     */
    CubismPhysics.prototype.getOption = function () {
        return this._options;
    };
    /**
     * デストラクタ相当の処理
     */
    CubismPhysics.prototype.release = function () {
        this._physicsRig = void 0;
        this._physicsRig = null;
    };
    /**
     * 初期化する
     */
    CubismPhysics.prototype.initialize = function () {
        var strand;
        var currentSetting;
        var radius;
        for (var settingIndex = 0; settingIndex < this._physicsRig.subRigCount; ++settingIndex) {
            currentSetting = this._physicsRig.settings.at(settingIndex);
            strand = this._physicsRig.particles.get(currentSetting.baseParticleIndex);
            // Initialize the top of particle.
            strand[0].initialPosition = new cubismvector2_1.CubismVector2(0.0, 0.0);
            strand[0].lastPosition = new cubismvector2_1.CubismVector2(strand[0].initialPosition.x, strand[0].initialPosition.y);
            strand[0].lastGravity = new cubismvector2_1.CubismVector2(0.0, -1.0);
            strand[0].lastGravity.y *= -1.0;
            strand[0].velocity = new cubismvector2_1.CubismVector2(0.0, 0.0);
            strand[0].force = new cubismvector2_1.CubismVector2(0.0, 0.0);
            // Initialize particles.
            for (var i = 1; i < currentSetting.particleCount; ++i) {
                radius = new cubismvector2_1.CubismVector2(0.0, 0.0);
                radius.y = strand[i].radius;
                strand[i].initialPosition = new cubismvector2_1.CubismVector2(strand[i - 1].initialPosition.x + radius.x, strand[i - 1].initialPosition.y + radius.y);
                strand[i].position = new cubismvector2_1.CubismVector2(strand[i].initialPosition.x, strand[i].initialPosition.y);
                strand[i].lastPosition = new cubismvector2_1.CubismVector2(strand[i].initialPosition.x, strand[i].initialPosition.y);
                strand[i].lastGravity = new cubismvector2_1.CubismVector2(0.0, -1.0);
                strand[i].lastGravity.y *= -1.0;
                strand[i].velocity = new cubismvector2_1.CubismVector2(0.0, 0.0);
                strand[i].force = new cubismvector2_1.CubismVector2(0.0, 0.0);
            }
        }
    };
    return CubismPhysics;
}());
exports.CubismPhysics = CubismPhysics;
/**
 * 物理演算のオプション
 */
var Options = /** @class */ (function () {
    function Options() {
        this.gravity = new cubismvector2_1.CubismVector2(0, 0);
        this.wind = new cubismvector2_1.CubismVector2(0, 0);
    }
    return Options;
}());
exports.Options = Options;
/**
 * パラメータに適用する前の物理演算の出力結果
 */
var PhysicsOutput = /** @class */ (function () {
    function PhysicsOutput() {
        this.outputs = new csmvector_1.csmVector(0);
    }
    return PhysicsOutput;
}());
exports.PhysicsOutput = PhysicsOutput;
/**
 * Gets sign.
 *
 * @param value Evaluation target value.
 *
 * @return Sign of value.
 */
function sign(value) {
    var ret = 0;
    if (value > 0.0) {
        ret = 1;
    }
    else if (value < 0.0) {
        ret = -1;
    }
    return ret;
}
function getInputTranslationXFromNormalizedParameterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition, normalizationAngle, isInverted, weight) {
    targetTranslation.x +=
        normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition.minimum, normalizationPosition.maximum, normalizationPosition.defalut, isInverted) * weight;
}
function getInputTranslationYFromNormalizedParamterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition, normalizationAngle, isInverted, weight) {
    targetTranslation.y +=
        normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationPosition.minimum, normalizationPosition.maximum, normalizationPosition.defalut, isInverted) * weight;
}
function getInputAngleFromNormalizedParameterValue(targetTranslation, targetAngle, value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizaitionPosition, normalizationAngle, isInverted, weight) {
    targetAngle.angle +=
        normalizeParameterValue(value, parameterMinimumValue, parameterMaximumValue, parameterDefaultValue, normalizationAngle.minimum, normalizationAngle.maximum, normalizationAngle.defalut, isInverted) * weight;
}
function getOutputTranslationX(translation, particles, particleIndex, isInverted, parentGravity) {
    var outputValue = translation.x;
    if (isInverted) {
        outputValue *= -1.0;
    }
    return outputValue;
}
function getOutputTranslationY(translation, particles, particleIndex, isInverted, parentGravity) {
    var outputValue = translation.y;
    if (isInverted) {
        outputValue *= -1.0;
    }
    return outputValue;
}
function getOutputAngle(translation, particles, particleIndex, isInverted, parentGravity) {
    var outputValue;
    if (particleIndex >= 2) {
        parentGravity = particles[particleIndex - 1].position.substract(particles[particleIndex - 2].position);
    }
    else {
        parentGravity = parentGravity.multiplyByScaler(-1.0);
    }
    outputValue = cubismmath_1.CubismMath.directionToRadian(parentGravity, translation);
    if (isInverted) {
        outputValue *= -1.0;
    }
    return outputValue;
}
function getRangeValue(min, max) {
    var maxValue = cubismmath_1.CubismMath.max(min, max);
    var minValue = cubismmath_1.CubismMath.min(min, max);
    return cubismmath_1.CubismMath.abs(maxValue - minValue);
}
function getDefaultValue(min, max) {
    var minValue = cubismmath_1.CubismMath.min(min, max);
    return minValue + getRangeValue(min, max) / 2.0;
}
function getOutputScaleTranslationX(translationScale, angleScale) {
    return JSON.parse(JSON.stringify(translationScale.x));
}
function getOutputScaleTranslationY(translationScale, angleScale) {
    return JSON.parse(JSON.stringify(translationScale.y));
}
function getOutputScaleAngle(translationScale, angleScale) {
    return JSON.parse(JSON.stringify(angleScale));
}
/**
 * Updates particles.
 *
 * @param strand                Target array of particle.
 * @param strandCount           Count of particle.
 * @param totalTranslation      Total translation value.
 * @param totalAngle            Total angle.
 * @param windDirection         Direction of Wind.
 * @param thresholdValue        Threshold of movement.
 * @param deltaTimeSeconds      Delta time.
 * @param airResistance         Air resistance.
 */
function updateParticles(strand, strandCount, totalTranslation, totalAngle, windDirection, thresholdValue, deltaTimeSeconds, airResistance) {
    var totalRadian;
    var delay;
    var radian;
    var currentGravity;
    var direction = new cubismvector2_1.CubismVector2(0.0, 0.0);
    var velocity = new cubismvector2_1.CubismVector2(0.0, 0.0);
    var force = new cubismvector2_1.CubismVector2(0.0, 0.0);
    var newDirection = new cubismvector2_1.CubismVector2(0.0, 0.0);
    strand[0].position = new cubismvector2_1.CubismVector2(totalTranslation.x, totalTranslation.y);
    totalRadian = cubismmath_1.CubismMath.degreesToRadian(totalAngle);
    currentGravity = cubismmath_1.CubismMath.radianToDirection(totalRadian);
    currentGravity.normalize();
    for (var i = 1; i < strandCount; ++i) {
        strand[i].force = currentGravity
            .multiplyByScaler(strand[i].acceleration)
            .add(windDirection);
        strand[i].lastPosition = new cubismvector2_1.CubismVector2(strand[i].position.x, strand[i].position.y);
        delay = strand[i].delay * deltaTimeSeconds * 30.0;
        direction = strand[i].position.substract(strand[i - 1].position);
        radian =
            cubismmath_1.CubismMath.directionToRadian(strand[i].lastGravity, currentGravity) /
                airResistance;
        direction.x =
            cubismmath_1.CubismMath.cos(radian) * direction.x -
                direction.y * cubismmath_1.CubismMath.sin(radian);
        direction.y =
            cubismmath_1.CubismMath.sin(radian) * direction.x +
                direction.y * cubismmath_1.CubismMath.cos(radian);
        strand[i].position = strand[i - 1].position.add(direction);
        velocity = strand[i].velocity.multiplyByScaler(delay);
        force = strand[i].force.multiplyByScaler(delay).multiplyByScaler(delay);
        strand[i].position = strand[i].position.add(velocity).add(force);
        newDirection = strand[i].position.substract(strand[i - 1].position);
        newDirection.normalize();
        strand[i].position = strand[i - 1].position.add(newDirection.multiplyByScaler(strand[i].radius));
        if (cubismmath_1.CubismMath.abs(strand[i].position.x) < thresholdValue) {
            strand[i].position.x = 0.0;
        }
        if (delay != 0.0) {
            strand[i].velocity = strand[i].position.substract(strand[i].lastPosition);
            strand[i].velocity = strand[i].velocity.divisionByScalar(delay);
            strand[i].velocity = strand[i].velocity.multiplyByScaler(strand[i].mobility);
        }
        strand[i].force = new cubismvector2_1.CubismVector2(0.0, 0.0);
        strand[i].lastGravity = new cubismvector2_1.CubismVector2(currentGravity.x, currentGravity.y);
    }
}
/**
 * Updates particles for stabilization.
 *
 * @param strand                Target array of particle.
 * @param strandCount           Count of particle.
 * @param totalTranslation      Total translation value.
 * @param totalAngle            Total angle.
 * @param windDirection         Direction of Wind.
 * @param thresholdValue        Threshold of movement.
 */
function updateParticlesForStabilization(strand, strandCount, totalTranslation, totalAngle, windDirection, thresholdValue) {
    var totalRadian;
    var currentGravity;
    var force = new cubismvector2_1.CubismVector2(0.0, 0.0);
    strand[0].position = new cubismvector2_1.CubismVector2(totalTranslation.x, totalTranslation.y);
    totalRadian = cubismmath_1.CubismMath.degreesToRadian(totalAngle);
    currentGravity = cubismmath_1.CubismMath.radianToDirection(totalRadian);
    currentGravity.normalize();
    for (var i = 1; i < strandCount; ++i) {
        strand[i].force = currentGravity
            .multiplyByScaler(strand[i].acceleration)
            .add(windDirection);
        strand[i].lastPosition = new cubismvector2_1.CubismVector2(strand[i].position.x, strand[i].position.y);
        strand[i].velocity = new cubismvector2_1.CubismVector2(0.0, 0.0);
        force = strand[i].force;
        force.normalize();
        force = force.multiplyByScaler(strand[i].radius);
        strand[i].position = strand[i - 1].position.add(force);
        if (cubismmath_1.CubismMath.abs(strand[i].position.x) < thresholdValue) {
            strand[i].position.x = 0.0;
        }
        strand[i].force = new cubismvector2_1.CubismVector2(0.0, 0.0);
        strand[i].lastGravity = new cubismvector2_1.CubismVector2(currentGravity.x, currentGravity.y);
    }
}
/**
 * Updates output parameter value.
 * @param parameterValue            Target parameter value.
 * @param parameterValueMinimum     Minimum of parameter value.
 * @param parameterValueMaximum     Maximum of parameter value.
 * @param translation               Translation value.
 */
function updateOutputParameterValue(parameterValue, parameterValueMinimum, parameterValueMaximum, translation, output) {
    var outputScale;
    var value;
    var weight;
    outputScale = output.getScale(output.translationScale, output.angleScale);
    value = translation * outputScale;
    if (value < parameterValueMinimum) {
        if (value < output.valueBelowMinimum) {
            output.valueBelowMinimum = value;
        }
        value = parameterValueMinimum;
    }
    else if (value > parameterValueMaximum) {
        if (value > output.valueExceededMaximum) {
            output.valueExceededMaximum = value;
        }
        value = parameterValueMaximum;
    }
    weight = output.weight / MaximumWeight;
    if (weight >= 1.0) {
        parameterValue[0] = value;
    }
    else {
        value = parameterValue[0] * (1.0 - weight) + value * weight;
        parameterValue[0] = value;
    }
}
function normalizeParameterValue(value, parameterMinimum, parameterMaximum, parameterDefault, normalizedMinimum, normalizedMaximum, normalizedDefault, isInverted) {
    var result = 0.0;
    var maxValue = cubismmath_1.CubismMath.max(parameterMaximum, parameterMinimum);
    if (maxValue < value) {
        value = maxValue;
    }
    var minValue = cubismmath_1.CubismMath.min(parameterMaximum, parameterMinimum);
    if (minValue > value) {
        value = minValue;
    }
    var minNormValue = cubismmath_1.CubismMath.min(normalizedMinimum, normalizedMaximum);
    var maxNormValue = cubismmath_1.CubismMath.max(normalizedMinimum, normalizedMaximum);
    var middleNormValue = normalizedDefault;
    var middleValue = getDefaultValue(minValue, maxValue);
    var paramValue = value - middleValue;
    switch (sign(paramValue)) {
        case 1: {
            var nLength = maxNormValue - middleNormValue;
            var pLength = maxValue - middleValue;
            if (pLength != 0.0) {
                result = paramValue * (nLength / pLength);
                result += middleNormValue;
            }
            break;
        }
        case -1: {
            var nLength = minNormValue - middleNormValue;
            var pLength = minValue - middleValue;
            if (pLength != 0.0) {
                result = paramValue * (nLength / pLength);
                result += middleNormValue;
            }
            break;
        }
        case 0: {
            result = middleNormValue;
            break;
        }
        default: {
            break;
        }
    }
    return isInverted ? result : result * -1.0;
}
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismphysics */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysics.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysics = $.CubismPhysics;
    Live2DCubismFramework.Options = $.Options;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsinternal.ts":
/*!**********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsinternal.ts ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismPhysicsRig = exports.CubismPhysicsOutput = exports.CubismPhysicsInput = exports.CubismPhysicsSubRig = exports.CubismPhysicsParticle = exports.CubismPhysicsNormalization = exports.CubismPhysicsParameter = exports.PhysicsJsonEffectiveForces = exports.CubismPhysicsSource = exports.CubismPhysicsTargetType = void 0;
var cubismvector2_1 = __webpack_require__(/*! ../math/cubismvector2 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
/**
 * 物理演算の適用先の種類
 */
var CubismPhysicsTargetType;
(function (CubismPhysicsTargetType) {
    CubismPhysicsTargetType[CubismPhysicsTargetType["CubismPhysicsTargetType_Parameter"] = 0] = "CubismPhysicsTargetType_Parameter";
})(CubismPhysicsTargetType || (exports.CubismPhysicsTargetType = CubismPhysicsTargetType = {}));
/**
 * 物理演算の入力の種類
 */
var CubismPhysicsSource;
(function (CubismPhysicsSource) {
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_X"] = 0] = "CubismPhysicsSource_X";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Y"] = 1] = "CubismPhysicsSource_Y";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Angle"] = 2] = "CubismPhysicsSource_Angle";
})(CubismPhysicsSource || (exports.CubismPhysicsSource = CubismPhysicsSource = {}));
/**
 * @brief 物理演算で使用する外部の力
 *
 * 物理演算で使用する外部の力。
 */
var PhysicsJsonEffectiveForces = /** @class */ (function () {
    function PhysicsJsonEffectiveForces() {
        this.gravity = new cubismvector2_1.CubismVector2(0, 0);
        this.wind = new cubismvector2_1.CubismVector2(0, 0);
    }
    return PhysicsJsonEffectiveForces;
}());
exports.PhysicsJsonEffectiveForces = PhysicsJsonEffectiveForces;
/**
 * 物理演算のパラメータ情報
 */
var CubismPhysicsParameter = /** @class */ (function () {
    function CubismPhysicsParameter() {
    }
    return CubismPhysicsParameter;
}());
exports.CubismPhysicsParameter = CubismPhysicsParameter;
/**
 * 物理演算の正規化情報
 */
var CubismPhysicsNormalization = /** @class */ (function () {
    function CubismPhysicsNormalization() {
    }
    return CubismPhysicsNormalization;
}());
exports.CubismPhysicsNormalization = CubismPhysicsNormalization;
/**
 * 物理演算の演算委使用する物理点の情報
 */
var CubismPhysicsParticle = /** @class */ (function () {
    function CubismPhysicsParticle() {
        this.initialPosition = new cubismvector2_1.CubismVector2(0, 0);
        this.position = new cubismvector2_1.CubismVector2(0, 0);
        this.lastPosition = new cubismvector2_1.CubismVector2(0, 0);
        this.lastGravity = new cubismvector2_1.CubismVector2(0, 0);
        this.force = new cubismvector2_1.CubismVector2(0, 0);
        this.velocity = new cubismvector2_1.CubismVector2(0, 0);
    }
    return CubismPhysicsParticle;
}());
exports.CubismPhysicsParticle = CubismPhysicsParticle;
/**
 * 物理演算の物理点の管理
 */
var CubismPhysicsSubRig = /** @class */ (function () {
    function CubismPhysicsSubRig() {
        this.normalizationPosition = new CubismPhysicsNormalization();
        this.normalizationAngle = new CubismPhysicsNormalization();
    }
    return CubismPhysicsSubRig;
}());
exports.CubismPhysicsSubRig = CubismPhysicsSubRig;
/**
 * 物理演算の入力情報
 */
var CubismPhysicsInput = /** @class */ (function () {
    function CubismPhysicsInput() {
        this.source = new CubismPhysicsParameter();
    }
    return CubismPhysicsInput;
}());
exports.CubismPhysicsInput = CubismPhysicsInput;
/**
 * @brief 物理演算の出力情報
 *
 * 物理演算の出力情報。
 */
var CubismPhysicsOutput = /** @class */ (function () {
    function CubismPhysicsOutput() {
        this.destination = new CubismPhysicsParameter();
        this.translationScale = new cubismvector2_1.CubismVector2(0, 0);
    }
    return CubismPhysicsOutput;
}());
exports.CubismPhysicsOutput = CubismPhysicsOutput;
/**
 * @brief 物理演算のデータ
 *
 * 物理演算のデータ。
 */
var CubismPhysicsRig = /** @class */ (function () {
    function CubismPhysicsRig() {
        this.settings = new csmvector_1.csmVector();
        this.inputs = new csmvector_1.csmVector();
        this.outputs = new csmvector_1.csmVector();
        this.particles = new csmvector_1.csmVector();
        this.gravity = new cubismvector2_1.CubismVector2(0, 0);
        this.wind = new cubismvector2_1.CubismVector2(0, 0);
        this.fps = 0.0;
    }
    return CubismPhysicsRig;
}());
exports.CubismPhysicsRig = CubismPhysicsRig;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismphysicsinternal */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsinternal.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysicsInput = $.CubismPhysicsInput;
    Live2DCubismFramework.CubismPhysicsNormalization = $.CubismPhysicsNormalization;
    Live2DCubismFramework.CubismPhysicsOutput = $.CubismPhysicsOutput;
    Live2DCubismFramework.CubismPhysicsParameter = $.CubismPhysicsParameter;
    Live2DCubismFramework.CubismPhysicsParticle = $.CubismPhysicsParticle;
    Live2DCubismFramework.CubismPhysicsRig = $.CubismPhysicsRig;
    Live2DCubismFramework.CubismPhysicsSource = $.CubismPhysicsSource;
    Live2DCubismFramework.CubismPhysicsSubRig = $.CubismPhysicsSubRig;
    Live2DCubismFramework.CubismPhysicsTargetType = $.CubismPhysicsTargetType;
    Live2DCubismFramework.PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsjson.ts":
/*!******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsjson.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismPhysicsJson = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismvector2_1 = __webpack_require__(/*! ../math/cubismvector2 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismvector2.ts");
var cubismjson_1 = __webpack_require__(/*! ../utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
// JSON keys
var Position = 'Position';
var X = 'X';
var Y = 'Y';
var Angle = 'Angle';
var Type = 'Type';
var Id = 'Id';
// Meta
var Meta = 'Meta';
var EffectiveForces = 'EffectiveForces';
var TotalInputCount = 'TotalInputCount';
var TotalOutputCount = 'TotalOutputCount';
var PhysicsSettingCount = 'PhysicsSettingCount';
var Gravity = 'Gravity';
var Wind = 'Wind';
var VertexCount = 'VertexCount';
var Fps = 'Fps';
// PhysicsSettings
var PhysicsSettings = 'PhysicsSettings';
var Normalization = 'Normalization';
var Minimum = 'Minimum';
var Maximum = 'Maximum';
var Default = 'Default';
var Reflect = 'Reflect';
var Weight = 'Weight';
// Input
var Input = 'Input';
var Source = 'Source';
// Output
var Output = 'Output';
var Scale = 'Scale';
var VertexIndex = 'VertexIndex';
var Destination = 'Destination';
// Particle
var Vertices = 'Vertices';
var Mobility = 'Mobility';
var Delay = 'Delay';
var Radius = 'Radius';
var Acceleration = 'Acceleration';
/**
 * physics3.jsonのコンテナ。
 */
var CubismPhysicsJson = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param buffer physics3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    function CubismPhysicsJson(buffer, size) {
        this._json = cubismjson_1.CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    CubismPhysicsJson.prototype.release = function () {
        cubismjson_1.CubismJson.delete(this._json);
    };
    /**
     * 重力の取得
     * @return 重力
     */
    CubismPhysicsJson.prototype.getGravity = function () {
        var ret = new cubismvector2_1.CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Gravity)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Gravity)
            .getValueByString(Y)
            .toFloat();
        return ret;
    };
    /**
     * 風の取得
     * @return 風
     */
    CubismPhysicsJson.prototype.getWind = function () {
        var ret = new cubismvector2_1.CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Wind)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Wind)
            .getValueByString(Y)
            .toFloat();
        return ret;
    };
    /**
     * 物理演算設定FPSの取得
     * @return 物理演算設定FPS
     */
    CubismPhysicsJson.prototype.getFps = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Fps)
            .toFloat(0.0);
    };
    /**
     * 物理店の管理の個数の取得
     * @return 物理店の管理の個数
     */
    CubismPhysicsJson.prototype.getSubRigCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(PhysicsSettingCount)
            .toInt();
    };
    /**
     * 入力の総合計の取得
     * @return 入力の総合計
     */
    CubismPhysicsJson.prototype.getTotalInputCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalInputCount)
            .toInt();
    };
    /**
     * 出力の総合計の取得
     * @return 出力の総合計
     */
    CubismPhysicsJson.prototype.getTotalOutputCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalOutputCount)
            .toInt();
    };
    /**
     * 物理点の個数の取得
     * @return 物理点の個数
     */
    CubismPhysicsJson.prototype.getVertexCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(VertexCount)
            .toInt();
    };
    /**
     * 正規化された位置の最小値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置の最小値
     */
    CubismPhysicsJson.prototype.getNormalizationPositionMinimumValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Minimum)
            .toFloat();
    };
    /**
     * 正規化された位置の最大値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置の最大値
     */
    CubismPhysicsJson.prototype.getNormalizationPositionMaximumValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Maximum)
            .toFloat();
    };
    /**
     * 正規化された位置のデフォルト値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置のデフォルト値
     */
    CubismPhysicsJson.prototype.getNormalizationPositionDefaultValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Default)
            .toFloat();
    };
    /**
     * 正規化された角度の最小値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された角度の最小値
     */
    CubismPhysicsJson.prototype.getNormalizationAngleMinimumValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Minimum)
            .toFloat();
    };
    /**
     * 正規化された角度の最大値の取得
     * @param physicsSettingIndex
     * @return 正規化された角度の最大値
     */
    CubismPhysicsJson.prototype.getNormalizationAngleMaximumValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Maximum)
            .toFloat();
    };
    /**
     * 正規化された角度のデフォルト値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された角度のデフォルト値
     */
    CubismPhysicsJson.prototype.getNormalizationAngleDefaultValue = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Default)
            .toFloat();
    };
    /**
     * 入力の個数の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 入力の個数
     */
    CubismPhysicsJson.prototype.getInputCount = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getVector()
            .getSize();
    };
    /**
     * 入力の重みの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の重み
     */
    CubismPhysicsJson.prototype.getInputWeight = function (physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Weight)
            .toFloat();
    };
    /**
     * 入力の反転の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の反転
     */
    CubismPhysicsJson.prototype.getInputReflect = function (physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Reflect)
            .toBoolean();
    };
    /**
     * 入力の種類の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の種類
     */
    CubismPhysicsJson.prototype.getInputType = function (physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Type)
            .getRawString();
    };
    /**
     * 入力元のIDの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力元のID
     */
    CubismPhysicsJson.prototype.getInputSourceId = function (physicsSettingIndex, inputIndex) {
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Source)
            .getValueByString(Id)
            .getRawString());
    };
    /**
     * 出力の個数の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 出力の個数
     */
    CubismPhysicsJson.prototype.getOutputCount = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getVector()
            .getSize();
    };
    /**
     * 出力の物理点のインデックスの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の物理点のインデックス
     */
    CubismPhysicsJson.prototype.getOutputVertexIndex = function (physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(VertexIndex)
            .toInt();
    };
    /**
     * 出力の角度のスケールを取得する
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の角度のスケール
     */
    CubismPhysicsJson.prototype.getOutputAngleScale = function (physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Scale)
            .toFloat();
    };
    /**
     * 出力の重みの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の重み
     */
    CubismPhysicsJson.prototype.getOutputWeight = function (physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Weight)
            .toFloat();
    };
    /**
     * 出力先のIDの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力先のID
     */
    CubismPhysicsJson.prototype.getOutputDestinationId = function (physicsSettingIndex, outputIndex) {
        return live2dcubismframework_1.CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Destination)
            .getValueByString(Id)
            .getRawString());
    };
    /**
     * 出力の種類の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の種類
     */
    CubismPhysicsJson.prototype.getOutputType = function (physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Type)
            .getRawString();
    };
    /**
     * 出力の反転の取得
     * @param physicsSettingIndex 物理演算のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の反転
     */
    CubismPhysicsJson.prototype.getOutputReflect = function (physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Reflect)
            .toBoolean();
    };
    /**
     * 物理点の個数の取得
     * @param physicsSettingIndex 物理演算男設定のインデックス
     * @return 物理点の個数
     */
    CubismPhysicsJson.prototype.getParticleCount = function (physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getVector()
            .getSize();
    };
    /**
     * 物理点の動きやすさの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の動きやすさ
     */
    CubismPhysicsJson.prototype.getParticleMobility = function (physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Mobility)
            .toFloat();
    };
    /**
     * 物理点の遅れの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の遅れ
     */
    CubismPhysicsJson.prototype.getParticleDelay = function (physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Delay)
            .toFloat();
    };
    /**
     * 物理点の加速度の取得
     * @param physicsSettingIndex 物理演算の設定
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の加速度
     */
    CubismPhysicsJson.prototype.getParticleAcceleration = function (physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Acceleration)
            .toFloat();
    };
    /**
     * 物理点の距離の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の距離
     */
    CubismPhysicsJson.prototype.getParticleRadius = function (physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Radius)
            .toFloat();
    };
    /**
     * 物理点の位置の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexInde 物理点のインデックス
     * @return 物理点の位置
     */
    CubismPhysicsJson.prototype.getParticlePosition = function (physicsSettingIndex, vertexIndex) {
        var ret = new cubismvector2_1.CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Position)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Position)
            .getValueByString(Y)
            .toFloat();
        return ret;
    };
    return CubismPhysicsJson;
}());
exports.CubismPhysicsJson = CubismPhysicsJson;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismphysicsjson */ "../../../../CubismSdkForWeb/Framework/src/physics/cubismphysicsjson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysicsJson = $.CubismPhysicsJson;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts":
/*!*****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismTextureColor = exports.CubismBlendMode = exports.CubismRenderer = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! ../math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
/**
 * モデル描画を処理するレンダラ
 *
 * サブクラスに環境依存の描画命令を記述する。
 */
var CubismRenderer = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismRenderer() {
        this._isCulling = false;
        this._isPremultipliedAlpha = false;
        this._anisotropy = 0.0;
        this._model = null;
        this._modelColor = new CubismTextureColor();
        this._useHighPrecisionMask = false;
        // 単位行列に初期化
        this._mvpMatrix4x4 = new cubismmatrix44_1.CubismMatrix44();
        this._mvpMatrix4x4.loadIdentity();
    }
    /**
     * レンダラのインスタンスを生成して取得する
     *
     * @return レンダラのインスタンス
     */
    CubismRenderer.create = function () {
        return null;
    };
    /**
     * レンダラのインスタンスを解放する
     */
    CubismRenderer.delete = function (renderer) {
        renderer = null;
    };
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     * @param model モデルのインスタンス
     */
    CubismRenderer.prototype.initialize = function (model) {
        this._model = model;
    };
    /**
     * モデルを描画する
     */
    CubismRenderer.prototype.drawModel = function () {
        if (this.getModel() == null)
            return;
        this.saveProfile();
        this.doDrawModel();
        this.restoreProfile();
    };
    /**
     * Model-View-Projection 行列をセットする
     * 配列は複製されるので、元の配列は外で破棄して良い
     * @param matrix44 Model-View-Projection 行列
     */
    CubismRenderer.prototype.setMvpMatrix = function (matrix44) {
        this._mvpMatrix4x4.setMatrix(matrix44.getArray());
    };
    /**
     * Model-View-Projection 行列を取得する
     * @return Model-View-Projection 行列
     */
    CubismRenderer.prototype.getMvpMatrix = function () {
        return this._mvpMatrix4x4;
    };
    /**
     * モデルの色をセットする
     * 各色0.0~1.0の間で指定する（1.0が標準の状態）
     * @param red 赤チャンネルの値
     * @param green 緑チャンネルの値
     * @param blue 青チャンネルの値
     * @param alpha αチャンネルの値
     */
    CubismRenderer.prototype.setModelColor = function (red, green, blue, alpha) {
        if (red < 0.0) {
            red = 0.0;
        }
        else if (red > 1.0) {
            red = 1.0;
        }
        if (green < 0.0) {
            green = 0.0;
        }
        else if (green > 1.0) {
            green = 1.0;
        }
        if (blue < 0.0) {
            blue = 0.0;
        }
        else if (blue > 1.0) {
            blue = 1.0;
        }
        if (alpha < 0.0) {
            alpha = 0.0;
        }
        else if (alpha > 1.0) {
            alpha = 1.0;
        }
        this._modelColor.R = red;
        this._modelColor.G = green;
        this._modelColor.B = blue;
        this._modelColor.A = alpha;
    };
    /**
     * モデルの色を取得する
     * 各色0.0~1.0の間で指定する(1.0が標準の状態)
     *
     * @return RGBAのカラー情報
     */
    CubismRenderer.prototype.getModelColor = function () {
        return JSON.parse(JSON.stringify(this._modelColor));
    };
    /**
     * 乗算済みαの有効・無効をセットする
     * 有効にするならtrue、無効にするならfalseをセットする
     */
    CubismRenderer.prototype.setIsPremultipliedAlpha = function (enable) {
        this._isPremultipliedAlpha = enable;
    };
    /**
     * 乗算済みαの有効・無効を取得する
     * @return true 乗算済みのα有効
     * @return false 乗算済みのα無効
     */
    CubismRenderer.prototype.isPremultipliedAlpha = function () {
        return this._isPremultipliedAlpha;
    };
    /**
     * カリング（片面描画）の有効・無効をセットする。
     * 有効にするならtrue、無効にするならfalseをセットする
     */
    CubismRenderer.prototype.setIsCulling = function (culling) {
        this._isCulling = culling;
    };
    /**
     * カリング（片面描画）の有効・無効を取得する。
     * @return true カリング有効
     * @return false カリング無効
     */
    CubismRenderer.prototype.isCulling = function () {
        return this._isCulling;
    };
    /**
     * テクスチャの異方性フィルタリングのパラメータをセットする
     * パラメータ値の影響度はレンダラの実装に依存する
     * @param n パラメータの値
     */
    CubismRenderer.prototype.setAnisotropy = function (n) {
        this._anisotropy = n;
    };
    /**
     * テクスチャの異方性フィルタリングのパラメータをセットする
     * @return 異方性フィルタリングのパラメータ
     */
    CubismRenderer.prototype.getAnisotropy = function () {
        return this._anisotropy;
    };
    /**
     * レンダリングするモデルを取得する
     * @return レンダリングするモデル
     */
    CubismRenderer.prototype.getModel = function () {
        return this._model;
    };
    /**
     * マスク描画の方式を変更する。
     * falseの場合、マスクを1枚のテクスチャに分割してレンダリングする（デフォルト）
     * 高速だが、マスク個数の上限が36に限定され、質も荒くなる
     * trueの場合、パーツ描画の前にその都度必要なマスクを描き直す
     * レンダリング品質は高いが描画処理負荷は増す
     * @param high 高精細マスクに切り替えるか？
     */
    CubismRenderer.prototype.useHighPrecisionMask = function (high) {
        this._useHighPrecisionMask = high;
    };
    /**
     * マスクの描画方式を取得する
     * @return true 高精細方式
     * @return false デフォルト
     */
    CubismRenderer.prototype.isUsingHighPrecisionMask = function () {
        return this._useHighPrecisionMask;
    };
    return CubismRenderer;
}());
exports.CubismRenderer = CubismRenderer;
var CubismBlendMode;
(function (CubismBlendMode) {
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Normal"] = 0] = "CubismBlendMode_Normal";
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Additive"] = 1] = "CubismBlendMode_Additive";
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Multiplicative"] = 2] = "CubismBlendMode_Multiplicative";
})(CubismBlendMode || (exports.CubismBlendMode = CubismBlendMode = {}));
/**
 * テクスチャの色をRGBAで扱うためのクラス
 */
var CubismTextureColor = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismTextureColor(r, g, b, a) {
        if (r === void 0) { r = 1.0; }
        if (g === void 0) { g = 1.0; }
        if (b === void 0) { b = 1.0; }
        if (a === void 0) { a = 1.0; }
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
    return CubismTextureColor;
}());
exports.CubismTextureColor = CubismTextureColor;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismrenderer */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismBlendMode = $.CubismBlendMode;
    Live2DCubismFramework.CubismRenderer = $.CubismRenderer;
    Live2DCubismFramework.CubismTextureColor = $.CubismTextureColor;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer_webgl.ts":
/*!***********************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer_webgl.ts ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismRenderer_WebGL = exports.fragmentShaderSrcMaskInvertedPremultipliedAlpha = exports.fragmentShaderSrcMaskPremultipliedAlpha = exports.fragmentShaderSrcPremultipliedAlpha = exports.vertexShaderSrcMasked = exports.vertexShaderSrc = exports.fragmentShaderSrcsetupMask = exports.vertexShaderSrcSetupMask = exports.ShaderNames = exports.CubismShaderSet = exports.CubismShader_WebGL = exports.CubismRendererProfile_WebGL = exports.CubismClippingContext = exports.CubismRenderTextureResource = exports.CubismClippingManager_WebGL = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismmatrix44_1 = __webpack_require__(/*! ../math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
var csmmap_1 = __webpack_require__(/*! ../type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmrectf_1 = __webpack_require__(/*! ../type/csmrectf */ "../../../../CubismSdkForWeb/Framework/src/type/csmrectf.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismrenderer_1 = __webpack_require__(/*! ./cubismrenderer */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer.ts");
var ColorChannelCount = 4; // 実験時に1チャンネルの場合は1、RGBだけの場合は3、アルファも含める場合は4
var ClippingMaskMaxCountOnDefault = 36; // 通常のフレームバッファ一枚あたりのマスク最大数
var ClippingMaskMaxCountOnMultiRenderTexture = 32; // フレームバッファが2枚以上ある場合のフレームバッファ一枚あたりのマスク最大数
var ShaderCount = 10; // シェーダーの数 = マスク生成用 + (通常用 + 加算 + 乗算) * (マスク無の乗算済アルファ対応版 + マスク有の乗算済アルファ対応版 + マスク有反転の乗算済アルファ対応版)
var s_instance;
var s_viewport;
var s_fbo;
/**
 * クリッピングマスクの処理を実行するクラス
 */
var CubismClippingManager_WebGL = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismClippingManager_WebGL() {
        this._currentMaskRenderTexture = null;
        this._maskColorBuffers = null;
        this._currentFrameNo = 0;
        this._renderTextureCount = 0;
        this._clippingMaskBufferSize = 256;
        this._clippingContextListForMask = new csmvector_1.csmVector();
        this._clippingContextListForDraw = new csmvector_1.csmVector();
        this._channelColors = new csmvector_1.csmVector();
        this._tmpBoundsOnModel = new csmrectf_1.csmRect();
        this._tmpMatrix = new cubismmatrix44_1.CubismMatrix44();
        this._tmpMatrixForMask = new cubismmatrix44_1.CubismMatrix44();
        this._tmpMatrixForDraw = new cubismmatrix44_1.CubismMatrix44();
        this._maskTexture = null;
        var tmp = new cubismrenderer_1.CubismTextureColor();
        tmp.R = 1.0;
        tmp.G = 0.0;
        tmp.B = 0.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new cubismrenderer_1.CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 1.0;
        tmp.B = 0.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new cubismrenderer_1.CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 0.0;
        tmp.B = 1.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new cubismrenderer_1.CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 0.0;
        tmp.B = 0.0;
        tmp.A = 1.0;
        this._channelColors.pushBack(tmp);
    }
    /**
     * カラーチャンネル（RGBA）のフラグを取得する
     * @param channelNo カラーチャンネル（RGBA）の番号（0:R, 1:G, 2:B, 3:A）
     */
    CubismClippingManager_WebGL.prototype.getChannelFlagAsColor = function (channelNo) {
        return this._channelColors.at(channelNo);
    };
    /**
     * テンポラリのレンダーテクスチャのアドレスを取得する
     * FrameBufferObjectが存在しない場合、新しく生成する
     *
     * @return レンダーテクスチャの配列
     */
    CubismClippingManager_WebGL.prototype.getMaskRenderTexture = function () {
        // テンポラリのRenderTextureを取得する
        if (this._maskTexture && this._maskTexture.textures != null) {
            // 前回使ったものを返す
            this._maskTexture.frameNo = this._currentFrameNo;
        }
        else {
            // FrameBufferObjectが存在しない場合、新しく生成する
            if (this._maskRenderTextures != null) {
                this._maskRenderTextures.clear();
            }
            this._maskRenderTextures = new csmvector_1.csmVector();
            // ColorBufferObjectが存在しない場合、新しく生成する
            if (this._maskColorBuffers != null) {
                this._maskColorBuffers.clear();
            }
            this._maskColorBuffers = new csmvector_1.csmVector();
            // クリッピングバッファサイズを取得
            var size = this._clippingMaskBufferSize;
            for (var index = 0; index < this._renderTextureCount; index++) {
                this._maskColorBuffers.pushBack(this.gl.createTexture()); // 直接代入
                this.gl.bindTexture(this.gl.TEXTURE_2D, this._maskColorBuffers.at(index));
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, size, size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                this._maskRenderTextures.pushBack(this.gl.createFramebuffer());
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTextures.at(index));
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._maskColorBuffers.at(index), 0);
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
            this._maskTexture = new CubismRenderTextureResource(this._currentFrameNo, this._maskRenderTextures);
        }
        return this._maskTexture.textures;
    };
    /**
     * WebGLレンダリングコンテキストを設定する
     * @param gl WebGLレンダリングコンテキスト
     */
    CubismClippingManager_WebGL.prototype.setGL = function (gl) {
        this.gl = gl;
    };
    /**
     * マスクされる描画オブジェクト群全体を囲む矩形（モデル座標系）を計算する
     * @param model モデルのインスタンス
     * @param clippingContext クリッピングマスクのコンテキスト
     */
    CubismClippingManager_WebGL.prototype.calcClippedDrawTotalBounds = function (model, clippingContext) {
        // 被クリッピングマスク（マスクされる描画オブジェクト）の全体の矩形
        var clippedDrawTotalMinX = Number.MAX_VALUE;
        var clippedDrawTotalMinY = Number.MAX_VALUE;
        var clippedDrawTotalMaxX = Number.MIN_VALUE;
        var clippedDrawTotalMaxY = Number.MIN_VALUE;
        // このマスクが実際に必要か判定する
        // このクリッピングを利用する「描画オブジェクト」がひとつでも使用可能であればマスクを生成する必要がある
        var clippedDrawCount = clippingContext._clippedDrawableIndexList.length;
        for (var clippedDrawableIndex = 0; clippedDrawableIndex < clippedDrawCount; clippedDrawableIndex++) {
            // マスクを使用する描画オブジェクトの描画される矩形を求める
            var drawableIndex = clippingContext._clippedDrawableIndexList[clippedDrawableIndex];
            var drawableVertexCount = model.getDrawableVertexCount(drawableIndex);
            var drawableVertexes = model.getDrawableVertices(drawableIndex);
            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;
            var maxX = -Number.MAX_VALUE;
            var maxY = -Number.MAX_VALUE;
            var loop = drawableVertexCount * live2dcubismframework_1.Constant.vertexStep;
            for (var pi = live2dcubismframework_1.Constant.vertexOffset; pi < loop; pi += live2dcubismframework_1.Constant.vertexStep) {
                var x = drawableVertexes[pi];
                var y = drawableVertexes[pi + 1];
                if (x < minX) {
                    minX = x;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
            // 有効な点が一つも取れなかったのでスキップ
            if (minX == Number.MAX_VALUE) {
                continue;
            }
            // 全体の矩形に反映
            if (minX < clippedDrawTotalMinX) {
                clippedDrawTotalMinX = minX;
            }
            if (minY < clippedDrawTotalMinY) {
                clippedDrawTotalMinY = minY;
            }
            if (maxX > clippedDrawTotalMaxX) {
                clippedDrawTotalMaxX = maxX;
            }
            if (maxY > clippedDrawTotalMaxY) {
                clippedDrawTotalMaxY = maxY;
            }
            if (clippedDrawTotalMinX == Number.MAX_VALUE) {
                clippingContext._allClippedDrawRect.x = 0.0;
                clippingContext._allClippedDrawRect.y = 0.0;
                clippingContext._allClippedDrawRect.width = 0.0;
                clippingContext._allClippedDrawRect.height = 0.0;
                clippingContext._isUsing = false;
            }
            else {
                clippingContext._isUsing = true;
                var w = clippedDrawTotalMaxX - clippedDrawTotalMinX;
                var h = clippedDrawTotalMaxY - clippedDrawTotalMinY;
                clippingContext._allClippedDrawRect.x = clippedDrawTotalMinX;
                clippingContext._allClippedDrawRect.y = clippedDrawTotalMinY;
                clippingContext._allClippedDrawRect.width = w;
                clippingContext._allClippedDrawRect.height = h;
            }
        }
    };
    /**
     * デストラクタ相当の処理
     */
    CubismClippingManager_WebGL.prototype.release = function () {
        for (var i = 0; i < this._clippingContextListForMask.getSize(); i++) {
            if (this._clippingContextListForMask.at(i)) {
                this._clippingContextListForMask.at(i).release();
                this._clippingContextListForMask.set(i, void 0);
            }
            this._clippingContextListForMask.set(i, null);
        }
        this._clippingContextListForMask = null;
        // _clippingContextListForDrawは_clippingContextListForMaskにあるインスタンスを指している。上記の処理により要素ごとのDELETEは不要。
        for (var i = 0; i < this._clippingContextListForDraw.getSize(); i++) {
            this._clippingContextListForDraw.set(i, null);
        }
        this._clippingContextListForDraw = null;
        if (this._maskTexture) {
            for (var i = 0; i < this._maskTexture.textures.getSize(); i++) {
                this.gl.deleteFramebuffer(this._maskTexture.textures.at(i));
            }
            this._maskTexture.textures.clear();
            this._maskTexture.textures = null;
            this._maskTexture = null;
        }
        for (var i = 0; i < this._channelColors.getSize(); i++) {
            this._channelColors.set(i, null);
        }
        this._channelColors = null;
        // テクスチャ解放
        if (this._maskColorBuffers != null) {
            for (var index = 0; index < this._maskColorBuffers.getSize(); index++) {
                this.gl.deleteTexture(this._maskColorBuffers.at(index));
            }
            this._maskColorBuffers.clear();
        }
        this._maskColorBuffers = null;
        if (this._maskRenderTextures != null) {
            this._maskRenderTextures.clear();
        }
        this._maskRenderTextures = null;
        if (this._clearedFrameBufferflags != null) {
            this._clearedFrameBufferflags.clear();
        }
        this._clearedFrameBufferflags = null;
    };
    /**
     * マネージャの初期化処理
     * クリッピングマスクを使う描画オブジェクトの登録を行う
     * @param model モデルのインスタンス
     * @param drawableCount 描画オブジェクトの数
     * @param drawableMasks 描画オブジェクトをマスクする描画オブジェクトのインデックスのリスト
     * @param drawableMaskCounts 描画オブジェクトをマスクする描画オブジェクトの数
     * @param renderTextureCount バッファの生成数
     */
    CubismClippingManager_WebGL.prototype.initialize = function (model, drawableCount, drawableMasks, drawableMaskCounts, renderTextureCount) {
        // レンダーテクスチャの合計枚数の設定
        // 1以上の整数でない場合はそれぞれ警告を出す
        if (renderTextureCount % 1 != 0) {
            (0, cubismdebug_1.CubismLogWarning)('The number of render textures must be specified as an integer. The decimal point is rounded down and corrected to an integer.');
            // 小数点以下を除去
            renderTextureCount = ~~renderTextureCount;
        }
        if (renderTextureCount < 1) {
            (0, cubismdebug_1.CubismLogWarning)('The number of render textures must be an integer greater than or equal to 1. Set the number of render textures to 1.');
        }
        // 負の値が使われている場合は強制的に1枚と設定する
        this._renderTextureCount = renderTextureCount < 1 ? 1 : renderTextureCount;
        this._clearedFrameBufferflags = new csmvector_1.csmVector(this._renderTextureCount);
        // クリッピングマスクを使う描画オブジェクトをすべて登録する
        // クリッピングマスクは、通常数個程度に限定して使うものとする
        for (var i = 0; i < drawableCount; i++) {
            if (drawableMaskCounts[i] <= 0) {
                // クリッピングマスクが使用されていないアートメッシュ（多くの場合使用しない）
                this._clippingContextListForDraw.pushBack(null);
                continue;
            }
            // 既にあるClipContextと同じかチェックする
            var clippingContext = this.findSameClip(drawableMasks[i], drawableMaskCounts[i]);
            if (clippingContext == null) {
                // 同一のマスクが存在していない場合は生成する
                clippingContext = new CubismClippingContext(this, drawableMasks[i], drawableMaskCounts[i]);
                this._clippingContextListForMask.pushBack(clippingContext);
            }
            clippingContext.addClippedDrawable(i);
            this._clippingContextListForDraw.pushBack(clippingContext);
        }
    };
    /**
     * クリッピングコンテキストを作成する。モデル描画時に実行する。
     * @param model モデルのインスタンス
     * @param renderer レンダラのインスタンス
     */
    CubismClippingManager_WebGL.prototype.setupClippingContext = function (model, renderer) {
        this._currentFrameNo++;
        // 全てのクリッピングを用意する
        // 同じクリップ（複数の場合はまとめて一つのクリップ）を使う場合は1度だけ設定する
        var usingClipCount = 0;
        for (var clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
            // 1つのクリッピングマスクに関して
            var cc = this._clippingContextListForMask.at(clipIndex);
            // このクリップを利用する描画オブジェクト群全体を囲む矩形を計算
            this.calcClippedDrawTotalBounds(model, cc);
            if (cc._isUsing) {
                usingClipCount++; // 使用中としてカウント
            }
        }
        // マスク作成処理
        if (usingClipCount > 0) {
            // 各マスクのレイアウトを決定していく
            this.setupLayoutBounds(renderer.isUsingHighPrecisionMask() ? 0 : usingClipCount);
            if (!renderer.isUsingHighPrecisionMask()) {
                // 生成したFrameBufferと同じサイズでビューポートを設定
                this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize);
                // 後の計算のためにインデックスの最初をセット
                this._currentMaskRenderTexture = this.getMaskRenderTexture().at(0);
                renderer.preDraw(); // バッファをクリアする
                // ---------- マスク描画処理 ----------
                // マスク用RenderTextureをactiveにセット
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture);
            }
            // サイズがレンダーテクスチャの枚数と合わない場合は合わせる
            if (this._clearedFrameBufferflags.getSize() != this._renderTextureCount) {
                this._clearedFrameBufferflags.clear();
                this._clearedFrameBufferflags = new csmvector_1.csmVector(this._renderTextureCount);
            }
            // マスクのクリアフラグを毎フレーム開始時に初期化
            for (var index = 0; index < this._clearedFrameBufferflags.getSize(); index++) {
                this._clearedFrameBufferflags.set(index, false);
            }
            // 実際にマスクを生成する
            // 全てのマスクをどのようにレイアウトして描くかを決定し、ClipContext, ClippedDrawContextに記憶する
            for (var clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
                // --- 実際に1つのマスクを描く ---
                var clipContext = this._clippingContextListForMask.at(clipIndex);
                var allClipedDrawRect = clipContext._allClippedDrawRect; // このマスクを使う、すべての描画オブジェクトの論理座標上の囲み矩形
                var layoutBoundsOnTex01 = clipContext._layoutBounds; // この中にマスクを収める
                var MARGIN = 0.05; // モデル座標上の矩形を、適宜マージンを付けて使う
                var scaleX = 0;
                var scaleY = 0;
                // clipContextに設定したレンダーテクスチャをインデックスで取得
                var clipContextRenderTexture = this.getMaskRenderTexture().at(clipContext._bufferIndex);
                // 現在のレンダーテクスチャがclipContextのものと異なる場合
                if (this._currentMaskRenderTexture != clipContextRenderTexture &&
                    !renderer.isUsingHighPrecisionMask()) {
                    this._currentMaskRenderTexture = clipContextRenderTexture;
                    renderer.preDraw(); // バッファをクリアする
                    // マスク用RenderTextureをactiveにセット
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture);
                }
                if (renderer.isUsingHighPrecisionMask()) {
                    var ppu = model.getPixelsPerUnit();
                    var maskPixelSize = clipContext.getClippingManager()._clippingMaskBufferSize;
                    var physicalMaskWidth = layoutBoundsOnTex01.width * maskPixelSize;
                    var physicalMaskHeight = layoutBoundsOnTex01.height * maskPixelSize;
                    this._tmpBoundsOnModel.setRect(allClipedDrawRect);
                    if (this._tmpBoundsOnModel.width * ppu > physicalMaskWidth) {
                        this._tmpBoundsOnModel.expand(allClipedDrawRect.width * MARGIN, 0.0);
                        scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
                    }
                    else {
                        scaleX = ppu / physicalMaskWidth;
                    }
                    if (this._tmpBoundsOnModel.height * ppu > physicalMaskHeight) {
                        this._tmpBoundsOnModel.expand(0.0, allClipedDrawRect.height * MARGIN);
                        scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
                    }
                    else {
                        scaleY = ppu / physicalMaskHeight;
                    }
                }
                else {
                    this._tmpBoundsOnModel.setRect(allClipedDrawRect);
                    this._tmpBoundsOnModel.expand(allClipedDrawRect.width * MARGIN, allClipedDrawRect.height * MARGIN);
                    //########## 本来は割り当てられた領域の全体を使わず必要最低限のサイズがよい
                    // シェーダ用の計算式を求める。回転を考慮しない場合は以下のとおり
                    // movePeriod' = movePeriod * scaleX + offX		  [[ movePeriod' = (movePeriod - tmpBoundsOnModel.movePeriod)*scale + layoutBoundsOnTex01.movePeriod ]]
                    scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
                    scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
                }
                // マスク生成時に使う行列を求める
                {
                    // シェーダに渡す行列を求める <<<<<<<<<<<<<<<<<<<<<<<< 要最適化（逆順に計算すればシンプルにできる）
                    this._tmpMatrix.loadIdentity();
                    {
                        // layout0..1 を -1..1に変換
                        this._tmpMatrix.translateRelative(-1.0, -1.0);
                        this._tmpMatrix.scaleRelative(2.0, 2.0);
                    }
                    {
                        // view to layout0..1
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    // tmpMatrixForMaskが計算結果
                    this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
                }
                //--------- draw時の mask 参照用行列を計算
                {
                    // シェーダに渡す行列を求める <<<<<<<<<<<<<<<<<<<<<<<< 要最適化（逆順に計算すればシンプルにできる）
                    this._tmpMatrix.loadIdentity();
                    {
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
                }
                clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
                clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
                if (!renderer.isUsingHighPrecisionMask()) {
                    var clipDrawCount = clipContext._clippingIdCount;
                    for (var i = 0; i < clipDrawCount; i++) {
                        var clipDrawIndex = clipContext._clippingIdList[i];
                        // 頂点情報が更新されておらず、信頼性がない場合は描画をパスする
                        if (!model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                            continue;
                        }
                        renderer.setIsCulling(model.getDrawableCulling(clipDrawIndex) != false);
                        // マスクがクリアされていないなら処理する
                        if (!this._clearedFrameBufferflags.at(clipContext._bufferIndex)) {
                            // マスクをクリアする
                            // (仮仕様) 1が無効（描かれない）領域、0が有効（描かれる）領域。（シェーダーCd*Csで0に近い値をかけてマスクを作る。1をかけると何も起こらない）
                            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
                            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                            this._clearedFrameBufferflags.set(clipContext._bufferIndex, true);
                        }
                        // 今回専用の変換を適用して描く
                        // チャンネルも切り替える必要がある(A,R,G,B)
                        renderer.setClippingContextBufferForMask(clipContext);
                        renderer.drawMesh(model.getDrawableTextureIndex(clipDrawIndex), model.getDrawableVertexIndexCount(clipDrawIndex), model.getDrawableVertexCount(clipDrawIndex), model.getDrawableVertexIndices(clipDrawIndex), model.getDrawableVertices(clipDrawIndex), model.getDrawableVertexUvs(clipDrawIndex), model.getMultiplyColor(clipDrawIndex), model.getScreenColor(clipDrawIndex), model.getDrawableOpacity(clipDrawIndex), cubismrenderer_1.CubismBlendMode.CubismBlendMode_Normal, // クリッピングは通常描画を強制
                        false // マスク生成時はクリッピングの反転使用は全く関係がない
                        );
                    }
                }
            }
            if (!renderer.isUsingHighPrecisionMask()) {
                // --- 後処理 ---
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo); // 描画対象を戻す
                renderer.setClippingContextBufferForMask(null);
                this.gl.viewport(s_viewport[0], s_viewport[1], s_viewport[2], s_viewport[3]);
            }
        }
    };
    /**
     * 既にマスクを作っているかを確認
     * 作っている様であれば該当するクリッピングマスクのインスタンスを返す
     * 作っていなければNULLを返す
     * @param drawableMasks 描画オブジェクトをマスクする描画オブジェクトのリスト
     * @param drawableMaskCounts 描画オブジェクトをマスクする描画オブジェクトの数
     * @return 該当するクリッピングマスクが存在すればインスタンスを返し、なければNULLを返す
     */
    CubismClippingManager_WebGL.prototype.findSameClip = function (drawableMasks, drawableMaskCounts) {
        // 作成済みClippingContextと一致するか確認
        for (var i = 0; i < this._clippingContextListForMask.getSize(); i++) {
            var clippingContext = this._clippingContextListForMask.at(i);
            var count = clippingContext._clippingIdCount;
            // 個数が違う場合は別物
            if (count != drawableMaskCounts) {
                continue;
            }
            var sameCount = 0;
            // 同じIDを持つか確認。配列の数が同じなので、一致した個数が同じなら同じ物を持つとする
            for (var j = 0; j < count; j++) {
                var clipId = clippingContext._clippingIdList[j];
                for (var k = 0; k < count; k++) {
                    if (drawableMasks[k] == clipId) {
                        sameCount++;
                        break;
                    }
                }
            }
            if (sameCount == count) {
                return clippingContext;
            }
        }
        return null; // 見つからなかった
    };
    /**
     * クリッピングコンテキストを配置するレイアウト
     * 指定された数のレンダーテクスチャを極力いっぱいに使ってマスクをレイアウトする
     * マスクグループの数が4以下ならRGBA各チャンネルに一つずつマスクを配置し、5以上6以下ならRGBAを2,2,1,1と配置する。
     *
     * @param usingClipCount 配置するクリッピングコンテキストの数
     */
    CubismClippingManager_WebGL.prototype.setupLayoutBounds = function (usingClipCount) {
        var useClippingMaskMaxCount = this._renderTextureCount <= 1
            ? ClippingMaskMaxCountOnDefault
            : ClippingMaskMaxCountOnMultiRenderTexture * this._renderTextureCount;
        if (usingClipCount <= 0 || usingClipCount > useClippingMaskMaxCount) {
            if (usingClipCount > useClippingMaskMaxCount) {
                // マスクの制限数の警告を出す
                (0, cubismdebug_1.CubismLogError)('not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}', usingClipCount - useClippingMaskMaxCount, this._renderTextureCount, usingClipCount);
            }
            // この場合は一つのマスクターゲットを毎回クリアして使用する
            for (var index = 0; index < this._clippingContextListForMask.getSize(); index++) {
                var clipContext = this._clippingContextListForMask.at(index);
                clipContext._layoutChannelNo = 0; // どうせ毎回消すので固定
                clipContext._layoutBounds.x = 0.0;
                clipContext._layoutBounds.y = 0.0;
                clipContext._layoutBounds.width = 1.0;
                clipContext._layoutBounds.height = 1.0;
                clipContext._bufferIndex = 0;
            }
            return;
        }
        // レンダーテクスチャが1枚なら9分割する（最大36枚）
        var layoutCountMaxValue = this._renderTextureCount <= 1 ? 9 : 8;
        // 指定された数のレンダーテクスチャを極力いっぱいに使ってマスクをレイアウトする（デフォルトなら1）
        // マスクグループの数が4以下ならRGBA各チャンネルに1つずつマスクを配置し、5以上6以下ならRGBAを2,2,1,1と配置する
        var countPerSheetDiv = usingClipCount / this._renderTextureCount; // レンダーテクスチャ1枚あたり何枚割り当てるか
        var countPerSheetMod = usingClipCount % this._renderTextureCount; // この番号のレンダーテクスチャまでに一つずつ配分する
        // 小数点は切り捨てる
        countPerSheetDiv = ~~countPerSheetDiv;
        countPerSheetMod = ~~countPerSheetMod;
        // RGBAを順番に使っていく
        var div = countPerSheetDiv / ColorChannelCount; // 1チャンネルに配置する基本のマスク
        var mod = countPerSheetDiv % ColorChannelCount; // 余り、この番号のチャンネルまでに一つずつ配分する
        // 小数点は切り捨てる
        div = ~~div;
        mod = ~~mod;
        // RGBAそれぞれのチャンネルを用意していく（0:R, 1:G, 2:B, 3:A）
        var curClipIndex = 0; // 順番に設定していく
        for (var renderTextureNo = 0; renderTextureNo < this._renderTextureCount; renderTextureNo++) {
            for (var channelNo = 0; channelNo < ColorChannelCount; channelNo++) {
                // このチャンネルにレイアウトする数
                var layoutCount = div + (channelNo < mod ? 1 : 0);
                // このレンダーテクスチャにまだ割り当てられていなければ追加する
                var checkChannelNo = mod + 1 >= ColorChannelCount ? 0 : mod + 1;
                if (layoutCount < layoutCountMaxValue && channelNo == checkChannelNo) {
                    layoutCount += renderTextureNo < countPerSheetMod ? 1 : 0;
                }
                // 分割方法を決定する
                if (layoutCount == 0) {
                    // 何もしない
                }
                else if (layoutCount == 1) {
                    // 全てをそのまま使う
                    var clipContext = this._clippingContextListForMask.at(curClipIndex++);
                    clipContext._layoutChannelNo = channelNo;
                    clipContext._layoutBounds.x = 0.0;
                    clipContext._layoutBounds.y = 0.0;
                    clipContext._layoutBounds.width = 1.0;
                    clipContext._layoutBounds.height = 1.0;
                    clipContext._bufferIndex = renderTextureNo;
                }
                else if (layoutCount == 2) {
                    for (var i = 0; i < layoutCount; i++) {
                        var xpos = i % 2;
                        // 小数点は切り捨てる
                        xpos = ~~xpos;
                        var cc = this._clippingContextListForMask.at(curClipIndex++);
                        cc._layoutChannelNo = channelNo;
                        // UVを2つに分解して使う
                        cc._layoutBounds.x = xpos * 0.5;
                        cc._layoutBounds.y = 0.0;
                        cc._layoutBounds.width = 0.5;
                        cc._layoutBounds.height = 1.0;
                        cc._bufferIndex = renderTextureNo;
                    }
                }
                else if (layoutCount <= 4) {
                    // 4分割して使う
                    for (var i = 0; i < layoutCount; i++) {
                        var xpos = i % 2;
                        var ypos = i / 2;
                        // 小数点は切り捨てる
                        xpos = ~~xpos;
                        ypos = ~~ypos;
                        var cc = this._clippingContextListForMask.at(curClipIndex++);
                        cc._layoutChannelNo = channelNo;
                        cc._layoutBounds.x = xpos * 0.5;
                        cc._layoutBounds.y = ypos * 0.5;
                        cc._layoutBounds.width = 0.5;
                        cc._layoutBounds.height = 0.5;
                        cc._bufferIndex = renderTextureNo;
                    }
                }
                else if (layoutCount <= layoutCountMaxValue) {
                    // 9分割して使う
                    for (var i = 0; i < layoutCount; i++) {
                        var xpos = i % 3;
                        var ypos = i / 3;
                        // 小数点は切り捨てる
                        xpos = ~~xpos;
                        ypos = ~~ypos;
                        var cc = this._clippingContextListForMask.at(curClipIndex++);
                        cc._layoutChannelNo = channelNo;
                        cc._layoutBounds.x = xpos / 3.0;
                        cc._layoutBounds.y = ypos / 3.0;
                        cc._layoutBounds.width = 1.0 / 3.0;
                        cc._layoutBounds.height = 1.0 / 3.0;
                        cc._bufferIndex = renderTextureNo;
                    }
                }
                else {
                    // マスクの制限枚数を超えた場合の処理
                    (0, cubismdebug_1.CubismLogError)('not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}', usingClipCount - useClippingMaskMaxCount, this._renderTextureCount, usingClipCount);
                    // SetupShaderProgramでオーバーアクセスが発生するので仮で数値を入れる
                    // もちろん描画結果は正しいものではなくなる
                    for (var index = 0; index < layoutCount; index++) {
                        var cc = this._clippingContextListForMask.at(curClipIndex++);
                        cc._layoutChannelNo = 0;
                        cc._layoutBounds.x = 0.0;
                        cc._layoutBounds.y = 0.0;
                        cc._layoutBounds.width = 1.0;
                        cc._layoutBounds.height = 1.0;
                        cc._bufferIndex = 0;
                    }
                }
            }
        }
    };
    /**
     * カラーバッファを取得する
     * @return カラーバッファ
     */
    CubismClippingManager_WebGL.prototype.getColorBuffer = function () {
        return this._maskColorBuffers;
    };
    /**
     * 画面描画に使用するクリッピングマスクのリストを取得する
     * @return 画面描画に使用するクリッピングマスクのリスト
     */
    CubismClippingManager_WebGL.prototype.getClippingContextListForDraw = function () {
        return this._clippingContextListForDraw;
    };
    /**
     * マスクの合計数をカウント
     * @returns
     */
    CubismClippingManager_WebGL.prototype.getClippingMaskCount = function () {
        return this._clippingContextListForMask.getSize();
    };
    /**
     * クリッピングマスクバッファのサイズを設定する
     * @param size クリッピングマスクバッファのサイズ
     */
    CubismClippingManager_WebGL.prototype.setClippingMaskBufferSize = function (size) {
        this._clippingMaskBufferSize = size;
    };
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    CubismClippingManager_WebGL.prototype.getClippingMaskBufferSize = function () {
        return this._clippingMaskBufferSize;
    };
    /**
     * このバッファのレンダーテクスチャの枚数を取得する
     * @return このバッファのレンダーテクスチャの枚数
     */
    CubismClippingManager_WebGL.prototype.getRenderTextureCount = function () {
        return this._renderTextureCount;
    };
    return CubismClippingManager_WebGL;
}());
exports.CubismClippingManager_WebGL = CubismClippingManager_WebGL;
/**
 * レンダーテクスチャのリソースを定義する構造体
 * クリッピングマスクで使用する
 */
var CubismRenderTextureResource = /** @class */ (function () {
    /**
     * 引数付きコンストラクタ
     * @param frameNo レンダラーのフレーム番号
     * @param texture テクスチャのアドレス
     */
    function CubismRenderTextureResource(frameNo, texture) {
        this.frameNo = frameNo;
        this.textures = texture;
    }
    return CubismRenderTextureResource;
}());
exports.CubismRenderTextureResource = CubismRenderTextureResource;
/**
 * クリッピングマスクのコンテキスト
 */
var CubismClippingContext = /** @class */ (function () {
    /**
     * 引数付きコンストラクタ
     */
    function CubismClippingContext(manager, clippingDrawableIndices, clipCount) {
        this._owner = manager;
        // クリップしている（＝マスク用の）Drawableのインデックスリスト
        this._clippingIdList = clippingDrawableIndices;
        // マスクの数
        this._clippingIdCount = clipCount;
        this._allClippedDrawRect = new csmrectf_1.csmRect();
        this._layoutBounds = new csmrectf_1.csmRect();
        this._clippedDrawableIndexList = [];
        this._matrixForMask = new cubismmatrix44_1.CubismMatrix44();
        this._matrixForDraw = new cubismmatrix44_1.CubismMatrix44();
        this._bufferIndex = 0;
    }
    /**
     * デストラクタ相当の処理
     */
    CubismClippingContext.prototype.release = function () {
        if (this._layoutBounds != null) {
            this._layoutBounds = null;
        }
        if (this._allClippedDrawRect != null) {
            this._allClippedDrawRect = null;
        }
        if (this._clippedDrawableIndexList != null) {
            this._clippedDrawableIndexList = null;
        }
    };
    /**
     * このマスクにクリップされる描画オブジェクトを追加する
     *
     * @param drawableIndex クリッピング対象に追加する描画オブジェクトのインデックス
     */
    CubismClippingContext.prototype.addClippedDrawable = function (drawableIndex) {
        this._clippedDrawableIndexList.push(drawableIndex);
    };
    /**
     * このマスクを管理するマネージャのインスタンスを取得する
     * @return クリッピングマネージャのインスタンス
     */
    CubismClippingContext.prototype.getClippingManager = function () {
        return this._owner;
    };
    CubismClippingContext.prototype.setGl = function (gl) {
        this._owner.setGL(gl);
    };
    return CubismClippingContext;
}());
exports.CubismClippingContext = CubismClippingContext;
var CubismRendererProfile_WebGL = /** @class */ (function () {
    function CubismRendererProfile_WebGL() {
        this._lastVertexAttribArrayEnabled = new Array(4);
        this._lastColorMask = new Array(4);
        this._lastBlending = new Array(4);
        this._lastViewport = new Array(4);
    }
    CubismRendererProfile_WebGL.prototype.setGlEnable = function (index, enabled) {
        if (enabled)
            this.gl.enable(index);
        else
            this.gl.disable(index);
    };
    CubismRendererProfile_WebGL.prototype.setGlEnableVertexAttribArray = function (index, enabled) {
        if (enabled)
            this.gl.enableVertexAttribArray(index);
        else
            this.gl.disableVertexAttribArray(index);
    };
    CubismRendererProfile_WebGL.prototype.save = function () {
        if (this.gl == null) {
            (0, cubismdebug_1.CubismLogError)("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        //-- push state --
        this._lastArrayBufferBinding = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING);
        this._lastArrayBufferBinding = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING);
        this._lastProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        this._lastActiveTexture = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
        this.gl.activeTexture(this.gl.TEXTURE1); //テクスチャユニット1をアクティブに（以後の設定対象とする）
        this._lastTexture1Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
        this.gl.activeTexture(this.gl.TEXTURE0); //テクスチャユニット0をアクティブに（以後の設定対象とする）
        this._lastTexture0Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
        this._lastVertexAttribArrayEnabled[0] = this.gl.getVertexAttrib(0, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[1] = this.gl.getVertexAttrib(1, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[2] = this.gl.getVertexAttrib(2, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[3] = this.gl.getVertexAttrib(3, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastScissorTest = this.gl.isEnabled(this.gl.SCISSOR_TEST);
        this._lastStencilTest = this.gl.isEnabled(this.gl.STENCIL_TEST);
        this._lastDepthTest = this.gl.isEnabled(this.gl.DEPTH_TEST);
        this._lastCullFace = this.gl.isEnabled(this.gl.CULL_FACE);
        this._lastBlend = this.gl.isEnabled(this.gl.BLEND);
        this._lastFrontFace = this.gl.getParameter(this.gl.FRONT_FACE);
        this._lastColorMask = this.gl.getParameter(this.gl.COLOR_WRITEMASK);
        // backup blending
        this._lastBlending[0] = this.gl.getParameter(this.gl.BLEND_SRC_RGB);
        this._lastBlending[1] = this.gl.getParameter(this.gl.BLEND_DST_RGB);
        this._lastBlending[2] = this.gl.getParameter(this.gl.BLEND_SRC_ALPHA);
        this._lastBlending[3] = this.gl.getParameter(this.gl.BLEND_DST_ALPHA);
        // モデル描画直前のFBOとビューポートを保存
        this._lastFBO = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
        this._lastViewport = this.gl.getParameter(this.gl.VIEWPORT);
    };
    CubismRendererProfile_WebGL.prototype.restore = function () {
        if (this.gl == null) {
            (0, cubismdebug_1.CubismLogError)("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        this.gl.useProgram(this._lastProgram);
        this.setGlEnableVertexAttribArray(0, this._lastVertexAttribArrayEnabled[0]);
        this.setGlEnableVertexAttribArray(1, this._lastVertexAttribArrayEnabled[1]);
        this.setGlEnableVertexAttribArray(2, this._lastVertexAttribArrayEnabled[2]);
        this.setGlEnableVertexAttribArray(3, this._lastVertexAttribArrayEnabled[3]);
        this.setGlEnable(this.gl.SCISSOR_TEST, this._lastScissorTest);
        this.setGlEnable(this.gl.STENCIL_TEST, this._lastStencilTest);
        this.setGlEnable(this.gl.DEPTH_TEST, this._lastDepthTest);
        this.setGlEnable(this.gl.CULL_FACE, this._lastCullFace);
        this.setGlEnable(this.gl.BLEND, this._lastBlend);
        this.gl.frontFace(this._lastFrontFace);
        this.gl.colorMask(this._lastColorMask[0], this._lastColorMask[1], this._lastColorMask[2], this._lastColorMask[3]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._lastArrayBufferBinding); //前にバッファがバインドされていたら破棄する必要がある
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._lastElementArrayBufferBinding);
        this.gl.activeTexture(this.gl.TEXTURE1); //テクスチャユニット1を復元
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture1Binding2D);
        this.gl.activeTexture(this.gl.TEXTURE0); //テクスチャユニット0を復元
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture0Binding2D);
        this.gl.activeTexture(this._lastActiveTexture);
        this.gl.blendFuncSeparate(this._lastBlending[0], this._lastBlending[1], this._lastBlending[2], this._lastBlending[3]);
    };
    CubismRendererProfile_WebGL.prototype.setGl = function (gl) {
        this.gl = gl;
    };
    return CubismRendererProfile_WebGL;
}());
exports.CubismRendererProfile_WebGL = CubismRendererProfile_WebGL;
/**
 * WebGL用のシェーダープログラムを生成・破棄するクラス
 * シングルトンなクラスであり、CubismShader_WebGL.getInstanceからアクセスする。
 */
var CubismShader_WebGL = /** @class */ (function () {
    /**
     * privateなコンストラクタ
     */
    function CubismShader_WebGL() {
        this._shaderSets = new csmvector_1.csmVector();
    }
    /**
     * インスタンスを取得する（シングルトン）
     * @return インスタンス
     */
    CubismShader_WebGL.getInstance = function () {
        if (s_instance == null) {
            s_instance = new CubismShader_WebGL();
            return s_instance;
        }
        return s_instance;
    };
    /**
     * インスタンスを開放する（シングルトン）
     */
    CubismShader_WebGL.deleteInstance = function () {
        if (s_instance) {
            s_instance.release();
            s_instance = null;
        }
    };
    /**
     * デストラクタ相当の処理
     */
    CubismShader_WebGL.prototype.release = function () {
        this.releaseShaderProgram();
    };
    /**
     * シェーダープログラムの一連のセットアップを実行する
     * @param renderer レンダラのインスタンス
     * @param textureId GPUのテクスチャID
     * @param vertexCount ポリゴンメッシュの頂点数
     * @param vertexArray ポリゴンメッシュの頂点配列
     * @param indexArray インデックスバッファの頂点配列
     * @param uvArray uv配列
     * @param opacity 不透明度
     * @param colorBlendMode カラーブレンディングのタイプ
     * @param baseColor ベースカラー
     * @param isPremultipliedAlpha 乗算済みアルファかどうか
     * @param matrix4x4 Model-View-Projection行列
     * @param invertedMask マスクを反転して使用するフラグ
     */
    CubismShader_WebGL.prototype.setupShaderProgram = function (renderer, textureId, vertexCount, vertexArray, indexArray, uvArray, bufferData, opacity, colorBlendMode, baseColor, multiplyColor, screenColor, isPremultipliedAlpha, matrix4x4, invertedMask) {
        if (!isPremultipliedAlpha) {
            (0, cubismdebug_1.CubismLogError)('NoPremultipliedAlpha is not allowed');
        }
        if (this._shaderSets.getSize() == 0) {
            this.generateShaders();
        }
        // Blending
        var SRC_COLOR;
        var DST_COLOR;
        var SRC_ALPHA;
        var DST_ALPHA;
        if (renderer.getClippingContextBufferForMask() != null) {
            // マスク生成時
            var shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_SetupMask);
            this.gl.useProgram(shaderSet.shaderProgram);
            // テクスチャ設定
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
            this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
            // 頂点配列の設定(VBO)
            if (bufferData.vertex == null) {
                bufferData.vertex = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
            this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
            // テクスチャ頂点の設定
            if (bufferData.uv == null) {
                bufferData.uv = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
            this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
            // チャンネル
            var channelNo = renderer.getClippingContextBufferForMask()._layoutChannelNo;
            var colorChannel = renderer
                .getClippingContextBufferForMask()
                .getClippingManager()
                .getChannelFlagAsColor(channelNo);
            this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
            this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForMask()._matrixForMask.getArray());
            var rect = renderer.getClippingContextBufferForMask()._layoutBounds;
            this.gl.uniform4f(shaderSet.uniformBaseColorLocation, rect.x * 2.0 - 1.0, rect.y * 2.0 - 1.0, rect.getRight() * 2.0 - 1.0, rect.getBottom() * 2.0 - 1.0);
            this.gl.uniform4f(shaderSet.uniformMultiplyColorLocation, multiplyColor.R, multiplyColor.G, multiplyColor.B, multiplyColor.A);
            this.gl.uniform4f(shaderSet.uniformScreenColorLocation, screenColor.R, screenColor.G, screenColor.B, screenColor.A);
            SRC_COLOR = this.gl.ZERO;
            DST_COLOR = this.gl.ONE_MINUS_SRC_COLOR;
            SRC_ALPHA = this.gl.ZERO;
            DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
        } // マスク生成以外の場合
        else {
            var masked = renderer.getClippingContextBufferForDraw() != null; // この描画オブジェクトはマスク対象か
            var offset = masked ? (invertedMask ? 2 : 1) : 0;
            var shaderSet = new CubismShaderSet();
            switch (colorBlendMode) {
                case cubismrenderer_1.CubismBlendMode.CubismBlendMode_Normal:
                default:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_NormalPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.ONE;
                    DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                    SRC_ALPHA = this.gl.ONE;
                    DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
                    break;
                case cubismrenderer_1.CubismBlendMode.CubismBlendMode_Additive:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_AddPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.ONE;
                    DST_COLOR = this.gl.ONE;
                    SRC_ALPHA = this.gl.ZERO;
                    DST_ALPHA = this.gl.ONE;
                    break;
                case cubismrenderer_1.CubismBlendMode.CubismBlendMode_Multiplicative:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_MultPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.DST_COLOR;
                    DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                    SRC_ALPHA = this.gl.ZERO;
                    DST_ALPHA = this.gl.ONE;
                    break;
            }
            this.gl.useProgram(shaderSet.shaderProgram);
            // 頂点配列の設定
            if (bufferData.vertex == null) {
                bufferData.vertex = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
            this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
            // テクスチャ頂点の設定
            if (bufferData.uv == null) {
                bufferData.uv = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
            this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
            if (masked) {
                this.gl.activeTexture(this.gl.TEXTURE1);
                var tex = renderer
                    .getClippingContextBufferForDraw()
                    .getClippingManager()
                    .getColorBuffer()
                    .at(renderer.getClippingContextBufferForDraw()._bufferIndex);
                this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
                this.gl.uniform1i(shaderSet.samplerTexture1Location, 1);
                // view座標をClippingContextの座標に変換するための行列を設定
                this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForDraw()._matrixForDraw.getArray());
                // 使用するカラーチャンネルを設定
                var channelNo = renderer.getClippingContextBufferForDraw()._layoutChannelNo;
                var colorChannel = renderer
                    .getClippingContextBufferForDraw()
                    .getClippingManager()
                    .getChannelFlagAsColor(channelNo);
                this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
            }
            // テクスチャ設定
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
            this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
            // 座標変換
            this.gl.uniformMatrix4fv(shaderSet.uniformMatrixLocation, false, matrix4x4.getArray());
            this.gl.uniform4f(shaderSet.uniformBaseColorLocation, baseColor.R, baseColor.G, baseColor.B, baseColor.A);
            this.gl.uniform4f(shaderSet.uniformMultiplyColorLocation, multiplyColor.R, multiplyColor.G, multiplyColor.B, multiplyColor.A);
            this.gl.uniform4f(shaderSet.uniformScreenColorLocation, screenColor.R, screenColor.G, screenColor.B, screenColor.A);
        }
        // IBOを作成し、データを転送
        if (bufferData.index == null) {
            bufferData.index = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferData.index);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexArray, this.gl.DYNAMIC_DRAW);
        this.gl.blendFuncSeparate(SRC_COLOR, DST_COLOR, SRC_ALPHA, DST_ALPHA);
    };
    /**
     * シェーダープログラムを解放する
     */
    CubismShader_WebGL.prototype.releaseShaderProgram = function () {
        for (var i = 0; i < this._shaderSets.getSize(); i++) {
            this.gl.deleteProgram(this._shaderSets.at(i).shaderProgram);
            this._shaderSets.at(i).shaderProgram = 0;
            this._shaderSets.set(i, void 0);
            this._shaderSets.set(i, null);
        }
    };
    /**
     * シェーダープログラムを初期化する
     * @param vertShaderSrc 頂点シェーダのソース
     * @param fragShaderSrc フラグメントシェーダのソース
     */
    CubismShader_WebGL.prototype.generateShaders = function () {
        for (var i = 0; i < ShaderCount; i++) {
            this._shaderSets.pushBack(new CubismShaderSet());
        }
        this._shaderSets.at(0).shaderProgram = this.loadShaderProgram(exports.vertexShaderSrcSetupMask, exports.fragmentShaderSrcsetupMask);
        this._shaderSets.at(1).shaderProgram = this.loadShaderProgram(exports.vertexShaderSrc, exports.fragmentShaderSrcPremultipliedAlpha);
        this._shaderSets.at(2).shaderProgram = this.loadShaderProgram(exports.vertexShaderSrcMasked, exports.fragmentShaderSrcMaskPremultipliedAlpha);
        this._shaderSets.at(3).shaderProgram = this.loadShaderProgram(exports.vertexShaderSrcMasked, exports.fragmentShaderSrcMaskInvertedPremultipliedAlpha);
        // 加算も通常と同じシェーダーを利用する
        this._shaderSets.at(4).shaderProgram = this._shaderSets.at(1).shaderProgram;
        this._shaderSets.at(5).shaderProgram = this._shaderSets.at(2).shaderProgram;
        this._shaderSets.at(6).shaderProgram = this._shaderSets.at(3).shaderProgram;
        // 乗算も通常と同じシェーダーを利用する
        this._shaderSets.at(7).shaderProgram = this._shaderSets.at(1).shaderProgram;
        this._shaderSets.at(8).shaderProgram = this._shaderSets.at(2).shaderProgram;
        this._shaderSets.at(9).shaderProgram = this._shaderSets.at(3).shaderProgram;
        // SetupMask
        this._shaderSets.at(0).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_position');
        this._shaderSets.at(0).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_texCoord');
        this._shaderSets.at(0).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 's_texture0');
        this._shaderSets.at(0).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(0).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(0).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_baseColor');
        this._shaderSets.at(0).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(0).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_screenColor');
        // 通常（PremultipliedAlpha）
        this._shaderSets.at(1).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_position');
        this._shaderSets.at(1).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_texCoord');
        this._shaderSets.at(1).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 's_texture0');
        this._shaderSets.at(1).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_matrix');
        this._shaderSets.at(1).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_baseColor');
        this._shaderSets.at(1).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(1).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_screenColor');
        // 通常（クリッピング、PremultipliedAlpha）
        this._shaderSets.at(2).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_position');
        this._shaderSets.at(2).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_texCoord');
        this._shaderSets.at(2).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture0');
        this._shaderSets.at(2).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture1');
        this._shaderSets.at(2).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_matrix');
        this._shaderSets.at(2).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(2).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(2).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_baseColor');
        this._shaderSets.at(2).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(2).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_screenColor');
        // 通常（クリッピング・反転, PremultipliedAlpha）
        this._shaderSets.at(3).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_position');
        this._shaderSets.at(3).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_texCoord');
        this._shaderSets.at(3).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture0');
        this._shaderSets.at(3).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture1');
        this._shaderSets.at(3).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_matrix');
        this._shaderSets.at(3).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(3).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(3).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_baseColor');
        this._shaderSets.at(3).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(3).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_screenColor');
        // 加算（PremultipliedAlpha）
        this._shaderSets.at(4).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_position');
        this._shaderSets.at(4).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_texCoord');
        this._shaderSets.at(4).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 's_texture0');
        this._shaderSets.at(4).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_matrix');
        this._shaderSets.at(4).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_baseColor');
        this._shaderSets.at(4).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(4).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_screenColor');
        // 加算（クリッピング、PremultipliedAlpha）
        this._shaderSets.at(5).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_position');
        this._shaderSets.at(5).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_texCoord');
        this._shaderSets.at(5).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture0');
        this._shaderSets.at(5).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture1');
        this._shaderSets.at(5).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_matrix');
        this._shaderSets.at(5).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(5).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(5).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_baseColor');
        this._shaderSets.at(5).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(5).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_screenColor');
        // 加算（クリッピング・反転、PremultipliedAlpha）
        this._shaderSets.at(6).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_position');
        this._shaderSets.at(6).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_texCoord');
        this._shaderSets.at(6).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture0');
        this._shaderSets.at(6).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture1');
        this._shaderSets.at(6).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_matrix');
        this._shaderSets.at(6).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(6).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(6).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_baseColor');
        this._shaderSets.at(6).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(6).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_screenColor');
        // 乗算（PremultipliedAlpha）
        this._shaderSets.at(7).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_position');
        this._shaderSets.at(7).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_texCoord');
        this._shaderSets.at(7).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 's_texture0');
        this._shaderSets.at(7).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_matrix');
        this._shaderSets.at(7).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_baseColor');
        this._shaderSets.at(7).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(7).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_screenColor');
        // 乗算（クリッピング、PremultipliedAlpha）
        this._shaderSets.at(8).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_position');
        this._shaderSets.at(8).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_texCoord');
        this._shaderSets.at(8).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture0');
        this._shaderSets.at(8).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture1');
        this._shaderSets.at(8).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_matrix');
        this._shaderSets.at(8).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(8).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(8).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_baseColor');
        this._shaderSets.at(8).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(8).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_screenColor');
        // 乗算（クリッピング・反転、PremultipliedAlpha）
        this._shaderSets.at(9).attributePositionLocation =
            this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_position');
        this._shaderSets.at(9).attributeTexCoordLocation =
            this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_texCoord');
        this._shaderSets.at(9).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture0');
        this._shaderSets.at(9).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture1');
        this._shaderSets.at(9).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_matrix');
        this._shaderSets.at(9).uniformClipMatrixLocation =
            this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(9).uniformChannelFlagLocation =
            this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(9).uniformBaseColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_baseColor');
        this._shaderSets.at(9).uniformMultiplyColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_multiplyColor');
        this._shaderSets.at(9).uniformScreenColorLocation =
            this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_screenColor');
    };
    /**
     * シェーダプログラムをロードしてアドレスを返す
     * @param vertexShaderSource    頂点シェーダのソース
     * @param fragmentShaderSource  フラグメントシェーダのソース
     * @return シェーダプログラムのアドレス
     */
    CubismShader_WebGL.prototype.loadShaderProgram = function (vertexShaderSource, fragmentShaderSource) {
        // Create Shader Program
        var shaderProgram = this.gl.createProgram();
        var vertShader = this.compileShaderSource(this.gl.VERTEX_SHADER, vertexShaderSource);
        if (!vertShader) {
            (0, cubismdebug_1.CubismLogError)('Vertex shader compile error!');
            return 0;
        }
        var fragShader = this.compileShaderSource(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!fragShader) {
            (0, cubismdebug_1.CubismLogError)('Vertex shader compile error!');
            return 0;
        }
        // Attach vertex shader to program
        this.gl.attachShader(shaderProgram, vertShader);
        // Attach fragment shader to program
        this.gl.attachShader(shaderProgram, fragShader);
        // link program
        this.gl.linkProgram(shaderProgram);
        var linkStatus = this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS);
        // リンクに失敗したらシェーダーを削除
        if (!linkStatus) {
            (0, cubismdebug_1.CubismLogError)('Failed to link program: {0}', shaderProgram);
            this.gl.deleteShader(vertShader);
            vertShader = 0;
            this.gl.deleteShader(fragShader);
            fragShader = 0;
            if (shaderProgram) {
                this.gl.deleteProgram(shaderProgram);
                shaderProgram = 0;
            }
            return 0;
        }
        // Release vertex and fragment shaders.
        this.gl.deleteShader(vertShader);
        this.gl.deleteShader(fragShader);
        return shaderProgram;
    };
    /**
     * シェーダープログラムをコンパイルする
     * @param shaderType シェーダタイプ(Vertex/Fragment)
     * @param shaderSource シェーダソースコード
     *
     * @return コンパイルされたシェーダープログラム
     */
    CubismShader_WebGL.prototype.compileShaderSource = function (shaderType, shaderSource) {
        var source = shaderSource;
        var shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!shader) {
            var log = this.gl.getShaderInfoLog(shader);
            (0, cubismdebug_1.CubismLogError)('Shader compile log: {0} ', log);
        }
        var status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!status) {
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    CubismShader_WebGL.prototype.setGl = function (gl) {
        this.gl = gl;
    };
    return CubismShader_WebGL;
}());
exports.CubismShader_WebGL = CubismShader_WebGL;
/**
 * CubismShader_WebGLのインナークラス
 */
var CubismShaderSet = /** @class */ (function () {
    function CubismShaderSet() {
    }
    return CubismShaderSet;
}());
exports.CubismShaderSet = CubismShaderSet;
var ShaderNames;
(function (ShaderNames) {
    // SetupMask
    ShaderNames[ShaderNames["ShaderNames_SetupMask"] = 0] = "ShaderNames_SetupMask";
    // Normal
    ShaderNames[ShaderNames["ShaderNames_NormalPremultipliedAlpha"] = 1] = "ShaderNames_NormalPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_NormalMaskedPremultipliedAlpha"] = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_NomralMaskedInvertedPremultipliedAlpha"] = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha";
    // Add
    ShaderNames[ShaderNames["ShaderNames_AddPremultipliedAlpha"] = 4] = "ShaderNames_AddPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlpha"] = 5] = "ShaderNames_AddMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlphaInverted"] = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted";
    // Mult
    ShaderNames[ShaderNames["ShaderNames_MultPremultipliedAlpha"] = 7] = "ShaderNames_MultPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlpha"] = 8] = "ShaderNames_MultMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlphaInverted"] = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted";
})(ShaderNames || (exports.ShaderNames = ShaderNames = {}));
exports.vertexShaderSrcSetupMask = 'attribute vec4     a_position;' +
    'attribute vec2     a_texCoord;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_myPos;' +
    'uniform mat4       u_clipMatrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_clipMatrix * a_position;' +
    '   v_myPos = u_clipMatrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    '   v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
exports.fragmentShaderSrcsetupMask = 'precision mediump float;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_myPos;' +
    'uniform vec4       u_baseColor;' +
    'uniform vec4       u_channelFlag;' +
    'uniform sampler2D  s_texture0;' +
    'void main()' +
    '{' +
    '   float isInside = ' +
    '       step(u_baseColor.x, v_myPos.x/v_myPos.w)' +
    '       * step(u_baseColor.y, v_myPos.y/v_myPos.w)' +
    '       * step(v_myPos.x/v_myPos.w, u_baseColor.z)' +
    '       * step(v_myPos.y/v_myPos.w, u_baseColor.w);' +
    '   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;' +
    '}';
//----- バーテックスシェーダプログラム -----
// Normal & Add & Mult 共通
exports.vertexShaderSrc = 'attribute vec4     a_position;' + //v.vertex
    'attribute vec2     a_texCoord;' + //v.texcoord
    'varying vec2       v_texCoord;' + //v2f.texcoord
    'uniform mat4       u_matrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_matrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    '   v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
// Normal & Add & Mult 共通（クリッピングされたものの描画用）
exports.vertexShaderSrcMasked = 'attribute vec4     a_position;' +
    'attribute vec2     a_texCoord;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_clipPos;' +
    'uniform mat4       u_matrix;' +
    'uniform mat4       u_clipMatrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_matrix * a_position;' +
    '   v_clipPos = u_clipMatrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    '   v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
//----- フラグメントシェーダプログラム -----
// Normal & Add & Mult 共通 （PremultipliedAlpha）
exports.fragmentShaderSrcPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2       v_texCoord;' + //v2f.texcoord
    'uniform vec4       u_baseColor;' +
    'uniform sampler2D  s_texture0;' + //_MainTex
    'uniform vec4       u_multiplyColor;' +
    'uniform vec4       u_screenColor;' +
    'void main()' +
    '{' +
    '   vec4 texColor = texture2D(s_texture0, v_texCoord);' +
    '   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;' +
    '   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);' +
    '   vec4 color = texColor * u_baseColor;' +
    '   gl_FragColor = vec4(color.rgb, color.a);' +
    '}';
// Normal （クリッピングされたものの描画用、PremultipliedAlpha兼用）
exports.fragmentShaderSrcMaskPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_clipPos;' +
    'uniform vec4       u_baseColor;' +
    'uniform vec4       u_channelFlag;' +
    'uniform sampler2D  s_texture0;' +
    'uniform sampler2D  s_texture1;' +
    'uniform vec4       u_multiplyColor;' +
    'uniform vec4       u_screenColor;' +
    'void main()' +
    '{' +
    '   vec4 texColor = texture2D(s_texture0, v_texCoord);' +
    '   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;' +
    '   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);' +
    '   vec4 col_formask = texColor * u_baseColor;' +
    '   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
    '   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
    '   col_formask = col_formask * maskVal;' +
    '   gl_FragColor = col_formask;' +
    '}';
// Normal & Add & Mult 共通（クリッピングされて反転使用の描画用、PremultipliedAlphaの場合）
exports.fragmentShaderSrcMaskInvertedPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2      v_texCoord;' +
    'varying vec4      v_clipPos;' +
    'uniform sampler2D s_texture0;' +
    'uniform sampler2D s_texture1;' +
    'uniform vec4      u_channelFlag;' +
    'uniform vec4      u_baseColor;' +
    'uniform vec4      u_multiplyColor;' +
    'uniform vec4      u_screenColor;' +
    'void main()' +
    '{' +
    '   vec4 texColor = texture2D(s_texture0, v_texCoord);' +
    '   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;' +
    '   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);' +
    '   vec4 col_formask = texColor * u_baseColor;' +
    '   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
    '   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
    '   col_formask = col_formask * (1.0 - maskVal);' +
    '   gl_FragColor = col_formask;' +
    '}';
/**
 * WebGL用の描画命令を実装したクラス
 */
var CubismRenderer_WebGL = /** @class */ (function (_super) {
    __extends(CubismRenderer_WebGL, _super);
    /**
     * コンストラクタ
     */
    function CubismRenderer_WebGL() {
        var _this = _super.call(this) || this;
        _this._clippingContextBufferForMask = null;
        _this._clippingContextBufferForDraw = null;
        _this._rendererProfile = new CubismRendererProfile_WebGL();
        _this.firstDraw = true;
        _this._textures = new csmmap_1.csmMap();
        _this._sortedDrawableIndexList = new csmvector_1.csmVector();
        _this._bufferData = {
            vertex: (WebGLBuffer = null),
            uv: (WebGLBuffer = null),
            index: (WebGLBuffer = null),
        };
        // テクスチャ対応マップの容量を確保しておく
        _this._textures.prepareCapacity(32, true);
        return _this;
    }
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     *
     * @param model モデルのインスタンス
     * @param maskBufferCount バッファの生成数
     */
    CubismRenderer_WebGL.prototype.initialize = function (model, maskBufferCount) {
        if (maskBufferCount === void 0) { maskBufferCount = 1; }
        if (model.isUsingMasking()) {
            this._clippingManager = new CubismClippingManager_WebGL(); // クリッピングマスク・バッファ前処理方式を初期化
            this._clippingManager.initialize(model, model.getDrawableCount(), model.getDrawableMasks(), model.getDrawableMaskCounts(), maskBufferCount);
        }
        this._sortedDrawableIndexList.resize(model.getDrawableCount(), 0);
        _super.prototype.initialize.call(this, model); // 親クラスの処理を呼ぶ
    };
    /**
     * WebGLテクスチャのバインド処理
     * CubismRendererにテクスチャを設定し、CubismRenderer内でその画像を参照するためのIndex値を戻り値とする
     * @param modelTextureNo セットするモデルテクスチャの番号
     * @param glTextureNo WebGLテクスチャの番号
     */
    CubismRenderer_WebGL.prototype.bindTexture = function (modelTextureNo, glTexture) {
        this._textures.setValue(modelTextureNo, glTexture);
    };
    /**
     * WebGLにバインドされたテクスチャのリストを取得する
     * @return テクスチャのリスト
     */
    CubismRenderer_WebGL.prototype.getBindedTextures = function () {
        return this._textures;
    };
    /**
     * クリッピングマスクバッファのサイズを設定する
     * マスク用のFrameBufferを破棄、再作成する為処理コストは高い
     * @param size クリッピングマスクバッファのサイズ
     */
    CubismRenderer_WebGL.prototype.setClippingMaskBufferSize = function (size) {
        // クリッピングマスクを利用しない場合は早期リターン
        if (!this._model.isUsingMasking()) {
            return;
        }
        // インスタンス破棄前にレンダーテクスチャの数を保存
        var renderTextureCount = this._clippingManager.getRenderTextureCount();
        // FrameBufferのサイズを変更するためにインスタンスを破棄・再作成する
        this._clippingManager.release();
        this._clippingManager = void 0;
        this._clippingManager = null;
        this._clippingManager = new CubismClippingManager_WebGL();
        this._clippingManager.setClippingMaskBufferSize(size);
        this._clippingManager.initialize(this.getModel(), this.getModel().getDrawableCount(), this.getModel().getDrawableMasks(), this.getModel().getDrawableMaskCounts(), renderTextureCount // インスタンス破棄前に保存したレンダーテクスチャの数
        );
    };
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    CubismRenderer_WebGL.prototype.getClippingMaskBufferSize = function () {
        return this._model.isUsingMasking()
            ? this._clippingManager.getClippingMaskBufferSize()
            : -1;
    };
    /**
     * レンダーテクスチャの枚数を取得する
     * @return レンダーテクスチャの枚数
     */
    CubismRenderer_WebGL.prototype.getRenderTextureCount = function () {
        return this._model.isUsingMasking()
            ? this._clippingManager.getRenderTextureCount()
            : -1;
    };
    /**
     * デストラクタ相当の処理
     */
    CubismRenderer_WebGL.prototype.release = function () {
        if (this._clippingManager) {
            this._clippingManager.release();
            this._clippingManager = void 0;
            this._clippingManager = null;
        }
        if (this.gl == null) {
            return;
        }
        this.gl.deleteBuffer(this._bufferData.vertex);
        this._bufferData.vertex = null;
        this.gl.deleteBuffer(this._bufferData.uv);
        this._bufferData.uv = null;
        this.gl.deleteBuffer(this._bufferData.index);
        this._bufferData.index = null;
        this._bufferData = null;
        this._textures = null;
    };
    /**
     * モデルを描画する実際の処理
     */
    CubismRenderer_WebGL.prototype.doDrawModel = function () {
        if (this.gl == null) {
            (0, cubismdebug_1.CubismLogError)("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        //------------ クリッピングマスク・バッファ前処理方式の場合 ------------
        if (this._clippingManager != null) {
            this.preDraw();
            this._clippingManager.setupClippingContext(this.getModel(), this);
        }
        // 上記クリッピング処理内でも一度PreDrawを呼ぶので注意!!
        this.preDraw();
        var drawableCount = this.getModel().getDrawableCount();
        var renderOrder = this.getModel().getDrawableRenderOrders();
        // インデックスを描画順でソート
        for (var i = 0; i < drawableCount; ++i) {
            var order = renderOrder[i];
            this._sortedDrawableIndexList.set(order, i);
        }
        // 描画
        for (var i = 0; i < drawableCount; ++i) {
            var drawableIndex = this._sortedDrawableIndexList.at(i);
            // Drawableが表示状態でなければ処理をパスする
            if (!this.getModel().getDrawableDynamicFlagIsVisible(drawableIndex)) {
                continue;
            }
            var clipContext = this._clippingManager != null
                ? this._clippingManager
                    .getClippingContextListForDraw()
                    .at(drawableIndex)
                : null;
            if (clipContext != null && this.isUsingHighPrecisionMask()) {
                // 描くことになっていた
                if (clipContext._isUsing) {
                    // 生成したFrameBufferと同じサイズでビューポートを設定
                    this.gl.viewport(0, 0, this._clippingManager.getClippingMaskBufferSize(), this._clippingManager.getClippingMaskBufferSize());
                    this.preDraw(); // バッファをクリアする
                    // ---------- マスク描画処理 ----------
                    // マスク用RenderTextureをactiveにセット
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, clipContext
                        .getClippingManager()
                        .getMaskRenderTexture()
                        .at(clipContext._bufferIndex));
                    // マスクをクリアする
                    // (仮仕様) 1が無効（描かれない）領域、0が有効（描かれる）領域。（シェーダーCd*Csで0に近い値をかけてマスクを作る。1をかけると何も起こらない）
                    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                }
                {
                    var clipDrawCount = clipContext._clippingIdCount;
                    for (var index = 0; index < clipDrawCount; index++) {
                        var clipDrawIndex = clipContext._clippingIdList[index];
                        // 頂点情報が更新されておらず、信頼性がない場合は描画をパスする
                        if (!this._model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                            continue;
                        }
                        this.setIsCulling(this._model.getDrawableCulling(clipDrawIndex) != false);
                        // 今回専用の変換を適用して描く
                        // チャンネルも切り替える必要がある(A,R,G,B)
                        this.setClippingContextBufferForMask(clipContext);
                        this.drawMesh(this.getModel().getDrawableTextureIndex(clipDrawIndex), this.getModel().getDrawableVertexIndexCount(clipDrawIndex), this.getModel().getDrawableVertexCount(clipDrawIndex), this.getModel().getDrawableVertexIndices(clipDrawIndex), this.getModel().getDrawableVertices(clipDrawIndex), this.getModel().getDrawableVertexUvs(clipDrawIndex), this.getModel().getMultiplyColor(clipDrawIndex), this.getModel().getScreenColor(clipDrawIndex), this.getModel().getDrawableOpacity(clipDrawIndex), cubismrenderer_1.CubismBlendMode.CubismBlendMode_Normal, // クリッピングは通常描画を強制
                        false // マスク生成時はクリッピングの反転使用は全く関係がない
                        );
                    }
                }
                {
                    // --- 後処理 ---
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo); // 描画対象を戻す
                    this.setClippingContextBufferForMask(null);
                    this.gl.viewport(s_viewport[0], s_viewport[1], s_viewport[2], s_viewport[3]);
                    this.preDraw(); // バッファをクリアする
                }
            }
            // クリッピングマスクをセットする
            this.setClippingContextBufferForDraw(clipContext);
            this.setIsCulling(this.getModel().getDrawableCulling(drawableIndex));
            this.drawMesh(this.getModel().getDrawableTextureIndex(drawableIndex), this.getModel().getDrawableVertexIndexCount(drawableIndex), this.getModel().getDrawableVertexCount(drawableIndex), this.getModel().getDrawableVertexIndices(drawableIndex), this.getModel().getDrawableVertices(drawableIndex), this.getModel().getDrawableVertexUvs(drawableIndex), this.getModel().getMultiplyColor(drawableIndex), this.getModel().getScreenColor(drawableIndex), this.getModel().getDrawableOpacity(drawableIndex), this.getModel().getDrawableBlendMode(drawableIndex), this.getModel().getDrawableInvertedMaskBit(drawableIndex));
        }
    };
    /**
     * [オーバーライド]
     * 描画オブジェクト（アートメッシュ）を描画する。
     * ポリゴンメッシュとテクスチャ番号をセットで渡す。
     * @param textureNo 描画するテクスチャ番号
     * @param indexCount 描画オブジェクトのインデックス値
     * @param vertexCount ポリゴンメッシュの頂点数
     * @param indexArray ポリゴンメッシュのインデックス配列
     * @param vertexArray ポリゴンメッシュの頂点配列
     * @param uvArray uv配列
     * @param opacity 不透明度
     * @param colorBlendMode カラー合成タイプ
     * @param invertedMask マスク使用時のマスクの反転使用
     */
    CubismRenderer_WebGL.prototype.drawMesh = function (textureNo, indexCount, vertexCount, indexArray, vertexArray, uvArray, multiplyColor, screenColor, opacity, colorBlendMode, invertedMask) {
        // 裏面描画の有効・無効
        if (this.isCulling()) {
            this.gl.enable(this.gl.CULL_FACE);
        }
        else {
            this.gl.disable(this.gl.CULL_FACE);
        }
        this.gl.frontFace(this.gl.CCW); // Cubism SDK OpenGLはマスク・アートメッシュ共にCCWが表面
        var modelColorRGBA = this.getModelColor();
        if (this.getClippingContextBufferForMask() == null) {
            // マスク生成時以外
            modelColorRGBA.A *= opacity;
            if (this.isPremultipliedAlpha()) {
                modelColorRGBA.R *= modelColorRGBA.A;
                modelColorRGBA.G *= modelColorRGBA.A;
                modelColorRGBA.B *= modelColorRGBA.A;
            }
        }
        var drawtexture; // シェーダに渡すテクスチャ
        // テクスチャマップからバインド済みテクスチャＩＤを取得
        // バインドされていなければダミーのテクスチャIDをセットする
        if (this._textures.getValue(textureNo) != null) {
            drawtexture = this._textures.getValue(textureNo);
        }
        else {
            drawtexture = null;
        }
        CubismShader_WebGL.getInstance().setupShaderProgram(this, drawtexture, vertexCount, vertexArray, indexArray, uvArray, this._bufferData, opacity, colorBlendMode, modelColorRGBA, multiplyColor, screenColor, this.isPremultipliedAlpha(), this.getMvpMatrix(), invertedMask);
        // ポリゴンメッシュを描画する
        this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_SHORT, 0);
        // 後処理
        this.gl.useProgram(null);
        this.setClippingContextBufferForDraw(null);
        this.setClippingContextBufferForMask(null);
    };
    CubismRenderer_WebGL.prototype.saveProfile = function () {
        this._rendererProfile.save();
    };
    CubismRenderer_WebGL.prototype.restoreProfile = function () {
        this._rendererProfile.restore();
    };
    /**
     * レンダラが保持する静的なリソースを解放する
     * WebGLの静的なシェーダープログラムを解放する
     */
    CubismRenderer_WebGL.doStaticRelease = function () {
        CubismShader_WebGL.deleteInstance();
    };
    /**
     * レンダーステートを設定する
     * @param fbo アプリケーション側で指定しているフレームバッファ
     * @param viewport ビューポート
     */
    CubismRenderer_WebGL.prototype.setRenderState = function (fbo, viewport) {
        s_fbo = fbo;
        s_viewport = viewport;
    };
    /**
     * 描画開始時の追加処理
     * モデルを描画する前にクリッピングマスクに必要な処理を実装している
     */
    CubismRenderer_WebGL.prototype.preDraw = function () {
        if (this.firstDraw) {
            this.firstDraw = false;
        }
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        this.gl.disable(this.gl.DEPTH_TEST);
        // カリング（1.0beta3）
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.BLEND);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); // 前にバッファがバインドされていたら破棄する必要がある
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        // 異方性フィルタリングを適用する
        if (this.getAnisotropy() > 0.0 && this._extension) {
            for (var i = 0; i < this._textures.getSize(); ++i) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures.getValue(i));
                this.gl.texParameterf(this.gl.TEXTURE_2D, this._extension.TEXTURE_MAX_ANISOTROPY_EXT, this.getAnisotropy());
            }
        }
    };
    /**
     * マスクテクスチャに描画するクリッピングコンテキストをセットする
     */
    CubismRenderer_WebGL.prototype.setClippingContextBufferForMask = function (clip) {
        this._clippingContextBufferForMask = clip;
    };
    /**
     * マスクテクスチャに描画するクリッピングコンテキストを取得する
     * @return マスクテクスチャに描画するクリッピングコンテキスト
     */
    CubismRenderer_WebGL.prototype.getClippingContextBufferForMask = function () {
        return this._clippingContextBufferForMask;
    };
    /**
     * 画面上に描画するクリッピングコンテキストをセットする
     */
    CubismRenderer_WebGL.prototype.setClippingContextBufferForDraw = function (clip) {
        this._clippingContextBufferForDraw = clip;
    };
    /**
     * 画面上に描画するクリッピングコンテキストを取得する
     * @return 画面上に描画するクリッピングコンテキスト
     */
    CubismRenderer_WebGL.prototype.getClippingContextBufferForDraw = function () {
        return this._clippingContextBufferForDraw;
    };
    /**
     * glの設定
     */
    CubismRenderer_WebGL.prototype.startUp = function (gl) {
        this.gl = gl;
        if (this._clippingManager) {
            this._clippingManager.setGL(gl);
        }
        CubismShader_WebGL.getInstance().setGl(gl);
        this._rendererProfile.setGl(gl);
        // 異方性フィルタリングが使用できるかチェック
        this._extension =
            this.gl.getExtension('EXT_texture_filter_anisotropic') ||
                this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
                this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
    };
    return CubismRenderer_WebGL;
}(cubismrenderer_1.CubismRenderer));
exports.CubismRenderer_WebGL = CubismRenderer_WebGL;
/**
 * レンダラが保持する静的なリソースを開放する
 */
cubismrenderer_1.CubismRenderer.staticRelease = function () {
    CubismRenderer_WebGL.doStaticRelease();
};
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismrenderer_webgl */ "../../../../CubismSdkForWeb/Framework/src/rendering/cubismrenderer_webgl.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismClippingContext = $.CubismClippingContext;
    Live2DCubismFramework.CubismClippingManager_WebGL = $.CubismClippingManager_WebGL;
    Live2DCubismFramework.CubismRenderTextureResource = $.CubismRenderTextureResource;
    Live2DCubismFramework.CubismRenderer_WebGL = $.CubismRenderer_WebGL;
    Live2DCubismFramework.CubismShaderSet = $.CubismShaderSet;
    Live2DCubismFramework.CubismShader_WebGL = $.CubismShader_WebGL;
    Live2DCubismFramework.ShaderNames = $.ShaderNames;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts":
/*!****************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.iterator = exports.csmMap = exports.csmPair = void 0;
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
/**
 * Key-Valueのペアを定義するクラス
 * csmMapクラスの内部データで使用する。
 */
var csmPair = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param key Keyとしてセットする値
     * @param value Valueとしてセットする値
     */
    function csmPair(key, value) {
        this.first = key == undefined ? null : key;
        this.second = value == undefined ? null : value;
    }
    return csmPair;
}());
exports.csmPair = csmPair;
/**
 * マップ型
 */
var csmMap = /** @class */ (function () {
    /**
     * 引数付きコンストラクタ
     * @param size 初期化時点で確保するサイズ
     */
    function csmMap(size) {
        if (size != undefined) {
            if (size < 1) {
                this._keyValues = [];
                this._dummyValue = null;
                this._size = 0;
            }
            else {
                this._keyValues = new Array(size);
                this._size = size;
            }
        }
        else {
            this._keyValues = [];
            this._dummyValue = null;
            this._size = 0;
        }
    }
    /**
     * デストラクタ
     */
    csmMap.prototype.release = function () {
        this.clear();
    };
    /**
     * キーを追加する
     * @param key 新たに追加するキー
     */
    csmMap.prototype.appendKey = function (key) {
        // 新しくKey/Valueのペアを作る
        this.prepareCapacity(this._size + 1, false); // 1つ以上入る隙間を作る
        // 新しいkey/valueのインデックスは_size
        this._keyValues[this._size] = new csmPair(key);
        this._size += 1;
    };
    /**
     * 添字演算子[key]のオーバーロード(get)
     * @param key 添字から特定されるValue値
     */
    csmMap.prototype.getValue = function (key) {
        var found = -1;
        for (var i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            return this._keyValues[found].second;
        }
        else {
            this.appendKey(key); // 新規キーを追加
            return this._keyValues[this._size - 1].second;
        }
    };
    /**
     * 添字演算子[key]のオーバーロード(set)
     * @param key 添字から特定されるValue値
     * @param value 代入するValue値
     */
    csmMap.prototype.setValue = function (key, value) {
        var found = -1;
        for (var i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            this._keyValues[found].second = value;
        }
        else {
            this.appendKey(key); // 新規キーを追加
            this._keyValues[this._size - 1].second = value;
        }
    };
    /**
     * 引数で渡したKeyを持つ要素が存在するか
     * @param key 存在を確認するkey
     * @return true 引数で渡したkeyを持つ要素が存在する
     * @return false 引数で渡したkeyを持つ要素が存在しない
     */
    csmMap.prototype.isExist = function (key) {
        for (var i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                return true;
            }
        }
        return false;
    };
    /**
     * keyValueのポインタを全て解放する
     */
    csmMap.prototype.clear = function () {
        this._keyValues = void 0;
        this._keyValues = null;
        this._keyValues = [];
        this._size = 0;
    };
    /**
     * コンテナのサイズを取得する
     *
     * @return コンテナのサイズ
     */
    csmMap.prototype.getSize = function () {
        return this._size;
    };
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない。
     * @param fitToSize trueなら指定したサイズに合わせる。falseならサイズを2倍確保しておく。
     */
    csmMap.prototype.prepareCapacity = function (newSize, fitToSize) {
        if (newSize > this._keyValues.length) {
            if (this._keyValues.length == 0) {
                if (!fitToSize && newSize < csmMap.DefaultSize)
                    newSize = csmMap.DefaultSize;
                this._keyValues.length = newSize;
            }
            else {
                if (!fitToSize && newSize < this._keyValues.length * 2)
                    newSize = this._keyValues.length * 2;
                this._keyValues.length = newSize;
            }
        }
    };
    /**
     * コンテナの先頭要素を返す
     */
    csmMap.prototype.begin = function () {
        var ite = new iterator(this, 0);
        return ite;
    };
    /**
     * コンテナの終端要素を返す
     */
    csmMap.prototype.end = function () {
        var ite = new iterator(this, this._size); // 終了
        return ite;
    };
    /**
     * コンテナから要素を削除する
     *
     * @param ite 削除する要素
     */
    csmMap.prototype.erase = function (ite) {
        var index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // 削除範囲外
        }
        // 削除
        this._keyValues.splice(index, 1);
        --this._size;
        var ite2 = new iterator(this, index); // 終了
        return ite2;
    };
    /**
     * コンテナの値を32ビット符号付き整数型でダンプする
     */
    csmMap.prototype.dumpAsInt = function () {
        for (var i = 0; i < this._size; i++) {
            (0, cubismdebug_1.CubismLogDebug)('{0} ,', this._keyValues[i]);
            (0, cubismdebug_1.CubismLogDebug)('\n');
        }
    };
    csmMap.DefaultSize = 10; // コンテナの初期化のデフォルトサイズ
    return csmMap;
}());
exports.csmMap = csmMap;
/**
 * csmMap<T>のイテレータ
 */
var iterator = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function iterator(v, idx) {
        this._map = v != undefined ? v : new csmMap();
        this._index = idx != undefined ? idx : 0;
    }
    /**
     * =演算子のオーバーロード
     */
    iterator.prototype.set = function (ite) {
        this._index = ite._index;
        this._map = ite._map;
        return this;
    };
    /**
     * 前置き++演算子のオーバーロード
     */
    iterator.prototype.preIncrement = function () {
        ++this._index;
        return this;
    };
    /**
     * 前置き--演算子のオーバーロード
     */
    iterator.prototype.preDecrement = function () {
        --this._index;
        return this;
    };
    /**
     * 後置き++演算子のオーバーロード
     */
    iterator.prototype.increment = function () {
        var iteold = new iterator(this._map, this._index++); // 古い値を保存
        return iteold;
    };
    /**
     * 後置き--演算子のオーバーロード
     */
    iterator.prototype.decrement = function () {
        var iteold = new iterator(this._map, this._index); // 古い値を保存
        this._map = iteold._map;
        this._index = iteold._index;
        return this;
    };
    /**
     * *演算子のオーバーロード
     */
    iterator.prototype.ptr = function () {
        return this._map._keyValues[this._index];
    };
    /**
     * !=演算
     */
    iterator.prototype.notEqual = function (ite) {
        return this._index != ite._index || this._map != ite._map;
    };
    return iterator;
}());
exports.iterator = iterator;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmMap = $.csmMap;
    Live2DCubismFramework.csmPair = $.csmPair;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/type/csmrectf.ts":
/*!******************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/type/csmrectf.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.csmRect = void 0;
/**
 * 矩形形状（座標・長さはfloat値）を定義するクラス
 */
var csmRect = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param x 左端X座標
     * @param y 上端Y座標
     * @param w 幅
     * @param h 高さ
     */
    function csmRect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    /**
     * 矩形中央のX座標を取得する
     */
    csmRect.prototype.getCenterX = function () {
        return this.x + 0.5 * this.width;
    };
    /**
     * 矩形中央のY座標を取得する
     */
    csmRect.prototype.getCenterY = function () {
        return this.y + 0.5 * this.height;
    };
    /**
     * 右側のX座標を取得する
     */
    csmRect.prototype.getRight = function () {
        return this.x + this.width;
    };
    /**
     * 下端のY座標を取得する
     */
    csmRect.prototype.getBottom = function () {
        return this.y + this.height;
    };
    /**
     * 矩形に値をセットする
     * @param r 矩形のインスタンス
     */
    csmRect.prototype.setRect = function (r) {
        this.x = r.x;
        this.y = r.y;
        this.width = r.width;
        this.height = r.height;
    };
    /**
     * 矩形中央を軸にして縦横を拡縮する
     * @param w 幅方向に拡縮する量
     * @param h 高さ方向に拡縮する量
     */
    csmRect.prototype.expand = function (w, h) {
        this.x -= w;
        this.y -= h;
        this.width += w * 2.0;
        this.height += h * 2.0;
    };
    return csmRect;
}());
exports.csmRect = csmRect;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./csmrectf */ "../../../../CubismSdkForWeb/Framework/src/type/csmrectf.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmRect = $.csmRect;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts":
/*!*******************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.csmString = void 0;
/**
 * 文字列クラス。
 */
var csmString = /** @class */ (function () {
    /**
     * 引数付きコンストラクタ
     */
    function csmString(s) {
        this.s = s;
    }
    /**
     * 文字列を後方に追加する
     *
     * @param c 追加する文字列
     * @return 更新された文字列
     */
    csmString.prototype.append = function (c, length) {
        this.s += length !== undefined ? c.substr(0, length) : c;
        return this;
    };
    /**
     * 文字サイズを拡張して文字を埋める
     * @param length    拡張する文字数
     * @param v         埋める文字
     * @return 更新された文字列
     */
    csmString.prototype.expansion = function (length, v) {
        for (var i = 0; i < length; i++) {
            this.append(v);
        }
        return this;
    };
    /**
     * 文字列の長さをバイト数で取得する
     */
    csmString.prototype.getBytes = function () {
        return encodeURIComponent(this.s).replace(/%../g, 'x').length;
    };
    /**
     * 文字列の長さを返す
     */
    csmString.prototype.getLength = function () {
        return this.s.length;
    };
    /**
     * 文字列比較 <
     * @param s 比較する文字列
     * @return true:    比較する文字列より小さい
     * @return false:   比較する文字列より大きい
     */
    csmString.prototype.isLess = function (s) {
        return this.s < s.s;
    };
    /**
     * 文字列比較 >
     * @param s 比較する文字列
     * @return true:    比較する文字列より大きい
     * @return false:   比較する文字列より小さい
     */
    csmString.prototype.isGreat = function (s) {
        return this.s > s.s;
    };
    /**
     * 文字列比較 ==
     * @param s 比較する文字列
     * @return true:    比較する文字列と等しい
     * @return false:   比較する文字列と異なる
     */
    csmString.prototype.isEqual = function (s) {
        return this.s == s;
    };
    /**
     * 文字列が空かどうか
     * @return true: 空の文字列
     * @return false: 値が設定されている
     */
    csmString.prototype.isEmpty = function () {
        return this.s.length == 0;
    };
    return csmString;
}());
exports.csmString = csmString;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmString = $.csmString;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts":
/*!*******************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.iterator = exports.csmVector = void 0;
/**
 * ベクター型（可変配列型）
 */
var csmVector = /** @class */ (function () {
    /**
     * 引数付きコンストラクタ
     * @param iniitalCapacity 初期化後のキャパシティ。データサイズは_capacity * sizeof(T)
     * @param zeroClear trueなら初期化時に確保した領域を0で埋める
     */
    function csmVector(initialCapacity) {
        if (initialCapacity === void 0) { initialCapacity = 0; }
        if (initialCapacity < 1) {
            this._ptr = [];
            this._capacity = 0;
            this._size = 0;
        }
        else {
            this._ptr = new Array(initialCapacity);
            this._capacity = initialCapacity;
            this._size = 0;
        }
    }
    /**
     * インデックスで指定した要素を返す
     */
    csmVector.prototype.at = function (index) {
        return this._ptr[index];
    };
    /**
     * 要素をセット
     * @param index 要素をセットするインデックス
     * @param value セットする要素
     */
    csmVector.prototype.set = function (index, value) {
        this._ptr[index] = value;
    };
    /**
     * コンテナを取得する
     */
    csmVector.prototype.get = function (offset) {
        if (offset === void 0) { offset = 0; }
        var ret = new Array();
        for (var i = offset; i < this._size; i++) {
            ret.push(this._ptr[i]);
        }
        return ret;
    };
    /**
     * pushBack処理、コンテナに新たな要素を追加する
     * @param value PushBack処理で追加する値
     */
    csmVector.prototype.pushBack = function (value) {
        if (this._size >= this._capacity) {
            this.prepareCapacity(this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2);
        }
        this._ptr[this._size++] = value;
    };
    /**
     * コンテナの全要素を解放する
     */
    csmVector.prototype.clear = function () {
        this._ptr.length = 0;
        this._size = 0;
    };
    /**
     * コンテナの要素数を返す
     * @return コンテナの要素数
     */
    csmVector.prototype.getSize = function () {
        return this._size;
    };
    /**
     * コンテナの全要素に対して代入処理を行う
     * @param newSize 代入処理後のサイズ
     * @param value 要素に代入する値
     */
    csmVector.prototype.assign = function (newSize, value) {
        var curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
        }
        for (var i = 0; i < newSize; i++) {
            this._ptr[i] = value;
        }
        this._size = newSize;
    };
    /**
     * サイズ変更
     */
    csmVector.prototype.resize = function (newSize, value) {
        if (value === void 0) { value = null; }
        this.updateSize(newSize, value, true);
    };
    /**
     * サイズ変更
     */
    csmVector.prototype.updateSize = function (newSize, value, callPlacementNew) {
        if (value === void 0) { value = null; }
        if (callPlacementNew === void 0) { callPlacementNew = true; }
        var curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
            if (callPlacementNew) {
                for (var i = this._size; i < newSize; i++) {
                    if (typeof value == 'function') {
                        // new
                        this._ptr[i] = JSON.parse(JSON.stringify(new value()));
                    } // プリミティブ型なので値渡し
                    else {
                        this._ptr[i] = value;
                    }
                }
            }
            else {
                for (var i = this._size; i < newSize; i++) {
                    this._ptr[i] = value;
                }
            }
        }
        else {
            // newSize <= this._size
            //---
            var sub = this._size - newSize;
            this._ptr.splice(this._size - sub, sub); // 不要なので破棄する
        }
        this._size = newSize;
    };
    /**
     * コンテナにコンテナ要素を挿入する
     * @param position 挿入する位置
     * @param begin 挿入するコンテナの開始位置
     * @param end 挿入するコンテナの終端位置
     */
    csmVector.prototype.insert = function (position, begin, end) {
        var dstSi = position._index;
        var srcSi = begin._index;
        var srcEi = end._index;
        var addCount = srcEi - srcSi;
        this.prepareCapacity(this._size + addCount);
        // 挿入用の既存データをシフトして隙間を作る
        var addSize = this._size - dstSi;
        if (addSize > 0) {
            for (var i = 0; i < addSize; i++) {
                this._ptr.splice(dstSi + i, 0, null);
            }
        }
        for (var i = srcSi; i < srcEi; i++, dstSi++) {
            this._ptr[dstSi] = begin._vector._ptr[i];
        }
        this._size = this._size + addCount;
    };
    /**
     * コンテナからインデックスで指定した要素を削除する
     * @param index インデックス値
     * @return true 削除実行
     * @return false 削除範囲外
     */
    csmVector.prototype.remove = function (index) {
        if (index < 0 || this._size <= index) {
            return false; // 削除範囲外
        }
        this._ptr.splice(index, 1);
        --this._size;
        return true;
    };
    /**
     * コンテナから要素を削除して他の要素をシフトする
     * @param ite 削除する要素
     */
    csmVector.prototype.erase = function (ite) {
        var index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // 削除範囲外
        }
        // 削除
        this._ptr.splice(index, 1);
        --this._size;
        var ite2 = new iterator(this, index); // 終了
        return ite2;
    };
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない.
     */
    csmVector.prototype.prepareCapacity = function (newSize) {
        if (newSize > this._capacity) {
            if (this._capacity == 0) {
                this._ptr = new Array(newSize);
                this._capacity = newSize;
            }
            else {
                this._ptr.length = newSize;
                this._capacity = newSize;
            }
        }
    };
    /**
     * コンテナの先頭要素を返す
     */
    csmVector.prototype.begin = function () {
        var ite = this._size == 0 ? this.end() : new iterator(this, 0);
        return ite;
    };
    /**
     * コンテナの終端要素を返す
     */
    csmVector.prototype.end = function () {
        var ite = new iterator(this, this._size);
        return ite;
    };
    csmVector.prototype.getOffset = function (offset) {
        var newVector = new csmVector();
        newVector._ptr = this.get(offset);
        newVector._size = this.get(offset).length;
        newVector._capacity = this.get(offset).length;
        return newVector;
    };
    csmVector.s_defaultSize = 10; // コンテナ初期化のデフォルトサイズ
    return csmVector;
}());
exports.csmVector = csmVector;
var iterator = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function iterator(v, index) {
        this._vector = v != undefined ? v : null;
        this._index = index != undefined ? index : 0;
    }
    /**
     * 代入
     */
    iterator.prototype.set = function (ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    };
    /**
     * 前置き++演算
     */
    iterator.prototype.preIncrement = function () {
        ++this._index;
        return this;
    };
    /**
     * 前置き--演算
     */
    iterator.prototype.preDecrement = function () {
        --this._index;
        return this;
    };
    /**
     * 後置き++演算子
     */
    iterator.prototype.increment = function () {
        var iteold = new iterator(this._vector, this._index++); // 古い値を保存
        return iteold;
    };
    /**
     * 後置き--演算子
     */
    iterator.prototype.decrement = function () {
        var iteold = new iterator(this._vector, this._index--); // 古い値を保存
        return iteold;
    };
    /**
     * ptr
     */
    iterator.prototype.ptr = function () {
        return this._vector._ptr[this._index];
    };
    /**
     * =演算子のオーバーロード
     */
    iterator.prototype.substitution = function (ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    };
    /**
     * !=演算子のオーバーロード
     */
    iterator.prototype.notEqual = function (ite) {
        return this._index != ite._index || this._vector != ite._vector;
    };
    return iterator;
}());
exports.iterator = iterator;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmVector = $.csmVector;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts":
/*!**********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.CubismDebug = exports.CubismLogError = exports.CubismLogWarning = exports.CubismLogInfo = exports.CubismLogDebug = exports.CubismLogVerbose = exports.CSM_ASSERT = exports.CubismLogPrintIn = exports.CubismLogPrint = void 0;
var cubismframeworkconfig_1 = __webpack_require__(/*! ../cubismframeworkconfig */ "../../../../CubismSdkForWeb/Framework/src/cubismframeworkconfig.ts");
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var CubismLogPrint = function (level, fmt, args) {
    CubismDebug.print(level, '[CSM]' + fmt, args);
};
exports.CubismLogPrint = CubismLogPrint;
var CubismLogPrintIn = function (level, fmt, args) {
    (0, exports.CubismLogPrint)(level, fmt + '\n', args);
};
exports.CubismLogPrintIn = CubismLogPrintIn;
var CSM_ASSERT = function (expr) {
    console.assert(expr);
};
exports.CSM_ASSERT = CSM_ASSERT;
if (cubismframeworkconfig_1.CSM_LOG_LEVEL <= cubismframeworkconfig_1.CSM_LOG_LEVEL_VERBOSE) {
    exports.CubismLogVerbose = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Verbose, '[V]' + fmt, args);
    };
    exports.CubismLogDebug = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Debug, '[D]' + fmt, args);
    };
    exports.CubismLogInfo = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Info, '[I]' + fmt, args);
    };
    exports.CubismLogWarning = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Warning, '[W]' + fmt, args);
    };
    exports.CubismLogError = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Error, '[E]' + fmt, args);
    };
}
else if (cubismframeworkconfig_1.CSM_LOG_LEVEL == cubismframeworkconfig_1.CSM_LOG_LEVEL_DEBUG) {
    exports.CubismLogDebug = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Debug, '[D]' + fmt, args);
    };
    exports.CubismLogInfo = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Info, '[I]' + fmt, args);
    };
    exports.CubismLogWarning = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Warning, '[W]' + fmt, args);
    };
    exports.CubismLogError = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Error, '[E]' + fmt, args);
    };
}
else if (cubismframeworkconfig_1.CSM_LOG_LEVEL == cubismframeworkconfig_1.CSM_LOG_LEVEL_INFO) {
    exports.CubismLogInfo = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Info, '[I]' + fmt, args);
    };
    exports.CubismLogWarning = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Warning, '[W]' + fmt, args);
    };
    exports.CubismLogError = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Error, '[E]' + fmt, args);
    };
}
else if (cubismframeworkconfig_1.CSM_LOG_LEVEL == cubismframeworkconfig_1.CSM_LOG_LEVEL_WARNING) {
    exports.CubismLogWarning = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Warning, '[W]' + fmt, args);
    };
    exports.CubismLogError = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Error, '[E]' + fmt, args);
    };
}
else if (cubismframeworkconfig_1.CSM_LOG_LEVEL == cubismframeworkconfig_1.CSM_LOG_LEVEL_ERROR) {
    exports.CubismLogError = function (fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, exports.CubismLogPrintIn)(live2dcubismframework_1.LogLevel.LogLevel_Error, '[E]' + fmt, args);
    };
}
/**
 * デバッグ用のユーティリティクラス。
 * ログの出力、バイトのダンプなど
 */
var CubismDebug = /** @class */ (function () {
    /**
     * private コンストラクタ
     */
    function CubismDebug() {
    }
    /**
     * ログを出力する。第一引数にログレベルを設定する。
     * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
     *
     * @param logLevel ログレベルの設定
     * @param format 書式付き文字列
     * @param args 可変長引数
     */
    CubismDebug.print = function (logLevel, format, args) {
        // オプションで設定されたログ出力レベルを下回る場合はログに出さない
        if (logLevel < live2dcubismframework_1.CubismFramework.getLoggingLevel()) {
            return;
        }
        var logPrint = live2dcubismframework_1.CubismFramework.coreLogFunction;
        if (!logPrint)
            return;
        var buffer = format.replace(/\{(\d+)\}/g, function (m, k) {
            return args[k];
        });
        logPrint(buffer);
    };
    /**
     * データから指定した長さだけダンプ出力する。
     * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
     *
     * @param logLevel ログレベルの設定
     * @param data ダンプするデータ
     * @param length ダンプする長さ
     */
    CubismDebug.dumpBytes = function (logLevel, data, length) {
        for (var i = 0; i < length; i++) {
            if (i % 16 == 0 && i > 0)
                this.print(logLevel, '\n');
            else if (i % 8 == 0 && i > 0)
                this.print(logLevel, '  ');
            this.print(logLevel, '{0} ', [data[i] & 0xff]);
        }
        this.print(logLevel, '\n');
    };
    return CubismDebug;
}());
exports.CubismDebug = CubismDebug;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismDebug = $.CubismDebug;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts":
/*!*********************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismFramework = exports.JsonMap = exports.JsonArray = exports.JsonNullvalue = exports.JsonError = exports.JsonString = exports.JsonBoolean = exports.JsonFloat = exports.CubismJson = exports.Value = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var csmmap_1 = __webpack_require__(/*! ../type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmstring_1 = __webpack_require__(/*! ../type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var csmvector_1 = __webpack_require__(/*! ../type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! ./cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
// StaticInitializeNotForClientCall()で初期化する
var CSM_JSON_ERROR_TYPE_MISMATCH = 'Error: type mismatch';
var CSM_JSON_ERROR_INDEX_OF_BOUNDS = 'Error: index out of bounds';
/**
 * パースしたJSONエレメントの要素の基底クラス。
 */
var Value = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function Value() {
    }
    /**
     * 要素を文字列型で返す(string)
     */
    Value.prototype.getRawString = function (defaultValue, indent) {
        return this.getString(defaultValue, indent);
    };
    /**
     * 要素を数値型で返す(number)
     */
    Value.prototype.toInt = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return defaultValue;
    };
    /**
     * 要素を数値型で返す(number)
     */
    Value.prototype.toFloat = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return defaultValue;
    };
    /**
     * 要素を真偽値で返す(boolean)
     */
    Value.prototype.toBoolean = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        return defaultValue;
    };
    /**
     * サイズを返す
     */
    Value.prototype.getSize = function () {
        return 0;
    };
    /**
     * 要素を配列で返す(Value[])
     */
    Value.prototype.getArray = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return defaultValue;
    };
    /**
     * 要素をコンテナで返す(array)
     */
    Value.prototype.getVector = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = new csmvector_1.csmVector(); }
        return defaultValue;
    };
    /**
     * 要素をマップで返す(csmMap<csmString, Value>)
     */
    Value.prototype.getMap = function (defaultValue) {
        return defaultValue;
    };
    /**
     * 添字演算子[index]
     */
    Value.prototype.getValueByIndex = function (index) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    };
    /**
     * 添字演算子[string | csmString]
     */
    Value.prototype.getValueByString = function (s) {
        return Value.nullValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    };
    /**
     * マップのキー一覧をコンテナで返す
     *
     * @return マップのキーの一覧
     */
    Value.prototype.getKeys = function () {
        return Value.s_dummyKeys;
    };
    /**
     * Valueの種類がエラー値ならtrue
     */
    Value.prototype.isError = function () {
        return false;
    };
    /**
     * Valueの種類がnullならtrue
     */
    Value.prototype.isNull = function () {
        return false;
    };
    /**
     * Valueの種類が真偽値ならtrue
     */
    Value.prototype.isBool = function () {
        return false;
    };
    /**
     * Valueの種類が数値型ならtrue
     */
    Value.prototype.isFloat = function () {
        return false;
    };
    /**
     * Valueの種類が文字列ならtrue
     */
    Value.prototype.isString = function () {
        return false;
    };
    /**
     * Valueの種類が配列ならtrue
     */
    Value.prototype.isArray = function () {
        return false;
    };
    /**
     * Valueの種類がマップ型ならtrue
     */
    Value.prototype.isMap = function () {
        return false;
    };
    Value.prototype.equals = function (value) {
        return false;
    };
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    Value.prototype.isStatic = function () {
        return false;
    };
    /**
     * Valueにエラー値をセットする
     */
    Value.prototype.setErrorNotForClientCall = function (errorStr) {
        return JsonError.errorValue;
    };
    /**
     * 初期化用メソッド
     */
    Value.staticInitializeNotForClientCall = function () {
        JsonBoolean.trueValue = new JsonBoolean(true);
        JsonBoolean.falseValue = new JsonBoolean(false);
        Value.errorValue = new JsonError('ERROR', true);
        Value.nullValue = new JsonNullvalue();
        Value.s_dummyKeys = new csmvector_1.csmVector();
    };
    /**
     * リリース用メソッド
     */
    Value.staticReleaseNotForClientCall = function () {
        JsonBoolean.trueValue = null;
        JsonBoolean.falseValue = null;
        Value.errorValue = null;
        Value.nullValue = null;
        Value.s_dummyKeys = null;
    };
    return Value;
}());
exports.Value = Value;
/**
 * Ascii文字のみ対応した最小限の軽量JSONパーサ。
 * 仕様はJSONのサブセットとなる。
 * 設定ファイル(model3.json)などのロード用
 *
 * [未対応項目]
 * ・日本語などの非ASCII文字
 * ・eによる指数表現
 */
var CubismJson = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismJson(buffer, length) {
        this._parseCallback = cubismjsonextension_1.CubismJsonExtension.parseJsonObject; // パース時に使う処理のコールバック関数
        this._error = null;
        this._lineCount = 0;
        this._root = null;
        if (buffer != undefined) {
            this.parseBytes(buffer, length, this._parseCallback);
        }
    }
    /**
     * バイトデータから直接ロードしてパースする
     *
     * @param buffer バッファ
     * @param size バッファサイズ
     * @return CubismJsonクラスのインスタンス。失敗したらNULL
     */
    CubismJson.create = function (buffer, size) {
        var json = new CubismJson();
        var succeeded = json.parseBytes(buffer, size, json._parseCallback);
        if (!succeeded) {
            CubismJson.delete(json);
            return null;
        }
        else {
            return json;
        }
    };
    /**
     * パースしたJSONオブジェクトの解放処理
     *
     * @param instance CubismJsonクラスのインスタンス
     */
    CubismJson.delete = function (instance) {
        instance = null;
    };
    /**
     * パースしたJSONのルート要素を返す
     */
    CubismJson.prototype.getRoot = function () {
        return this._root;
    };
    /**
     *  UnicodeのバイナリをStringに変換
     *
     * @param buffer 変換するバイナリデータ
     * @return 変換後の文字列
     */
    CubismJson.arrayBufferToString = function (buffer) {
        var uint8Array = new Uint8Array(buffer);
        var str = '';
        for (var i = 0, len = uint8Array.length; i < len; ++i) {
            str += '%' + this.pad(uint8Array[i].toString(16));
        }
        str = decodeURIComponent(str);
        return str;
    };
    /**
     * エンコード、パディング
     */
    CubismJson.pad = function (n) {
        return n.length < 2 ? '0' + n : n;
    };
    /**
     * JSONのパースを実行する
     * @param buffer    パース対象のデータバイト
     * @param size      データバイトのサイズ
     * return true : 成功
     * return false: 失敗
     */
    CubismJson.prototype.parseBytes = function (buffer, size, parseCallback) {
        var endPos = new Array(1); // 参照渡しにするため配列
        var decodeBuffer = CubismJson.arrayBufferToString(buffer);
        if (parseCallback == undefined) {
            this._root = this.parseValue(decodeBuffer, size, 0, endPos);
        }
        else {
            // TypeScript標準のJSONパーサを使う
            this._root = parseCallback(JSON.parse(decodeBuffer), new JsonMap());
        }
        if (this._error) {
            var strbuf = '\0';
            strbuf = 'Json parse error : @line ' + (this._lineCount + 1) + '\n';
            this._root = new JsonString(strbuf);
            (0, cubismdebug_1.CubismLogInfo)('{0}', this._root.getRawString());
            return false;
        }
        else if (this._root == null) {
            this._root = new JsonError(new csmstring_1.csmString(this._error), false); // rootは解放されるのでエラーオブジェクトを別途作成する
            return false;
        }
        return true;
    };
    /**
     * パース時のエラー値を返す
     */
    CubismJson.prototype.getParseError = function () {
        return this._error;
    };
    /**
     * ルート要素の次の要素がファイルの終端だったらtrueを返す
     */
    CubismJson.prototype.checkEndOfFile = function () {
        return this._root.getArray()[1].equals('EOF');
    };
    /**
     * JSONエレメントからValue(float,String,Value*,Array,null,true,false)をパースする
     * エレメントの書式に応じて内部でParseString(), ParseObject(), ParseArray()を呼ぶ
     *
     * @param   buffer      JSONエレメントのバッファ
     * @param   length      パースする長さ
     * @param   begin       パースを開始する位置
     * @param   outEndPos   パース終了時の位置
     * @return      パースから取得したValueオブジェクト
     */
    CubismJson.prototype.parseValue = function (buffer, length, begin, outEndPos) {
        if (this._error)
            return null;
        var o = null;
        var i = begin;
        var f;
        for (; i < length; i++) {
            var c = buffer[i];
            switch (c) {
                case '-':
                case '.':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9': {
                    var afterString = new Array(1); // 参照渡しにするため
                    f = (0, live2dcubismframework_1.strtod)(buffer.slice(i), afterString);
                    outEndPos[0] = buffer.indexOf(afterString[0]);
                    return new JsonFloat(f);
                }
                case '"':
                    return new JsonString(this.parseString(buffer, length, i + 1, outEndPos)); // \"の次の文字から
                case '[':
                    o = this.parseArray(buffer, length, i + 1, outEndPos);
                    return o;
                case '{':
                    o = this.parseObject(buffer, length, i + 1, outEndPos);
                    return o;
                case 'n': // null以外にない
                    if (i + 3 < length) {
                        o = new JsonNullvalue(); // 解放できるようにする
                        outEndPos[0] = i + 4;
                    }
                    else {
                        this._error = 'parse null';
                    }
                    return o;
                case 't': // true以外にない
                    if (i + 3 < length) {
                        o = JsonBoolean.trueValue;
                        outEndPos[0] = i + 4;
                    }
                    else {
                        this._error = 'parse true';
                    }
                    return o;
                case 'f': // false以外にない
                    if (i + 4 < length) {
                        o = JsonBoolean.falseValue;
                        outEndPos[0] = i + 5;
                    }
                    else {
                        this._error = "illegal ',' position";
                    }
                    return o;
                case ',': // Array separator
                    this._error = "illegal ',' position";
                    return null;
                case ']': // 不正な｝だがスキップする。配列の最後に不要な , があると思われる
                    outEndPos[0] = i; // 同じ文字を再処理
                    return null;
                case '\n':
                    this._lineCount++;
                case ' ':
                case '\t':
                case '\r':
                default:
                    // スキップ
                    break;
            }
        }
        this._error = 'illegal end of value';
        return null;
    };
    /**
     * 次の「"」までの文字列をパースする。
     *
     * @param   string  ->  パース対象の文字列
     * @param   length  ->  パースする長さ
     * @param   begin   ->  パースを開始する位置
     * @param  outEndPos   ->  パース終了時の位置
     * @return      パースした文F字列要素
     */
    CubismJson.prototype.parseString = function (string, length, begin, outEndPos) {
        if (this._error)
            return null;
        var i = begin;
        var c, c2;
        var ret = new csmstring_1.csmString('');
        var bufStart = begin; // sbufに登録されていない文字の開始位置
        for (; i < length; i++) {
            c = string[i];
            switch (c) {
                case '"': {
                    // 終端の”、エスケープ文字は別に処理されるのでここに来ない
                    outEndPos[0] = i + 1; // ”の次の文字
                    ret.append(string.slice(bufStart), i - bufStart); // 前の文字までを登録する
                    return ret.s;
                }
                case '//': {
                    // エスケープの場合
                    i++; // ２文字をセットで扱う
                    if (i - 1 > bufStart) {
                        ret.append(string.slice(bufStart), i - bufStart); // 前の文字までを登録する
                    }
                    bufStart = i + 1; // エスケープ（２文字)の次の文字から
                    if (i < length) {
                        c2 = string[i];
                        switch (c2) {
                            case '\\':
                                ret.expansion(1, '\\');
                                break;
                            case '"':
                                ret.expansion(1, '"');
                                break;
                            case '/':
                                ret.expansion(1, '/');
                                break;
                            case 'b':
                                ret.expansion(1, '\b');
                                break;
                            case 'f':
                                ret.expansion(1, '\f');
                                break;
                            case 'n':
                                ret.expansion(1, '\n');
                                break;
                            case 'r':
                                ret.expansion(1, '\r');
                                break;
                            case 't':
                                ret.expansion(1, '\t');
                                break;
                            case 'u':
                                this._error = 'parse string/unicord escape not supported';
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        this._error = 'parse string/escape error';
                    }
                }
                default: {
                    break;
                }
            }
        }
        this._error = 'parse string/illegal end';
        return null;
    };
    /**
     * JSONのオブジェクトエレメントをパースしてValueオブジェクトを返す
     *
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    CubismJson.prototype.parseObject = function (buffer, length, begin, outEndPos) {
        if (this._error)
            return null;
        var ret = new JsonMap();
        // Key: Value
        var key = '';
        var i = begin;
        var c = '';
        var localRetEndPos2 = Array(1);
        var ok = false;
        // , が続く限りループ
        for (; i < length; i++) {
            FOR_LOOP: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case '"':
                        key = this.parseString(buffer, length, i + 1, localRetEndPos2);
                        if (this._error) {
                            return null;
                        }
                        i = localRetEndPos2[0];
                        ok = true;
                        break FOR_LOOP; //-- loopから出る
                    case '}': // 閉じカッコ
                        outEndPos[0] = i + 1;
                        return ret; // 空
                    case ':':
                        this._error = "illegal ':' position";
                        break;
                    case '\n':
                        this._lineCount++;
                    default:
                        break; // スキップする文字
                }
            }
            if (!ok) {
                this._error = 'key not found';
                return null;
            }
            ok = false;
            // : をチェック
            FOR_LOOP2: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ':':
                        ok = true;
                        i++;
                        break FOR_LOOP2;
                    case '}':
                        this._error = "illegal '}' position";
                        break;
                    case '\n':
                        this._lineCount++;
                    // case ' ': case '\t' : case '\r':
                    default:
                        break; // スキップする文字
                }
            }
            if (!ok) {
                this._error = "':' not found";
                return null;
            }
            // 値をチェック
            var value = this.parseValue(buffer, length, i, localRetEndPos2);
            if (this._error) {
                return null;
            }
            i = localRetEndPos2[0];
            // ret.put(key, value);
            ret.put(key, value);
            FOR_LOOP3: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ',':
                        break FOR_LOOP3;
                    case '}':
                        outEndPos[0] = i + 1;
                        return ret; // 正常終了
                    case '\n':
                        this._lineCount++;
                    default:
                        break; // スキップ
                }
            }
        }
        this._error = 'illegal end of perseObject';
        return null;
    };
    /**
     * 次の「"」までの文字列をパースする。
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    CubismJson.prototype.parseArray = function (buffer, length, begin, outEndPos) {
        if (this._error)
            return null;
        var ret = new JsonArray();
        // key : value
        var i = begin;
        var c;
        var localRetEndpos2 = new Array(1);
        // , が続く限りループ
        for (; i < length; i++) {
            // : をチェック
            var value = this.parseValue(buffer, length, i, localRetEndpos2);
            if (this._error) {
                return null;
            }
            i = localRetEndpos2[0];
            if (value) {
                ret.add(value);
            }
            // FOR_LOOP3:
            // boolean breakflag = false;
            FOR_LOOP: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ',':
                        // breakflag = true;
                        // break; // 次のKEY, VAlUEへ
                        break FOR_LOOP;
                    case ']':
                        outEndPos[0] = i + 1;
                        return ret; // 終了
                    case '\n':
                        ++this._lineCount;
                    //case ' ': case '\t': case '\r':
                    default:
                        break; // スキップ
                }
            }
        }
        ret = void 0;
        this._error = 'illegal end of parseObject';
        return null;
    };
    return CubismJson;
}());
exports.CubismJson = CubismJson;
/**
 * パースしたJSONの要素をfloat値として扱う
 */
var JsonFloat = /** @class */ (function (_super) {
    __extends(JsonFloat, _super);
    /**
     * コンストラクタ
     */
    function JsonFloat(v) {
        var _this = _super.call(this) || this;
        _this._value = v;
        return _this;
    }
    /**
     * Valueの種類が数値型ならtrue
     */
    JsonFloat.prototype.isFloat = function () {
        return true;
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonFloat.prototype.getString = function (defaultValue, indent) {
        var strbuf = '\0';
        this._value = parseFloat(strbuf);
        this._stringBuffer = strbuf;
        return this._stringBuffer;
    };
    /**
     * 要素を数値型で返す(number)
     */
    JsonFloat.prototype.toInt = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return parseInt(this._value.toString());
    };
    /**
     * 要素を数値型で返す(number)
     */
    JsonFloat.prototype.toFloat = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0.0; }
        return this._value;
    };
    JsonFloat.prototype.equals = function (value) {
        if ('number' === typeof value) {
            // int
            if (Math.round(value)) {
                return false;
            }
            // float
            else {
                return value == this._value;
            }
        }
        return false;
    };
    return JsonFloat;
}(Value));
exports.JsonFloat = JsonFloat;
/**
 * パースしたJSONの要素を真偽値として扱う
 */
var JsonBoolean = /** @class */ (function (_super) {
    __extends(JsonBoolean, _super);
    /**
     * 引数付きコンストラクタ
     */
    function JsonBoolean(v) {
        var _this = _super.call(this) || this;
        _this._boolValue = v;
        return _this;
    }
    /**
     * Valueの種類が真偽値ならtrue
     */
    JsonBoolean.prototype.isBool = function () {
        return true;
    };
    /**
     * 要素を真偽値で返す(boolean)
     */
    JsonBoolean.prototype.toBoolean = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        return this._boolValue;
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonBoolean.prototype.getString = function (defaultValue, indent) {
        this._stringBuffer = this._boolValue ? 'true' : 'false';
        return this._stringBuffer;
    };
    JsonBoolean.prototype.equals = function (value) {
        if ('boolean' === typeof value) {
            return value == this._boolValue;
        }
        return false;
    };
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    JsonBoolean.prototype.isStatic = function () {
        return true;
    };
    return JsonBoolean;
}(Value));
exports.JsonBoolean = JsonBoolean;
/**
 * パースしたJSONの要素を文字列として扱う
 */
var JsonString = /** @class */ (function (_super) {
    __extends(JsonString, _super);
    function JsonString(s) {
        var _this = _super.call(this) || this;
        if ('string' === typeof s) {
            _this._stringBuffer = s;
        }
        if (s instanceof csmstring_1.csmString) {
            _this._stringBuffer = s.s;
        }
        return _this;
    }
    /**
     * Valueの種類が文字列ならtrue
     */
    JsonString.prototype.isString = function () {
        return true;
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonString.prototype.getString = function (defaultValue, indent) {
        return this._stringBuffer;
    };
    JsonString.prototype.equals = function (value) {
        if ('string' === typeof value) {
            return this._stringBuffer == value;
        }
        if (value instanceof csmstring_1.csmString) {
            return this._stringBuffer == value.s;
        }
        return false;
    };
    return JsonString;
}(Value));
exports.JsonString = JsonString;
/**
 * JSONパース時のエラー結果。文字列型のようにふるまう
 */
var JsonError = /** @class */ (function (_super) {
    __extends(JsonError, _super);
    /**
     * 引数付きコンストラクタ
     */
    function JsonError(s, isStatic) {
        var _this = this;
        if ('string' === typeof s) {
            _this = _super.call(this, s) || this;
        }
        else {
            _this = _super.call(this, s) || this;
        }
        _this._isStatic = isStatic;
        return _this;
    }
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    JsonError.prototype.isStatic = function () {
        return this._isStatic;
    };
    /**
     * エラー情報をセットする
     */
    JsonError.prototype.setErrorNotForClientCall = function (s) {
        this._stringBuffer = s;
        return this;
    };
    /**
     * Valueの種類がエラー値ならtrue
     */
    JsonError.prototype.isError = function () {
        return true;
    };
    return JsonError;
}(JsonString));
exports.JsonError = JsonError;
/**
 * パースしたJSONの要素をNULL値として持つ
 */
var JsonNullvalue = /** @class */ (function (_super) {
    __extends(JsonNullvalue, _super);
    /**
     * コンストラクタ
     */
    function JsonNullvalue() {
        var _this = _super.call(this) || this;
        _this._stringBuffer = 'NullValue';
        return _this;
    }
    /**
     * Valueの種類がNULL値ならtrue
     */
    JsonNullvalue.prototype.isNull = function () {
        return true;
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonNullvalue.prototype.getString = function (defaultValue, indent) {
        return this._stringBuffer;
    };
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    JsonNullvalue.prototype.isStatic = function () {
        return true;
    };
    /**
     * Valueにエラー値をセットする
     */
    JsonNullvalue.prototype.setErrorNotForClientCall = function (s) {
        this._stringBuffer = s;
        return JsonError.nullValue;
    };
    return JsonNullvalue;
}(Value));
exports.JsonNullvalue = JsonNullvalue;
/**
 * パースしたJSONの要素を配列として持つ
 */
var JsonArray = /** @class */ (function (_super) {
    __extends(JsonArray, _super);
    /**
     * コンストラクタ
     */
    function JsonArray() {
        var _this = _super.call(this) || this;
        _this._array = new csmvector_1.csmVector();
        return _this;
    }
    /**
     * デストラクタ相当の処理
     */
    JsonArray.prototype.release = function () {
        for (var ite = this._array.begin(); ite.notEqual(this._array.end()); ite.preIncrement()) {
            var v = ite.ptr();
            if (v && !v.isStatic()) {
                v = void 0;
                v = null;
            }
        }
    };
    /**
     * Valueの種類が配列ならtrue
     */
    JsonArray.prototype.isArray = function () {
        return true;
    };
    /**
     * 添字演算子[index]
     */
    JsonArray.prototype.getValueByIndex = function (index) {
        if (index < 0 || this._array.getSize() <= index) {
            return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_INDEX_OF_BOUNDS);
        }
        var v = this._array.at(index);
        if (v == null) {
            return Value.nullValue;
        }
        return v;
    };
    /**
     * 添字演算子[string | csmString]
     */
    JsonArray.prototype.getValueByString = function (s) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonArray.prototype.getString = function (defaultValue, indent) {
        var stringBuffer = indent + '[\n';
        for (var ite = this._array.begin(); ite.notEqual(this._array.end()); ite.increment()) {
            var v = ite.ptr();
            this._stringBuffer += indent + '' + v.getString(indent + ' ') + '\n';
        }
        this._stringBuffer = stringBuffer + indent + ']\n';
        return this._stringBuffer;
    };
    /**
     * 配列要素を追加する
     * @param v 追加する要素
     */
    JsonArray.prototype.add = function (v) {
        this._array.pushBack(v);
    };
    /**
     * 要素をコンテナで返す(csmVector<Value>)
     */
    JsonArray.prototype.getVector = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return this._array;
    };
    /**
     * 要素の数を返す
     */
    JsonArray.prototype.getSize = function () {
        return this._array.getSize();
    };
    return JsonArray;
}(Value));
exports.JsonArray = JsonArray;
/**
 * パースしたJSONの要素をマップとして持つ
 */
var JsonMap = /** @class */ (function (_super) {
    __extends(JsonMap, _super);
    /**
     * コンストラクタ
     */
    function JsonMap() {
        var _this = _super.call(this) || this;
        _this._map = new csmmap_1.csmMap();
        return _this;
    }
    /**
     * デストラクタ相当の処理
     */
    JsonMap.prototype.release = function () {
        var ite = this._map.begin();
        while (ite.notEqual(this._map.end())) {
            var v = ite.ptr().second;
            if (v && !v.isStatic()) {
                v = void 0;
                v = null;
            }
            ite.preIncrement();
        }
    };
    /**
     * Valueの値がMap型ならtrue
     */
    JsonMap.prototype.isMap = function () {
        return true;
    };
    /**
     * 添字演算子[string | csmString]
     */
    JsonMap.prototype.getValueByString = function (s) {
        if (s instanceof csmstring_1.csmString) {
            var ret = this._map.getValue(s.s);
            if (ret == null) {
                return Value.nullValue;
            }
            return ret;
        }
        for (var iter = this._map.begin(); iter.notEqual(this._map.end()); iter.preIncrement()) {
            if (iter.ptr().first == s) {
                if (iter.ptr().second == null) {
                    return Value.nullValue;
                }
                return iter.ptr().second;
            }
        }
        return Value.nullValue;
    };
    /**
     * 添字演算子[index]
     */
    JsonMap.prototype.getValueByIndex = function (index) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    };
    /**
     * 要素を文字列で返す(csmString型)
     */
    JsonMap.prototype.getString = function (defaultValue, indent) {
        this._stringBuffer = indent + '{\n';
        var ite = this._map.begin();
        while (ite.notEqual(this._map.end())) {
            var key = ite.ptr().first;
            var v = ite.ptr().second;
            this._stringBuffer +=
                indent + ' ' + key + ' : ' + v.getString(indent + '   ') + ' \n';
            ite.preIncrement();
        }
        this._stringBuffer += indent + '}\n';
        return this._stringBuffer;
    };
    /**
     * 要素をMap型で返す
     */
    JsonMap.prototype.getMap = function (defaultValue) {
        return this._map;
    };
    /**
     * Mapに要素を追加する
     */
    JsonMap.prototype.put = function (key, v) {
        this._map.setValue(key, v);
    };
    /**
     * Mapからキーのリストを取得する
     */
    JsonMap.prototype.getKeys = function () {
        if (!this._keys) {
            this._keys = new csmvector_1.csmVector();
            var ite = this._map.begin();
            while (ite.notEqual(this._map.end())) {
                var key = ite.ptr().first;
                this._keys.pushBack(key);
                ite.preIncrement();
            }
        }
        return this._keys;
    };
    /**
     * Mapの要素数を取得する
     */
    JsonMap.prototype.getSize = function () {
        return this._keys.getSize();
    };
    return JsonMap;
}(Value));
exports.JsonMap = JsonMap;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts"));
var cubismjsonextension_1 = __webpack_require__(/*! ./cubismjsonextension */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjsonextension.ts");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismJson = $.CubismJson;
    Live2DCubismFramework.JsonArray = $.JsonArray;
    Live2DCubismFramework.JsonBoolean = $.JsonBoolean;
    Live2DCubismFramework.JsonError = $.JsonError;
    Live2DCubismFramework.JsonFloat = $.JsonFloat;
    Live2DCubismFramework.JsonMap = $.JsonMap;
    Live2DCubismFramework.JsonNullvalue = $.JsonNullvalue;
    Live2DCubismFramework.JsonString = $.JsonString;
    Live2DCubismFramework.Value = $.Value;
})(Live2DCubismFramework || (exports.Live2DCubismFramework = Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjsonextension.ts":
/*!******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Framework/src/utils/cubismjsonextension.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CubismJsonExtension = void 0;
var cubismjson_1 = __webpack_require__(/*! ./cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
/**
 * CubismJsonで実装されているJsonパーサを使用せず、
 * TypeScript標準のJsonパーサなどを使用し出力された結果を
 * Cubism SDKで定義されているJSONエレメントの要素に
 * 置き換える処理をするクラス。
 */
var CubismJsonExtension = /** @class */ (function () {
    function CubismJsonExtension() {
    }
    CubismJsonExtension.parseJsonObject = function (obj, map) {
        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] == 'boolean') {
                var convValue = Boolean(obj[key]);
                map.put(key, new cubismjson_1.JsonBoolean(convValue));
            }
            else if (typeof obj[key] == 'string') {
                var convValue = String(obj[key]);
                map.put(key, new cubismjson_1.JsonString(convValue));
            }
            else if (typeof obj[key] == 'number') {
                var convValue = Number(obj[key]);
                map.put(key, new cubismjson_1.JsonFloat(convValue));
            }
            else if (obj[key] instanceof Array) {
                map.put(key, CubismJsonExtension.parseJsonArray(obj[key]));
            }
            else if (obj[key] instanceof Object) {
                map.put(key, CubismJsonExtension.parseJsonObject(obj[key], new cubismjson_1.JsonMap()));
            }
            else if (obj[key] == null) {
                map.put(key, new cubismjson_1.JsonNullvalue());
            }
            else {
                // どれにも当てはまらない場合でも処理する
                map.put(key, obj[key]);
            }
        });
        return map;
    };
    CubismJsonExtension.parseJsonArray = function (obj) {
        var _this = this;
        var arr = new cubismjson_1.JsonArray();
        Object.keys(obj).forEach(function (key) {
            var convKey = Number(key);
            if (typeof convKey == 'number') {
                if (typeof obj[key] == 'boolean') {
                    var convValue = Boolean(obj[key]);
                    arr.add(new cubismjson_1.JsonBoolean(convValue));
                }
                else if (typeof obj[key] == 'string') {
                    var convValue = String(obj[key]);
                    arr.add(new cubismjson_1.JsonString(convValue));
                }
                else if (typeof obj[key] == 'number') {
                    var convValue = Number(obj[key]);
                    arr.add(new cubismjson_1.JsonFloat(convValue));
                }
                else if (obj[key] instanceof Array) {
                    arr.add(_this.parseJsonArray(obj[key]));
                }
                else if (obj[key] instanceof Object) {
                    arr.add(_this.parseJsonObject(obj[key], new cubismjson_1.JsonMap()));
                }
                else if (obj[key] == null) {
                    arr.add(new cubismjson_1.JsonNullvalue());
                }
                else {
                    // どれにも当てはまらない場合でも処理する
                    arr.add(obj[key]);
                }
            }
            else if (obj[key] instanceof Array) {
                arr.add(_this.parseJsonArray(obj[key]));
            }
            else if (obj[key] instanceof Object) {
                arr.add(_this.parseJsonObject(obj[key], new cubismjson_1.JsonMap()));
            }
            else if (obj[key] == null) {
                arr.add(new cubismjson_1.JsonNullvalue());
            }
            else {
                var convValue = Array(obj[key]);
                // 配列ともObjectとも判定できなかった場合でも処理する
                for (var i = 0; i < convValue.length; i++) {
                    arr.add(convValue[i]);
                }
            }
        });
        return arr;
    };
    return CubismJsonExtension;
}());
exports.CubismJsonExtension = CubismJsonExtension;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts":
/*!*****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenderTargetHeight = exports.RenderTargetWidth = exports.CubismLoggingLevel = exports.DebugTouchLogEnable = exports.DebugLogEnable = exports.MOCConsistencyValidationEnable = exports.PriorityForce = exports.PriorityNormal = exports.PriorityIdle = exports.PriorityNone = exports.HitAreaNameBody = exports.HitAreaNameHead = exports.MotionGroupTapBody = exports.MotionGroupIdle = exports.ModelDirSize = exports.ModelDir = exports.PowerImageName = exports.GearImageName = exports.BackImageName = exports.ResourcesPath = exports.ViewLogicalMaxTop = exports.ViewLogicalMaxBottom = exports.ViewLogicalMaxRight = exports.ViewLogicalMaxLeft = exports.ViewLogicalTop = exports.ViewLogicalBottom = exports.ViewLogicalRight = exports.ViewLogicalLeft = exports.ViewMinScale = exports.ViewMaxScale = exports.ViewScale = exports.CanvasSize = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
/**
 * Sample Appで使用する定数
 */
// Canvas width and height pixel values, or dynamic screen size ('auto').
exports.CanvasSize = 'auto';
// 画面
exports.ViewScale = 0.5;
exports.ViewMaxScale = 1.0;
exports.ViewMinScale = 0.1;
exports.ViewLogicalLeft = -1.0;
exports.ViewLogicalRight = 1.0;
exports.ViewLogicalBottom = -1.0;
exports.ViewLogicalTop = 1.0;
exports.ViewLogicalMaxLeft = -2.0;
exports.ViewLogicalMaxRight = 2.0;
exports.ViewLogicalMaxBottom = -2.0;
exports.ViewLogicalMaxTop = 2.0;
// 相対パス
exports.ResourcesPath = '../../Resources/';
// モデルの後ろにある背景の画像ファイル
exports.BackImageName = 'back_class_normal.png';
// 歯車
exports.GearImageName = 'icon_gear.png';
// 終了ボタン
exports.PowerImageName = 'CloseNormal.png';
// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
exports.ModelDir = [
    'shiro_hachi'
];
exports.ModelDirSize = exports.ModelDir.length;
// 外部定義ファイル（json）と合わせる
exports.MotionGroupIdle = 'Idle'; // アイドリング
exports.MotionGroupTapBody = 'TapBody'; // 体をタップしたとき
// 外部定義ファイル（json）と合わせる
exports.HitAreaNameHead = 'Head';
exports.HitAreaNameBody = 'Body';
// モーションの優先度定数
exports.PriorityNone = 0;
exports.PriorityIdle = 1;
exports.PriorityNormal = 2;
exports.PriorityForce = 3;
// MOC3の一貫性検証オプション
exports.MOCConsistencyValidationEnable = true;
// デバッグ用ログの表示オプション
exports.DebugLogEnable = true;
exports.DebugTouchLogEnable = false;
// Frameworkから出力するログのレベル設定
exports.CubismLoggingLevel = live2dcubismframework_1.LogLevel.LogLevel_Verbose;
// デフォルトのレンダーターゲットサイズ
exports.RenderTargetWidth = 1900;
exports.RenderTargetHeight = 1000;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts":
/*!*******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppDelegate = exports.frameBuffer = exports.gl = exports.s_instance = exports.canvas = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapplive2dmanager.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var lapptexturemanager_1 = __webpack_require__(/*! ./lapptexturemanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapptexturemanager.ts");
var lappview_1 = __webpack_require__(/*! ./lappview */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappview.ts");
exports.canvas = null;
exports.s_instance = null;
exports.gl = null;
exports.frameBuffer = null;
/**
 * アプリケーションクラス。
 * Cubism SDKの管理を行う。
 */
var LAppDelegate = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppDelegate() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;
        this._cubismOption = new live2dcubismframework_1.Option();
        this._view = new lappview_1.LAppView();
        this._textureManager = new lapptexturemanager_1.LAppTextureManager();
    }
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    LAppDelegate.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppDelegate();
        }
        return exports.s_instance;
    };
    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    LAppDelegate.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance.release();
        }
        exports.s_instance = null;
    };
    /**
     * APPに必要な物を初期化する。
     */
    LAppDelegate.prototype.initialize = function () {
        // キャンバスの作成
        exports.canvas = document.createElement('canvas');
        if (LAppDefine.CanvasSize === 'auto') {
            this._resizeCanvas();
        }
        else {
            exports.canvas.width = LAppDefine.CanvasSize.width;
            exports.canvas.height = LAppDefine.CanvasSize.height;
        }
        // glコンテキストを初期化
        // @ts-ignore
        exports.gl = exports.canvas.getContext('webgl') || exports.canvas.getContext('experimental-webgl');
        if (!exports.gl) {
            alert('Cannot initialize WebGL. This browser does not support.');
            exports.gl = null;
            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';
            // gl初期化失敗
            return false;
        }
        // キャンバスを DOM に追加
        document.body.appendChild(exports.canvas);
        if (!exports.frameBuffer) {
            exports.frameBuffer = exports.gl.getParameter(exports.gl.FRAMEBUFFER_BINDING);
        }
        // 透過設定
        exports.gl.enable(exports.gl.BLEND);
        exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
        var supportTouch = 'ontouchend' in exports.canvas;
        if (supportTouch) {
            // タッチ関連コールバック関数登録
            exports.canvas.ontouchstart = onTouchBegan;
            exports.canvas.ontouchmove = onTouchMoved;
            exports.canvas.ontouchend = onTouchEnded;
            exports.canvas.ontouchcancel = onTouchCancel;
        }
        else {
            // マウス関連コールバック関数登録
            exports.canvas.onmousedown = onClickBegan;
            exports.canvas.onmousemove = onMouseMoved;
            exports.canvas.onmouseup = onClickEnded;
        }
        // AppViewの初期化
        this._view.initialize();
        // Cubism SDKの初期化
        this.initializeCubism();
        return true;
    };
    /**
     * Resize canvas and re-initialize view.
     */
    LAppDelegate.prototype.onResize = function () {
        this._resizeCanvas();
        this._view.initialize();
        this._view.initializeSprite();
        // キャンバスサイズを渡す
        var viewport = [0, 0, exports.canvas.width, exports.canvas.height];
        exports.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    };
    /**
     * 解放する。
     */
    LAppDelegate.prototype.release = function () {
        this._textureManager.release();
        this._textureManager = null;
        this._view.release();
        this._view = null;
        // リソースを解放
        lapplive2dmanager_1.LAppLive2DManager.releaseInstance();
        // Cubism SDKの解放
        live2dcubismframework_1.CubismFramework.dispose();
    };
    /**
     * 実行処理。
     */
    LAppDelegate.prototype.run = function () {
        var _this = this;
        // メインループ
        var loop = function () {
            // インスタンスの有無の確認
            if (exports.s_instance == null) {
                return;
            }
            // 時間更新
            lapppal_1.LAppPal.updateTime();
            // 画面の初期化
            exports.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            // 深度テストを有効化
            exports.gl.enable(exports.gl.DEPTH_TEST);
            // 近くにある物体は、遠くにある物体を覆い隠す
            exports.gl.depthFunc(exports.gl.LEQUAL);
            // カラーバッファや深度バッファをクリアする
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT);
            exports.gl.clearDepth(1.0);
            // 透過設定
            exports.gl.enable(exports.gl.BLEND);
            exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
            // 描画更新
            _this._view.render();
            // ループのために再帰呼び出し
            requestAnimationFrame(loop);
        };
        loop();
    };
    /**
     * シェーダーを登録する。
     */
    LAppDelegate.prototype.createShader = function () {
        // バーテックスシェーダーのコンパイル
        var vertexShaderId = exports.gl.createShader(exports.gl.VERTEX_SHADER);
        if (vertexShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create vertexShader');
            return null;
        }
        var vertexShader = 'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';
        exports.gl.shaderSource(vertexShaderId, vertexShader);
        exports.gl.compileShader(vertexShaderId);
        // フラグメントシェーダのコンパイル
        var fragmentShaderId = exports.gl.createShader(exports.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }
        var fragmentShader = 'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
        exports.gl.shaderSource(fragmentShaderId, fragmentShader);
        exports.gl.compileShader(fragmentShaderId);
        // プログラムオブジェクトの作成
        var programId = exports.gl.createProgram();
        exports.gl.attachShader(programId, vertexShaderId);
        exports.gl.attachShader(programId, fragmentShaderId);
        exports.gl.deleteShader(vertexShaderId);
        exports.gl.deleteShader(fragmentShaderId);
        // リンク
        exports.gl.linkProgram(programId);
        exports.gl.useProgram(programId);
        return programId;
    };
    /**
     * View情報を取得する。
     */
    LAppDelegate.prototype.getView = function () {
        return this._view;
    };
    LAppDelegate.prototype.getTextureManager = function () {
        return this._textureManager;
    };
    /**
     * Cubism SDKの初期化
     */
    LAppDelegate.prototype.initializeCubism = function () {
        // setup cubism
        this._cubismOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        live2dcubismframework_1.CubismFramework.startUp(this._cubismOption);
        // initialize cubism
        live2dcubismframework_1.CubismFramework.initialize();
        // load model
        lapplive2dmanager_1.LAppLive2DManager.getInstance();
        lapppal_1.LAppPal.updateTime();
        this._view.initializeSprite();
    };
    /**
     * Resize the canvas to fill the screen.
     */
    LAppDelegate.prototype._resizeCanvas = function () {
        exports.canvas.width = window.innerWidth;
        exports.canvas.height = window.innerHeight;
    };
    return LAppDelegate;
}());
exports.LAppDelegate = LAppDelegate;
/**
 * クリックしたときに呼ばれる。
 */
function onClickBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.pageX;
    var posY = e.pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
/**
 * マウスポインタが動いたら呼ばれる。
 */
function onMouseMoved(e) {
    if (!LAppDelegate.getInstance()._captured) {
        return;
    }
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
/**
 * クリックが終了したら呼ばれる。
 */
function onClickEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
/**
 * タッチしたときに呼ばれる。
 */
function onTouchBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.changedTouches[0].pageX;
    var posY = e.changedTouches[0].pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
/**
 * スワイプすると呼ばれる。
 */
function onTouchMoved(e) {
    if (!LAppDelegate.getInstance()._captured) {
        return;
    }
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
/**
 * タッチが終了したら呼ばれる。
 */
function onTouchEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
/**
 * タッチがキャンセルされると呼ばれる。
 */
function onTouchCancel(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapplive2dmanager.ts":
/*!************************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapplive2dmanager.ts ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppLive2DManager = exports.s_instance = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts");
var lappmodel_1 = __webpack_require__(/*! ./lappmodel */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappmodel.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
exports.s_instance = null;
/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
var LAppLive2DManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppLive2DManager() {
        // モーション再生終了のコールバック関数
        this._finishedMotion = function (self) {
            lapppal_1.LAppPal.printMessage('Motion Finished:');
            console.log(self);
        };
        this._viewMatrix = new cubismmatrix44_1.CubismMatrix44();
        this._models = new csmvector_1.csmVector();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    LAppLive2DManager.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppLive2DManager();
        }
        return exports.s_instance;
    };
    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    LAppLive2DManager.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    /**
     * 現在のシーンで保持しているモデルを返す。
     *
     * @param no モデルリストのインデックス値
     * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
     */
    LAppLive2DManager.prototype.getModel = function (no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    };
    /**
     * 現在のシーンで保持しているすべてのモデルを解放する
     */
    LAppLive2DManager.prototype.releaseAllModel = function () {
        for (var i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    };
    /**
     * 画面をドラッグした時の処理
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    LAppLive2DManager.prototype.onDrag = function (x, y) {
        for (var i = 0; i < this._models.getSize(); i++) {
            var model = this.getModel(i);
            if (model) {
                model.setDragging(x, y);
            }
        }
    };
    /**
     * 画面をタップした時の処理
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    LAppLive2DManager.prototype.onTap = function (x, y) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]tap point: {x: ".concat(x.toFixed(2), " y: ").concat(y.toFixed(2), "}"));
        }
        for (var i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[APP]hit area: [".concat(LAppDefine.HitAreaNameHead, "]"));
                }
                this._models.at(i).setRandomExpression();
            }
            else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[APP]hit area: [".concat(LAppDefine.HitAreaNameBody, "]"));
                }
                this._models
                    .at(i)
                    .startRandomMotion(LAppDefine.MotionGroupTapBody, LAppDefine.PriorityNormal, this._finishedMotion);
            }
        }
    };
    /**
     * 画面を更新するときの処理
     * モデルの更新処理及び描画処理を行う
     */
    LAppLive2DManager.prototype.onUpdate = function () {
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        var modelCount = this._models.getSize();
        for (var i = 0; i < modelCount; ++i) {
            var projection = new cubismmatrix44_1.CubismMatrix44();
            var model = this.getModel(i);
            if (model.getModel()) {
                if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
                    // 横に長いモデルを縦長ウィンドウに表示する際モデルの横サイズでscaleを算出する
                    model.getModelMatrix().setWidth(2.0);
                    projection.scale(1.0, width / height);
                }
                else {
                    projection.scale(height / width, 1.0);
                }
                // 必要があればここで乗算
                if (this._viewMatrix != null) {
                    projection.multiplyByMatrix(this._viewMatrix);
                }
            }
            model.update();
            model.draw(projection); // 参照渡しなのでprojectionは変質する。
        }
    };
    /**
     * 次のシーンに切りかえる
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    LAppLive2DManager.prototype.nextScene = function () {
        var no = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
        this.changeScene(no);
    };
    /**
     * シーンを切り替える
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    LAppLive2DManager.prototype.changeScene = function (index) {
        this._sceneIndex = index;
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]model index: ".concat(this._sceneIndex));
        }
        // ModelDir[]に保持したディレクトリ名から
        // model3.jsonのパスを決定する。
        // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
        var model = LAppDefine.ModelDir[index];
        var modelPath = LAppDefine.ResourcesPath + model + '/';
        var modelJsonName = LAppDefine.ModelDir[index];
        modelJsonName += '.model3.json';
        this.releaseAllModel();
        this._models.pushBack(new lappmodel_1.LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    };
    LAppLive2DManager.prototype.setViewMatrix = function (m) {
        for (var i = 0; i < 16; i++) {
            this._viewMatrix.getArray()[i] = m.getArray()[i];
        }
    };
    return LAppLive2DManager;
}());
exports.LAppLive2DManager = LAppLive2DManager;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappmodel.ts":
/*!****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappmodel.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppModel = void 0;
__webpack_require__(/*! whatwg-fetch */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/node_modules/whatwg-fetch/fetch.js");
var cubismdefaultparameterid_1 = __webpack_require__(/*! @framework/cubismdefaultparameterid */ "../../../../CubismSdkForWeb/Framework/src/cubismdefaultparameterid.ts");
var cubismmodelsettingjson_1 = __webpack_require__(/*! @framework/cubismmodelsettingjson */ "../../../../CubismSdkForWeb/Framework/src/cubismmodelsettingjson.ts");
var cubismbreath_1 = __webpack_require__(/*! @framework/effect/cubismbreath */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismbreath.ts");
var cubismeyeblink_1 = __webpack_require__(/*! @framework/effect/cubismeyeblink */ "../../../../CubismSdkForWeb/Framework/src/effect/cubismeyeblink.ts");
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var cubismusermodel_1 = __webpack_require__(/*! @framework/model/cubismusermodel */ "../../../../CubismSdkForWeb/Framework/src/model/cubismusermodel.ts");
var acubismmotion_1 = __webpack_require__(/*! @framework/motion/acubismmotion */ "../../../../CubismSdkForWeb/Framework/src/motion/acubismmotion.ts");
var cubismmotionqueuemanager_1 = __webpack_require__(/*! @framework/motion/cubismmotionqueuemanager */ "../../../../CubismSdkForWeb/Framework/src/motion/cubismmotionqueuemanager.ts");
var csmmap_1 = __webpack_require__(/*! @framework/type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var lappwavfilehandler_1 = __webpack_require__(/*! ./lappwavfilehandler */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappwavfilehandler.ts");
var cubismmoc_1 = __webpack_require__(/*! @framework/model/cubismmoc */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts");
var LoadStep;
(function (LoadStep) {
    LoadStep[LoadStep["LoadAssets"] = 0] = "LoadAssets";
    LoadStep[LoadStep["LoadModel"] = 1] = "LoadModel";
    LoadStep[LoadStep["WaitLoadModel"] = 2] = "WaitLoadModel";
    LoadStep[LoadStep["LoadExpression"] = 3] = "LoadExpression";
    LoadStep[LoadStep["WaitLoadExpression"] = 4] = "WaitLoadExpression";
    LoadStep[LoadStep["LoadPhysics"] = 5] = "LoadPhysics";
    LoadStep[LoadStep["WaitLoadPhysics"] = 6] = "WaitLoadPhysics";
    LoadStep[LoadStep["LoadPose"] = 7] = "LoadPose";
    LoadStep[LoadStep["WaitLoadPose"] = 8] = "WaitLoadPose";
    LoadStep[LoadStep["SetupEyeBlink"] = 9] = "SetupEyeBlink";
    LoadStep[LoadStep["SetupBreath"] = 10] = "SetupBreath";
    LoadStep[LoadStep["LoadUserData"] = 11] = "LoadUserData";
    LoadStep[LoadStep["WaitLoadUserData"] = 12] = "WaitLoadUserData";
    LoadStep[LoadStep["SetupEyeBlinkIds"] = 13] = "SetupEyeBlinkIds";
    LoadStep[LoadStep["SetupLipSyncIds"] = 14] = "SetupLipSyncIds";
    LoadStep[LoadStep["SetupLayout"] = 15] = "SetupLayout";
    LoadStep[LoadStep["LoadMotion"] = 16] = "LoadMotion";
    LoadStep[LoadStep["WaitLoadMotion"] = 17] = "WaitLoadMotion";
    LoadStep[LoadStep["CompleteInitialize"] = 18] = "CompleteInitialize";
    LoadStep[LoadStep["CompleteSetupModel"] = 19] = "CompleteSetupModel";
    LoadStep[LoadStep["LoadTexture"] = 20] = "LoadTexture";
    LoadStep[LoadStep["WaitLoadTexture"] = 21] = "WaitLoadTexture";
    LoadStep[LoadStep["CompleteSetup"] = 22] = "CompleteSetup";
})(LoadStep || (LoadStep = {}));
/**
 * ユーザーが実際に使用するモデルの実装クラス<br>
 * モデル生成、機能コンポーネント生成、更新処理とレンダリングの呼び出しを行う。
 */
var LAppModel = /** @class */ (function (_super) {
    __extends(LAppModel, _super);
    /**
     * コンストラクタ
     */
    function LAppModel() {
        var _this = _super.call(this) || this;
        _this._modelSetting = null;
        _this._modelHomeDir = null;
        _this._userTimeSeconds = 0.0;
        _this._eyeBlinkIds = new csmvector_1.csmVector();
        _this._lipSyncIds = new csmvector_1.csmVector();
        _this._motions = new csmmap_1.csmMap();
        _this._expressions = new csmmap_1.csmMap();
        _this._hitArea = new csmvector_1.csmVector();
        _this._userArea = new csmvector_1.csmVector();
        _this._idParamAngleX = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamAngleX);
        _this._idParamAngleY = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamAngleY);
        _this._idParamAngleZ = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamAngleZ);
        _this._idParamEyeBallX = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamEyeBallX);
        _this._idParamEyeBallY = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamEyeBallY);
        _this._idParamBodyAngleX = live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamBodyAngleX);
        if (LAppDefine.MOCConsistencyValidationEnable) {
            _this._mocConsistency = true;
        }
        _this._state = LoadStep.LoadAssets;
        _this._expressionCount = 0;
        _this._textureCount = 0;
        _this._motionCount = 0;
        _this._allMotionCount = 0;
        _this._wavFileHandler = new lappwavfilehandler_1.LAppWavFileHandler();
        _this._consistency = false;
        return _this;
    }
    /**
     * model3.jsonが置かれたディレクトリとファイルパスからモデルを生成する
     * @param dir
     * @param fileName
     */
    LAppModel.prototype.loadAssets = function (dir, fileName) {
        var _this = this;
        this._modelHomeDir = dir;
        fetch("".concat(this._modelHomeDir).concat(fileName))
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) {
            var setting = new cubismmodelsettingjson_1.CubismModelSettingJson(arrayBuffer, arrayBuffer.byteLength);
            // ステートを更新
            _this._state = LoadStep.LoadModel;
            // 結果を保存
            _this.setupModel(setting);
        });
    };
    /**
     * model3.jsonからモデルを生成する。
     * model3.jsonの記述に従ってモデル生成、モーション、物理演算などのコンポーネント生成を行う。
     *
     * @param setting ICubismModelSettingのインスタンス
     */
    LAppModel.prototype.setupModel = function (setting) {
        var _this = this;
        this._updating = true;
        this._initialized = false;
        this._modelSetting = setting;
        // CubismModel
        if (this._modelSetting.getModelFileName() != '') {
            var modelFileName = this._modelSetting.getModelFileName();
            fetch("".concat(this._modelHomeDir).concat(modelFileName))
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                _this.loadModel(arrayBuffer, _this._mocConsistency);
                _this._state = LoadStep.LoadExpression;
                // callback
                loadCubismExpression();
            });
            this._state = LoadStep.WaitLoadModel;
        }
        else {
            lapppal_1.LAppPal.printMessage('Model data does not exist.');
        }
        // Expression
        var loadCubismExpression = function () {
            if (_this._modelSetting.getExpressionCount() > 0) {
                var count_1 = _this._modelSetting.getExpressionCount();
                var _loop_1 = function (i) {
                    var expressionName = _this._modelSetting.getExpressionName(i);
                    var expressionFileName = _this._modelSetting.getExpressionFileName(i);
                    fetch("".concat(_this._modelHomeDir).concat(expressionFileName))
                        .then(function (response) { return response.arrayBuffer(); })
                        .then(function (arrayBuffer) {
                        var motion = _this.loadExpression(arrayBuffer, arrayBuffer.byteLength, expressionName);
                        if (_this._expressions.getValue(expressionName) != null) {
                            acubismmotion_1.ACubismMotion.delete(_this._expressions.getValue(expressionName));
                            _this._expressions.setValue(expressionName, null);
                        }
                        _this._expressions.setValue(expressionName, motion);
                        _this._expressionCount++;
                        if (_this._expressionCount >= count_1) {
                            _this._state = LoadStep.LoadPhysics;
                            // callback
                            loadCubismPhysics();
                        }
                    });
                };
                for (var i = 0; i < count_1; i++) {
                    _loop_1(i);
                }
                _this._state = LoadStep.WaitLoadExpression;
            }
            else {
                _this._state = LoadStep.LoadPhysics;
                // callback
                loadCubismPhysics();
            }
        };
        // Physics
        var loadCubismPhysics = function () {
            if (_this._modelSetting.getPhysicsFileName() != '') {
                var physicsFileName = _this._modelSetting.getPhysicsFileName();
                fetch("".concat(_this._modelHomeDir).concat(physicsFileName))
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadPhysics(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.LoadPose;
                    // callback
                    loadCubismPose();
                });
                _this._state = LoadStep.WaitLoadPhysics;
            }
            else {
                _this._state = LoadStep.LoadPose;
                // callback
                loadCubismPose();
            }
        };
        // Pose
        var loadCubismPose = function () {
            if (_this._modelSetting.getPoseFileName() != '') {
                var poseFileName = _this._modelSetting.getPoseFileName();
                fetch("".concat(_this._modelHomeDir).concat(poseFileName))
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadPose(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.SetupEyeBlink;
                    // callback
                    setupEyeBlink();
                });
                _this._state = LoadStep.WaitLoadPose;
            }
            else {
                _this._state = LoadStep.SetupEyeBlink;
                // callback
                setupEyeBlink();
            }
        };
        // EyeBlink
        var setupEyeBlink = function () {
            if (_this._modelSetting.getEyeBlinkParameterCount() > 0) {
                _this._eyeBlink = cubismeyeblink_1.CubismEyeBlink.create(_this._modelSetting);
                _this._state = LoadStep.SetupBreath;
            }
            // callback
            setupBreath();
        };
        // Breath
        var setupBreath = function () {
            _this._breath = cubismbreath_1.CubismBreath.create();
            var breathParameters = new csmvector_1.csmVector();
            breathParameters.pushBack(new cubismbreath_1.BreathParameterData(_this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5));
            breathParameters.pushBack(new cubismbreath_1.BreathParameterData(_this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5));
            breathParameters.pushBack(new cubismbreath_1.BreathParameterData(_this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5));
            breathParameters.pushBack(new cubismbreath_1.BreathParameterData(_this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5));
            breathParameters.pushBack(new cubismbreath_1.BreathParameterData(live2dcubismframework_1.CubismFramework.getIdManager().getId(cubismdefaultparameterid_1.CubismDefaultParameterId.ParamBreath), 0.5, 0.5, 3.2345, 1));
            _this._breath.setParameters(breathParameters);
            _this._state = LoadStep.LoadUserData;
            // callback
            loadUserData();
        };
        // UserData
        var loadUserData = function () {
            if (_this._modelSetting.getUserDataFile() != '') {
                var userDataFile = _this._modelSetting.getUserDataFile();
                fetch("".concat(_this._modelHomeDir).concat(userDataFile))
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadUserData(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.SetupEyeBlinkIds;
                    // callback
                    setupEyeBlinkIds();
                });
                _this._state = LoadStep.WaitLoadUserData;
            }
            else {
                _this._state = LoadStep.SetupEyeBlinkIds;
                // callback
                setupEyeBlinkIds();
            }
        };
        // EyeBlinkIds
        var setupEyeBlinkIds = function () {
            var eyeBlinkIdCount = _this._modelSetting.getEyeBlinkParameterCount();
            for (var i = 0; i < eyeBlinkIdCount; ++i) {
                _this._eyeBlinkIds.pushBack(_this._modelSetting.getEyeBlinkParameterId(i));
            }
            _this._state = LoadStep.SetupLipSyncIds;
            // callback
            setupLipSyncIds();
        };
        // LipSyncIds
        var setupLipSyncIds = function () {
            var lipSyncIdCount = _this._modelSetting.getLipSyncParameterCount();
            for (var i = 0; i < lipSyncIdCount; ++i) {
                _this._lipSyncIds.pushBack(_this._modelSetting.getLipSyncParameterId(i));
            }
            _this._state = LoadStep.SetupLayout;
            // callback
            setupLayout();
        };
        // Layout
        var setupLayout = function () {
            var layout = new csmmap_1.csmMap();
            if (_this._modelSetting == null || _this._modelMatrix == null) {
                (0, cubismdebug_1.CubismLogError)('Failed to setupLayout().');
                return;
            }
            _this._modelSetting.getLayoutMap(layout);
            _this._modelMatrix.setupFromLayout(layout);
            _this._state = LoadStep.LoadMotion;
            // callback
            loadCubismMotion();
        };
        // Motion
        var loadCubismMotion = function () {
            _this._state = LoadStep.WaitLoadMotion;
            _this._model.saveParameters();
            _this._allMotionCount = 0;
            _this._motionCount = 0;
            var group = [];
            var motionGroupCount = _this._modelSetting.getMotionGroupCount();
            // モーションの総数を求める
            for (var i = 0; i < motionGroupCount; i++) {
                group[i] = _this._modelSetting.getMotionGroupName(i);
                _this._allMotionCount += _this._modelSetting.getMotionCount(group[i]);
            }
            // モーションの読み込み
            for (var i = 0; i < motionGroupCount; i++) {
                _this.preLoadMotionGroup(group[i]);
            }
            // モーションがない場合
            if (motionGroupCount == 0) {
                _this._state = LoadStep.LoadTexture;
                // 全てのモーションを停止する
                _this._motionManager.stopAllMotions();
                _this._updating = false;
                _this._initialized = true;
                _this.createRenderer();
                _this.setupTextures();
                _this.getRenderer().startUp(lappdelegate_1.gl);
            }
        };
    };
    /**
     * テクスチャユニットにテクスチャをロードする
     */
    LAppModel.prototype.setupTextures = function () {
        var _this = this;
        // iPhoneでのアルファ品質向上のためTypescriptではpremultipliedAlphaを採用
        var usePremultiply = true;
        if (this._state == LoadStep.LoadTexture) {
            // テクスチャ読み込み用
            var textureCount_1 = this._modelSetting.getTextureCount();
            var _loop_2 = function (modelTextureNumber) {
                // テクスチャ名が空文字だった場合はロード・バインド処理をスキップ
                if (this_1._modelSetting.getTextureFileName(modelTextureNumber) == '') {
                    console.log('getTextureFileName null');
                    return "continue";
                }
                // WebGLのテクスチャユニットにテクスチャをロードする
                var texturePath = this_1._modelSetting.getTextureFileName(modelTextureNumber);
                texturePath = this_1._modelHomeDir + texturePath;
                // ロード完了時に呼び出すコールバック関数
                var onLoad = function (textureInfo) {
                    _this.getRenderer().bindTexture(modelTextureNumber, textureInfo.id);
                    _this._textureCount++;
                    if (_this._textureCount >= textureCount_1) {
                        // ロード完了
                        _this._state = LoadStep.CompleteSetup;
                    }
                };
                // 読み込み
                lappdelegate_1.LAppDelegate.getInstance()
                    .getTextureManager()
                    .createTextureFromPngFile(texturePath, usePremultiply, onLoad);
                this_1.getRenderer().setIsPremultipliedAlpha(usePremultiply);
            };
            var this_1 = this;
            for (var modelTextureNumber = 0; modelTextureNumber < textureCount_1; modelTextureNumber++) {
                _loop_2(modelTextureNumber);
            }
            this._state = LoadStep.WaitLoadTexture;
        }
    };
    /**
     * レンダラを再構築する
     */
    LAppModel.prototype.reloadRenderer = function () {
        this.deleteRenderer();
        this.createRenderer();
        this.setupTextures();
    };
    /**
     * 更新
     */
    LAppModel.prototype.update = function () {
        if (this._state != LoadStep.CompleteSetup)
            return;
        var deltaTimeSeconds = lapppal_1.LAppPal.getDeltaTime();
        this._userTimeSeconds += deltaTimeSeconds;
        this._dragManager.update(deltaTimeSeconds);
        this._dragX = this._dragManager.getX();
        this._dragY = this._dragManager.getY();
        // モーションによるパラメータ更新の有無
        var motionUpdated = false;
        //--------------------------------------------------------------------------
        this._model.loadParameters(); // 前回セーブされた状態をロード
        if (this._motionManager.isFinished()) {
            // モーションの再生がない場合、待機モーションの中からランダムで再生する
            this.startRandomMotion(LAppDefine.MotionGroupIdle, LAppDefine.PriorityIdle);
        }
        else {
            motionUpdated = this._motionManager.updateMotion(this._model, deltaTimeSeconds); // モーションを更新
        }
        this._model.saveParameters(); // 状態を保存
        //--------------------------------------------------------------------------
        // まばたき
        if (!motionUpdated) {
            if (this._eyeBlink != null) {
                // メインモーションの更新がないとき
                this._eyeBlink.updateParameters(this._model, deltaTimeSeconds); // 目パチ
            }
        }
        if (this._expressionManager != null) {
            this._expressionManager.updateMotion(this._model, deltaTimeSeconds); // 表情でパラメータ更新（相対変化）
        }
        // ドラッグによる変化
        // ドラッグによる顔の向きの調整
        this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30); // -30から30の値を加える
        this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
        this._model.addParameterValueById(this._idParamAngleZ, this._dragX * this._dragY * -30);
        // ドラッグによる体の向きの調整
        this._model.addParameterValueById(this._idParamBodyAngleX, this._dragX * 10); // -10から10の値を加える
        // ドラッグによる目の向きの調整
        this._model.addParameterValueById(this._idParamEyeBallX, this._dragX); // -1から1の値を加える
        this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);
        // 呼吸など
        if (this._breath != null) {
            this._breath.updateParameters(this._model, deltaTimeSeconds);
        }
        // 物理演算の設定
        if (this._physics != null) {
            this._physics.evaluate(this._model, deltaTimeSeconds);
        }
        // リップシンクの設定
        if (this._lipsync) {
            var value = 0.0; // リアルタイムでリップシンクを行う場合、システムから音量を取得して、0~1の範囲で値を入力します。
            this._wavFileHandler.update(deltaTimeSeconds);
            value = this._wavFileHandler.getRms();
            for (var i = 0; i < this._lipSyncIds.getSize(); ++i) {
                this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
            }
        }
        // ポーズの設定
        if (this._pose != null) {
            this._pose.updateParameters(this._model, deltaTimeSeconds);
        }
        this._model.update();
    };
    /**
     * 引数で指定したモーションの再生を開始する
     * @param group モーショングループ名
     * @param no グループ内の番号
     * @param priority 優先度
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    LAppModel.prototype.startMotion = function (group, no, priority, onFinishedMotionHandler) {
        var _this = this;
        if (priority == LAppDefine.PriorityForce) {
            this._motionManager.setReservePriority(priority);
        }
        else if (!this._motionManager.reserveMotion(priority)) {
            if (this._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]can't start motion.");
            }
            return cubismmotionqueuemanager_1.InvalidMotionQueueEntryHandleValue;
        }
        var motionFileName = this._modelSetting.getMotionFileName(group, no);
        // ex) idle_0
        var name = "".concat(group, "_").concat(no);
        var motion = this._motions.getValue(name);
        var autoDelete = false;
        if (motion == null) {
            fetch("".concat(this._modelHomeDir).concat(motionFileName))
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                motion = _this.loadMotion(arrayBuffer, arrayBuffer.byteLength, null, onFinishedMotionHandler);
                var fadeTime = _this._modelSetting.getMotionFadeInTimeValue(group, no);
                if (fadeTime >= 0.0) {
                    motion.setFadeInTime(fadeTime);
                }
                fadeTime = _this._modelSetting.getMotionFadeOutTimeValue(group, no);
                if (fadeTime >= 0.0) {
                    motion.setFadeOutTime(fadeTime);
                }
                motion.setEffectIds(_this._eyeBlinkIds, _this._lipSyncIds);
                autoDelete = true; // 終了時にメモリから削除
            });
        }
        else {
            motion.setFinishedMotionHandler(onFinishedMotionHandler);
        }
        //voice
        var voice = this._modelSetting.getMotionSoundFileName(group, no);
        if (voice.localeCompare('') != 0) {
            var path = voice;
            path = this._modelHomeDir + path;
            this._wavFileHandler.start(path);
        }
        if (this._debugMode) {
            lapppal_1.LAppPal.printMessage("[APP]start motion: [".concat(group, "_").concat(no));
        }
        return this._motionManager.startMotionPriority(motion, autoDelete, priority);
    };
    /**
     * ランダムに選ばれたモーションの再生を開始する。
     * @param group モーショングループ名
     * @param priority 優先度
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    LAppModel.prototype.startRandomMotion = function (group, priority, onFinishedMotionHandler) {
        if (this._modelSetting.getMotionCount(group) == 0) {
            return cubismmotionqueuemanager_1.InvalidMotionQueueEntryHandleValue;
        }
        var no = Math.floor(Math.random() * this._modelSetting.getMotionCount(group));
        return this.startMotion(group, no, priority, onFinishedMotionHandler);
    };
    /**
     * 引数で指定した表情モーションをセットする
     *
     * @param expressionId 表情モーションのID
     */
    LAppModel.prototype.setExpression = function (expressionId) {
        var motion = this._expressions.getValue(expressionId);
        if (this._debugMode) {
            lapppal_1.LAppPal.printMessage("[APP]expression: [".concat(expressionId, "]"));
        }
        if (motion != null) {
            this._expressionManager.startMotionPriority(motion, false, LAppDefine.PriorityForce);
        }
        else {
            if (this._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]expression[".concat(expressionId, "] is null"));
            }
        }
    };
    /**
     * ランダムに選ばれた表情モーションをセットする
     */
    LAppModel.prototype.setRandomExpression = function () {
        if (this._expressions.getSize() == 0) {
            return;
        }
        var no = Math.floor(Math.random() * this._expressions.getSize());
        for (var i = 0; i < this._expressions.getSize(); i++) {
            if (i == no) {
                var name_1 = this._expressions._keyValues[i].first;
                this.setExpression(name_1);
                return;
            }
        }
    };
    /**
     * イベントの発火を受け取る
     */
    LAppModel.prototype.motionEventFired = function (eventValue) {
        (0, cubismdebug_1.CubismLogInfo)('{0} is fired on LAppModel!!', eventValue.s);
    };
    /**
     * 当たり判定テスト
     * 指定ＩＤの頂点リストから矩形を計算し、座標をが矩形範囲内か判定する。
     *
     * @param hitArenaName  当たり判定をテストする対象のID
     * @param x             判定を行うX座標
     * @param y             判定を行うY座標
     */
    LAppModel.prototype.hitTest = function (hitArenaName, x, y) {
        // 透明時は当たり判定無し。
        if (this._opacity < 1) {
            return false;
        }
        var count = this._modelSetting.getHitAreasCount();
        for (var i = 0; i < count; i++) {
            if (this._modelSetting.getHitAreaName(i) == hitArenaName) {
                var drawId = this._modelSetting.getHitAreaId(i);
                return this.isHit(drawId, x, y);
            }
        }
        return false;
    };
    /**
     * モーションデータをグループ名から一括でロードする。
     * モーションデータの名前は内部でModelSettingから取得する。
     *
     * @param group モーションデータのグループ名
     */
    LAppModel.prototype.preLoadMotionGroup = function (group) {
        var _this = this;
        var _loop_3 = function (i) {
            var motionFileName = this_2._modelSetting.getMotionFileName(group, i);
            // ex) idle_0
            var name_2 = "".concat(group, "_").concat(i);
            if (this_2._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]load motion: ".concat(motionFileName, " => [").concat(name_2, "]"));
            }
            fetch("".concat(this_2._modelHomeDir).concat(motionFileName))
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                var tmpMotion = _this.loadMotion(arrayBuffer, arrayBuffer.byteLength, name_2);
                var fadeTime = _this._modelSetting.getMotionFadeInTimeValue(group, i);
                if (fadeTime >= 0.0) {
                    tmpMotion.setFadeInTime(fadeTime);
                }
                fadeTime = _this._modelSetting.getMotionFadeOutTimeValue(group, i);
                if (fadeTime >= 0.0) {
                    tmpMotion.setFadeOutTime(fadeTime);
                }
                tmpMotion.setEffectIds(_this._eyeBlinkIds, _this._lipSyncIds);
                if (_this._motions.getValue(name_2) != null) {
                    acubismmotion_1.ACubismMotion.delete(_this._motions.getValue(name_2));
                }
                _this._motions.setValue(name_2, tmpMotion);
                _this._motionCount++;
                if (_this._motionCount >= _this._allMotionCount) {
                    _this._state = LoadStep.LoadTexture;
                    // 全てのモーションを停止する
                    _this._motionManager.stopAllMotions();
                    _this._updating = false;
                    _this._initialized = true;
                    _this.createRenderer();
                    _this.setupTextures();
                    _this.getRenderer().startUp(lappdelegate_1.gl);
                }
            });
        };
        var this_2 = this;
        for (var i = 0; i < this._modelSetting.getMotionCount(group); i++) {
            _loop_3(i);
        }
    };
    /**
     * すべてのモーションデータを解放する。
     */
    LAppModel.prototype.releaseMotions = function () {
        this._motions.clear();
    };
    /**
     * 全ての表情データを解放する。
     */
    LAppModel.prototype.releaseExpressions = function () {
        this._expressions.clear();
    };
    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    LAppModel.prototype.doDraw = function () {
        if (this._model == null)
            return;
        // キャンバスサイズを渡す
        var viewport = [0, 0, lappdelegate_1.canvas.width, lappdelegate_1.canvas.height];
        this.getRenderer().setRenderState(lappdelegate_1.frameBuffer, viewport);
        this.getRenderer().drawModel();
    };
    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    LAppModel.prototype.draw = function (matrix) {
        if (this._model == null) {
            return;
        }
        // 各読み込み終了後
        if (this._state == LoadStep.CompleteSetup) {
            matrix.multiplyByMatrix(this._modelMatrix);
            this.getRenderer().setMvpMatrix(matrix);
            this.doDraw();
        }
    };
    LAppModel.prototype.hasMocConsistencyFromFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modelFileName, response, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, cubismdebug_1.CSM_ASSERT)(this._modelSetting.getModelFileName().localeCompare(""));
                        if (!(this._modelSetting.getModelFileName() != '')) return [3 /*break*/, 3];
                        modelFileName = this._modelSetting.getModelFileName();
                        return [4 /*yield*/, fetch("".concat(this._modelHomeDir).concat(modelFileName))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        this._consistency = cubismmoc_1.CubismMoc.hasMocConsistency(arrayBuffer);
                        if (!this._consistency) {
                            (0, cubismdebug_1.CubismLogInfo)('Inconsistent MOC3.');
                        }
                        else {
                            (0, cubismdebug_1.CubismLogInfo)('Consistent MOC3.');
                        }
                        return [2 /*return*/, this._consistency];
                    case 3:
                        lapppal_1.LAppPal.printMessage('Model data does not exist.');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LAppModel;
}(cubismusermodel_1.CubismUserModel));
exports.LAppModel = LAppModel;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts":
/*!**************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppPal = void 0;
/**
 * プラットフォーム依存機能を抽象化する Cubism Platform Abstraction Layer.
 *
 * ファイル読み込みや時刻取得等のプラットフォームに依存する関数をまとめる。
 */
var LAppPal = /** @class */ (function () {
    function LAppPal() {
    }
    /**
     * ファイルをバイトデータとして読みこむ
     *
     * @param filePath 読み込み対象ファイルのパス
     * @return
     * {
     *      buffer,   読み込んだバイトデータ
     *      size        ファイルサイズ
     * }
     */
    LAppPal.loadFileAsBytes = function (filePath, callback) {
        fetch(filePath)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) { return callback(arrayBuffer, arrayBuffer.byteLength); });
    };
    /**
     * デルタ時間（前回フレームとの差分）を取得する
     * @return デルタ時間[ms]
     */
    LAppPal.getDeltaTime = function () {
        return this.s_deltaTime;
    };
    LAppPal.updateTime = function () {
        this.s_currentFrame = Date.now();
        this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
        this.s_lastFrame = this.s_currentFrame;
    };
    /**
     * メッセージを出力する
     * @param message 文字列
     */
    LAppPal.printMessage = function (message) {
        console.log(message);
    };
    LAppPal.lastUpdate = Date.now();
    LAppPal.s_currentFrame = 0.0;
    LAppPal.s_lastFrame = 0.0;
    LAppPal.s_deltaTime = 0.0;
    return LAppPal;
}());
exports.LAppPal = LAppPal;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappsprite.ts":
/*!*****************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappsprite.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Rect = exports.LAppSprite = void 0;
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts");
/**
 * スプライトを実装するクラス
 *
 * テクスチャＩＤ、Rectの管理
 */
var LAppSprite = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param x            x座標
     * @param y            y座標
     * @param width        横幅
     * @param height       高さ
     * @param textureId    テクスチャ
     */
    function LAppSprite(x, y, width, height, textureId) {
        this._rect = new Rect();
        this._rect.left = x - width * 0.5;
        this._rect.right = x + width * 0.5;
        this._rect.up = y + height * 0.5;
        this._rect.down = y - height * 0.5;
        this._texture = textureId;
        this._vertexBuffer = null;
        this._uvBuffer = null;
        this._indexBuffer = null;
        this._positionLocation = null;
        this._uvLocation = null;
        this._textureLocation = null;
        this._positionArray = null;
        this._uvArray = null;
        this._indexArray = null;
        this._firstDraw = true;
    }
    /**
     * 解放する。
     */
    LAppSprite.prototype.release = function () {
        this._rect = null;
        lappdelegate_1.gl.deleteTexture(this._texture);
        this._texture = null;
        lappdelegate_1.gl.deleteBuffer(this._uvBuffer);
        this._uvBuffer = null;
        lappdelegate_1.gl.deleteBuffer(this._vertexBuffer);
        this._vertexBuffer = null;
        lappdelegate_1.gl.deleteBuffer(this._indexBuffer);
        this._indexBuffer = null;
    };
    /**
     * テクスチャを返す
     */
    LAppSprite.prototype.getTexture = function () {
        return this._texture;
    };
    /**
     * 描画する。
     * @param programId シェーダープログラム
     * @param canvas 描画するキャンパス情報
     */
    LAppSprite.prototype.render = function (programId) {
        if (this._texture == null) {
            // ロードが完了していない
            return;
        }
        // 初回描画時
        if (this._firstDraw) {
            // 何番目のattribute変数か取得
            this._positionLocation = lappdelegate_1.gl.getAttribLocation(programId, 'position');
            lappdelegate_1.gl.enableVertexAttribArray(this._positionLocation);
            this._uvLocation = lappdelegate_1.gl.getAttribLocation(programId, 'uv');
            lappdelegate_1.gl.enableVertexAttribArray(this._uvLocation);
            // 何番目のuniform変数か取得
            this._textureLocation = lappdelegate_1.gl.getUniformLocation(programId, 'texture');
            // uniform属性の登録
            lappdelegate_1.gl.uniform1i(this._textureLocation, 0);
            // uvバッファ、座標初期化
            {
                this._uvArray = new Float32Array([
                    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0
                ]);
                // uvバッファを作成
                this._uvBuffer = lappdelegate_1.gl.createBuffer();
            }
            // 頂点バッファ、座標初期化
            {
                var maxWidth = lappdelegate_1.canvas.width;
                var maxHeight = lappdelegate_1.canvas.height;
                // 頂点データ
                this._positionArray = new Float32Array([
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5)
                ]);
                // 頂点バッファを作成
                this._vertexBuffer = lappdelegate_1.gl.createBuffer();
            }
            // 頂点インデックスバッファ、初期化
            {
                // インデックスデータ
                this._indexArray = new Uint16Array([0, 1, 2, 3, 2, 0]);
                // インデックスバッファを作成
                this._indexBuffer = lappdelegate_1.gl.createBuffer();
            }
            this._firstDraw = false;
        }
        // UV座標登録
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ARRAY_BUFFER, this._uvBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ARRAY_BUFFER, this._uvArray, lappdelegate_1.gl.STATIC_DRAW);
        // attribute属性を登録
        lappdelegate_1.gl.vertexAttribPointer(this._uvLocation, 2, lappdelegate_1.gl.FLOAT, false, 0, 0);
        // 頂点座標を登録
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ARRAY_BUFFER, this._vertexBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ARRAY_BUFFER, this._positionArray, lappdelegate_1.gl.STATIC_DRAW);
        // attribute属性を登録
        lappdelegate_1.gl.vertexAttribPointer(this._positionLocation, 2, lappdelegate_1.gl.FLOAT, false, 0, 0);
        // 頂点インデックスを作成
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ELEMENT_ARRAY_BUFFER, this._indexArray, lappdelegate_1.gl.DYNAMIC_DRAW);
        // モデルの描画
        lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, this._texture);
        lappdelegate_1.gl.drawElements(lappdelegate_1.gl.TRIANGLES, this._indexArray.length, lappdelegate_1.gl.UNSIGNED_SHORT, 0);
    };
    /**
     * 当たり判定
     * @param pointX x座標
     * @param pointY y座標
     */
    LAppSprite.prototype.isHit = function (pointX, pointY) {
        // 画面サイズを取得する。
        var height = lappdelegate_1.canvas.height;
        // Y座標は変換する必要あり
        var y = height - pointY;
        return (pointX >= this._rect.left &&
            pointX <= this._rect.right &&
            y <= this._rect.up &&
            y >= this._rect.down);
    };
    return LAppSprite;
}());
exports.LAppSprite = LAppSprite;
var Rect = /** @class */ (function () {
    function Rect() {
    }
    return Rect;
}());
exports.Rect = Rect;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapptexturemanager.ts":
/*!*************************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapptexturemanager.ts ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextureInfo = exports.LAppTextureManager = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts");
/**
 * テクスチャ管理クラス
 * 画像読み込み、管理を行うクラス。
 */
var LAppTextureManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppTextureManager() {
        this._textures = new csmvector_1.csmVector();
    }
    /**
     * 解放する。
     */
    LAppTextureManager.prototype.release = function () {
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            lappdelegate_1.gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    };
    /**
     * 画像読み込み
     *
     * @param fileName 読み込む画像ファイルパス名
     * @param usePremultiply Premult処理を有効にするか
     * @return 画像情報、読み込み失敗時はnullを返す
     */
    LAppTextureManager.prototype.createTextureFromPngFile = function (fileName, usePremultiply, callback) {
        var _this = this;
        var _loop_1 = function (ite) {
            if (ite.ptr().fileName == fileName &&
                ite.ptr().usePremultply == usePremultiply) {
                // 2回目以降はキャッシュが使用される(待ち時間なし)
                // WebKitでは同じImageのonloadを再度呼ぶには再インスタンスが必要
                // 詳細：https://stackoverflow.com/a/5024181
                ite.ptr().img = new Image();
                ite.ptr().img.onload = function () { return callback(ite.ptr()); };
                ite.ptr().img.src = fileName;
                return { value: void 0 };
            }
        };
        // search loaded texture already
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            var state_1 = _loop_1(ite);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // データのオンロードをトリガーにする
        var img = new Image();
        img.onload = function () {
            // テクスチャオブジェクトの作成
            var tex = lappdelegate_1.gl.createTexture();
            // テクスチャを選択
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, tex);
            // テクスチャにピクセルを書き込む
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MIN_FILTER, lappdelegate_1.gl.LINEAR_MIPMAP_LINEAR);
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MAG_FILTER, lappdelegate_1.gl.LINEAR);
            // Premult処理を行わせる
            if (usePremultiply) {
                lappdelegate_1.gl.pixelStorei(lappdelegate_1.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }
            // テクスチャにピクセルを書き込む
            lappdelegate_1.gl.texImage2D(lappdelegate_1.gl.TEXTURE_2D, 0, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.UNSIGNED_BYTE, img);
            // ミップマップを生成
            lappdelegate_1.gl.generateMipmap(lappdelegate_1.gl.TEXTURE_2D);
            // テクスチャをバインド
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, null);
            var textureInfo = new TextureInfo();
            if (textureInfo != null) {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                _this._textures.pushBack(textureInfo);
            }
            callback(textureInfo);
        };
        img.src = fileName;
    };
    /**
     * 画像の解放
     *
     * 配列に存在する画像全てを解放する。
     */
    LAppTextureManager.prototype.releaseTextures = function () {
        for (var i = 0; i < this._textures.getSize(); i++) {
            this._textures.set(i, null);
        }
        this._textures.clear();
    };
    /**
     * 画像の解放
     *
     * 指定したテクスチャの画像を解放する。
     * @param texture 解放するテクスチャ
     */
    LAppTextureManager.prototype.releaseTextureByTexture = function (texture) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).id != texture) {
                continue;
            }
            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    };
    /**
     * 画像の解放
     *
     * 指定した名前の画像を解放する。
     * @param fileName 解放する画像ファイルパス名
     */
    LAppTextureManager.prototype.releaseTextureByFilePath = function (fileName) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).fileName == fileName) {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    };
    return LAppTextureManager;
}());
exports.LAppTextureManager = LAppTextureManager;
/**
 * 画像情報構造体
 */
var TextureInfo = /** @class */ (function () {
    function TextureInfo() {
        this.id = null; // テクスチャ
        this.width = 0; // 横幅
        this.height = 0; // 高さ
    }
    return TextureInfo;
}());
exports.TextureInfo = TextureInfo;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappview.ts":
/*!***************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappview.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppView = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
var cubismviewmatrix_1 = __webpack_require__(/*! @framework/math/cubismviewmatrix */ "../../../../CubismSdkForWeb/Framework/src/math/cubismviewmatrix.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdelegate.ts");
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapplive2dmanager.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var lappsprite_1 = __webpack_require__(/*! ./lappsprite */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappsprite.ts");
var touchmanager_1 = __webpack_require__(/*! ./touchmanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/touchmanager.ts");
/**
 * 描画クラス。
 */
var LAppView = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppView() {
        this._programId = null;
        this._back = null;
        this._gear = null;
        // タッチ関係のイベント管理
        this._touchManager = new touchmanager_1.TouchManager();
        // デバイス座標からスクリーン座標に変換するための
        this._deviceToScreen = new cubismmatrix44_1.CubismMatrix44();
        // 画面の表示の拡大縮小や移動の変換を行う行列
        this._viewMatrix = new cubismviewmatrix_1.CubismViewMatrix();
    }
    /**
     * 初期化する。
     */
    LAppView.prototype.initialize = function () {
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        var ratio = width / height;
        var left = -ratio;
        var right = ratio;
        var bottom = LAppDefine.ViewLogicalLeft;
        var top = LAppDefine.ViewLogicalRight;
        this._viewMatrix.setScreenRect(left, right, bottom, top); // デバイスに対応する画面の範囲。 Xの左端、Xの右端、Yの下端、Yの上端
        this._viewMatrix.scale(LAppDefine.ViewScale, LAppDefine.ViewScale);
        this._deviceToScreen.loadIdentity();
        if (width > height) {
            var screenW = Math.abs(right - left);
            this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        }
        else {
            var screenH = Math.abs(top - bottom);
            this._deviceToScreen.scaleRelative(screenH / height, -screenH / height);
        }
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);
        // 表示範囲の設定
        this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 限界拡張率
        this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 限界縮小率
        // 表示できる最大範囲
        this._viewMatrix.setMaxScreenRect(LAppDefine.ViewLogicalMaxLeft, LAppDefine.ViewLogicalMaxRight, LAppDefine.ViewLogicalMaxBottom, LAppDefine.ViewLogicalMaxTop);
    };
    /**
     * 解放する
     */
    LAppView.prototype.release = function () {
        this._viewMatrix = null;
        this._touchManager = null;
        this._deviceToScreen = null;
        this._gear.release();
        this._gear = null;
        this._back.release();
        this._back = null;
        lappdelegate_1.gl.deleteProgram(this._programId);
        this._programId = null;
    };
    /**
     * 描画する。
     */
    LAppView.prototype.render = function () {
        lappdelegate_1.gl.useProgram(this._programId);
        if (this._back) {
            this._back.render(this._programId);
        }
        if (this._gear) {
            this._gear.render(this._programId);
        }
        lappdelegate_1.gl.flush();
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.setViewMatrix(this._viewMatrix);
        live2DManager.onUpdate();
    };
    /**
     * 画像の初期化を行う。
     */
    LAppView.prototype.initializeSprite = function () {
        var _this = this;
        var width = lappdelegate_1.canvas.width;
        var height = lappdelegate_1.canvas.height;
        var textureManager = lappdelegate_1.LAppDelegate.getInstance().getTextureManager();
        var resourcesPath = LAppDefine.ResourcesPath;
        var imageName = '';
        // 背景画像初期化
        imageName = LAppDefine.BackImageName;
        // 非同期なのでコールバック関数を作成
        var initBackGroundTexture = function (textureInfo) {
            var x = width * 0.5;
            var y = height * 0.5;
            var fwidth = textureInfo.width * 2.0;
            var fheight = height * 0.95;
            _this._back = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initBackGroundTexture);
        // 歯車画像初期化
        imageName = LAppDefine.GearImageName;
        var initGearTexture = function (textureInfo) {
            var x = width - textureInfo.width * 0.5;
            var y = height - textureInfo.height * 0.5;
            var fwidth = textureInfo.width;
            var fheight = textureInfo.height;
            _this._gear = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initGearTexture);
        // シェーダーを作成
        if (this._programId == null) {
            this._programId = lappdelegate_1.LAppDelegate.getInstance().createShader();
        }
    };
    /**
     * タッチされた時に呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppView.prototype.onTouchesBegan = function (pointX, pointY) {
        this._touchManager.touchesBegan(pointX, pointY);
    };
    /**
     * タッチしているときにポインタが動いたら呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppView.prototype.onTouchesMoved = function (pointX, pointY) {
        var viewX = this.transformViewX(this._touchManager.getX());
        var viewY = this.transformViewY(this._touchManager.getY());
        this._touchManager.touchesMoved(pointX, pointY);
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onDrag(viewX, viewY);
    };
    /**
     * タッチが終了したら呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppView.prototype.onTouchesEnded = function (pointX, pointY) {
        // タッチ終了
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onDrag(0.0, 0.0);
        {
            // シングルタップ
            var x = this._deviceToScreen.transformX(this._touchManager.getX()); // 論理座標変換した座標を取得。
            var y = this._deviceToScreen.transformY(this._touchManager.getY()); // 論理座標変化した座標を取得。
            if (LAppDefine.DebugTouchLogEnable) {
                lapppal_1.LAppPal.printMessage("[APP]touchesEnded x: ".concat(x, " y: ").concat(y));
            }
            live2DManager.onTap(x, y);
            // 歯車にタップしたか
            if (this._gear.isHit(pointX, pointY)) {
                live2DManager.nextScene();
            }
        }
    };
    /**
     * X座標をView座標に変換する。
     *
     * @param deviceX デバイスX座標
     */
    LAppView.prototype.transformViewX = function (deviceX) {
        var screenX = this._deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
    };
    /**
     * Y座標をView座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    LAppView.prototype.transformViewY = function (deviceY) {
        var screenY = this._deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformY(screenY);
    };
    /**
     * X座標をScreen座標に変換する。
     * @param deviceX デバイスX座標
     */
    LAppView.prototype.transformScreenX = function (deviceX) {
        return this._deviceToScreen.transformX(deviceX);
    };
    /**
     * Y座標をScreen座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    LAppView.prototype.transformScreenY = function (deviceY) {
        return this._deviceToScreen.transformY(deviceY);
    };
    return LAppView;
}());
exports.LAppView = LAppView;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappwavfilehandler.ts":
/*!*************************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappwavfilehandler.ts ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ByteReader = exports.WavFileInfo = exports.LAppWavFileHandler = exports.s_instance = void 0;
exports.s_instance = null;
var LAppWavFileHandler = /** @class */ (function () {
    function LAppWavFileHandler() {
        var _this = this;
        this._loadFiletoBytes = function (arrayBuffer, length) {
            _this._byteReader._fileByte = arrayBuffer;
            _this._byteReader._fileDataView = new DataView(_this._byteReader._fileByte);
            _this._byteReader._fileSize = length;
        };
        this._pcmData = null;
        this._userTimeSeconds = 0.0;
        this._lastRms = 0.0;
        this._sampleOffset = 0.0;
        this._wavFileInfo = new WavFileInfo();
        this._byteReader = new ByteReader();
    }
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    LAppWavFileHandler.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppWavFileHandler();
        }
        return exports.s_instance;
    };
    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    LAppWavFileHandler.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    LAppWavFileHandler.prototype.update = function (deltaTimeSeconds) {
        var goalOffset;
        var rms;
        // データロード前/ファイル末尾に達した場合は更新しない
        if (this._pcmData == null ||
            this._sampleOffset >= this._wavFileInfo._samplesPerChannel) {
            this._lastRms = 0.0;
            return false;
        }
        // 経過時間後の状態を保持
        this._userTimeSeconds += deltaTimeSeconds;
        goalOffset = Math.floor(this._userTimeSeconds * this._wavFileInfo._samplingRate);
        if (goalOffset > this._wavFileInfo._samplesPerChannel) {
            goalOffset = this._wavFileInfo._samplesPerChannel;
        }
        // RMS計測
        rms = 0.0;
        for (var channelCount = 0; channelCount < this._wavFileInfo._numberOfChannels; channelCount++) {
            for (var sampleCount = this._sampleOffset; sampleCount < goalOffset; sampleCount++) {
                var pcm = this._pcmData[channelCount][sampleCount];
                rms += pcm * pcm;
            }
        }
        rms = Math.sqrt(rms /
            (this._wavFileInfo._numberOfChannels *
                (goalOffset - this._sampleOffset)));
        this._lastRms = rms;
        this._sampleOffset = goalOffset;
        return true;
    };
    LAppWavFileHandler.prototype.start = function (filePath) {
        // サンプル位参照位置を初期化
        this._sampleOffset = 0;
        this._userTimeSeconds = 0.0;
        // RMS値をリセット
        this._lastRms = 0.0;
        if (!this.loadWavFile(filePath)) {
            return;
        }
    };
    LAppWavFileHandler.prototype.getRms = function () {
        return this._lastRms;
    };
    LAppWavFileHandler.prototype.loadWavFile = function (filePath) {
        var _this = this;
        var ret = false;
        if (this._pcmData != null) {
            this.releasePcmData();
        }
        // ファイルロード
        var asyncFileLoad = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(filePath).then(function (responce) {
                        return responce.arrayBuffer();
                    })];
            });
        }); };
        var asyncWavFileManager = (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, fmtChunkSize, dataChunkSize, channelCount, sampleCount, channelCount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this._byteReader;
                        return [4 /*yield*/, asyncFileLoad()];
                    case 1:
                        _a._fileByte = _b.sent();
                        this._byteReader._fileDataView = new DataView(this._byteReader._fileByte);
                        this._byteReader._fileSize = this._byteReader._fileByte.byteLength;
                        this._byteReader._readOffset = 0;
                        // ファイルロードに失敗しているか、先頭のシグネチャ"RIFF"を入れるサイズもない場合は失敗
                        if (this._byteReader._fileByte == null ||
                            this._byteReader._fileSize < 4) {
                            return [2 /*return*/, false];
                        }
                        // ファイル名
                        this._wavFileInfo._fileName = filePath;
                        try {
                            // シグネチャ "RIFF"
                            if (!this._byteReader.getCheckSignature('RIFF')) {
                                ret = false;
                                throw new Error('Cannot find Signeture "RIFF".');
                            }
                            // ファイルサイズ-8（読み飛ばし）
                            this._byteReader.get32LittleEndian();
                            // シグネチャ "WAVE"
                            if (!this._byteReader.getCheckSignature('WAVE')) {
                                ret = false;
                                throw new Error('Cannot find Signeture "WAVE".');
                            }
                            // シグネチャ "fmt "
                            if (!this._byteReader.getCheckSignature('fmt ')) {
                                ret = false;
                                throw new Error('Cannot find Signeture "fmt".');
                            }
                            fmtChunkSize = this._byteReader.get32LittleEndian();
                            // フォーマットIDは1（リニアPCM）以外受け付けない
                            if (this._byteReader.get16LittleEndian() != 1) {
                                ret = false;
                                throw new Error('File is not linear PCM.');
                            }
                            // チャンネル数
                            this._wavFileInfo._numberOfChannels =
                                this._byteReader.get16LittleEndian();
                            // サンプリングレート
                            this._wavFileInfo._samplingRate = this._byteReader.get32LittleEndian();
                            // データ速度[byte/sec]（読み飛ばし）
                            this._byteReader.get32LittleEndian();
                            // ブロックサイズ（読み飛ばし）
                            this._byteReader.get16LittleEndian();
                            // 量子化ビット数
                            this._wavFileInfo._bitsPerSample = this._byteReader.get16LittleEndian();
                            // fmtチャンクの拡張部分の読み飛ばし
                            if (fmtChunkSize > 16) {
                                this._byteReader._readOffset += fmtChunkSize - 16;
                            }
                            // "data"チャンクが出現するまで読み飛ばし
                            while (!this._byteReader.getCheckSignature('data') &&
                                this._byteReader._readOffset < this._byteReader._fileSize) {
                                this._byteReader._readOffset +=
                                    this._byteReader.get32LittleEndian() + 4;
                            }
                            // ファイル内に"data"チャンクが出現しなかった
                            if (this._byteReader._readOffset >= this._byteReader._fileSize) {
                                ret = false;
                                throw new Error('Cannot find "data" Chunk.');
                            }
                            // サンプル数
                            {
                                dataChunkSize = this._byteReader.get32LittleEndian();
                                this._wavFileInfo._samplesPerChannel =
                                    (dataChunkSize * 8) /
                                        (this._wavFileInfo._bitsPerSample *
                                            this._wavFileInfo._numberOfChannels);
                            }
                            // 領域確保
                            this._pcmData = new Array(this._wavFileInfo._numberOfChannels);
                            for (channelCount = 0; channelCount < this._wavFileInfo._numberOfChannels; channelCount++) {
                                this._pcmData[channelCount] = new Float32Array(this._wavFileInfo._samplesPerChannel);
                            }
                            // 波形データ取得
                            for (sampleCount = 0; sampleCount < this._wavFileInfo._samplesPerChannel; sampleCount++) {
                                for (channelCount = 0; channelCount < this._wavFileInfo._numberOfChannels; channelCount++) {
                                    this._pcmData[channelCount][sampleCount] = this.getPcmSample();
                                }
                            }
                            ret = true;
                        }
                        catch (e) {
                            console.log(e);
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
        return ret;
    };
    LAppWavFileHandler.prototype.getPcmSample = function () {
        var pcm32;
        // 32ビット幅に拡張してから-1～1の範囲に丸める
        switch (this._wavFileInfo._bitsPerSample) {
            case 8:
                pcm32 = this._byteReader.get8() - 128;
                pcm32 <<= 24;
                break;
            case 16:
                pcm32 = this._byteReader.get16LittleEndian() << 16;
                break;
            case 24:
                pcm32 = this._byteReader.get24LittleEndian() << 8;
                break;
            default:
                // 対応していないビット幅
                pcm32 = 0;
                break;
        }
        return pcm32 / 2147483647; //Number.MAX_VALUE;
    };
    LAppWavFileHandler.prototype.releasePcmData = function () {
        for (var channelCount = 0; channelCount < this._wavFileInfo._numberOfChannels; channelCount++) {
            delete this._pcmData[channelCount];
        }
        delete this._pcmData;
        this._pcmData = null;
    };
    return LAppWavFileHandler;
}());
exports.LAppWavFileHandler = LAppWavFileHandler;
var WavFileInfo = /** @class */ (function () {
    function WavFileInfo() {
        this._fileName = '';
        this._numberOfChannels = 0;
        this._bitsPerSample = 0;
        this._samplingRate = 0;
        this._samplesPerChannel = 0;
    }
    return WavFileInfo;
}());
exports.WavFileInfo = WavFileInfo;
var ByteReader = /** @class */ (function () {
    function ByteReader() {
        this._fileByte = null;
        this._fileDataView = null;
        this._fileSize = 0;
        this._readOffset = 0;
    }
    /**
     * @brief 8ビット読み込み
     * @return Csm::csmUint8 読み取った8ビット値
     */
    ByteReader.prototype.get8 = function () {
        var ret = this._fileDataView.getUint8(this._readOffset);
        this._readOffset++;
        return ret;
    };
    /**
     * @brief 16ビット読み込み（リトルエンディアン）
     * @return Csm::csmUint16 読み取った16ビット値
     */
    ByteReader.prototype.get16LittleEndian = function () {
        var ret = (this._fileDataView.getUint8(this._readOffset + 1) << 8) |
            this._fileDataView.getUint8(this._readOffset);
        this._readOffset += 2;
        return ret;
    };
    /**
     * @brief 24ビット読み込み（リトルエンディアン）
     * @return Csm::csmUint32 読み取った24ビット値（下位24ビットに設定）
     */
    ByteReader.prototype.get24LittleEndian = function () {
        var ret = (this._fileDataView.getUint8(this._readOffset + 2) << 16) |
            (this._fileDataView.getUint8(this._readOffset + 1) << 8) |
            this._fileDataView.getUint8(this._readOffset);
        this._readOffset += 3;
        return ret;
    };
    /**
     * @brief 32ビット読み込み（リトルエンディアン）
     * @return Csm::csmUint32 読み取った32ビット値
     */
    ByteReader.prototype.get32LittleEndian = function () {
        var ret = (this._fileDataView.getUint8(this._readOffset + 3) << 24) |
            (this._fileDataView.getUint8(this._readOffset + 2) << 16) |
            (this._fileDataView.getUint8(this._readOffset + 1) << 8) |
            this._fileDataView.getUint8(this._readOffset);
        this._readOffset += 4;
        return ret;
    };
    /**
     * @brief シグネチャの取得と参照文字列との一致チェック
     * @param[in] reference 検査対象のシグネチャ文字列
     * @retval  true    一致している
     * @retval  false   一致していない
     */
    ByteReader.prototype.getCheckSignature = function (reference) {
        var getSignature = new Uint8Array(4);
        var referenceString = new TextEncoder().encode(reference);
        if (reference.length != 4) {
            return false;
        }
        for (var signatureOffset = 0; signatureOffset < 4; signatureOffset++) {
            getSignature[signatureOffset] = this.get8();
        }
        return (getSignature[0] == referenceString[0] &&
            getSignature[1] == referenceString[1] &&
            getSignature[2] == referenceString[2] &&
            getSignature[3] == referenceString[3]);
    };
    return ByteReader;
}());
exports.ByteReader = ByteReader;


/***/ }),

/***/ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/touchmanager.ts":
/*!*******************************************************************************!*\
  !*** ../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/touchmanager.ts ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouchManager = void 0;
var TouchManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function TouchManager() {
        this._startX = 0.0;
        this._startY = 0.0;
        this._lastX = 0.0;
        this._lastY = 0.0;
        this._lastX1 = 0.0;
        this._lastY1 = 0.0;
        this._lastX2 = 0.0;
        this._lastY2 = 0.0;
        this._lastTouchDistance = 0.0;
        this._deltaX = 0.0;
        this._deltaY = 0.0;
        this._scale = 1.0;
        this._touchSingle = false;
        this._flipAvailable = false;
    }
    TouchManager.prototype.getCenterX = function () {
        return this._lastX;
    };
    TouchManager.prototype.getCenterY = function () {
        return this._lastY;
    };
    TouchManager.prototype.getDeltaX = function () {
        return this._deltaX;
    };
    TouchManager.prototype.getDeltaY = function () {
        return this._deltaY;
    };
    TouchManager.prototype.getStartX = function () {
        return this._startX;
    };
    TouchManager.prototype.getStartY = function () {
        return this._startY;
    };
    TouchManager.prototype.getScale = function () {
        return this._scale;
    };
    TouchManager.prototype.getX = function () {
        return this._lastX;
    };
    TouchManager.prototype.getY = function () {
        return this._lastY;
    };
    TouchManager.prototype.getX1 = function () {
        return this._lastX1;
    };
    TouchManager.prototype.getY1 = function () {
        return this._lastY1;
    };
    TouchManager.prototype.getX2 = function () {
        return this._lastX2;
    };
    TouchManager.prototype.getY2 = function () {
        return this._lastY2;
    };
    TouchManager.prototype.isSingleTouch = function () {
        return this._touchSingle;
    };
    TouchManager.prototype.isFlickAvailable = function () {
        return this._flipAvailable;
    };
    TouchManager.prototype.disableFlick = function () {
        this._flipAvailable = false;
    };
    /**
     * タッチ開始時イベント
     * @param deviceX タッチした画面のxの値
     * @param deviceY タッチした画面のyの値
     */
    TouchManager.prototype.touchesBegan = function (deviceX, deviceY) {
        this._lastX = deviceX;
        this._lastY = deviceY;
        this._startX = deviceX;
        this._startY = deviceY;
        this._lastTouchDistance = -1.0;
        this._flipAvailable = true;
        this._touchSingle = true;
    };
    /**
     * ドラッグ時のイベント
     * @param deviceX タッチした画面のxの値
     * @param deviceY タッチした画面のyの値
     */
    TouchManager.prototype.touchesMoved = function (deviceX, deviceY) {
        this._lastX = deviceX;
        this._lastY = deviceY;
        this._lastTouchDistance = -1.0;
        this._touchSingle = true;
    };
    /**
     * フリックの距離測定
     * @return フリック距離
     */
    TouchManager.prototype.getFlickDistance = function () {
        return this.calculateDistance(this._startX, this._startY, this._lastX, this._lastY);
    };
    /**
     * 点１から点２への距離を求める
     *
     * @param x1 １つ目のタッチした画面のxの値
     * @param y1 １つ目のタッチした画面のyの値
     * @param x2 ２つ目のタッチした画面のxの値
     * @param y2 ２つ目のタッチした画面のyの値
     */
    TouchManager.prototype.calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };
    /**
     * ２つ目の値から、移動量を求める。
     * 違う方向の場合は移動量０。同じ方向の場合は、絶対値が小さい方の値を参照する。
     *
     * @param v1 １つ目の移動量
     * @param v2 ２つ目の移動量
     *
     * @return 小さい方の移動量
     */
    TouchManager.prototype.calculateMovingAmount = function (v1, v2) {
        if (v1 > 0.0 != v2 > 0.0) {
            return 0.0;
        }
        var sign = v1 > 0.0 ? 1.0 : -1.0;
        var absoluteValue1 = Math.abs(v1);
        var absoluteValue2 = Math.abs(v2);
        return (sign * (absoluteValue1 < absoluteValue2 ? absoluteValue1 : absoluteValue2));
    };
    return TouchManager;
}());
exports.TouchManager = TouchManager;


/***/ }),

/***/ "../../../Framework/src/cubismmodelmotionsyncsettingjson.ts":
/*!******************************************************************!*\
  !*** ../../../Framework/src/cubismmodelmotionsyncsettingjson.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismModelMotionSyncSettingJson = exports.MotionSync = exports.FileReferences = void 0;
var cubismmodelsettingjson_1 = __webpack_require__(/*! @framework/cubismmodelsettingjson */ "../../../../CubismSdkForWeb/Framework/src/cubismmodelsettingjson.ts");
var csmstring_1 = __webpack_require__(/*! @framework/type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
exports.FileReferences = 'FileReferences';
exports.MotionSync = 'MotionSync';
var CubismModelMotionSyncSettingJson = /** @class */ (function (_super) {
    __extends(CubismModelMotionSyncSettingJson, _super);
    function CubismModelMotionSyncSettingJson(buffer, size) {
        var _this = _super.call(this, buffer, size) || this;
        _this._motionSyncFilePath = _this.GetJson()
            .getRoot()
            .getValueByString(exports.FileReferences)
            .getValueByString(exports.MotionSync)
            .getRawString();
        return _this;
    }
    CubismModelMotionSyncSettingJson.prototype.getMotionSyncFileName = function () {
        return this._motionSyncFilePath;
    };
    CubismModelMotionSyncSettingJson.prototype.getMotionSyncSoundFileList = function () {
        var list = new csmvector_1.csmVector();
        for (var index = 0; index < this.getMotionGroupCount(); index++) {
            var groupName = this.getMotionGroupName(index);
            for (var listIndex = 0; listIndex < this.getMotionCount(groupName); listIndex++) {
                list.pushBack(new csmstring_1.csmString(this.getMotionSoundFileName(groupName, listIndex)));
            }
        }
        return list;
    };
    return CubismModelMotionSyncSettingJson;
}(cubismmodelsettingjson_1.CubismModelSettingJson));
exports.CubismModelMotionSyncSettingJson = CubismModelMotionSyncSettingJson;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmodelmotionsyncsettingjson */ "../../../Framework/src/cubismmodelmotionsyncsettingjson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismModelMotionSyncSettingJson = $.CubismModelMotionSyncSettingJson;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncdata.ts":
/*!******************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncdata.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncDataSetting = exports.CubismMotionSyncDataMapping = exports.CubismMotionSyncDataMappingTarget = exports.CubismMotionSyncDataAudioParameter = exports.CubismMotionSyncDataCubismParameter = exports.CubismMotionSyncDataMeta = exports.CubismMotionSyncDataMetaDictionary = exports.CubismMotionSyncDataMappingType = exports.CubismMotionSyncDataUseCase = exports.CubismMotionSyncData = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncdatajson_1 = __webpack_require__(/*! ./cubismmotionsyncdatajson */ "../../../Framework/src/cubismmotionsyncdatajson.ts");
var cubismmotionsyncenginemappinginfo_1 = __webpack_require__(/*! ./cubismmotionsyncenginemappinginfo */ "../../../Framework/src/cubismmotionsyncenginemappinginfo.ts");
var CubismMotionSyncData = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function CubismMotionSyncData() {
        this._version = 0;
        this._meta = null;
        this._settings = null;
    }
    /**
     * インスタンスの作成
     * @param buffer    physics3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     * @return 作成されたインスタンス
     */
    CubismMotionSyncData.create = function (model, buffer, size) {
        var ret = new CubismMotionSyncData();
        ret.parse(model, buffer, size);
        return ret;
    };
    /**
     * インスタンスを破棄する
     * @param motionSyncData 破棄するインスタンス
     */
    CubismMotionSyncData.delete = function (motionSyncData) {
        if (motionSyncData != null) {
            motionSyncData.release();
            motionSyncData = null;
        }
    };
    /**
     * motionsync3.jsonをパースする。
     *
     * @param motionSyncJson  motionsync3.jsonが読み込まれているバッファ
     * @param size        バッファのサイズ
     */
    CubismMotionSyncData.prototype.parse = function (model, motionSyncJson, size) {
        var json = new cubismmotionsyncdatajson_1.CubismMotionSyncDataJson(motionSyncJson, size);
        if (json._json == null || model == null) {
            (0, cubismdebug_1.CubismLogWarning)('Failed to parse .motionsync3.json.');
            return;
        }
        this._version = json.getVersion();
        this._meta = json.getMeta();
        this._settings = new csmvector_1.csmVector();
        for (var index = 0; index < this._meta.settingCount; index++) {
            this._settings.pushBack(json.getSetting(index));
        }
        this._settingCount = this._settings.getSize();
        for (var index = 0; index < this._settings.getSize(); index++) {
            var cubismParameterList = this._settings.at(index).cubismParameterList;
            var parameterCount = cubismParameterList.getSize();
            for (var cubismParameterIndex = 0; cubismParameterIndex < parameterCount; cubismParameterIndex++) {
                var partIndex = parameterCount;
                for (var modelParameterIndex = 0; modelParameterIndex < model.getParameterCount(); modelParameterIndex++) {
                    if (model
                        .getParameterId(modelParameterIndex)
                        .isEqual(cubismParameterList.at(cubismParameterIndex).id)) {
                        partIndex = modelParameterIndex;
                        break;
                    }
                }
                cubismParameterList.at(cubismParameterIndex).parameterIndex = partIndex;
            }
        }
        json.release();
        json = void 0;
        json = null;
    };
    /**
     * デストラクタ相当の処理
     */
    CubismMotionSyncData.prototype.release = function () {
        this._version = void 0;
        this._meta = void 0;
        this._meta = null;
        this._settings = void 0;
        this._settings = null;
        this._settingCount = 0;
    };
    CubismMotionSyncData.prototype.getVersion = function () {
        return this._version;
    };
    CubismMotionSyncData.prototype.getMeta = function () {
        return this._meta;
    };
    CubismMotionSyncData.prototype.getSetting = function (index) {
        return this._settings.at(index);
    };
    CubismMotionSyncData.prototype.getSettingCount = function () {
        return this._settingCount;
    };
    CubismMotionSyncData.prototype.getMappingInfoList = function (index) {
        if (this._settings.getSize() <= index) {
            return null;
        }
        var mappingInfoList = new csmvector_1.csmVector();
        var setting = this.getSetting(index);
        for (var audioParamIndex = 0; audioParamIndex < setting.audioParameterList.getSize(); audioParamIndex++) {
            var audioParamId = setting.audioParameterList.at(audioParamIndex).id;
            var modelParamIds = new csmvector_1.csmVector();
            var modelParamValues = new csmvector_1.csmVector();
            for (var serchIndex = 0; serchIndex < setting.audioParameterList.getSize(); serchIndex++) {
                if (audioParamId.isEqual(setting.mappingList.at(serchIndex).audioId.s)) {
                    for (var cubismPramIndex = 0; cubismPramIndex < setting.cubismParameterList.getSize(); cubismPramIndex++) {
                        var target = setting.mappingList.at(serchIndex).targetList.at(cubismPramIndex);
                        modelParamIds.pushBack(target.id);
                        modelParamValues.pushBack(target.value);
                    }
                    break;
                }
            }
            var scale = setting.audioParameterList.at(audioParamIndex).scale;
            var enabled = setting.audioParameterList.at(audioParamIndex).enabled;
            mappingInfoList.pushBack(new cubismmotionsyncenginemappinginfo_1.CubismMotionSyncEngineMappingInfo(audioParamId, modelParamIds, modelParamValues, scale, enabled));
        }
        return mappingInfoList;
    };
    return CubismMotionSyncData;
}());
exports.CubismMotionSyncData = CubismMotionSyncData;
/**
 * モーションシンク設定のユースケース
 */
var CubismMotionSyncDataUseCase;
(function (CubismMotionSyncDataUseCase) {
    CubismMotionSyncDataUseCase[CubismMotionSyncDataUseCase["UseCase_Mouth"] = 0] = "UseCase_Mouth";
    CubismMotionSyncDataUseCase[CubismMotionSyncDataUseCase["UseCase_Unknown"] = 1] = "UseCase_Unknown";
})(CubismMotionSyncDataUseCase || (exports.CubismMotionSyncDataUseCase = CubismMotionSyncDataUseCase = {}));
/**
 * モーションシンク設定のマッピングタイプ
 */
var CubismMotionSyncDataMappingType;
(function (CubismMotionSyncDataMappingType) {
    CubismMotionSyncDataMappingType[CubismMotionSyncDataMappingType["MappingType_Shape"] = 0] = "MappingType_Shape";
    CubismMotionSyncDataMappingType[CubismMotionSyncDataMappingType["MappingType_Unknown"] = 1] = "MappingType_Unknown";
})(CubismMotionSyncDataMappingType || (exports.CubismMotionSyncDataMappingType = CubismMotionSyncDataMappingType = {}));
/**
 * モーションシンク設定のIdと名称
 */
var CubismMotionSyncDataMetaDictionary = /** @class */ (function () {
    function CubismMotionSyncDataMetaDictionary() {
    }
    return CubismMotionSyncDataMetaDictionary;
}());
exports.CubismMotionSyncDataMetaDictionary = CubismMotionSyncDataMetaDictionary;
/**
 * メタデータ
 */
var CubismMotionSyncDataMeta = /** @class */ (function () {
    function CubismMotionSyncDataMeta() {
    }
    return CubismMotionSyncDataMeta;
}());
exports.CubismMotionSyncDataMeta = CubismMotionSyncDataMeta;
/**
 * CubismParametarsに登録されているCubismParametar
 */
var CubismMotionSyncDataCubismParameter = /** @class */ (function () {
    function CubismMotionSyncDataCubismParameter() {
    }
    return CubismMotionSyncDataCubismParameter;
}());
exports.CubismMotionSyncDataCubismParameter = CubismMotionSyncDataCubismParameter;
/**
 * AudioParametersに登録されている音声の要素
 */
var CubismMotionSyncDataAudioParameter = /** @class */ (function () {
    function CubismMotionSyncDataAudioParameter() {
    }
    return CubismMotionSyncDataAudioParameter;
}());
exports.CubismMotionSyncDataAudioParameter = CubismMotionSyncDataAudioParameter;
/**
 * マッピングのターゲット
 */
var CubismMotionSyncDataMappingTarget = /** @class */ (function () {
    function CubismMotionSyncDataMappingTarget() {
    }
    return CubismMotionSyncDataMappingTarget;
}());
exports.CubismMotionSyncDataMappingTarget = CubismMotionSyncDataMappingTarget;
/**
 * マッピングデータ
 */
var CubismMotionSyncDataMapping = /** @class */ (function () {
    function CubismMotionSyncDataMapping() {
    }
    return CubismMotionSyncDataMapping;
}());
exports.CubismMotionSyncDataMapping = CubismMotionSyncDataMapping;
var CubismMotionSyncDataSetting = /** @class */ (function () {
    function CubismMotionSyncDataSetting() {
    }
    return CubismMotionSyncDataSetting;
}());
exports.CubismMotionSyncDataSetting = CubismMotionSyncDataSetting;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncdata */ "../../../Framework/src/cubismmotionsyncdata.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncData = $.CubismMotionSyncData;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncdatajson.ts":
/*!**********************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncdatajson.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncDataJson = void 0;
var cubismjson_1 = __webpack_require__(/*! @framework/utils/cubismjson */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismjson.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var csmstring_1 = __webpack_require__(/*! @framework/type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncutil_1 = __webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts");
var cubismmotionsyncdata_1 = __webpack_require__(/*! ./cubismmotionsyncdata */ "../../../Framework/src/cubismmotionsyncdata.ts");
// JSON keys
var Version = 'Version';
var Meta = 'Meta';
var SettingCount = 'SettingCount';
var Dictionary = 'Dictionary';
var Id = 'Id';
var Name = 'Name';
var Settings = 'Settings';
var AnalysisType = 'AnalysisType';
var UseCase = 'UseCase';
var CubismParameters = 'CubismParameters';
var Min = 'Min';
var Max = 'Max';
var Damper = 'Damper';
var Smooth = 'Smooth';
var AudioParameters = 'AudioParameters';
var Scale = 'Scale';
var Enabled = 'Enabled';
var Mappings = 'Mappings';
var Type = 'Type';
var Targets = 'Targets';
var Value = 'Value';
var PostProcessing = 'PostProcessing';
var BlendRatio = 'BlendRatio';
var Smoothing = 'Smoothing';
var SampleRate = 'SampleRate';
/**
 * motionsync3.jsonのコンテナ。
 */
var CubismMotionSyncDataJson = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param buffer motionsync3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    function CubismMotionSyncDataJson(buffer, size) {
        this._json = cubismjson_1.CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    CubismMotionSyncDataJson.prototype.release = function () {
        cubismjson_1.CubismJson.delete(this._json);
    };
    /**
     * バージョン情報を取得する
     * @return バージョン数
     */
    CubismMotionSyncDataJson.prototype.getVersion = function () {
        return this._json.getRoot().getValueByString(Version).toInt();
    };
    // --- Meta ---
    /**
     * モーションシンク設定のメタ情報を取得する
     * @return ーションシンク設定のメタ情報
     */
    CubismMotionSyncDataJson.prototype.getMeta = function () {
        var meta = null;
        meta = new cubismmotionsyncdata_1.CubismMotionSyncDataMeta();
        meta.settingCount = this.getSettingCount();
        meta.dictionary = new csmvector_1.csmVector();
        for (var index = 0; index < meta.settingCount; index++) {
            meta.dictionary.pushBack(this.getMetaDictionaryItem(index));
        }
        return meta;
    };
    /**
     * Metaのモーションシンク設定リストのアイテムを取得する
     * @param index アイテムのインデックス
     * @return モーションシンク設定リストのアイテム
     */
    CubismMotionSyncDataJson.prototype.getMetaDictionaryItem = function (index) {
        var dictionary = new cubismmotionsyncdata_1.CubismMotionSyncDataMetaDictionary();
        dictionary.id = new csmstring_1.csmString(this.getIdFromMeta(index));
        dictionary.name = new csmstring_1.csmString(this.getName(index));
        return dictionary;
    };
    /**
     * モーションシンク設定の数を取得する
     * @return モーションシンク設定の数
     */
    CubismMotionSyncDataJson.prototype.getSettingCount = function () {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(SettingCount)
            .toInt();
    };
    /**
     * Metaからモーションシンク設定のIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return モーションシンク設定のId
     */
    CubismMotionSyncDataJson.prototype.getIdFromMeta = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Dictionary)
            .getValueByIndex(settingIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * モーションシンク設定の名前を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return モーションシンク設定の名前
     */
    CubismMotionSyncDataJson.prototype.getName = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Dictionary)
            .getValueByIndex(settingIndex)
            .getValueByString(Name)
            .getString();
    };
    // --- Settings ---
    /**
     * Settingsからモーションシンク設定を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return モーションシンク設定
     */
    CubismMotionSyncDataJson.prototype.getSetting = function (settingIndex) {
        var setting = new cubismmotionsyncdata_1.CubismMotionSyncDataSetting();
        // Id
        setting.id = new csmstring_1.csmString(this.getIdFromSettings(settingIndex));
        // AnalysisType
        var analysisType = this.getAnalysisType(settingIndex);
        switch (analysisType) {
            case 'CRI':
                setting.analysisType = cubismmotionsyncutil_1.EngineType.EngineType_Cri;
                break;
            default:
                (0, cubismdebug_1.CubismLogWarning)('Unknown Settings.AnalysisType.');
                setting.analysisType = cubismmotionsyncutil_1.EngineType.EngineType_Unknown;
                break;
        }
        // UseCase
        var useCase = this.getUseCase(settingIndex);
        switch (useCase) {
            case 'Mouth':
                setting.useCase = cubismmotionsyncdata_1.CubismMotionSyncDataUseCase.UseCase_Mouth;
                break;
            default:
                (0, cubismdebug_1.CubismLogWarning)('Unknown Settings.UseCase.');
                setting.useCase = cubismmotionsyncdata_1.CubismMotionSyncDataUseCase.UseCase_Unknown;
                break;
        }
        // CubismParametars
        var cubismParametarsCount = this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getSize();
        setting.cubismParameterList =
            new csmvector_1.csmVector();
        for (var index = 0; index < cubismParametarsCount; index++) {
            setting.cubismParameterList.pushBack(this.getCubismParametarsElement(settingIndex, index));
        }
        // AudioParameters
        var audioParametersCount = this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getSize();
        setting.audioParameterList =
            new csmvector_1.csmVector();
        for (var index = 0; index < audioParametersCount; index++) {
            setting.audioParameterList.pushBack(this.getAudioParametersElement(settingIndex, index));
        }
        // Mappings
        setting.mappingList = new csmvector_1.csmVector();
        for (var index = 0; index < audioParametersCount; index++) {
            setting.mappingList.pushBack(this.getMappingsElement(settingIndex, index, cubismParametarsCount));
        }
        // PostProcessing
        setting.blendRatio = this.getBlendRatio(settingIndex);
        setting.smoothing = this.getSmoothingFromPostProcessing(settingIndex);
        setting.sampleRate = this.getSampleRate(settingIndex);
        return setting;
    };
    /**
     * Settingsからモーションシンク設定のIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return モーションシンク設定のId
     */
    CubismMotionSyncDataJson.prototype.getIdFromSettings = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * モーションシンク設定の音声解析タイプを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return 音声解析タイプ
     */
    CubismMotionSyncDataJson.prototype.getAnalysisType = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AnalysisType)
            .getString();
    };
    /**
     * モーションシンク設定のユースケースを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return ユースケース
     */
    CubismMotionSyncDataJson.prototype.getUseCase = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(UseCase)
            .getString();
    };
    // --- CubismParametars ---
    /**
     * CubismParametarsに登録されているCubismParametarアイテムを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarアイテム
     */
    CubismMotionSyncDataJson.prototype.getCubismParametarsElement = function (settingIndex, elementIndex) {
        var cubismParametar = new cubismmotionsyncdata_1.CubismMotionSyncDataCubismParameter();
        cubismParametar.name = new csmstring_1.csmString(this.getNameFromCubismParameters(settingIndex, elementIndex));
        cubismParametar.id = new csmstring_1.csmString(this.getIdFromCubismParameters(settingIndex, elementIndex));
        cubismParametar.min = this.getMinFromCubismParameters(settingIndex, elementIndex);
        cubismParametar.max = this.getMaxFromCubismParameters(settingIndex, elementIndex);
        cubismParametar.damper = this.getDamperFromCubismParameters(settingIndex, elementIndex);
        cubismParametar.smooth = this.getSmoothFromCubismParameters(settingIndex, elementIndex);
        return cubismParametar;
    };
    /**
     * CubismParametarsに登録されているCubismParametarの名称を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarの名称
     */
    CubismMotionSyncDataJson.prototype.getNameFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Name)
            .getString();
    };
    /**
     * CubismParametarsに登録されているCubismParametarのIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarのId
     */
    CubismMotionSyncDataJson.prototype.getIdFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * CubismParametarsに登録されているCubismParametarの最小値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarの最小値
     */
    CubismMotionSyncDataJson.prototype.getMinFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Min)
            .toFloat();
    };
    /**
     * CubismParametarsに登録されているCubismParametarの最大値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarの最大値
     */
    CubismMotionSyncDataJson.prototype.getMaxFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Max)
            .toFloat();
    };
    /**
     * CubismParametarsに登録されているCubismParametarの減衰値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarの減衰値
     */
    CubismMotionSyncDataJson.prototype.getDamperFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Damper)
            .toFloat();
    };
    /**
     * CubismParametarsに登録されているCubismParametarのスムージング値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex CubismParametarsから取得したい要素のインデックス
     * @return CubismParametarのスムージング値
     */
    CubismMotionSyncDataJson.prototype.getSmoothFromCubismParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(CubismParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Smooth)
            .toFloat();
    };
    // --- AudioParameters ---
    /**
     * AudioParametersに登録されている音声の要素を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素
     */
    CubismMotionSyncDataJson.prototype.getAudioParametersElement = function (settingIndex, elementIndex) {
        var audioParameter = new cubismmotionsyncdata_1.CubismMotionSyncDataAudioParameter();
        audioParameter.name = new csmstring_1.csmString(this.getNameFromAudioParameters(settingIndex, elementIndex));
        audioParameter.id = new csmstring_1.csmString(this.getIdFromAudioParameters(settingIndex, elementIndex));
        audioParameter.min = this.getMinFromAudioParameters(settingIndex, elementIndex);
        audioParameter.max = this.getMaxFromAudioParameters(settingIndex, elementIndex);
        audioParameter.scale = this.getScaleFromAudioParameters(settingIndex, elementIndex);
        audioParameter.enabled = this.getEnabledFromAudioParameters(settingIndex, elementIndex);
        return audioParameter;
    };
    /**
     * AudioParametersに登録されている音声の要素の名称を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素の名称
     */
    CubismMotionSyncDataJson.prototype.getNameFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Name)
            .getString();
    };
    /**
     * AudioParametersに登録されている音声の要素のIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素のId
     */
    CubismMotionSyncDataJson.prototype.getIdFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * AudioParametersに登録されている音声の要素の最小値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素の最小値
     */
    CubismMotionSyncDataJson.prototype.getMinFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Min)
            .toFloat();
    };
    /**
     * AudioParametersに登録されている音声の要素の最大値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素の最大値
     */
    CubismMotionSyncDataJson.prototype.getMaxFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Max)
            .toFloat();
    };
    /**
     * AudioParametersに登録されている音声の要素のスケール値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素のスケール値
     */
    CubismMotionSyncDataJson.prototype.getScaleFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Scale)
            .toFloat();
    };
    /**
     * AudioParametersに登録されている音声の要素の有効フラグを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex AudioParametersから取得したい要素のインデックス
     * @return 音声の要素の有効フラグ
     */
    CubismMotionSyncDataJson.prototype.getEnabledFromAudioParameters = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(AudioParameters)
            .getValueByIndex(elementIndex)
            .getValueByString(Enabled)
            .toBoolean();
    };
    // --- Mappings ---
    /**
     * Mappingsに登録されているマッピングデータを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex Mappingsから取得したい要素のインデックス
     * @return マッピングデータ
     */
    CubismMotionSyncDataJson.prototype.getMappingsElement = function (settingIndex, elementIndex, targetCount) {
        var mapping = new cubismmotionsyncdata_1.CubismMotionSyncDataMapping();
        var type = this.getMappingType(settingIndex, elementIndex);
        switch (type) {
            case 'Shape':
                mapping.type = cubismmotionsyncdata_1.CubismMotionSyncDataMappingType.MappingType_Shape;
                break;
            default:
                (0, cubismdebug_1.CubismLogWarning)('Unknown Mappings.Type.');
                mapping.type = cubismmotionsyncdata_1.CubismMotionSyncDataMappingType.MappingType_Unknown;
                break;
        }
        mapping.audioId = new csmstring_1.csmString(this.getAudioParamIdFromMappings(settingIndex, elementIndex));
        mapping.targetList = new csmvector_1.csmVector();
        for (var targetIndex = 0; targetIndex < targetCount; targetIndex++) {
            mapping.targetList.pushBack(this.getMappingTargetsElement(settingIndex, elementIndex, targetIndex));
        }
        return mapping;
    };
    /**
     * Mappingsに登録されているTargetsの要素を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param mappingIndex Mappingsから取得したい要素のインデックス
     * @param TargetsIndex Targetsから取得したい要素のインデックス
     * @return Targetsの要素
     */
    CubismMotionSyncDataJson.prototype.getMappingTargetsElement = function (settingIndex, mappingIndex, targetIndex) {
        var target = new cubismmotionsyncdata_1.CubismMotionSyncDataMappingTarget();
        target.id = new csmstring_1.csmString(this.getCubismIdFromMappingTarget(settingIndex, mappingIndex, targetIndex));
        target.value = this.getValueFromMappingTarget(settingIndex, mappingIndex, targetIndex);
        return target;
    };
    /**
     * マッピングのタイプを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex Mappingsから取得したい要素のインデックス
     * @return マッピングのタイプ
     */
    CubismMotionSyncDataJson.prototype.getMappingType = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(Mappings)
            .getValueByIndex(elementIndex)
            .getValueByString(Type)
            .getString();
    };
    /**
     * Mappingsに登録されている音声の要素のIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param elementIndex Mappingsから取得したい要素のインデックス
     * @return 音声の要素のId
     */
    CubismMotionSyncDataJson.prototype.getAudioParamIdFromMappings = function (settingIndex, elementIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(Mappings)
            .getValueByIndex(elementIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * Targetsに登録されているCubismParameterのIdを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param mappingIndex Mappingsから取得したい要素のインデックス
     * @param TargetsIndex Targetsから取得したい要素のインデックス
     * @return CubismParameterのId
     */
    CubismMotionSyncDataJson.prototype.getCubismIdFromMappingTarget = function (settingIndex, mappingIndex, targetIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(Mappings)
            .getValueByIndex(mappingIndex)
            .getValueByString(Targets)
            .getValueByIndex(targetIndex)
            .getValueByString(Id)
            .getString();
    };
    /**
     * Targetsに登録されているCubismParameterの値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @param mappingIndex Mappingsから取得したい要素のインデックス
     * @param TargetsIndex Targetsから取得したい要素のインデックス
     * @return CubismParameterの値
     */
    CubismMotionSyncDataJson.prototype.getValueFromMappingTarget = function (settingIndex, mappingIndex, targetIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(Mappings)
            .getValueByIndex(mappingIndex)
            .getValueByString(Targets)
            .getValueByIndex(targetIndex)
            .getValueByString(Value)
            .toFloat();
    };
    // --- PostProcessing ---
    /**
     * ブレンド率を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return ブレンド率
     */
    CubismMotionSyncDataJson.prototype.getBlendRatio = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(PostProcessing)
            .getValueByString(BlendRatio)
            .toFloat();
    };
    /**
     * スムージング値を取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return スムージング値
     */
    CubismMotionSyncDataJson.prototype.getSmoothingFromPostProcessing = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(PostProcessing)
            .getValueByString(Smoothing)
            .toInt();
    };
    /**
     * 設定フレームレートを取得する
     * @param settingIndex モーションシンク設定のインデックス
     * @return 設定フレームレート
     */
    CubismMotionSyncDataJson.prototype.getSampleRate = function (settingIndex) {
        return this._json
            .getRoot()
            .getValueByString(Settings)
            .getValueByIndex(settingIndex)
            .getValueByString(PostProcessing)
            .getValueByString(SampleRate)
            .toFloat();
    };
    return CubismMotionSyncDataJson;
}());
exports.CubismMotionSyncDataJson = CubismMotionSyncDataJson;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncdatajson */ "../../../Framework/src/cubismmotionsyncdatajson.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncDataJson = $.CubismMotionSyncDataJson;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncengineanalysisresult.ts":
/*!**********************************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncengineanalysisresult.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineAnalysisResult = void 0;
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
var s_analysisResultStructSize = 3;
var CubismMotionSyncEngineAnalysisResult = /** @class */ (function () {
    function CubismMotionSyncEngineAnalysisResult(valuesSize) {
        this._values = new Array(valuesSize);
        this._valuesCount = valuesSize;
        this._processedSampleCount = 0;
    }
    CubismMotionSyncEngineAnalysisResult.prototype.copy = function (result) {
        this._values = new Array();
        for (var index = 0; index < result.getValues().length; index++) {
            this._values.push(result.getValues()[index]);
        }
        this._valuesCount = result.getValuesCount();
        this._processedSampleCount = 0;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.toNativeArray = function (forceConversion) {
        // 強制的に新規作成しないのであれば既にあるものを返す
        if (!forceConversion && this._resultArray) {
            return this._resultArray;
        }
        if (this._resultArray) {
            this.releaseNativeArray();
        }
        this._resultArray = new Int32Array(this._valuesCount);
        this._resultArrayPtr = ToPointer.Malloc(this._resultArray.length * this._resultArray.BYTES_PER_ELEMENT);
        // Nativeポインタへの変換
        this._resultArray = ToPointer.ConvertAnalysisResultToInt32Array(this._resultArray, this._resultArrayPtr, this._valuesCount);
        return this._resultArray;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.releaseNativeArray = function () {
        this.deallocNativeArrayPtr();
        this._resultArray = void 0;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.release = function () {
        this._values = void 0;
        this._values = null;
        this._valuesCount = 0;
        this._processedSampleCount = 0;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.getValues = function () {
        return this._values;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.getValuesCount = function () {
        return this._valuesCount;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.getProcessedSampleCount = function () {
        return this._processedSampleCount;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.setProcessedSampleCount = function (sampleCount) {
        this._processedSampleCount = sampleCount;
    };
    CubismMotionSyncEngineAnalysisResult.prototype.ConvertNativeAnalysisResult = function (nativeArrayPtr) {
        this.ConvertFromNativeResultValues();
        this.ConvertFromNativeProcessedSampleCount(nativeArrayPtr);
    };
    CubismMotionSyncEngineAnalysisResult.prototype.ConvertFromNativeResultValues = function () {
        this._values = ToPointer.GetValuesFromAnalysisResult(this._resultArray[0], this._valuesCount);
    };
    CubismMotionSyncEngineAnalysisResult.prototype.ConvertFromNativeProcessedSampleCount = function (nativeArrayPtr) {
        this._processedSampleCount =
            ToPointer.GetProcessedSampleCountFromAnalysisResult(nativeArrayPtr + 8);
    };
    CubismMotionSyncEngineAnalysisResult.prototype.deallocNativeArrayPtr = function () {
        // 参照渡しになっている箇所だけ先にメモリ解放
        ToPointer.Free(this._resultArray[0]);
        // 配列本体を解放
        ToPointer.Free(this._resultArrayPtr);
        this._resultArrayPtr = 0;
    };
    return CubismMotionSyncEngineAnalysisResult;
}());
exports.CubismMotionSyncEngineAnalysisResult = CubismMotionSyncEngineAnalysisResult;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncengineanalysisresult */ "../../../Framework/src/cubismmotionsyncengineanalysisresult.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncEngineAnalysisResult = $.CubismMotionSyncEngineAnalysisResult;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncenginecontroller.ts":
/*!******************************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncenginecontroller.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineController = void 0;
var csmmap_1 = __webpack_require__(/*! @framework/type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncenginecri_1 = __webpack_require__(/*! ./cubismmotionsyncenginecri */ "../../../Framework/src/cubismmotionsyncenginecri.ts");
var cubismmotionsyncenginelib_1 = __webpack_require__(/*! ./cubismmotionsyncenginelib */ "../../../Framework/src/cubismmotionsyncenginelib.ts");
var cubismmotionsyncengineversion_1 = __webpack_require__(/*! ./cubismmotionsyncengineversion */ "../../../Framework/src/cubismmotionsyncengineversion.ts");
var cubismmotionsyncutil_1 = __webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts");
var CubismMotionSyncEngineController = /** @class */ (function () {
    function CubismMotionSyncEngineController() {
    }
    CubismMotionSyncEngineController.initializeEngine = function (engineConfig) {
        var engineLib = new cubismmotionsyncenginelib_1.CubismMotionSyncEngineLib();
        var engineName = engineLib.getEngineName();
        var engineType = this.ToEngineType(engineName);
        var nativeVersion = engineLib.getEngineVersion();
        var version = new cubismmotionsyncengineversion_1.CubismMotionSyncEngineVersion(nativeVersion);
        if (!this._engineMap) {
            this._engineMap = new csmmap_1.csmMap();
        }
        if (this._engineMap.isExist(engineType)) {
            engineLib = void 0;
            engineLib = null;
            return null;
        }
        (0, cubismdebug_1.CubismLogInfo)(engineName.s + ' ' + version.toString());
        var isInitialized = engineLib.initializeEngine(engineConfig);
        if (!isInitialized) {
            engineLib = void 0;
            engineLib = null;
            return null;
        }
        var engine = null;
        switch (engineType) {
            case cubismmotionsyncutil_1.EngineType.EngineType_Cri:
                engine = new cubismmotionsyncenginecri_1.CubismMotionSyncEngineCri(engineLib, engineType, engineName, version);
                break;
            default:
                engineLib.disposeEngine();
                engineLib = void 0;
                engineLib = null;
                return null;
        }
        this._engineMap.appendKey(engineType);
        this._engineMap.setValue(engineType, engine);
        return engine;
    };
    CubismMotionSyncEngineController.getEngine = function (type) {
        if (this._engineMap && this._engineMap.isExist(type)) {
            return this._engineMap.getValue(type);
        }
        return null;
    };
    CubismMotionSyncEngineController.getEngines = function () {
        var vector = new csmvector_1.csmVector();
        for (var iter = this._engineMap.begin(); iter != this._engineMap.end(); iter.increment()) {
            vector.pushBack(iter.ptr().second);
        }
        return vector;
    };
    CubismMotionSyncEngineController.releaseEngineNotForce = function (engine) {
        this.releaseEngine(engine, false);
    };
    CubismMotionSyncEngineController.releaseEngine = function (engine, isForce) {
        engine.close(isForce);
    };
    CubismMotionSyncEngineController.deleteAllEngine = function () {
        var engines = this.getEngines();
        for (var index = 0; index < engines.getSize(); index++) {
            engines.at(index).close(true);
        }
        this._engineMap.clear();
    };
    CubismMotionSyncEngineController.ToEngineType = function (engineName) {
        var engineType = cubismmotionsyncutil_1.EngineType.EngineType_Unknown;
        if (engineName.s == 'Live2DCubismMotionSyncEngine_CRI') {
            engineType = cubismmotionsyncutil_1.EngineType.EngineType_Cri;
        }
        return engineType;
    };
    CubismMotionSyncEngineController.deleteAssociation = function (engine) {
        for (var iter = this._engineMap.begin(); iter != this._engineMap.end(); iter.increment()) {
            if (iter.ptr().first == engine.getType()) {
                engine = void 0;
                this._engineMap.erase(iter);
                break;
            }
        }
    };
    return CubismMotionSyncEngineController;
}());
exports.CubismMotionSyncEngineController = CubismMotionSyncEngineController;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncenginecontroller */ "../../../Framework/src/cubismmotionsyncenginecontroller.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncEngineController = $.CubismMotionSyncEngineController;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncenginecri.ts":
/*!***********************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncenginecri.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineCri = exports.SampleRateMax = exports.SampleRateMin = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncprocessorcri_1 = __webpack_require__(/*! ./cubismmotionsyncprocessorcri */ "../../../Framework/src/cubismmotionsyncprocessorcri.ts");
var motionsyncconfig_cri_1 = __webpack_require__(/*! ./motionsyncconfig_cri */ "../../../Framework/src/motionsyncconfig_cri.ts");
var icubismmotionsyncengine_1 = __webpack_require__(/*! ./icubismmotionsyncengine */ "../../../Framework/src/icubismmotionsyncengine.ts");
var cubismmotionsyncutil_1 = __webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts");
exports.SampleRateMin = 16000;
exports.SampleRateMax = 128000;
var CubismMotionSyncEngineCri = /** @class */ (function (_super) {
    __extends(CubismMotionSyncEngineCri, _super);
    function CubismMotionSyncEngineCri(engineHandle, type, name, version) {
        var _this = _super.call(this, engineHandle, type, name, version) || this;
        _this._processors = new csmvector_1.csmVector();
        return _this;
    }
    CubismMotionSyncEngineCri.prototype.CreateProcessor = function (cubismParameterCount, mappingInfoList, sampleRate) {
        if (this.isClosed()) {
            (0, cubismdebug_1.CubismLogWarning)("[CubismMotionSyncEngineCri.CreateProcessor] Cubism MotionSync Engine is not started.'");
            return null;
        }
        if (mappingInfoList.getSize() < 1) {
            (0, cubismdebug_1.CubismLogWarning)("[CubismMotionSyncEngineCri.CreateProcessor] mappingInfoList size is invalid.'");
            return null;
        }
        if (!(exports.SampleRateMin <= sampleRate && sampleRate <= exports.SampleRateMax)) {
            (0, cubismdebug_1.CubismLogWarning)("[CubismMotionSyncEngineCri.CreateProcessor] sampleRate is invalid.'");
            return null;
        }
        var contextConfig = new motionsyncconfig_cri_1.MotionSyncContextConfig_CRI(sampleRate, icubismmotionsyncengine_1.DefaultAudioBitDepth);
        var mapper = new cubismmotionsyncutil_1.MappingInfoListMapper();
        mapper.setJObject(mappingInfoList);
        var context = this.getEngineHandle().createContext(this.getType(), contextConfig, mapper, mappingInfoList.getSize());
        var contextHandle = new cubismmotionsyncutil_1.MotionSyncContext(context, mapper, cubismParameterCount);
        var processor = new cubismmotionsyncprocessorcri_1.CubismMotionSyncProcessorCRI(this, contextHandle, mappingInfoList, sampleRate, icubismmotionsyncengine_1.DefaultAudioBitDepth);
        this._processors.pushBack(processor);
        return processor;
    };
    return CubismMotionSyncEngineCri;
}(icubismmotionsyncengine_1.ICubismMotionSyncEngine));
exports.CubismMotionSyncEngineCri = CubismMotionSyncEngineCri;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./motionsyncconfig_cri */ "../../../Framework/src/motionsyncconfig_cri.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncenginelib.ts":
/*!***********************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncenginelib.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineLib = void 0;
var csmstring_1 = __webpack_require__(/*! @framework/type/csmstring */ "../../../../CubismSdkForWeb/Framework/src/type/csmstring.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncutil_1 = __webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts");
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
var CubismMotionSyncEngineLib = /** @class */ (function () {
    function CubismMotionSyncEngineLib() {
    }
    CubismMotionSyncEngineLib.prototype.getEngineVersion = function () {
        return Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineVersion();
    };
    CubismMotionSyncEngineLib.prototype.getEngineName = function () {
        return new csmstring_1.csmString(Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineName());
    };
    CubismMotionSyncEngineLib.prototype.initializeEngine = function (engineConfig) {
        if (this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core already initialized.');
            return true;
        }
        this._isEngineInitialized = false;
        var result = Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncInitializeEngine(engineConfig);
        if (result == Live2DCubismMotionSyncCore.csmMotionSyncFalse) {
            (0, cubismdebug_1.CubismLogWarning)('Cubism MotionSync Core Initializing failed.');
            return false;
        }
        this._isEngineInitialized = true;
        return true;
    };
    CubismMotionSyncEngineLib.prototype.disposeEngine = function () {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return;
        }
        Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncDisposeEngine();
        this._isEngineInitialized = false;
    };
    CubismMotionSyncEngineLib.prototype.createContext = function (type, contextConfig, mappingInfoList, mappingInfoListCount) {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return null;
        }
        var context = new Live2DCubismMotionSyncCore.Context();
        // EngineTypeでConfigを分ける
        var contextConfigPtr;
        switch (type) {
            case cubismmotionsyncutil_1.EngineType.EngineType_Cri:
                {
                    // ポインタへ変換
                    var contextConfigCri = contextConfig;
                    contextConfigCri === null || contextConfigCri === void 0 ? void 0 : contextConfigCri.toNativeArray(true);
                    contextConfigPtr = contextConfigCri === null || contextConfigCri === void 0 ? void 0 : contextConfigCri.getNativePtr();
                }
                break;
            default:
                return null;
        }
        context.csmMotionSyncCreate(contextConfigPtr, mappingInfoList.getMappingInfoListPtr(), mappingInfoListCount);
        return context;
    };
    CubismMotionSyncEngineLib.prototype.clearContext = function (context) {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return;
        }
        context === null || context === void 0 ? void 0 : context.csmMotionSyncClear();
    };
    CubismMotionSyncEngineLib.prototype.deleteContext = function (context) {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return;
        }
        context === null || context === void 0 ? void 0 : context.csmMotionSyncDelete();
    };
    CubismMotionSyncEngineLib.prototype.getRequireSampleCount = function (context) {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return 0;
        }
        if (context == null) {
            (0, cubismdebug_1.CubismLogInfo)('context is null.');
            return 0;
        }
        var requireCount = context.csmMotionSyncGetRequireSampleCount();
        return requireCount;
    };
    CubismMotionSyncEngineLib.prototype.analyze = function (context, samples, samplesOffset, sampleCount, analysisResultPtr, analysisConfigPtr) {
        if (!this.isInitialized()) {
            (0, cubismdebug_1.CubismLogInfo)('Cubism MotionSync Core initialized yet.');
            return false;
        }
        if (context == null) {
            (0, cubismdebug_1.CubismLogInfo)('context is null.');
            return false;
        }
        var analyzeSamples = new Array(sampleCount);
        for (var index = 0; index < sampleCount; index++) {
            analyzeSamples[index] = samples[index + samplesOffset];
        }
        ToPointer.Free(this._analyzeSamplesPtr);
        this._analyzeSamplesPtr =
            ToPointer.ConvertNumberArrayToFloatArrayPtr(analyzeSamples);
        // samplesの先頭アドレス、Resultのアドレス、configのアドレスを渡す
        var result = context.csmMotionSyncAnalyze(this._analyzeSamplesPtr, sampleCount, analysisResultPtr, analysisConfigPtr);
        return result == Live2DCubismMotionSyncCore.csmMotionSyncTrue
            ? true
            : false;
    };
    CubismMotionSyncEngineLib.prototype.isInitialized = function () {
        return this._isEngineInitialized;
    };
    return CubismMotionSyncEngineLib;
}());
exports.CubismMotionSyncEngineLib = CubismMotionSyncEngineLib;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncenginelib */ "../../../Framework/src/cubismmotionsyncenginelib.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncEngineLib = $.CubismMotionSyncEngineLib;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncenginemappinginfo.ts":
/*!*******************************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncenginemappinginfo.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineMappingInfo = exports.MappingInfoStructSize = void 0;
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
exports.MappingInfoStructSize = 6;
var CubismMotionSyncEngineMappingInfo = /** @class */ (function () {
    function CubismMotionSyncEngineMappingInfo(audioParameterId, modelParameterIds, modelParameterValues, scale, enabled) {
        if (audioParameterId.getLength() == 0) {
            (0, cubismdebug_1.CubismLogError)('The audio parameter ID is null.');
        }
        if (modelParameterIds.getSize() == 0) {
            (0, cubismdebug_1.CubismLogError)('The array length of IDs differs from the array length of parameter values. Please make them the same');
        }
        if (modelParameterValues.getSize() == 0) {
            (0, cubismdebug_1.CubismLogError)('The model parameter ID array or the model parameter value array length is 0.');
        }
        if (!(0.1 <= scale && scale <= 10.0)) {
            (0, cubismdebug_1.CubismLogError)('The value of scale is incorrect. The value is limited to between 0.1 and 10.0.');
        }
        this._audioParameterId = audioParameterId;
        this._modelParameterIds = modelParameterIds;
        this._modelParameterValues = modelParameterValues;
        this._scale = scale;
        this._enabled = Number(enabled);
    }
    CubismMotionSyncEngineMappingInfo.prototype.toNativeArray = function (forceConversion) {
        // 強制的に新規作成しないのであれば既にあるものを返す
        if (!forceConversion && this._nativeArray) {
            return this._nativeArray;
        }
        if (this._nativeArray) {
            this.releaseNativeArray();
        }
        this._nativeArray = new Float32Array(exports.MappingInfoStructSize);
        this._nativeArrayPtr = ToPointer.Malloc(this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT);
        var mappingInfoModelParameterIds = new Array();
        var mappingInfoModelParameterValues = new Array();
        for (var mappingInfoIndex = 0; mappingInfoIndex < this._modelParameterIds.getSize(); mappingInfoIndex++) {
            // 直接 csmStringとstringは変換できないので一度確保する
            mappingInfoModelParameterIds.push(this._modelParameterIds.at(mappingInfoIndex).s);
            // 事故防止のためIds同様に一度確保する
            mappingInfoModelParameterValues.push(this._modelParameterValues.at(mappingInfoIndex));
        }
        // Nativeポインタへの変換
        this._nativeArray = ToPointer.ConvertMappingInfoCriToFloat32Array(this._nativeArray, this._nativeArrayPtr, this._audioParameterId.s, mappingInfoModelParameterIds, mappingInfoModelParameterValues, this._modelParameterIds.getSize(), this._scale, this._enabled);
        return this._nativeArray;
    };
    CubismMotionSyncEngineMappingInfo.prototype.releaseNativeArray = function () {
        this.deallocNativeArrayPtr();
        this._nativeArray = void 0;
    };
    CubismMotionSyncEngineMappingInfo.prototype.getAudioParameterId = function () {
        return this._audioParameterId;
    };
    CubismMotionSyncEngineMappingInfo.prototype.getModelParameterIds = function () {
        return this._modelParameterIds;
    };
    CubismMotionSyncEngineMappingInfo.prototype.getModelParameterValues = function () {
        return this._modelParameterValues;
    };
    CubismMotionSyncEngineMappingInfo.prototype.getScale = function () {
        return this._scale;
    };
    CubismMotionSyncEngineMappingInfo.prototype.getEnabled = function () {
        return this._enabled;
    };
    CubismMotionSyncEngineMappingInfo.prototype.deallocNativeArrayPtr = function () {
        // 参照渡しになっている箇所だけ先にメモリ解放
        ToPointer.Free(this._nativeArray[0]);
        ToPointer.Free(this._nativeArray[1]);
        ToPointer.Free(this._nativeArray[2]);
        // 配列本体を解放
        ToPointer.Free(this._nativeArrayPtr);
        this._nativeArrayPtr = 0;
    };
    return CubismMotionSyncEngineMappingInfo;
}());
exports.CubismMotionSyncEngineMappingInfo = CubismMotionSyncEngineMappingInfo;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncenginemappinginfo */ "../../../Framework/src/cubismmotionsyncenginemappinginfo.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncEngineMappingInfo = $.CubismMotionSyncEngineMappingInfo;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncengineversion.ts":
/*!***************************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncengineversion.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncEngineVersion = void 0;
var CubismMotionSyncEngineVersion = /** @class */ (function () {
    function CubismMotionSyncEngineVersion(rawVersion) {
        this._versionNumber = rawVersion;
        this._major = (this._versionNumber & 0xff000000) >> 24;
        this._minor = (this._versionNumber & 0x00ff0000) >> 16;
        this._patch = this._versionNumber & 0x0000ffff;
    }
    CubismMotionSyncEngineVersion.prototype.getMajor = function () {
        return this._major;
    };
    CubismMotionSyncEngineVersion.prototype.getMinor = function () {
        return this._minor;
    };
    CubismMotionSyncEngineVersion.prototype.getPatch = function () {
        return this._patch;
    };
    CubismMotionSyncEngineVersion.prototype.toString = function () {
        return (this._major +
            '.' +
            this._minor +
            '.' +
            this._patch +
            '(' +
            this._versionNumber +
            ')');
    };
    return CubismMotionSyncEngineVersion;
}());
exports.CubismMotionSyncEngineVersion = CubismMotionSyncEngineVersion;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncengineversion */ "../../../Framework/src/cubismmotionsyncengineversion.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncEngineVersion = $.CubismMotionSyncEngineVersion;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncprocessorcri.ts":
/*!**************************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncprocessorcri.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismMotionSyncProcessorCRI = void 0;
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var icubismmotionsyncprocessor_1 = __webpack_require__(/*! ./icubismmotionsyncprocessor */ "../../../Framework/src/icubismmotionsyncprocessor.ts");
var motionsyncconfig_cri_1 = __webpack_require__(/*! ./motionsyncconfig_cri */ "../../../Framework/src/motionsyncconfig_cri.ts");
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
var CubismMotionSyncProcessorCRI = /** @class */ (function (_super) {
    __extends(CubismMotionSyncProcessorCRI, _super);
    function CubismMotionSyncProcessorCRI(engine, contextHandle, mappingList, sampleRate, bitDepth) {
        var _this = _super.call(this, engine, contextHandle, mappingList) || this;
        _this._sampleRate = sampleRate;
        _this._bitDepth = bitDepth;
        return _this;
    }
    CubismMotionSyncProcessorCRI.prototype.getSampleRate = function () {
        return this._sampleRate;
    };
    CubismMotionSyncProcessorCRI.prototype.getBitDepth = function () {
        return this._bitDepth;
    };
    CubismMotionSyncProcessorCRI.prototype.Analyze = function (samples, beginIndex, blendRatio, smoothing, audioLevelEffectRatio, analysisResult) {
        var samplesSize = samples.getSize();
        if (samplesSize <
            this.getEngine()
                .getEngineHandle()
                .getRequireSampleCount(this.getContextHandle().getContext())) {
            (0, cubismdebug_1.CubismLogError)('The argument is invalid. Please check that the samples is the correct value.');
            return null;
        }
        if (!(0 <= beginIndex && beginIndex < samples.getSize())) {
            (0, cubismdebug_1.CubismLogError)('The value of beginIndex is incorrect. It should be less than the length of samples.');
            return null;
        }
        if (!(0.0 <= blendRatio && blendRatio <= 1.0)) {
            (0, cubismdebug_1.CubismLogError)('The value of blend ratio is incorrect. The value is limited to between 0.0 and 1.0.');
            return null;
        }
        if (!(1 <= smoothing && smoothing <= 100)) {
            (0, cubismdebug_1.CubismLogError)('The value of smoothing is incorrect. The value is limited to between 1 and 100.');
            return null;
        }
        if (!(0.0 <= audioLevelEffectRatio && audioLevelEffectRatio <= 1.0)) {
            (0, cubismdebug_1.CubismLogError)('The value of audio level effect ratio is incorrect. The value is limited to between 0.0 and 1.0.');
            return null;
        }
        if (!analysisResult) {
            (0, cubismdebug_1.CubismLogError)('The result instance is null.');
            return null;
        }
        var analysisConfig = new motionsyncconfig_cri_1.MotionSyncAnalysisConfig_CRI(blendRatio, smoothing, audioLevelEffectRatio);
        var analysisConfigBuffer = analysisConfig.toNativeArray(false);
        // ポインタを生成
        if (!this._analysisConfigNativePtr || this._analysisConfigNativePtr == 0) {
            this._analysisConfigNativePtr = ToPointer.Malloc(analysisConfigBuffer.length);
        }
        ToPointer.AddValuePtrFloat(this._analysisConfigNativePtr, 0, analysisConfigBuffer[0]);
        ToPointer.AddValuePtrInt32(this._analysisConfigNativePtr, 4, analysisConfigBuffer[1]);
        ToPointer.AddValuePtrFloat(this._analysisConfigNativePtr, 8, analysisConfigBuffer[2]);
        var analysisResultBuffer = analysisResult.toNativeArray(false);
        // ポインタを生成
        if (!this._analysisResultNativePtr || this._analysisResultNativePtr == 0) {
            this._analysisResultNativePtr = ToPointer.Malloc(analysisResultBuffer.length * analysisResultBuffer.BYTES_PER_ELEMENT);
        }
        ToPointer.AddValuePtrInt32(this._analysisResultNativePtr, 0, analysisResultBuffer[0]);
        ToPointer.AddValuePtrInt32(this._analysisResultNativePtr, 4, analysisResultBuffer[1]);
        ToPointer.AddValuePtrInt32(this._analysisResultNativePtr, 8, analysisResultBuffer[2]);
        var ret = this.getEngine()
            .getEngineHandle()
            .analyze(this.getContextHandle().getContext(), samples._ptr, beginIndex, samplesSize - beginIndex, this._analysisResultNativePtr, this._analysisConfigNativePtr);
        if (!ret) {
            (0, cubismdebug_1.CubismLogError)('Failed to analyze.');
            return null;
        }
        // データを引っ張ってくる。
        analysisResult.ConvertNativeAnalysisResult(this._analysisResultNativePtr);
        return analysisResult;
    };
    CubismMotionSyncProcessorCRI.prototype.release = function () {
        ToPointer.Free(this._analysisConfigNativePtr);
        this._analysisConfigNativePtr = 0;
        ToPointer.Free(this._analysisResultNativePtr);
        this._analysisResultNativePtr = 0;
    };
    return CubismMotionSyncProcessorCRI;
}(icubismmotionsyncprocessor_1.ICubismMotionSyncProcessor));
exports.CubismMotionSyncProcessorCRI = CubismMotionSyncProcessorCRI;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncprocessorcri */ "../../../Framework/src/cubismmotionsyncprocessorcri.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSyncProcessorCRI = $.CubismMotionSyncProcessorCRI;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/cubismmotionsyncutil.ts":
/*!******************************************************!*\
  !*** ../../../Framework/src/cubismmotionsyncutil.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.MotionSyncContext = exports.MappingInfoListMapper = exports.EngineType = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismmotionsyncenginemappinginfo_1 = __webpack_require__(/*! ./cubismmotionsyncenginemappinginfo */ "../../../Framework/src/cubismmotionsyncenginemappinginfo.ts");
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
var EngineType;
(function (EngineType) {
    EngineType[EngineType["EngineType_Cri"] = 0] = "EngineType_Cri";
    EngineType[EngineType["EngineType_Unknown"] = 1] = "EngineType_Unknown";
})(EngineType || (exports.EngineType = EngineType = {}));
var MappingInfoListMapper = /** @class */ (function () {
    function MappingInfoListMapper() {
    }
    // デストラクタ
    MappingInfoListMapper.prototype.release = function () {
        this.deleteMappingInfoList();
    };
    MappingInfoListMapper.prototype.setJObject = function (mappingInfoList) {
        this.deleteMappingInfoList();
        this._infoBufferList = new csmvector_1.csmVector();
        this.ConvertObjectToNative(mappingInfoList);
    };
    MappingInfoListMapper.prototype.ConvertObjectToNative = function (infoList) {
        var infoListCount = infoList.getSize();
        for (var index = 0; index < infoListCount; index++) {
            this._infoBufferList.pushBack(infoList.at(index).toNativeArray(true));
        }
        // メモリ確保
        var mappingInfoListPtr = ToPointer.Malloc(this._infoBufferList.at(0).length *
            infoListCount *
            this._infoBufferList.at(0).BYTES_PER_ELEMENT);
        // 先頭アドレスを保存
        this._mappingInfoListFirstPtr = mappingInfoListPtr;
        // メモリ上で1列に並べる
        for (var infoListIndex = 0; infoListIndex < infoListCount; infoListIndex++) {
            // 要素の数分回す
            for (var infoElementIndex = 0; infoElementIndex < cubismmotionsyncenginemappinginfo_1.MappingInfoStructSize; infoElementIndex++) {
                if (infoElementIndex == 4) {
                    // Floatの値渡しなのでここだけこのようにする
                    ToPointer.AddValuePtrFloat(mappingInfoListPtr, infoElementIndex * Float32Array.BYTES_PER_ELEMENT, this._infoBufferList.at(infoListIndex)[infoElementIndex]);
                }
                ToPointer.AddValuePtrInt32(mappingInfoListPtr, infoElementIndex * Float32Array.BYTES_PER_ELEMENT, this._infoBufferList.at(infoListIndex)[infoElementIndex]);
            }
            // 利用したバイト数分ポインタを進める
            mappingInfoListPtr +=
                cubismmotionsyncenginemappinginfo_1.MappingInfoStructSize * Float32Array.BYTES_PER_ELEMENT;
        }
    };
    MappingInfoListMapper.prototype.deleteMappingInfoList = function () {
        if (!this._infoBufferList) {
            return;
        }
        this._infoBufferList.clear();
        this._infoBufferList = void 0;
        this._infoBufferList = null;
    };
    MappingInfoListMapper.prototype.getMappingInfoListPtr = function () {
        return this._mappingInfoListFirstPtr;
    };
    return MappingInfoListMapper;
}());
exports.MappingInfoListMapper = MappingInfoListMapper;
var MotionSyncContext = /** @class */ (function () {
    function MotionSyncContext(context, mapper, cubismParameterCount) {
        this._context = context;
        this._mapper = mapper;
        this._cubismParameterCount = cubismParameterCount;
    }
    MotionSyncContext.prototype.release = function () {
        var _a, _b;
        (_a = this._context) === null || _a === void 0 ? void 0 : _a.csmMotionSyncDelete();
        this._context = void 0;
        this._context = null;
        (_b = this._mapper) === null || _b === void 0 ? void 0 : _b.release();
        this._mapper = void 0;
        this._mapper = null;
        this._cubismParameterCount = 0;
    };
    MotionSyncContext.prototype.getContext = function () {
        return this._context;
    };
    MotionSyncContext.prototype.getMapper = function () {
        return this._mapper;
    };
    MotionSyncContext.prototype.getCubismParameterCount = function () {
        return this._cubismParameterCount;
    };
    return MotionSyncContext;
}());
exports.MotionSyncContext = MotionSyncContext;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.MotionSyncContext = $.MotionSyncContext;
    Live2DCubismMotionSyncFramework.MappingInfoListMapper = $.MappingInfoListMapper;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/icubismmotionsyncengine.ts":
/*!*********************************************************!*\
  !*** ../../../Framework/src/icubismmotionsyncengine.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.ICubismMotionSyncEngine = exports.DefaultAudioBitDepth = void 0;
// Engine側に渡すBitDepth
exports.DefaultAudioBitDepth = 32;
var ICubismMotionSyncEngine = /** @class */ (function () {
    function ICubismMotionSyncEngine(engineHandle, type, name, version) {
        this._engineHandle = engineHandle;
        this._type = type;
        this._name = name;
        this._version = version;
    }
    ICubismMotionSyncEngine.prototype.getType = function () {
        return this._type;
    };
    ICubismMotionSyncEngine.prototype.getName = function () {
        return this._name;
    };
    ICubismMotionSyncEngine.prototype.getVersion = function () {
        return this._version;
    };
    ICubismMotionSyncEngine.prototype.getEngineHandle = function () {
        return this._engineHandle;
    };
    ICubismMotionSyncEngine.prototype.getProcessors = function () {
        return this._processors;
    };
    ICubismMotionSyncEngine.prototype.isClosed = function () {
        return this.getEngineHandle() == null;
    };
    ICubismMotionSyncEngine.prototype.releaseAllProcessor = function () {
        if (this.isClosed()) {
            return;
        }
        for (var index = 0; index < this._processors.getSize(); index++) {
            this._processors.at(index).Close();
        }
    };
    ICubismMotionSyncEngine.prototype.close = function (isForce) {
        if (this.isClosed()) {
            return;
        }
        if (0 < this._processors.getSize()) {
            if (isForce) {
                this.releaseAllProcessor();
            }
            else {
                return;
            }
        }
        this.getEngineHandle().disposeEngine();
        this._engineHandle = void 0;
        this._engineHandle = null;
        cubismmotionsyncenginecontroller_1.CubismMotionSyncEngineController.deleteAssociation(this);
    };
    ICubismMotionSyncEngine.prototype.DeleteAssociation = function (processor) {
        for (var index = 0; index < this._processors.getSize(); index++) {
            if (this._processors.at(index) == processor) {
                this._processors.at(index).Close();
                this._processors.remove(index);
                break;
            }
        }
    };
    return ICubismMotionSyncEngine;
}());
exports.ICubismMotionSyncEngine = ICubismMotionSyncEngine;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./icubismmotionsyncengine */ "../../../Framework/src/icubismmotionsyncengine.ts"));
var cubismmotionsyncenginecontroller_1 = __webpack_require__(/*! ./cubismmotionsyncenginecontroller */ "../../../Framework/src/cubismmotionsyncenginecontroller.ts");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.ICubismMotionSyncEngine = $.ICubismMotionSyncEngine;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/icubismmotionsyncprocessor.ts":
/*!************************************************************!*\
  !*** ../../../Framework/src/icubismmotionsyncprocessor.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.ICubismMotionSyncProcessor = void 0;
var cubismmotionsyncengineanalysisresult_1 = __webpack_require__(/*! ./cubismmotionsyncengineanalysisresult */ "../../../Framework/src/cubismmotionsyncengineanalysisresult.ts");
var ICubismMotionSyncProcessor = /** @class */ (function () {
    function ICubismMotionSyncProcessor(engine, contextHandle, mappingList) {
        this._engine = engine;
        this._contextHandle = contextHandle;
        this._mappingInfoArray = mappingList;
    }
    /**
     * createAnalysisResult
     */
    ICubismMotionSyncProcessor.prototype.createAnalysisResult = function () {
        if (this.isClosed() || this._mappingInfoArray.getSize() < 1) {
            return new cubismmotionsyncengineanalysisresult_1.CubismMotionSyncEngineAnalysisResult(0);
        }
        return new cubismmotionsyncengineanalysisresult_1.CubismMotionSyncEngineAnalysisResult(this._mappingInfoArray.at(0).getModelParameterValues().getSize());
    };
    /**
     * isClosed
     */
    ICubismMotionSyncProcessor.prototype.isClosed = function () {
        return this._contextHandle == null;
    };
    ICubismMotionSyncProcessor.prototype.Close = function () {
        // 解放済みなら何もしない。
        if (this.isClosed()) {
            return;
        }
        this._contextHandle.release();
        this._contextHandle = void 0;
        this._contextHandle = null;
        this._engine.DeleteAssociation(this);
    };
    ICubismMotionSyncProcessor.prototype.getContextHandle = function () {
        return this._contextHandle;
    };
    ICubismMotionSyncProcessor.prototype.getEngine = function () {
        return this._engine;
    };
    ICubismMotionSyncProcessor.prototype.getType = function () {
        return this._engine.getType();
    };
    ICubismMotionSyncProcessor.prototype.getRequireSampleCount = function () {
        var _a, _b;
        if (!((_a = this.getEngine()) === null || _a === void 0 ? void 0 : _a.getEngineHandle()) ||
            !((_b = this.getContextHandle()) === null || _b === void 0 ? void 0 : _b.getContext())) {
            return 0;
        }
        return this.getEngine()
            .getEngineHandle()
            .getRequireSampleCount(this.getContextHandle().getContext());
    };
    return ICubismMotionSyncProcessor;
}());
exports.ICubismMotionSyncProcessor = ICubismMotionSyncProcessor;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./icubismmotionsyncprocessor */ "../../../Framework/src/icubismmotionsyncprocessor.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.ICubismMotionSyncProcessor = $.ICubismMotionSyncProcessor;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/live2dcubismmotionsync.ts":
/*!********************************************************!*\
  !*** ../../../Framework/src/live2dcubismmotionsync.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.CubismProcessorInfo = exports.MotionSyncEngineConfigCriData = exports.MotionSyncOption = exports.CubismMotionSync = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var cubismmotionsyncdata_1 = __webpack_require__(/*! ./cubismmotionsyncdata */ "../../../Framework/src/cubismmotionsyncdata.ts");
var cubismmotionsyncenginecontroller_1 = __webpack_require__(/*! ./cubismmotionsyncenginecontroller */ "../../../Framework/src/cubismmotionsyncenginecontroller.ts");
var cubismmotionsyncutil_1 = __webpack_require__(/*! ./cubismmotionsyncutil */ "../../../Framework/src/cubismmotionsyncutil.ts");
// ファイルスコープの変数を初期化
var s_isStarted = false;
var s_isInitialized = false;
var s_option = null;
var s_engineConfigCriData = null;
var s_engineConfigStructSize = 2;
var CubismMotionSync = /** @class */ (function () {
    function CubismMotionSync(model, data, processorList) {
        this._data = data;
        this._processorInfoList = new csmvector_1.csmVector();
        for (var index = 0; index < (processorList === null || processorList === void 0 ? void 0 : processorList.getSize()); index++) {
            this._processorInfoList.pushBack(new CubismProcessorInfo(processorList.at(index), model, data.getSetting(index)));
            this._processorInfoList.at(index).init(data.getSetting(index));
        }
    }
    /**
     * Cubism MotionSync FrameworkのAPIを使用可能にする。
     *  APIを実行する前に必ずこの関数を実行すること。
     *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
     *
     * @param    option      MotionSyncLogOptionクラスのインスタンス
     *
     * @return   準備処理が完了したらtrueが返ります。
     */
    CubismMotionSync.startUp = function (option) {
        if (option === void 0) { option = null; }
        if (s_isStarted) {
            (0, cubismdebug_1.CubismLogInfo)('CubismMotionSyncFramework.startUp() is already done.');
            return s_isStarted;
        }
        s_option = option;
        if (s_option != null) {
            Live2DCubismMotionSyncCore.Logging.csmMotionSyncSetLogFunction(s_option.logFunction);
        }
        s_isStarted = true;
        (0, cubismdebug_1.CubismLogInfo)('CubismMotionSyncFramework.startUp() is complete.');
        return s_isStarted;
    };
    /**
     * StartUp()で初期化したCubism MotionSync Frameworkの各パラメータをクリアします。
     * Dispose()したCubism MotionSync Frameworkを再利用する際に利用してください。
     */
    CubismMotionSync.cleanUp = function () {
        s_isStarted = false;
        s_isInitialized = false;
        s_option = null;
    };
    /**
     * Cubism MotionSync Framework内のリソースを初期化してモデルを表示可能な状態にします。
     *     再度Initialize()するには先にDispose()を実行する必要があります。
     */
    CubismMotionSync.initialize = function () {
        (0, cubismdebug_1.CSM_ASSERT)(s_isStarted);
        if (!s_isStarted) {
            (0, cubismdebug_1.CubismLogWarning)('CubismMotionSyncFramework is not started.');
            return;
        }
        // --- s_isInitializedによる連続初期化ガード ---
        // 連続してリソース確保が行われないようにする。
        // 再度Initialize()するには先にDispose()を実行する必要がある。
        if (s_isInitialized) {
            (0, cubismdebug_1.CubismLogWarning)('CubismMotionSyncFramework.initialize() skipped, already initialized.');
            return;
        }
        s_isInitialized = true;
        (0, cubismdebug_1.CubismLogInfo)('CubismMotionSyncFramework.initialize() is complete.');
    };
    /**
     * Cubism MotionSync Framework内の全てのリソースを解放します。
     *      ただし、外部で確保されたリソースについては解放しません。
     *      外部で適切に破棄する必要があります。
     */
    CubismMotionSync.dispose = function () {
        (0, cubismdebug_1.CSM_ASSERT)(s_isStarted);
        if (!s_isStarted) {
            (0, cubismdebug_1.CubismLogWarning)('CubismMotionSyncFramework is not started.');
            return;
        }
        // --- s_isInitializedによる未初期化解放ガード ---
        // dispose()するには先にinitialize()を実行する必要がある。
        if (!s_isInitialized) {
            // false...リソース未確保の場合
            (0, cubismdebug_1.CubismLogWarning)('CubismMotionSyncFramework.dispose() skipped, not initialized.');
            return;
        }
        s_isInitialized = false;
        (0, cubismdebug_1.CubismLogInfo)('CubismMotionSyncFramework.dispose() is complete.');
    };
    /**
     * Cubism MotionSync FrameworkのAPIを使用する準備が完了したかどうか
     * @return APIを使用する準備が完了していればtrueが返ります。
     */
    CubismMotionSync.isStarted = function () {
        return s_isStarted;
    };
    /**
     * Cubism MotionSync Frameworkのリソース初期化がすでに行われているかどうか
     * @return リソース確保が完了していればtrueが返ります
     */
    CubismMotionSync.isInitialized = function () {
        return s_isInitialized;
    };
    CubismMotionSync.create = function (model, buffer, size, samplePerSec) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        var data = cubismmotionsyncdata_1.CubismMotionSyncData.create(model, buffer, size);
        if (!data) {
            return null;
        }
        var processorList = new csmvector_1.csmVector();
        for (var index = 0; index < data.getSettingCount(); index++) {
            var processor = null;
            var engineType = data.getSetting(index).analysisType;
            switch (engineType) {
                case cubismmotionsyncutil_1.EngineType.EngineType_Cri:
                    processor = this.InitializeEngineCri(engineType, data, index, samplePerSec);
                    break;
                default:
                    (0, cubismdebug_1.CubismLogWarning)('[CubismMotionSync.Create] Index{0}: Can not create processor because `AnalysisType` is unknown.', index);
                    break;
            }
            if (processor != null) {
                processorList.pushBack(processor);
            }
        }
        return new CubismMotionSync(model, data, processorList);
    };
    CubismMotionSync.InitializeEngineCri = function (engineType, data, index, samplePerSec) {
        var engine = cubismmotionsyncenginecontroller_1.CubismMotionSyncEngineController.getEngine(engineType);
        if (s_option.engineConfig != null) {
            s_engineConfigCriData = new MotionSyncEngineConfigCriData();
            s_engineConfigCriData.engineConfigBuffer = new Int32Array(s_engineConfigStructSize);
            s_engineConfigCriData.engineConfigPtr =
                Live2DCubismMotionSyncCore.ToPointer.Malloc(s_engineConfigCriData.engineConfigBuffer.length *
                    s_engineConfigCriData.engineConfigBuffer.BYTES_PER_ELEMENT);
            Live2DCubismMotionSyncCore.ToPointer.ConvertEngineConfigCriToInt32Array(s_engineConfigCriData.engineConfigBuffer, s_engineConfigCriData.engineConfigPtr, s_option.engineConfig.Allocator, s_option.engineConfig.Deallocator);
        }
        var configPtr = s_engineConfigCriData != null ? s_engineConfigCriData.engineConfigPtr : 0;
        if (!engine) {
            engine = cubismmotionsyncenginecontroller_1.CubismMotionSyncEngineController.initializeEngine(configPtr);
        }
        var processor = null;
        if (engine) {
            processor = engine.CreateProcessor(data.getSetting(index).cubismParameterList.getSize(), data.getMappingInfoList(index), samplePerSec);
        }
        return processor;
    };
    CubismMotionSync.delete = function (instance) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        instance = void 0;
        instance = null;
    };
    CubismMotionSync.prototype.setSoundBuffer = function (processIndex, buffer) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        if (processIndex < this._processorInfoList.getSize()) {
            this._processorInfoList.at(processIndex)._sampleBuffer = buffer;
            this._processorInfoList.at(processIndex)._sampleBufferIndex = 0;
        }
    };
    CubismMotionSync.prototype.release = function () {
        var _a;
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        cubismmotionsyncdata_1.CubismMotionSyncData.delete(this._data);
        for (var index = 0; index < this._processorInfoList.getSize(); index++) {
            (_a = this._processorInfoList.at(index)._processor) === null || _a === void 0 ? void 0 : _a.Close();
        }
    };
    CubismMotionSync.prototype.updateParameters = function (model, deltaTimeSeconds) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        // 設定から時間を変更すると、経過時間がマイナスになることがあるので、経過時間0として対応。
        if (deltaTimeSeconds < 0.0) {
            deltaTimeSeconds = 0.0;
        }
        for (var processIndex = 0; processIndex < this._processorInfoList.getSize(); processIndex++) {
            this._processorInfoList.at(processIndex)._currentRemainTime +=
                deltaTimeSeconds;
            // Check each time assuming it may have been updated.
            var fps = this._processorInfoList.at(processIndex)._sampleRate;
            var processorDeltaTime = 1.0 / fps;
            // If the specified frame time is not reached, no analysis is performed.
            if (this._processorInfoList.at(processIndex)._currentRemainTime <
                processorDeltaTime) {
                for (var targetIndex = 0; targetIndex <
                    this._data.getSetting(processIndex).cubismParameterList.getSize(); targetIndex++) {
                    if (isNaN(this._processorInfoList
                        .at(processIndex)
                        ._analysisResult.getValues()[targetIndex])) {
                        continue;
                    }
                    // Overwrite parameter values every frame to prevent data from replacing itself
                    model.setParameterValueByIndex(this._data
                        .getSetting(processIndex)
                        .cubismParameterList.at(targetIndex).parameterIndex, this._processorInfoList
                        .at(processIndex)
                        ._lastDampedList.at(targetIndex));
                }
                continue;
            }
            this.analyze(model, processIndex);
            // Reset counter.
            this._processorInfoList.at(processIndex)._currentRemainTime =
                this._processorInfoList.at(processIndex)._currentRemainTime %
                    processorDeltaTime;
            for (var targetIndex = 0; targetIndex <
                this._data.getSetting(processIndex).cubismParameterList.getSize(); targetIndex++) {
                if (isNaN(this._processorInfoList
                    .at(processIndex)
                    ._analysisResult.getValues()[targetIndex])) {
                    continue;
                }
                // Overwrite parameter values every frame to prevent data from replacing itself
                model.setParameterValueByIndex(this._data
                    .getSetting(processIndex)
                    .cubismParameterList.at(targetIndex).parameterIndex, this._processorInfoList
                    .at(processIndex)
                    ._lastDampedList.at(targetIndex));
            }
        }
    };
    CubismMotionSync.prototype.analyze = function (model, processIndex) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        var processor = this._processorInfoList.at(processIndex)._processor;
        var samples = this._processorInfoList.at(processIndex)._sampleBuffer;
        var beginIndex = this._processorInfoList.at(processIndex)._sampleBufferIndex;
        if (processor == null ||
            this._processorInfoList.at(processIndex)._sampleBuffer == null) {
            return;
        }
        var analysisResult = null;
        var blendRatio = this._processorInfoList.at(processIndex)._blendRatio;
        var smoothing = this._processorInfoList.at(processIndex)._smoothing;
        var audioLevelEffectRatio = this._processorInfoList.at(processIndex)._audioLevelEffectRatio;
        this._processorInfoList.at(processIndex)._lastTotalProcessedCount = 0;
        do {
            var samplesSize = samples.getSize();
            if (samplesSize == 0 ||
                samplesSize <= beginIndex ||
                samplesSize - beginIndex < processor.getRequireSampleCount()) {
                break;
            }
            switch (processor.getType()) {
                case cubismmotionsyncutil_1.EngineType.EngineType_Cri:
                    analysisResult = processor.Analyze(samples, beginIndex, blendRatio, smoothing, audioLevelEffectRatio, this._processorInfoList.at(processIndex)._analysisResult);
                    break;
                default:
                    break;
            }
            if (!analysisResult) {
                break;
            }
            var processedCount = analysisResult.getProcessedSampleCount();
            beginIndex += processedCount;
            this._processorInfoList.at(processIndex)._lastTotalProcessedCount +=
                processedCount;
            // モーションシンクライブラリで計算した内容をモデルに反映
            for (var targetIndex = 0; targetIndex <
                this._data.getSetting(processIndex).cubismParameterList.getSize(); targetIndex++) {
                var cacheValue = analysisResult.getValues()[targetIndex];
                if (isNaN(cacheValue)) {
                    continue;
                }
                var smooth = this._data
                    .getSetting(processIndex)
                    .cubismParameterList.at(targetIndex).smooth;
                var damper = this._data
                    .getSetting(processIndex)
                    .cubismParameterList.at(targetIndex).damper;
                // Smoothing
                cacheValue =
                    ((100.0 - smooth) * cacheValue +
                        this._processorInfoList
                            .at(processIndex)
                            ._lastSmoothedList.at(targetIndex) *
                            smooth) /
                        100.0;
                this._processorInfoList
                    .at(processIndex)
                    ._lastSmoothedList.set(targetIndex, cacheValue);
                // Dampening
                if (Math.abs(cacheValue -
                    this._processorInfoList
                        .at(processIndex)
                        ._lastDampedList.at(targetIndex)) < damper) {
                    cacheValue = this._processorInfoList
                        .at(processIndex)
                        ._lastDampedList.at(targetIndex);
                }
                this._processorInfoList
                    .at(processIndex)
                    ._lastDampedList.set(targetIndex, cacheValue);
            }
        } while (analysisResult != null);
    };
    CubismMotionSync.prototype.setBlendRatio = function (processIndex, blendRatio) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        if (processIndex < this._processorInfoList.getSize()) {
            this._processorInfoList.at(processIndex)._blendRatio = blendRatio;
        }
    };
    CubismMotionSync.prototype.SetSmoothing = function (processIndex, smoothing) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        if (processIndex < this._processorInfoList.getSize()) {
            this._processorInfoList.at(processIndex)._smoothing = smoothing;
        }
    };
    CubismMotionSync.prototype.SetSampleRate = function (processIndex, sampleRate) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        if (processIndex < this._processorInfoList.getSize()) {
            this._processorInfoList.at(processIndex)._sampleRate = sampleRate;
        }
    };
    CubismMotionSync.prototype.SetAudioLevelEffectRatio = function (processIndex, audioLevelEffectRatio) {
        if (!CubismMotionSync.isInitialized()) {
            return;
        }
        if (processIndex < this._processorInfoList.getSize()) {
            this._processorInfoList.at(processIndex)._audioLevelEffectRatio =
                audioLevelEffectRatio;
        }
    };
    CubismMotionSync.prototype.getData = function () {
        return this._data;
    };
    CubismMotionSync.prototype.getLastTotalProcessedCount = function (processIndex) {
        return this._processorInfoList.at(processIndex)._lastTotalProcessedCount;
    };
    return CubismMotionSync;
}());
exports.CubismMotionSync = CubismMotionSync;
var MotionSyncOption = /** @class */ (function () {
    function MotionSyncOption() {
    }
    return MotionSyncOption;
}());
exports.MotionSyncOption = MotionSyncOption;
var MotionSyncEngineConfigCriData = /** @class */ (function () {
    function MotionSyncEngineConfigCriData() {
    }
    return MotionSyncEngineConfigCriData;
}());
exports.MotionSyncEngineConfigCriData = MotionSyncEngineConfigCriData;
var CubismProcessorInfo = /** @class */ (function () {
    function CubismProcessorInfo(processor, model, setting) {
        this._processor = processor;
        this._blendRatio = 0.0;
        this._smoothing = 1;
        this._sampleRate = 30.0;
        this._audioLevelEffectRatio = 0.0;
        this._sampleBuffer = null;
        this._sampleBufferIndex = 0;
        this._model = model;
        this._currentRemainTime = 0.0;
        this._lastTotalProcessedCount = 0;
        this.init(setting);
        this._analysisResult = this._processor.createAnalysisResult();
    }
    CubismProcessorInfo.prototype.init = function (setting) {
        this._currentRemainTime = 0.0;
        this._lastSmoothedList = new csmvector_1.csmVector();
        this._lastDampedList = new csmvector_1.csmVector();
        for (var index = 0; index < setting.cubismParameterList.getSize(); index++) {
            var parameterValue = this._model.getParameterValueByIndex(setting.cubismParameterList.at(index).parameterIndex);
            this._lastSmoothedList.pushBack(parameterValue);
            this._lastDampedList.pushBack(parameterValue);
        }
        this._blendRatio = setting.blendRatio;
        this._smoothing = setting.smoothing;
        this._sampleRate = setting.sampleRate;
        this._lastTotalProcessedCount = 0;
    };
    return CubismProcessorInfo;
}());
exports.CubismProcessorInfo = CubismProcessorInfo;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./live2dcubismmotionsync */ "../../../Framework/src/live2dcubismmotionsync.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.CubismMotionSync = $.CubismMotionSync;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "../../../Framework/src/motionsyncconfig_cri.ts":
/*!******************************************************!*\
  !*** ../../../Framework/src/motionsyncconfig_cri.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Live2DCubismMotionSyncFramework = exports.MotionSyncAnalysisConfig_CRI = exports.MotionSyncContextConfig_CRI = void 0;
var ToPointer = Live2DCubismMotionSyncCore.ToPointer;
var s_contextConfigInfoStructSize = 2;
var s_analysisConfigInfoStructSize = 3;
var MotionSyncContextConfig_CRI = /** @class */ (function () {
    function MotionSyncContextConfig_CRI(sampleRate, bitDepth) {
        if (sampleRate === void 0) { sampleRate = 0; }
        if (bitDepth === void 0) { bitDepth = 0; }
        this.SampleRate = sampleRate;
        this.BitDepth = bitDepth;
    }
    MotionSyncContextConfig_CRI.prototype.toNativeArray = function (forceConversion) {
        // 強制的に新規作成しないのであれば早期リターン
        if (!forceConversion && this._nativeArray) {
            return;
        }
        if (this._nativeArray) {
            this.releaseNativeArray();
        }
        this._nativeArray = new Int32Array(s_contextConfigInfoStructSize);
        this._nativeArrayPtr = ToPointer.Malloc(this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT);
        // Nativeポインタへの変換
        this._nativeArray = ToPointer.ConvertContextConfigCriToInt32Array(this._nativeArray, this._nativeArrayPtr, this.SampleRate, this.BitDepth);
    };
    MotionSyncContextConfig_CRI.prototype.getNativePtr = function () {
        return this._nativeArrayPtr;
    };
    MotionSyncContextConfig_CRI.prototype.releaseNativeArray = function () {
        this.deallocNativeArrayPtr();
        this._nativeArray = void 0;
    };
    MotionSyncContextConfig_CRI.prototype.deallocNativeArrayPtr = function () {
        // 配列本体を解放
        ToPointer.Free(this._nativeArrayPtr);
        this._nativeArrayPtr = 0;
    };
    return MotionSyncContextConfig_CRI;
}());
exports.MotionSyncContextConfig_CRI = MotionSyncContextConfig_CRI;
var MotionSyncAnalysisConfig_CRI = /** @class */ (function () {
    function MotionSyncAnalysisConfig_CRI(blendRatio, smoothing, audioLevelEffectRatio) {
        if (blendRatio === void 0) { blendRatio = 0.0; }
        if (smoothing === void 0) { smoothing = 0; }
        if (audioLevelEffectRatio === void 0) { audioLevelEffectRatio = 0.0; }
        this.BlendRatio = blendRatio;
        this.Smoothing = smoothing;
        this.AudioLevelEffectRatio = audioLevelEffectRatio;
    }
    MotionSyncAnalysisConfig_CRI.prototype.toNativeArray = function (forceConversion) {
        // 強制的に新規作成しないのであれば既にあるものを返す
        if (!forceConversion && this._nativeArray) {
            return this._nativeArray;
        }
        if (this._nativeArray) {
            this.releaseNativeArray();
        }
        this._nativeArray = new Float32Array(s_analysisConfigInfoStructSize);
        this._nativeArrayPtr = ToPointer.Malloc(this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT);
        // Nativeポインタへの変換
        this._nativeArray = ToPointer.ConvertAnalysisConfigToFloat32Array(this._nativeArray, this._nativeArrayPtr, this.BlendRatio, this.Smoothing, this.AudioLevelEffectRatio);
        return this._nativeArray;
    };
    MotionSyncAnalysisConfig_CRI.prototype.releaseNativeArray = function () {
        this.deallocNativePtr();
        this._nativeArray = void 0;
    };
    MotionSyncAnalysisConfig_CRI.prototype.deallocNativePtr = function () {
        // 配列本体を解放
        ToPointer.Free(this._nativeArrayPtr);
        this._nativeArrayPtr = 0;
    };
    return MotionSyncAnalysisConfig_CRI;
}());
exports.MotionSyncAnalysisConfig_CRI = MotionSyncAnalysisConfig_CRI;
// Namespace definition for compatibility.
var $ = __importStar(__webpack_require__(/*! ./motionsyncconfig_cri */ "../../../Framework/src/motionsyncconfig_cri.ts"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismMotionSyncFramework;
(function (Live2DCubismMotionSyncFramework) {
    Live2DCubismMotionSyncFramework.MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
})(Live2DCubismMotionSyncFramework || (exports.Live2DCubismMotionSyncFramework = Live2DCubismMotionSyncFramework = {}));


/***/ }),

/***/ "./src/lappmotionsyncaudiomanager.ts":
/*!*******************************************!*\
  !*** ./src/lappmotionsyncaudiomanager.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudioInfo = exports.LAppMotionSyncAudioManager = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var LAppMotionSyncDefine = __importStar(__webpack_require__(/*! ./lappmotionsyncdefine */ "./src/lappmotionsyncdefine.ts"));
/**
 * 音声管理クラス
 * 音声読み込み、管理を行うクラス。
 */
var LAppMotionSyncAudioManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppMotionSyncAudioManager() {
        this._audios = new csmvector_1.csmVector();
    }
    /**
     * 解放する。
     */
    LAppMotionSyncAudioManager.prototype.release = function () {
        for (var ite = this._audios.begin(); ite.notEqual(this._audios.end()); ite.preIncrement()) {
            if (!ite.ptr()) {
                continue;
            }
            if (ite.ptr().workletNode) {
                ite.ptr().workletNode.disconnect();
            }
            if (ite.ptr().source) {
                ite.ptr().source.disconnect();
            }
            if (ite.ptr().audioContext) {
                ite.ptr().audioContext.close();
            }
        }
        this._audios = null;
    };
    /**
     * 音声読み込み
     *
     * @param fileName 読み込む音声ファイルパス名
     * @param audioContext 音声コンテキスト
     * @return 音声情報、読み込み失敗時はnullを返す
     */
    LAppMotionSyncAudioManager.prototype.createAudioFromFile = function (fileName, index, audioContext, callback) {
        var _this = this;
        if (this._audios && this._audios.at(index) != null) {
            var _loop_1 = function (ite) {
                if (ite.ptr().filePath == fileName &&
                    ite.ptr().audioContext == audioContext &&
                    audioContext != null) {
                    // 2回目以降はキャッシュが使用される(待ち時間なし)
                    // WebKitでは同じImageのonloadを再度呼ぶには再インスタンスが必要
                    // 詳細：https://stackoverflow.com/a/5024181
                    ite.ptr().audio = new Audio();
                    ite
                        .ptr()
                        .audio.addEventListener('load', function () { return callback(ite.ptr(), index); }, {
                        passive: true
                    });
                    ite.ptr().audio.src = fileName;
                    ite.ptr().audioContext = audioContext;
                    return { value: void 0 };
                }
            };
            // search loaded audio already
            for (var ite = this._audios.begin(); ite.notEqual(this._audios.end()); ite.preIncrement()) {
                var state_1 = _loop_1(ite);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        // 音声コンテキストの作成
        var newAudioContext = new AudioContext({
            sampleRate: LAppMotionSyncDefine.SamplesPerSec
        });
        newAudioContext.suspend();
        // 埋め込み音声要素を作成
        var audio = new Audio(fileName);
        // 埋め込み音声要素の初期設定
        audio.preload = 'auto';
        // 音源ノードの作成
        var source = newAudioContext.createMediaElementSource(audio);
        // AudioWorklet用のモジュールを追加
        newAudioContext.audioWorklet
            .addModule('./src/lappaudioworkletprocessor.js')
            .then(function () {
            var audioWorkletNode = new AudioWorkletNode(newAudioContext, 'lappaudioworkletprocessor');
            // 各ノードを接続する
            source.connect(audioWorkletNode);
            audioWorkletNode.connect(newAudioContext.destination);
            var audioInfo = new AudioInfo();
            if (audioInfo != null && _this._audios != null) {
                audioInfo.filePath = fileName;
                audioInfo.audioContext = newAudioContext;
                audioInfo.audio = audio;
                audioInfo.source = source;
                audioInfo.workletNode = audioWorkletNode;
                audioInfo.isPlay = false;
                //this._audios.pushBack(audioInfo);
                _this._audios.set(index, audioInfo);
                callback(audioInfo, index);
            }
            audio.src = fileName;
            // 再生終了時に再生されていないとマークする。
            audio.onended = function () {
                audioInfo.isPlay = false;
            };
        });
    };
    /**
     * 音声の解放
     *
     * 配列に存在する音声全てを解放する。
     */
    LAppMotionSyncAudioManager.prototype.clearAudios = function () {
        for (var i = 0; i < this._audios.getSize(); i++) {
            this._audios.at(i).workletNode.disconnect();
            this._audios.at(i).source.disconnect();
            this._audios.at(i).audioContext.close();
            this._audios.set(i, null);
        }
        this._audios.clear();
    };
    /**
     * 音声の解放
     *
     * 指定した音声コンテキストの音声を解放する。
     * @param audioContext 解放する音声コンテキスト
     */
    LAppMotionSyncAudioManager.prototype.releaseAudioByAudioContext = function (audioContext) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).audioContext != audioContext) {
                continue;
            }
            this._audios.at(i).workletNode.disconnect();
            this._audios.at(i).source.disconnect();
            this._audios.at(i).audioContext.close();
            this._audios.set(i, null);
            this._audios.remove(i);
            break;
        }
    };
    /**
     * 音声の解放
     *
     * 指定した名前の音声を解放する。
     * @param fileName 解放する音声ファイルパス
     */
    LAppMotionSyncAudioManager.prototype.releaseAudioByFilePath = function (fileName) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).filePath != fileName) {
                continue;
            }
            this._audios.at(i).workletNode.disconnect();
            this._audios.at(i).source.disconnect();
            this._audios.at(i).audioContext.close();
            this._audios.set(i, null);
            this._audios.remove(i);
            break;
        }
    };
    /**
     * 再生中かどうかを取得
     *
     * @param filePath 音声ファイルパス
     * @returns 指定した名前の音声が再生中か？
     */
    LAppMotionSyncAudioManager.prototype.isPlayByFilePath = function (filePath) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).filePath != filePath) {
                continue;
            }
            return this._audios.at(i).isPlay;
        }
        return false;
    };
    /**
     * 指定したファイルパスの音声を再生
     *
     * @param filePath 音声ファイルパス
     */
    LAppMotionSyncAudioManager.prototype.playByFilePath = function (filePath) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).filePath != filePath) {
                continue;
            }
            this._audios.at(i).audio.play();
            this._audios.at(i).isPlay = true;
            break;
        }
    };
    /**
     * 指定したファイルパスの音声の再生を停止
     *
     * @param filePath 音声ファイルパス
     */
    LAppMotionSyncAudioManager.prototype.stopByFilePath = function (filePath) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).filePath != filePath) {
                continue;
            }
            this._audios.at(i).audio.load();
            this._audios.at(i).isPlay = false;
            break;
        }
    };
    /**
     * 指定したファイルパスの音声の再生を一時停止
     *
     * @param filePath 音声ファイルパス
     */
    LAppMotionSyncAudioManager.prototype.pauseByFilePath = function (filePath) {
        for (var i = 0; i < this._audios.getSize(); i++) {
            if (this._audios.at(i).filePath != filePath) {
                continue;
            }
            this._audios.at(i).audio.pause();
            this._audios.at(i).isPlay = false;
            break;
        }
    };
    /**
     * WorkletProcessorモジュールからデータを受け取るコールバック設定用の関数
     *
     * @param index 音声のインデックス
     * @param buffer データを入れるバッファ
     * @param updateSizes 更新サイズの配列
     */
    LAppMotionSyncAudioManager.prototype.setOnMessageByIndex = function (index, buffer, updateSizes) {
        var _this = this;
        this._audios.at(index).workletNode.port.onmessage = function (e) {
            if (!_this.isPlayByIndex(index)) {
                return;
            }
            // 元がany型なので定義に入れる。
            var data = e.data;
            // WorkletProcessorモジュールからデータを取得
            if (data.eventType === 'data') {
                var newValue_1 = updateSizes.at(index);
                data.audioBuffer.forEach(function (element) {
                    buffer.pushBack(element);
                    newValue_1++;
                });
                updateSizes.set(index, newValue_1);
            }
        };
    };
    /**
     * 再生中かどうかを取得
     *
     * @param index インデックス
     * @returns 指定したインデックスの音声が再生中か？
     */
    LAppMotionSyncAudioManager.prototype.isPlayByIndex = function (index) {
        if (this._audios == null || !(index < this._audios.getSize()) || this._audios.at(index) == null) {
            return false;
        }
        return this._audios.at(index).isPlay;
    };
    /**
     * 指定したインデックスの音声を再生
     *
     * @param index インデックス
     */
    LAppMotionSyncAudioManager.prototype.playByIndex = function (index) {
        if (!(index < this._audios.getSize()) || this._audios.at(index) == null) {
            return;
        }
        this._audios.at(index).audio.play();
        this._audios.at(index).isPlay = true;
    };
    /**
     * 指定したインデックスの音声の再生を停止
     *
     * @param index インデックス
     */
    LAppMotionSyncAudioManager.prototype.stopByIndex = function (index) {
        if (!(index < this._audios.getSize()) || this._audios.at(index) == null) {
            return;
        }
        this._audios.at(index).audio.load();
        this._audios.at(index).isPlay = false;
    };
    /**
     * 指定したインデックスの音声の再生を一時停止
     *
     * @param index インデックス
     */
    LAppMotionSyncAudioManager.prototype.pauseByIndex = function (index) {
        if (!(index < this._audios.getSize()) || this._audios.at(index) == null) {
            return;
        }
        this._audios.at(index).audio.pause();
        this._audios.at(index).isPlay = false;
    };
    return LAppMotionSyncAudioManager;
}());
exports.LAppMotionSyncAudioManager = LAppMotionSyncAudioManager;
/**
 * 音声情報構造体
 */
var AudioInfo = /** @class */ (function () {
    function AudioInfo() {
        this.audioContext = null; // 音声コンテキスト
        this.source = null; // 音源ノード
        this.workletNode = null; // リアルタイム時間領域用のノード
    }
    return AudioInfo;
}());
exports.AudioInfo = AudioInfo;


/***/ }),

/***/ "./src/lappmotionsyncdefine.ts":
/*!*************************************!*\
  !*** ./src/lappmotionsyncdefine.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BitDepth = exports.SamplesPerSec = exports.Channels = exports.ModelDirSize = exports.ModelDir = exports.FastForwardImageName = exports.MotionSyncModelSoundsDirName = exports.ResourcesPath = void 0;
/**
 * Sample Appで使用する定数
 */
// 相対パス
exports.ResourcesPath = '../../Resources/';
exports.MotionSyncModelSoundsDirName = 'sounds/';
// 早送りの画像ファイル
exports.FastForwardImageName = 'icon_fastForward.png';
// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
exports.ModelDir = ['shiro_hachi'];
exports.ModelDirSize = exports.ModelDir.length;
// チャンネル数
exports.Channels = 2;
// サンプリング周波数
exports.SamplesPerSec = 48000;
// ビット深度
exports.BitDepth = 16;


/***/ }),

/***/ "./src/lappmotionsyncdelegate.ts":
/*!***************************************!*\
  !*** ./src/lappmotionsyncdelegate.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppMotionSyncDelegate = exports.frameBuffer = exports.s_instance = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../../CubismSdkForWeb/Framework/src/live2dcubismframework.ts");
var LAppDefine = __importStar(__webpack_require__(/*! @cubismsdksamples/lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lapppal_1 = __webpack_require__(/*! @cubismsdksamples/lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var lapptexturemanager_1 = __webpack_require__(/*! @cubismsdksamples/lapptexturemanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapptexturemanager.ts");
var live2dcubismmotionsync_1 = __webpack_require__(/*! @motionsyncframework/live2dcubismmotionsync */ "../../../Framework/src/live2dcubismmotionsync.ts");
var lappmotionsyncview_1 = __webpack_require__(/*! ./lappmotionsyncview */ "./src/lappmotionsyncview.ts");
var lappmotionsynclive2dmanager_1 = __webpack_require__(/*! ./lappmotionsynclive2dmanager */ "./src/lappmotionsynclive2dmanager.ts");
var lappglmanager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@cubismsdksamples/lappglmanager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
exports.s_instance = null;
exports.frameBuffer = null;
/**
 * アプリケーションクラス。
 * Cubism SDKの管理を行う。
 */
var LAppMotionSyncDelegate = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppMotionSyncDelegate() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;
        this._cubismOption = new live2dcubismframework_1.Option();
        this._cubismMotionSyncOption = new live2dcubismmotionsync_1.MotionSyncOption();
        this._view = new lappmotionsyncview_1.LAppMotionSyncView();
        this._textureManager = new lapptexturemanager_1.LAppTextureManager();
    }
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    LAppMotionSyncDelegate.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppMotionSyncDelegate();
        }
        return exports.s_instance;
    };
    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    LAppMotionSyncDelegate.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance.release();
        }
        exports.s_instance = null;
    };
    /**
     * APPに必要な物を初期化する。
     */
    LAppMotionSyncDelegate.prototype.initialize = function () {
        // キャンバスを DOM に追加
        document.body.appendChild(lappglmanager_1.canvas);
        if (LAppDefine.CanvasSize === 'auto') {
            this._resizeCanvas();
        }
        else {
            lappglmanager_1.canvas.width = LAppDefine.CanvasSize.width;
            lappglmanager_1.canvas.height = LAppDefine.CanvasSize.height;
        }
        if (!exports.frameBuffer) {
            exports.frameBuffer = lappglmanager_1.gl.getParameter(lappglmanager_1.gl.FRAMEBUFFER_BINDING);
        }
        // 透過設定
        lappglmanager_1.gl.enable(lappglmanager_1.gl.BLEND);
        lappglmanager_1.gl.blendFunc(lappglmanager_1.gl.SRC_ALPHA, lappglmanager_1.gl.ONE_MINUS_SRC_ALPHA);
        var supportTouch = 'ontouchend' in lappglmanager_1.canvas;
        if (supportTouch) {
            // タッチ関連コールバック関数登録
            lappglmanager_1.canvas.addEventListener('touchstart', onTouchBegan, { passive: true });
            lappglmanager_1.canvas.addEventListener('touchmove', onTouchMoved, { passive: true });
            lappglmanager_1.canvas.addEventListener('touchend', onTouchEnded, { passive: true });
            lappglmanager_1.canvas.addEventListener('touchcancel', onTouchCancel, { passive: true });
        }
        else {
            // マウス関連コールバック関数登録
            lappglmanager_1.canvas.addEventListener('mousedown', onClickBegan, { passive: true });
            lappglmanager_1.canvas.addEventListener('mousemove', onMouseMoved, { passive: true });
            lappglmanager_1.canvas.addEventListener('mouseup', onClickEnded, { passive: true });
        }
        // AppViewの初期化
        this._view.initialize();
        // Cubism SDKの初期化
        this.initializeCubism();
        return true;
    };
    /**
     * Resize canvas and re-initialize view.
     */
    LAppMotionSyncDelegate.prototype.onResize = function () {
        this._resizeCanvas();
        this._view.initialize();
        this._view.initializeSprite();
    };
    /**
     * 解放する。
     */
    LAppMotionSyncDelegate.prototype.release = function () {
        this._textureManager.release();
        this._textureManager = null;
        this._view.release();
        this._view = null;
        // リソースを解放
        lappmotionsynclive2dmanager_1.LAppMotionSyncLive2DManager.releaseInstance();
        // Cubism SDKの解放
        live2dcubismframework_1.CubismFramework.dispose();
        live2dcubismmotionsync_1.CubismMotionSync.dispose();
    };
    /**
     * 実行処理。
     */
    LAppMotionSyncDelegate.prototype.run = function () {
        var _this = this;
        // メインループ
        var loop = function () {
            // インスタンスの有無の確認
            if (exports.s_instance == null) {
                return;
            }
            // 時間更新
            lapppal_1.LAppPal.updateTime();
            // 画面の初期化
            lappglmanager_1.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            // 深度テストを有効化
            lappglmanager_1.gl.enable(lappglmanager_1.gl.DEPTH_TEST);
            // 近くにある物体は、遠くにある物体を覆い隠す
            lappglmanager_1.gl.depthFunc(lappglmanager_1.gl.LEQUAL);
            // カラーバッファや深度バッファをクリアする
            lappglmanager_1.gl.clear(lappglmanager_1.gl.COLOR_BUFFER_BIT | lappglmanager_1.gl.DEPTH_BUFFER_BIT);
            lappglmanager_1.gl.clearDepth(1.0);
            // 透過設定
            lappglmanager_1.gl.enable(lappglmanager_1.gl.BLEND);
            lappglmanager_1.gl.blendFunc(lappglmanager_1.gl.SRC_ALPHA, lappglmanager_1.gl.ONE_MINUS_SRC_ALPHA);
            // 描画更新
            _this._view.render();
            // ループのために再帰呼び出し
            requestAnimationFrame(loop);
        };
        loop();
    };
    /**
     * シェーダーを登録する。
     */
    LAppMotionSyncDelegate.prototype.createShader = function () {
        // バーテックスシェーダーのコンパイル
        var vertexShaderId = lappglmanager_1.gl.createShader(lappglmanager_1.gl.VERTEX_SHADER);
        if (vertexShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create vertexShader');
            return null;
        }
        var vertexShader = 'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';
        lappglmanager_1.gl.shaderSource(vertexShaderId, vertexShader);
        lappglmanager_1.gl.compileShader(vertexShaderId);
        // フラグメントシェーダのコンパイル
        var fragmentShaderId = lappglmanager_1.gl.createShader(lappglmanager_1.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }
        var fragmentShader = 'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
        lappglmanager_1.gl.shaderSource(fragmentShaderId, fragmentShader);
        lappglmanager_1.gl.compileShader(fragmentShaderId);
        // プログラムオブジェクトの作成
        var programId = lappglmanager_1.gl.createProgram();
        lappglmanager_1.gl.attachShader(programId, vertexShaderId);
        lappglmanager_1.gl.attachShader(programId, fragmentShaderId);
        lappglmanager_1.gl.deleteShader(vertexShaderId);
        lappglmanager_1.gl.deleteShader(fragmentShaderId);
        // リンク
        lappglmanager_1.gl.linkProgram(programId);
        lappglmanager_1.gl.useProgram(programId);
        return programId;
    };
    /**
     * View情報を取得する。
     */
    LAppMotionSyncDelegate.prototype.getView = function () {
        return this._view;
    };
    LAppMotionSyncDelegate.prototype.getTextureManager = function () {
        return this._textureManager;
    };
    /**
     * Cubism SDKの初期化
     */
    LAppMotionSyncDelegate.prototype.initializeCubism = function () {
        // setup cubism
        this._cubismOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        live2dcubismframework_1.CubismFramework.startUp(this._cubismOption);
        // setup motionsync
        this._cubismMotionSyncOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismMotionSyncOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        live2dcubismmotionsync_1.CubismMotionSync.startUp(this._cubismMotionSyncOption);
        // initialize cubism
        live2dcubismframework_1.CubismFramework.initialize();
        live2dcubismmotionsync_1.CubismMotionSync.initialize();
        // load model
        lappmotionsynclive2dmanager_1.LAppMotionSyncLive2DManager.getInstance();
        lapppal_1.LAppPal.updateTime();
        this._view.initializeSprite();
    };
    /**
     * Resize the canvas to fill the screen.
     */
    LAppMotionSyncDelegate.prototype._resizeCanvas = function () {
        lappglmanager_1.canvas.width = lappglmanager_1.canvas.clientWidth * window.devicePixelRatio;
        lappglmanager_1.canvas.height = lappglmanager_1.canvas.clientHeight * window.devicePixelRatio;
        lappglmanager_1.gl.viewport(0, 0, lappglmanager_1.gl.drawingBufferWidth, lappglmanager_1.gl.drawingBufferHeight);
    };
    return LAppMotionSyncDelegate;
}());
exports.LAppMotionSyncDelegate = LAppMotionSyncDelegate;
/**
 * クリックしたときに呼ばれる。
 */
function onClickBegan(e) {
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppMotionSyncDelegate.getInstance()._captured = true;
    var posX = e.pageX;
    var posY = e.pageY;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesBegan(posX, posY);
    // HACK: On Safari.
    if (navigator.userAgent.includes("AppleWebKit")) {
        var audio = new Audio();
        audio.play();
    }
}
/**
 * マウスポインタが動いたら呼ばれる。
 */
function onMouseMoved(e) {
    if (!LAppMotionSyncDelegate.getInstance()._captured) {
        return;
    }
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
/**
 * クリックが終了したら呼ばれる。
 */
function onClickEnded(e) {
    LAppMotionSyncDelegate.getInstance()._captured = false;
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
/**
 * タッチしたときに呼ばれる。
 */
function onTouchBegan(e) {
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppMotionSyncDelegate.getInstance()._captured = true;
    var posX = e.changedTouches[0].pageX;
    var posY = e.changedTouches[0].pageY;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
/**
 * スワイプすると呼ばれる。
 */
function onTouchMoved(e) {
    if (!LAppMotionSyncDelegate.getInstance()._captured) {
        return;
    }
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
/**
 * タッチが終了したら呼ばれる。
 */
function onTouchEnded(e) {
    LAppMotionSyncDelegate.getInstance()._captured = false;
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
/**
 * タッチがキャンセルされると呼ばれる。
 */
function onTouchCancel(e) {
    LAppMotionSyncDelegate.getInstance()._captured = false;
    if (!LAppMotionSyncDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppMotionSyncDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}


/***/ }),

/***/ "./src/lappmotionsynclive2dmanager.ts":
/*!********************************************!*\
  !*** ./src/lappmotionsynclive2dmanager.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppMotionSyncLive2DManager = exports.s_instance = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var LAppDefine = __importStar(__webpack_require__(/*! @cubismsdksamples/lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var LappMotionSyncDefine = __importStar(__webpack_require__(/*! ./lappmotionsyncdefine */ "./src/lappmotionsyncdefine.ts"));
var lappglmanager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@cubismsdksamples/lappglmanager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var lappmotionsyncmodel_1 = __webpack_require__(/*! ./lappmotionsyncmodel */ "./src/lappmotionsyncmodel.ts");
var lapppal_1 = __webpack_require__(/*! @cubismsdksamples/lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
exports.s_instance = null;
/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
var LAppMotionSyncLive2DManager = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppMotionSyncLive2DManager() {
        this._viewMatrix = new cubismmatrix44_1.CubismMatrix44();
        this._models = new csmvector_1.csmVector();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    LAppMotionSyncLive2DManager.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppMotionSyncLive2DManager();
        }
        return exports.s_instance;
    };
    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    LAppMotionSyncLive2DManager.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    /**
     * 現在のシーンで保持しているモデルを返す。
     *
     * @param no モデルリストのインデックス値
     * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
     */
    LAppMotionSyncLive2DManager.prototype.getModel = function (no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    };
    /**
     * 現在のシーンで保持しているすべてのモデルを解放する
     */
    LAppMotionSyncLive2DManager.prototype.releaseAllModel = function () {
        for (var i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    };
    /**
     * 画面をタップした時の処理
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    LAppMotionSyncLive2DManager.prototype.onTap = function (x, y) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]tap point: {x: ".concat(x.toFixed(2), " y: ").concat(y.toFixed(2), "}"));
        }
    };
    /**
     * 画面を更新するときの処理
     * モデルの更新処理及び描画処理を行う
     */
    LAppMotionSyncLive2DManager.prototype.onUpdate = function () {
        var width = lappglmanager_1.canvas.width, height = lappglmanager_1.canvas.height;
        var modelCount = this._models.getSize();
        for (var i = 0; i < modelCount; ++i) {
            var projection = new cubismmatrix44_1.CubismMatrix44();
            var model = this.getModel(i);
            if (model.getModel()) {
                if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
                    // 横に長いモデルを縦長ウィンドウに表示する際モデルの横サイズでscaleを算出する
                    model.getModelMatrix().setWidth(2.0);
                    projection.scale(1.0, width / height);
                }
                else {
                    projection.scale(height / width, 1.0);
                }
                // 必要があればここで乗算
                if (this._viewMatrix != null) {
                    projection.multiplyByMatrix(this._viewMatrix);
                }
            }
            model.update();
            model.draw(projection); // 参照渡しなのでprojectionは変質する。
        }
    };
    /**
     * 次の音声に切り替える
     */
    LAppMotionSyncLive2DManager.prototype.changeNextIndexSound = function () {
        var model = this._models.at(0);
        if (!model.isSuspendedCurrentSoundContext()) {
            model.stopCurrentSound();
            // インデックスを更新
            model._soundIndex =
                (model._soundIndex + 1) % model._soundFileList.getSize();
        }
        model.playCurrentSound();
    };
    /**
     * 次のシーンに切りかえる
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    LAppMotionSyncLive2DManager.prototype.nextScene = function () {
        var no = (this._sceneIndex + 1) % LappMotionSyncDefine.ModelDirSize;
        this.changeScene(no);
    };
    /**
     * シーンを切り替える
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    LAppMotionSyncLive2DManager.prototype.changeScene = function (index) {
        this._sceneIndex = index;
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]model index: ".concat(this._sceneIndex));
        }
        // ModelDir[]に保持したディレクトリ名から
        // model3.jsonのパスを決定する。
        // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
        var model = LappMotionSyncDefine.ModelDir[index];
        var modelPath = LappMotionSyncDefine.ResourcesPath + model + '/';
        var modelJsonName = LappMotionSyncDefine.ModelDir[index];
        modelJsonName += '.model3.json';
        this.releaseAllModel();
        this._models.pushBack(new lappmotionsyncmodel_1.LAppMotionSyncModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    };
    LAppMotionSyncLive2DManager.prototype.setViewMatrix = function (m) {
        for (var i = 0; i < 16; i++) {
            this._viewMatrix.getArray()[i] = m.getArray()[i];
        }
    };
    return LAppMotionSyncLive2DManager;
}());
exports.LAppMotionSyncLive2DManager = LAppMotionSyncLive2DManager;


/***/ }),

/***/ "./src/lappmotionsyncmodel.ts":
/*!************************************!*\
  !*** ./src/lappmotionsyncmodel.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppMotionSyncModel = void 0;
__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
var cubismusermodel_1 = __webpack_require__(/*! @framework/model/cubismusermodel */ "../../../../CubismSdkForWeb/Framework/src/model/cubismusermodel.ts");
var csmmap_1 = __webpack_require__(/*! @framework/type/csmmap */ "../../../../CubismSdkForWeb/Framework/src/type/csmmap.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../../CubismSdkForWeb/Framework/src/utils/cubismdebug.ts");
var LAppDefine = __importStar(__webpack_require__(/*! @cubismsdksamples/lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var LAppMotionSyncDefine = __importStar(__webpack_require__(/*! ./lappmotionsyncdefine */ "./src/lappmotionsyncdefine.ts"));
var lappmotionsyncdelegate_1 = __webpack_require__(/*! ./lappmotionsyncdelegate */ "./src/lappmotionsyncdelegate.ts");
var lapppal_1 = __webpack_require__(/*! @cubismsdksamples/lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var cubismmoc_1 = __webpack_require__(/*! @framework/model/cubismmoc */ "../../../../CubismSdkForWeb/Framework/src/model/cubismmoc.ts");
var cubismmodelmotionsyncsettingjson_1 = __webpack_require__(/*! @motionsyncframework/cubismmodelmotionsyncsettingjson */ "../../../Framework/src/cubismmodelmotionsyncsettingjson.ts");
var lappplaysound_1 = __webpack_require__(/*! ./lappplaysound */ "./src/lappplaysound.ts");
var live2dcubismmotionsync_1 = __webpack_require__(/*! @motionsyncframework/live2dcubismmotionsync */ "../../../Framework/src/live2dcubismmotionsync.ts");
var lappglmanager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@cubismsdksamples/lappglmanager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var LoadStep;
(function (LoadStep) {
    LoadStep[LoadStep["LoadAssets"] = 0] = "LoadAssets";
    LoadStep[LoadStep["LoadModel"] = 1] = "LoadModel";
    LoadStep[LoadStep["WaitLoadModel"] = 2] = "WaitLoadModel";
    LoadStep[LoadStep["LoadExpression"] = 3] = "LoadExpression";
    LoadStep[LoadStep["WaitLoadExpression"] = 4] = "WaitLoadExpression";
    LoadStep[LoadStep["LoadPhysics"] = 5] = "LoadPhysics";
    LoadStep[LoadStep["WaitLoadPhysics"] = 6] = "WaitLoadPhysics";
    LoadStep[LoadStep["LoadPose"] = 7] = "LoadPose";
    LoadStep[LoadStep["WaitLoadPose"] = 8] = "WaitLoadPose";
    LoadStep[LoadStep["SetupEyeBlink"] = 9] = "SetupEyeBlink";
    LoadStep[LoadStep["SetupBreath"] = 10] = "SetupBreath";
    LoadStep[LoadStep["LoadUserData"] = 11] = "LoadUserData";
    LoadStep[LoadStep["WaitLoadUserData"] = 12] = "WaitLoadUserData";
    LoadStep[LoadStep["SetupEyeBlinkIds"] = 13] = "SetupEyeBlinkIds";
    LoadStep[LoadStep["SetupLipSyncIds"] = 14] = "SetupLipSyncIds";
    LoadStep[LoadStep["SetupLayout"] = 15] = "SetupLayout";
    LoadStep[LoadStep["LoadMotionSync"] = 16] = "LoadMotionSync";
    LoadStep[LoadStep["LoadMotion"] = 17] = "LoadMotion";
    LoadStep[LoadStep["WaitLoadMotion"] = 18] = "WaitLoadMotion";
    LoadStep[LoadStep["CompleteInitialize"] = 19] = "CompleteInitialize";
    LoadStep[LoadStep["CompleteSetupModel"] = 20] = "CompleteSetupModel";
    LoadStep[LoadStep["LoadTexture"] = 21] = "LoadTexture";
    LoadStep[LoadStep["WaitLoadTexture"] = 22] = "WaitLoadTexture";
    LoadStep[LoadStep["CompleteSetup"] = 23] = "CompleteSetup";
})(LoadStep || (LoadStep = {}));
/**
 * ユーザーが実際に使用するモデルの実装クラス<br>
 * モデル生成、機能コンポーネント生成、更新処理とレンダリングの呼び出しを行う。
 */
var LAppMotionSyncModel = /** @class */ (function (_super) {
    __extends(LAppMotionSyncModel, _super);
    /**
     * コンストラクタ
     */
    function LAppMotionSyncModel() {
        var _this = _super.call(this) || this;
        _this._modelSetting = null;
        _this._modelHomeDir = null;
        _this._userTimeSeconds = 0.0;
        _this._hitArea = new csmvector_1.csmVector();
        _this._userArea = new csmvector_1.csmVector();
        if (LAppDefine.MOCConsistencyValidationEnable) {
            _this._mocConsistency = true;
        }
        _this._state = LoadStep.LoadAssets;
        _this._expressionCount = 0;
        _this._textureCount = 0;
        _this._motionCount = 0;
        _this._allMotionCount = 0;
        _this._consistency = false;
        _this._soundFileList = new csmvector_1.csmVector();
        _this._soundIndex = 0;
        _this._soundData = new lappplaysound_1.LAppPlaySound();
        return _this;
    }
    /**
     * model3.jsonが置かれたディレクトリとファイルパスからモデルを生成する
     * @param dir
     * @param fileName
     */
    LAppMotionSyncModel.prototype.loadAssets = function (dir, fileName) {
        var _this = this;
        this._modelHomeDir = dir;
        fetch("".concat(this._modelHomeDir).concat(fileName))
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) {
            var setting = new cubismmodelmotionsyncsettingjson_1.CubismModelMotionSyncSettingJson(arrayBuffer, arrayBuffer.byteLength);
            // ステートを更新
            _this._state = LoadStep.LoadModel;
            // 結果を保存
            _this.setupModel(setting);
        });
    };
    /**
     * model3.jsonからモデルを生成する。
     * model3.jsonの記述に従ってモデル生成、モーション、物理演算などのコンポーネント生成を行う。
     *
     * @param setting ICubismModelSettingのインスタンス
     */
    LAppMotionSyncModel.prototype.setupModel = function (setting) {
        var _this = this;
        this._updating = true;
        this._initialized = false;
        this._modelSetting = setting;
        // CubismModel
        if (this._modelSetting.getModelFileName() != '') {
            var modelFileName = this._modelSetting.getModelFileName();
            fetch("".concat(this._modelHomeDir).concat(modelFileName))
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                _this.loadModel(arrayBuffer, _this._mocConsistency);
                _this._state = LoadStep.SetupLayout;
                // Callback
                setupLayout();
            });
            this._state = LoadStep.WaitLoadModel;
        }
        else {
            lapppal_1.LAppPal.printMessage('Model data does not exist.');
        }
        // Layout
        var setupLayout = function () {
            var layout = new csmmap_1.csmMap();
            if (_this._modelSetting == null || _this._modelMatrix == null) {
                (0, cubismdebug_1.CubismLogError)('Failed to setupLayout().');
                return;
            }
            _this._modelSetting.getLayoutMap(layout);
            _this._modelMatrix.setupFromLayout(layout);
            _this._state = LoadStep.LoadMotionSync;
            // MotionSync
            setupMotionSync();
        };
        // MotionSync
        var setupMotionSync = function () {
            if (_this._modelSetting.getMotionSyncFileName() != '') {
                var motionSyncFile = _this._modelSetting.getMotionSyncFileName();
                fetch("".concat(_this._modelHomeDir).concat(motionSyncFile))
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadMotionSync(arrayBuffer, arrayBuffer.byteLength);
                    // 音声ファイルの読み込み
                    _this._soundFileList =
                        _this._modelSetting.getMotionSyncSoundFileList();
                    _this._soundIndex = 0;
                }).then(function () {
                    _this.loadFromSoundList();
                    _this._state = LoadStep.LoadTexture;
                    _this._updating = false;
                    _this._initialized = true;
                    _this.createRenderer();
                    _this.setupTextures();
                    _this.getRenderer().startUp(lappglmanager_1.gl);
                });
            }
        };
    };
    /**
     * モーションシンクデータの読み込み
     * @param buffer  physics3.jsonが読み込まれているバッファ
     * @param size    バッファのサイズ
     */
    LAppMotionSyncModel.prototype.loadMotionSync = function (buffer, size) {
        this._motionSync = live2dcubismmotionsync_1.CubismMotionSync.create(this._model, buffer, size, LAppMotionSyncDefine.SamplesPerSec);
    };
    /**
     * テクスチャユニットにテクスチャをロードする
     */
    LAppMotionSyncModel.prototype.setupTextures = function () {
        var _this = this;
        // iPhoneでのアルファ品質向上のためTypescriptではpremultipliedAlphaを採用
        var usePremultiply = true;
        if (this._state == LoadStep.LoadTexture) {
            // テクスチャ読み込み用
            var textureCount_1 = this._modelSetting.getTextureCount();
            var _loop_1 = function (modelTextureNumber) {
                // テクスチャ名が空文字だった場合はロード・バインド処理をスキップ
                if (this_1._modelSetting.getTextureFileName(modelTextureNumber) == '') {
                    console.log('getTextureFileName null');
                    return "continue";
                }
                // WebGLのテクスチャユニットにテクスチャをロードする
                var texturePath = this_1._modelSetting.getTextureFileName(modelTextureNumber);
                texturePath = this_1._modelHomeDir + texturePath;
                // ロード完了時に呼び出すコールバック関数
                var onLoad = function (textureInfo) {
                    _this.getRenderer().bindTexture(modelTextureNumber, textureInfo.id);
                    _this._textureCount++;
                    if (_this._textureCount >= textureCount_1) {
                        // ロード完了
                        _this._state = LoadStep.CompleteSetup;
                    }
                };
                // 読み込み
                lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance()
                    .getTextureManager()
                    .createTextureFromPngFile(texturePath, usePremultiply, onLoad);
                this_1.getRenderer().setIsPremultipliedAlpha(usePremultiply);
            };
            var this_1 = this;
            for (var modelTextureNumber = 0; modelTextureNumber < textureCount_1; modelTextureNumber++) {
                _loop_1(modelTextureNumber);
            }
            this._state = LoadStep.WaitLoadTexture;
        }
    };
    /**
     * レンダラを再構築する
     */
    LAppMotionSyncModel.prototype.reloadRenderer = function () {
        this.deleteRenderer();
        this.createRenderer();
        this.setupTextures();
    };
    /**
     * 音声ファイルリストから読み込みを行う。
     */
    LAppMotionSyncModel.prototype.loadFromSoundList = function () {
        if (!this._soundFileList || !this._soundData) {
            return;
        }
        this._soundData.getSoundBufferContext().getAudioManager()._audios.resize(this._soundFileList.getSize());
        this._soundData.getSoundBufferContext().getBuffers().resize(this._soundFileList.getSize());
        for (var index = 0; index < this._soundFileList.getSize(); index++) {
            var filePath = this._modelHomeDir + this._soundFileList.at(index).s;
            this._soundData.loadFile(filePath, index);
        }
    };
    /**
     * 現在の音声のコンテキストが待機状態かどうかを判定する
     *
     * @returns 現在の音声のコンテキストが待機状態か？
     */
    LAppMotionSyncModel.prototype.isSuspendedCurrentSoundContext = function () {
        return this._soundData.isSuspendedContextByIndex(this._soundIndex);
    };
    /**
     * 現在の音声を再生する
     */
    LAppMotionSyncModel.prototype.playCurrentSound = function () {
        if (!this._soundData ||
            !this._soundFileList ||
            !(this._soundIndex < this._soundFileList.getSize())) {
            return;
        }
        this._motionSync.setSoundBuffer(0, this._soundData
            .getSoundBufferContext()
            .getBuffers()
            .at(this._soundIndex));
        this._soundData.playByIndex(this._soundIndex);
    };
    /**
     * 現在の音声を再生停止する
     */
    LAppMotionSyncModel.prototype.stopCurrentSound = function () {
        if (!this._soundData ||
            !this._soundFileList ||
            !(this._soundIndex < this._soundFileList.getSize())) {
            return;
        }
        this._soundData.stopByIndex(this._soundIndex);
    };
    /**
     * 更新
     */
    LAppMotionSyncModel.prototype.update = function () {
        if (this._state != LoadStep.CompleteSetup)
            return;
        var deltaTimeSeconds = lapppal_1.LAppPal.getDeltaTime();
        this._userTimeSeconds += deltaTimeSeconds;
        // 物理演算の設定
        if (this._physics != null) {
            this._physics.evaluate(this._model, deltaTimeSeconds);
        }
        // ポーズの設定
        if (this._pose != null) {
            this._pose.updateParameters(this._model, deltaTimeSeconds);
        }
        if (this._soundData.isPlayByIndex(this._soundIndex)) {
            // 現在のフレームのデータを取得
            this._soundData.update();
            // サウンドバッファを新しいものへ更新
            this._motionSync.setSoundBuffer(0, this._soundData.getSoundBufferContext().getBuffers().at(this._soundIndex));
            // 現在のフレームのデータから解析処理を行う
            this._motionSync.updateParameters(this._model, deltaTimeSeconds);
            // 現在のフレームでの解析したサンプル数
            var processedCount = this._motionSync.getLastTotalProcessedCount(0);
            // 解析した数だけデータの配列の先頭から削除
            this._soundData.removeDataArrayByIndex(this._soundIndex, processedCount);
        }
        this._model.update();
    };
    /**
     * イベントの発火を受け取る
     */
    LAppMotionSyncModel.prototype.motionEventFired = function (eventValue) {
        (0, cubismdebug_1.CubismLogInfo)('{0} is fired on LAppModel!!', eventValue.s);
    };
    /**
     * 当たり判定テスト
     * 指定ＩＤの頂点リストから矩形を計算し、座標をが矩形範囲内か判定する。
     *
     * @param hitArenaName  当たり判定をテストする対象のID
     * @param x             判定を行うX座標
     * @param y             判定を行うY座標
     */
    LAppMotionSyncModel.prototype.hitTest = function (hitArenaName, x, y) {
        // 透明時は当たり判定無し。
        if (this._opacity < 1) {
            return false;
        }
        var count = this._modelSetting.getHitAreasCount();
        for (var i = 0; i < count; i++) {
            if (this._modelSetting.getHitAreaName(i) == hitArenaName) {
                var drawId = this._modelSetting.getHitAreaId(i);
                return this.isHit(drawId, x, y);
            }
        }
        return false;
    };
    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    LAppMotionSyncModel.prototype.doDraw = function () {
        if (this._model == null)
            return;
        // キャンバスサイズを渡す
        var viewport = [0, 0, lappglmanager_1.canvas.width, lappglmanager_1.canvas.height];
        this.getRenderer().setRenderState(lappmotionsyncdelegate_1.frameBuffer, viewport);
        this.getRenderer().drawModel();
    };
    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    LAppMotionSyncModel.prototype.draw = function (matrix) {
        if (this._model == null) {
            return;
        }
        // 各読み込み終了後
        if (this._state == LoadStep.CompleteSetup) {
            matrix.multiplyByMatrix(this._modelMatrix);
            this.getRenderer().setMvpMatrix(matrix);
            this.doDraw();
        }
    };
    LAppMotionSyncModel.prototype.hasMocConsistencyFromFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modelFileName, response, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, cubismdebug_1.CSM_ASSERT)(this._modelSetting.getModelFileName().localeCompare(""));
                        if (!(this._modelSetting.getModelFileName() != '')) return [3 /*break*/, 3];
                        modelFileName = this._modelSetting.getModelFileName();
                        return [4 /*yield*/, fetch("".concat(this._modelHomeDir).concat(modelFileName))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        this._consistency = cubismmoc_1.CubismMoc.hasMocConsistency(arrayBuffer);
                        if (!this._consistency) {
                            (0, cubismdebug_1.CubismLogInfo)('Inconsistent MOC3.');
                        }
                        else {
                            (0, cubismdebug_1.CubismLogInfo)('Consistent MOC3.');
                        }
                        return [2 /*return*/, this._consistency];
                    case 3:
                        lapppal_1.LAppPal.printMessage('Model data does not exist.');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LAppMotionSyncModel.prototype.release = function () {
        var _a, _b;
        _super.prototype.release.call(this);
        if (this._motionSync) {
            this._motionSync.release();
            this._motionSync = null;
        }
        if (this._soundFileList) {
            (_a = this._soundFileList) === null || _a === void 0 ? void 0 : _a.clear();
            this._soundFileList = null;
        }
        if (this._soundData) {
            (_b = this._soundData) === null || _b === void 0 ? void 0 : _b.release();
            this._soundData = null;
        }
    };
    return LAppMotionSyncModel;
}(cubismusermodel_1.CubismUserModel));
exports.LAppMotionSyncModel = LAppMotionSyncModel;


/***/ }),

/***/ "./src/lappmotionsyncview.ts":
/*!***********************************!*\
  !*** ./src/lappmotionsyncview.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppMotionSyncView = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../../CubismSdkForWeb/Framework/src/math/cubismmatrix44.ts");
var cubismviewmatrix_1 = __webpack_require__(/*! @framework/math/cubismviewmatrix */ "../../../../CubismSdkForWeb/Framework/src/math/cubismviewmatrix.ts");
var LAppDefine = __importStar(__webpack_require__(/*! @cubismsdksamples/lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var LAppMotionSyncDefine = __importStar(__webpack_require__(/*! ./lappmotionsyncdefine */ "./src/lappmotionsyncdefine.ts"));
var lappglmanager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@cubismsdksamples/lappglmanager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var lappmotionsyncdelegate_1 = __webpack_require__(/*! ./lappmotionsyncdelegate */ "./src/lappmotionsyncdelegate.ts");
var lappsprite_1 = __webpack_require__(/*! @cubismsdksamples/lappsprite */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappsprite.ts");
var lappmotionsynclive2dmanager_1 = __webpack_require__(/*! ./lappmotionsynclive2dmanager */ "./src/lappmotionsynclive2dmanager.ts");
var lapppal_1 = __webpack_require__(/*! @cubismsdksamples/lapppal */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lapppal.ts");
var touchmanager_1 = __webpack_require__(/*! @cubismsdksamples/touchmanager */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/touchmanager.ts");
/**
 * 描画クラス。
 */
var LAppMotionSyncView = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function LAppMotionSyncView() {
        this._programId = null;
        this._back = null;
        this._gear = null;
        this._fastForward = null;
        // タッチ関係のイベント管理
        this._touchManager = new touchmanager_1.TouchManager();
        // デバイス座標からスクリーン座標に変換するための
        this._deviceToScreen = new cubismmatrix44_1.CubismMatrix44();
        // 画面の表示の拡大縮小や移動の変換を行う行列
        this._viewMatrix = new cubismviewmatrix_1.CubismViewMatrix();
    }
    /**
     * 初期化する。
     */
    LAppMotionSyncView.prototype.initialize = function () {
        var width = lappglmanager_1.canvas.width, height = lappglmanager_1.canvas.height;
        var ratio = width / height;
        var left = -ratio;
        var right = ratio;
        var bottom = LAppDefine.ViewLogicalLeft;
        var top = LAppDefine.ViewLogicalRight;
        this._viewMatrix.setScreenRect(left, right, bottom, top); // デバイスに対応する画面の範囲。 Xの左端、Xの右端、Yの下端、Yの上端
        this._viewMatrix.scale(LAppDefine.ViewScale, LAppDefine.ViewScale);
        this._deviceToScreen.loadIdentity();
        if (width > height) {
            var screenW = Math.abs(right - left);
            this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        }
        else {
            var screenH = Math.abs(top - bottom);
            this._deviceToScreen.scaleRelative(screenH / height, -screenH / height);
        }
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);
        // 表示範囲の設定
        this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 限界拡張率
        this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 限界縮小率
        // 表示できる最大範囲
        this._viewMatrix.setMaxScreenRect(LAppDefine.ViewLogicalMaxLeft, LAppDefine.ViewLogicalMaxRight, LAppDefine.ViewLogicalMaxBottom, LAppDefine.ViewLogicalMaxTop);
    };
    /**
     * 解放する
     */
    LAppMotionSyncView.prototype.release = function () {
        this._viewMatrix = null;
        this._touchManager = null;
        this._deviceToScreen = null;
        this._fastForward.release();
        this._fastForward = null;
        this._gear.release();
        this._gear = null;
        this._back.release();
        this._back = null;
        lappglmanager_1.gl.deleteProgram(this._programId);
        this._programId = null;
    };
    /**
     * 描画する。
     */
    LAppMotionSyncView.prototype.render = function () {
        lappglmanager_1.gl.useProgram(this._programId);
        if (this._back) {
            this._back.render(this._programId);
        }
        if (this._gear) {
            this._gear.render(this._programId);
        }
        if (this._fastForward) {
            this._fastForward.render(this._programId);
        }
        lappglmanager_1.gl.flush();
        var live2DManager = lappmotionsynclive2dmanager_1.LAppMotionSyncLive2DManager.getInstance();
        live2DManager.setViewMatrix(this._viewMatrix);
        live2DManager.onUpdate();
    };
    /**
     * 画像の初期化を行う。
     */
    LAppMotionSyncView.prototype.initializeSprite = function () {
        var _this = this;
        var width = lappglmanager_1.canvas.width;
        var height = lappglmanager_1.canvas.height;
        var textureManager = lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance().getTextureManager();
        var resourcesPath = LAppDefine.ResourcesPath;
        var imageName = '';
        // 背景画像初期化
        imageName = LAppDefine.BackImageName;
        // 非同期なのでコールバック関数を作成
        var initBackGroundTexture = function (textureInfo) {
            var x = width * 0.5;
            var y = height * 0.5;
            var fwidth = textureInfo.width * 2.0;
            var fheight = height * 0.95;
            _this._back = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initBackGroundTexture);
        // 歯車画像初期化
        imageName = LAppDefine.GearImageName;
        var initGearTexture = function (textureInfo) {
            var x = width - textureInfo.width * 0.5;
            var y = height - textureInfo.height * 0.5;
            var fwidth = textureInfo.width;
            var fheight = textureInfo.height;
            _this._gear = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initGearTexture);
        // 音声遷移画像初期化
        imageName = LAppMotionSyncDefine.FastForwardImageName;
        var initFastForwardTexture = function (textureInfo) {
            var x = textureInfo.width * 0.5;
            var y = height - textureInfo.height * 0.5;
            var fwidth = textureInfo.width;
            var fheight = textureInfo.height;
            _this._fastForward = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initFastForwardTexture);
        // シェーダーを作成
        if (this._programId == null) {
            this._programId = lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance().createShader();
        }
    };
    /**
     * タッチされた時に呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppMotionSyncView.prototype.onTouchesBegan = function (pointX, pointY) {
        this._touchManager.touchesBegan(pointX * window.devicePixelRatio, pointY * window.devicePixelRatio);
    };
    /**
     * タッチしているときにポインタが動いたら呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppMotionSyncView.prototype.onTouchesMoved = function (pointX, pointY) {
        var viewX = this.transformViewX(this._touchManager.getX());
        var viewY = this.transformViewY(this._touchManager.getY());
        this._touchManager.touchesMoved(pointX * window.devicePixelRatio, pointY * window.devicePixelRatio);
    };
    /**
     * タッチが終了したら呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    LAppMotionSyncView.prototype.onTouchesEnded = function (pointX, pointY) {
        // タッチ終了
        var live2DManager = lappmotionsynclive2dmanager_1.LAppMotionSyncLive2DManager.getInstance();
        {
            // シングルタップ
            var x = this._deviceToScreen.transformX(this._touchManager.getX()); // 論理座標変換した座標を取得。
            var y = this._deviceToScreen.transformY(this._touchManager.getY()); // 論理座標変化した座標を取得。
            if (LAppDefine.DebugTouchLogEnable) {
                lapppal_1.LAppPal.printMessage("[APP]touchesEnded x: ".concat(x, " y: ").concat(y));
            }
            live2DManager.onTap(x, y);
            // 歯車にタップしたか
            if (this._gear.isHit(pointX * window.devicePixelRatio, pointY * window.devicePixelRatio)) {
                live2DManager.nextScene();
            }
            // 音声遷移にタップしたか
            if (this._fastForward.isHit(pointX * window.devicePixelRatio, pointY * window.devicePixelRatio)) {
                live2DManager.changeNextIndexSound();
            }
        }
    };
    /**
     * X座標をView座標に変換する。
     *
     * @param deviceX デバイスX座標
     */
    LAppMotionSyncView.prototype.transformViewX = function (deviceX) {
        var screenX = this._deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
    };
    /**
     * Y座標をView座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    LAppMotionSyncView.prototype.transformViewY = function (deviceY) {
        var screenY = this._deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformY(screenY);
    };
    /**
     * X座標をScreen座標に変換する。
     * @param deviceX デバイスX座標
     */
    LAppMotionSyncView.prototype.transformScreenX = function (deviceX) {
        return this._deviceToScreen.transformX(deviceX);
    };
    /**
     * Y座標をScreen座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    LAppMotionSyncView.prototype.transformScreenY = function (deviceY) {
        return this._deviceToScreen.transformY(deviceY);
    };
    return LAppMotionSyncView;
}());
exports.LAppMotionSyncView = LAppMotionSyncView;


/***/ }),

/***/ "./src/lappplaysound.ts":
/*!******************************!*\
  !*** ./src/lappplaysound.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SoundBufferContext = exports.LAppPlaySound = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../../CubismSdkForWeb/Framework/src/type/csmvector.ts");
var lappmotionsyncaudiomanager_1 = __webpack_require__(/*! ./lappmotionsyncaudiomanager */ "./src/lappmotionsyncaudiomanager.ts");
var LAppPlaySound = /** @class */ (function () {
    function LAppPlaySound() {
        this._soundBufferContext = new SoundBufferContext();
    }
    /**
     * パスからの音声ファイルの読み込み
     *
     * @param path ファイルパス
     */
    LAppPlaySound.prototype.loadFile = function (path, index) {
        var _this = this;
        this._soundBufferContext
            .getAudioManager()
            .createAudioFromFile(path, index, null, function (audioInfo, index) {
            _this._soundBufferContext
                .getBuffers()
                .set(index, new csmvector_1.csmVector());
            // 前回のサンプルから進んだ数の配列に設定
            _this._soundBufferContext.getUpdateSizes().pushBack(0);
            // Messege発した時にデータ取って来れるように設定
            _this._soundBufferContext
                .getAudioManager()
                .setOnMessageByIndex(index, _this._soundBufferContext.getBuffers().at(index), _this._soundBufferContext.getUpdateSizes());
        });
    };
    /**
     * 更新
     */
    LAppPlaySound.prototype.update = function () {
        var audioManager = this._soundBufferContext.getAudioManager();
        var updateSizes = this._soundBufferContext.getUpdateSizes();
        for (var index = 0; index < audioManager._audios.getSize(); index++) {
            if (!audioManager.isPlayByIndex(index)) {
                continue;
            }
            // 更新されたので要素数をリセット
            updateSizes.set(index, 0);
        }
    };
    /**
     * コンテナの先頭から要素を削除して他の要素をシフトする
     *
     * @param buffer 変更するバッファ
     * @param size 削除する大きさ
     * @returns 変更後のバッファ
     */
    LAppPlaySound.prototype.spliceBegin = function (buffer, size) {
        if (!(buffer === null || buffer === void 0 ? void 0 : buffer.begin()) || (buffer === null || buffer === void 0 ? void 0 : buffer._size) <= size) {
            return buffer; // 削除範囲外
        }
        // 削除
        buffer._ptr.splice(0, size);
        buffer._size -= size;
        return buffer;
    };
    /**
     * 先頭からsize分データを削除する
     *
     * @param index データを削除するバッファのインデックス
     * @param size 削除するデータの要素数
     */
    LAppPlaySound.prototype.removeDataArrayByIndex = function (index, size) {
        var buffer = this._soundBufferContext.getBuffers().at(index);
        if (size < buffer.getSize()) {
            // 途中からのバッファにする
            buffer = this.spliceBegin(buffer, size);
        }
        else {
            // バッファの全要素をクリア
            buffer.clear();
        }
    };
    /**
     * 指定したインデックスの音声コンテキストが待機状態になっているかを判定する
     *
     * @param index 指定するインデックス
     * @returns 音声コンテキストが待機状態になっているか？
     */
    LAppPlaySound.prototype.isSuspendedContextByIndex = function (index) {
        var audioContext = this.getSoundBufferContext()
            .getAudioManager()
            ._audios.at(index).audioContext;
        return audioContext.state == 'suspended';
    };
    /**
     * インデックスを使って音声を再生する。
     *
     * @param index インデックス
     */
    LAppPlaySound.prototype.playByIndex = function (index) {
        var _this = this;
        if (this.isPlayByIndex(index)) {
            return;
        }
        var audioContext = this.getSoundBufferContext()
            .getAudioManager()
            ._audios.at(index).audioContext;
        // まだ待機状態だったらrunningにする
        if (this.isSuspendedContextByIndex(index)) {
            audioContext.resume().then(function () {
                _this._soundBufferContext.getAudioManager().playByIndex(index);
            });
        }
        else {
            this._soundBufferContext.getAudioManager().playByIndex(index);
        }
    };
    /**
     * インデックスを使って音声の再生を停止する。
     *
     * @param index インデックス
     */
    LAppPlaySound.prototype.stopByIndex = function (index) {
        if (!this.isPlayByIndex(index)) {
            return;
        }
        this._soundBufferContext.getAudioManager().stopByIndex(index);
        // バッファの中身をクリアする。
        var buffer = this._soundBufferContext.getBuffers().at(index);
        buffer.clear();
    };
    /**
     * インデックスを使って音声が再生中か判定する。
     *
     * @param index インデックス
     * @returns 再生中か？
     */
    LAppPlaySound.prototype.isPlayByIndex = function (index) {
        return this._soundBufferContext.getAudioManager().isPlayByIndex(index);
    };
    LAppPlaySound.prototype.getSoundBufferContext = function () {
        return this._soundBufferContext;
    };
    LAppPlaySound.prototype.release = function () {
        if (this._soundBufferContext) {
            this._soundBufferContext.release();
            this._soundBufferContext = void 0;
        }
    };
    return LAppPlaySound;
}());
exports.LAppPlaySound = LAppPlaySound;
var SoundBufferContext = /** @class */ (function () {
    function SoundBufferContext(buffers, audioManager, updateSizes) {
        this._buffers = buffers
            ? buffers
            : new csmvector_1.csmVector();
        this._audioManager = audioManager
            ? audioManager
            : new lappmotionsyncaudiomanager_1.LAppMotionSyncAudioManager();
        this._updateSizes = updateSizes ? updateSizes : new csmvector_1.csmVector();
    }
    SoundBufferContext.prototype.getBuffers = function () {
        return this._buffers;
    };
    SoundBufferContext.prototype.getAudioManager = function () {
        return this._audioManager;
    };
    SoundBufferContext.prototype.getUpdateSizes = function () {
        return this._updateSizes;
    };
    SoundBufferContext.prototype.setUpdateSize = function (index, value) {
        this._updateSizes.set(index, value);
    };
    SoundBufferContext.prototype.release = function () {
        if (this._buffers != null) {
            this._buffers.clear();
            this._buffers = void 0;
        }
        if (this._audioManager != null) {
            this._audioManager.release();
            this._audioManager = void 0;
        }
        if (this._updateSizes != null) {
            this._updateSizes.clear();
            this._updateSizes = void 0;
        }
    };
    return SoundBufferContext;
}());
exports.SoundBufferContext = SoundBufferContext;


/***/ }),

/***/ "./src/mainmotionsync.ts":
/*!*******************************!*\
  !*** ./src/mainmotionsync.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var lappmotionsyncdelegate_1 = __webpack_require__(/*! ./lappmotionsyncdelegate */ "./src/lappmotionsyncdelegate.ts");
var LAppDefine = __importStar(__webpack_require__(/*! @cubismsdksamples/lappdefine */ "../../../../CubismSdkForWeb/Samples/TypeScript/Demo/src/lappdefine.ts"));
var lappglmanager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@cubismsdksamples/lappglmanager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
/**
 * ブラウザロード後の処理
 */
window.addEventListener('load', function () {
    // Initialize WebGL and create the application instance
    if (!lappglmanager_1.LAppGlManager.getInstance() ||
        !lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance().initialize()) {
        return;
    }
    lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance().run();
}, { passive: true });
/**
 * 終了時の処理
 */
window.addEventListener('beforeunload', function () { return lappmotionsyncdelegate_1.LAppMotionSyncDelegate.releaseInstance(); }, { passive: true });
/**
 * Process when changing screen size.
 */
window.addEventListener('resize', function () {
    if (LAppDefine.CanvasSize === 'auto') {
        lappmotionsyncdelegate_1.LAppMotionSyncDelegate.getInstance().onResize();
    }
}, { passive: true });


/***/ }),

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-fetch/fetch.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMException: function() { return /* binding */ DOMException; },
/* harmony export */   Headers: function() { return /* binding */ Headers; },
/* harmony export */   Request: function() { return /* binding */ Request; },
/* harmony export */   Response: function() { return /* binding */ Response; },
/* harmony export */   fetch: function() { return /* binding */ fetch; }
/* harmony export */ });
/* eslint-disable no-prototype-builtins */
var g =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  // eslint-disable-next-line no-undef
  (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g) ||
  {}

var support = {
  searchParams: 'URLSearchParams' in g,
  iterable: 'Symbol' in g && 'iterator' in Symbol,
  blob:
    'FileReader' in g &&
    'Blob' in g &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in g,
  arrayBuffer: 'ArrayBuffer' in g
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      if (header.length != 2) {
        throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
      }
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body._noBody) return
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type)
  var encoding = match ? match[1] : 'utf-8'
  reader.readAsText(blob, encoding)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    // eslint-disable-next-line no-self-assign
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._noBody = true;
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }
  }

  this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var isConsumed = consumed(this)
      if (isConsumed) {
        return isConsumed
      } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
        return Promise.resolve(
          this._bodyArrayBuffer.buffer.slice(
            this._bodyArrayBuffer.byteOffset,
            this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
          )
        )
      } else {
        return Promise.resolve(this._bodyArrayBuffer)
      }
    } else if (support.blob) {
      return this.blob().then(readBlobAsArrayBuffer)
    } else {
      throw new Error('could not read as ArrayBuffer')
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal || (function () {
    if ('AbortController' in g) {
      var ctrl = new AbortController();
      return ctrl.signal;
    }
  }());
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        try {
          headers.append(key, value)
        } catch (error) {
          console.warn('Response ' + error.message)
        }
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  if (this.status < 200 || this.status > 599) {
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
  }
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 200, statusText: ''})
  response.status = 0
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = g.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      // This check if specifically for when a user fetches a file locally from the file system
      // Only if the status is out of a normal range
      if (request.url.startsWith('file://') && (xhr.status < 200 || xhr.status > 599)) {
        options.status = 200;
      } else {
        options.status = xhr.status;
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request timed out'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && g.location.href ? g.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
      var names = [];
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        names.push(normalizeName(name))
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
      request.headers.forEach(function(value, name) {
        if (names.indexOf(name) === -1) {
          xhr.setRequestHeader(name, value)
        }
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!g.fetch) {
  g.fetch = fetch
  g.Headers = Headers
  g.Request = Request
  g.Response = Response
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/mainmotionsync.ts");
/******/ 	
/******/ })()
;