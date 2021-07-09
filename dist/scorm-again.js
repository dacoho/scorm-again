(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

var _scorm12_cmi = require("./cmi/scorm12_cmi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * The AICC API class
 */
var AICC = /*#__PURE__*/function (_Scorm12API) {
  _inherits(AICC, _Scorm12API);

  var _super = _createSuper(AICC);

  /**
   * Constructor to create AICC API object
   * @param {object} settings
   */
  function AICC(settings) {
    var _this;

    _classCallCheck(this, AICC);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, finalSettings);
    _this.cmi = new _aicc_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV();
    return _this;
  }
  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {object}
   */


  _createClass(AICC, [{
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild = _get(_getPrototypeOf(AICC.prototype), "getChildElement", this).call(this, CMIElement, value, foundFirstIndex);

      if (!newChild) {
        if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d+')) {
          newChild = new _aicc_cmi.CMIEvaluationCommentsObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.tries\\.\\d+')) {
          newChild = new _aicc_cmi.CMITriesObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.attempt_records\\.\\d+')) {
          newChild = new _aicc_cmi.CMIAttemptRecordsObject();
        }
      }

      return newChild;
    }
    /**
     * Replace the whole API with another
     *
     * @param {AICC} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.nav = newAPI.nav;
    }
  }]);

  return AICC;
}(_Scorm12API2["default"]);

exports["default"] = AICC;

},{"./Scorm12API":4,"./cmi/aicc_cmi":6,"./cmi/scorm12_cmi":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./cmi/common");

var _exceptions = require("./exceptions");

var _error_codes2 = _interopRequireDefault(require("./constants/error_codes"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _utilities = require("./utilities");

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes2["default"].scorm12;
/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */

var _timeout = new WeakMap();

var _error_codes = new WeakMap();

var _settings = new WeakMap();

var BaseAPI = /*#__PURE__*/function () {
  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {object} error_codes
   * @param {object} settings
   */
  function BaseAPI(error_codes, settings) {
    _classCallCheck(this, BaseAPI);

    _timeout.set(this, {
      writable: true,
      value: void 0
    });

    _error_codes.set(this, {
      writable: true,
      value: void 0
    });

    _settings.set(this, {
      writable: true,
      value: {
        autocommit: false,
        autocommitSeconds: 10,
        asyncCommit: false,
        sendBeaconCommit: false,
        lmsCommitUrl: false,
        dataCommitFormat: 'json',
        // valid formats are 'json' or 'flattened', 'params'
        commitRequestDataType: 'application/json;charset=UTF-8',
        autoProgress: false,
        logLevel: global_constants.LOG_LEVEL_ERROR,
        selfReportSessionTime: false,
        alwaysSendTotalTime: false,
        responseHandler: function responseHandler(xhr) {
          var result;

          if (typeof xhr !== 'undefined') {
            result = JSON.parse(xhr.responseText);

            if (result === null || !{}.hasOwnProperty.call(result, 'result')) {
              result = {};

              if (xhr.status === 200) {
                result.result = global_constants.SCORM_TRUE;
                result.errorCode = 0;
              } else {
                result.result = global_constants.SCORM_FALSE;
                result.errorCode = 101;
              }
            }
          }

          return result;
        },
        requestHandler: function requestHandler(params) {
          return params;
        }
      }
    });

    _defineProperty(this, "cmi", void 0);

    _defineProperty(this, "startingData", void 0);

    if ((this instanceof BaseAPI ? this.constructor : void 0) === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }

    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastError = global_constants.NO_ERROR;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);

    this.settings = settings;
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;
  }
  /**
   * Initialize the API
   * @param {string} callbackName
   * @param {string} initializeMessage
   * @param {string} terminationMessage
   * @return {string}
   */


  _createClass(BaseAPI, [{
    key: "initialize",
    value: function initialize(callbackName, initializeMessage, terminationMessage) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.isInitialized()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).INITIALIZED, initializeMessage);
      } else if (this.isTerminated()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).TERMINATED, terminationMessage);
      } else {
        if (this.selfReportSessionTime) {
          this.cmi.setStartTime();
        }

        this.currentState = global_constants.STATE_INITIALIZED;
        this.lastError = global_constants.NO_ERROR;
        returnValue = global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Getter for #error_codes
     * @return {object}
     */

  }, {
    key: "error_codes",
    get: function get() {
      return _classPrivateFieldGet(this, _error_codes);
    }
    /**
     * Getter for #settings
     * @return {object}
     */

  }, {
    key: "settings",
    get: function get() {
      return _classPrivateFieldGet(this, _settings);
    }
    /**
     * Setter for #settings
     * @param {object} settings
     */
    ,
    set: function set(settings) {
      _classPrivateFieldSet(this, _settings, _objectSpread(_objectSpread({}, _classPrivateFieldGet(this, _settings)), settings));
    }
    /**
     * Terminates the current run of the API
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */

  }, {
    key: "terminate",
    value: function terminate(callbackName, checkTerminated) {
      var id = "".concat(Math.floor(Math.random() * 100)).concat(Date.now());
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        this.currentState = global_constants.STATE_TERMINATED;

        try {
          var result = this.storeData(callbackName, true, id);

          if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && typeof result.errorCode !== 'undefined' && result.errorCode > 0) {
            this.throwSCORMError(result.errorCode);
          }

          returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
          if (checkTerminated) this.lastError = global_constants.NO_ERROR;
          returnValue = global_constants.SCORM_TRUE;
          this.processListeners(callbackName);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastError = {
              errorCode: e.errorCode,
              errorMessage: e.message
            };
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }
      }

      this.apiLog(callbackName, id, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Get the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "getValue",
    value: function getValue(callbackName, checkTerminated, CMIElement) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).RETRIEVE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).RETRIEVE_AFTER_TERM)) {
        if (checkTerminated) this.lastError = global_constants.NO_ERROR;

        try {
          returnValue = this.getCMIValue(CMIElement);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastError = {
              errorCode: e.errorCode,
              errorMessage: e.message
            };
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement);
      }

      this.apiLog(callbackName, CMIElement, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Sets the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {string} commitCallback
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setValue",
    value: function setValue(callbackName, commitCallback, checkTerminated, CMIElement, value) {
      if (value !== undefined) {
        value = String(value);
      }

      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).STORE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).STORE_AFTER_TERM)) {
        if (checkTerminated) this.lastError = global_constants.NO_ERROR;

        try {
          returnValue = this.setCMIValue(CMIElement, value);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastError = {
              errorCode: e.errorCode,
              errorMessage: e.message
            };
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement, value);
      }

      if (returnValue === undefined) {
        returnValue = global_constants.SCORM_FALSE;
      } // If we didn't have any errors while setting the data, go ahead and
      // schedule a commit, if autocommit is turned on


      if (String(this.lastError.errorCode) === '0') {
        if (this.settings.autocommit && !_classPrivateFieldGet(this, _timeout)) {
          this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
        }
      }

      this.apiLog(callbackName, "".concat(CMIElement, " : ").concat(value), 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Orders LMS to store all content parameters
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */

  }, {
    key: "commit",
    value: function commit(callbackName, checkTerminated) {
      this.clearScheduledCommit();
      var id = "".concat(Math.floor(Math.random() * 100)).concat(Date.now());
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).COMMIT_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).COMMIT_AFTER_TERM)) {
        try {
          var result = this.storeData(callbackName, false, id);

          if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && result.errorCode && result.errorCode > 0) {
            this.throwSCORMError(result.errorCode);
          }

          returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
          if (checkTerminated) this.lastError = global_constants.NO_ERROR;
          this.processListeners(callbackName);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastError = {
              errorCode: e.errorCode,
              errorMessage: e.message
            };
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }
      }

      this.apiLog(callbackName, id, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Returns last error code
     * @param {string} callbackName
     * @return {string}
     */

  }, {
    key: "getLastError",
    value: function getLastError(callbackName) {
      var returnValue = String(this.lastError.errorCode);
      this.processListeners(callbackName);
      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getErrorString",
    value: function getErrorString(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getDiagnostic",
    value: function getDiagnostic(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Checks the LMS state and ensures it has been initialized.
     *
     * @param {boolean} checkTerminated
     * @param {number} beforeInitError
     * @param {number} afterTermError
     * @return {boolean}
     */

  }, {
    key: "checkState",
    value: function checkState(checkTerminated, beforeInitError, afterTermError) {
      if (this.isNotInitialized()) {
        this.throwSCORMError(beforeInitError);
        return false;
      } else if (checkTerminated && this.isTerminated()) {
        this.throwSCORMError(afterTermError);
        return false;
      }

      return true;
    }
    /**
     * Logging for all SCORM actions
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} logMessage
     * @param {number}messageLevel
     */

  }, {
    key: "apiLog",
    value: function apiLog(functionName, CMIElement, logMessage, messageLevel) {
      var commitData;

      if (_typeof(CMIElement) == 'object') {
        commitData = CMIElement;
        CMIElement = '';
      }

      logMessage = this.formatMessage(functionName, CMIElement, logMessage);

      if (messageLevel >= this.apiLogLevel) {
        switch (messageLevel) {
          case global_constants.LOG_LEVEL_ERROR:
            console.error(logMessage);
            break;

          case global_constants.LOG_LEVEL_WARNING:
            console.warn(logMessage);
            break;

          case global_constants.LOG_LEVEL_INFO:
            console.info(logMessage);
            break;

          case global_constants.LOG_LEVEL_DEBUG:
            if (console.debug) {
              console.debug(logMessage);
            } else {
              console.log(logMessage);
            }

            break;
        }
      }

      var logObject = {
        functionName: functionName,
        date: new Date().toISOString(),
        message: logMessage,
        commitData: commitData,
        error: "(".concat(this.lastError.errorMessage, ")")
      };
      this.processListeners('apiLog', CMIElement, logObject);
    }
    /**
     * Formats the SCORM messages for easy reading
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} message
     * @return {string}
     */

  }, {
    key: "formatMessage",
    value: function formatMessage(functionName, CMIElement, message) {
      CMIElement = CMIElement || '';
      var messageString = '';
      messageString += functionName;

      if (CMIElement) {
        messageString += ' : ';
      }

      var CMIElementBaseLength = 70;
      messageString += CMIElement;
      var fillChars = CMIElementBaseLength - messageString.length;

      for (var j = 0; j < fillChars; j++) {
        messageString += ' ';
      }

      if (message) {
        messageString += message;
      }

      return messageString;
    }
    /**
     * Checks to see if {str} contains {tester}
     *
     * @param {string} str String to check against
     * @param {string} tester String to check for
     * @return {boolean}
     */

  }, {
    key: "stringMatches",
    value: function stringMatches(str, tester) {
      return str && tester && str.match(tester);
    }
    /**
     * Check to see if the specific object has the given property
     * @param {*} refObject
     * @param {string} attribute
     * @return {boolean}
     * @private
     */

  }, {
    key: "_checkObjectHasProperty",
    value: function _checkObjectHasProperty(refObject, attribute) {
      return Object.hasOwnProperty.call(refObject, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(refObject), attribute) || attribute in refObject;
    }
    /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     *
     * @param {(string|number)} _errorNumber
     * @param {boolean} _detail
     * @return {string}
     * @abstract
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(_errorNumber, _detail) {
      throw new Error('The getLmsErrorMessageDetails method has not been implemented');
    }
    /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @return {string}
     * @abstract
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(_CMIElement) {
      throw new Error('The getCMIValue method has not been implemented');
    }
    /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @param {any} _value
     * @return {string}
     * @abstract
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(_CMIElement, _value) {
      throw new Error('The setCMIValue method has not been implemented');
    }
    /**
     * Shared API method to set a valid for a given element.
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "_commonSetCMIValue",
    value: function _commonSetCMIValue(methodName, scorm2004, CMIElement, value) {
      if (!CMIElement || CMIElement === '') {
        return global_constants.SCORM_FALSE;
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var returnValue = global_constants.SCORM_FALSE;
      var foundFirstIndex = false;
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        var attribute = structure[i];

        if (i === structure.length - 1) {
          if (scorm2004 && attribute.substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).READ_ONLY_ELEMENT);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          } else {
            if (this.isInitialized() && this.stringMatches(CMIElement, '\\.correct_responses\\.\\d+')) {
              this.validateCorrectResponse(CMIElement, value);
            }

            if (!scorm2004 || this.lastError.errorCode === 0) {
              refObject[attribute] = value;
              returnValue = global_constants.SCORM_TRUE;
            }
          }
        } else {
          refObject = refObject[attribute];

          if (!refObject) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            break;
          }

          if (refObject instanceof _common.CMIArray) {
            var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

            if (!isNaN(index)) {
              var item = refObject.childArray[index];

              if (item) {
                refObject = item;
                foundFirstIndex = true;
              } else {
                var newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
                foundFirstIndex = true;

                if (!newChild) {
                  this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                } else {
                  if (refObject.initialized) newChild.initialize();
                  refObject.childArray.push(newChild);
                  refObject = newChild;
                }
              } // Have to update i value to skip the array position


              i++;
            }
          }
        }
      }

      if (returnValue === global_constants.SCORM_FALSE) {
        this.apiLog(methodName, null, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), global_constants.LOG_LEVEL_WARNING);
      }

      return returnValue;
    }
    /**
     * Abstract method for validating that a response is correct.
     *
     * @param {string} _CMIElement
     * @param {*} _value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(_CMIElement, _value) {// just a stub method
    }
    /**
     * Gets or builds a new child element to add to the array.
     * APIs that inherit BaseAPI should override this method.
     *
     * @param {string} _CMIElement - unused
     * @param {*} _value - unused
     * @param {boolean} _foundFirstIndex - unused
     * @return {*}
     * @abstract
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(_CMIElement, _value, _foundFirstIndex) {
      throw new Error('The getChildElement method has not been implemented');
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "_commonGetCMIValue",
    value: function _commonGetCMIValue(methodName, scorm2004, CMIElement) {
      if (!CMIElement || CMIElement === '') {
        return '';
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var attribute = null;
      var uninitializedErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") has not been initialized.");
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        attribute = structure[i];

        if (!scorm2004) {
          if (i === structure.length - 1) {
            if (!this._checkObjectHasProperty(refObject, attribute)) {
              this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
              return;
            }
          }
        } else {
          if (String(attribute).substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            var target = String(attribute).substr(8, String(attribute).length - 9);
            return refObject._isTargetValid(target);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            return;
          }
        }

        refObject = refObject[attribute];

        if (refObject === undefined) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject instanceof _common.CMIArray) {
          var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

          if (!isNaN(index)) {
            var item = refObject.childArray[index];

            if (item) {
              refObject = item;
            } else {
              this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
              break;
            } // Have to update i value to skip the array position


            i++;
          }
        }
      }

      if (refObject === null || refObject === undefined) {
        if (!scorm2004) {
          if (attribute === '_children') {
            this.throwSCORMError(scorm12_error_codes.CHILDREN_ERROR);
          } else if (attribute === '_count') {
            this.throwSCORMError(scorm12_error_codes.COUNT_ERROR);
          }
        }
      } else {
        return refObject;
      }
    }
    /**
     * Returns true if the API's current state is STATE_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return this.currentState === global_constants.STATE_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isNotInitialized",
    value: function isNotInitialized() {
      return this.currentState === global_constants.STATE_NOT_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */

  }, {
    key: "isTerminated",
    value: function isTerminated() {
      return this.currentState === global_constants.STATE_TERMINATED;
    }
    /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param {string} listenerName
     * @param {function} callback
     */

  }, {
    key: "on",
    value: function on(listenerName, callback) {
      if (!callback) return;
      var listenerFunctions = listenerName.split(' ');

      for (var i = 0; i < listenerFunctions.length; i++) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return;
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        this.listenerArray.push({
          functionName: functionName,
          CMIElement: CMIElement,
          callback: callback
        }); // this.apiLog('on', functionName, `Added event listener: ${this.listenerArray.length}`, global_constants.LOG_LEVEL_INFO);
      }
    }
    /**
     * Provides a mechanism for detaching a specific SCORM event listener
     *
     * @param {string} listenerName
     * @param {function} callback
     */

  }, {
    key: "off",
    value: function off(listenerName, callback) {
      var _this = this;

      if (!callback) return;
      var listenerFunctions = listenerName.split(' ');

      var _loop = function _loop(i) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return {
          v: void 0
        };
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        var removeIndex = _this.listenerArray.findIndex(function (obj) {
          return obj.functionName === functionName && obj.CMIElement === CMIElement && obj.callback === callback;
        });

        if (removeIndex !== -1) {
          _this.listenerArray.splice(removeIndex, 1); // this.apiLog('off', functionName, `Removed event listener: ${this.listenerArray.length}`, global_constants.LOG_LEVEL_INFO);

        }
      };

      for (var i = 0; i < listenerFunctions.length; i++) {
        var _ret = _loop(i);

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
    /**
     * Provides a mechanism for clearing all listeners from a specific SCORM event
     *
     * @param {string} listenerName
     */

  }, {
    key: "clear",
    value: function clear(listenerName) {
      var _this2 = this;

      var listenerFunctions = listenerName.split(' ');

      var _loop2 = function _loop2(i) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return {
          v: void 0
        };
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        _this2.listenerArray = _this2.listenerArray.filter(function (obj) {
          return obj.functionName !== functionName && obj.CMIElement !== CMIElement;
        });
      };

      for (var i = 0; i < listenerFunctions.length; i++) {
        var _ret2 = _loop2(i);

        if (_typeof(_ret2) === "object") return _ret2.v;
      }
    }
    /**
     * Processes any 'on' listeners that have been created
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "processListeners",
    value: function processListeners(functionName, CMIElement, value) {
      for (var i = 0; i < this.listenerArray.length; i++) {
        var listener = this.listenerArray[i];
        var functionsMatch = listener.functionName === functionName;
        var listenerHasCMIElement = !!listener.CMIElement;
        var CMIElementsMatch = false;

        if (CMIElement && listener.CMIElement && listener.CMIElement.substring(listener.CMIElement.length - 1) === '*') {
          CMIElementsMatch = CMIElement.indexOf(listener.CMIElement.substring(0, listener.CMIElement.length - 1)) === 0;
        } else {
          CMIElementsMatch = listener.CMIElement === CMIElement;
        }

        if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
          listener.callback(CMIElement, value);
        }
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} errorNumber
     * @param {string} message
     */

  }, {
    key: "throwSCORMError",
    value: function throwSCORMError(errorNumber, message) {
      if (!message) {
        message = this.getLmsErrorMessageDetails(errorNumber);
      }

      this.apiLog('throwSCORMError', null, errorNumber + ': ' + message, global_constants.LOG_LEVEL_ERROR);
      this.lastError = {
        errorCode: errorNumber,
        errorMessage: message
      };
    }
    /**
     * Clears the last SCORM error code on success.
     *
     * @param {string} success
     */

  }, {
    key: "clearSCORMError",
    value: function clearSCORMError(success) {
      if (success !== undefined && success !== global_constants.SCORM_FALSE) {
        this.lastError = global_constants.NO_ERROR;
      }
    }
    /**
     * Attempts to store the data to the LMS, logs data if no LMS configured
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _calculateTotalTime
     * @return {string}
     * @abstract
     */

  }, {
    key: "storeData",
    value: function storeData(_calculateTotalTime) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Load the CMI from a flattened JSON object
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromFlattenedJSON",
    value: function loadFromFlattenedJSON(json, CMIElement) {
      var _this3 = this;

      if (!this.isNotInitialized()) {
        console.error('loadFromFlattenedJSON can only be called before the call to lmsInitialize.');
        return;
      }
      /**
       * Test match pattern.
       *
       * @param {string} a
       * @param {string} c
       * @param {RegExp} a_pattern
       * @return {number}
       */


      function testPattern(a, c, a_pattern) {
        var a_match = a.match(a_pattern);
        var c_match;

        if (a_match !== null && (c_match = c.match(a_pattern)) !== null) {
          var a_num = Number(a_match[2]);
          var c_num = Number(c_match[2]);

          if (a_num === c_num) {
            if (a_match[3] === 'id') {
              return -1;
            } else if (a_match[3] === 'type') {
              if (c_match[3] === 'id') {
                return 1;
              } else {
                return -1;
              }
            } else {
              return 1;
            }
          }

          return a_num - c_num;
        }

        return null;
      }

      var int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
      var obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
      var result = Object.keys(json).map(function (key) {
        return [String(key), json[key]];
      }); // CMI interactions need to have id and type loaded before any other fields

      result.sort(function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 2),
            a = _ref3[0],
            b = _ref3[1];

        var _ref4 = _slicedToArray(_ref2, 2),
            c = _ref4[0],
            d = _ref4[1];

        var test;

        if ((test = testPattern(a, c, int_pattern)) !== null) {
          return test;
        }

        if ((test = testPattern(a, c, obj_pattern)) !== null) {
          return test;
        }

        if (a < c) {
          return -1;
        }

        if (a > c) {
          return 1;
        }

        return 0;
      });
      var obj;
      result.forEach(function (element) {
        obj = {};
        obj[element[0]] = element[1];

        _this3.loadFromJSON((0, _utilities.unflatten)(obj), CMIElement);
      });
    }
    /**
     * Loads CMI data from a JSON object.
     *
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromJSON",
    value: function loadFromJSON(json, CMIElement) {
      if (!this.isNotInitialized()) {
        console.error('loadFromJSON can only be called before the call to lmsInitialize.');
        return;
      }

      CMIElement = CMIElement !== undefined ? CMIElement : 'cmi';
      this.startingData = json; // could this be refactored down to flatten(json) then setCMIValue on each?

      for (var key in json) {
        if ({}.hasOwnProperty.call(json, key) && json[key]) {
          var currentCMIElement = (CMIElement ? CMIElement + '.' : '') + key;
          var value = json[key];

          if (value['childArray']) {
            for (var i = 0; i < value['childArray'].length; i++) {
              this.loadFromJSON(value['childArray'][i], currentCMIElement + '.' + i);
            }
          } else if (value.constructor === Object) {
            this.loadFromJSON(value, currentCMIElement);
          } else {
            this.setCMIValue(currentCMIElement, value);
          }
        }
      }
    }
    /**
     * Render the CMI object to JSON for sending to an LMS.
     *
     * @return {string}
     */

  }, {
    key: "renderCMIToJSONString",
    value: function renderCMIToJSONString() {
      var cmi = this.cmi; // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);

      return JSON.stringify({
        cmi: cmi
      });
    }
    /**
     * Returns a JS object representing the current cmi
     * @return {object}
     */

  }, {
    key: "renderCMIToJSONObject",
    value: function renderCMIToJSONObject() {
      // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
      return JSON.parse(this.renderCMIToJSONString());
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _terminateCommit
     * @return {*}
     * @abstract
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(_terminateCommit) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Send the request to the LMS
     * @param {string} url
     * @param {object|Array} params
     * @param {boolean} immediate
     * @return {object}
     */

  }, {
    key: "processHttpRequest",
    value: function processHttpRequest(callbackName, url, params) {
      var _this4 = this;

      var immediate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var commitId = arguments.length > 4 ? arguments[4] : undefined;

      var process = function process(url, params, settings, error_codes) {
        params = settings.requestHandler(params);
        var genericError = {
          result: global_constants.SCORM_FALSE,
          errorCode: error_codes.GENERAL
        };
        var result;

        if (!settings.sendBeaconCommit) {
          try {
            var httpReq = new XMLHttpRequest();
            httpReq.open('POST', url, settings.asyncCommit);
            var stringParams;

            if (params instanceof Array) {
              stringParams = params.join('&');
              httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              httpReq.send(stringParams);
            } else {
              stringParams = JSON.stringify(params);
              httpReq.setRequestHeader('Content-Type', settings.commitRequestDataType);
              httpReq.send(stringParams);
            }

            if (!settings.asyncCommit) {
              var _result, _result2;

              if (typeof settings.responseHandler === 'function') {
                result = settings.responseHandler(httpReq);
              } else {
                result = JSON.parse(httpReq.responseText);
              }

              if ((_result = result) !== null && _result !== void 0 && _result.result) {
                _this4.lastError = global_constants.NO_ERROR;

                _this4.processListeners('commitSuccess');
              } else {
                _this4.lastError = {
                  errorCode: result.errorCode,
                  errorMessage: 'Network Request failed'
                };

                _this4.processListeners('commitError');
              }

              _this4.apiLog("".concat(callbackName, " Sync HttpRequest"), JSON.parse(stringParams), 'result: ' + ((_result2 = result) === null || _result2 === void 0 ? void 0 : _result2.result) || global_constants.SCORM_FALSE, global_constants.LOG_LEVEL_INFO);
            } else {
              httpReq.onload = function (e) {
                if (typeof settings.responseHandler === 'function') {
                  result = settings.responseHandler(httpReq);
                } else {
                  result = JSON.parse(httpReq.responseText);
                }

                if (result.result == true) {
                  _this4.lastError = global_constants.NO_ERROR;

                  _this4.processListeners('CommitSuccess');
                } else {
                  _this4.lastError = {
                    errorCode: result.errorCode,
                    errorMessage: 'Network Request failed'
                  };

                  _this4.processListeners('CommitError');
                }

                _this4.apiLog("".concat(callbackName, " Async HttpRequest"), JSON.parse(stringParams), 'result: ' + result.result, global_constants.LOG_LEVEL_INFO);
              };

              httpReq.onerror = function (e) {
                _this4.processListeners('CommitError');

                _this4.apiLog("".concat(callbackName, " Async HttpRequest"), stringParams, 'result: ' + global_constants.SCORM_FALSE, global_constants.LOG_LEVEL_INFO);
              };
            }
          } catch (e) {
            console.error(e);

            _this4.processListeners('CommitError');

            return genericError;
          }
        } else {
          try {
            var headers = {
              type: settings.commitRequestDataType
            };
            var blob;

            var _stringParams;

            if (params instanceof Array) {
              _stringParams = params.join('&');
              blob = new Blob([_stringParams], headers);
            } else {
              _stringParams = JSON.stringify(params);
              blob = new Blob([_stringParams], headers);
            }

            result = {};

            if (navigator.sendBeacon(url, blob)) {
              result.result = global_constants.SCORM_TRUE;
              result.errorCode = 0;

              _this4.processListeners('CommitSuccess');
            } else {
              result.result = global_constants.SCORM_FALSE;
              result.errorCode = 101;

              _this4.processListeners('CommitError');
            }

            _this4.apiLog("".concat(callbackName, " SendBeacon"), JSON.parse(_stringParams), 'result: ' + result.result, global_constants.LOG_LEVEL_INFO);
          } catch (e) {
            console.error(e);

            _this4.processListeners('CommitError');

            return genericError;
          }
        }

        return result;
      };

      if (typeof _lodash["default"] !== 'undefined') {
        var debounced = (0, _lodash["default"])(process, 500);
        debounced(url, params, this.settings, this.error_codes); // if we're terminating, go ahead and commit immediately

        if (immediate) {
          debounced.flush();
        }

        return {
          result: global_constants.SCORM_TRUE,
          errorCode: 0
        };
      } else {
        return process(url, params, this.settings, this.error_codes);
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} when - the number of milliseconds to wait before committing
     * @param {string} callback - the name of the commit event callback
     */

  }, {
    key: "scheduleCommit",
    value: function scheduleCommit(when, callback) {
      _classPrivateFieldSet(this, _timeout, new ScheduledCommit(this, when, callback));

      this.apiLog('scheduleCommit', '', 'scheduled', global_constants.LOG_LEVEL_DEBUG);
    }
    /**
     * Clears and cancels any currently scheduled commits
     */

  }, {
    key: "clearScheduledCommit",
    value: function clearScheduledCommit() {
      if (_classPrivateFieldGet(this, _timeout)) {
        _classPrivateFieldGet(this, _timeout).cancel();

        _classPrivateFieldSet(this, _timeout, null);

        this.apiLog('clearScheduledCommit', '', 'cleared', global_constants.LOG_LEVEL_DEBUG);
      }
    }
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _API = new WeakMap();

var _cancelled = new WeakMap();

var _timeout2 = new WeakMap();

var _callback = new WeakMap();

var ScheduledCommit = /*#__PURE__*/function () {
  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   * @param {string} callback
   */
  function ScheduledCommit(API, when, callback) {
    _classCallCheck(this, ScheduledCommit);

    _API.set(this, {
      writable: true,
      value: void 0
    });

    _cancelled.set(this, {
      writable: true,
      value: false
    });

    _timeout2.set(this, {
      writable: true,
      value: void 0
    });

    _callback.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _API, API);

    _classPrivateFieldSet(this, _timeout2, setTimeout(this.wrapper.bind(this), when));

    _classPrivateFieldSet(this, _callback, callback);
  }
  /**
   * Cancel any currently scheduled commit
   */


  _createClass(ScheduledCommit, [{
    key: "cancel",
    value: function cancel() {
      _classPrivateFieldSet(this, _cancelled, true);

      if (_classPrivateFieldGet(this, _timeout2)) {
        clearTimeout(_classPrivateFieldGet(this, _timeout2));
      }
    }
    /**
     * Wrap the API commit call to check if the call has already been cancelled
     */

  }, {
    key: "wrapper",
    value: function wrapper() {
      if (!_classPrivateFieldGet(this, _cancelled)) {
        _classPrivateFieldGet(this, _API).commit(_classPrivateFieldGet(this, _callback));
      }
    }
  }]);

  return ScheduledCommit;
}();

},{"./cmi/common":7,"./constants/api_constants":10,"./constants/error_codes":11,"./exceptions":15,"./utilities":17,"lodash.debounce":1}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm12_cmi = require("./cmi/scorm12_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var scorm12_constants = _api_constants["default"].scorm12;
var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * API class for SCORM 1.2
 */

var Scorm12API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm12API, _BaseAPI);

  var _super = _createSuper(Scorm12API);

  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  function Scorm12API(settings) {
    var _this;

    _classCallCheck(this, Scorm12API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm12_error_codes, finalSettings);
    _this.cmi = new _scorm12_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV(); // Rename functions to match 1.2 Spec and expose to modules

    _this.LMSInitialize = _this.lmsInitialize;
    _this.LMSFinish = _this.lmsFinish;
    _this.LMSGetValue = _this.lmsGetValue;
    _this.LMSSetValue = _this.lmsSetValue;
    _this.LMSCommit = _this.lmsCommit;
    _this.LMSGetLastError = _this.lmsGetLastError;
    _this.LMSGetErrorString = _this.lmsGetErrorString;
    _this.LMSGetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */


  _createClass(Scorm12API, [{
    key: "lmsInitialize",
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('LMSInitialize', 'LMS was already initialized!', 'LMS is already finished!');
    }
    /**
     * LMSFinish function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsFinish",
    value: function lmsFinish() {
      var result = this.terminate('LMSFinish', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.nav.event !== '') {
          if (this.nav.event === 'continue') {
            this.processListeners('SequenceNext');
          } else {
            this.processListeners('SequencePrevious');
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * LMSGetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('LMSGetValue', false, CMIElement);
    }
    /**
     * LMSSetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('LMSSetValue', 'LMSCommit', false, CMIElement, value);
    }
    /**
     * LMSCommit function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('LMSCommit', false);
    }
    /**
     * LMSGetLastError function from SCORM 1.2 Spec
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('LMSGetLastError');
    }
    /**
     * LMSGetErrorString function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('LMSGetErrorString', CMIErrorCode);
    }
    /**
     * LMSGetDiagnostic function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('getCMIValue', false, CMIElement);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {*} value
     * @param {boolean} foundFirstIndex
     * @return {object}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObject();
      }

      return newChild;
    }
    /**
     * Validates Correct Response values
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      return true;
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {*} errorNumber
     * @param {boolean }detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = 'No Error';
      var detailMessage = 'No Error'; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm12_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm12_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm12_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Replace the whole API with another
     *
     * @param {Scorm12API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
        cmiExport.cmi.core.session_time = this.cmi.getCurrentSessionTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(callbackName, terminateCommit, commitId) {
      if (terminateCommit) {
        var originalStatus = this.cmi.core.lesson_status;

        if (originalStatus === 'not attempted') {
          this.cmi.core.lesson_status = 'completed';
        }

        if (this.cmi.core.lesson_mode === 'normal') {
          if (this.cmi.core.credit === 'credit') {
            if (this.settings.mastery_override && this.cmi.student_data.mastery_score !== '' && this.cmi.core.score.raw !== '') {
              if (parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)) {
                this.cmi.core.lesson_status = 'passed';
              } else {
                this.cmi.core.lesson_status = 'failed';
              }
            }
          }
        } else if (this.cmi.core.lesson_mode === 'browse') {
          var _this$startingData, _this$startingData$cm, _this$startingData$cm2;

          if ((((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$cm = _this$startingData.cmi) === null || _this$startingData$cm === void 0 ? void 0 : (_this$startingData$cm2 = _this$startingData$cm.core) === null || _this$startingData$cm2 === void 0 ? void 0 : _this$startingData$cm2.lesson_status) || '') === '' && originalStatus === 'not attempted') {
            this.cmi.core.lesson_status = 'browsed';
          }
        }
      }

      var commitObject = this.renderCommitCMI(terminateCommit || this.settings.alwaysSendTotalTime);

      if (this.settings.lmsCommitUrl) {
        var response = this.processHttpRequest(callbackName, this.settings.lmsCommitUrl, commitObject, terminateCommit, commitId);
        return response;
      } else {
        console.log(callbackName, terminateCommit ? '(final)' : '', commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":3,"./cmi/scorm12_cmi":8,"./constants/api_constants":10,"./constants/error_codes":11,"./utilities":17}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm2004_cmi = require("./cmi/scorm2004_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

var _response_constants = _interopRequireDefault(require("./constants/response_constants"));

var _language_constants = _interopRequireDefault(require("./constants/language_constants"));

var _regex = _interopRequireDefault(require("./constants/regex"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var global_constants = _api_constants["default"].global;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var correct_responses = _response_constants["default"].correct;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * API class for SCORM 2004
 */

var _version = new WeakMap();

var Scorm2004API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm2004API, _BaseAPI);

  var _super = _createSuper(Scorm2004API);

  /**
   * Constructor for SCORM 2004 API
   * @param {object} settings
   */
  function Scorm2004API(settings) {
    var _this;

    _classCallCheck(this, Scorm2004API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm2004_error_codes, finalSettings);

    _version.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _defineProperty(_assertThisInitialized(_this), "checkDuplicatedPattern", function (correct_response, current_index, value) {
      var found = false;
      var count = correct_response._count;

      for (var i = 0; i < count && !found; i++) {
        if (i !== current_index && correct_response.childArray[i] === value) {
          found = true;
        }
      }

      return found;
    });

    _this.cmi = new _scorm2004_cmi.CMI();
    _this.adl = new _scorm2004_cmi.ADL(); // Rename functions to match 2004 Spec and expose to modules

    _this.Initialize = _this.lmsInitialize;
    _this.Terminate = _this.lmsTerminate;
    _this.GetValue = _this.lmsGetValue;
    _this.SetValue = _this.lmsSetValue;
    _this.Commit = _this.lmsCommit;
    _this.GetLastError = _this.lmsGetLastError;
    _this.GetErrorString = _this.lmsGetErrorString;
    _this.GetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * Getter for #version
   * @return {string}
   */


  _createClass(Scorm2004API, [{
    key: "version",
    get: function get() {
      return _classPrivateFieldGet(this, _version);
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsInitialize",
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('Initialize');
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsTerminate",
    value: function lmsTerminate() {
      var result = this.terminate('Terminate', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.adl.nav.request !== '_none_') {
          switch (this.adl.nav.request) {
            case 'continue':
              this.processListeners('SequenceNext');
              break;

            case 'previous':
              this.processListeners('SequencePrevious');
              break;

            case 'choice':
              this.processListeners('SequenceChoice');
              break;

            case 'exit':
              this.processListeners('SequenceExit');
              break;

            case 'exitAll':
              this.processListeners('SequenceExitAll');
              break;

            case 'abandon':
              this.processListeners('SequenceAbandon');
              break;

            case 'abandonAll':
              this.processListeners('SequenceAbandonAll');
              break;
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('GetValue', true, CMIElement);
    }
    /**
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('SetValue', 'Commit', true, CMIElement, value);
    }
    /**
     * Orders LMS to store all content parameters
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('Commit');
    }
    /**
     * Returns last error code
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('GetLastError');
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('GetErrorString', CMIErrorCode);
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('GetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('SetValue', true, CMIElement, value);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {any} value
     * @param {boolean} foundFirstIndex
     * @return {any}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        var parts = CMIElement.split('.');
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];

        if (this.isInitialized()) {
          if (!interaction.type) {
            this.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
          } else {
            this.checkDuplicateChoiceResponse(interaction, value);
            var response_type = correct_responses[interaction.type];

            if (response_type) {
              this.checkValidResponseType(response_type, value, interaction.type);
            } else {
              this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Incorrect Response Type: ' + interaction.type);
            }
          }
        }

        if (this.lastError.errorCode === 0) {
          newChild = new _scorm2004_cmi.CMIInteractionsCorrectResponsesObject();
        }
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_learner\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_lms\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject(true);
      }

      return newChild;
    }
    /**
     * Checks for valid response types
     * @param {object} response_type
     * @param {any} value
     * @param {string} interaction_type
     */

  }, {
    key: "checkValidResponseType",
    value: function checkValidResponseType(response_type, value, interaction_type) {
      var nodes = [];

      if (response_type !== null && response_type !== void 0 && response_type.delimiter) {
        nodes = String(value).split(response_type.delimiter);
      } else {
        nodes[0] = value;
      }

      if (nodes.length > 0 && nodes.length <= response_type.max) {
        this.checkCorrectResponseValue(interaction_type, nodes, value);
      } else if (nodes.length > response_type.max) {
        this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
      }
    }
    /**
     * Checks for duplicate 'choice' responses.
     * @param {CMIInteractionsObject} interaction
     * @param {any} value
     */

  }, {
    key: "checkDuplicateChoiceResponse",
    value: function checkDuplicateChoiceResponse(interaction, value) {
      var interaction_count = interaction.correct_responses._count;

      if (interaction.type === 'choice') {
        for (var i = 0; i < interaction_count && this.lastError.errorCode === 0; i++) {
          var response = interaction.correct_responses.childArray[i];

          if (response.pattern === value) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }
    }
    /**
     * Validate correct response.
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      var parts = CMIElement.split('.');
      var index = Number(parts[2]);
      var pattern_index = Number(parts[4]);
      var interaction = this.cmi.interactions.childArray[index];
      var interaction_count = interaction.correct_responses._count;
      this.checkDuplicateChoiceResponse(interaction, value);
      var response_type = correct_responses[interaction.type];

      if (typeof response_type.limit === 'undefined' || interaction_count <= response_type.limit) {
        this.checkValidResponseType(response_type, value, interaction.type);

        if (this.lastError.errorCode === 0 && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastError.errorCode === 0 && value === '') {// do nothing, we want the inverse
        } else {
          if (this.lastError.errorCode === 0) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Already Exists');
          }
        }
      } else {
        this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Collection Limit Reached');
      }
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('GetValue', true, CMIElement);
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {(string|number)} errorNumber
     * @param {boolean} detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = '';
      var detailMessage = ''; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm2004_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Check to see if a correct_response value has been duplicated
     * @param {CMIArray} correct_response
     * @param {number} current_index
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "checkCorrectResponseValue",
    value:
    /**
     * Checks for a valid correct_response value
     * @param {string} interaction_type
     * @param {Array} nodes
     * @param {*} value
     */
    function checkCorrectResponseValue(interaction_type, nodes, value) {
      var response = correct_responses[interaction_type];
      var formatRegex = new RegExp(response.format);

      for (var i = 0; i < nodes.length && this.lastError.errorCode === 0; i++) {
        if (interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
          nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
        }

        if (response !== null && response !== void 0 && response.delimiter2) {
          var values = nodes[i].split(response.delimiter2);

          if (values.length === 2) {
            var matches = values[0].match(formatRegex);

            if (!matches) {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            } else {
              if (!values[1].match(new RegExp(response.format2))) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          } else {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          }
        } else {
          var _matches = nodes[i].match(formatRegex);

          if (!_matches && value !== '' || !_matches && interaction_type === 'true-false') {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (interaction_type === 'numeric' && nodes.length > 1) {
              if (Number(nodes[0]) > Number(nodes[1])) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            } else {
              if (nodes[i] !== '' && response.unique) {
                for (var j = 0; j < i && this.lastError.errorCode === 0; j++) {
                  if (nodes[i] === nodes[j]) {
                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                  }
                }
              }
            }
          }
        }
      }
    }
    /**
     * Remove prefixes from correct_response
     * @param {string} node
     * @return {*}
     */

  }, {
    key: "removeCorrectResponsePrefixes",
    value: function removeCorrectResponsePrefixes(node) {
      var seenOrder = false;
      var seenCase = false;
      var seenLang = false;
      var prefixRegex = new RegExp('^({(lang|case_matters|order_matters)=([^}]+)})');
      var matches = node.match(prefixRegex);
      var langMatches = null;

      while (matches) {
        switch (matches[2]) {
          case 'lang':
            langMatches = node.match(scorm2004_regex.CMILangcr);

            if (langMatches) {
              var lang = langMatches[3];

              if (lang !== undefined && lang.length > 0) {
                if (_language_constants["default"][lang.toLowerCase()] === undefined) {
                  this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                }
              }
            }

            seenLang = true;
            break;

          case 'case_matters':
            if (!seenLang && !seenOrder && !seenCase) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenCase = true;
            break;

          case 'order_matters':
            if (!seenCase && !seenLang && !seenOrder) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenOrder = true;
            break;

          default:
            break;
        }

        node = node.substr(matches[1].length);
        matches = node.match(prefixRegex);
      }

      return node;
    }
    /**
     * Replace the whole API with another
     * @param {Scorm2004API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.adl = newAPI.adl;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
        cmiExport.cmi.session_time = this.cmi.getCurrentSessionTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(callbackName, terminateCommit, commitId) {
      var _this$startingData, _this$startingData$ad, _this$startingData$ad2;

      if (terminateCommit) {
        if (this.cmi.mode === 'normal') {
          if (this.cmi.credit === 'credit') {
            if (this.cmi.completion_threshold && this.cmi.progress_measure) {
              if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
                console.debug('Setting Completion Status: Completed');
                this.cmi.completion_status = 'completed';
              } else {
                console.debug('Setting Completion Status: Incomplete');
                this.cmi.completion_status = 'incomplete';
              }
            }

            if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
              if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
                console.debug('Setting Success Status: Passed');
                this.cmi.success_status = 'passed';
              } else {
                console.debug('Setting Success Status: Failed');
                this.cmi.success_status = 'failed';
              }
            }
          }
        }
      }

      var navRequest = false;

      if (this.adl.nav.request !== ((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$ad = _this$startingData.adl) === null || _this$startingData$ad === void 0 ? void 0 : (_this$startingData$ad2 = _this$startingData$ad.nav) === null || _this$startingData$ad2 === void 0 ? void 0 : _this$startingData$ad2.request) && this.adl.nav.request !== '_none_') {
        this.adl.nav.request = encodeURIComponent(this.adl.nav.request);
        navRequest = true;
      }

      var commitObject = this.renderCommitCMI(terminateCommit || this.settings.alwaysSendTotalTime);

      if (this.settings.lmsCommitUrl) {
        if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
          console.debug(callbackName, terminateCommit ? '(final)' : '', commitObject);
        }

        var result = this.processHttpRequest(callbackName, this.settings.lmsCommitUrl, commitObject, terminateCommit, commitId); // check if this is a sequencing call, and then call the necessary JS

        {
          if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
            Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
          }
        }
        return result;
      } else {
        console.log(callbackName, terminateCommit ? '(final)' : '', commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm2004API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm2004API;

},{"./BaseAPI":3,"./cmi/scorm2004_cmi":9,"./constants/api_constants":10,"./constants/error_codes":11,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":17}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMIAttemptRecordsObject = exports.CMIAttemptRecords = exports.CMITriesObject = exports.CMITries = exports.CMIPathsObject = exports.CMIPaths = exports.CMIStudentDemographics = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var aicc_constants = _api_constants["default"].aicc;
var scorm12_constants = _api_constants["default"].scorm12;
var aicc_regex = _regex["default"].aicc;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * CMI Class for AICC
 */

var CMI = /*#__PURE__*/function (_Scorm12CMI$CMI) {
  _inherits(CMI, _Scorm12CMI$CMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this, aicc_constants.cmi_children);
    if (initialized) _this.initialize();
    _this.student_preference = new AICCStudentPreferences();
    _this.student_data = new AICCCMIStudentData();
    _this.student_demographics = new CMIStudentDemographics();
    _this.evaluation = new CMIEvaluation();
    _this.paths = new CMIPaths();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$student_prefere, _this$student_data, _this$student_demogra, _this$evaluation, _this$paths;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_demogra = this.student_demographics) === null || _this$student_demogra === void 0 ? void 0 : _this$student_demogra.initialize();
      (_this$evaluation = this.evaluation) === null || _this$evaluation === void 0 ? void 0 : _this$evaluation.initialize();
      (_this$paths = this.paths) === null || _this$paths === void 0 ? void 0 : _this$paths.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions,
     *      paths: CMIPaths
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'suspend_data': this.suspend_data,
        'launch_data': this.launch_data,
        'comments': this.comments,
        'comments_from_lms': this.comments_from_lms,
        'core': this.core,
        'objectives': this.objectives,
        'student_data': this.student_data,
        'student_preference': this.student_preference,
        'student_demographics': this.student_demographics,
        'interactions': this.interactions,
        'evaluation': this.evaluation,
        'paths': this.paths
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMI;
}(Scorm12CMI.CMI);
/**
 * AICC Evaluation object
 */


exports.CMI = CMI;

var CMIEvaluation = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIEvaluation, _BaseCMI);

  var _super2 = _createSuper(CMIEvaluation);

  /**
   * Constructor for AICC Evaluation object
   */
  function CMIEvaluation() {
    var _this2;

    _classCallCheck(this, CMIEvaluation);

    _this2 = _super2.call(this);
    _this2.comments = new CMIEvaluationComments();
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIEvaluation, [{
    key: "initialize",
    value: function initialize() {
      var _this$comments;

      _get(_getPrototypeOf(CMIEvaluation.prototype), "initialize", this).call(this);

      (_this$comments = this.comments) === null || _this$comments === void 0 ? void 0 : _this$comments.initialize();
    }
    /**
     * toJSON for cmi.evaluation object
     * @return {{comments: CMIEvaluationComments}}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments': this.comments
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIEvaluation;
}(_common.BaseCMI);
/**
 * Class representing AICC's cmi.evaluation.comments object
 */


var CMIEvaluationComments = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIEvaluationComments, _CMIArray);

  var _super3 = _createSuper(CMIEvaluationComments);

  /**
   * Constructor for AICC Evaluation Comments object
   */
  function CMIEvaluationComments() {
    _classCallCheck(this, CMIEvaluationComments);

    return _super3.call(this, {
      children: aicc_constants.comments_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage
    });
  }

  return CMIEvaluationComments;
}(_common.CMIArray);
/**
 * StudentPreferences class for AICC
 */


var _lesson_type = new WeakMap();

var _text_color = new WeakMap();

var _text_location = new WeakMap();

var _text_size = new WeakMap();

var _video = new WeakMap();

var AICCStudentPreferences = /*#__PURE__*/function (_Scorm12CMI$CMIStuden) {
  _inherits(AICCStudentPreferences, _Scorm12CMI$CMIStuden);

  var _super4 = _createSuper(AICCStudentPreferences);

  /**
   * Constructor for AICC Student Preferences object
   */
  function AICCStudentPreferences() {
    var _this3;

    _classCallCheck(this, AICCStudentPreferences);

    _this3 = _super4.call(this, aicc_constants.student_preference_children);

    _lesson_type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_color.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_location.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_size.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _video.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.windows = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      children: ''
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCStudentPreferences, [{
    key: "initialize",
    value: function initialize() {
      var _this$windows;

      _get(_getPrototypeOf(AICCStudentPreferences.prototype), "initialize", this).call(this);

      (_this$windows = this.windows) === null || _this$windows === void 0 ? void 0 : _this$windows.initialize();
    }
  }, {
    key: "lesson_type",
    get:
    /**
     * Getter for #lesson_type
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _lesson_type);
    }
    /**
     * Setter for #lesson_type
     * @param {string} lesson_type
     */
    ,
    set: function set(lesson_type) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_type, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _lesson_type, lesson_type);
      }
    }
    /**
     * Getter for #text_color
     * @return {string}
     */

  }, {
    key: "text_color",
    get: function get() {
      return _classPrivateFieldGet(this, _text_color);
    }
    /**
     * Setter for #text_color
     * @param {string} text_color
     */
    ,
    set: function set(text_color) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_color, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_color, text_color);
      }
    }
    /**
     * Getter for #text_location
     * @return {string}
     */

  }, {
    key: "text_location",
    get: function get() {
      return _classPrivateFieldGet(this, _text_location);
    }
    /**
     * Setter for #text_location
     * @param {string} text_location
     */
    ,
    set: function set(text_location) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_location, text_location);
      }
    }
    /**
     * Getter for #text_size
     * @return {string}
     */

  }, {
    key: "text_size",
    get: function get() {
      return _classPrivateFieldGet(this, _text_size);
    }
    /**
     * Setter for #text_size
     * @param {string} text_size
     */
    ,
    set: function set(text_size) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_size, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_size, text_size);
      }
    }
    /**
     * Getter for #video
     * @return {string}
     */

  }, {
    key: "video",
    get: function get() {
      return _classPrivateFieldGet(this, _video);
    }
    /**
     * Setter for #video
     * @param {string} video
     */
    ,
    set: function set(video) {
      if ((0, Scorm12CMI.check12ValidFormat)(video, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _video, video);
      }
    }
    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio': this.audio,
        'language': this.language,
        'lesson_type': this.lesson_type,
        'speed': this.speed,
        'text': this.text,
        'text_color': this.text_color,
        'text_location': this.text_location,
        'text_size': this.text_size,
        'video': this.video,
        'windows': this.windows
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return AICCStudentPreferences;
}(Scorm12CMI.CMIStudentPreference);
/**
 * StudentData class for AICC
 */


var _tries_during_lesson = new WeakMap();

var AICCCMIStudentData = /*#__PURE__*/function (_Scorm12CMI$CMIStuden2) {
  _inherits(AICCCMIStudentData, _Scorm12CMI$CMIStuden2);

  var _super5 = _createSuper(AICCCMIStudentData);

  /**
   * Constructor for AICC StudentData object
   */
  function AICCCMIStudentData() {
    var _this4;

    _classCallCheck(this, AICCCMIStudentData);

    _this4 = _super5.call(this, aicc_constants.student_data_children);

    _tries_during_lesson.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.tries = new CMITries();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCCMIStudentData, [{
    key: "initialize",
    value: function initialize() {
      var _this$tries;

      _get(_getPrototypeOf(AICCCMIStudentData.prototype), "initialize", this).call(this);

      (_this$tries = this.tries) === null || _this$tries === void 0 ? void 0 : _this$tries.initialize();
    }
  }, {
    key: "tries_during_lesson",
    get:
    /**
     * Getter for tries_during_lesson
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _tries_during_lesson);
    }
    /**
     * Setter for #tries_during_lesson. Sets an error if trying to set after
     *  initialization.
     * @param {string} tries_during_lesson
     */
    ,
    set: function set(tries_during_lesson) {
      !this.initialized ? _classPrivateFieldSet(this, _tries_during_lesson, tries_during_lesson) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * toJSON for cmi.student_data object
     * @return {
     *    {
     *      mastery_score: string,
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      tries: CMITries
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'mastery_score': this.mastery_score,
        'max_time_allowed': this.max_time_allowed,
        'time_limit_action': this.time_limit_action,
        'tries': this.tries
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return AICCCMIStudentData;
}(Scorm12CMI.CMIStudentData);
/**
 * Class representing the AICC cmi.student_demographics object
 */


var _children = new WeakMap();

var _city = new WeakMap();

var _class = new WeakMap();

var _company = new WeakMap();

var _country = new WeakMap();

var _experience = new WeakMap();

var _familiar_name = new WeakMap();

var _instructor_name = new WeakMap();

var _title = new WeakMap();

var _native_language = new WeakMap();

var _state = new WeakMap();

var _street_address = new WeakMap();

var _telephone = new WeakMap();

var _years_experience = new WeakMap();

var CMIStudentDemographics = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIStudentDemographics, _BaseCMI2);

  var _super6 = _createSuper(CMIStudentDemographics);

  /**
   * Constructor for AICC StudentDemographics object
   */
  function CMIStudentDemographics() {
    var _this5;

    _classCallCheck(this, CMIStudentDemographics);

    _this5 = _super6.call(this);

    _children.set(_assertThisInitialized(_this5), {
      writable: true,
      value: aicc_constants.student_demographics_children
    });

    _city.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _class.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _company.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _country.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _familiar_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _instructor_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _title.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _native_language.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _state.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _street_address.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _telephone.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _years_experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }

  _createClass(CMIStudentDemographics, [{
    key: "city",
    get:
    /**
     * Getter for city
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _city);
    }
    /**
     * Setter for #city. Sets an error if trying to set after
     *  initialization.
     * @param {string} city
     */
    ,
    set: function set(city) {
      !this.initialized ? _classPrivateFieldSet(this, _city, city) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for class
     * @return {string}
     */

  }, {
    key: "class",
    get: function get() {
      return _classPrivateFieldGet(this, _class);
    }
    /**
     * Setter for #class. Sets an error if trying to set after
     *  initialization.
     * @param {string} clazz
     */
    ,
    set: function set(clazz) {
      !this.initialized ? _classPrivateFieldSet(this, _class, clazz) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for company
     * @return {string}
     */

  }, {
    key: "company",
    get: function get() {
      return _classPrivateFieldGet(this, _company);
    }
    /**
     * Setter for #company. Sets an error if trying to set after
     *  initialization.
     * @param {string} company
     */
    ,
    set: function set(company) {
      !this.initialized ? _classPrivateFieldSet(this, _company, company) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for country
     * @return {string}
     */

  }, {
    key: "country",
    get: function get() {
      return _classPrivateFieldGet(this, _country);
    }
    /**
     * Setter for #country. Sets an error if trying to set after
     *  initialization.
     * @param {string} country
     */
    ,
    set: function set(country) {
      !this.initialized ? _classPrivateFieldSet(this, _country, country) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for experience
     * @return {string}
     */

  }, {
    key: "experience",
    get: function get() {
      return _classPrivateFieldGet(this, _experience);
    }
    /**
     * Setter for #experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} experience
     */
    ,
    set: function set(experience) {
      !this.initialized ? _classPrivateFieldSet(this, _experience, experience) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for familiar_name
     * @return {string}
     */

  }, {
    key: "familiar_name",
    get: function get() {
      return _classPrivateFieldGet(this, _familiar_name);
    }
    /**
     * Setter for #familiar_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} familiar_name
     */
    ,
    set: function set(familiar_name) {
      !this.initialized ? _classPrivateFieldSet(this, _familiar_name, familiar_name) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for instructor_name
     * @return {string}
     */

  }, {
    key: "instructor_name",
    get: function get() {
      return _classPrivateFieldGet(this, _instructor_name);
    }
    /**
     * Setter for #instructor_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} instructor_name
     */
    ,
    set: function set(instructor_name) {
      !this.initialized ? _classPrivateFieldSet(this, _instructor_name, instructor_name) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for title
     * @return {string}
     */

  }, {
    key: "title",
    get: function get() {
      return _classPrivateFieldGet(this, _title);
    }
    /**
     * Setter for #title. Sets an error if trying to set after
     *  initialization.
     * @param {string} title
     */
    ,
    set: function set(title) {
      !this.initialized ? _classPrivateFieldSet(this, _title, title) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for native_language
     * @return {string}
     */

  }, {
    key: "native_language",
    get: function get() {
      return _classPrivateFieldGet(this, _native_language);
    }
    /**
     * Setter for #native_language. Sets an error if trying to set after
     *  initialization.
     * @param {string} native_language
     */
    ,
    set: function set(native_language) {
      !this.initialized ? _classPrivateFieldSet(this, _native_language, native_language) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for state
     * @return {string}
     */

  }, {
    key: "state",
    get: function get() {
      return _classPrivateFieldGet(this, _state);
    }
    /**
     * Setter for #state. Sets an error if trying to set after
     *  initialization.
     * @param {string} state
     */
    ,
    set: function set(state) {
      !this.initialized ? _classPrivateFieldSet(this, _state, state) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for street_address
     * @return {string}
     */

  }, {
    key: "street_address",
    get: function get() {
      return _classPrivateFieldGet(this, _street_address);
    }
    /**
     * Setter for #street_address. Sets an error if trying to set after
     *  initialization.
     * @param {string} street_address
     */
    ,
    set: function set(street_address) {
      !this.initialized ? _classPrivateFieldSet(this, _street_address, street_address) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for telephone
     * @return {string}
     */

  }, {
    key: "telephone",
    get: function get() {
      return _classPrivateFieldGet(this, _telephone);
    }
    /**
     * Setter for #telephone. Sets an error if trying to set after
     *  initialization.
     * @param {string} telephone
     */
    ,
    set: function set(telephone) {
      !this.initialized ? _classPrivateFieldSet(this, _telephone, telephone) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for years_experience
     * @return {string}
     */

  }, {
    key: "years_experience",
    get: function get() {
      return _classPrivateFieldGet(this, _years_experience);
    }
    /**
     * Setter for #years_experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} years_experience
     */
    ,
    set: function set(years_experience) {
      !this.initialized ? _classPrivateFieldSet(this, _years_experience, years_experience) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * toJSON for cmi.student_demographics object
     * @return {
     *      {
     *        city: string,
     *        class: string,
     *        company: string,
     *        country: string,
     *        experience: string,
     *        familiar_name: string,
     *        instructor_name: string,
     *        title: string,
     *        native_language: string,
     *        state: string,
     *        street_address: string,
     *        telephone: string,
     *        years_experience: string
     *      }
     *    }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'city': this.city,
        'class': this["class"],
        'company': this.company,
        'country': this.country,
        'experience': this.experience,
        'familiar_name': this.familiar_name,
        'instructor_name': this.instructor_name,
        'title': this.title,
        'native_language': this.native_language,
        'state': this.state,
        'street_address': this.street_address,
        'telephone': this.telephone,
        'years_experience': this.years_experience
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentDemographics;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.paths object
 */


exports.CMIStudentDemographics = CMIStudentDemographics;

var CMIPaths = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIPaths, _CMIArray2);

  var _super7 = _createSuper(CMIPaths);

  /**
   * Constructor for inline Paths Array class
   */
  function CMIPaths() {
    _classCallCheck(this, CMIPaths);

    return _super7.call(this, {
      children: aicc_constants.paths_children
    });
  }

  return CMIPaths;
}(_common.CMIArray);
/**
 * Class for AICC Paths
 */


exports.CMIPaths = CMIPaths;

var _location_id = new WeakMap();

var _date = new WeakMap();

var _time = new WeakMap();

var _status = new WeakMap();

var _why_left = new WeakMap();

var _time_in_element = new WeakMap();

var CMIPathsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIPathsObject, _BaseCMI3);

  var _super8 = _createSuper(CMIPathsObject);

  /**
   * Constructor for AICC Paths objects
   */
  function CMIPathsObject() {
    var _this6;

    _classCallCheck(this, CMIPathsObject);

    _this6 = _super8.call(this);

    _location_id.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _date.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _why_left.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time_in_element.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    return _this6;
  }

  _createClass(CMIPathsObject, [{
    key: "location_id",
    get:
    /**
     * Getter for #location_id
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _location_id);
    }
    /**
     * Setter for #location_id
     * @param {string} location_id
     */
    ,
    set: function set(location_id) {
      if ((0, Scorm12CMI.check12ValidFormat)(location_id, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location_id, location_id);
      }
    }
    /**
     * Getter for #date
     * @return {string}
     */

  }, {
    key: "date",
    get: function get() {
      return _classPrivateFieldGet(this, _date);
    }
    /**
     * Setter for #date
     * @param {string} date
     */
    ,
    set: function set(date) {
      if ((0, Scorm12CMI.check12ValidFormat)(date, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _date, date);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #status
     * @return {string}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
    /**
     * Getter for #why_left
     * @return {string}
     */

  }, {
    key: "why_left",
    get: function get() {
      return _classPrivateFieldGet(this, _why_left);
    }
    /**
     * Setter for #why_left
     * @param {string} why_left
     */
    ,
    set: function set(why_left) {
      if ((0, Scorm12CMI.check12ValidFormat)(why_left, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _why_left, why_left);
      }
    }
    /**
     * Getter for #time_in_element
     * @return {string}
     */

  }, {
    key: "time_in_element",
    get: function get() {
      return _classPrivateFieldGet(this, _time_in_element);
    }
    /**
     * Setter for #time_in_element
     * @param {string} time_in_element
     */
    ,
    set: function set(time_in_element) {
      if ((0, Scorm12CMI.check12ValidFormat)(time_in_element, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time_in_element, time_in_element);
      }
    }
    /**
     * toJSON for cmi.paths.n object
     * @return {
     *    {
     *      location_id: string,
     *      date: string,
     *      time: string,
     *      status: string,
     *      why_left: string,
     *      time_in_element: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'location_id': this.location_id,
        'date': this.date,
        'time': this.time,
        'status': this.status,
        'why_left': this.why_left,
        'time_in_element': this.time_in_element
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIPathsObject;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.student_data.tries object
 */


exports.CMIPathsObject = CMIPathsObject;

var CMITries = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMITries, _CMIArray3);

  var _super9 = _createSuper(CMITries);

  /**
   * Constructor for inline Tries Array class
   */
  function CMITries() {
    _classCallCheck(this, CMITries);

    return _super9.call(this, {
      children: aicc_constants.tries_children
    });
  }

  return CMITries;
}(_common.CMIArray);
/**
 * Class for AICC Tries
 */


exports.CMITries = CMITries;

var _status2 = new WeakMap();

var _time2 = new WeakMap();

var CMITriesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMITriesObject, _BaseCMI4);

  var _super10 = _createSuper(CMITriesObject);

  /**
   * Constructor for AICC Tries object
   */
  function CMITriesObject() {
    var _this7;

    _classCallCheck(this, CMITriesObject);

    _this7 = _super10.call(this);

    _status2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _time2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _this7.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidErrorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidTypeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      invalidRangeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage
    });
    return _this7;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMITriesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMITriesObject.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "status",
    get:
    /**
     * Getter for #status
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _status2);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status2, status);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time2);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time2, time);
      }
    }
    /**
     * toJSON for cmi.student_data.tries.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'status': this.status,
        'time': this.time,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMITriesObject;
}(_common.BaseCMI);
/**
 * Class for cmi.student_data.attempt_records array
 */


exports.CMITriesObject = CMITriesObject;

var CMIAttemptRecords = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMIAttemptRecords, _CMIArray4);

  var _super11 = _createSuper(CMIAttemptRecords);

  /**
   * Constructor for inline Tries Array class
   */
  function CMIAttemptRecords() {
    _classCallCheck(this, CMIAttemptRecords);

    return _super11.call(this, {
      children: aicc_constants.attempt_records_children
    });
  }

  return CMIAttemptRecords;
}(_common.CMIArray);
/**
 * Class for AICC Attempt Records
 */


exports.CMIAttemptRecords = CMIAttemptRecords;

var _lesson_status = new WeakMap();

var CMIAttemptRecordsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIAttemptRecordsObject, _BaseCMI5);

  var _super12 = _createSuper(CMIAttemptRecordsObject);

  /**
   * Constructor for AICC Attempt Records object
   */
  function CMIAttemptRecordsObject() {
    var _this8;

    _classCallCheck(this, CMIAttemptRecordsObject);

    _this8 = _super12.call(this);

    _lesson_status.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    _this8.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidErrorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidTypeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      invalidRangeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage
    });
    return _this8;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIAttemptRecordsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIAttemptRecordsObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
  }, {
    key: "lesson_status",
    get:
    /**
     * Getter for #lesson_status
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
      }
    }
    /**
     * toJSON for cmi.student_data.attempt_records.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'lesson_status': this.lesson_status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIAttemptRecordsObject;
}(_common.BaseCMI);
/**
 * Class for AICC Evaluation Comments
 */


exports.CMIAttemptRecordsObject = CMIAttemptRecordsObject;

var _content = new WeakMap();

var _location = new WeakMap();

var _time3 = new WeakMap();

var CMIEvaluationCommentsObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIEvaluationCommentsObject, _BaseCMI6);

  var _super13 = _createSuper(CMIEvaluationCommentsObject);

  /**
   * Constructor for Evaluation Comments
   */
  function CMIEvaluationCommentsObject() {
    var _this9;

    _classCallCheck(this, CMIEvaluationCommentsObject);

    _this9 = _super13.call(this);

    _content.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _time3.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(CMIEvaluationCommentsObject, [{
    key: "content",
    get:
    /**
     * Getter for #content
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _content);
    }
    /**
     * Setter for #content
     * @param {string} content
     */
    ,
    set: function set(content) {
      if ((0, Scorm12CMI.check12ValidFormat)(content, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _content, content);
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if ((0, Scorm12CMI.check12ValidFormat)(location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time3);
    }
    /**
     * Setting for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time3, time);
      }
    }
    /**
     * toJSON for cmi.evaulation.comments.n object
     * @return {
     *    {
     *      content: string,
     *      location: string,
     *      time: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'content': this.content,
        'location': this.location,
        'time': this.time
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIEvaluationCommentsObject;
}(_common.BaseCMI);

exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"./common":7,"./scorm12_cmi":8}],7:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;
exports.CMIArray = exports.CMIScore = exports.BaseCMI = void 0;

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _exceptions = require("../exceptions");

var _regex = _interopRequireDefault(require("../constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {string} errorMessage
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */

function checkValidFormat(value, regexPattern, errorCode, errorMessage, allowEmptyString) {
  var formatRegex = new RegExp(regexPattern);
  var matches = value.match(formatRegex);

  if (allowEmptyString && value === '') {
    return true;
  }

  if (value === undefined || !matches || matches[0] === '') {
    throw new _exceptions.ValidationError(errorCode, errorMessage);
  }

  return true;
}
/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {string} errorMessage
 * @return {boolean}
 */


function checkValidRange(value, rangePattern, errorCode, errorMessage) {
  var ranges = rangePattern.split('#');
  value = value * 1.0;

  if (value >= ranges[0]) {
    if (ranges[1] === '*' || value <= ranges[1]) {
      return true;
    } else {
      throw new _exceptions.ValidationError(errorCode, errorMessage);
    }
  } else {
    throw new _exceptions.ValidationError(errorCode, errorMessage);
  }
}
/**
 * Base class for API cmi objects
 */


var _initialized = new WeakMap();

var _start_time = new WeakMap();

var BaseCMI = /*#__PURE__*/function () {
  /**
   * Constructor for BaseCMI, just marks the class as abstract
   */
  function BaseCMI() {
    _classCallCheck(this, BaseCMI);

    _defineProperty(this, "jsonString", false);

    _initialized.set(this, {
      writable: true,
      value: false
    });

    _start_time.set(this, {
      writable: true,
      value: void 0
    });

    if ((this instanceof BaseCMI ? this.constructor : void 0) === BaseCMI) {
      throw new TypeError('Cannot construct BaseCMI instances directly');
    }
  }
  /**
   * Getter for #initialized
   * @return {boolean}
   */


  _createClass(BaseCMI, [{
    key: "initialized",
    get: function get() {
      return _classPrivateFieldGet(this, _initialized);
    }
    /**
     * Getter for #start_time
     * @return {Number}
     */

  }, {
    key: "start_time",
    get: function get() {
      return _classPrivateFieldGet(this, _start_time);
    }
    /**
     * Called when the API has been initialized after the CMI has been created
     */

  }, {
    key: "initialize",
    value: function initialize() {
      _classPrivateFieldSet(this, _initialized, true);
    }
    /**
     * Called when the player should override the 'session_time' provided by
     * the module
     */

  }, {
    key: "setStartTime",
    value: function setStartTime() {
      _classPrivateFieldSet(this, _start_time, new Date().getTime());
    }
  }]);

  return BaseCMI;
}();
/**
 * Base class for cmi *.score objects
 */


exports.BaseCMI = BaseCMI;

var _children2 = new WeakMap();

var _score_range = new WeakMap();

var _invalid_error_code = new WeakMap();

var _invalid_error_message = new WeakMap();

var _invalid_type_code = new WeakMap();

var _invalid_type_message = new WeakMap();

var _invalid_range_code = new WeakMap();

var _invalid_range_message = new WeakMap();

var _decimal_regex = new WeakMap();

var _raw = new WeakMap();

var _min = new WeakMap();

var _max = new WeakMap();

var CMIScore = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIScore, _BaseCMI);

  var _super = _createSuper(CMIScore);

  /**
   * Constructor for *.score
   * @param {string} score_children
   * @param {string} score_range
   * @param {string} max
   * @param {number} invalidErrorCode
   * @param {string} invalidErrorMessage
   * @param {number} invalidTypeCode
   * @param {string} invalidTypeMessage
   * @param {number} invalidRangeCode
   * @param {string} invalidRangeMessage
   * @param {string} decimalRegex
   */
  function CMIScore(_ref) {
    var _this;

    var score_children = _ref.score_children,
        score_range = _ref.score_range,
        max = _ref.max,
        invalidErrorCode = _ref.invalidErrorCode,
        invalidErrorMessage = _ref.invalidErrorMessage,
        invalidTypeCode = _ref.invalidTypeCode,
        invalidTypeMessage = _ref.invalidTypeMessage,
        invalidRangeCode = _ref.invalidRangeCode,
        invalidRangeMessage = _ref.invalidRangeMessage,
        decimalRegex = _ref.decimalRegex;

    _classCallCheck(this, CMIScore);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _score_range.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_error_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_error_message.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_type_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_type_message.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_range_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_range_message.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _decimal_regex.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _raw.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _min.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, score_children || scorm12_constants.score_children);

    _classPrivateFieldSet(_assertThisInitialized(_this), _score_range, !score_range ? false : scorm12_regex.score_range);

    _classPrivateFieldSet(_assertThisInitialized(_this), _max, max || max === '' ? max : '100');

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_code, invalidErrorCode || scorm12_error_codes.INVALID_SET_VALUE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_message, invalidErrorMessage || scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_code, invalidTypeCode || scorm12_error_codes.TYPE_MISMATCH);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_message, invalidTypeMessage || scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_code, invalidRangeCode || scorm12_error_codes.VALUE_OUT_OF_RANGE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_message, invalidRangeMessage || scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage);

    _classPrivateFieldSet(_assertThisInitialized(_this), _decimal_regex, decimalRegex || scorm12_regex.CMIDecimal);

    return _this;
  }

  _createClass(CMIScore, [{
    key: "_children",
    get:
    /**
     * Getter for _children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _invalid_error_code), _classPrivateFieldGet(this, _invalid_error_message));
    }
    /**
     * Getter for #raw
     * @return {string}
     */

  }, {
    key: "raw",
    get: function get() {
      return _classPrivateFieldGet(this, _raw);
    }
    /**
     * Setter for #raw
     * @param {string} raw
     */
    ,
    set: function set(raw) {
      if (checkValidFormat(raw, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _invalid_type_message)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(raw, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _invalid_range_message)))) {
        _classPrivateFieldSet(this, _raw, raw);
      }
    }
    /**
     * Getter for #min
     * @return {string}
     */

  }, {
    key: "min",
    get: function get() {
      return _classPrivateFieldGet(this, _min);
    }
    /**
     * Setter for #min
     * @param {string} min
     */
    ,
    set: function set(min) {
      if (checkValidFormat(min, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _invalid_type_message)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(min, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _invalid_range_message)))) {
        _classPrivateFieldSet(this, _min, min);
      }
    }
    /**
     * Getter for #max
     * @return {string}
     */

  }, {
    key: "max",
    get: function get() {
      return _classPrivateFieldGet(this, _max);
    }
    /**
     * Setter for #max
     * @param {string} max
     */
    ,
    set: function set(max) {
      if (checkValidFormat(max, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _invalid_type_message)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(max, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _invalid_range_message)))) {
        _classPrivateFieldSet(this, _max, max);
      }
    }
    /**
     * toJSON for *.score
     * @return {{min: string, max: string, raw: string}}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'raw': this.raw,
        'min': this.min,
        'max': this.max
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIScore;
}(BaseCMI);
/**
 * Base class for cmi *.n objects
 */


exports.CMIScore = CMIScore;

var _errorCode = new WeakMap();

var _errorMessage = new WeakMap();

var _children3 = new WeakMap();

var CMIArray = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIArray, _BaseCMI2);

  var _super2 = _createSuper(CMIArray);

  /**
   * Constructor cmi *.n arrays
   * @param {string} children
   * @param {number} errorCode
   * @param {string} errorMessage
   */
  function CMIArray(_ref2) {
    var _this2;

    var children = _ref2.children,
        errorCode = _ref2.errorCode,
        errorMessage = _ref2.errorMessage;

    _classCallCheck(this, CMIArray);

    _this2 = _super2.call(this);

    _errorCode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _errorMessage.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this2), _children3, children);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorCode, errorCode);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorMessage, errorMessage);

    _this2.childArray = [];
    return _this2;
  }

  _createClass(CMIArray, [{
    key: "_children",
    get:
    /**
     * Getter for _children
     * @return {*}
     */
    function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode), _classPrivateFieldGet(this, _errorMessage));
    }
    /**
     * Getter for _count
     * @return {number}
     */

  }, {
    key: "_count",
    get: function get() {
      return this.childArray.length;
    }
    /**
     * Setter for _count. Just throws an error.
     * @param {number} _count
     */
    ,
    set: function set(_count) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode), _classPrivateFieldGet(this, _errorMessage));
    }
    /**
     * toJSON for *.n arrays
     * @return {object}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {};

      for (var i = 0; i < this.childArray.length; i++) {
        result[i + ''] = this.childArray[i];
      }

      delete this.jsonString;
      return result;
    }
  }]);

  return CMIArray;
}(BaseCMI);

exports.CMIArray = CMIArray;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwReadOnlyError = throwReadOnlyError;
exports.throwWriteOnlyError = throwWriteOnlyError;
exports.check12ValidFormat = check12ValidFormat;
exports.check12ValidRange = check12ValidRange;
exports.NAV = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMIStudentPreference = exports.CMIStudentData = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _exceptions = require("../exceptions");

var Utilities = _interopRequireWildcard(require("../utilities"));

var Util = Utilities;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT, scorm12_constants.error_descriptions[scorm12_error_codes.READ_ONLY_ELEMENT].detailMessage);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT, scorm12_constants.error_descriptions[scorm12_error_codes.WRITE_ONLY_ELEMENT].detailMessage);
}
/**
 * Helper method for throwing Invalid Set error
 */


function throwInvalidValueError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.INVALID_SET_VALUE, scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm12_error_codes.TYPE_MISMATCH, scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern, allowEmptyString) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm12_error_codes.VALUE_OUT_OF_RANGE, scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage, allowEmptyString);
}
/**
 * Class representing the cmi object for SCORM 1.2
 */


var _children2 = new WeakMap();

var _version2 = new WeakMap();

var _launch_data = new WeakMap();

var _comments = new WeakMap();

var _comments_from_lms = new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  function CMI(cmi_children, student_data, initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '3.4'
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments_from_lms.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _defineProperty(_assertThisInitialized(_this), "student_data", null);

    if (initialized) _this.initialize();

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, cmi_children ? cmi_children : scorm12_constants.cmi_children);

    _this.core = new CMICore();
    _this.objectives = new CMIObjectives();
    _this.student_data = student_data ? student_data : new CMIStudentData();
    _this.student_preference = new CMIStudentPreference();
    _this.interactions = new CMIInteractions();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$core, _this$objectives, _this$student_data, _this$student_prefere, _this$interactions;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$core = this.core) === null || _this$core === void 0 ? void 0 : _this$core.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        suspend_data: this.suspend_data,
        launch_data: this.launch_data,
        comments: this.comments,
        comments_from_lms: this.comments_from_lms,
        core: this.core,
        objectives: this.objectives,
        student_data: this.student_data,
        student_preference: this.student_preference,
        interactions: this.interactions
      };
      delete this.jsonString;
      return result;
    }
    /**
     * Getter for #_version
     * @return {string}
     */

  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     */
    ,
    set: function set(_version) {
      throwInvalidValueError();
    }
    /**
     * Getter for #_children
     * @return {string}
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      var _this$core2;

      return (_this$core2 = this.core) === null || _this$core2 === void 0 ? void 0 : _this$core2.suspend_data;
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (this.core) {
        this.core.suspend_data = suspend_data;
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #comments
     * @return {string}
     */

  }, {
    key: "comments",
    get: function get() {
      return _classPrivateFieldGet(this, _comments);
    }
    /**
     * Setter for #comments
     * @param {string} comments
     */
    ,
    set: function set(comments) {
      if (check12ValidFormat(comments, scorm12_regex.CMIString4096, true)) {
        _classPrivateFieldSet(this, _comments, comments);
      }
    }
    /**
     * Getter for #comments_from_lms
     * @return {string}
     */

  }, {
    key: "comments_from_lms",
    get: function get() {
      return _classPrivateFieldGet(this, _comments_from_lms);
    }
    /**
     * Setter for #comments_from_lms. Can only be called before  initialization.
     * @param {string} comments_from_lms
     */
    ,
    set: function set(comments_from_lms) {
      !this.initialized ? _classPrivateFieldSet(this, _comments_from_lms, comments_from_lms) : throwReadOnlyError();
    }
    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      return this.core.getCurrentTotalTime(this.start_time);
    }
    /**
     * Get the current session time generated by the lms.
     *
     * @return {string}
     */

  }, {
    key: "getCurrentSessionTime",
    value: function getCurrentSessionTime() {
      return this.core.getCurrentSessionTime(this.start_time);
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _student_id = new WeakMap();

var _student_name = new WeakMap();

var _lesson_location = new WeakMap();

var _credit = new WeakMap();

var _lesson_status = new WeakMap();

var _entry = new WeakMap();

var _total_time = new WeakMap();

var _lesson_mode = new WeakMap();

var _exit = new WeakMap();

var _session_time = new WeakMap();

var _suspend_data = new WeakMap();

var CMICore = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMICore, _BaseCMI2);

  var _super2 = _createSuper(CMICore);

  /**
   * Constructor for cmi.core
   */
  function CMICore() {
    var _this2;

    _classCallCheck(this, CMICore);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm12_constants.core_children
    });

    _student_id.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _student_name.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_location.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_status.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'not attempted'
    });

    _entry.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _total_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_mode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'normal'
    });

    _exit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '00:00:00'
    });

    _suspend_data.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _this2.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidErrorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidTypeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      invalidRangeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage
    });
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMICore, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMICore.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "_children",
    get:
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #student_id
     * @return {string}
     */

  }, {
    key: "student_id",
    get: function get() {
      return _classPrivateFieldGet(this, _student_id);
    }
    /**
     * Setter for #student_id. Can only be called before  initialization.
     * @param {string} student_id
     */
    ,
    set: function set(student_id) {
      !this.initialized ? _classPrivateFieldSet(this, _student_id, student_id) : throwReadOnlyError();
    }
    /**
     * Getter for #student_name
     * @return {string}
     */

  }, {
    key: "student_name",
    get: function get() {
      return _classPrivateFieldGet(this, _student_name);
    }
    /**
     * Setter for #student_name. Can only be called before  initialization.
     * @param {string} student_name
     */
    ,
    set: function set(student_name) {
      !this.initialized ? _classPrivateFieldSet(this, _student_name, student_name) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_location
     * @return {string}
     */

  }, {
    key: "lesson_location",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_location);
    }
    /**
     * Setter for #lesson_location
     * @param {string} lesson_location
     */
    ,
    set: function set(lesson_location) {
      if (check12ValidFormat(lesson_location, scorm12_regex.CMIString256, true)) {
        _classPrivateFieldSet(this, _lesson_location, lesson_location);
      }
    }
    /**
     * Getter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_status
     * @return {string}
     */

  }, {
    key: "lesson_status",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if (this.initialized) {
        if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
          _classPrivateFieldSet(this, _lesson_status, lesson_status);
        }
      } else {
        if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus2)) {
          _classPrivateFieldSet(this, _lesson_status, lesson_status);
        }
      }
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_mode
     * @return {string}
     */

  }, {
    key: "lesson_mode",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_mode);
    }
    /**
     * Setter for #lesson_mode. Can only be called before  initialization.
     * @param {string} lesson_mode
     */
    ,
    set: function set(lesson_mode) {
      !this.initialized ? _classPrivateFieldSet(this, _lesson_mode, lesson_mode) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Setter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
    /**
     * Adds the current session time to the existing total time.
     * @param {Number} start_time
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime(start_time) {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
      }

      return Utilities.addHHMMSSTimeStrings(_classPrivateFieldGet(this, _total_time), sessionTime, new RegExp(scorm12_regex.CMITimespan));
    }
    /**
     * Set the current session time.
     * @param {Number} start_time
     * @return {string}
     */

  }, {
    key: "getCurrentSessionTime",
    value: function getCurrentSessionTime(start_time) {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
      }

      return sessionTime;
    }
    /**
     * toJSON for cmi.core
     *
     * @return {
     *    {
     *      student_name: string,
     *      entry: string,
     *      exit: string,
     *      score: CMIScore,
     *      student_id: string,
     *      lesson_mode: string,
     *      lesson_location: string,
     *      lesson_status: string,
     *      credit: string,
     *      session_time: *
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        student_id: this.student_id,
        student_name: this.student_name,
        lesson_location: this.lesson_location,
        credit: this.credit,
        lesson_status: this.lesson_status,
        entry: this.entry,
        lesson_mode: this.lesson_mode,
        exit: this.exit,
        session_time: this.session_time,
        score: this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMICore;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives object
 * @extends CMIArray
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIObjectives, _CMIArray);

  var _super3 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super3.call(this, {
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */


var _children4 = new WeakMap();

var _mastery_score = new WeakMap();

var _max_time_allowed = new WeakMap();

var _time_limit_action = new WeakMap();

var CMIStudentData = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIStudentData, _BaseCMI3);

  var _super4 = _createSuper(CMIStudentData);

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  function CMIStudentData(student_data_children) {
    var _this3;

    _classCallCheck(this, CMIStudentData);

    _this3 = _super4.call(this);

    _children4.set(_assertThisInitialized(_this3), {
      writable: true,
      value: void 0
    });

    _mastery_score.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this3), _children4, student_data_children ? student_data_children : scorm12_constants.student_data_children);

    return _this3;
  }
  /**
   * Getter for #_children
   * @return {*}
   * @private
   */


  _createClass(CMIStudentData, [{
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children4);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #master_score
     * @return {string}
     */

  }, {
    key: "mastery_score",
    get: function get() {
      return _classPrivateFieldGet(this, _mastery_score);
    }
    /**
     * Setter for #master_score. Can only be called before  initialization.
     * @param {string} mastery_score
     */
    ,
    set: function set(mastery_score) {
      !this.initialized ? _classPrivateFieldSet(this, _mastery_score, mastery_score) : throwReadOnlyError();
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
    /**
     * toJSON for cmi.student_data
     *
     * @return {
     *    {
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      mastery_score: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        mastery_score: this.mastery_score,
        max_time_allowed: this.max_time_allowed,
        time_limit_action: this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentData;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.student_preference object
 * @extends BaseCMI
 */


exports.CMIStudentData = CMIStudentData;

var _children5 = new WeakMap();

var _audio = new WeakMap();

var _language = new WeakMap();

var _speed = new WeakMap();

var _text = new WeakMap();

var CMIStudentPreference = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIStudentPreference, _BaseCMI4);

  var _super5 = _createSuper(CMIStudentPreference);

  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  function CMIStudentPreference(student_preference_children) {
    var _this4;

    _classCallCheck(this, CMIStudentPreference);

    _this4 = _super5.call(this);

    _children5.set(_assertThisInitialized(_this4), {
      writable: true,
      value: void 0
    });

    _audio.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _language.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _speed.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _text.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this4), _children5, student_preference_children ? student_preference_children : scorm12_constants.student_preference_children);

    return _this4;
  }

  _createClass(CMIStudentPreference, [{
    key: "_children",
    get:
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children5);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #audio
     * @return {string}
     */

  }, {
    key: "audio",
    get: function get() {
      return _classPrivateFieldGet(this, _audio);
    }
    /**
     * Setter for #audio
     * @param {string} audio
     */
    ,
    set: function set(audio) {
      if (check12ValidFormat(audio, scorm12_regex.CMISInteger) && check12ValidRange(audio, scorm12_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio, audio);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #speed
     * @return {string}
     */

  }, {
    key: "speed",
    get: function get() {
      return _classPrivateFieldGet(this, _speed);
    }
    /**
     * Setter for #speed
     * @param {string} speed
     */
    ,
    set: function set(speed) {
      if (check12ValidFormat(speed, scorm12_regex.CMISInteger) && check12ValidRange(speed, scorm12_regex.speed_range)) {
        _classPrivateFieldSet(this, _speed, speed);
      }
    }
    /**
     * Getter for #text
     * @return {string}
     */

  }, {
    key: "text",
    get: function get() {
      return _classPrivateFieldGet(this, _text);
    }
    /**
     * Setter for #text
     * @param {string} text
     */
    ,
    set: function set(text) {
      if (check12ValidFormat(text, scorm12_regex.CMISInteger) && check12ValidRange(text, scorm12_regex.text_range)) {
        _classPrivateFieldSet(this, _text, text);
      }
    }
    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        audio: this.audio,
        language: this.language,
        speed: this.speed,
        text: this.text
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions object
 * @extends BaseCMI
 */


exports.CMIStudentPreference = CMIStudentPreference;

var CMIInteractions = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIInteractions, _CMIArray2);

  var _super6 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.interactions
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super6.call(this, {
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */


var _id = new WeakMap();

var _time = new WeakMap();

var _type = new WeakMap();

var _weighting = new WeakMap();

var _student_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIInteractionsObject, _BaseCMI5);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interactions.n object
   */
  function CMIInteractionsObject() {
    var _this5;

    _classCallCheck(this, CMIInteractionsObject);

    _this5 = _super7.call(this);

    _id.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _student_response.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _this5.objectives = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      children: scorm12_constants.objectives_children
    });
    _this5.correct_responses = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      children: scorm12_constants.correct_responses_children
    });
    return _this5;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
  }, {
    key: "id",
    get:
    /**
     * Getter for #id. Should only be called during JSON export.
     * @return {*}
     */
    function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (check12ValidFormat(time, scorm12_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #type. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "type",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (check12ValidFormat(type, scorm12_regex.CMIType)) {
        _classPrivateFieldSet(this, _type, type);
      }
    }
    /**
     * Getter for #weighting. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "weighting",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (check12ValidFormat(weighting, scorm12_regex.CMIDecimal) && check12ValidRange(weighting, scorm12_regex.weighting_range)) {
        _classPrivateFieldSet(this, _weighting, weighting);
      }
    }
    /**
     * Getter for #student_response. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "student_response",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _student_response);
    }
    /**
     * Setter for #student_response
     * @param {string} student_response
     */
    ,
    set: function set(student_response) {
      if (check12ValidFormat(student_response, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _student_response, student_response);
      }
    }
    /**
     * Getter for #result. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "result",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check12ValidFormat(result, scorm12_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "latency",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (check12ValidFormat(latency, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _latency, latency);
      }
    }
    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      time: string,
     *      type: string,
     *      weighting: string,
     *      student_response: string,
     *      result: string,
     *      latency: string,
     *      objectives: CMIArray,
     *      correct_responses: CMIArray
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        id: this.id,
        time: this.time,
        type: this.type,
        weighting: this.weighting,
        student_response: this.student_response,
        result: this.result,
        latency: this.latency,
        objectives: this.objectives,
        correct_responses: this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _status = new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIObjectivesObject, _BaseCMI6);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this6;

    _classCallCheck(this, CMIObjectivesObject);

    _this6 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _this6.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidErrorMessage: scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidTypeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      invalidRangeMessage: scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage
    });
    return _this6;
  }

  _createClass(CMIObjectivesObject, [{
    key: "id",
    get:
    /**
     * Getter for #id
     * @return {""}
     */
    function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #status
     * @return {""}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
    /**
     * toJSON for cmi.objectives.n
     * @return {
     *    {
     *      id: string,
     *      status: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        id: this.id,
        status: this.status,
        score: this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 * @extends BaseCMI
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _id3 = new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI7);

  var _super9 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super9.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }

  _createClass(CMIInteractionsObjectivesObject, [{
    key: "id",
    get:
    /**
     * Getter for #id
     * @return {""}
     */
    function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        id: this.id
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI8);

  var _super10 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super10.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }

  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "pattern",
    get:
    /**
     * Getter for #pattern
     * @return {string}
     */
    function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check12ValidFormat(pattern, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
    /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        pattern: this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class for AICC Navigation object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var _event = new WeakMap();

var NAV = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(NAV, _BaseCMI9);

  var _super11 = _createSuper(NAV);

  /**
   * Constructor for NAV object
   */
  function NAV() {
    var _this9;

    _classCallCheck(this, NAV);

    _this9 = _super11.call(this);

    _event.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(NAV, [{
    key: "event",
    get:
    /**
     * Getter for #event
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _event);
    }
    /**
     * Setter for #event
     * @param {string} event
     */
    ,
    set: function set(event) {
      if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
    /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        event: this.event
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15,"../utilities":17,"./common":7}],9:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADL = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMICommentsObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _response_constants = _interopRequireDefault(require("../constants/response_constants"));

var _exceptions = require("../exceptions");

var Util = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var learner_responses = _response_constants["default"].learner;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT, scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT, scorm2004_constants.error_descriptions[scorm2004_error_codes.WRITE_ONLY_ELEMENT].detailMessage);
}
/**
 * Helper method for throwing Type Mismatch error
 */


function throwTypeMismatchError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.TYPE_MISMATCH, scorm2004_constants.error_descriptions[scorm2004_error_codes.TYPE_MISMATCH].detailMessage);
}
/**
 * Helper method for throwing Dependency Not Established error
 */


function throwDependencyNotEstablishedError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED, scorm2004_constants.error_descriptions[scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED].detailMessage);
}
/**
 * Helper method for throwing Dependency Not Established error
 */


function throwGeneralSetError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE, scorm2004_constants.error_descriptions[scorm2004_error_codes.GENERAL_SET_FAILURE].detailMessage);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm2004_error_codes.TYPE_MISMATCH, scorm2004_constants.error_descriptions[scorm2004_error_codes.TYPE_MISMATCH].detailMessage, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check2004ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm2004_error_codes.VALUE_OUT_OF_RANGE, scorm2004_constants.error_descriptions[scorm2004_error_codes.VALUE_OUT_OF_RANGE].detailMessage);
}
/**
 * Class representing cmi object for SCORM 2004
 */


var _version2 = new WeakMap();

var _children2 = new WeakMap();

var _completion_status = new WeakMap();

var _completion_threshold = new WeakMap();

var _credit = new WeakMap();

var _entry = new WeakMap();

var _exit = new WeakMap();

var _launch_data = new WeakMap();

var _learner_id = new WeakMap();

var _learner_name = new WeakMap();

var _location = new WeakMap();

var _max_time_allowed = new WeakMap();

var _mode = new WeakMap();

var _progress_measure = new WeakMap();

var _scaled_passing_score = new WeakMap();

var _session_time = new WeakMap();

var _success_status = new WeakMap();

var _suspend_data = new WeakMap();

var _time_limit_action = new WeakMap();

var _total_time = new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '1.0'
    });

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: scorm2004_constants.cmi_children
    });

    _completion_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _completion_threshold.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'credit'
    });

    _entry.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _exit.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_id.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_name.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _mode.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'normal'
    });

    _progress_measure.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _scaled_passing_score.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'PT0H0M0S'
    });

    _success_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _suspend_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'continue,no message'
    });

    _total_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _this.learner_preference = new CMILearnerPreference();
    _this.score = new Scorm2004CMIScore();
    _this.comments_from_learner = new CMICommentsFromLearner();
    _this.comments_from_lms = new CMICommentsFromLMS();
    _this.interactions = new CMIInteractions();
    _this.objectives = new CMIObjectives();
    if (initialized) _this.initialize();
    return _this;
  }

  _createClass(CMI, [{
    key: "initialize",
    value:
    /**
     * Called when the API has been initialized after the CMI has been created
     */
    function initialize() {
      var _this$learner_prefere, _this$score, _this$comments_from_l, _this$comments_from_l2, _this$interactions, _this$objectives;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$learner_prefere = this.learner_preference) === null || _this$learner_prefere === void 0 ? void 0 : _this$learner_prefere.initialize();
      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
      (_this$comments_from_l = this.comments_from_learner) === null || _this$comments_from_l === void 0 ? void 0 : _this$comments_from_l.initialize();
      (_this$comments_from_l2 = this.comments_from_lms) === null || _this$comments_from_l2 === void 0 ? void 0 : _this$comments_from_l2.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
    }
    /**
     * Getter for #_version
     * @return {string}
     * @private
     */

  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     * @private
     */
    ,
    set: function set(_version) {
      throwReadOnlyError();
    }
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {number} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        _classPrivateFieldSet(this, _completion_status, completion_status);
      }
    }
    /**
     * Getter for #completion_threshold
     * @return {string}
     */

  }, {
    key: "completion_threshold",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_threshold);
    }
    /**
     * Setter for #completion_threshold. Can only be called before  initialization.
     * @param {string} completion_threshold
     */
    ,
    set: function set(completion_threshold) {
      !this.initialized ? _classPrivateFieldSet(this, _completion_threshold, completion_threshold) : throwReadOnlyError();
    }
    /**
     * Setter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Getter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check2004ValidFormat(exit, scorm2004_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_id
     * @return {string}
     */

  }, {
    key: "learner_id",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_id);
    }
    /**
     * Setter for #learner_id. Can only be called before  initialization.
     * @param {string} learner_id
     */
    ,
    set: function set(learner_id) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_id, learner_id) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_name
     * @return {string}
     */

  }, {
    key: "learner_name",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_name);
    }
    /**
     * Setter for #learner_name. Can only be called before  initialization.
     * @param {string} learner_name
     */
    ,
    set: function set(learner_name) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_name, learner_name) : throwReadOnlyError();
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString1000)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #mode
     * @return {string}
     */

  }, {
    key: "mode",
    get: function get() {
      return _classPrivateFieldGet(this, _mode);
    }
    /**
     * Setter for #mode. Can only be called before  initialization.
     * @param {string} mode
     */
    ,
    set: function set(mode) {
      !this.initialized ? _classPrivateFieldSet(this, _mode, mode) : throwReadOnlyError();
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
        _classPrivateFieldSet(this, _progress_measure, progress_measure);
      }
    }
    /**
     * Getter for #scaled_passing_score
     * @return {string}
     */

  }, {
    key: "scaled_passing_score",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled_passing_score);
    }
    /**
     * Setter for #scaled_passing_score. Can only be called before  initialization.
     * @param {string} scaled_passing_score
     */
    ,
    set: function set(scaled_passing_score) {
      !this.initialized ? _classPrivateFieldSet(this, _scaled_passing_score, scaled_passing_score) : throwReadOnlyError();
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check2004ValidFormat(session_time, scorm2004_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        _classPrivateFieldSet(this, _success_status, success_status);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check2004ValidFormat(suspend_data, scorm2004_regex.CMIString64000, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string} ISO8601 Duration
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = this.start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
      }

      return Util.addTwoDurations(_classPrivateFieldGet(this, _total_time), sessionTime, scorm2004_regex.CMITimespan);
    }
    /**
     * get session_time.
     *
     * @return {string} ISO8601 Duration
     */

  }, {
    key: "getCurrentSessionTime",
    value: function getCurrentSessionTime() {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = this.start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
      }

      return sessionTime;
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      comments_from_learner: CMICommentsFromLearner,
     *      comments_from_lms: CMICommentsFromLMS,
     *      completion_status: string,
     *      completion_threshold: string,
     *      credit: string,
     *      entry: string,
     *      exit: string,
     *      interactions: CMIInteractions,
     *      launch_data: string,
     *      learner_id: string,
     *      learner_name: string,
     *      learner_preference: CMILearnerPreference,
     *      location: string,
     *      max_time_allowed: string,
     *      mode: string,
     *      objectives: CMIObjectives,
     *      progress_measure: string,
     *      scaled_passing_score: string,
     *      score: Scorm2004CMIScore,
     *      session_time: string,
     *      success_status: string,
     *      suspend_data: string,
     *      time_limit_action: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments_from_learner': this.comments_from_learner,
        'comments_from_lms': this.comments_from_lms,
        'completion_status': this.completion_status,
        'completion_threshold': this.completion_threshold,
        'credit': this.credit,
        'entry': this.entry,
        'exit': this.exit,
        'interactions': this.interactions,
        'launch_data': this.launch_data,
        'learner_id': this.learner_id,
        'learner_name': this.learner_name,
        'learner_preference': this.learner_preference,
        'location': this.location,
        'max_time_allowed': this.max_time_allowed,
        'mode': this.mode,
        'objectives': this.objectives,
        'progress_measure': this.progress_measure,
        'scaled_passing_score': this.scaled_passing_score,
        'score': this.score,
        'session_time': this.session_time,
        'success_status': this.success_status,
        'suspend_data': this.suspend_data,
        'time_limit_action': this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.learner_preference object
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _audio_level = new WeakMap();

var _language = new WeakMap();

var _delivery_speed = new WeakMap();

var _audio_captioning = new WeakMap();

var CMILearnerPreference = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMILearnerPreference, _BaseCMI2);

  var _super2 = _createSuper(CMILearnerPreference);

  /**
   * Constructor for cmi.learner_preference
   */
  function CMILearnerPreference() {
    var _this2;

    _classCallCheck(this, CMILearnerPreference);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm2004_constants.student_preference_children
    });

    _audio_level.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _language.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _delivery_speed.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _audio_captioning.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '0'
    });

    return _this2;
  }
  /**
   * Getter for #_children
   * @return {string}
   * @private
   */


  _createClass(CMILearnerPreference, [{
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #audio_level
     * @return {string}
     */

  }, {
    key: "audio_level",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_level);
    }
    /**
     * Setter for #audio_level
     * @param {string} audio_level
     */
    ,
    set: function set(audio_level) {
      if (check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) && check2004ValidRange(audio_level, scorm2004_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio_level, audio_level);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #delivery_speed
     * @return {string}
     */

  }, {
    key: "delivery_speed",
    get: function get() {
      return _classPrivateFieldGet(this, _delivery_speed);
    }
    /**
     * Setter for #delivery_speed
     * @param {string} delivery_speed
     */
    ,
    set: function set(delivery_speed) {
      if (check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) && check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)) {
        _classPrivateFieldSet(this, _delivery_speed, delivery_speed);
      }
    }
    /**
     * Getter for #audio_captioning
     * @return {string}
     */

  }, {
    key: "audio_captioning",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_captioning);
    }
    /**
     * Setter for #audio_captioning
     * @param {string} audio_captioning
     */
    ,
    set: function set(audio_captioning) {
      if (check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) && check2004ValidRange(audio_captioning, scorm2004_regex.text_range)) {
        _classPrivateFieldSet(this, _audio_captioning, audio_captioning);
      }
    }
    /**
     * toJSON for cmi.learner_preference
     *
     * @return {
     *    {
     *      audio_level: string,
     *      language: string,
     *      delivery_speed: string,
     *      audio_captioning: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio_level': this.audio_level,
        'language': this.language,
        'delivery_speed': this.delivery_speed,
        'audio_captioning': this.audio_captioning
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMILearnerPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions object
 */


var CMIInteractions = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIInteractions, _CMIArray);

  var _super3 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super3.call(this, {
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.objectives object
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIObjectives, _CMIArray2);

  var _super4 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super4.call(this, {
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */


var CMICommentsFromLMS = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMICommentsFromLMS, _CMIArray3);

  var _super5 = _createSuper(CMICommentsFromLMS);

  /**
   * Constructor for cmi.comments_from_lms Array
   */
  function CMICommentsFromLMS() {
    _classCallCheck(this, CMICommentsFromLMS);

    return _super5.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage
    });
  }

  return CMICommentsFromLMS;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */


var CMICommentsFromLearner = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMICommentsFromLearner, _CMIArray4);

  var _super6 = _createSuper(CMICommentsFromLearner);

  /**
   * Constructor for cmi.comments_from_learner Array
   */
  function CMICommentsFromLearner() {
    _classCallCheck(this, CMICommentsFromLearner);

    return _super6.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage
    });
  }

  return CMICommentsFromLearner;
}(_common.CMIArray);
/**
 * Class for SCORM 2004's cmi.interaction.n object
 */


var _id = new WeakMap();

var _type = new WeakMap();

var _timestamp = new WeakMap();

var _weighting = new WeakMap();

var _learner_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var _description = new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIInteractionsObject, _BaseCMI3);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interaction.n
   */
  function CMIInteractionsObject() {
    var _this3;

    _classCallCheck(this, CMIInteractionsObject);

    _this3 = _super7.call(this);

    _id.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _timestamp.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _learner_response.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _description.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.objectives = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.INVALID_SET_VALUE].detailMessage,
      children: scorm2004_constants.objectives_children
    });
    _this3.correct_responses = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.INVALID_SET_VALUE].detailMessage,
      children: scorm2004_constants.correct_responses_children
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #type
     * @return {string}
     */

  }, {
    key: "type",
    get: function get() {
      return _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
          _classPrivateFieldSet(this, _type, type);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
          _classPrivateFieldSet(this, _timestamp, timestamp);
        }
      }
    }
    /**
     * Getter for #weighting
     * @return {string}
     */

  }, {
    key: "weighting",
    get: function get() {
      return _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
          _classPrivateFieldSet(this, _weighting, weighting);
        }
      }
    }
    /**
     * Getter for #learner_response
     * @return {string}
     */

  }, {
    key: "learner_response",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_response);
    }
    /**
     * Setter for #learner_response. Does type validation to make sure response
     * matches SCORM 2004's spec
     * @param {string} learner_response
     */
    ,
    set: function set(learner_response) {
      if (this.initialized && (_classPrivateFieldGet(this, _type) === '' || _classPrivateFieldGet(this, _id) === '')) {
        throwDependencyNotEstablishedError();
      } else {
        var nodes = [];
        var response_type = learner_responses[this.type];

        if (response_type) {
          if (response_type !== null && response_type !== void 0 && response_type.delimiter) {
            nodes = learner_response.split(response_type.delimiter);
          } else {
            nodes[0] = learner_response;
          }

          if (nodes.length > 0 && nodes.length <= response_type.max) {
            var formatRegex = new RegExp(response_type.format);

            for (var i = 0; i < nodes.length; i++) {
              if (response_type !== null && response_type !== void 0 && response_type.delimiter2) {
                var values = nodes[i].split(response_type.delimiter2);

                if (values.length === 2) {
                  if (!values[0].match(formatRegex)) {
                    throwTypeMismatchError();
                  } else {
                    if (!values[1].match(new RegExp(response_type.format2))) {
                      throwTypeMismatchError();
                    }
                  }
                } else {
                  throwTypeMismatchError();
                }
              } else {
                if (!nodes[i].match(formatRegex)) {
                  throwTypeMismatchError();
                } else {
                  if (nodes[i] !== '' && response_type.unique) {
                    for (var j = 0; j < i; j++) {
                      if (nodes[i] === nodes[j]) {
                        throwTypeMismatchError();
                      }
                    }
                  }
                }
              }
            }
          } else {
            throwGeneralSetError();
          }

          _classPrivateFieldSet(this, _learner_response, learner_response);
        } else {
          throwTypeMismatchError();
        }
      }
    }
    /**
     * Getter for #result
     * @return {string}
     */

  }, {
    key: "result",
    get: function get() {
      return _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check2004ValidFormat(result, scorm2004_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency
     * @return {string}
     */

  }, {
    key: "latency",
    get: function get() {
      return _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
          _classPrivateFieldSet(this, _latency, latency);
        }
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
          _classPrivateFieldSet(this, _description, description);
        }
      }
    }
    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      type: string,
     *      objectives: CMIArray,
     *      timestamp: string,
     *      correct_responses: CMIArray,
     *      weighting: string,
     *      learner_response: string,
     *      result: string,
     *      latency: string,
     *      description: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'type': this.type,
        'objectives': this.objectives,
        'timestamp': this.timestamp,
        'weighting': this.weighting,
        'learner_response': this.learner_response,
        'result': this.result,
        'latency': this.latency,
        'description': this.description,
        'correct_responses': this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.objectives.n object
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _success_status2 = new WeakMap();

var _completion_status2 = new WeakMap();

var _progress_measure2 = new WeakMap();

var _description2 = new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIObjectivesObject, _BaseCMI4);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this4;

    _classCallCheck(this, CMIObjectivesObject);

    _this4 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _success_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _completion_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _progress_measure2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _description2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.score = new Scorm2004CMIScore();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIObjectivesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIObjectivesObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status2);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
          _classPrivateFieldSet(this, _success_status2, success_status);
        }
      }
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status2);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
          _classPrivateFieldSet(this, _completion_status2, completion_status);
        }
      }
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure2);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
          _classPrivateFieldSet(this, _progress_measure2, progress_measure);
        }
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description2);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
          _classPrivateFieldSet(this, _description2, description);
        }
      }
    }
    /**
     * toJSON for cmi.objectives.n
     *
     * @return {
     *    {
     *      id: string,
     *      success_status: string,
     *      completion_status: string,
     *      progress_measure: string,
     *      description: string,
     *      score: Scorm2004CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'success_status': this.success_status,
        'completion_status': this.completion_status,
        'progress_measure': this.progress_measure,
        'description': this.description,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi *.score object
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _scaled = new WeakMap();

var Scorm2004CMIScore = /*#__PURE__*/function (_CMIScore) {
  _inherits(Scorm2004CMIScore, _CMIScore);

  var _super9 = _createSuper(Scorm2004CMIScore);

  /**
   * Constructor for cmi *.score
   */
  function Scorm2004CMIScore() {
    var _this5;

    _classCallCheck(this, Scorm2004CMIScore);

    _this5 = _super9.call(this, {
      score_children: scorm2004_constants.score_children,
      max: '',
      invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidErrorMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.READ_ONLY_ELEMENT].detailMessage,
      invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
      invalidTypeMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.TYPE_MISMATCH].detailMessage,
      invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      invalidRangeMessage: scorm2004_constants.error_descriptions[scorm2004_error_codes.VALUE_OUT_OF_RANGE].detailMessage,
      decimalRegex: scorm2004_regex.CMIDecimal
    });

    _scaled.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }
  /**
   * Getter for #scaled
   * @return {string}
   */


  _createClass(Scorm2004CMIScore, [{
    key: "scaled",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled);
    }
    /**
     * Setter for #scaled
     * @param {string} scaled
     */
    ,
    set: function set(scaled) {
      if (check2004ValidFormat(scaled, scorm2004_regex.CMIDecimal) && check2004ValidRange(scaled, scorm2004_regex.scaled_range)) {
        _classPrivateFieldSet(this, _scaled, scaled);
      }
    }
    /**
     * toJSON for cmi *.score
     *
     * @return {
     *    {
     *      scaled: string,
     *      raw: string,
     *      min: string,
     *      max: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'scaled': this.scaled,
        'raw': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "raw", this),
        'min': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "min", this),
        'max': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "max", this)
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return Scorm2004CMIScore;
}(_common.CMIScore);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */


var _comment = new WeakMap();

var _location2 = new WeakMap();

var _timestamp2 = new WeakMap();

var _readOnlyAfterInit = new WeakMap();

var CMICommentsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMICommentsObject, _BaseCMI5);

  var _super10 = _createSuper(CMICommentsObject);

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  function CMICommentsObject() {
    var _this6;

    var readOnlyAfterInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, CMICommentsObject);

    _this6 = _super10.call(this);

    _comment.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _location2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _timestamp2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _readOnlyAfterInit.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this6), _comment, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _location2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _timestamp2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _readOnlyAfterInit, readOnlyAfterInit);

    return _this6;
  }
  /**
   * Getter for #comment
   * @return {string}
   */


  _createClass(CMICommentsObject, [{
    key: "comment",
    get: function get() {
      return _classPrivateFieldGet(this, _comment);
    }
    /**
     * Setter for #comment
     * @param {string} comment
     */
    ,
    set: function set(comment) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(comment, scorm2004_regex.CMILangString4000, true)) {
          _classPrivateFieldSet(this, _comment, comment);
        }
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location2);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
          _classPrivateFieldSet(this, _location2, location);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp2);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
          _classPrivateFieldSet(this, _timestamp2, timestamp);
        }
      }
    }
    /**
     * toJSON for cmi.comments_from_learner.n object
     * @return {
     *    {
     *      comment: string,
     *      location: string,
     *      timestamp: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comment': this.comment,
        'location': this.location,
        'timestamp': this.timestamp
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMICommentsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */


exports.CMICommentsObject = CMICommentsObject;

var _id3 = new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI6);

  var _super11 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super11.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }
  /**
   * Getter for #id
   * @return {string}
   */


  _createClass(CMIInteractionsObjectivesObject, [{
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI7);

  var _super12 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super12.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }
  /**
   * Getter for #pattern
   * @return {string}
   */


  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "pattern",
    get: function get() {
      return _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check2004ValidFormat(pattern, scorm2004_regex.CMIFeedback)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
    /**
     * toJSON cmi.interactions.n.correct_responses.n object
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var ADL = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(ADL, _BaseCMI8);

  var _super13 = _createSuper(ADL);

  /**
   * Constructor for adl
   */
  function ADL() {
    var _this9;

    _classCallCheck(this, ADL);

    _this9 = _super13.call(this);
    _this9.nav = new ADLNav();
    return _this9;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADL, [{
    key: "initialize",
    value: function initialize() {
      var _this$nav;

      _get(_getPrototypeOf(ADL.prototype), "initialize", this).call(this);

      (_this$nav = this.nav) === null || _this$nav === void 0 ? void 0 : _this$nav.initialize();
    }
    /**
     * toJSON for adl
     * @return {
     *    {
     *      nav: {
     *        request: string
     *      }
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'nav': this.nav
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADL;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav object
 */


exports.ADL = ADL;

var _request = new WeakMap();

var ADLNav = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(ADLNav, _BaseCMI9);

  var _super14 = _createSuper(ADLNav);

  /**
   * Constructor for adl.nav
   */
  function ADLNav() {
    var _this10;

    _classCallCheck(this, ADLNav);

    _this10 = _super14.call(this);

    _request.set(_assertThisInitialized(_this10), {
      writable: true,
      value: '_none_'
    });

    _this10.request_valid = new ADLNavRequestValid();
    return _this10;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADLNav, [{
    key: "initialize",
    value: function initialize() {
      var _this$request_valid;

      _get(_getPrototypeOf(ADLNav.prototype), "initialize", this).call(this);

      (_this$request_valid = this.request_valid) === null || _this$request_valid === void 0 ? void 0 : _this$request_valid.initialize();
    }
    /**
     * Getter for #request
     * @return {string}
     */

  }, {
    key: "request",
    get: function get() {
      return _classPrivateFieldGet(this, _request);
    }
    /**
     * Setter for #request
     * @param {string} request
     */
    ,
    set: function set(request) {
      if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _request, request);
      }
    }
    /**
     * toJSON for adl.nav
     *
     * @return {
     *    {
     *      request: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'request': this.request
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADLNav;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */


var _continue = new WeakMap();

var _previous = new WeakMap();

var ADLNavRequestValid = /*#__PURE__*/function (_BaseCMI10) {
  _inherits(ADLNavRequestValid, _BaseCMI10);

  var _super15 = _createSuper(ADLNavRequestValid);

  /**
   * Constructor for adl.nav.request_valid
   */
  function ADLNavRequestValid() {
    var _temp, _temp2;

    var _this11;

    _classCallCheck(this, ADLNavRequestValid);

    _this11 = _super15.call(this);

    _continue.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _previous.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _defineProperty(_assertThisInitialized(_this11), "choice", (_temp = function _temp() {
      _classCallCheck(this, _temp);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp));

    _defineProperty(_assertThisInitialized(_this11), "jump", (_temp2 = function _temp2() {
      _classCallCheck(this, _temp2);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp2));

    return _this11;
  }
  /**
   * Getter for #continue
   * @return {string}
   */


  _createClass(ADLNavRequestValid, [{
    key: "continue",
    get: function get() {
      return _classPrivateFieldGet(this, _continue);
    }
    /**
     * Setter for #continue. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
    /**
     * Getter for #previous
     * @return {string}
     */

  }, {
    key: "previous",
    get: function get() {
      return _classPrivateFieldGet(this, _previous);
    }
    /**
     * Setter for #previous. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
    /**
     * toJSON for adl.nav.request_valid
     *
     * @return {
     *    {
     *      previous: string,
     *      continue: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'previous': this.previous,
        'continue': this["continue"]
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADLNavRequestValid;
}(_common.BaseCMI);

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"../utilities":17,"./common":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  SCORM_TRUE: 'true',
  SCORM_FALSE: 'false',
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2,
  LOG_LEVEL_DEBUG: 1,
  LOG_LEVEL_INFO: 2,
  LOG_LEVEL_WARNING: 3,
  LOG_LEVEL_ERROR: 4,
  LOG_LEVEL_NONE: 5,
  NO_ERROR: {
    errorCode: 0,
    errorMessage: 'No error'
  }
};
var scorm12 = {
  // Children lists
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions',
  core_children: 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time',
  score_children: 'raw,min,max',
  comments_children: 'content,location,time',
  objectives_children: 'id,score,status',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio,language,speed,text',
  interactions_children: 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency',
  error_descriptions: {
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use LMSGetDiagnostic for more information'
    },
    '201': {
      basicMessage: 'Invalid argument error',
      detailMessage: 'Indicates that an argument represents an invalid data model element or is otherwise incorrect.'
    },
    '202': {
      basicMessage: 'Element cannot have children',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.'
    },
    '203': {
      basicMessage: 'Element not an array - cannot have count',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.'
    },
    '301': {
      basicMessage: 'Not initialized',
      detailMessage: 'Indicates that an API call was made before the call to lmsInitialize.'
    },
    '401': {
      basicMessage: 'Not implemented error',
      detailMessage: 'The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.'
    },
    '402': {
      basicMessage: 'Invalid set value, element is a keyword',
      detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").'
    },
    '403': {
      basicMessage: 'Element is read only',
      detailMessage: 'LMSSetValue was called with a data model element that can only be read.'
    },
    '404': {
      basicMessage: 'Element is write only',
      detailMessage: 'LMSGetValue was called on a data model element that can only be written to.'
    },
    '405': {
      basicMessage: 'Incorrect Data Type',
      detailMessage: 'LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    },
    '407': {
      basicMessage: 'Element Value Out Of Range',
      detailMessage: 'The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element.'
    },
    '408': {
      basicMessage: 'Data Model Dependency Not Established',
      detailMessage: 'Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.'
    }
  }
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation',
  student_preference_children: 'audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows',
  student_data_children: 'attempt_number,tries,mastery_score,max_time_allowed,time_limit_action',
  student_demographics_children: 'city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience',
  tries_children: 'time,status,score',
  attempt_records_children: 'score,lesson_status',
  paths_children: 'location_id,date,time,status,why_left,time_in_element'
});

var scorm2004 = {
  // Children lists
  cmi_children: '_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time',
  comments_children: 'comment,timestamp,location',
  score_children: 'max,raw,scaled,min',
  objectives_children: 'progress_measure,completion_status,success_status,description,score,id',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio_level,audio_captioning,delivery_speed,language',
  interactions_children: 'id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description',
  error_descriptions: {
    '0': {
      basicMessage: 'No Error',
      detailMessage: 'No error occurred, the previous API call was successful.'
    },
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use GetDiagnostic for more information.'
    },
    '102': {
      basicMessage: 'General Initialization Failure',
      detailMessage: 'Call to Initialize failed for an unknown reason.'
    },
    '103': {
      basicMessage: 'Already Initialized',
      detailMessage: 'Call to Initialize failed because Initialize was already called.'
    },
    '104': {
      basicMessage: 'Content Instance Terminated',
      detailMessage: 'Call to Initialize failed because Terminate was already called.'
    },
    '111': {
      basicMessage: 'General Termination Failure',
      detailMessage: 'Call to Terminate failed for an unknown reason.'
    },
    '112': {
      basicMessage: 'Termination Before Initialization',
      detailMessage: 'Call to Terminate failed because it was made before the call to Initialize.'
    },
    '113': {
      basicMessage: 'Termination After Termination',
      detailMessage: 'Call to Terminate failed because Terminate was already called.'
    },
    '122': {
      basicMessage: 'Retrieve Data Before Initialization',
      detailMessage: 'Call to GetValue failed because it was made before the call to Initialize.'
    },
    '123': {
      basicMessage: 'Retrieve Data After Termination',
      detailMessage: 'Call to GetValue failed because it was made after the call to Terminate.'
    },
    '132': {
      basicMessage: 'Store Data Before Initialization',
      detailMessage: 'Call to SetValue failed because it was made before the call to Initialize.'
    },
    '133': {
      basicMessage: 'Store Data After Termination',
      detailMessage: 'Call to SetValue failed because it was made after the call to Terminate.'
    },
    '142': {
      basicMessage: 'Commit Before Initialization',
      detailMessage: 'Call to Commit failed because it was made before the call to Initialize.'
    },
    '143': {
      basicMessage: 'Commit After Termination',
      detailMessage: 'Call to Commit failed because it was made after the call to Terminate.'
    },
    '201': {
      basicMessage: 'General Argument Error',
      detailMessage: 'An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument.'
    },
    '301': {
      basicMessage: 'General Get Failure',
      detailMessage: 'Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '351': {
      basicMessage: 'General Set Failure',
      detailMessage: 'Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '391': {
      basicMessage: 'General Commit Failure',
      detailMessage: 'Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '401': {
      basicMessage: 'Undefined Data Model Element',
      detailMessage: 'The data model element name passed to GetValue or SetValue is not a valid SCORM data model element.'
    },
    '402': {
      basicMessage: 'Unimplemented Data Model Element',
      detailMessage: 'The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant.'
    },
    '403': {
      basicMessage: 'Data Model Element Value Not Initialized',
      detailMessage: 'Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO.'
    },
    '404': {
      basicMessage: 'Data Model Element Is Read Only',
      detailMessage: 'SetValue was called with a data model element that can only be read.'
    },
    '405': {
      basicMessage: 'Data Model Element Is Write Only',
      detailMessage: 'GetValue was called on a data model element that can only be written to.'
    },
    '406': {
      basicMessage: 'Data Model Element Type Mismatch',
      detailMessage: 'SetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    },
    '407': {
      basicMessage: 'Data Model Element Value Out Of Range',
      detailMessage: 'The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element.'
    },
    '408': {
      basicMessage: 'Data Model Dependency Not Established',
      detailMessage: 'Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.'
    }
  }
};
var APIConstants = {
  global: global,
  scorm12: scorm12,
  aicc: aicc,
  scorm2004: scorm2004
};
var _default = APIConstants;
exports["default"] = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  GENERAL: 101,
  INITIALIZATION_FAILED: 101,
  INITIALIZED: 101,
  TERMINATED: 101,
  TERMINATION_FAILURE: 101,
  TERMINATION_BEFORE_INIT: 101,
  MULTIPLE_TERMINATION: 101,
  RETRIEVE_BEFORE_INIT: 101,
  RETRIEVE_AFTER_TERM: 101,
  STORE_BEFORE_INIT: 101,
  STORE_AFTER_TERM: 101,
  COMMIT_BEFORE_INIT: 101,
  COMMIT_AFTER_TERM: 101,
  ARGUMENT_ERROR: 101,
  CHILDREN_ERROR: 101,
  COUNT_ERROR: 101,
  GENERAL_GET_FAILURE: 101,
  GENERAL_SET_FAILURE: 101,
  GENERAL_COMMIT_FAILURE: 101,
  UNDEFINED_DATA_MODEL: 101,
  UNIMPLEMENTED_ELEMENT: 101,
  VALUE_NOT_INITIALIZED: 101,
  INVALID_SET_VALUE: 101,
  READ_ONLY_ELEMENT: 101,
  WRITE_ONLY_ELEMENT: 101,
  TYPE_MISMATCH: 101,
  VALUE_OUT_OF_RANGE: 101,
  DEPENDENCY_NOT_ESTABLISHED: 101
};

var scorm12 = _objectSpread(_objectSpread({}, global), {
  RETRIEVE_BEFORE_INIT: 301,
  STORE_BEFORE_INIT: 301,
  COMMIT_BEFORE_INIT: 301,
  ARGUMENT_ERROR: 201,
  CHILDREN_ERROR: 202,
  COUNT_ERROR: 203,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 401,
  VALUE_NOT_INITIALIZED: 301,
  INVALID_SET_VALUE: 402,
  READ_ONLY_ELEMENT: 403,
  WRITE_ONLY_ELEMENT: 404,
  TYPE_MISMATCH: 405,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var scorm2004 = _objectSpread(_objectSpread({}, global), {
  INITIALIZATION_FAILED: 102,
  INITIALIZED: 103,
  TERMINATED: 104,
  TERMINATION_FAILURE: 111,
  TERMINATION_BEFORE_INIT: 112,
  MULTIPLE_TERMINATIONS: 113,
  RETRIEVE_BEFORE_INIT: 122,
  RETRIEVE_AFTER_TERM: 123,
  STORE_BEFORE_INIT: 132,
  STORE_AFTER_TERM: 133,
  COMMIT_BEFORE_INIT: 142,
  COMMIT_AFTER_TERM: 143,
  ARGUMENT_ERROR: 201,
  GENERAL_GET_FAILURE: 301,
  GENERAL_SET_FAILURE: 351,
  GENERAL_COMMIT_FAILURE: 391,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 402,
  VALUE_NOT_INITIALIZED: 403,
  READ_ONLY_ELEMENT: 404,
  WRITE_ONLY_ELEMENT: 405,
  TYPE_MISMATCH: 406,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var ErrorCodes = {
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = ErrorCodes;
exports["default"] = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var ValidLanguages = {
  'aa': 'aa',
  'ab': 'ab',
  'ae': 'ae',
  'af': 'af',
  'ak': 'ak',
  'am': 'am',
  'an': 'an',
  'ar': 'ar',
  'as': 'as',
  'av': 'av',
  'ay': 'ay',
  'az': 'az',
  'ba': 'ba',
  'be': 'be',
  'bg': 'bg',
  'bh': 'bh',
  'bi': 'bi',
  'bm': 'bm',
  'bn': 'bn',
  'bo': 'bo',
  'br': 'br',
  'bs': 'bs',
  'ca': 'ca',
  'ce': 'ce',
  'ch': 'ch',
  'co': 'co',
  'cr': 'cr',
  'cs': 'cs',
  'cu': 'cu',
  'cv': 'cv',
  'cy': 'cy',
  'da': 'da',
  'de': 'de',
  'dv': 'dv',
  'dz': 'dz',
  'ee': 'ee',
  'el': 'el',
  'en': 'en',
  'eo': 'eo',
  'es': 'es',
  'et': 'et',
  'eu': 'eu',
  'fa': 'fa',
  'ff': 'ff',
  'fi': 'fi',
  'fj': 'fj',
  'fo': 'fo',
  'fr': 'fr',
  'fy': 'fy',
  'ga': 'ga',
  'gd': 'gd',
  'gl': 'gl',
  'gn': 'gn',
  'gu': 'gu',
  'gv': 'gv',
  'ha': 'ha',
  'he': 'he',
  'hi': 'hi',
  'ho': 'ho',
  'hr': 'hr',
  'ht': 'ht',
  'hu': 'hu',
  'hy': 'hy',
  'hz': 'hz',
  'ia': 'ia',
  'id': 'id',
  'ie': 'ie',
  'ig': 'ig',
  'ii': 'ii',
  'ik': 'ik',
  'io': 'io',
  'is': 'is',
  'it': 'it',
  'iu': 'iu',
  'ja': 'ja',
  'jv': 'jv',
  'ka': 'ka',
  'kg': 'kg',
  'ki': 'ki',
  'kj': 'kj',
  'kk': 'kk',
  'kl': 'kl',
  'km': 'km',
  'kn': 'kn',
  'ko': 'ko',
  'kr': 'kr',
  'ks': 'ks',
  'ku': 'ku',
  'kv': 'kv',
  'kw': 'kw',
  'ky': 'ky',
  'la': 'la',
  'lb': 'lb',
  'lg': 'lg',
  'li': 'li',
  'ln': 'ln',
  'lo': 'lo',
  'lt': 'lt',
  'lu': 'lu',
  'lv': 'lv',
  'mg': 'mg',
  'mh': 'mh',
  'mi': 'mi',
  'mk': 'mk',
  'ml': 'ml',
  'mn': 'mn',
  'mo': 'mo',
  'mr': 'mr',
  'ms': 'ms',
  'mt': 'mt',
  'my': 'my',
  'na': 'na',
  'nb': 'nb',
  'nd': 'nd',
  'ne': 'ne',
  'ng': 'ng',
  'nl': 'nl',
  'nn': 'nn',
  'no': 'no',
  'nr': 'nr',
  'nv': 'nv',
  'ny': 'ny',
  'oc': 'oc',
  'oj': 'oj',
  'om': 'om',
  'or': 'or',
  'os': 'os',
  'pa': 'pa',
  'pi': 'pi',
  'pl': 'pl',
  'ps': 'ps',
  'pt': 'pt',
  'qu': 'qu',
  'rm': 'rm',
  'rn': 'rn',
  'ro': 'ro',
  'ru': 'ru',
  'rw': 'rw',
  'sa': 'sa',
  'sc': 'sc',
  'sd': 'sd',
  'se': 'se',
  'sg': 'sg',
  'sh': 'sh',
  'si': 'si',
  'sk': 'sk',
  'sl': 'sl',
  'sm': 'sm',
  'sn': 'sn',
  'so': 'so',
  'sq': 'sq',
  'sr': 'sr',
  'ss': 'ss',
  'st': 'st',
  'su': 'su',
  'sv': 'sv',
  'sw': 'sw',
  'ta': 'ta',
  'te': 'te',
  'tg': 'tg',
  'th': 'th',
  'ti': 'ti',
  'tk': 'tk',
  'tl': 'tl',
  'tn': 'tn',
  'to': 'to',
  'tr': 'tr',
  'ts': 'ts',
  'tt': 'tt',
  'tw': 'tw',
  'ty': 'ty',
  'ug': 'ug',
  'uk': 'uk',
  'ur': 'ur',
  'uz': 'uz',
  've': 've',
  'vi': 'vi',
  'vo': 'vo',
  'wa': 'wa',
  'wo': 'wo',
  'xh': 'xh',
  'yi': 'yi',
  'yo': 'yo',
  'za': 'za',
  'zh': 'zh',
  'zu': 'zu',
  'aar': 'aar',
  'abk': 'abk',
  'ave': 'ave',
  'afr': 'afr',
  'aka': 'aka',
  'amh': 'amh',
  'arg': 'arg',
  'ara': 'ara',
  'asm': 'asm',
  'ava': 'ava',
  'aym': 'aym',
  'aze': 'aze',
  'bak': 'bak',
  'bel': 'bel',
  'bul': 'bul',
  'bih': 'bih',
  'bis': 'bis',
  'bam': 'bam',
  'ben': 'ben',
  'tib': 'tib',
  'bod': 'bod',
  'bre': 'bre',
  'bos': 'bos',
  'cat': 'cat',
  'che': 'che',
  'cha': 'cha',
  'cos': 'cos',
  'cre': 'cre',
  'cze': 'cze',
  'ces': 'ces',
  'chu': 'chu',
  'chv': 'chv',
  'wel': 'wel',
  'cym': 'cym',
  'dan': 'dan',
  'ger': 'ger',
  'deu': 'deu',
  'div': 'div',
  'dzo': 'dzo',
  'ewe': 'ewe',
  'gre': 'gre',
  'ell': 'ell',
  'eng': 'eng',
  'epo': 'epo',
  'spa': 'spa',
  'est': 'est',
  'baq': 'baq',
  'eus': 'eus',
  'per': 'per',
  'fas': 'fas',
  'ful': 'ful',
  'fin': 'fin',
  'fij': 'fij',
  'fao': 'fao',
  'fre': 'fre',
  'fra': 'fra',
  'fry': 'fry',
  'gle': 'gle',
  'gla': 'gla',
  'glg': 'glg',
  'grn': 'grn',
  'guj': 'guj',
  'glv': 'glv',
  'hau': 'hau',
  'heb': 'heb',
  'hin': 'hin',
  'hmo': 'hmo',
  'hrv': 'hrv',
  'hat': 'hat',
  'hun': 'hun',
  'arm': 'arm',
  'hye': 'hye',
  'her': 'her',
  'ina': 'ina',
  'ind': 'ind',
  'ile': 'ile',
  'ibo': 'ibo',
  'iii': 'iii',
  'ipk': 'ipk',
  'ido': 'ido',
  'ice': 'ice',
  'isl': 'isl',
  'ita': 'ita',
  'iku': 'iku',
  'jpn': 'jpn',
  'jav': 'jav',
  'geo': 'geo',
  'kat': 'kat',
  'kon': 'kon',
  'kik': 'kik',
  'kua': 'kua',
  'kaz': 'kaz',
  'kal': 'kal',
  'khm': 'khm',
  'kan': 'kan',
  'kor': 'kor',
  'kau': 'kau',
  'kas': 'kas',
  'kur': 'kur',
  'kom': 'kom',
  'cor': 'cor',
  'kir': 'kir',
  'lat': 'lat',
  'ltz': 'ltz',
  'lug': 'lug',
  'lim': 'lim',
  'lin': 'lin',
  'lao': 'lao',
  'lit': 'lit',
  'lub': 'lub',
  'lav': 'lav',
  'mlg': 'mlg',
  'mah': 'mah',
  'mao': 'mao',
  'mri': 'mri',
  'mac': 'mac',
  'mkd': 'mkd',
  'mal': 'mal',
  'mon': 'mon',
  'mol': 'mol',
  'mar': 'mar',
  'may': 'may',
  'msa': 'msa',
  'mlt': 'mlt',
  'bur': 'bur',
  'mya': 'mya',
  'nau': 'nau',
  'nob': 'nob',
  'nde': 'nde',
  'nep': 'nep',
  'ndo': 'ndo',
  'dut': 'dut',
  'nld': 'nld',
  'nno': 'nno',
  'nor': 'nor',
  'nbl': 'nbl',
  'nav': 'nav',
  'nya': 'nya',
  'oci': 'oci',
  'oji': 'oji',
  'orm': 'orm',
  'ori': 'ori',
  'oss': 'oss',
  'pan': 'pan',
  'pli': 'pli',
  'pol': 'pol',
  'pus': 'pus',
  'por': 'por',
  'que': 'que',
  'roh': 'roh',
  'run': 'run',
  'rum': 'rum',
  'ron': 'ron',
  'rus': 'rus',
  'kin': 'kin',
  'san': 'san',
  'srd': 'srd',
  'snd': 'snd',
  'sme': 'sme',
  'sag': 'sag',
  'slo': 'slo',
  'sin': 'sin',
  'slk': 'slk',
  'slv': 'slv',
  'smo': 'smo',
  'sna': 'sna',
  'som': 'som',
  'alb': 'alb',
  'sqi': 'sqi',
  'srp': 'srp',
  'ssw': 'ssw',
  'sot': 'sot',
  'sun': 'sun',
  'swe': 'swe',
  'swa': 'swa',
  'tam': 'tam',
  'tel': 'tel',
  'tgk': 'tgk',
  'tha': 'tha',
  'tir': 'tir',
  'tuk': 'tuk',
  'tgl': 'tgl',
  'tsn': 'tsn',
  'ton': 'ton',
  'tur': 'tur',
  'tso': 'tso',
  'tat': 'tat',
  'twi': 'twi',
  'tah': 'tah',
  'uig': 'uig',
  'ukr': 'ukr',
  'urd': 'urd',
  'uzb': 'uzb',
  'ven': 'ven',
  'vie': 'vie',
  'vol': 'vol',
  'wln': 'wln',
  'wol': 'wol',
  'xho': 'xho',
  'yid': 'yid',
  'yor': 'yor',
  'zha': 'zha',
  'chi': 'chi',
  'zho': 'zho',
  'zul': 'zul'
};
var _default = ValidLanguages;
exports["default"] = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var scorm12 = {
  CMIString256: '^.{0,255}$',
  CMIString4096: '^.{0,4096}$',
  CMITime: '^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)(?:\.(\\d+)?)?$',
  // eslint-disable-line
  CMITimespan: '^([0-9]{2,}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$',
  // eslint-disable-line
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{0,3})(\.[0-9]*)?$',
  // eslint-disable-line
  CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
  CMIFeedback: '^.{0,255}$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  // Vocabulary Data Type Definition
  CMIStatus: '^(passed|completed|failed|incomplete|browsed)$',
  CMIStatus2: '^(passed|completed|failed|incomplete|browsed|not attempted)$',
  CMIExit: '^(time-out|suspend|logout|)$',
  CMIType: '^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$',
  CMIResult: '^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$',
  // eslint-disable-line
  NAVEvent: '^(previous|continue)$',
  // Data ranges
  score_range: '0#100',
  audio_range: '-1#100',
  speed_range: '-100#100',
  weighting_range: '-100#100',
  text_range: '-1#1'
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  CMIIdentifier: '^\\w{1,255}$'
});

var scorm2004 = {
  CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  CMILang: '^([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?$|^$',
  // eslint-disable-line
  CMILangString250: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,250}$)?$',
  // eslint-disable-line
  CMILangcr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\}))(.*?)$',
  // eslint-disable-line
  CMILangString250cr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\})?(.{0,250})?)?$',
  // eslint-disable-line
  CMILangString4000: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,4000}$)?$',
  // eslint-disable-line
  CMITime: '^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$',
  CMITimespan: '^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$',
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{1,5})(\\.[0-9]{1,18})?$',
  CMIIdentifier: '^\\S{1,250}[a-zA-Z0-9]$',
  CMIShortIdentifier: '^[\\w\\.\\-\\_]{1,250}$',
  // eslint-disable-line
  CMILongIdentifier: '^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$',
  // need to re-examine this
  CMIFeedback: '^.*$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  CMIIndexStore: '.N(\\d+).',
  // Vocabulary Data Type Definition
  CMICStatus: '^(completed|incomplete|not attempted|unknown)$',
  CMISStatus: '^(passed|failed|unknown)$',
  CMIExit: '^(time-out|suspend|logout|normal)$',
  CMIType: '^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$',
  CMIResult: '^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$',
  NAVEvent: '^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|\{target=\\S{0,200}[a-zA-Z0-9]\}choice|jump)$',
  // eslint-disable-line
  NAVBoolean: '^(unknown|true|false$)',
  NAVTarget: '^(previous|continue|choice.{target=\\S{0,200}[a-zA-Z0-9]})$',
  // Data ranges
  scaled_range: '-1#1',
  audio_range: '0#*',
  speed_range: '0#*',
  text_range: '-1#1',
  progress_range: '0#1'
};
var Regex = {
  aicc: aicc,
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = Regex;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regex = _interopRequireDefault(require("./regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var scorm2004_regex = _regex["default"].scorm2004;
var learner = {
  'true-false': {
    format: '^true$|^false$',
    max: 1,
    delimiter: '',
    unique: false
  },
  'choice': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: true
  },
  'fill-in': {
    format: scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: '[,]',
    unique: false
  },
  'long-fill-in': {
    format: scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: '',
    unique: false
  },
  'matching': {
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'performance': {
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier,
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'sequencing': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: false
  },
  'likert': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: '',
    unique: false
  },
  'numeric': {
    format: scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: '',
    unique: false
  },
  'other': {
    format: scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: '',
    unique: false
  }
};
var correct = {
  'true-false': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: '^true$|^false$',
    limit: 1
  },
  'choice': {
    max: 36,
    delimiter: '[,]',
    unique: true,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'fill-in': {
    max: 10,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMILangString250cr
  },
  'long-fill-in': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: true,
    format: scorm2004_regex.CMILangString4000
  },
  'matching': {
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier
  },
  'performance': {
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier
  },
  'sequencing': {
    max: 36,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'likert': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    limit: 1
  },
  'numeric': {
    max: 2,
    delimiter: '[:]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIDecimal,
    limit: 1
  },
  'other': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIString4000,
    limit: 1
  }
};
var Responses = {
  learner: learner,
  correct: correct
};
var _default = Responses;
exports["default"] = _default;

},{"./regex":13}],15:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _errorCode = new WeakMap();

/**
 * Data Validation Exception
 */
var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   */
  function ValidationError(errorCode) {
    var _this;

    _classCallCheck(this, ValidationError);

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(rest));

    _errorCode.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _errorCode, errorCode);

    return _this;
  }

  _createClass(ValidationError, [{
    key: "errorCode",
    get:
    /**
     * Getter for #errorCode
     * @return {number}
     */
    function get() {
      return _classPrivateFieldGet(this, _errorCode);
    }
  }]);

  return ValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ValidationError = ValidationError;

},{}],16:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("./Scorm2004API"));

var _Scorm12API = _interopRequireDefault(require("./Scorm12API"));

var _AICC = _interopRequireDefault(require("./AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm12API = _Scorm12API["default"];
window.Scorm2004API = _Scorm2004API["default"];
window.AICC = _AICC["default"];

},{"./AICC":2,"./Scorm12API":4,"./Scorm2004API":5}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecondsAsHHMMSS = getSecondsAsHHMMSS;
exports.getSecondsAsISODuration = getSecondsAsISODuration;
exports.getTimeAsSeconds = getTimeAsSeconds;
exports.getDurationAsSeconds = getDurationAsSeconds;
exports.addTwoDurations = addTwoDurations;
exports.addHHMMSSTimeStrings = addHHMMSSTimeStrings;
exports.flatten = flatten;
exports.unflatten = unflatten;
exports.countDecimals = countDecimals;
exports.SECONDS_PER_DAY = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE = exports.SECONDS_PER_SECOND = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SECONDS_PER_SECOND = 1.0;
exports.SECONDS_PER_SECOND = SECONDS_PER_SECOND;
var SECONDS_PER_MINUTE = 60;
exports.SECONDS_PER_MINUTE = SECONDS_PER_MINUTE;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
exports.SECONDS_PER_HOUR = SECONDS_PER_HOUR;
var SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
exports.SECONDS_PER_DAY = SECONDS_PER_DAY;
var designations = [['D', SECONDS_PER_DAY], ['H', SECONDS_PER_HOUR], ['M', SECONDS_PER_MINUTE], ['S', SECONDS_PER_SECOND]];
/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {Number} totalSeconds
 * @return {string}
 */

function getSecondsAsHHMMSS(totalSeconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!totalSeconds || totalSeconds <= 0) {
    return '00:00:00';
  }

  var hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  var dateObj = new Date(totalSeconds * 1000);
  var minutes = dateObj.getUTCMinutes(); // make sure we add any possible decimal value

  var seconds = dateObj.getSeconds();
  var ms = totalSeconds % 1.0;
  var msStr = '';

  if (countDecimals(ms) > 0) {
    if (countDecimals(ms) > 2) {
      msStr = ms.toFixed(2);
    } else {
      msStr = String(ms);
    }

    msStr = '.' + msStr.split('.')[1];
  }

  return (hours + ':' + minutes + ':' + seconds).replace(/\b\d\b/g, '0$&') + msStr;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {Number} seconds
 * @return {String}
 */


function getSecondsAsISODuration(seconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!seconds || seconds <= 0) {
    return 'PT0S';
  }

  var duration = 'P';
  var remainder = seconds;
  designations.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        sign = _ref2[0],
        current_seconds = _ref2[1];

    var value = Math.floor(remainder / current_seconds);
    remainder = remainder % current_seconds;

    if (countDecimals(remainder) > 2) {
      remainder = Number(Number(remainder).toFixed(2));
    } // If we have anything left in the remainder, and we're currently adding
    // seconds to the duration, go ahead and add the decimal to the seconds


    if (sign === 'S' && remainder > 0) {
      value += remainder;
    }

    if (value) {
      if ((duration.indexOf('D') > 0 || sign === 'H' || sign === 'M' || sign === 'S') && duration.indexOf('T') === -1) {
        duration += 'T';
      }

      duration += "".concat(value).concat(sign);
    }
  });
  return duration;
}
/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */


function getTimeAsSeconds(timeString, timeRegex) {
  if (!timeString || typeof timeString !== 'string' || !timeString.match(timeRegex)) {
    return 0;
  }

  var parts = timeString.split(':');
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  var seconds = Number(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */


function getDurationAsSeconds(duration, durationRegex) {
  if (!duration || !duration.match(durationRegex)) {
    return 0;
  }

  var _ref3 = new RegExp(durationRegex).exec(duration) || [],
      _ref4 = _slicedToArray(_ref3, 8),
      years = _ref4[1],
      months = _ref4[2],
      days = _ref4[4],
      hours = _ref4[5],
      minutes = _ref4[6],
      seconds = _ref4[7];

  var result = 0.0;
  result += Number(seconds) * 1.0 || 0.0;
  result += Number(minutes) * 60.0 || 0.0;
  result += Number(hours) * 3600.0 || 0.0;
  result += Number(days) * (60 * 60 * 24.0) || 0.0;
  result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
  return result;
}
/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} durationRegex
 * @return {string}
 */


function addTwoDurations(first, second, durationRegex) {
  return getSecondsAsISODuration(getDurationAsSeconds(first, durationRegex) + getDurationAsSeconds(second, durationRegex));
}
/**
 * Add together two HH:MM:SS.DD strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} timeRegex
 * @return {string}
 */


function addHHMMSSTimeStrings(first, second, timeRegex) {
  return getSecondsAsHHMMSS(getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex));
}
/**
 * Flatten a JSON object down to string paths for each values
 * @param {object} data
 * @return {object}
 */


function flatten(data) {
  var result = {};
  /**
   * Recurse through the object
   * @param {*} cur
   * @param {*} prop
   */

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
        if (l === 0) result[prop] = [];
      }
    } else {
      var isEmpty = true;

      for (var p in cur) {
        if ({}.hasOwnProperty.call(cur, p)) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + '.' + p : p);
        }
      }

      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, '');
  return result;
}
/**
 * Un-flatten a flat JSON object
 * @param {object} data
 * @return {object}
 */


function unflatten(data) {
  'use strict';

  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.[\]]+)|\[(\d+)]/g;
  var result = {};

  for (var p in data) {
    if ({}.hasOwnProperty.call(data, p)) {
      var cur = result;
      var prop = '';
      var m = regex.exec(p);

      while (m) {
        cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1];
        m = regex.exec(p);
      }

      cur[prop] = data[p];
    }
  }

  return result[''] || result;
}
/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */


function countDecimals(num) {
  if (Math.floor(num) === num || String(num).indexOf('.') < 0) return 0;
  var parts = num.toString().split('.')[1];
  return parts.length || 0;
}

},{}]},{},[2,3,6,7,8,9,10,11,12,13,14,15,16,4,5,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL1Njb3JtMjAwNEFQSS5qcyIsInNyYy9jbWkvYWljY19jbWkuanMiLCJzcmMvY21pL2NvbW1vbi5qcyIsInNyYy9jbWkvc2Nvcm0xMl9jbWkuanMiLCJzcmMvY21pL3Njb3JtMjAwNF9jbWkuanMiLCJzcmMvY29uc3RhbnRzL2FwaV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL2Vycm9yX2NvZGVzLmpzIiwic3JjL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMuanMiLCJzcmMvZXhjZXB0aW9ucy5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNMLE1BQUEsWUFBWSxFQUFFLDZCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpCVztBQXFCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDZCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJCVztBQXlCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLG1DQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpCVztBQTZCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLCtCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdCVztBQWlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpDVztBQXFDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGlDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJDVztBQXlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpDVztBQTZDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdDVztBQWlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpEVztBQXFEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDBCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJEVztBQXlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHdCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpEVztBQTZEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdEVztBQWlFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpFVztBQXFFbEIsV0FBTztBQUNM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QU4sQ0FBVyxDQUFYLENBQUo7QUFDRDs7QUFDRCxNQUFBLEdBQUcsQ0FBQyxJQUFELENBQUgsR0FBWSxJQUFJLENBQUMsQ0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxNQUFNLENBQUMsRUFBRCxDQUFOLElBQWMsTUFBckI7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUFvQztBQUN6QyxNQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxNQUFvQixHQUFwQixJQUEyQixNQUFNLENBQUMsR0FBRCxDQUFOLENBQVksT0FBWixDQUFvQixHQUFwQixJQUEyQixDQUExRCxFQUE2RCxPQUFPLENBQVA7QUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQUosR0FBZSxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWQ7QUFDQSxTQUFPLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQXZCO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvLyBAZmxvd1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QsXG4gIENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCxcbiAgQ01JVHJpZXNPYmplY3QsXG59IGZyb20gJy4vY21pL2FpY2NfY21pJztcbmltcG9ydCB7TkFWfSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSc7XG5cbi8qKlxuICogVGhlIEFJQ0MgQVBJIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFJQ0MgZXh0ZW5kcyBTY29ybTEyQVBJIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBBSUNDIEFQSSBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMubmF2ID0gbmV3IE5BVigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkID0gc3VwZXIuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpO1xuXG4gICAgaWYgKCFuZXdDaGlsZCkge1xuICAgICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5ldmFsdWF0aW9uXFxcXC5jb21tZW50c1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAgICdjbWlcXFxcLnN0dWRlbnRfZGF0YVxcXFwudHJpZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSVRyaWVzT2JqZWN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAgICdjbWlcXFxcLnN0dWRlbnRfZGF0YVxcXFwuYXR0ZW1wdF9yZWNvcmRzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlBdHRlbXB0UmVjb3Jkc09iamVjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7QUlDQ30gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMubmF2ID0gbmV3QVBJLm5hdjtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7IENNSUFycmF5IH0gZnJvbSAnLi9jbWkvY29tbW9uJ1xuaW1wb3J0IHsgVmFsaWRhdGlvbkVycm9yIH0gZnJvbSAnLi9leGNlcHRpb25zJ1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnXG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnXG5pbXBvcnQgeyB1bmZsYXR0ZW4gfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnXG5cbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsXG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyXG5cbi8qKlxuICogQmFzZSBBUEkgY2xhc3MgZm9yIEFJQ0MsIFNDT1JNIDEuMiwgYW5kIFNDT1JNIDIwMDQuIFNob3VsZCBiZSBjb25zaWRlcmVkXG4gKiBhYnN0cmFjdCwgYW5kIG5ldmVyIGluaXRpYWxpemVkIG9uIGl0J3Mgb3duLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQVBJIHtcbiAgICAjdGltZW91dFxuICAgICNlcnJvcl9jb2Rlc1xuICAgICNzZXR0aW5ncyA9IHtcbiAgICAgICAgYXV0b2NvbW1pdDogZmFsc2UsXG4gICAgICAgIGF1dG9jb21taXRTZWNvbmRzOiAxMCxcbiAgICAgICAgYXN5bmNDb21taXQ6IGZhbHNlLFxuICAgICAgICBzZW5kQmVhY29uQ29tbWl0OiBmYWxzZSxcbiAgICAgICAgbG1zQ29tbWl0VXJsOiBmYWxzZSxcbiAgICAgICAgZGF0YUNvbW1pdEZvcm1hdDogJ2pzb24nLCAvLyB2YWxpZCBmb3JtYXRzIGFyZSAnanNvbicgb3IgJ2ZsYXR0ZW5lZCcsICdwYXJhbXMnXG4gICAgICAgIGNvbW1pdFJlcXVlc3REYXRhVHlwZTogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcsXG4gICAgICAgIGF1dG9Qcm9ncmVzczogZmFsc2UsXG4gICAgICAgIGxvZ0xldmVsOiBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUixcbiAgICAgICAgc2VsZlJlcG9ydFNlc3Npb25UaW1lOiBmYWxzZSxcbiAgICAgICAgYWx3YXlzU2VuZFRvdGFsVGltZTogZmFsc2UsXG4gICAgICAgIHJlc3BvbnNlSGFuZGxlcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgbGV0IHJlc3VsdFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB4aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgIXt9Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCAncmVzdWx0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge31cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMTAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVlc3RIYW5kbGVyOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zXG4gICAgICAgIH0sXG4gICAgfVxuICAgIGNtaVxuICAgIHN0YXJ0aW5nRGF0YToge31cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBCYXNlIEFQSSBjbGFzcy4gU2V0cyBzb21lIHNoYXJlZCBBUEkgZmllbGRzLCBhcyB3ZWxsIGFzXG4gICAgICogc2V0cyB1cCBvcHRpb25zIGZvciB0aGUgQVBJLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcl9jb2Rlc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVycm9yX2NvZGVzLCBzZXR0aW5ncykge1xuICAgICAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZUFQSSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBCYXNlQVBJIGluc3RhbmNlcyBkaXJlY3RseScpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRFxuICAgICAgICB0aGlzLmxhc3RFcnJvciA9IGdsb2JhbF9jb25zdGFudHMuTk9fRVJST1JcbiAgICAgICAgdGhpcy5saXN0ZW5lckFycmF5ID0gW11cblxuICAgICAgICB0aGlzLiN0aW1lb3V0ID0gbnVsbFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2RlcyA9IGVycm9yX2NvZGVzXG5cbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgICAgIHRoaXMuYXBpTG9nTGV2ZWwgPSB0aGlzLnNldHRpbmdzLmxvZ0xldmVsXG4gICAgICAgIHRoaXMuc2VsZlJlcG9ydFNlc3Npb25UaW1lID0gdGhpcy5zZXR0aW5ncy5zZWxmUmVwb3J0U2Vzc2lvblRpbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHRoZSBBUElcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm1pbmF0aW9uTWVzc2FnZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBpbml0aWFsaXplKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBpbml0aWFsaXplTWVzc2FnZT86IFN0cmluZywgdGVybWluYXRpb25NZXNzYWdlPzogU3RyaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0VcblxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLklOSVRJQUxJWkVELCBpbml0aWFsaXplTWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVEVELCB0ZXJtaW5hdGlvbk1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxmUmVwb3J0U2Vzc2lvblRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNtaS5zZXRTdGFydFRpbWUoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRURcbiAgICAgICAgICAgIHRoaXMubGFzdEVycm9yID0gZ2xvYmFsX2NvbnN0YW50cy5OT19FUlJPUlxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUVcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKVxuICAgICAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSlcblxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNlcnJvcl9jb2Rlc1xuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXQgZXJyb3JfY29kZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNlcnJvcl9jb2Rlc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3NldHRpbmdzXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldCBzZXR0aW5ncygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICAgKi9cbiAgICBzZXQgc2V0dGluZ3Moc2V0dGluZ3M6IE9iamVjdCkge1xuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHsgLi4udGhpcy4jc2V0dGluZ3MsIC4uLnNldHRpbmdzIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXJtaW5hdGVzIHRoZSBjdXJyZW50IHJ1biBvZiB0aGUgQVBJXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRlcm1pbmF0ZShjYWxsYmFja05hbWUsIGNoZWNrVGVybWluYXRlZCkge1xuICAgICAgICBjb25zdCBpZCA9IGAke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCl9JHtEYXRlLm5vdygpfWBcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTdGF0ZShcbiAgICAgICAgICAgICAgICBjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgICAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQsXG4gICAgICAgICAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuTVVMVElQTEVfVEVSTUlOQVRJT05cbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRFxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKGNhbGxiYWNrTmFtZSwgdHJ1ZSwgaWQpXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZXN1bHQuZXJyb3JDb2RlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID4gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQgPyByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3IgPSBnbG9iYWxfY29uc3RhbnRzLk5PX0VSUk9SXG5cbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRVxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU6IGUuZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBpZCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pXG4gICAgICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRWYWx1ZShjYWxsYmFja05hbWUsIGNoZWNrVGVybWluYXRlZCwgQ01JRWxlbWVudCkge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG5cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShcbiAgICAgICAgICAgICAgICBjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgICAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQkVGT1JFX0lOSVQsXG4gICAgICAgICAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQUZURVJfVEVSTVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yID0gZ2xvYmFsX2NvbnN0YW50cy5OT19FUlJPUlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb2RlOiBlLmVycm9yQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSwgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTylcbiAgICAgICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpXG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1pdENhbGxiYWNrXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgc2V0VmFsdWUoY2FsbGJhY2tOYW1lLCBjb21taXRDYWxsYmFjaywgY2hlY2tUZXJtaW5hdGVkLCBDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuXG4gICAgICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9CRUZPUkVfSU5JVCwgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQUZURVJfVEVSTSkpIHtcbiAgICAgICAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yID0gZ2xvYmFsX2NvbnN0YW50cy5OT19FUlJPUlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU6IGUuZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCB2YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0VcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgICAgIC8vIHNjaGVkdWxlIGEgY29tbWl0LCBpZiBhdXRvY29tbWl0IGlzIHR1cm5lZCBvblxuICAgICAgICBpZiAoU3RyaW5nKHRoaXMubGFzdEVycm9yLmVycm9yQ29kZSkgPT09ICcwJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b2NvbW1pdCAmJiAhdGhpcy4jdGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVDb21taXQodGhpcy5zZXR0aW5ncy5hdXRvY29tbWl0U2Vjb25kcyAqIDEwMDAsIGNvbW1pdENhbGxiYWNrKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hcGlMb2coXG4gICAgICAgICAgICBjYWxsYmFja05hbWUsXG4gICAgICAgICAgICBgJHtDTUlFbGVtZW50fSA6ICR7dmFsdWV9YCxcbiAgICAgICAgICAgICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GT1xuICAgICAgICApXG4gICAgICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBjb21taXQoY2FsbGJhY2tOYW1lLCBjaGVja1Rlcm1pbmF0ZWQpIHtcbiAgICAgICAgdGhpcy5jbGVhclNjaGVkdWxlZENvbW1pdCgpXG4gICAgICAgIGNvbnN0IGlkID0gYCR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKX0ke0RhdGUubm93KCl9YFxuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0JFRk9SRV9JTklULCB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQUZURVJfVEVSTSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKGNhbGxiYWNrTmFtZSwgZmFsc2UsIGlkKVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc2V0dGluZ3Muc2VuZEJlYWNvbkNvbW1pdCAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zZXR0aW5ncy5hc3luY0NvbW1pdCAmJlxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPiAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LnJlc3VsdCA/IHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG5cbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvciA9IGdsb2JhbF9jb25zdGFudHMuTk9fRVJST1JcblxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU6IGUuZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBpZCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pXG4gICAgICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lKSB7XG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gU3RyaW5nKHRoaXMubGFzdEVycm9yLmVycm9yQ29kZSlcblxuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKVxuXG4gICAgICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pXG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldEVycm9yU3RyaW5nKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gJydcblxuICAgICAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSlcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldERpYWdub3N0aWMoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJ1xuXG4gICAgICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlLCB0cnVlKVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pXG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoZSBMTVMgc3RhdGUgYW5kIGVuc3VyZXMgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJbml0RXJyb3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIGNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLCBiZWZvcmVJbml0RXJyb3I6IG51bWJlciwgYWZ0ZXJUZXJtRXJyb3I/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfSBlbHNlIGlmIChjaGVja1Rlcm1pbmF0ZWQgJiYgdGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYWZ0ZXJUZXJtRXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9nZ2luZyBmb3IgYWxsIFNDT1JNIGFjdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9bWVzc2FnZUxldmVsXG4gICAgICovXG4gICAgYXBpTG9nKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgbG9nTWVzc2FnZSwgbWVzc2FnZUxldmVsKSB7XG4gICAgICAgIGxldCBjb21taXREYXRhXG4gICAgICAgIGlmICh0eXBlb2YgQ01JRWxlbWVudCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29tbWl0RGF0YSA9IENNSUVsZW1lbnRcbiAgICAgICAgICAgIENNSUVsZW1lbnQgPSAnJ1xuICAgICAgICB9XG4gICAgICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKVxuICAgICAgICBpZiAobWVzc2FnZUxldmVsID49IHRoaXMuYXBpTG9nTGV2ZWwpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZUxldmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfV0FSTklORzpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPOlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8obG9nTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHOlxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhsb2dNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvZ09iamVjdCA9IHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGxvZ01lc3NhZ2UsXG4gICAgICAgICAgICBjb21taXREYXRhOiBjb21taXREYXRhLFxuICAgICAgICAgICAgZXJyb3I6IGAoJHt0aGlzLmxhc3RFcnJvci5lcnJvck1lc3NhZ2V9KWAsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdhcGlMb2cnLCBDTUlFbGVtZW50LCBsb2dPYmplY3QpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRm9ybWF0cyB0aGUgU0NPUk0gbWVzc2FnZXMgZm9yIGVhc3kgcmVhZGluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIG1lc3NhZ2UpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IENNSUVsZW1lbnQgfHwgJydcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJ1xuICAgICAgICBtZXNzYWdlU3RyaW5nICs9IGZ1bmN0aW9uTmFtZVxuICAgICAgICBpZiAoQ01JRWxlbWVudCkge1xuICAgICAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnIDogJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IENNSUVsZW1lbnRCYXNlTGVuZ3RoID0gNzBcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSBDTUlFbGVtZW50XG5cbiAgICAgICAgY29uc3QgZmlsbENoYXJzID0gQ01JRWxlbWVudEJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aFxuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZVN0cmluZyArPSBtZXNzYWdlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVzc2FnZVN0cmluZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0byBzZWUgaWYge3N0cn0gY29udGFpbnMge3Rlc3Rlcn1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGVzdGVyIFN0cmluZyB0byBjaGVjayBmb3JcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0cmluZ01hdGNoZXMoc3RyOiBTdHJpbmcsIHRlc3RlcjogU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHIgJiYgdGVzdGVyICYmIHN0ci5tYXRjaCh0ZXN0ZXIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBzcGVjaWZpYyBvYmplY3QgaGFzIHRoZSBnaXZlbiBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7Kn0gcmVmT2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZTogU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlZk9iamVjdCksIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgICAgIGF0dHJpYnV0ZSBpbiByZWZPYmplY3RcbiAgICAgICAgKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlclxuICAgICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBfZXJyb3JOdW1iZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9kZXRhaWxcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhfZXJyb3JOdW1iZXIsIF9kZXRhaWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqIEBhYnN0cmFjdFxuICAgICAqL1xuICAgIGdldENNSVZhbHVlKF9DTUlFbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGUgc3BlY2lmaWMgZWxlbWVudC5cbiAgICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge2FueX0gX3ZhbHVlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqIEBhYnN0cmFjdFxuICAgICAqL1xuICAgIHNldENNSVZhbHVlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hhcmVkIEFQSSBtZXRob2QgdG8gc2V0IGEgdmFsaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2NvbW1vblNldENNSVZhbHVlKG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJylcbiAgICAgICAgbGV0IHJlZk9iamVjdCA9IHRoaXNcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuICAgICAgICBsZXQgZm91bmRGaXJzdEluZGV4ID0gZmFsc2VcblxuICAgICAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gXG4gICAgICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgPyB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6IHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUxcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldXG4gICAgICAgICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHNjb3JtMjAwNCAmJlxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29ybTIwMDQgfHwgdGhpcy5sYXN0RXJyb3IuZXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZPYmplY3RbYXR0cmlidXRlXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXVxuICAgICAgICAgICAgICAgIGlmICghcmVmT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApXG4gICAgICAgICAgICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdDaGlsZCA9IHRoaXMuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWZPYmplY3QuaW5pdGlhbGl6ZWQpIG5ld0NoaWxkLmluaXRpYWxpemUoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZk9iamVjdC5jaGlsZEFycmF5LnB1c2gobmV3Q2hpbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZk9iamVjdCA9IG5ld0NoaWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgICAgICAgdGhpcy5hcGlMb2coXG4gICAgICAgICAgICAgICAgbWV0aG9kTmFtZSxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIGBUaGVyZSB3YXMgYW4gZXJyb3Igc2V0dGluZyB0aGUgdmFsdWUgZm9yOiAke0NNSUVsZW1lbnR9LCB2YWx1ZSBvZjogJHt2YWx1ZX1gLFxuICAgICAgICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkdcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0IG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGEgcmVzcG9uc2UgaXMgY29ycmVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gX3ZhbHVlXG4gICAgICovXG4gICAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgICAgICAvLyBqdXN0IGEgc3R1YiBtZXRob2RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnQgLSB1bnVzZWRcbiAgICAgKiBAcGFyYW0geyp9IF92YWx1ZSAtIHVudXNlZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2ZvdW5kRmlyc3RJbmRleCAtIHVudXNlZFxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUsIF9mb3VuZEZpcnN0SW5kZXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0Q2hpbGRFbGVtZW50IG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIF9jb21tb25HZXRDTUlWYWx1ZShtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCkge1xuICAgICAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpXG4gICAgICAgIGxldCByZWZPYmplY3QgPSB0aGlzXG4gICAgICAgIGxldCBhdHRyaWJ1dGUgPSBudWxsXG5cbiAgICAgICAgY29uc3QgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQuYFxuICAgICAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gXG4gICAgICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgPyB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6IHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUxcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldXG5cbiAgICAgICAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKFN0cmluZyhhdHRyaWJ1dGUpLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JyAmJiB0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gU3RyaW5nKGF0dHJpYnV0ZSkuc3Vic3RyKDgsIFN0cmluZyhhdHRyaWJ1dGUpLmxlbmd0aCAtIDkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQodGFyZ2V0KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV1cbiAgICAgICAgICAgIGlmIChyZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMClcblxuICAgICAgICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlZBTFVFX05PVF9JTklUSUFMSVpFRCwgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWZPYmplY3QgPT09IG51bGwgfHwgcmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jaGlsZHJlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DSElMRFJFTl9FUlJPUilcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jb3VudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DT1VOVF9FUlJPUilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVmT2JqZWN0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfSU5JVElBTElaRURcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNJbml0aWFsaXplZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX05PVF9JTklUSUFMSVpFRFxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc05vdEluaXRpYWxpemVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfTk9UX0lOSVRJQUxJWkVEXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX1RFUk1JTkFURURcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNUZXJtaW5hdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBhdHRhY2hpbmcgdG8gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgb24obGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdXG5cbiAgICAgICAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbFxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgQ01JRWxlbWVudDogQ01JRWxlbWVudCxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyB0aGlzLmFwaUxvZygnb24nLCBmdW5jdGlvbk5hbWUsIGBBZGRlZCBldmVudCBsaXN0ZW5lcjogJHt0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RofWAsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZXMgYSBtZWNoYW5pc20gZm9yIGRldGFjaGluZyBhIHNwZWNpZmljIFNDT1JNIGV2ZW50IGxpc3RlbmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBvZmYobGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdXG5cbiAgICAgICAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbFxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZW1vdmVJbmRleCA9IHRoaXMubGlzdGVuZXJBcnJheS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgKG9iaikgPT4gb2JqLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lICYmIG9iai5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50ICYmIG9iai5jYWxsYmFjayA9PT0gY2FsbGJhY2tcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGlmIChyZW1vdmVJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyQXJyYXkuc3BsaWNlKHJlbW92ZUluZGV4LCAxKVxuICAgICAgICAgICAgICAgIC8vIHRoaXMuYXBpTG9nKCdvZmYnLCBmdW5jdGlvbk5hbWUsIGBSZW1vdmVkIGV2ZW50IGxpc3RlbmVyOiAke3RoaXMubGlzdGVuZXJBcnJheS5sZW5ndGh9YCwgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgY2xlYXJpbmcgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lck5hbWVcbiAgICAgKi9cbiAgICBjbGVhcihsaXN0ZW5lck5hbWU6IFN0cmluZykge1xuICAgICAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdXG5cbiAgICAgICAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbFxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSB0aGlzLmxpc3RlbmVyQXJyYXkuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChvYmopID0+IG9iai5mdW5jdGlvbk5hbWUgIT09IGZ1bmN0aW9uTmFtZSAmJiBvYmouQ01JRWxlbWVudCAhPT0gQ01JRWxlbWVudFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGFueSAnb24nIGxpc3RlbmVycyB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICovXG4gICAgcHJvY2Vzc0xpc3RlbmVycyhmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXVxuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25zTWF0Y2ggPSBsaXN0ZW5lci5mdW5jdGlvbk5hbWUgPT09IGZ1bmN0aW9uTmFtZVxuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJIYXNDTUlFbGVtZW50ID0gISFsaXN0ZW5lci5DTUlFbGVtZW50XG4gICAgICAgICAgICBsZXQgQ01JRWxlbWVudHNNYXRjaCA9IGZhbHNlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgQ01JRWxlbWVudCAmJlxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQgJiZcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5DTUlFbGVtZW50LnN1YnN0cmluZyhsaXN0ZW5lci5DTUlFbGVtZW50Lmxlbmd0aCAtIDEpID09PSAnKidcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPVxuICAgICAgICAgICAgICAgICAgICBDTUlFbGVtZW50LmluZGV4T2YobGlzdGVuZXIuQ01JRWxlbWVudC5zdWJzdHJpbmcoMCwgbGlzdGVuZXIuQ01JRWxlbWVudC5sZW5ndGggLSAxKSkgPT09IDBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgQ01JRWxlbWVudHNNYXRjaCA9IGxpc3RlbmVyLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZ1bmN0aW9uc01hdGNoICYmICghbGlzdGVuZXJIYXNDTUlFbGVtZW50IHx8IENNSUVsZW1lbnRzTWF0Y2gpKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soQ01JRWxlbWVudCwgdmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yTnVtYmVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICAgKi9cbiAgICB0aHJvd1NDT1JNRXJyb3IoZXJyb3JOdW1iZXI6IG51bWJlciwgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBpTG9nKCd0aHJvd1NDT1JNRXJyb3InLCBudWxsLCBlcnJvck51bWJlciArICc6ICcgKyBtZXNzYWdlLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUilcblxuICAgICAgICB0aGlzLmxhc3RFcnJvciA9IHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyb3JOdW1iZXIsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIGxhc3QgU0NPUk0gZXJyb3IgY29kZSBvbiBzdWNjZXNzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NcbiAgICAgKi9cbiAgICBjbGVhclNDT1JNRXJyb3Ioc3VjY2VzczogU3RyaW5nKSB7XG4gICAgICAgIGlmIChzdWNjZXNzICE9PSB1bmRlZmluZWQgJiYgc3VjY2VzcyAhPT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSBnbG9iYWxfY29uc3RhbnRzLk5PX0VSUk9SXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TLCBsb2dzIGRhdGEgaWYgbm8gTE1TIGNvbmZpZ3VyZWRcbiAgICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9jYWxjdWxhdGVUb3RhbFRpbWVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgc3RvcmVEYXRhKF9jYWxjdWxhdGVUb3RhbFRpbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIENNSSBmcm9tIGEgZmxhdHRlbmVkIEpTT04gb2JqZWN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqL1xuICAgIGxvYWRGcm9tRmxhdHRlbmVkSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xvYWRGcm9tRmxhdHRlbmVkSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3QgbWF0Y2ggcGF0dGVybi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGFcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAgICogQHBhcmFtIHtSZWdFeHB9IGFfcGF0dGVyblxuICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0ZXN0UGF0dGVybihhLCBjLCBhX3BhdHRlcm4pIHtcbiAgICAgICAgICAgIGNvbnN0IGFfbWF0Y2ggPSBhLm1hdGNoKGFfcGF0dGVybilcblxuICAgICAgICAgICAgbGV0IGNfbWF0Y2hcbiAgICAgICAgICAgIGlmIChhX21hdGNoICE9PSBudWxsICYmIChjX21hdGNoID0gYy5tYXRjaChhX3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFfbnVtID0gTnVtYmVyKGFfbWF0Y2hbMl0pXG4gICAgICAgICAgICAgICAgY29uc3QgY19udW0gPSBOdW1iZXIoY19tYXRjaFsyXSlcbiAgICAgICAgICAgICAgICBpZiAoYV9udW0gPT09IGNfbnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhX21hdGNoWzNdID09PSAnaWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhX21hdGNoWzNdID09PSAndHlwZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjX21hdGNoWzNdID09PSAnaWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhX251bSAtIGNfbnVtXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnRfcGF0dGVybiA9IC9eKGNtaVxcLmludGVyYWN0aW9uc1xcLikoXFxkKylcXC4oLiopJC9cbiAgICAgICAgY29uc3Qgb2JqX3BhdHRlcm4gPSAvXihjbWlcXC5vYmplY3RpdmVzXFwuKShcXGQrKVxcLiguKikkL1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5rZXlzKGpzb24pLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gW1N0cmluZyhrZXkpLCBqc29uW2tleV1dXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQ01JIGludGVyYWN0aW9ucyBuZWVkIHRvIGhhdmUgaWQgYW5kIHR5cGUgbG9hZGVkIGJlZm9yZSBhbnkgb3RoZXIgZmllbGRzXG4gICAgICAgIHJlc3VsdC5zb3J0KGZ1bmN0aW9uIChbYSwgYl0sIFtjLCBkXSkge1xuICAgICAgICAgICAgbGV0IHRlc3RcbiAgICAgICAgICAgIGlmICgodGVzdCA9IHRlc3RQYXR0ZXJuKGEsIGMsIGludF9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVzdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0ZXN0ID0gdGVzdFBhdHRlcm4oYSwgYywgb2JqX3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhIDwgYykge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEgPiBjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IG9ialxuICAgICAgICByZXN1bHQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgb2JqID0ge31cbiAgICAgICAgICAgIG9ialtlbGVtZW50WzBdXSA9IGVsZW1lbnRbMV1cbiAgICAgICAgICAgIHRoaXMubG9hZEZyb21KU09OKHVuZmxhdHRlbihvYmopLCBDTUlFbGVtZW50KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIENNSSBkYXRhIGZyb20gYSBKU09OIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKi9cbiAgICBsb2FkRnJvbUpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdsb2FkRnJvbUpTT04gY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIENNSUVsZW1lbnQgPSBDTUlFbGVtZW50ICE9PSB1bmRlZmluZWQgPyBDTUlFbGVtZW50IDogJ2NtaSdcblxuICAgICAgICB0aGlzLnN0YXJ0aW5nRGF0YSA9IGpzb25cblxuICAgICAgICAvLyBjb3VsZCB0aGlzIGJlIHJlZmFjdG9yZWQgZG93biB0byBmbGF0dGVuKGpzb24pIHRoZW4gc2V0Q01JVmFsdWUgb24gZWFjaD9cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q01JRWxlbWVudCA9IChDTUlFbGVtZW50ID8gQ01JRWxlbWVudCArICcuJyA6ICcnKSArIGtleVxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldXG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWVbJ2NoaWxkQXJyYXknXSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlWydjaGlsZEFycmF5J10ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZEZyb21KU09OKHZhbHVlWydjaGlsZEFycmF5J11baV0sIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDTUlWYWx1ZShjdXJyZW50Q01JRWxlbWVudCwgdmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIHRoZSBDTUkgb2JqZWN0IHRvIEpTT04gZm9yIHNlbmRpbmcgdG8gYW4gTE1TLlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICAgICAgY29uc3QgY21pID0gdGhpcy5jbWlcbiAgICAgICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAgICAgLy8gcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgY21pIH0sIChrLCB2KSA9PiB2ID09PSB1bmRlZmluZWQgPyBudWxsIDogdiwgMik7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKUyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IGNtaVxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICByZW5kZXJDTUlUb0pTT05PYmplY3QoKSB7XG4gICAgICAgIC8vIERvIHdlIHdhbnQvbmVlZCB0byByZXR1cm4gZmllbGRzIHRoYXQgaGF2ZSBubyBzZXQgdmFsdWU/XG4gICAgICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnJlbmRlckNNSVRvSlNPTlN0cmluZygpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgcmVuZGVyQ29tbWl0Q01JKF90ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgdGhlIHJlcXVlc3QgdG8gdGhlIExNU1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKiBAcGFyYW0ge29iamVjdHxBcnJheX0gcGFyYW1zXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpbW1lZGlhdGVcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgcHJvY2Vzc0h0dHBSZXF1ZXN0KGNhbGxiYWNrTmFtZSwgdXJsLCBwYXJhbXMsIGltbWVkaWF0ZSA9IGZhbHNlLCBjb21taXRJZCkge1xuICAgICAgICBjb25zdCBwcm9jZXNzID0gKHVybCwgcGFyYW1zLCBzZXR0aW5ncywgZXJyb3JfY29kZXMpID0+IHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHNldHRpbmdzLnJlcXVlc3RIYW5kbGVyKHBhcmFtcylcbiAgICAgICAgICAgIGNvbnN0IGdlbmVyaWNFcnJvciA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UsXG4gICAgICAgICAgICAgICAgZXJyb3JDb2RlOiBlcnJvcl9jb2Rlcy5HRU5FUkFMLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcmVzdWx0XG4gICAgICAgICAgICBpZiAoIXNldHRpbmdzLnNlbmRCZWFjb25Db21taXQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBodHRwUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBzZXR0aW5ncy5hc3luY0NvbW1pdClcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ1BhcmFtc1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ1BhcmFtcyA9IHBhcmFtcy5qb2luKCcmJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxLnNlbmQoc3RyaW5nUGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nUGFyYW1zID0gSlNPTi5zdHJpbmdpZnkocGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBzZXR0aW5ncy5jb21taXRSZXF1ZXN0RGF0YVR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxLnNlbmQoc3RyaW5nUGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5hc3luY0NvbW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIoaHR0cFJlcSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShodHRwUmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdD8ucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSBnbG9iYWxfY29uc3RhbnRzLk5PX0VSUk9SXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdjb21taXRTdWNjZXNzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTogcmVzdWx0LmVycm9yQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTmV0d29yayBSZXF1ZXN0IGZhaWxlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnY29tbWl0RXJyb3InKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaUxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtjYWxsYmFja05hbWV9IFN5bmMgSHR0cFJlcXVlc3RgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04ucGFyc2Uoc3RyaW5nUGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVzdWx0OiAnICsgcmVzdWx0Py5yZXN1bHQgfHwgZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyKGh0dHBSZXEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShodHRwUmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVycm9yID0gZ2xvYmFsX2NvbnN0YW50cy5OT19FUlJPUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdFN1Y2Nlc3MnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb2RlOiByZXN1bHQuZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTmV0d29yayBSZXF1ZXN0IGZhaWxlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpTG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtjYWxsYmFja05hbWV9IEFzeW5jIEh0dHBSZXF1ZXN0YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5wYXJzZShzdHJpbmdQYXJhbXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVzdWx0OiAnICsgcmVzdWx0LnJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GT1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBSZXEub25lcnJvciA9IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlMb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2NhbGxiYWNrTmFtZX0gQXN5bmMgSHR0cFJlcXVlc3RgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZXN1bHQ6ICcgKyBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0RXJyb3InKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9iXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdQYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdQYXJhbXMgPSBwYXJhbXMuam9pbignJicpXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9iID0gbmV3IEJsb2IoW3N0cmluZ1BhcmFtc10sIGhlYWRlcnMpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdQYXJhbXMgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9iID0gbmV3IEJsb2IoW3N0cmluZ1BhcmFtc10sIGhlYWRlcnMpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fVxuICAgICAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBibG9iKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0U3VjY2VzcycpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaUxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2NhbGxiYWNrTmFtZX0gU2VuZEJlYWNvbmAsXG4gICAgICAgICAgICAgICAgICAgICAgICBKU09OLnBhcnNlKHN0cmluZ1BhcmFtcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAncmVzdWx0OiAnICsgcmVzdWx0LnJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk9cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZWJvdW5jZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlYm91bmNlZCA9IGRlYm91bmNlKHByb2Nlc3MsIDUwMClcbiAgICAgICAgICAgIGRlYm91bmNlZCh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2RlcylcblxuICAgICAgICAgICAgLy8gaWYgd2UncmUgdGVybWluYXRpbmcsIGdvIGFoZWFkIGFuZCBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgICAgICBkZWJvdW5jZWQuZmx1c2goKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFLFxuICAgICAgICAgICAgICAgIGVycm9yQ29kZTogMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFjayAtIHRoZSBuYW1lIG9mIHRoZSBjb21taXQgZXZlbnQgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzY2hlZHVsZUNvbW1pdCh3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbiwgY2FsbGJhY2spXG4gICAgICAgIHRoaXMuYXBpTG9nKCdzY2hlZHVsZUNvbW1pdCcsICcnLCAnc2NoZWR1bGVkJywgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICAgKi9cbiAgICBjbGVhclNjaGVkdWxlZENvbW1pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgICAgICAgIHRoaXMuI3RpbWVvdXQuY2FuY2VsKClcbiAgICAgICAgICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsXG4gICAgICAgICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICAgI0FQSVxuICAgICNjYW5jZWxsZWQgPSBmYWxzZVxuICAgICN0aW1lb3V0XG4gICAgI2NhbGxiYWNrXG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgU2NoZWR1bGVkQ29tbWl0XG4gICAgICogQHBhcmFtIHtCYXNlQVBJfSBBUElcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2hlblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jQVBJID0gQVBJXG4gICAgICAgIHRoaXMuI3RpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMud3JhcHBlci5iaW5kKHRoaXMpLCB3aGVuKVxuICAgICAgICB0aGlzLiNjYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FuY2VsIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdFxuICAgICAqL1xuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy4jY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgICBpZiAodGhpcy4jdGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuI3RpbWVvdXQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXcmFwIHRoZSBBUEkgY29tbWl0IGNhbGwgdG8gY2hlY2sgaWYgdGhlIGNhbGwgaGFzIGFscmVhZHkgYmVlbiBjYW5jZWxsZWRcbiAgICAgKi9cbiAgICB3cmFwcGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgICAgICAgdGhpcy4jQVBJLmNvbW1pdCh0aGlzLiNjYWxsYmFjaylcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknXG5pbXBvcnQge1xuICAgIENNSSxcbiAgICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICAgIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICAgIENNSU9iamVjdGl2ZXNPYmplY3QsXG4gICAgTkFWLFxufSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSdcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cydcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJ1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyXG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbFxuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMlxuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMTJBUEkgZXh0ZW5kcyBCYXNlQVBJIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgICAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgLi4ue1xuICAgICAgICAgICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIoc2Nvcm0xMl9lcnJvcl9jb2RlcywgZmluYWxTZXR0aW5ncylcblxuICAgICAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKVxuICAgICAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKVxuXG4gICAgICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMS4yIFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoXG4gICAgICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlXG4gICAgICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlXG4gICAgICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXRcbiAgICAgICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvclxuICAgICAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZ1xuICAgICAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsbXNJbml0aWFsaXplIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgICAqL1xuICAgIGxtc0luaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuY21pLmluaXRpYWxpemUoKVxuICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKCdMTVNJbml0aWFsaXplJywgJ0xNUyB3YXMgYWxyZWFkeSBpbml0aWFsaXplZCEnLCAnTE1TIGlzIGFscmVhZHkgZmluaXNoZWQhJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMTVNGaW5pc2ggZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAgICovXG4gICAgbG1zRmluaXNoKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnTE1TRmluaXNoJywgdHJ1ZSlcblxuICAgICAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5uYXYuZXZlbnQgPT09ICdjb250aW51ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VQcmV2aW91cycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMTVNHZXRWYWx1ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdMTVNHZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnTE1TU2V0VmFsdWUnLCAnTE1TQ29tbWl0JywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExNU0NvbW1pdCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICAgKi9cbiAgICBsbXNDb21taXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1pdCgnTE1TQ29tbWl0JywgZmFsc2UpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTE1TR2V0TGFzdEVycm9yIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignTE1TR2V0TGFzdEVycm9yJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMTVNHZXRFcnJvclN0cmluZyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnTE1TR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTE1TR2V0RGlhZ25vc3RpYyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0xNU0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdnZXRDTUlWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgICAgIGxldCBuZXdDaGlsZFxuXG4gICAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ICYmXG4gICAgICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCsnKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QoKVxuICAgICAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0KClcbiAgICAgICAgfSBlbHNlIGlmICghZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3QoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0NoaWxkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIENvcnJlY3QgUmVzcG9uc2UgdmFsdWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBlcnJvck51bWJlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbiB9ZGV0YWlsXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgICAgICBsZXQgYmFzaWNNZXNzYWdlID0gJ05vIEVycm9yJ1xuICAgICAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICdObyBFcnJvcidcblxuICAgICAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICAgICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpXG4gICAgICAgIGlmIChzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICAgICAgICBiYXNpY01lc3NhZ2UgPSBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZVxuICAgICAgICAgICAgZGV0YWlsTWVzc2FnZSA9IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Njb3JtMTJBUEl9IG5ld0FQSVxuICAgICAqL1xuICAgIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgICAgICAvLyBEYXRhIE1vZGVsXG4gICAgICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAgICovXG4gICAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpXG5cbiAgICAgICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgICAgICAgY21pRXhwb3J0LmNtaS5jb3JlLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKClcbiAgICAgICAgICAgIGNtaUV4cG9ydC5jbWkuY29yZS5zZXNzaW9uX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50U2Vzc2lvblRpbWUoKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICAgICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KVxuICAgICAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KVxuICAgICAgICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBjbWlFeHBvcnRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0b3JlRGF0YShjYWxsYmFja05hbWUsIHRlcm1pbmF0ZUNvbW1pdCwgY29tbWl0SWQpIHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxTdGF0dXMgPSB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXNcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2NvbXBsZXRlZCdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdub3JtYWwnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY21pLmNvcmUuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLm1hc3Rlcnlfb3ZlcnJpZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5zY29yZS5yYXcgIT09ICcnXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGhpcy5jbWkuY29yZS5zY29yZS5yYXcpID49IHBhcnNlRmxvYXQodGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ3Bhc3NlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2ZhaWxlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ2Jyb3dzZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuc3RhcnRpbmdEYXRhPy5jbWk/LmNvcmU/Lmxlc3Nvbl9zdGF0dXMgfHwgJycpID09PSAnJyAmJiBvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdicm93c2VkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCB8fCB0aGlzLnNldHRpbmdzLmFsd2F5c1NlbmRUb3RhbFRpbWUpXG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsKSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrTmFtZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCxcbiAgICAgICAgICAgICAgICBjb21taXRPYmplY3QsXG4gICAgICAgICAgICAgICAgdGVybWluYXRlQ29tbWl0LFxuICAgICAgICAgICAgICAgIGNvbW1pdElkXG4gICAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhbGxiYWNrTmFtZSwgdGVybWluYXRlQ29tbWl0ID8gJyhmaW5hbCknIDogJycsIGNvbW1pdE9iamVjdClcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUVcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknXG5pbXBvcnQge1xuICAgIEFETCxcbiAgICBDTUksXG4gICAgQ01JQ29tbWVudHNPYmplY3QsXG4gICAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gICAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgICBDTUlPYmplY3RpdmVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9zY29ybTIwMDRfY21pJ1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJ1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJ1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnXG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gJy4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cydcbmltcG9ydCBWYWxpZExhbmd1YWdlcyBmcm9tICcuL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMnXG5pbXBvcnQgUmVnZXggZnJvbSAnLi9jb25zdGFudHMvcmVnZXgnXG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0XG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbFxuY29uc3Qgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTIwMDRcbmNvbnN0IGNvcnJlY3RfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmNvcnJlY3RcbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNFxuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTIwMDRBUEkgZXh0ZW5kcyBCYXNlQVBJIHtcbiAgICAjdmVyc2lvbjogJzEuMCdcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAyMDA0IEFQSVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgICAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgLi4ue1xuICAgICAgICAgICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIoc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLCBmaW5hbFNldHRpbmdzKVxuXG4gICAgICAgIHRoaXMuY21pID0gbmV3IENNSSgpXG4gICAgICAgIHRoaXMuYWRsID0gbmV3IEFETCgpXG5cbiAgICAgICAgLy8gUmVuYW1lIGZ1bmN0aW9ucyB0byBtYXRjaCAyMDA0IFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgICAgIHRoaXMuSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLlRlcm1pbmF0ZSA9IHRoaXMubG1zVGVybWluYXRlXG4gICAgICAgIHRoaXMuR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlXG4gICAgICAgIHRoaXMuU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlXG4gICAgICAgIHRoaXMuQ29tbWl0ID0gdGhpcy5sbXNDb21taXRcbiAgICAgICAgdGhpcy5HZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvclxuICAgICAgICB0aGlzLkdldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZ1xuICAgICAgICB0aGlzLkdldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICN2ZXJzaW9uXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCB2ZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jdmVyc2lvblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgICAqL1xuICAgIGxtc0luaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuY21pLmluaXRpYWxpemUoKVxuICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKCdJbml0aWFsaXplJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICAgKi9cbiAgICBsbXNUZXJtaW5hdGUoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdUZXJtaW5hdGUnLCB0cnVlKVxuXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAnX25vbmVfJykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5hZGwubmF2LnJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29udGludWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZVByZXZpb3VzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Nob2ljZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQ2hvaWNlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4aXQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUV4aXQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXhpdEFsbCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlRXhpdEFsbCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhYmFuZG9uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FiYW5kb25BbGwnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUFiYW5kb25BbGwnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1Byb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGxtc0dldFZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnU2V0VmFsdWUnLCAnQ29tbWl0JywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICAgKi9cbiAgICBsbXNDb21taXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1pdCgnQ29tbWl0JylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdHZXRMYXN0RXJyb3InKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGVycm9yTnVtYmVyIGVycm9yIGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdTZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICAgKiBAcmV0dXJuIHthbnl9XG4gICAgICovXG4gICAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICAgICAgbGV0IG5ld0NoaWxkXG5cbiAgICAgICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgICAgIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJylcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHBhcnRzWzJdKVxuICAgICAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgICAgICAgICAgIGlmICghaW50ZXJhY3Rpb24udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0R1cGxpY2F0ZUNob2ljZVJlc3BvbnNlKGludGVyYWN0aW9uLCB2YWx1ZSlcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb24udHlwZV1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tWYWxpZFJlc3BvbnNlVHlwZShyZXNwb25zZV90eXBlLCB2YWx1ZSwgaW50ZXJhY3Rpb24udHlwZSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJbmNvcnJlY3QgUmVzcG9uc2UgVHlwZTogJyArIGludGVyYWN0aW9uLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RFcnJvci5lcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpXG4gICAgICAgIH0gZWxzZSBpZiAoIWZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sZWFybmVyXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNPYmplY3QoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5jb21tZW50c19mcm9tX2xtc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3Q2hpbGRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZm9yIHZhbGlkIHJlc3BvbnNlIHR5cGVzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlX3R5cGVcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW50ZXJhY3Rpb25fdHlwZVxuICAgICAqL1xuICAgIGNoZWNrVmFsaWRSZXNwb25zZVR5cGUocmVzcG9uc2VfdHlwZSwgdmFsdWUsIGludGVyYWN0aW9uX3R5cGUpIHtcbiAgICAgICAgbGV0IG5vZGVzID0gW11cbiAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGU/LmRlbGltaXRlcikge1xuICAgICAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZXNbMF0gPSB2YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA+IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSwgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBmb3IgZHVwbGljYXRlICdjaG9pY2UnIHJlc3BvbnNlcy5cbiAgICAgKiBAcGFyYW0ge0NNSUludGVyYWN0aW9uc09iamVjdH0gaW50ZXJhY3Rpb25cbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICAgKi9cbiAgICBjaGVja0R1cGxpY2F0ZUNob2ljZVJlc3BvbnNlKGludGVyYWN0aW9uLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudFxuICAgICAgICBpZiAoaW50ZXJhY3Rpb24udHlwZSA9PT0gJ2Nob2ljZScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3IuZXJyb3JDb2RlID09PSAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLmNoaWxkQXJyYXlbaV1cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgY29ycmVjdCByZXNwb25zZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKi9cbiAgICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSlcbiAgICAgICAgY29uc3QgcGF0dGVybl9pbmRleCA9IE51bWJlcihwYXJ0c1s0XSlcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF1cblxuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudFxuICAgICAgICB0aGlzLmNoZWNrRHVwbGljYXRlQ2hvaWNlUmVzcG9uc2UoaW50ZXJhY3Rpb24sIHZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbi50eXBlXVxuICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlX3R5cGUubGltaXQgPT09ICd1bmRlZmluZWQnIHx8IGludGVyYWN0aW9uX2NvdW50IDw9IHJlc3BvbnNlX3R5cGUubGltaXQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tWYWxpZFJlc3BvbnNlVHlwZShyZXNwb25zZV90eXBlLCB2YWx1ZSwgaW50ZXJhY3Rpb24udHlwZSlcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICh0aGlzLmxhc3RFcnJvci5lcnJvckNvZGUgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFyZXNwb25zZV90eXBlLmR1cGxpY2F0ZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuY2hlY2tEdXBsaWNhdGVkUGF0dGVybihpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcywgcGF0dGVybl9pbmRleCwgdmFsdWUpKSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5sYXN0RXJyb3IuZXJyb3JDb2RlID09PSAwICYmIHZhbHVlID09PSAnJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcsIHdlIHdhbnQgdGhlIGludmVyc2VcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEVycm9yLmVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIEFscmVhZHkgRXhpc3RzJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoXG4gICAgICAgICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBDb2xsZWN0aW9uIExpbWl0IFJlYWNoZWQnXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGVycm9yTnVtYmVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkZXRhaWxcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnJ1xuICAgICAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICcnXG5cbiAgICAgICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgICAgIGVycm9yTnVtYmVyID0gU3RyaW5nKGVycm9yTnVtYmVyKVxuICAgICAgICBpZiAoc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICAgICAgICBiYXNpY01lc3NhZ2UgPSBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlXG4gICAgICAgICAgICBkZXRhaWxNZXNzYWdlID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2VcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXRhaWwgPyBkZXRhaWxNZXNzYWdlIDogYmFzaWNNZXNzYWdlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdG8gc2VlIGlmIGEgY29ycmVjdF9yZXNwb25zZSB2YWx1ZSBoYXMgYmVlbiBkdXBsaWNhdGVkXG4gICAgICogQHBhcmFtIHtDTUlBcnJheX0gY29ycmVjdF9yZXNwb25zZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50X2luZGV4XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hlY2tEdXBsaWNhdGVkUGF0dGVybiA9IChjb3JyZWN0X3Jlc3BvbnNlLCBjdXJyZW50X2luZGV4LCB2YWx1ZSkgPT4ge1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZVxuICAgICAgICBjb25zdCBjb3VudCA9IGNvcnJlY3RfcmVzcG9uc2UuX2NvdW50XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQgJiYgIWZvdW5kOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpICE9PSBjdXJyZW50X2luZGV4ICYmIGNvcnJlY3RfcmVzcG9uc2UuY2hpbGRBcnJheVtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm91bmRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZm9yIGEgdmFsaWQgY29ycmVjdF9yZXNwb25zZSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbnRlcmFjdGlvbl90eXBlXG4gICAgICogQHBhcmFtIHtBcnJheX0gbm9kZXNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICovXG4gICAgY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbl90eXBlXVxuICAgICAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aCAmJiB0aGlzLmxhc3RFcnJvci5lcnJvckNvZGUgPT09IDA7IGkrKykge1xuICAgICAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUubWF0Y2goJ14oZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZykkJykpIHtcbiAgICAgICAgICAgICAgICBub2Rlc1tpXSA9IHRoaXMucmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZXNbaV0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZT8uZGVsaW1pdGVyMikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlLmRlbGltaXRlcjIpXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlc1swXS5tYXRjaChmb3JtYXRSZWdleClcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleClcbiAgICAgICAgICAgICAgICBpZiAoKCFtYXRjaGVzICYmIHZhbHVlICE9PSAnJykgfHwgKCFtYXRjaGVzICYmIGludGVyYWN0aW9uX3R5cGUgPT09ICd0cnVlLWZhbHNlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdudW1lcmljJyAmJiBub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyKG5vZGVzWzBdKSA+IE51bWJlcihub2Rlc1sxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2UudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpICYmIHRoaXMubGFzdEVycm9yLmVycm9yQ29kZSA9PT0gMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHByZWZpeGVzIGZyb20gY29ycmVjdF9yZXNwb25zZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICByZW1vdmVDb3JyZWN0UmVzcG9uc2VQcmVmaXhlcyhub2RlKSB7XG4gICAgICAgIGxldCBzZWVuT3JkZXIgPSBmYWxzZVxuICAgICAgICBsZXQgc2VlbkNhc2UgPSBmYWxzZVxuICAgICAgICBsZXQgc2VlbkxhbmcgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHByZWZpeFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXih7KGxhbmd8Y2FzZV9tYXR0ZXJzfG9yZGVyX21hdHRlcnMpPShbXn1dKyl9KScpXG4gICAgICAgIGxldCBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleClcbiAgICAgICAgbGV0IGxhbmdNYXRjaGVzID0gbnVsbFxuICAgICAgICB3aGlsZSAobWF0Y2hlcykge1xuICAgICAgICAgICAgc3dpdGNoIChtYXRjaGVzWzJdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGFuZyc6XG4gICAgICAgICAgICAgICAgICAgIGxhbmdNYXRjaGVzID0gbm9kZS5tYXRjaChzY29ybTIwMDRfcmVnZXguQ01JTGFuZ2NyKVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFuZ01hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhbmcgPSBsYW5nTWF0Y2hlc1szXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhbmcgIT09IHVuZGVmaW5lZCAmJiBsYW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmFsaWRMYW5ndWFnZXNbbGFuZy50b0xvd2VyQ2FzZSgpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWVuTGFuZyA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdjYXNlX21hdHRlcnMnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlZW5MYW5nICYmICFzZWVuT3JkZXIgJiYgIXNlZW5DYXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlZW5DYXNlID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ29yZGVyX21hdHRlcnMnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlZW5DYXNlICYmICFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlZW5PcmRlciA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZSA9IG5vZGUuc3Vic3RyKG1hdGNoZXNbMV0ubGVuZ3RoKVxuICAgICAgICAgICAgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICAgKiBAcGFyYW0ge1Njb3JtMjAwNEFQSX0gbmV3QVBJXG4gICAgICovXG4gICAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgICAgIC8vIERhdGEgTW9kZWxcbiAgICAgICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pXG4gICAgICAgIHRoaXMuYWRsID0gbmV3QVBJLmFkbFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAgICovXG4gICAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpXG5cbiAgICAgICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgICAgICAgY21pRXhwb3J0LmNtaS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpXG4gICAgICAgICAgICBjbWlFeHBvcnQuY21pLnNlc3Npb25fdGltZSA9IHRoaXMuY21pLmdldEN1cnJlbnRTZXNzaW9uVGltZSgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXVxuICAgICAgICBjb25zdCBmbGF0dGVuZWQgPSBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpXG4gICAgICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5kYXRhQ29tbWl0Rm9ybWF0KSB7XG4gICAgICAgICAgICBjYXNlICdmbGF0dGVuZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpXG4gICAgICAgICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNtaUV4cG9ydFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNU1xuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RvcmVEYXRhKGNhbGxiYWNrTmFtZSwgdGVybWluYXRlQ29tbWl0LCBjb21taXRJZCkge1xuICAgICAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkubW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbWkuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQgJiYgdGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY21pLnByb2dyZXNzX21lYXN1cmUgPj0gdGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIENvbXBsZXRpb24gU3RhdHVzOiBDb21wbGV0ZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2NvbXBsZXRlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBDb21wbGV0aW9uIFN0YXR1czogSW5jb21wbGV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnaW5jb21wbGV0ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUgJiYgdGhpcy5jbWkuc2NvcmUuc2NhbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbWkuc2NvcmUuc2NhbGVkID49IHRoaXMuY21pLnNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBTdWNjZXNzIFN0YXR1czogUGFzc2VkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdwYXNzZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgU3VjY2VzcyBTdGF0dXM6IEZhaWxlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbWkuc3VjY2Vzc19zdGF0dXMgPSAnZmFpbGVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5hdlJlcXVlc3QgPSBmYWxzZVxuICAgICAgICBpZiAodGhpcy5hZGwubmF2LnJlcXVlc3QgIT09IHRoaXMuc3RhcnRpbmdEYXRhPy5hZGw/Lm5hdj8ucmVxdWVzdCAmJiB0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgICAgICAgIHRoaXMuYWRsLm5hdi5yZXF1ZXN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuYWRsLm5hdi5yZXF1ZXN0KVxuICAgICAgICAgICAgbmF2UmVxdWVzdCA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCB8fCB0aGlzLnNldHRpbmdzLmFsd2F5c1NlbmRUb3RhbFRpbWUpXG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcGlMb2dMZXZlbCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGNhbGxiYWNrTmFtZSwgdGVybWluYXRlQ29tbWl0ID8gJyhmaW5hbCknIDogJycsIGNvbW1pdE9iamVjdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrTmFtZSxcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCxcbiAgICAgICAgICAgICAgICBjb21taXRPYmplY3QsXG4gICAgICAgICAgICAgICAgdGVybWluYXRlQ29tbWl0LFxuICAgICAgICAgICAgICAgIGNvbW1pdElkXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBzZXF1ZW5jaW5nIGNhbGwsIGFuZCB0aGVuIGNhbGwgdGhlIG5lY2Vzc2FyeSBKU1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChuYXZSZXF1ZXN0ICYmIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0Lm5hdlJlcXVlc3QgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIEZ1bmN0aW9uKGBcInVzZSBzdHJpY3RcIjsoKCkgPT4geyAke3Jlc3VsdC5uYXZSZXF1ZXN0fSB9KSgpYCkoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhbGxiYWNrTmFtZSwgdGVybWluYXRlQ29tbWl0ID8gJyhmaW5hbCknIDogJycsIGNvbW1pdE9iamVjdClcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUVcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIFNjb3JtMTJDTUkgZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5pbXBvcnQge0Jhc2VDTUksIENNSUFycmF5LCBDTUlTY29yZX0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1xuICBjaGVjazEyVmFsaWRGb3JtYXQsXG4gIHRocm93UmVhZE9ubHlFcnJvcixcbn0gZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5cbmNvbnN0IGFpY2NfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmFpY2M7XG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3QgYWljY19yZWdleCA9IFJlZ2V4LmFpY2M7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIENNSSBDbGFzcyBmb3IgQUlDQ1xuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgQ01JIG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLmNtaV9jaGlsZHJlbik7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQUlDQ1N0dWRlbnRQcmVmZXJlbmNlcygpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gbmV3IEFJQ0NDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3MgPSBuZXcgQ01JU3R1ZGVudERlbW9ncmFwaGljcygpO1xuICAgIHRoaXMuZXZhbHVhdGlvbiA9IG5ldyBDTUlFdmFsdWF0aW9uKCk7XG4gICAgdGhpcy5wYXRocyA9IG5ldyBDTUlQYXRocygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuZXZhbHVhdGlvbj8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucGF0aHM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnMsXG4gICAqICAgICAgcGF0aHM6IENNSVBhdGhzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnc3R1ZGVudF9kZW1vZ3JhcGhpY3MnOiB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2V2YWx1YXRpb24nOiB0aGlzLmV2YWx1YXRpb24sXG4gICAgICAncGF0aHMnOiB0aGlzLnBhdGhzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29tbWVudHMgPSBuZXcgQ01JRXZhbHVhdGlvbkNvbW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmFsdWF0aW9uIG9iamVjdFxuICAgKiBAcmV0dXJuIHt7Y29tbWVudHM6IENNSUV2YWx1YXRpb25Db21tZW50c319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIEFJQ0MncyBjbWkuZXZhbHVhdGlvbi5jb21tZW50cyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50cyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yTWVzc2FnZTogc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUVdLmRldGFpbE1lc3NhZ2UsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50UHJlZmVyZW5jZXMgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ1N0dWRlbnRQcmVmZXJlbmNlcyBleHRlbmRzIFNjb3JtMTJDTUkuQ01JU3R1ZGVudFByZWZlcmVuY2Uge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudCBQcmVmZXJlbmNlcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLndpbmRvd3MgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgIGNoaWxkcmVuOiAnJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy53aW5kb3dzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjbGVzc29uX3R5cGUgPSAnJztcbiAgI3RleHRfY29sb3IgPSAnJztcbiAgI3RleHRfbG9jYXRpb24gPSAnJztcbiAgI3RleHRfc2l6ZSA9ICcnO1xuICAjdmlkZW8gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl90eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl90eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl90eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fdHlwZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl90eXBlKGxlc3Nvbl90eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl90eXBlLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl90eXBlID0gbGVzc29uX3R5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfY29sb3JcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfY29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2NvbG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2NvbG9yXG4gICAqL1xuICBzZXQgdGV4dF9jb2xvcih0ZXh0X2NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHRfY29sb3IsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9jb2xvciA9IHRleHRfY29sb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfbG9jYXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2xvY2F0aW9uXG4gICAqL1xuICBzZXQgdGV4dF9sb2NhdGlvbih0ZXh0X2xvY2F0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHRfbG9jYXRpb24sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9sb2NhdGlvbiA9IHRleHRfbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfc2l6ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dF9zaXplKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHRfc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X3NpemVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRfc2l6ZVxuICAgKi9cbiAgc2V0IHRleHRfc2l6ZSh0ZXh0X3NpemU6IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dF9zaXplLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfc2l6ZSA9IHRleHRfc2l6ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmlkZW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZpZGVvKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3ZpZGVvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ZpZGVvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2aWRlb1xuICAgKi9cbiAgc2V0IHZpZGVvKHZpZGVvOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHZpZGVvLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3ZpZGVvID0gdmlkZW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBzcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIHRleHQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW8nOiB0aGlzLmF1ZGlvLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdsZXNzb25fdHlwZSc6IHRoaXMubGVzc29uX3R5cGUsXG4gICAgICAnc3BlZWQnOiB0aGlzLnNwZWVkLFxuICAgICAgJ3RleHQnOiB0aGlzLnRleHQsXG4gICAgICAndGV4dF9jb2xvcic6IHRoaXMudGV4dF9jb2xvcixcbiAgICAgICd0ZXh0X2xvY2F0aW9uJzogdGhpcy50ZXh0X2xvY2F0aW9uLFxuICAgICAgJ3RleHRfc2l6ZSc6IHRoaXMudGV4dF9zaXplLFxuICAgICAgJ3ZpZGVvJzogdGhpcy52aWRlbyxcbiAgICAgICd3aW5kb3dzJzogdGhpcy53aW5kb3dzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudERhdGEgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ0NNSVN0dWRlbnREYXRhIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50RGF0YSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGF0YSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLnRyaWVzID0gbmV3IENNSVRyaWVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMudHJpZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICN0cmllc19kdXJpbmdfbGVzc29uID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHJpZXNfZHVyaW5nX2xlc3NvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0cmllc19kdXJpbmdfbGVzc29uLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKi9cbiAgc2V0IHRyaWVzX2R1cmluZ19sZXNzb24odHJpZXNfZHVyaW5nX2xlc3Nvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbiA9IHRyaWVzX2R1cmluZ19sZXNzb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRyaWVzOiBDTUlUcmllc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0cmllcyc6IHRoaXMudHJpZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGVtb2dyYXBoaWNzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERlbW9ncmFwaGljcyBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudERlbW9ncmFwaGljcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gYWljY19jb25zdGFudHMuc3R1ZGVudF9kZW1vZ3JhcGhpY3NfY2hpbGRyZW47XG4gICNjaXR5ID0gJyc7XG4gICNjbGFzcyA9ICcnO1xuICAjY29tcGFueSA9ICcnO1xuICAjY291bnRyeSA9ICcnO1xuICAjZXhwZXJpZW5jZSA9ICcnO1xuICAjZmFtaWxpYXJfbmFtZSA9ICcnO1xuICAjaW5zdHJ1Y3Rvcl9uYW1lID0gJyc7XG4gICN0aXRsZSA9ICcnO1xuICAjbmF0aXZlX2xhbmd1YWdlID0gJyc7XG4gICNzdGF0ZSA9ICcnO1xuICAjc3RyZWV0X2FkZHJlc3MgPSAnJztcbiAgI3RlbGVwaG9uZSA9ICcnO1xuICAjeWVhcnNfZXhwZXJpZW5jZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNpdHlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NpdHk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY2l0eS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNpdHlcbiAgICovXG4gIHNldCBjaXR5KGNpdHkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NpdHkgPSBjaXR5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjbGFzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NsYXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhenpcbiAgICovXG4gIHNldCBjbGFzcyhjbGF6eikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY2xhc3MgPSBjbGF6eiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY29tcGFueVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGFueSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wYW55LiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGFueVxuICAgKi9cbiAgc2V0IGNvbXBhbnkoY29tcGFueSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tcGFueSA9IGNvbXBhbnkgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvdW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvdW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvdW50cnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY291bnRyeS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvdW50cnlcbiAgICovXG4gIHNldCBjb3VudHJ5KGNvdW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvdW50cnkgPSBjb3VudHJ5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBleHBlcmllbmNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBleHBlcmllbmNlKCkge1xuICAgIHJldHVybiB0aGlzLiNleHBlcmllbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4cGVyaWVuY2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHBlcmllbmNlXG4gICAqL1xuICBzZXQgZXhwZXJpZW5jZShleHBlcmllbmNlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNleHBlcmllbmNlID0gZXhwZXJpZW5jZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgZmFtaWxpYXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZmFtaWxpYXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZmFtaWxpYXJfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNmYW1pbGlhcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmFtaWxpYXJfbmFtZVxuICAgKi9cbiAgc2V0IGZhbWlsaWFyX25hbWUoZmFtaWxpYXJfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jZmFtaWxpYXJfbmFtZSA9IGZhbWlsaWFyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGluc3RydWN0b3JfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaW5zdHJ1Y3Rvcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNpbnN0cnVjdG9yX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaW5zdHJ1Y3Rvcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5zdHJ1Y3Rvcl9uYW1lXG4gICAqL1xuICBzZXQgaW5zdHJ1Y3Rvcl9uYW1lKGluc3RydWN0b3JfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jaW5zdHJ1Y3Rvcl9uYW1lID0gaW5zdHJ1Y3Rvcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0aXRsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpdGxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpdGxlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICovXG4gIHNldCB0aXRsZSh0aXRsZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGl0bGUgPSB0aXRsZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgbmF0aXZlX2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBuYXRpdmVfbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hdGl2ZV9sYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNuYXRpdmVfbGFuZ3VhZ2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYXRpdmVfbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBuYXRpdmVfbGFuZ3VhZ2UobmF0aXZlX2xhbmd1YWdlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNuYXRpdmVfbGFuZ3VhZ2UgPSBuYXRpdmVfbGFuZ3VhZ2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHN0YXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdGUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdGF0ZSA9IHN0YXRlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBzdHJlZXRfYWRkcmVzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RyZWV0X2FkZHJlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0cmVldF9hZGRyZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0cmVldF9hZGRyZXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyZWV0X2FkZHJlc3NcbiAgICovXG4gIHNldCBzdHJlZXRfYWRkcmVzcyhzdHJlZXRfYWRkcmVzcykge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3RyZWV0X2FkZHJlc3MgPSBzdHJlZXRfYWRkcmVzcyA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGVsZXBob25lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZWxlcGhvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RlbGVwaG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZWxlcGhvbmUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZWxlcGhvbmVcbiAgICovXG4gIHNldCB0ZWxlcGhvbmUodGVsZXBob25lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0ZWxlcGhvbmUgPSB0ZWxlcGhvbmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHllYXJzX2V4cGVyaWVuY2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHllYXJzX2V4cGVyaWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3llYXJzX2V4cGVyaWVuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjeWVhcnNfZXhwZXJpZW5jZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHllYXJzX2V4cGVyaWVuY2VcbiAgICovXG4gIHNldCB5ZWFyc19leHBlcmllbmNlKHllYXJzX2V4cGVyaWVuY2UpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3llYXJzX2V4cGVyaWVuY2UgPSB5ZWFyc19leHBlcmllbmNlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICAgIHtcbiAgICogICAgICAgIGNpdHk6IHN0cmluZyxcbiAgICogICAgICAgIGNsYXNzOiBzdHJpbmcsXG4gICAqICAgICAgICBjb21wYW55OiBzdHJpbmcsXG4gICAqICAgICAgICBjb3VudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgICBleHBlcmllbmNlOiBzdHJpbmcsXG4gICAqICAgICAgICBmYW1pbGlhcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgICBpbnN0cnVjdG9yX25hbWU6IHN0cmluZyxcbiAgICogICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAqICAgICAgICBuYXRpdmVfbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICAgIHN0YXRlOiBzdHJpbmcsXG4gICAqICAgICAgICBzdHJlZXRfYWRkcmVzczogc3RyaW5nLFxuICAgKiAgICAgICAgdGVsZXBob25lOiBzdHJpbmcsXG4gICAqICAgICAgICB5ZWFyc19leHBlcmllbmNlOiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjaXR5JzogdGhpcy5jaXR5LFxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzcyxcbiAgICAgICdjb21wYW55JzogdGhpcy5jb21wYW55LFxuICAgICAgJ2NvdW50cnknOiB0aGlzLmNvdW50cnksXG4gICAgICAnZXhwZXJpZW5jZSc6IHRoaXMuZXhwZXJpZW5jZSxcbiAgICAgICdmYW1pbGlhcl9uYW1lJzogdGhpcy5mYW1pbGlhcl9uYW1lLFxuICAgICAgJ2luc3RydWN0b3JfbmFtZSc6IHRoaXMuaW5zdHJ1Y3Rvcl9uYW1lLFxuICAgICAgJ3RpdGxlJzogdGhpcy50aXRsZSxcbiAgICAgICduYXRpdmVfbGFuZ3VhZ2UnOiB0aGlzLm5hdGl2ZV9sYW5ndWFnZSxcbiAgICAgICdzdGF0ZSc6IHRoaXMuc3RhdGUsXG4gICAgICAnc3RyZWV0X2FkZHJlc3MnOiB0aGlzLnN0cmVldF9hZGRyZXNzLFxuICAgICAgJ3RlbGVwaG9uZSc6IHRoaXMudGVsZXBob25lLFxuICAgICAgJ3llYXJzX2V4cGVyaWVuY2UnOiB0aGlzLnllYXJzX2V4cGVyaWVuY2UsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnBhdGhzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFBhdGhzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7Y2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnBhdGhzX2NoaWxkcmVufSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBQYXRoc1xuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFBhdGhzIG9iamVjdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjbG9jYXRpb25faWQgPSAnJztcbiAgI2RhdGUgPSAnJztcbiAgI3RpbWUgPSAnJztcbiAgI3N0YXR1cyA9ICcnO1xuICAjd2h5X2xlZnQgPSAnJztcbiAgI3RpbWVfaW5fZWxlbWVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvbl9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb25faWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uX2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbl9pZFxuICAgKi9cbiAgc2V0IGxvY2F0aW9uX2lkKGxvY2F0aW9uX2lkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsb2NhdGlvbl9pZCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbl9pZCA9IGxvY2F0aW9uX2lkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkYXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLiNkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGVcbiAgICovXG4gIHNldCBkYXRlKGRhdGUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGRhdGUsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jZGF0ZSA9IGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2h5X2xlZnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdoeV9sZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLiN3aHlfbGVmdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3aHlfbGVmdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2h5X2xlZnRcbiAgICovXG4gIHNldCB3aHlfbGVmdCh3aHlfbGVmdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQod2h5X2xlZnQsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jd2h5X2xlZnQgPSB3aHlfbGVmdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9pbl9lbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2luX2VsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfaW5fZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2luX2VsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfaW5fZWxlbWVudFxuICAgKi9cbiAgc2V0IHRpbWVfaW5fZWxlbWVudCh0aW1lX2luX2VsZW1lbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWVfaW5fZWxlbWVudCwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZV9pbl9lbGVtZW50ID0gdGltZV9pbl9lbGVtZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5wYXRocy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGxvY2F0aW9uX2lkOiBzdHJpbmcsXG4gICAqICAgICAgZGF0ZTogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB3aHlfbGVmdDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfaW5fZWxlbWVudDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdsb2NhdGlvbl9pZCc6IHRoaXMubG9jYXRpb25faWQsXG4gICAgICAnZGF0ZSc6IHRoaXMuZGF0ZSxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3doeV9sZWZ0JzogdGhpcy53aHlfbGVmdCxcbiAgICAgICd0aW1lX2luX2VsZW1lbnQnOiB0aGlzLnRpbWVfaW5fZWxlbWVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7Y2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnRyaWVzX2NoaWxkcmVufSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBUcmllc1xuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFRyaWVzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkVHlwZU1lc3NhZ2U6IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0hdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgaW52YWxpZFJhbmdlTWVzc2FnZTogc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3N0YXR1cyA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YS50cmllcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGNtaS5zdHVkZW50X2RhdGEuYXR0ZW1wdF9yZWNvcmRzIGFycmF5XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBdHRlbXB0UmVjb3JkcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBpbmxpbmUgVHJpZXMgQXJyYXkgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtjaGlsZHJlbjogYWljY19jb25zdGFudHMuYXR0ZW1wdF9yZWNvcmRzX2NoaWxkcmVufSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBBdHRlbXB0IFJlY29yZHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBBdHRlbXB0IFJlY29yZHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogYWljY19yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRFcnJvck1lc3NhZ2U6IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRUeXBlTWVzc2FnZTogc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSF0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0VdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjbGVzc29uX3N0YXR1cyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICovXG4gIHNldCBsZXNzb25fc3RhdHVzKGxlc3Nvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEuYXR0ZW1wdF9yZWNvcmRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbGVzc29uX3N0YXR1cyc6IHRoaXMubGVzc29uX3N0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBFdmFsdWF0aW9uIENvbW1lbnRzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2NvbnRlbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKi9cbiAgc2V0IGNvbnRlbnQoY29udGVudCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoY29udGVudCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNjb250ZW50ID0gY29udGVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobG9jYXRpb24sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0aW5nIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YXVsYXRpb24uY29tbWVudHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbnRlbnQnOiB0aGlzLmNvbnRlbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIGZvcm1hdC4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBlcnJvck1lc3NhZ2U6IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhQYXR0ZXJuKTtcbiAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgaWYgKGFsbG93RW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgIW1hdGNoZXMgfHwgbWF0Y2hlc1swXSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSwgZXJyb3JNZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsIGVycm9yQ29kZTogbnVtYmVyLCBlcnJvck1lc3NhZ2U6IFN0cmluZykge1xuICBjb25zdCByYW5nZXMgPSByYW5nZVBhdHRlcm4uc3BsaXQoJyMnKTtcbiAgdmFsdWUgPSB2YWx1ZSAqIDEuMDtcbiAgaWYgKHZhbHVlID49IHJhbmdlc1swXSkge1xuICAgIGlmICgocmFuZ2VzWzFdID09PSAnKicpIHx8ICh2YWx1ZSA8PSByYW5nZXNbMV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUsIGVycm9yTWVzc2FnZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlLCBlcnJvck1lc3NhZ2UpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVBJIGNtaSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ01JIHtcbiAganNvblN0cmluZyA9IGZhbHNlO1xuICAjaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgI3N0YXJ0X3RpbWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhcnRfdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnRfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhcnRfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsYXllciBzaG91bGQgb3ZlcnJpZGUgdGhlICdzZXNzaW9uX3RpbWUnIHByb3ZpZGVkIGJ5XG4gICAqIHRoZSBtb2R1bGVcbiAgICovXG4gIHNldFN0YXJ0VGltZSgpIHtcbiAgICB0aGlzLiNzdGFydF90aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnZhbGlkRXJyb3JNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludmFsaWRUeXBlTWVzc2FnZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFJhbmdlQ29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW52YWxpZFJhbmdlTWVzc2FnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVjaW1hbFJlZ2V4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHtcbiAgICAgICAgc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JlX3JhbmdlLFxuICAgICAgICBtYXgsXG4gICAgICAgIGludmFsaWRFcnJvckNvZGUsXG4gICAgICAgIGludmFsaWRFcnJvck1lc3NhZ2UsXG4gICAgICAgIGludmFsaWRUeXBlQ29kZSxcbiAgICAgICAgaW52YWxpZFR5cGVNZXNzYWdlLFxuICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlLFxuICAgICAgICBpbnZhbGlkUmFuZ2VNZXNzYWdlLFxuICAgICAgICBkZWNpbWFsUmVnZXgsXG4gICAgICB9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHNjb3JlX2NoaWxkcmVuIHx8XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuO1xuICAgIHRoaXMuI19zY29yZV9yYW5nZSA9ICFzY29yZV9yYW5nZSA/IGZhbHNlIDogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZTtcbiAgICB0aGlzLiNtYXggPSAobWF4IHx8IG1heCA9PT0gJycpID8gbWF4IDogJzEwMCc7XG4gICAgdGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSA9IGludmFsaWRFcnJvckNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRTtcbiAgICB0aGlzLiNfaW52YWxpZF9lcnJvcl9tZXNzYWdlID0gaW52YWxpZEVycm9yTWVzc2FnZSB8fFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZTtcbiAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUgPSBpbnZhbGlkVHlwZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIO1xuICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfbWVzc2FnZSA9IGludmFsaWRUeXBlTWVzc2FnZSB8fFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIXS5kZXRhaWxNZXNzYWdlO1xuICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUgPSBpbnZhbGlkUmFuZ2VDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFO1xuICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX21lc3NhZ2UgPSBpbnZhbGlkUmFuZ2VNZXNzYWdlIHx8XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRV0uZGV0YWlsTWVzc2FnZTtcbiAgICB0aGlzLiNfZGVjaW1hbF9yZWdleCA9IGRlY2ltYWxSZWdleCB8fFxuICAgICAgICBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWw7XG4gIH1cblxuICAjX2NoaWxkcmVuO1xuICAjX3Njb3JlX3JhbmdlO1xuICAjX2ludmFsaWRfZXJyb3JfY29kZTtcbiAgI19pbnZhbGlkX2Vycm9yX21lc3NhZ2U7XG4gICNfaW52YWxpZF90eXBlX2NvZGU7XG4gICNfaW52YWxpZF90eXBlX21lc3NhZ2U7XG4gICNfaW52YWxpZF9yYW5nZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfbWVzc2FnZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUsIHRoaXMuI19pbnZhbGlkX2Vycm9yX21lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jhd1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiB0aGlzLiNyYXc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmF3XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByYXdcbiAgICovXG4gIHNldCByYXcocmF3KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQocmF3LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlLCB0aGlzLiNfaW52YWxpZF90eXBlX21lc3NhZ2UpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UocmF3LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfbWVzc2FnZSkpKSB7XG4gICAgICB0aGlzLiNyYXcgPSByYXc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21pblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWluKCkge1xuICAgIHJldHVybiB0aGlzLiNtaW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWluXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtaW5cbiAgICovXG4gIHNldCBtaW4obWluKSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWluLCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlLCB0aGlzLiNfaW52YWxpZF90eXBlX21lc3NhZ2UpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWluLCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfbWVzc2FnZSkpKSB7XG4gICAgICB0aGlzLiNtaW4gPSBtaW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLiNtYXg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhcbiAgICovXG4gIHNldCBtYXgobWF4KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWF4LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlLCB0aGlzLiNfaW52YWxpZF90eXBlX21lc3NhZ2UpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWF4LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfbWVzc2FnZSkpKSB7XG4gICAgICB0aGlzLiNtYXggPSBtYXg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5zY29yZVxuICAgKiBAcmV0dXJuIHt7bWluOiBzdHJpbmcsIG1heDogc3RyaW5nLCByYXc6IHN0cmluZ319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmF3JzogdGhpcy5yYXcsXG4gICAgICAnbWluJzogdGhpcy5taW4sXG4gICAgICAnbWF4JzogdGhpcy5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5uIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUFycmF5IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBjbWkgKi5uIGFycmF5c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JNZXNzYWdlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7Y2hpbGRyZW4sIGVycm9yQ29kZSwgZXJyb3JNZXNzYWdlfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICAgIHRoaXMuI2Vycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZTtcbiAgICB0aGlzLmNoaWxkQXJyYXkgPSBbXTtcbiAgfVxuXG4gICNlcnJvckNvZGU7XG4gICNlcnJvck1lc3NhZ2U7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlLCB0aGlzLiNlcnJvck1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NvdW50XG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBfY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY291bnQuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NvdW50XG4gICAqL1xuICBzZXQgX2NvdW50KF9jb3VudCkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlLCB0aGlzLiNlcnJvck1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5uIGFycmF5c1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W2kgKyAnJ10gPSB0aGlzLmNoaWxkQXJyYXlbaV07XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7IEJhc2VDTUksIGNoZWNrVmFsaWRGb3JtYXQsIGNoZWNrVmFsaWRSYW5nZSwgQ01JQXJyYXksIENNSVNjb3JlIH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJ1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJ1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCdcbmltcG9ydCB7IFZhbGlkYXRpb25FcnJvciB9IGZyb20gJy4uL2V4Y2VwdGlvbnMnXG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vdXRpbGl0aWVzJ1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuLi91dGlsaXRpZXMnXG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTJcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyXG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyXG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlRdLmRldGFpbE1lc3NhZ2VcbiAgICApXG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UXS5kZXRhaWxNZXNzYWdlXG4gICAgKVxufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIEludmFsaWQgU2V0IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUVdLmRldGFpbE1lc3NhZ2VcbiAgICApXG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRGb3JtYXQodmFsdWU6IFN0cmluZywgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICByZWdleFBhdHRlcm4sXG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSF0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgYWxsb3dFbXB0eVN0cmluZ1xuICAgIClcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nLCBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICAgIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICByYW5nZVBhdHRlcm4sXG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0VdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgIGFsbG93RW1wdHlTdHJpbmdcbiAgICApXG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkgb2JqZWN0IGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIEJhc2VDTUkge1xuICAgICNfY2hpbGRyZW4gPSAnJ1xuICAgICNfdmVyc2lvbiA9ICczLjQnXG4gICAgI2xhdW5jaF9kYXRhID0gJydcbiAgICAjY29tbWVudHMgPSAnJ1xuICAgICNjb21tZW50c19mcm9tX2xtcyA9ICcnXG5cbiAgICBzdHVkZW50X2RhdGEgPSBudWxsXG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDEuMiBjbWkgb2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNtaV9jaGlsZHJlblxuICAgICAqIEBwYXJhbSB7KENNSVN0dWRlbnREYXRhfEFJQ0NDTUlTdHVkZW50RGF0YSl9IHN0dWRlbnRfZGF0YVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihjbWlfY2hpbGRyZW4sIHN0dWRlbnRfZGF0YSwgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKClcblxuICAgICAgICB0aGlzLiNfY2hpbGRyZW4gPSBjbWlfY2hpbGRyZW4gPyBjbWlfY2hpbGRyZW4gOiBzY29ybTEyX2NvbnN0YW50cy5jbWlfY2hpbGRyZW5cbiAgICAgICAgdGhpcy5jb3JlID0gbmV3IENNSUNvcmUoKVxuICAgICAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpXG4gICAgICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gc3R1ZGVudF9kYXRhID8gc3R1ZGVudF9kYXRhIDogbmV3IENNSVN0dWRlbnREYXRhKClcbiAgICAgICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQ01JU3R1ZGVudFByZWZlcmVuY2UoKVxuICAgICAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgIHRoaXMuY29yZT8uaW5pdGlhbGl6ZSgpXG4gICAgICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpXG4gICAgICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKClcbiAgICAgICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKVxuICAgICAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9KU09OIGZvciBjbWlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1xuICAgICAqICAgIHtcbiAgICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHN1c3BlbmRfZGF0YTogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAgICAgICBsYXVuY2hfZGF0YTogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICAgICAgIGNvbW1lbnRzOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAgICAgICBjb3JlOiB0aGlzLmNvcmUsXG4gICAgICAgICAgICBvYmplY3RpdmVzOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAgICAgICBzdHVkZW50X2RhdGE6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICAgICAgIGludGVyYWN0aW9uczogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuanNvblN0cmluZ1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IF92ZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb25cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IF92ZXJzaW9uXG4gICAgICovXG4gICAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgX2NoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICAgKi9cbiAgICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgICAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29yZT8uc3VzcGVuZF9kYXRhXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgICAqL1xuICAgIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmNvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuY29yZS5zdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYXVuY2hfZGF0YVxuICAgICAqL1xuICAgIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiNsYXVuY2hfZGF0YSA9IGxhdW5jaF9kYXRhKSA6IHRocm93UmVhZE9ubHlFcnJvcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjY29tbWVudHNcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGNvbW1lbnRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jY29tbWVudHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c1xuICAgICAqL1xuICAgIHNldCBjb21tZW50cyhjb21tZW50cykge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbW1lbnRzLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzQwOTYsIHRydWUpKSB7XG4gICAgICAgICAgICB0aGlzLiNjb21tZW50cyA9IGNvbW1lbnRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtc1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgY29tbWVudHNfZnJvbV9sbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNjb21tZW50c19mcm9tX2xtc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudHNfZnJvbV9sbXNcbiAgICAgKi9cbiAgICBzZXQgY29tbWVudHNfZnJvbV9sbXMoY29tbWVudHNfZnJvbV9sbXMpIHtcbiAgICAgICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyAodGhpcy4jY29tbWVudHNfZnJvbV9sbXMgPSBjb21tZW50c19mcm9tX2xtcykgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0Q3VycmVudFRvdGFsVGltZSh0aGlzLnN0YXJ0X3RpbWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSBnZW5lcmF0ZWQgYnkgdGhlIGxtcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50U2Vzc2lvblRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0Q3VycmVudFNlc3Npb25UaW1lKHRoaXMuc3RhcnRfdGltZSlcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkuY29yZSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuY2xhc3MgQ01JQ29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29yZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZSh7XG4gICAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgICBpbnZhbGlkRXJyb3JNZXNzYWdlOlxuICAgICAgICAgICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgICBpbnZhbGlkVHlwZU1lc3NhZ2U6IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0hdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICAgIGludmFsaWRSYW5nZU1lc3NhZ2U6XG4gICAgICAgICAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKVxuICAgIH1cblxuICAgICNfY2hpbGRyZW4gPSBzY29ybTEyX2NvbnN0YW50cy5jb3JlX2NoaWxkcmVuXG4gICAgI3N0dWRlbnRfaWQgPSAnJ1xuICAgICNzdHVkZW50X25hbWUgPSAnJ1xuICAgICNsZXNzb25fbG9jYXRpb24gPSAnJ1xuICAgICNjcmVkaXQgPSAnJ1xuICAgICNsZXNzb25fc3RhdHVzID0gJ25vdCBhdHRlbXB0ZWQnXG4gICAgI2VudHJ5ID0gJydcbiAgICAjdG90YWxfdGltZSA9ICcnXG4gICAgI2xlc3Nvbl9tb2RlID0gJ25vcm1hbCdcbiAgICAjZXhpdCA9ICcnXG4gICAgI3Nlc3Npb25fdGltZSA9ICcwMDowMDowMCdcbiAgICAjc3VzcGVuZF9kYXRhID0gJydcblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3N0dWRlbnRfaWRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0dWRlbnRfaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzdHVkZW50X2lkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfaWRcbiAgICAgKi9cbiAgICBzZXQgc3R1ZGVudF9pZChzdHVkZW50X2lkKSB7XG4gICAgICAgICF0aGlzLmluaXRpYWxpemVkID8gKHRoaXMuI3N0dWRlbnRfaWQgPSBzdHVkZW50X2lkKSA6IHRocm93UmVhZE9ubHlFcnJvcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBzdHVkZW50X25hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzdHVkZW50X25hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X25hbWVcbiAgICAgKi9cbiAgICBzZXQgc3R1ZGVudF9uYW1lKHN0dWRlbnRfbmFtZSkge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiNzdHVkZW50X25hbWUgPSBzdHVkZW50X25hbWUpIDogdGhyb3dSZWFkT25seUVycm9yKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGxlc3Nvbl9sb2NhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9sb2NhdGlvblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbG9jYXRpb25cbiAgICAgKi9cbiAgICBzZXQgbGVzc29uX2xvY2F0aW9uKGxlc3Nvbl9sb2NhdGlvbikge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9sb2NhdGlvbiwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmcyNTYsIHRydWUpKSB7XG4gICAgICAgICAgICB0aGlzLiNsZXNzb25fbG9jYXRpb24gPSBsZXNzb25fbG9jYXRpb25cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI2NyZWRpdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgY3JlZGl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jY3JlZGl0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjY3JlZGl0LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAgICovXG4gICAgc2V0IGNyZWRpdChjcmVkaXQpIHtcbiAgICAgICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyAodGhpcy4jY3JlZGl0ID0gY3JlZGl0KSA6IHRocm93UmVhZE9ubHlFcnJvcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9zdGF0dXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICAgKi9cbiAgICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1c1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGVudHJ5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZW50cnlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAgICovXG4gICAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgICAgICF0aGlzLmluaXRpYWxpemVkID8gKHRoaXMuI2VudHJ5ID0gZW50cnkpIDogdGhyb3dSZWFkT25seUVycm9yKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCB0b3RhbF90aW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3RhbF90aW1lXG4gICAgICovXG4gICAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiN0b3RhbF90aW1lID0gdG90YWxfdGltZSkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI2xlc3Nvbl9tb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBsZXNzb25fbW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9tb2RlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjbGVzc29uX21vZGUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgICAqL1xuICAgIHNldCBsZXNzb25fbW9kZShsZXNzb25fbW9kZSkge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlKSA6IHRocm93UmVhZE9ubHlFcnJvcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGdldCBleGl0KCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuanNvblN0cmluZyA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNleGl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICAgKi9cbiAgICBzZXQgZXhpdChleGl0KSB7XG4gICAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXhpdCwgc2Nvcm0xMl9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy4jZXhpdCA9IGV4aXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5qc29uU3RyaW5nID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc2Vzc2lvbl90aW1lXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgICAqL1xuICAgIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCBzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICAgKi9cbiAgICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmc0MDk2LCB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRfdGltZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50VG90YWxUaW1lKHN0YXJ0X3RpbWU6IE51bWJlcikge1xuICAgICAgICBsZXQgc2Vzc2lvblRpbWUgPSB0aGlzLiNzZXNzaW9uX3RpbWVcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRfdGltZVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhcnRUaW1lICE9PSAndW5kZWZpbmVkJyAmJiBzdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZVxuICAgICAgICAgICAgc2Vzc2lvblRpbWUgPSBVdGlsLmdldFNlY29uZHNBc0hITU1TUyhzZWNvbmRzIC8gMTAwMClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuYWRkSEhNTVNTVGltZVN0cmluZ3ModGhpcy4jdG90YWxfdGltZSwgc2Vzc2lvblRpbWUsIG5ldyBSZWdFeHAoc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjdXJyZW50IHNlc3Npb24gdGltZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRfdGltZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50U2Vzc2lvblRpbWUoc3RhcnRfdGltZTogTnVtYmVyKSB7XG4gICAgICAgIGxldCBzZXNzaW9uVGltZSA9IHRoaXMuI3Nlc3Npb25fdGltZVxuICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydF90aW1lXG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdGFydFRpbWUgIT09ICd1bmRlZmluZWQnICYmIHN0YXJ0VGltZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kcyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lXG4gICAgICAgICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSEhNTVNTKHNlY29uZHMgLyAxMDAwKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXNzaW9uVGltZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvSlNPTiBmb3IgY21pLmNvcmVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1xuICAgICAqICAgIHtcbiAgICAgKiAgICAgIHN0dWRlbnRfbmFtZTogc3RyaW5nLFxuICAgICAqICAgICAgZW50cnk6IHN0cmluZyxcbiAgICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZSxcbiAgICAgKiAgICAgIHN0dWRlbnRfaWQ6IHN0cmluZyxcbiAgICAgKiAgICAgIGxlc3Nvbl9tb2RlOiBzdHJpbmcsXG4gICAgICogICAgICBsZXNzb25fbG9jYXRpb246IHN0cmluZyxcbiAgICAgKiAgICAgIGxlc3Nvbl9zdGF0dXM6IHN0cmluZyxcbiAgICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgICAqICAgICAgc2Vzc2lvbl90aW1lOiAqXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHN0dWRlbnRfaWQ6IHRoaXMuc3R1ZGVudF9pZCxcbiAgICAgICAgICAgIHN0dWRlbnRfbmFtZTogdGhpcy5zdHVkZW50X25hbWUsXG4gICAgICAgICAgICBsZXNzb25fbG9jYXRpb246IHRoaXMubGVzc29uX2xvY2F0aW9uLFxuICAgICAgICAgICAgY3JlZGl0OiB0aGlzLmNyZWRpdCxcbiAgICAgICAgICAgIGxlc3Nvbl9zdGF0dXM6IHRoaXMubGVzc29uX3N0YXR1cyxcbiAgICAgICAgICAgIGVudHJ5OiB0aGlzLmVudHJ5LFxuICAgICAgICAgICAgbGVzc29uX21vZGU6IHRoaXMubGVzc29uX21vZGUsXG4gICAgICAgICAgICBleGl0OiB0aGlzLmV4aXQsXG4gICAgICAgICAgICBzZXNzaW9uX3RpbWU6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgICAgICAgc2NvcmU6IHRoaXMuc2NvcmUsXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuanNvblN0cmluZ1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqIEBleHRlbmRzIENNSUFycmF5XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGF0YSBleHRlbmRzIEJhc2VDTUkge1xuICAgICNfY2hpbGRyZW5cbiAgICAjbWFzdGVyeV9zY29yZSA9ICcnXG4gICAgI21heF90aW1lX2FsbG93ZWQgPSAnJ1xuICAgICN0aW1lX2xpbWl0X2FjdGlvbiA9ICcnXG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2RhdGFfY2hpbGRyZW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdHVkZW50X2RhdGFfY2hpbGRyZW4pIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA/IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA6IHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXQgX2NoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgICAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNtYXN0ZXJfc2NvcmVcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IG1hc3Rlcnlfc2NvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWFzdGVyeV9zY29yZVxuICAgICAqL1xuICAgIHNldCBtYXN0ZXJ5X3Njb3JlKG1hc3Rlcnlfc2NvcmUpIHtcbiAgICAgICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyAodGhpcy4jbWFzdGVyeV9zY29yZSA9IG1hc3Rlcnlfc2NvcmUpIDogdGhyb3dSZWFkT25seUVycm9yKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbWF4X3RpbWVfYWxsb3dlZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAgICovXG4gICAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgICAqL1xuICAgIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICAgICAhdGhpcy5pbml0aWFsaXplZCA/ICh0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uKSA6IHRocm93UmVhZE9ubHlFcnJvcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtcbiAgICAgKiAgICB7XG4gICAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIG1hc3Rlcnlfc2NvcmU6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmdcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLnN0dWRlbnRfcHJlZmVyZW5jZSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVN0dWRlbnRQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gICAgI19jaGlsZHJlblxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLiNfY2hpbGRyZW4gPSBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW5cbiAgICAgICAgICAgID8gc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuXG4gICAgICAgICAgICA6IHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlblxuICAgIH1cblxuICAgICNhdWRpbyA9ICcnXG4gICAgI2xhbmd1YWdlID0gJydcbiAgICAjc3BlZWQgPSAnJ1xuICAgICN0ZXh0ID0gJydcblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI2F1ZGlvXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBhdWRpbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2F1ZGlvXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjYXVkaW9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9cbiAgICAgKi9cbiAgICBzZXQgYXVkaW8oYXVkaW8pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkRm9ybWF0KGF1ZGlvLCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2UoYXVkaW8sIHNjb3JtMTJfcmVnZXguYXVkaW9fcmFuZ2UpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpb1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGxhbmd1YWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgICAqL1xuICAgIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhbmd1YWdlLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgICAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3NwZWVkXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NwZWVkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc3BlZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3BlZWRcbiAgICAgKi9cbiAgICBzZXQgc3BlZWQoc3BlZWQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkRm9ybWF0KHNwZWVkLCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uoc3BlZWQsIHNjb3JtMTJfcmVnZXguc3BlZWRfcmFuZ2UpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3RleHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICAgKi9cbiAgICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dCwgc2Nvcm0xMl9yZWdleC5DTUlTSW50ZWdlcikgJiYgY2hlY2sxMlZhbGlkUmFuZ2UodGV4dCwgc2Nvcm0xMl9yZWdleC50ZXh0X3JhbmdlKSkge1xuICAgICAgICAgICAgdGhpcy4jdGV4dCA9IHRleHRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgICAqXG4gICAgICogQHJldHVybiB7XG4gICAgICogICAge1xuICAgICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAgICogICAgICBzcGVlZDogc3RyaW5nLFxuICAgICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGF1ZGlvOiB0aGlzLmF1ZGlvLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAgICAgICBzcGVlZDogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudGV4dCxcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUVdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICAgKi9cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICBzdXBlci5pbml0aWFsaXplKClcbiAgICAgICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKClcbiAgICAgICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpXG4gICAgfVxuXG4gICAgI2lkID0gJydcbiAgICAjdGltZSA9ICcnXG4gICAgI3R5cGUgPSAnJ1xuICAgICN3ZWlnaHRpbmcgPSAnJ1xuICAgICNzdHVkZW50X3Jlc3BvbnNlID0gJydcbiAgICAjcmVzdWx0ID0gJydcbiAgICAjbGF0ZW5jeSA9ICcnXG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNpZC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGdldCBpZCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpzb25TdHJpbmcgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNpZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI2lkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAgICovXG4gICAgc2V0IGlkKGlkKSB7XG4gICAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoaWQsIHNjb3JtMTJfcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHRoaXMuI2lkID0gaWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBnZXQgdGltZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpzb25TdHJpbmcgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjdGltZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAgICovXG4gICAgc2V0IHRpbWUodGltZSkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgICAgICAgIHRoaXMuI3RpbWUgPSB0aW1lXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICN0eXBlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5qc29uU3RyaW5nID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdHlwZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgICAqL1xuICAgIHNldCB0eXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0eXBlLCBzY29ybTEyX3JlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLiN0eXBlID0gdHlwZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjd2VpZ2h0aW5nLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgZ2V0IHdlaWdodGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpzb25TdHJpbmcgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN3ZWlnaHRpbmdcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAgICovXG4gICAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uod2VpZ2h0aW5nLCBzY29ybTEyX3JlZ2V4LndlaWdodGluZ19yYW5nZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2UuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBnZXQgc3R1ZGVudF9yZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpzb25TdHJpbmcgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzdHVkZW50X3Jlc3BvbnNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X3Jlc3BvbnNlXG4gICAgICovXG4gICAgc2V0IHN0dWRlbnRfcmVzcG9uc2Uoc3R1ZGVudF9yZXNwb25zZSkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0dWRlbnRfcmVzcG9uc2UsIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICAgICAgICB0aGlzLiNzdHVkZW50X3Jlc3BvbnNlID0gc3R1ZGVudF9yZXNwb25zZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjcmVzdWx0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgZ2V0IHJlc3VsdCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpzb25TdHJpbmcgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAgICovXG4gICAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMTJfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgZ2V0IGxhdGVuY3koKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5qc29uU3RyaW5nID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jbGF0ZW5jeVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgICAqL1xuICAgIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsYXRlbmN5LCBzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3lcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtcbiAgICAgKiAgICB7XG4gICAgICogICAgICBpZDogc3RyaW5nLFxuICAgICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAgICogICAgICBzdHVkZW50X3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5XG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgdGltZTogdGhpcy50aW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgICAgd2VpZ2h0aW5nOiB0aGlzLndlaWdodGluZyxcbiAgICAgICAgICAgIHN0dWRlbnRfcmVzcG9uc2U6IHRoaXMuc3R1ZGVudF9yZXNwb25zZSxcbiAgICAgICAgICAgIHJlc3VsdDogdGhpcy5yZXN1bHQsXG4gICAgICAgICAgICBsYXRlbmN5OiB0aGlzLmxhdGVuY3ksXG4gICAgICAgICAgICBvYmplY3RpdmVzOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAgICAgICBjb3JyZWN0X3Jlc3BvbnNlczogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoe1xuICAgICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgICAgc2NvcmVfcmFuZ2U6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgICAgaW52YWxpZEVycm9yTWVzc2FnZTpcbiAgICAgICAgICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgICAgaW52YWxpZFR5cGVNZXNzYWdlOiBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgICBpbnZhbGlkUmFuZ2VNZXNzYWdlOlxuICAgICAgICAgICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAjaWQgPSAnJ1xuICAgICNzdGF0dXMgPSAnJ1xuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjaWRcbiAgICAgKiBAcmV0dXJuIHtcIlwifVxuICAgICAqL1xuICAgIGdldCBpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICAgKi9cbiAgICBzZXQgaWQoaWQpIHtcbiAgICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgdGhpcy4jaWQgPSBpZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAgICogQHJldHVybiB7XCJcIn1cbiAgICAgKi9cbiAgICBnZXQgc3RhdHVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jc3RhdHVzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgICAqL1xuICAgIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICAgICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvSlNPTiBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgICAqIEByZXR1cm4ge1xuICAgICAqICAgIHtcbiAgICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgICAqICAgIH1cbiAgICAgKiAgfVxuICAgICAqL1xuICAgIHRvSlNPTigpIHtcbiAgICAgICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZVxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICBzY29yZTogdGhpcy5zY29yZSxcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgIH1cblxuICAgICNpZCA9ICcnXG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgICAqIEByZXR1cm4ge1wiXCJ9XG4gICAgICovXG4gICAgZ2V0IGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgICAqL1xuICAgIHNldCBpZChpZCkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICB0aGlzLiNpZCA9IGlkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICAgKiBAcmV0dXJuIHtcbiAgICAgKiAgICB7XG4gICAgICogICAgICBpZDogc3RyaW5nXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmdcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgIH1cblxuICAgICNwYXR0ZXJuID0gJydcblxuICAgIC8qKlxuICAgICAqIEdldHRlciBmb3IgI3BhdHRlcm5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5qc29uU3RyaW5nID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jcGF0dGVyblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICAgICAqL1xuICAgIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChwYXR0ZXJuLCBzY29ybTEyX3JlZ2V4LkNNSUZlZWRiYWNrLCB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uXG4gICAgICogQHJldHVybiB7XG4gICAgICogICAge1xuICAgICAqICAgICAgcGF0dGVybjogc3RyaW5nXG4gICAgICogICAgfVxuICAgICAqICB9XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHBhdHRlcm46IHRoaXMucGF0dGVybixcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgTmF2aWdhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIE5BViBleHRlbmRzIEJhc2VDTUkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBOQVYgb2JqZWN0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICB9XG5cbiAgICAjZXZlbnQgPSAnJ1xuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciAjZXZlbnRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGV2ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZXZlbnRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0ZXIgZm9yICNldmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgICAqL1xuICAgIHNldCBldmVudChldmVudCkge1xuICAgICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV2ZW50LCBzY29ybTEyX3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy4jZXZlbnQgPSBldmVudFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9KU09OIGZvciBuYXYgb2JqZWN0XG4gICAgICogQHJldHVybiB7XG4gICAgICogICAge1xuICAgICAqICAgICAgZXZlbnQ6IHN0cmluZ1xuICAgICAqICAgIH1cbiAgICAgKiAgfVxuICAgICAqL1xuICAgIHRvSlNPTigpIHtcbiAgICAgICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZVxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlc3BvbnNlcyBmcm9tICcuLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgc2Nvcm0yMDA0X2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQ7XG5jb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMjAwNDtcbmNvbnN0IGxlYXJuZXJfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmxlYXJuZXI7XG5cbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UXS5kZXRhaWxNZXNzYWdlXG4gICk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCxcbiAgICAgIHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlRdLmRldGFpbE1lc3NhZ2VcbiAgKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBUeXBlIE1pc21hdGNoIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgIHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIXS5kZXRhaWxNZXNzYWdlXG4gICk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCxcbiAgICAgIHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRF0uZGV0YWlsTWVzc2FnZVxuICApO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93R2VuZXJhbFNldEVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRV0uZGV0YWlsTWVzc2FnZVxuICApO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgIHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFXS5kZXRhaWxNZXNzYWdlKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgY21pIG9iamVjdCBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDIwMDQgY21pIG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZSA9IG5ldyBDTUlMZWFybmVyUHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lciA9IG5ldyBDTUlDb21tZW50c0Zyb21MZWFybmVyKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcyA9IG5ldyBDTUlDb21tZW50c0Zyb21MTVMoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfdmVyc2lvbiA9ICcxLjAnO1xuICAjX2NoaWxkcmVuID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5jbWlfY2hpbGRyZW47XG4gICNjb21wbGV0aW9uX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI2NvbXBsZXRpb25fdGhyZXNob2xkID0gJyc7XG4gICNjcmVkaXQgPSAnY3JlZGl0JztcbiAgI2VudHJ5ID0gJyc7XG4gICNleGl0ID0gJyc7XG4gICNsYXVuY2hfZGF0YSA9ICcnO1xuICAjbGVhcm5lcl9pZCA9ICcnO1xuICAjbGVhcm5lcl9uYW1lID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjbWF4X3RpbWVfYWxsb3dlZCA9ICcnO1xuICAjbW9kZSA9ICdub3JtYWwnO1xuICAjcHJvZ3Jlc3NfbWVhc3VyZSA9ICcnO1xuICAjc2NhbGVkX3Bhc3Npbmdfc2NvcmUgPSAnJztcbiAgI3Nlc3Npb25fdGltZSA9ICdQVDBIME0wUyc7XG4gICNzdWNjZXNzX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI3N1c3BlbmRfZGF0YSA9ICcnO1xuICAjdGltZV9saW1pdF9hY3Rpb24gPSAnY29udGludWUsbm8gbWVzc2FnZSc7XG4gICN0b3RhbF90aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lcj8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sbXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JQ1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzID0gY29tcGxldGlvbl9zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fdGhyZXNob2xkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3RocmVzaG9sZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl90aHJlc2hvbGQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3RocmVzaG9sZChjb21wbGV0aW9uX3RocmVzaG9sZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tcGxldGlvbl90aHJlc2hvbGQgPSBjb21wbGV0aW9uX3RocmVzaG9sZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY3JlZGl0KCkge1xuICAgIHJldHVybiB0aGlzLiNjcmVkaXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNyZWRpdFxuICAgKi9cbiAgc2V0IGNyZWRpdChjcmVkaXQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2NyZWRpdCA9IGNyZWRpdCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2VudHJ5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBlbnRyeSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZW50cnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZW50cnkuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZW50cnlcbiAgICovXG4gIHNldCBlbnRyeShlbnRyeSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jZW50cnkgPSBlbnRyeSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V4aXQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZXhpdCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUV4aXQsIHRydWUpKSB7XG4gICAgICB0aGlzLiNleGl0ID0gZXhpdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF1bmNoX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdW5jaF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXVuY2hfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXVuY2hfZGF0YS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXVuY2hfZGF0YVxuICAgKi9cbiAgc2V0IGxhdW5jaF9kYXRhKGxhdW5jaF9kYXRhKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsYXVuY2hfZGF0YSA9IGxhdW5jaF9kYXRhIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX2lkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfaWRcbiAgICovXG4gIHNldCBsZWFybmVyX2lkKGxlYXJuZXJfaWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlYXJuZXJfaWQgPSBsZWFybmVyX2lkIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9uYW1lXG4gICAqL1xuICBzZXQgbGVhcm5lcl9uYW1lKGxlYXJuZXJfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbGVhcm5lcl9uYW1lID0gbGVhcm5lcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzEwMDApKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXhfdGltZV9hbGxvd2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4X3RpbWVfYWxsb3dlZFxuICAgKi9cbiAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbWF4X3RpbWVfYWxsb3dlZCA9IG1heF90aW1lX2FsbG93ZWQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNtb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21vZGUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgKi9cbiAgc2V0IG1vZGUobW9kZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbW9kZSA9IG1vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzY2FsZWRfcGFzc2luZ19zY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkX3Bhc3Npbmdfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICovXG4gIHNldCBzY2FsZWRfcGFzc2luZ19zY29yZShzY2FsZWRfcGFzc2luZ19zY29yZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc2NhbGVkX3Bhc3Npbmdfc2NvcmUgPSBzY2FsZWRfcGFzc2luZ19zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNlc3Npb25fdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc2Vzc2lvbl90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Nlc3Npb25fdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vzc2lvbl90aW1lXG4gICAqL1xuICBzZXQgc2Vzc2lvbl90aW1lKHNlc3Npb25fdGltZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1Y2Nlc3Nfc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdWNjZXNzX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc19zdGF0dXNcbiAgICovXG4gIHNldCBzdWNjZXNzX3N0YXR1cyhzdWNjZXNzX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdWNjZXNzX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNzdWNjZXNzX3N0YXR1cyA9IHN1Y2Nlc3Nfc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VzcGVuZF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VzcGVuZF9kYXRhXG4gICAqL1xuICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdXNwZW5kX2RhdGEsIHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc2NDAwMCxcbiAgICAgICAgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfbGltaXRfYWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgKi9cbiAgc2V0IHRpbWVfbGltaXRfYWN0aW9uKHRpbWVfbGltaXRfYWN0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gSVNPODYwMSBEdXJhdGlvblxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICBsZXQgc2Vzc2lvblRpbWUgPSB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gdGhpcy5zdGFydF90aW1lO1xuXG4gICAgaWYgKHR5cGVvZiBzdGFydFRpbWUgIT09ICd1bmRlZmluZWQnICYmIHN0YXJ0VGltZSAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2Vjb25kcyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lO1xuICAgICAgc2Vzc2lvblRpbWUgPSBVdGlsLmdldFNlY29uZHNBc0lTT0R1cmF0aW9uKHNlY29uZHMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbC5hZGRUd29EdXJhdGlvbnMoXG4gICAgICAgIHRoaXMuI3RvdGFsX3RpbWUsXG4gICAgICAgIHNlc3Npb25UaW1lLFxuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JVGltZXNwYW4sXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgc2Vzc2lvbl90aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElTTzg2MDEgRHVyYXRpb25cbiAgICovXG4gIGdldEN1cnJlbnRTZXNzaW9uVGltZSgpIHtcbiAgICBsZXQgc2Vzc2lvblRpbWUgPSB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gdGhpcy5zdGFydF90aW1lO1xuXG4gICAgaWYgKHR5cGVvZiBzdGFydFRpbWUgIT09ICd1bmRlZmluZWQnICYmIHN0YXJ0VGltZSAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2Vjb25kcyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lO1xuICAgICAgc2Vzc2lvblRpbWUgPSBVdGlsLmdldFNlY29uZHNBc0lTT0R1cmF0aW9uKHNlY29uZHMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2Vzc2lvblRpbWVcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbGVhcm5lcjogQ01JQ29tbWVudHNGcm9tTGVhcm5lcixcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogQ01JQ29tbWVudHNGcm9tTE1TLFxuICAgKiAgICAgIGNvbXBsZXRpb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl90aHJlc2hvbGQ6IHN0cmluZyxcbiAgICogICAgICBjcmVkaXQ6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9ucyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfaWQ6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX25hbWU6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3ByZWZlcmVuY2U6IENNSUxlYXJuZXJQcmVmZXJlbmNlLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIG1vZGU6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHByb2dyZXNzX21lYXN1cmU6IHN0cmluZyxcbiAgICogICAgICBzY2FsZWRfcGFzc2luZ19zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBTY29ybTIwMDRDTUlTY29yZSxcbiAgICogICAgICBzZXNzaW9uX3RpbWU6IHN0cmluZyxcbiAgICogICAgICBzdWNjZXNzX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzX2Zyb21fbGVhcm5lcic6IHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl90aHJlc2hvbGQnOiB0aGlzLmNvbXBsZXRpb25fdGhyZXNob2xkLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdsZWFybmVyX2lkJzogdGhpcy5sZWFybmVyX2lkLFxuICAgICAgJ2xlYXJuZXJfbmFtZSc6IHRoaXMubGVhcm5lcl9uYW1lLFxuICAgICAgJ2xlYXJuZXJfcHJlZmVyZW5jZSc6IHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlLFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ21vZGUnOiB0aGlzLm1vZGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ3NjYWxlZF9wYXNzaW5nX3Njb3JlJzogdGhpcy5zY2FsZWRfcGFzc2luZ19zY29yZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgICAnc2Vzc2lvbl90aW1lJzogdGhpcy5zZXNzaW9uX3RpbWUsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pLmxlYXJuZXJfcHJlZmVyZW5jZSBvYmplY3RcbiAqL1xuY2xhc3MgQ01JTGVhcm5lclByZWZlcmVuY2UgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9IHNjb3JtMjAwNF9jb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuO1xuICAjYXVkaW9fbGV2ZWwgPSAnMSc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjZGVsaXZlcnlfc3BlZWQgPSAnMSc7XG4gICNhdWRpb19jYXB0aW9uaW5nID0gJzAnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmxlYXJuZXJfcHJlZmVyZW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2xldmVsKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpb19sZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19sZXZlbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fbGV2ZWxcbiAgICovXG4gIHNldCBhdWRpb19sZXZlbChhdWRpb19sZXZlbCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19sZXZlbCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fbGV2ZWwsIHNjb3JtMjAwNF9yZWdleC5hdWRpb19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvX2xldmVsID0gYXVkaW9fbGV2ZWw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAqL1xuICBzZXQgbGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nKSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlbGl2ZXJ5X3NwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNkZWxpdmVyeV9zcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVsaXZlcnlfc3BlZWRcbiAgICovXG4gIHNldCBkZWxpdmVyeV9zcGVlZChkZWxpdmVyeV9zcGVlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZWxpdmVyeV9zcGVlZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoZGVsaXZlcnlfc3BlZWQsIHNjb3JtMjAwNF9yZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkID0gZGVsaXZlcnlfc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2NhcHRpb25pbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2NhcHRpb25pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fY2FwdGlvbmluZ1xuICAgKi9cbiAgc2V0IGF1ZGlvX2NhcHRpb25pbmcoYXVkaW9fY2FwdGlvbmluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19jYXB0aW9uaW5nLCBzY29ybTIwMDRfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fY2FwdGlvbmluZywgc2Nvcm0yMDA0X3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19jYXB0aW9uaW5nID0gYXVkaW9fY2FwdGlvbmluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW9fbGV2ZWw6IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIGRlbGl2ZXJ5X3NwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgYXVkaW9fY2FwdGlvbmluZzogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpb19sZXZlbCc6IHRoaXMuYXVkaW9fbGV2ZWwsXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2RlbGl2ZXJ5X3NwZWVkJzogdGhpcy5kZWxpdmVyeV9zcGVlZCxcbiAgICAgICdhdWRpb19jYXB0aW9uaW5nJzogdGhpcy5hdWRpb19jYXB0aW9uaW5nLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zIG9iamVjdFxuICovXG5jbGFzcyBDTUlJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmludGVyYWN0aW9uc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlRdLmRldGFpbE1lc3NhZ2UsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICBlcnJvck1lc3NhZ2U6IHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVF0uZGV0YWlsTWVzc2FnZSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbG1zIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MTVMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlRdLmRldGFpbE1lc3NhZ2UsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxlYXJuZXIgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGVycm9yTWVzc2FnZTogc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UXS5kZXRhaWxNZXNzYWdlLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb24ubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNsZWFybmVyX3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb24ublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGVycm9yTWVzc2FnZTogc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JNZXNzYWdlOiBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUVdLmRldGFpbE1lc3NhZ2UsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodHlwZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICAgIHRoaXMuI3R5cGUgPSB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZXN0YW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodGltZXN0YW1wLCBzY29ybTIwMDRfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQod2VpZ2h0aW5nLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkpIHtcbiAgICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX3Jlc3BvbnNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX3Jlc3BvbnNlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX3Jlc3BvbnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2UuIERvZXMgdHlwZSB2YWxpZGF0aW9uIHRvIG1ha2Ugc3VyZSByZXNwb25zZVxuICAgKiBtYXRjaGVzIFNDT1JNIDIwMDQncyBzcGVjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX3Jlc3BvbnNlXG4gICAqL1xuICBzZXQgbGVhcm5lcl9yZXNwb25zZShsZWFybmVyX3Jlc3BvbnNlKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgKHRoaXMuI3R5cGUgPT09ICcnIHx8IHRoaXMuI2lkID09PSAnJykpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICBjb25zdCByZXNwb25zZV90eXBlID0gbGVhcm5lcl9yZXNwb25zZXNbdGhpcy50eXBlXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIpIHtcbiAgICAgICAgICBub2RlcyA9IGxlYXJuZXJfcmVzcG9uc2Uuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzWzBdID0gbGVhcm5lcl9yZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgobm9kZXMubGVuZ3RoID4gMCkgJiYgKG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkpIHtcbiAgICAgICAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQpO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyMik7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmICghbm9kZXNbaV0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2VfdHlwZS51bmlxdWUpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3dHZW5lcmFsU2V0RXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2UgPSBsZWFybmVyX3Jlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAqL1xuICBzZXQgcmVzdWx0KHJlc3VsdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMjAwNF9yZWdleC5DTUlSZXN1bHQpKSB7XG4gICAgICB0aGlzLiNyZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgICB0aGlzLiNsYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgICAgICAgIHRydWUpKSB7XG4gICAgICAgIHRoaXMuI2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICB0eXBlOiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JQXJyYXksXG4gICAqICAgICAgdGltZXN0YW1wOiBzdHJpbmcsXG4gICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHdlaWdodGluZzogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcmVzcG9uc2U6IHN0cmluZyxcbiAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICogICAgICBsYXRlbmN5OiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdsZWFybmVyX3Jlc3BvbnNlJzogdGhpcy5sZWFybmVyX3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ2NvcnJlY3RfcmVzcG9uc2VzJzogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG4gICNzdWNjZXNzX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjcHJvZ3Jlc3NfbWVhc3VyZSA9ICcnO1xuICAjZGVzY3JpcHRpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IFNjb3JtMjAwNENNSVNjb3JlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCBzY29ybTIwMDRfcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvd0RlcGVuZGVuY3lOb3RFc3RhYmxpc2hlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdWNjZXNzX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNTdGF0dXMpKSB7XG4gICAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JQ1N0YXR1cykpIHtcbiAgICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJvZ3Jlc3NfbWVhc3VyZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9ncmVzc19tZWFzdXJlXG4gICAqL1xuICBzZXQgcHJvZ3Jlc3NfbWVhc3VyZShwcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvd0RlcGVuZGVuY3lOb3RFc3RhYmxpc2hlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHByb2dyZXNzX21lYXN1cmUsXG4gICAgICAgICAgICAgIHNjb3JtMjAwNF9yZWdleC5wcm9ncmVzc19yYW5nZSkpIHtcbiAgICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlc2NyaXB0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MCxcbiAgICAgICAgICB0cnVlKSkge1xuICAgICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pICouc2NvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIFNjb3JtMjAwNENNSVNjb3JlIGV4dGVuZHMgQ01JU2NvcmUge1xuICAjc2NhbGVkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkgKi5zY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBtYXg6ICcnLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JNZXNzYWdlOiBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlRdLmRldGFpbE1lc3NhZ2UsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkVHlwZU1lc3NhZ2U6IHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW3Njb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIXS5kZXRhaWxNZXNzYWdlLFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgaW52YWxpZFJhbmdlTWVzc2FnZTogc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRV0uZGV0YWlsTWVzc2FnZSxcbiAgICAgICAgICBkZWNpbWFsUmVnZXg6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkXG4gICAqL1xuICBzZXQgc2NhbGVkKHNjYWxlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzY2FsZWQsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LnNjYWxlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NjYWxlZCA9IHNjYWxlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkgKi5zY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHNjYWxlZDogc3RyaW5nLFxuICAgKiAgICAgIHJhdzogc3RyaW5nLFxuICAgKiAgICAgIG1pbjogc3RyaW5nLFxuICAgKiAgICAgIG1heDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzY2FsZWQnOiB0aGlzLnNjYWxlZCxcbiAgICAgICdyYXcnOiBzdXBlci5yYXcsXG4gICAgICAnbWluJzogc3VwZXIubWluLFxuICAgICAgJ21heCc6IHN1cGVyLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb21tZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICNyZWFkT25seUFmdGVySW5pdDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm5cbiAgICogQHBhcmFtIHtib29sZWFufSByZWFkT25seUFmdGVySW5pdFxuICAgKi9cbiAgY29uc3RydWN0b3IocmVhZE9ubHlBZnRlckluaXQgPSBmYWxzZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jY29tbWVudCA9ICcnO1xuICAgIHRoaXMuI2xvY2F0aW9uID0gJyc7XG4gICAgdGhpcy4jdGltZXN0YW1wID0gJyc7XG4gICAgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQgPSByZWFkT25seUFmdGVySW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21tZW50LCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgICAgICAgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzI1MCkpIHtcbiAgICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50JzogdGhpcy5jb21tZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUZlZWRiYWNrKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEFETCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubmF2ID0gbmV3IEFETE5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5hdj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbmF2OiB7XG4gICAqICAgICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICduYXYnOiB0aGlzLm5hdixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdiBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNyZXF1ZXN0ID0gJ19ub25lXyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkID0gbmV3IEFETE5hdlJlcXVlc3RWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQ/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXF1ZXN0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXF1ZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAgICovXG4gIHNldCByZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVxdWVzdCwgc2Nvcm0yMDA0X3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jcmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdlxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmVxdWVzdCc6IHRoaXMucmVxdWVzdCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkIG9iamVjdFxuICovXG5jbGFzcyBBRExOYXZSZXF1ZXN0VmFsaWQgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbnRpbnVlID0gJ3Vua25vd24nO1xuICAjcHJldmlvdXMgPSAndW5rbm93bic7XG4gIGNob2ljZSA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuICBqdW1wID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGludWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRpbnVlKCkge1xuICAgIHJldHVybiB0aGlzLiNjb250aW51ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250aW51ZS4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IGNvbnRpbnVlKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcmV2aW91c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJldmlvdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ByZXZpb3VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ByZXZpb3VzLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgcHJldmlvdXMoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcHJldmlvdXM6IHN0cmluZyxcbiAgICogICAgICBjb250aW51ZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwcmV2aW91cyc6IHRoaXMucHJldmlvdXMsXG4gICAgICAnY29udGludWUnOiB0aGlzLmNvbnRpbnVlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBnbG9iYWwgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxuICBOT19FUlJPUjoge1xuICAgIGVycm9yQ29kZTogMCxcbiAgICBlcnJvck1lc3NhZ2U6ICdObyBlcnJvcicsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTEyID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zJyxcbiAgY29yZV9jaGlsZHJlbjogJ3N0dWRlbnRfaWQsc3R1ZGVudF9uYW1lLGxlc3Nvbl9sb2NhdGlvbixjcmVkaXQsbGVzc29uX3N0YXR1cyxlbnRyeSxzY29yZSx0b3RhbF90aW1lLGxlc3Nvbl9tb2RlLGV4aXQsc2Vzc2lvbl90aW1lJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdyYXcsbWluLG1heCcsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29udGVudCxsb2NhdGlvbix0aW1lJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ2lkLHNjb3JlLHN0YXR1cycsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLHNwZWVkLHRleHQnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCxvYmplY3RpdmVzLHRpbWUsdHlwZSxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsc3R1ZGVudF9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeScsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBMTVNHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIGFyZ3VtZW50IGVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBhcmd1bWVudCByZXByZXNlbnRzIGFuIGludmFsaWQgZGF0YSBtb2RlbCBlbGVtZW50IG9yIGlzIG90aGVyd2lzZSBpbmNvcnJlY3QuJyxcbiAgICB9LFxuICAgICcyMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGNhbm5vdCBoYXZlIGNoaWxkcmVuJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY2hpbGRyZW5cIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jaGlsZHJlblwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzIwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgbm90IGFuIGFycmF5IC0gY2Fubm90IGhhdmUgY291bnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU0dldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHRoYXQgZW5kcyBpbiBcIl9jb3VudFwiIGZvciBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgdGhlIFwiX2NvdW50XCIgc3VmZml4LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm90IGluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBBUEkgY2FsbCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbXBsZW1lbnRlZCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIExNU0dldFZhbHVlIG9yIExNU1NldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gU0NPUk0gMS4yIGRlZmluZXMgYSBzZXQgb2YgZGF0YSBtb2RlbCBlbGVtZW50cyBhcyBiZWluZyBvcHRpb25hbCBmb3IgYW4gTE1TIHRvIGltcGxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0ludmFsaWQgc2V0IHZhbHVlLCBlbGVtZW50IGlzIGEga2V5d29yZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYSBrZXl3b3JkIChlbGVtZW50cyB0aGF0IGVuZCBpbiBcIl9jaGlsZHJlblwiIGFuZCBcIl9jb3VudFwiKS4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgcmVhZCBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBpcyB3cml0ZSBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0luY29ycmVjdCBEYXRhIFR5cGUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgVmFsdWUgT3V0IE9mIFJhbmdlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgbnVtZXJpYyB2YWx1ZSBzdXBwbGllZCB0byBhIExNU1NldFZhbHVlIGNhbGwgaXMgb3V0c2lkZSBvZiB0aGUgbnVtZXJpYyByYW5nZSBhbGxvd2VkIGZvciB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA4Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBEZXBlbmRlbmN5IE5vdCBFc3RhYmxpc2hlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU29tZSBkYXRhIG1vZGVsIGVsZW1lbnRzIGNhbm5vdCBiZSBzZXQgdW50aWwgYW5vdGhlciBkYXRhIG1vZGVsIGVsZW1lbnQgd2FzIHNldC4gVGhpcyBlcnJvciBjb25kaXRpb24gaW5kaWNhdGVzIHRoYXQgdGhlIHByZXJlcXVpc2l0ZSBlbGVtZW50IHdhcyBub3Qgc2V0IGJlZm9yZSB0aGUgZGVwZW5kZW50IGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMsZXZhbHVhdGlvbicsXG4gICAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW8sbGFuZ3VhZ2UsbGVzc29uX3R5cGUsc3BlZWQsdGV4dCx0ZXh0X2NvbG9yLHRleHRfbG9jYXRpb24sdGV4dF9zaXplLHZpZGVvLHdpbmRvd3MnLFxuICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ2F0dGVtcHRfbnVtYmVyLHRyaWVzLG1hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gICAgc3R1ZGVudF9kZW1vZ3JhcGhpY3NfY2hpbGRyZW46ICdjaXR5LGNsYXNzLGNvbXBhbnksY291bnRyeSxleHBlcmllbmNlLGZhbWlsaWFyX25hbWUsaW5zdHJ1Y3Rvcl9uYW1lLHRpdGxlLG5hdGl2ZV9sYW5ndWFnZSxzdGF0ZSxzdHJlZXRfYWRkcmVzcyx0ZWxlcGhvbmUseWVhcnNfZXhwZXJpZW5jZScsXG4gICAgdHJpZXNfY2hpbGRyZW46ICd0aW1lLHN0YXR1cyxzY29yZScsXG4gICAgYXR0ZW1wdF9yZWNvcmRzX2NoaWxkcmVuOiAnc2NvcmUsbGVzc29uX3N0YXR1cycsXG4gICAgcGF0aHNfY2hpbGRyZW46ICdsb2NhdGlvbl9pZCxkYXRlLHRpbWUsc3RhdHVzLHdoeV9sZWZ0LHRpbWVfaW5fZWxlbWVudCcsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIC8vIENoaWxkcmVuIGxpc3RzXG4gIGNtaV9jaGlsZHJlbjogJ192ZXJzaW9uLGNvbW1lbnRzX2Zyb21fbGVhcm5lcixjb21tZW50c19mcm9tX2xtcyxjb21wbGV0aW9uX3N0YXR1cyxjcmVkaXQsZW50cnksZXhpdCxpbnRlcmFjdGlvbnMsbGF1bmNoX2RhdGEsbGVhcm5lcl9pZCxsZWFybmVyX25hbWUsbGVhcm5lcl9wcmVmZXJlbmNlLGxvY2F0aW9uLG1heF90aW1lX2FsbG93ZWQsbW9kZSxvYmplY3RpdmVzLHByb2dyZXNzX21lYXN1cmUsc2NhbGVkX3Bhc3Npbmdfc2NvcmUsc2NvcmUsc2Vzc2lvbl90aW1lLHN1Y2Nlc3Nfc3RhdHVzLHN1c3BlbmRfZGF0YSx0aW1lX2xpbWl0X2FjdGlvbix0b3RhbF90aW1lJyxcbiAgY29tbWVudHNfY2hpbGRyZW46ICdjb21tZW50LHRpbWVzdGFtcCxsb2NhdGlvbicsXG4gIHNjb3JlX2NoaWxkcmVuOiAnbWF4LHJhdyxzY2FsZWQsbWluJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ3Byb2dyZXNzX21lYXN1cmUsY29tcGxldGlvbl9zdGF0dXMsc3VjY2Vzc19zdGF0dXMsZGVzY3JpcHRpb24sc2NvcmUsaWQnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpb19sZXZlbCxhdWRpb19jYXB0aW9uaW5nLGRlbGl2ZXJ5X3NwZWVkLGxhbmd1YWdlJyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsdHlwZSxvYmplY3RpdmVzLHRpbWVzdGFtcCxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsbGVhcm5lcl9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeSxkZXNjcmlwdGlvbicsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzAnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdObyBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gZXJyb3Igb2NjdXJyZWQsIHRoZSBwcmV2aW91cyBBUEkgY2FsbCB3YXMgc3VjY2Vzc2Z1bC4nLFxuICAgIH0sXG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMTAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBJbml0aWFsaXphdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzEwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0FscmVhZHkgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBJbml0aWFsaXplIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbnRlbnQgSW5zdGFuY2UgVGVybWluYXRlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFRlcm1pbmF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMTInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTEzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMjInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEyMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTMyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMzMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzE0Mic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTQzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEFyZ3VtZW50IEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBbiBpbnZhbGlkIGFyZ3VtZW50IHdhcyBwYXNzZWQgdG8gYW4gQVBJIG1ldGhvZCAodXN1YWxseSBpbmRpY2F0ZXMgdGhhdCBJbml0aWFsaXplLCBDb21taXQgb3IgVGVybWluYXRlIGRpZCBub3QgcmVjZWl2ZSB0aGUgZXhwZWN0ZWQgZW1wdHkgc3RyaW5nIGFyZ3VtZW50LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBHZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIEdldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM1MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgU2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBTZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczOTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIENvbW1pdCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgQ29tbWl0IGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuZGVmaW5lZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSBwYXNzZWQgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5pbXBsZW1lbnRlZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIEluIFNDT1JNIDIwMDQsIHRoaXMgZXJyb3Igd291bGQgaW5kaWNhdGUgYW4gTE1TIHRoYXQgaXMgbm90IGZ1bGx5IFNDT1JNIGNvbmZvcm1hbnQuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgTm90IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBdHRlbXB0IHRvIHJlYWQgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgYnkgdGhlIExNUyBvciB0aHJvdWdoIGEgU2V0VmFsdWUgY2FsbC4gVGhpcyBlcnJvciBjb25kaXRpb24gaXMgb2Z0ZW4gcmVhY2hlZCBkdXJpbmcgbm9ybWFsIGV4ZWN1dGlvbiBvZiBhIFNDTy4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBSZWFkIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHJlYWQuJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgV3JpdGUgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDYnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVHlwZSBNaXNtYXRjaCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgdmFsdWUgdGhhdCBpcyBub3QgY29uc2lzdGVudCB3aXRoIHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA3Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE91dCBPZiBSYW5nZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIG51bWVyaWMgdmFsdWUgc3VwcGxpZWQgdG8gYSBTZXRWYWx1ZSBjYWxsIGlzIG91dHNpZGUgb2YgdGhlIG51bWVyaWMgcmFuZ2UgYWxsb3dlZCBmb3IgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwOCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NvbWUgZGF0YSBtb2RlbCBlbGVtZW50cyBjYW5ub3QgYmUgc2V0IHVudGlsIGFub3RoZXIgZGF0YSBtb2RlbCBlbGVtZW50IHdhcyBzZXQuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBwcmVyZXF1aXNpdGUgZWxlbWVudCB3YXMgbm90IHNldCBiZWZvcmUgdGhlIGRlcGVuZGVudCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IEFQSUNvbnN0YW50cyA9IHtcbiAgZ2xvYmFsOiBnbG9iYWwsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQVBJQ29uc3RhbnRzO1xuIiwiLy8gQGZsb3dcbmNvbnN0IGdsb2JhbCA9IHtcbiAgR0VORVJBTDogMTAxLFxuICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMSxcbiAgSU5JVElBTElaRUQ6IDEwMSxcbiAgVEVSTUlOQVRFRDogMTAxLFxuICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMDEsXG4gIE1VTFRJUExFX1RFUk1JTkFUSU9OOiAxMDEsXG4gIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEwMSxcbiAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgU1RPUkVfQUZURVJfVEVSTTogMTAxLFxuICBDT01NSVRfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgQ09NTUlUX0FGVEVSX1RFUk06IDEwMSxcbiAgQVJHVU1FTlRfRVJST1I6IDEwMSxcbiAgQ0hJTERSRU5fRVJST1I6IDEwMSxcbiAgQ09VTlRfRVJST1I6IDEwMSxcbiAgR0VORVJBTF9HRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDEwMSxcbiAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDEwMSxcbiAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiAxMDEsXG4gIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMTAxLFxuICBJTlZBTElEX1NFVF9WQUxVRTogMTAxLFxuICBSRUFEX09OTFlfRUxFTUVOVDogMTAxLFxuICBXUklURV9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgVFlQRV9NSVNNQVRDSDogMTAxLFxuICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDEwMSxcbiAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDEwMSxcbn07XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIC4uLmdsb2JhbCwgLi4ue1xuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIENISUxEUkVOX0VSUk9SOiAyMDIsXG4gICAgQ09VTlRfRVJST1I6IDIwMyxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAxLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMzAxLFxuICAgIElOVkFMSURfU0VUX1ZBTFVFOiA0MDIsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwMyxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBUWVBFX01JU01BVENIOiA0MDUsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgLi4uZ2xvYmFsLCAuLi57XG4gICAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDIsXG4gICAgSU5JVElBTElaRUQ6IDEwMyxcbiAgICBURVJNSU5BVEVEOiAxMDQsXG4gICAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTExLFxuICAgIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMTIsXG4gICAgTVVMVElQTEVfVEVSTUlOQVRJT05TOiAxMTMsXG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEyMixcbiAgICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMjMsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEzMixcbiAgICBTVE9SRV9BRlRFUl9URVJNOiAxMzMsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAxNDIsXG4gICAgQ09NTUlUX0FGVEVSX1RFUk06IDE0MyxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDMwMSxcbiAgICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAzNTEsXG4gICAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMzkxLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDIsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiA0MDMsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNSxcbiAgICBUWVBFX01JU01BVENIOiA0MDYsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmNvbnN0IEVycm9yQ29kZXMgPSB7XG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JDb2RlcztcbiIsImNvbnN0IFZhbGlkTGFuZ3VhZ2VzID0ge1xuICAnYWEnOiAnYWEnLCAnYWInOiAnYWInLCAnYWUnOiAnYWUnLCAnYWYnOiAnYWYnLCAnYWsnOiAnYWsnLCAnYW0nOiAnYW0nLFxuICAnYW4nOiAnYW4nLCAnYXInOiAnYXInLCAnYXMnOiAnYXMnLCAnYXYnOiAnYXYnLCAnYXknOiAnYXknLCAnYXonOiAnYXonLFxuICAnYmEnOiAnYmEnLCAnYmUnOiAnYmUnLCAnYmcnOiAnYmcnLCAnYmgnOiAnYmgnLCAnYmknOiAnYmknLCAnYm0nOiAnYm0nLFxuICAnYm4nOiAnYm4nLCAnYm8nOiAnYm8nLCAnYnInOiAnYnInLCAnYnMnOiAnYnMnLCAnY2EnOiAnY2EnLCAnY2UnOiAnY2UnLFxuICAnY2gnOiAnY2gnLCAnY28nOiAnY28nLCAnY3InOiAnY3InLCAnY3MnOiAnY3MnLCAnY3UnOiAnY3UnLCAnY3YnOiAnY3YnLFxuICAnY3knOiAnY3knLCAnZGEnOiAnZGEnLCAnZGUnOiAnZGUnLCAnZHYnOiAnZHYnLCAnZHonOiAnZHonLCAnZWUnOiAnZWUnLFxuICAnZWwnOiAnZWwnLCAnZW4nOiAnZW4nLCAnZW8nOiAnZW8nLCAnZXMnOiAnZXMnLCAnZXQnOiAnZXQnLCAnZXUnOiAnZXUnLFxuICAnZmEnOiAnZmEnLCAnZmYnOiAnZmYnLCAnZmknOiAnZmknLCAnZmonOiAnZmonLCAnZm8nOiAnZm8nLCAnZnInOiAnZnInLFxuICAnZnknOiAnZnknLCAnZ2EnOiAnZ2EnLCAnZ2QnOiAnZ2QnLCAnZ2wnOiAnZ2wnLCAnZ24nOiAnZ24nLCAnZ3UnOiAnZ3UnLFxuICAnZ3YnOiAnZ3YnLCAnaGEnOiAnaGEnLCAnaGUnOiAnaGUnLCAnaGknOiAnaGknLCAnaG8nOiAnaG8nLCAnaHInOiAnaHInLFxuICAnaHQnOiAnaHQnLCAnaHUnOiAnaHUnLCAnaHknOiAnaHknLCAnaHonOiAnaHonLCAnaWEnOiAnaWEnLCAnaWQnOiAnaWQnLFxuICAnaWUnOiAnaWUnLCAnaWcnOiAnaWcnLCAnaWknOiAnaWknLCAnaWsnOiAnaWsnLCAnaW8nOiAnaW8nLCAnaXMnOiAnaXMnLFxuICAnaXQnOiAnaXQnLCAnaXUnOiAnaXUnLCAnamEnOiAnamEnLCAnanYnOiAnanYnLCAna2EnOiAna2EnLCAna2cnOiAna2cnLFxuICAna2knOiAna2knLCAna2onOiAna2onLCAna2snOiAna2snLCAna2wnOiAna2wnLCAna20nOiAna20nLCAna24nOiAna24nLFxuICAna28nOiAna28nLCAna3InOiAna3InLCAna3MnOiAna3MnLCAna3UnOiAna3UnLCAna3YnOiAna3YnLCAna3cnOiAna3cnLFxuICAna3knOiAna3knLCAnbGEnOiAnbGEnLCAnbGInOiAnbGInLCAnbGcnOiAnbGcnLCAnbGknOiAnbGknLCAnbG4nOiAnbG4nLFxuICAnbG8nOiAnbG8nLCAnbHQnOiAnbHQnLCAnbHUnOiAnbHUnLCAnbHYnOiAnbHYnLCAnbWcnOiAnbWcnLCAnbWgnOiAnbWgnLFxuICAnbWknOiAnbWknLCAnbWsnOiAnbWsnLCAnbWwnOiAnbWwnLCAnbW4nOiAnbW4nLCAnbW8nOiAnbW8nLCAnbXInOiAnbXInLFxuICAnbXMnOiAnbXMnLCAnbXQnOiAnbXQnLCAnbXknOiAnbXknLCAnbmEnOiAnbmEnLCAnbmInOiAnbmInLCAnbmQnOiAnbmQnLFxuICAnbmUnOiAnbmUnLCAnbmcnOiAnbmcnLCAnbmwnOiAnbmwnLCAnbm4nOiAnbm4nLCAnbm8nOiAnbm8nLCAnbnInOiAnbnInLFxuICAnbnYnOiAnbnYnLCAnbnknOiAnbnknLCAnb2MnOiAnb2MnLCAnb2onOiAnb2onLCAnb20nOiAnb20nLCAnb3InOiAnb3InLFxuICAnb3MnOiAnb3MnLCAncGEnOiAncGEnLCAncGknOiAncGknLCAncGwnOiAncGwnLCAncHMnOiAncHMnLCAncHQnOiAncHQnLFxuICAncXUnOiAncXUnLCAncm0nOiAncm0nLCAncm4nOiAncm4nLCAncm8nOiAncm8nLCAncnUnOiAncnUnLCAncncnOiAncncnLFxuICAnc2EnOiAnc2EnLCAnc2MnOiAnc2MnLCAnc2QnOiAnc2QnLCAnc2UnOiAnc2UnLCAnc2cnOiAnc2cnLCAnc2gnOiAnc2gnLFxuICAnc2knOiAnc2knLCAnc2snOiAnc2snLCAnc2wnOiAnc2wnLCAnc20nOiAnc20nLCAnc24nOiAnc24nLCAnc28nOiAnc28nLFxuICAnc3EnOiAnc3EnLCAnc3InOiAnc3InLCAnc3MnOiAnc3MnLCAnc3QnOiAnc3QnLCAnc3UnOiAnc3UnLCAnc3YnOiAnc3YnLFxuICAnc3cnOiAnc3cnLCAndGEnOiAndGEnLCAndGUnOiAndGUnLCAndGcnOiAndGcnLCAndGgnOiAndGgnLCAndGknOiAndGknLFxuICAndGsnOiAndGsnLCAndGwnOiAndGwnLCAndG4nOiAndG4nLCAndG8nOiAndG8nLCAndHInOiAndHInLCAndHMnOiAndHMnLFxuICAndHQnOiAndHQnLCAndHcnOiAndHcnLCAndHknOiAndHknLCAndWcnOiAndWcnLCAndWsnOiAndWsnLCAndXInOiAndXInLFxuICAndXonOiAndXonLCAndmUnOiAndmUnLCAndmknOiAndmknLCAndm8nOiAndm8nLCAnd2EnOiAnd2EnLCAnd28nOiAnd28nLFxuICAneGgnOiAneGgnLCAneWknOiAneWknLCAneW8nOiAneW8nLCAnemEnOiAnemEnLCAnemgnOiAnemgnLCAnenUnOiAnenUnLFxuICAnYWFyJzogJ2FhcicsICdhYmsnOiAnYWJrJywgJ2F2ZSc6ICdhdmUnLCAnYWZyJzogJ2FmcicsICdha2EnOiAnYWthJyxcbiAgJ2FtaCc6ICdhbWgnLCAnYXJnJzogJ2FyZycsICdhcmEnOiAnYXJhJywgJ2FzbSc6ICdhc20nLCAnYXZhJzogJ2F2YScsXG4gICdheW0nOiAnYXltJywgJ2F6ZSc6ICdhemUnLCAnYmFrJzogJ2JhaycsICdiZWwnOiAnYmVsJywgJ2J1bCc6ICdidWwnLFxuICAnYmloJzogJ2JpaCcsICdiaXMnOiAnYmlzJywgJ2JhbSc6ICdiYW0nLCAnYmVuJzogJ2JlbicsICd0aWInOiAndGliJyxcbiAgJ2JvZCc6ICdib2QnLCAnYnJlJzogJ2JyZScsICdib3MnOiAnYm9zJywgJ2NhdCc6ICdjYXQnLCAnY2hlJzogJ2NoZScsXG4gICdjaGEnOiAnY2hhJywgJ2Nvcyc6ICdjb3MnLCAnY3JlJzogJ2NyZScsICdjemUnOiAnY3plJywgJ2Nlcyc6ICdjZXMnLFxuICAnY2h1JzogJ2NodScsICdjaHYnOiAnY2h2JywgJ3dlbCc6ICd3ZWwnLCAnY3ltJzogJ2N5bScsICdkYW4nOiAnZGFuJyxcbiAgJ2dlcic6ICdnZXInLCAnZGV1JzogJ2RldScsICdkaXYnOiAnZGl2JywgJ2R6byc6ICdkem8nLCAnZXdlJzogJ2V3ZScsXG4gICdncmUnOiAnZ3JlJywgJ2VsbCc6ICdlbGwnLCAnZW5nJzogJ2VuZycsICdlcG8nOiAnZXBvJywgJ3NwYSc6ICdzcGEnLFxuICAnZXN0JzogJ2VzdCcsICdiYXEnOiAnYmFxJywgJ2V1cyc6ICdldXMnLCAncGVyJzogJ3BlcicsICdmYXMnOiAnZmFzJyxcbiAgJ2Z1bCc6ICdmdWwnLCAnZmluJzogJ2ZpbicsICdmaWonOiAnZmlqJywgJ2Zhbyc6ICdmYW8nLCAnZnJlJzogJ2ZyZScsXG4gICdmcmEnOiAnZnJhJywgJ2ZyeSc6ICdmcnknLCAnZ2xlJzogJ2dsZScsICdnbGEnOiAnZ2xhJywgJ2dsZyc6ICdnbGcnLFxuICAnZ3JuJzogJ2dybicsICdndWonOiAnZ3VqJywgJ2dsdic6ICdnbHYnLCAnaGF1JzogJ2hhdScsICdoZWInOiAnaGViJyxcbiAgJ2hpbic6ICdoaW4nLCAnaG1vJzogJ2htbycsICdocnYnOiAnaHJ2JywgJ2hhdCc6ICdoYXQnLCAnaHVuJzogJ2h1bicsXG4gICdhcm0nOiAnYXJtJywgJ2h5ZSc6ICdoeWUnLCAnaGVyJzogJ2hlcicsICdpbmEnOiAnaW5hJywgJ2luZCc6ICdpbmQnLFxuICAnaWxlJzogJ2lsZScsICdpYm8nOiAnaWJvJywgJ2lpaSc6ICdpaWknLCAnaXBrJzogJ2lwaycsICdpZG8nOiAnaWRvJyxcbiAgJ2ljZSc6ICdpY2UnLCAnaXNsJzogJ2lzbCcsICdpdGEnOiAnaXRhJywgJ2lrdSc6ICdpa3UnLCAnanBuJzogJ2pwbicsXG4gICdqYXYnOiAnamF2JywgJ2dlbyc6ICdnZW8nLCAna2F0JzogJ2thdCcsICdrb24nOiAna29uJywgJ2tpayc6ICdraWsnLFxuICAna3VhJzogJ2t1YScsICdrYXonOiAna2F6JywgJ2thbCc6ICdrYWwnLCAna2htJzogJ2tobScsICdrYW4nOiAna2FuJyxcbiAgJ2tvcic6ICdrb3InLCAna2F1JzogJ2thdScsICdrYXMnOiAna2FzJywgJ2t1cic6ICdrdXInLCAna29tJzogJ2tvbScsXG4gICdjb3InOiAnY29yJywgJ2tpcic6ICdraXInLCAnbGF0JzogJ2xhdCcsICdsdHonOiAnbHR6JywgJ2x1Zyc6ICdsdWcnLFxuICAnbGltJzogJ2xpbScsICdsaW4nOiAnbGluJywgJ2xhbyc6ICdsYW8nLCAnbGl0JzogJ2xpdCcsICdsdWInOiAnbHViJyxcbiAgJ2xhdic6ICdsYXYnLCAnbWxnJzogJ21sZycsICdtYWgnOiAnbWFoJywgJ21hbyc6ICdtYW8nLCAnbXJpJzogJ21yaScsXG4gICdtYWMnOiAnbWFjJywgJ21rZCc6ICdta2QnLCAnbWFsJzogJ21hbCcsICdtb24nOiAnbW9uJywgJ21vbCc6ICdtb2wnLFxuICAnbWFyJzogJ21hcicsICdtYXknOiAnbWF5JywgJ21zYSc6ICdtc2EnLCAnbWx0JzogJ21sdCcsICdidXInOiAnYnVyJyxcbiAgJ215YSc6ICdteWEnLCAnbmF1JzogJ25hdScsICdub2InOiAnbm9iJywgJ25kZSc6ICduZGUnLCAnbmVwJzogJ25lcCcsXG4gICduZG8nOiAnbmRvJywgJ2R1dCc6ICdkdXQnLCAnbmxkJzogJ25sZCcsICdubm8nOiAnbm5vJywgJ25vcic6ICdub3InLFxuICAnbmJsJzogJ25ibCcsICduYXYnOiAnbmF2JywgJ255YSc6ICdueWEnLCAnb2NpJzogJ29jaScsICdvamknOiAnb2ppJyxcbiAgJ29ybSc6ICdvcm0nLCAnb3JpJzogJ29yaScsICdvc3MnOiAnb3NzJywgJ3Bhbic6ICdwYW4nLCAncGxpJzogJ3BsaScsXG4gICdwb2wnOiAncG9sJywgJ3B1cyc6ICdwdXMnLCAncG9yJzogJ3BvcicsICdxdWUnOiAncXVlJywgJ3JvaCc6ICdyb2gnLFxuICAncnVuJzogJ3J1bicsICdydW0nOiAncnVtJywgJ3Jvbic6ICdyb24nLCAncnVzJzogJ3J1cycsICdraW4nOiAna2luJyxcbiAgJ3Nhbic6ICdzYW4nLCAnc3JkJzogJ3NyZCcsICdzbmQnOiAnc25kJywgJ3NtZSc6ICdzbWUnLCAnc2FnJzogJ3NhZycsXG4gICdzbG8nOiAnc2xvJywgJ3Npbic6ICdzaW4nLCAnc2xrJzogJ3NsaycsICdzbHYnOiAnc2x2JywgJ3Ntbyc6ICdzbW8nLFxuICAnc25hJzogJ3NuYScsICdzb20nOiAnc29tJywgJ2FsYic6ICdhbGInLCAnc3FpJzogJ3NxaScsICdzcnAnOiAnc3JwJyxcbiAgJ3Nzdyc6ICdzc3cnLCAnc290JzogJ3NvdCcsICdzdW4nOiAnc3VuJywgJ3N3ZSc6ICdzd2UnLCAnc3dhJzogJ3N3YScsXG4gICd0YW0nOiAndGFtJywgJ3RlbCc6ICd0ZWwnLCAndGdrJzogJ3RnaycsICd0aGEnOiAndGhhJywgJ3Rpcic6ICd0aXInLFxuICAndHVrJzogJ3R1aycsICd0Z2wnOiAndGdsJywgJ3Rzbic6ICd0c24nLCAndG9uJzogJ3RvbicsICd0dXInOiAndHVyJyxcbiAgJ3Rzbyc6ICd0c28nLCAndGF0JzogJ3RhdCcsICd0d2knOiAndHdpJywgJ3RhaCc6ICd0YWgnLCAndWlnJzogJ3VpZycsXG4gICd1a3InOiAndWtyJywgJ3VyZCc6ICd1cmQnLCAndXpiJzogJ3V6YicsICd2ZW4nOiAndmVuJywgJ3ZpZSc6ICd2aWUnLFxuICAndm9sJzogJ3ZvbCcsICd3bG4nOiAnd2xuJywgJ3dvbCc6ICd3b2wnLCAneGhvJzogJ3hobycsICd5aWQnOiAneWlkJyxcbiAgJ3lvcic6ICd5b3InLCAnemhhJzogJ3poYScsICdjaGknOiAnY2hpJywgJ3pobyc6ICd6aG8nLCAnenVsJzogJ3p1bCcsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBWYWxpZExhbmd1YWdlcztcbiIsIi8vIEBmbG93XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIENNSVN0cmluZzI1NjogJ14uezAsMjU1fSQnLFxuICBDTUlTdHJpbmc0MDk2OiAnXi57MCw0MDk2fSQnLFxuICBDTUlUaW1lOiAnXig/Oig/OihbMDFdP1xcXFxkfDJbMC0zXSk6KT8oWzAtNV0/XFxcXGQpOik/KFswLTVdP1xcXFxkKSg/OlxcLihcXFxcZCspPyk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VcXFxcc117MCwyNTV9JCcsXG4gIENNSUZlZWRiYWNrOiAnXi57MCwyNTV9JCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSVN0YXR1czogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkKSQnLFxuICBDTUlTdGF0dXMyOiAnXihwYXNzZWR8Y29tcGxldGVkfGZhaWxlZHxpbmNvbXBsZXRlfGJyb3dzZWR8bm90IGF0dGVtcHRlZCkkJyxcbiAgQ01JRXhpdDogJ14odGltZS1vdXR8c3VzcGVuZHxsb2dvdXR8KSQnLFxuICBDTUlUeXBlOiAnXih0cnVlLWZhbHNlfGNob2ljZXxmaWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmd8bGlrZXJ0fG51bWVyaWMpJCcsXG4gIENNSVJlc3VsdDogJ14oY29ycmVjdHx3cm9uZ3x1bmFudGljaXBhdGVkfG5ldXRyYWx8KFswLTldezAsM30pPyhcXFxcLlswLTldKik/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY29yZV9yYW5nZTogJzAjMTAwJyxcbiAgYXVkaW9fcmFuZ2U6ICctMSMxMDAnLFxuICBzcGVlZF9yYW5nZTogJy0xMDAjMTAwJyxcbiAgd2VpZ2h0aW5nX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG59O1xuXG5jb25zdCBhaWNjID0ge1xuICAuLi5zY29ybTEyLCAuLi57XG4gICAgQ01JSWRlbnRpZmllcjogJ15cXFxcd3sxLDI1NX0kJyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgQ01JU3RyaW5nMjAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDIwMH0kJyxcbiAgQ01JU3RyaW5nMjUwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDI1MH0kJyxcbiAgQ01JU3RyaW5nMTAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwxMDAwfSQnLFxuICBDTUlTdHJpbmc0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDQwMDB9JCcsXG4gIENNSVN0cmluZzY0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDY0MDAwfSQnLFxuICBDTUlMYW5nOiAnXihbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/JHxeJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsMjUwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KSkoLio/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTBjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oLnswLDI1MH0pPyk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzQwMDA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDQwMDB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZTogJ14oMTlbNy05XXsxfVswLTldezF9fDIwWzAtMl17MX1bMC05XXsxfXwyMDNbMC04XXsxfSkoKC0oMFsxLTldezF9fDFbMC0yXXsxfSkpKCgtKDBbMS05XXsxfXxbMS0yXXsxfVswLTldezF9fDNbMC0xXXsxfSkpKFQoWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoXFxcXC5bMC05XXsxLDJ9KSgoWnwoWyt8LV0oWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKSkoOlswLTVdezF9WzAtOV17MX0pPyk/KT8pPyk/KT8pPyk/JCcsXG4gIENNSVRpbWVzcGFuOiAnXlAoPzooWy4sXFxcXGRdKylZKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylXKT8oPzooWy4sXFxcXGRdKylEKT8oPzpUPyg/OihbLixcXFxcZF0rKUgpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVMpPyk/JCcsXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXsxLDV9KShcXFxcLlswLTldezEsMTh9KT8kJyxcbiAgQ01JSWRlbnRpZmllcjogJ15cXFxcU3sxLDI1MH1bYS16QS1aMC05XSQnLFxuICBDTUlTaG9ydElkZW50aWZpZXI6ICdeW1xcXFx3XFxcXC5cXFxcLVxcXFxfXXsxLDI1MH0kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMb25nSWRlbnRpZmllcjogJ14oPzooPyF1cm46KVxcXFxTezEsNDAwMH18dXJuOltBLVphLXowLTktXXsxLDMxfTpcXFxcU3sxLDQwMDB9fC57MSw0MDAwfSkkJywgLy8gbmVlZCB0byByZS1leGFtaW5lIHRoaXNcbiAgQ01JRmVlZGJhY2s6ICdeLiokJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuICBDTUlJbmRleFN0b3JlOiAnLk4oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JQ1N0YXR1czogJ14oY29tcGxldGVkfGluY29tcGxldGV8bm90IGF0dGVtcHRlZHx1bmtub3duKSQnLFxuICBDTUlTU3RhdHVzOiAnXihwYXNzZWR8ZmFpbGVkfHVua25vd24pJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fG5vcm1hbCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpY3xvdGhlcikkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fGluY29ycmVjdHx1bmFudGljaXBhdGVkfG5ldXRyYWx8LT8oWzAtOV17MSw0fSkoXFxcXC5bMC05XXsxLDE4fSk/KSQnLFxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWV8ZXhpdHxleGl0QWxsfGFiYW5kb258YWJhbmRvbkFsbHxzdXNwZW5kQWxsfFxce3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XVxcfWNob2ljZXxqdW1wKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkJvb2xlYW46ICdeKHVua25vd258dHJ1ZXxmYWxzZSQpJyxcbiAgTkFWVGFyZ2V0OiAnXihwcmV2aW91c3xjb250aW51ZXxjaG9pY2Uue3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XX0pJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NhbGVkX3JhbmdlOiAnLTEjMScsXG4gIGF1ZGlvX3JhbmdlOiAnMCMqJyxcbiAgc3BlZWRfcmFuZ2U6ICcwIyonLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG4gIHByb2dyZXNzX3JhbmdlOiAnMCMxJyxcbn07XG5cbmNvbnN0IFJlZ2V4ID0ge1xuICBhaWNjOiBhaWNjLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2V4O1xuIiwiLy8gQGZsb3dcbmltcG9ydCBSZWdleCBmcm9tICcuL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0yMDA0X3JlZ2V4ID0gUmVnZXguc2Nvcm0yMDA0O1xuXG5jb25zdCBsZWFybmVyID0ge1xuICAndHJ1ZS1mYWxzZSc6IHtcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2Nob2ljZSc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MCxcbiAgICBtYXg6IDEwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xvbmctZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbWF0Y2hpbmcnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdwZXJmb3JtYW5jZSc6IHtcbiAgICBmb3JtYXQ6ICdeJHwnICsgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCArICd8XiR8JyArXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdsaWtlcnQnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdudW1lcmljJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzQwMDAsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbn07XG5cbmNvbnN0IGNvcnJlY3QgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwY3IsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IHRydWUsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBtYXg6IDIsXG4gICAgZGVsaW1pdGVyOiAnWzpdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIGxpbWl0OiAxLFxuICB9LFxufTtcblxuY29uc3QgUmVzcG9uc2VzID0ge1xuICBsZWFybmVyOiBsZWFybmVyLFxuICBjb3JyZWN0OiBjb3JyZWN0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2VzO1xuIiwiLy8gQGZsb3dcblxuLyoqXG4gKiBEYXRhIFZhbGlkYXRpb24gRXhjZXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byB0YWtlIGluIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIsIC4uLnJlc3QpIHtcbiAgICBzdXBlciguLi5yZXN0KTtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgU2Nvcm0yMDA0QVBJIGZyb20gJy4vU2Nvcm0yMDA0QVBJJztcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQgQUlDQyBmcm9tICcuL0FJQ0MnO1xuXG53aW5kb3cuU2Nvcm0xMkFQSSA9IFNjb3JtMTJBUEk7XG53aW5kb3cuU2Nvcm0yMDA0QVBJID0gU2Nvcm0yMDA0QVBJO1xud2luZG93LkFJQ0MgPSBBSUNDO1xuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9TRUNPTkQgPSAxLjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfTUlOVVRFID0gNjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfSE9VUiA9IDYwICogU0VDT05EU19QRVJfTUlOVVRFO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0RBWSA9IDI0ICogU0VDT05EU19QRVJfSE9VUjtcblxuY29uc3QgZGVzaWduYXRpb25zID0gW1xuICBbJ0QnLCBTRUNPTkRTX1BFUl9EQVldLFxuICBbJ0gnLCBTRUNPTkRTX1BFUl9IT1VSXSxcbiAgWydNJywgU0VDT05EU19QRVJfTUlOVVRFXSxcbiAgWydTJywgU0VDT05EU19QRVJfU0VDT05EXSxcbl07XG5cbi8qKlxuICogQ29udmVydHMgYSBOdW1iZXIgdG8gYSBTdHJpbmcgb2YgSEg6TU06U1NcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxTZWNvbmRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNISE1NU1ModG90YWxTZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXRvdGFsU2Vjb25kcyB8fCB0b3RhbFNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnMDA6MDA6MDAnO1xuICB9XG5cbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIFNFQ09ORFNfUEVSX0hPVVIpO1xuXG4gIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZSh0b3RhbFNlY29uZHMgKiAxMDAwKTtcbiAgY29uc3QgbWludXRlcyA9IGRhdGVPYmouZ2V0VVRDTWludXRlcygpO1xuICAvLyBtYWtlIHN1cmUgd2UgYWRkIGFueSBwb3NzaWJsZSBkZWNpbWFsIHZhbHVlXG4gIGNvbnN0IHNlY29uZHMgPSBkYXRlT2JqLmdldFNlY29uZHMoKTtcbiAgY29uc3QgbXMgPSB0b3RhbFNlY29uZHMgJSAxLjA7XG4gIGxldCBtc1N0ciA9ICcnO1xuICBpZiAoY291bnREZWNpbWFscyhtcykgPiAwKSB7XG4gICAgaWYgKGNvdW50RGVjaW1hbHMobXMpID4gMikge1xuICAgICAgbXNTdHIgPSBtcy50b0ZpeGVkKDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtc1N0ciA9IFN0cmluZyhtcyk7XG4gICAgfVxuICAgIG1zU3RyID0gJy4nICsgbXNTdHIuc3BsaXQoJy4nKVsxXTtcbiAgfVxuXG4gIHJldHVybiAoaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcykucmVwbGFjZSgvXFxiXFxkXFxiL2csXG4gICAgICAnMCQmJykgKyBtc1N0cjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc2Vjb25kc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCFzZWNvbmRzIHx8IHNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnUFQwUyc7XG4gIH1cblxuICBsZXQgZHVyYXRpb24gPSAnUCc7XG4gIGxldCByZW1haW5kZXIgPSBzZWNvbmRzO1xuXG4gIGRlc2lnbmF0aW9ucy5mb3JFYWNoKChbc2lnbiwgY3VycmVudF9zZWNvbmRzXSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IocmVtYWluZGVyIC8gY3VycmVudF9zZWNvbmRzKTtcblxuICAgIHJlbWFpbmRlciA9IHJlbWFpbmRlciAlIGN1cnJlbnRfc2Vjb25kcztcbiAgICBpZiAoY291bnREZWNpbWFscyhyZW1haW5kZXIpID4gMikge1xuICAgICAgcmVtYWluZGVyID0gTnVtYmVyKE51bWJlcihyZW1haW5kZXIpLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBoYXZlIGFueXRoaW5nIGxlZnQgaW4gdGhlIHJlbWFpbmRlciwgYW5kIHdlJ3JlIGN1cnJlbnRseSBhZGRpbmdcbiAgICAvLyBzZWNvbmRzIHRvIHRoZSBkdXJhdGlvbiwgZ28gYWhlYWQgYW5kIGFkZCB0aGUgZGVjaW1hbCB0byB0aGUgc2Vjb25kc1xuICAgIGlmIChzaWduID09PSAnUycgJiYgcmVtYWluZGVyID4gMCkge1xuICAgICAgdmFsdWUgKz0gcmVtYWluZGVyO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKChkdXJhdGlvbi5pbmRleE9mKCdEJykgPiAwIHx8XG4gICAgICAgICAgc2lnbiA9PT0gJ0gnIHx8IHNpZ24gPT09ICdNJyB8fCBzaWduID09PSAnUycpICYmXG4gICAgICAgICAgZHVyYXRpb24uaW5kZXhPZignVCcpID09PSAtMSkge1xuICAgICAgICBkdXJhdGlvbiArPSAnVCc7XG4gICAgICB9XG4gICAgICBkdXJhdGlvbiArPSBgJHt2YWx1ZX0ke3NpZ259YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSEg6TU06U1MuREREREREXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVTdHJpbmdcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBc1NlY29uZHModGltZVN0cmluZzogU3RyaW5nLCB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIXRpbWVTdHJpbmcgfHwgdHlwZW9mIHRpbWVTdHJpbmcgIT09ICdzdHJpbmcnIHx8XG4gICAgICAhdGltZVN0cmluZy5tYXRjaCh0aW1lUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgY29uc3QgcGFydHMgPSB0aW1lU3RyaW5nLnNwbGl0KCc6Jyk7XG4gIGNvbnN0IGhvdXJzID0gTnVtYmVyKHBhcnRzWzBdKTtcbiAgY29uc3QgbWludXRlcyA9IE51bWJlcihwYXJ0c1sxXSk7XG4gIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIocGFydHNbMl0pO1xuICByZXR1cm4gKGhvdXJzICogMzYwMCkgKyAobWludXRlcyAqIDYwKSArIHNlY29uZHM7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVyYXRpb25Bc1NlY29uZHMoZHVyYXRpb246IFN0cmluZywgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIGlmICghZHVyYXRpb24gfHwgIWR1cmF0aW9uLm1hdGNoKGR1cmF0aW9uUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBbLCB5ZWFycywgbW9udGhzLCAsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzXSA9IG5ldyBSZWdFeHAoXG4gICAgICBkdXJhdGlvblJlZ2V4KS5leGVjKGR1cmF0aW9uKSB8fCBbXTtcblxuICBsZXQgcmVzdWx0ID0gMC4wO1xuXG4gIHJlc3VsdCArPSAoTnVtYmVyKHNlY29uZHMpICogMS4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKG1pbnV0ZXMpICogNjAuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihob3VycykgKiAzNjAwLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoZGF5cykgKiAoNjAgKiA2MCAqIDI0LjApIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKHllYXJzKSAqICg2MCAqIDYwICogMjQgKiAzNjUuMCkgfHwgMC4wKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFkZHMgdG9nZXRoZXIgdHdvIElTTzg2MDEgRHVyYXRpb24gc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR3b0R1cmF0aW9ucyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oXG4gICAgICBnZXREdXJhdGlvbkFzU2Vjb25kcyhmaXJzdCwgZHVyYXRpb25SZWdleCkgK1xuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoc2Vjb25kLCBkdXJhdGlvblJlZ2V4KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBBZGQgdG9nZXRoZXIgdHdvIEhIOk1NOlNTLkREIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0hITU1TUyhcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoZmlyc3QsIHRpbWVSZWdleCkgK1xuICAgICAgZ2V0VGltZUFzU2Vjb25kcyhcbiAgICAgICAgICBzZWNvbmQsIHRpbWVSZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIEpTT04gb2JqZWN0IGRvd24gdG8gc3RyaW5nIHBhdGhzIGZvciBlYWNoIHZhbHVlc1xuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4oZGF0YSkge1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAvKipcbiAgICogUmVjdXJzZSB0aHJvdWdoIHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHsqfSBjdXJcbiAgICogQHBhcmFtIHsqfSBwcm9wXG4gICAqL1xuICBmdW5jdGlvbiByZWN1cnNlKGN1ciwgcHJvcCkge1xuICAgIGlmIChPYmplY3QoY3VyKSAhPT0gY3VyKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBjdXI7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGN1cikpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY3VyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZWN1cnNlKGN1cltpXSwgcHJvcCArICdbJyArIGkgKyAnXScpO1xuICAgICAgICBpZiAobCA9PT0gMCkgcmVzdWx0W3Byb3BdID0gW107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgIGZvciAoY29uc3QgcCBpbiBjdXIpIHtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoY3VyLCBwKSkge1xuICAgICAgICAgIGlzRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICByZWN1cnNlKGN1cltwXSwgcHJvcCA/IHByb3AgKyAnLicgKyBwIDogcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0VtcHR5ICYmIHByb3ApIHJlc3VsdFtwcm9wXSA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2UoZGF0YSwgJycpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFVuLWZsYXR0ZW4gYSBmbGF0IEpTT04gb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5mbGF0dGVuKGRhdGEpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoT2JqZWN0KGRhdGEpICE9PSBkYXRhIHx8IEFycmF5LmlzQXJyYXkoZGF0YSkpIHJldHVybiBkYXRhO1xuICBjb25zdCByZWdleCA9IC9cXC4/KFteLltcXF1dKyl8XFxbKFxcZCspXS9nO1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBwIGluIGRhdGEpIHtcbiAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBwKSkge1xuICAgICAgbGV0IGN1ciA9IHJlc3VsdDtcbiAgICAgIGxldCBwcm9wID0gJyc7XG4gICAgICBsZXQgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB3aGlsZSAobSkge1xuICAgICAgICBjdXIgPSBjdXJbcHJvcF0gfHwgKGN1cltwcm9wXSA9IChtWzJdID8gW10gOiB7fSkpO1xuICAgICAgICBwcm9wID0gbVsyXSB8fCBtWzFdO1xuICAgICAgICBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIH1cbiAgICAgIGN1cltwcm9wXSA9IGRhdGFbcF07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRbJyddIHx8IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlc1xuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnREZWNpbWFscyhudW06IG51bWJlcikge1xuICBpZiAoTWF0aC5mbG9vcihudW0pID09PSBudW0gfHwgU3RyaW5nKG51bSkuaW5kZXhPZignLicpIDwgMCkgcmV0dXJuIDA7XG4gIGNvbnN0IHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgcmV0dXJuIHBhcnRzLmxlbmd0aCB8fCAwO1xufVxuIl19
