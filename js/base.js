
(function () {
    window.yymoblie = window.yymoblie || {};
    window.yymoblie.views = {};
    (function (yymoblie) {

        yymoblie.Utils = {
            inherit: function (protoProps, staticProps) {
                var parent = this;
                var child;

                // The constructor function for the new subclass is either defined by you
                // (the "constructor" property in your `extend` definition), or defaulted
                // by us to simply call the parent's constructor.
                if (protoProps && protoProps.hasOwnProperty('constructor')) {
                    child = protoProps.constructor;
                } else {
                    child = function () {
                        return parent.apply(this, arguments);
                    };
                }

                // Add static properties to the constructor function, if supplied.
                yymoblie.extend(child, parent, staticProps);

                // Set the prototype chain to inherit from `parent`, without calling
                // `parent`'s constructor function.
                var Surrogate = function () {
                    this.constructor = child;
                };
                Surrogate.prototype = parent.prototype;
                child.prototype = new Surrogate();

                // Add prototype properties (instance properties) to the subclass,
                // if supplied.
                if (protoProps) yymoblie.extend(child.prototype, protoProps);

                // Set a convenience property in case the parent's prototype is needed
                // later.
                child.__super__ = parent.prototype;

                return child;
            },

            // Extend adapted from Underscore.js
            extend: function (obj) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < args.length; i++) {
                    var source = args[i];
                    if (source) {
                        for (var prop in source) {
                            obj[prop] = source[prop];
                        }
                    }
                }
                return obj;
            },

            getObjectURL: function (file) {
                var url = null ;
                if (window.createObjectURL!=undefined) { // basic
                    url = window.createObjectURL(file) ;
                } else if (window.URL!=undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file) ;
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file) ;
                }
                return url;
            },

            revokeObjectURL: function (url){
                if (window.revokeObjectURL!=undefined) { // basic
                    window.revokeObjectURL(url) ;
                } else if (window.URL!=undefined) { // mozilla(firefox)
                    window.URL.revokeObjectURL(url) ;
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    window.webkitURL.revokeObjectURL(file) ;
                }
            },
            isWechatClient:function(){
                var ua = navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    return true;
                } else {
                    return false;
                }
            },
            hasRequest:function(){
                shopid=getUrlParamString("shopid");
                wxOpenid=getUrlParamString("openid");
                var urls = encodeURIComponent(SERVER_ADDRESS + "/Transit/GetShopid?shopid=" + shopid);
                var ruri = encodeURIComponent(location.href.split("#/")[1]);
                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APP_ID + "&redirect_uri=" + urls + "&response_type=code&scope=snsapi_base&state=" + ruri + "#wechat_redirect";

            },
            isMobile:function(){
                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf('android') != -1;
                var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
                var mobileClient = window.sessionStorage.getItem('mobileClient');
                //if(!isAndroid && !isIos && getUrlParamString("openid")!="oG2PHwf32XWrx9I4hKCTbbr3EECM"){
                if(true){
                    document.writeln("不支持此系统");
                    return false;
                }
            },
            h5Lock:{
                init:function(flag,needUpdate){
                    new H5lock({
                     chooseType: 3
                     }).init(flag,needUpdate);
                    $("#mainPage,.main,.bax").addClass("active");
                },
                hide:function(){
                    $("#mainPage,.main,.bax").removeClass("active");
                    this.destroy();
                },
                cancel:function(){
                    history.go(-1);
                    $("#mainPage,.main,.bax").removeClass("active");
                    this.destroy();
                },
                createLock:function(){
                    window.sessionStorage.removeItem("passwordxx");
                    new H5lock({
                        chooseType: 3
                    }).init(0);
                    $("#mainPage,.main,.bax").addClass("active");
                },
                destroy:function(){
                    $("#H5Lock").html("");
                }
            },
            compressImage: function(srcImgObj, quality, outputFormat) {
                var self = this.Utils;
                if ((srcImgObj instanceof Image || srcImgObj instanceof HTMLImageElement) && !srcImgObj.complete) return false;

                var mimeType = "image/jpeg";
                if(outputFormat != undefined && outputFormat == "png") {
                    mimeType = "image/png";
                }

                var cvs = document.createElement('canvas');
                cvs.width = srcImgObj.naturalWidth * (quality / 100);
                cvs.height = srcImgObj.naturalHeight * (quality / 100);
                var ctx = cvs.getContext("2d");
                ctx.drawImage(srcImgObj, 0, 0, srcImgObj.naturalWidth, srcImgObj.naturalHeight, 0, 0, cvs.width, cvs.height);

                var newImageData = cvs.toDataURL(mimeType, quality / 100);
                if (newImageData.indexOf('data:') == -1) {
                    var encoder = new JPEGEncoder(),
                        img = ctx.getImageData(0, 0, cvs.width, cvs.height);

                    newImageData = encoder.encode(img, quality);
                }

                ctx = null;
                cvs = null;

                return newImageData;
            },
            covertBase64:function() {

            // private property
            _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            // public method for encoding
            this.encode = function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = _utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                }
                return output;
            }

            // public method for decoding
            this.decode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = _utf8_decode(output);
                return output;
            }

            // private method for UTF-8 encoding
            _utf8_encode = function (string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }
                return utftext;
            }

            // private method for UTF-8 decoding
            _utf8_decode = function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;
                while ( i < utftext.length ) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i+1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i+1);
                        c3 = utftext.charCodeAt(i+2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return string;
            }
        },
            getUrlParamString:function(name){
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var params = window.location.search.substr(1);
                if(!params){
                    var arr = window.location.href.split('?');
                    params = arr.length > 1 ? arr[1] : '';
                }
                var r = params.match(reg);
                if (r != null) {
                    return unescape(r[2]);
                    return null;
                }
            },
            replaceParamVal:function(paramName,replaceWith){
                var oUrl = this.location.href.toString();
                var re=eval('/('+ paramName+'=)([^&]*)/gi');

                var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
                return nUrl;
            }

        };

        yymoblie.inherit = yymoblie.Utils.inherit;
        yymoblie.extend = yymoblie.Utils.extend;
        yymoblie.getObjectURL = yymoblie.Utils.getObjectURL;
        yymoblie.revokeObjectURL = yymoblie.Utils.revokeObjectURL;
        yymoblie.isWechatClient = yymoblie.Utils.isWechatClient;
        yymoblie.hasRequest = yymoblie.Utils.hasRequest;
        yymoblie.isMobile = yymoblie.Utils.isMobile;
        yymoblie.h5Lock = yymoblie.Utils.h5Lock;
        yymoblie.compressImage = yymoblie.Utils.compressImage;
        yymoblie.covertBase64 = yymoblie.Utils.covertBase64;
        yymoblie.getUrlParamString = yymoblie.Utils.getUrlParamString;
        yymoblie.replaceParamVal = yymoblie.Utils.replaceParamVal;
    })(window.yymoblie);

    (function (yymoblie) {
        'use strict';
        yymoblie.views.View = function () {
            this.initialize.apply(this, arguments);
        };

        yymoblie.views.View.inherit = yymoblie.inherit;

        yymoblie.extend(yymoblie.views.View.prototype, {
            initialize: function () {
            }
        });

    })(window.yymoblie);

    (function (yymoblie) {
        yymoblie.views.Dialog = yymoblie.views.View.inherit({
            initialize: function (opts) {
                opts = yymoblie.extend({
                    focusFirstInput: false,
                    unfocusOnHide: true,
                    focusFirstDelay: 600,
                    backdropClickToClose: true,
                }, opts);

                yymoblie.extend(this, opts);

                this.el = opts.el;
            },
            show: function () {
                var self = this;

                if (self.focusFirstInput) {
                    // Let any animations run first
                    window.setTimeout(function () {
                        var input = self.el.querySelector('input, textarea');
                        input && input.focus && input.focus();
                    }, self.focusFirstDelay);
                }
            },
            hide: function () {
                // Unfocus all elements
                if (this.unfocusOnHide) {
                    var inputs = this.el.querySelectorAll('input, textarea');
                    // Let any animations run first
                    window.setTimeout(function () {
                        for (var i = 0; i < inputs.length; i++) {
                            inputs[i].blur && inputs[i].blur();
                        }
                    });
                }
            }
        });

    })(window.yymoblie);
})();

(function () {
    var yymoblieModule = angular.module('yymoblie.base', []),
        extend = angular.extend,
        jqLite = angular.element,
        noop = angular.noop;
    yymoblieModule
        .factory('$body', ['$document', function ($document) {
            return {
                /**
                 * @ngdoc method
                 * @name $body#add
                 * @description Add a class to the document's body element.
                 * @param {string} class Each argument will be added to the body element.
                 * @returns {$body} The $body service so methods can be chained.
                 */
                addClass: function () {
                    for (var x = 0; x < arguments.length; x++) {
                        $document[0].body.classList.add(arguments[x]);
                    }
                    return this;
                },
                /**
                 * @ngdoc method
                 * @name $body#removeClass
                 * @description Remove a class from the document's body element.
                 * @param {string} class Each argument will be removed from the body element.
                 * @returns {$body} The $body service so methods can be chained.
                 */
                removeClass: function () {
                    for (var x = 0; x < arguments.length; x++) {
                        $document[0].body.classList.remove(arguments[x]);
                    }
                    return this;
                },
                /**
                 * @ngdoc method
                 * @name $body#enableClass
                 * @description Similar to the `add` method, except the first parameter accepts a boolean
                 * value determining if the class should be added or removed. Rather than writing user code,
                 * such as "if true then add the class, else then remove the class", this method can be
                 * given a true or false value which reduces redundant code.
                 * @param {boolean} shouldEnableClass A true/false value if the class should be added or removed.
                 * @param {string} class Each remaining argument would be added or removed depending on
                 * the first argument.
                 * @returns {$body} The $body service so methods can be chained.
                 */
                enableClass: function (shouldEnableClass) {
                    var args = Array.prototype.slice.call(arguments).slice(1);
                    if (shouldEnableClass) {
                        this.addClass.apply(this, args);
                    } else {
                        this.removeClass.apply(this, args);
                    }
                    return this;
                },
                /**
                 * @ngdoc method
                 * @name $body#append
                 * @description Append a child to the document's body.
                 * @param {element} element The element to be appended to the body. The passed in element
                 * can be either a jqLite element, or a DOM element.
                 * @returns {$body} The $body service so methods can be chained.
                 */
                append: function (ele) {
                    $document[0].body.appendChild(ele.length ? ele[0] : ele);
                    return this;
                },
                /**
                 * @ngdoc method
                 * @name $body#get
                 * @description Get the document's body element.
                 * @returns {element} Returns the document's body element.
                 */
                get: function () {
                    return $document[0].body;
                }
            };
        }]);
    yymoblieModule
        .factory('$templateLoader', [
            '$compile',
            '$controller',
            '$http',
            '$q',
            '$rootScope',
            '$templateCache',
            function ($compile, $controller, $http, $q, $rootScope, $templateCache) {

                return {
                    load: fetchTemplate,
                    compile: loadAndCompile
                };

                function fetchTemplate(url) {
                    return $http.get(url, {cache: $templateCache})
                        .then(function (response) {
                            return response.data && response.data.trim();
                        });
                }

                function loadAndCompile(options) {
                    options = extend({
                        template: '',
                        templateUrl: '',
                        scope: null,
                        controller: null,
                        locals: {},
                        appendTo: null
                    }, options || {});

                    var templatePromise = options.templateUrl ?
                        this.load(options.templateUrl) :
                        $q.when(options.template);

                    return templatePromise.then(function (template) {
                        var controller;
                        var scope = options.scope || $rootScope.$new();

                        //Incase template doesn't have just one root element, do this
                        var element = jqLite('<div>').html(template).contents();

                        if (options.controller) {
                            controller = $controller(
                                options.controller,
                                extend(options.locals, {
                                    $scope: scope
                                })
                            );
                            element.children().data('$ngControllerController', controller);
                        }
                        if (options.appendTo) {
                            jqLite(options.appendTo).append(element);
                        }

                        $compile(element)(scope);

                        return {
                            element: element,
                            scope: scope
                        };
                    });
                }

            }]);
    yymoblieModule
        .factory('$backdrop', [
            '$document', '$timeout', '$$rAF',
            function ($document, $timeout, $$rAF) {

                var el = jqLite('<div class="backdrop">');
                var backdropHolds = 0;

                $document[0].body.appendChild(el[0]);

                return {
                    retain: retain,
                    release: release,
                    getElement: getElement,
                    _element: el
                };

                function retain() {
                    backdropHolds++;
                    if (backdropHolds === 1) {
                        el.addClass('visible');
                        $$rAF(function () {
                            // If we're still at >0 backdropHolds after async...
                            if (backdropHolds >= 1) el.addClass('active');
                        });
                    }
                }

                function release() {
                    if (backdropHolds === 1) {
                        el.removeClass('active');
                        $timeout(function () {
                            // If we're still at 0 backdropHolds after async...
                            if (backdropHolds === 0) el.removeClass('visible');
                        }, 400, false);
                    }
                    backdropHolds = Math.max(0, backdropHolds - 1);
                }

                function getElement() {
                    return el;
                }

            }]);


    var LOADING_TPL =
        '<div class="loading-container">' +
        '<div class="loading">' +
        '</div>' +
        '</div>';

    var LOADING_HIDE_DEPRECATED = '$loading instance.hide() has been deprecated. Use $loading.hide().';
    var LOADING_SHOW_DEPRECATED = '$loading instance.show() has been deprecated. Use $loading.show().';
    var LOADING_SET_DEPRECATED = '$loading instance.setContent() has been deprecated. Use $loading.show({ template: \'my content\' }).';

    yymoblieModule
        .constant('$loadingConfig', {
            template: '<ion-spinner></ion-spinner>'
        })
        .factory('$loading', [
            '$loadingConfig',
            '$body',
            '$backdrop',
            '$timeout',
            '$q',
            '$log',
            '$$rAF',
            function ($loadingConfig, $body, $backdrop, $timeout, $q, $log, $$rAF) {

                var loaderInstance;
                //default values
                var deregisterStateListener1 = noop;
                var deregisterStateListener2 = noop;
                var loadingShowDelay = $q.when();

                return {
                    /**
                     * @ngdoc method
                     * @name $loading#show
                     * @description Shows a loading indicator. If the indicator is already shown,
                     * it will set the options given and keep the indicator shown.
                     * @param {object} opts The options for the loading indicator. Available properties:
                     *  - `{string=}` `template` The html content of the indicator.
                     *  - `{boolean=}` `noBackdrop` Whether to hide the backdrop. By default it will be shown.
                     *  - `{boolean=}` `hideOnStateChange` Whether to hide the loading spinner when navigating
                     *    to a new state. Default false.
                     *  - `{number=}` `delay` How many milliseconds to delay showing the indicator. By default there is no delay.
                     *  - `{number=}` `duration` How many milliseconds to wait until automatically
                     *  hiding the indicator. By default, the indicator will be shown until `.hide()` is called.
                     */
                    show: showLoader,
                    /**
                     * @ngdoc method
                     * @name $loading#hide
                     * @description Hides the loading indicator, if shown.
                     */
                    hide: hideLoader,
                    /**
                     * @private for testing
                     */
                    _getLoader: getLoader
                };

                function getLoader() {
                    if (!loaderInstance) {

                        loaderInstance = $q.when(LOADING_TPL)

                            .then(function (template) {
                                //Incase template doesn't have just one root element, do this
                                var element = jqLite('<div>').html(template).contents();

                                jqLite($body.get()).append(element);

                                return {
                                    element: element
                                };
                            });
                        loaderInstance.then(function (self) {
                            self.show = function (options) {
                                var templatePromise = $q.when(options.template || options.content || '');

                                if (!self.isShown) {
                                    //options.showBackdrop: deprecated
                                    self.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
                                    if (self.hasBackdrop) {
                                        $backdrop.retain();
                                        $backdrop.getElement().addClass('backdrop-loading');
                                    }
                                }

                                if (options.duration) {
                                    $timeout.cancel(self.durationTimeout);
                                    self.durationTimeout = $timeout(
                                        angular.bind(self, self.hide),
                                        +options.duration
                                    );
                                }

                                templatePromise.then(function (html) {
                                    if (html) {
                                        var loading = self.element.children();
                                        loading.html(html);
                                    }

                                    //Don't show until template changes
                                    if (self.isShown) {
                                        self.element.addClass('visible');
                                        $$rAF(function () {
                                            if (self.isShown) {
                                                self.element.addClass('active');
                                                $body.addClass('loading-active');
                                            }
                                        });
                                    }
                                });

                                self.isShown = true;
                            };
                            self.hide = function () {

                                if (self.isShown) {
                                    if (self.hasBackdrop) {
                                        $backdrop.release();
                                        $backdrop.getElement().removeClass('backdrop-loading');
                                    }
                                    self.element.removeClass('active');
                                    $body.removeClass('loading-active');
                                    setTimeout(function () {
                                        !self.isShown && self.element.removeClass('visible');
                                    }, 200);
                                }
                                $timeout.cancel(self.durationTimeout);
                                self.isShown = false;
                            };

                            return self;
                        });
                    }
                    return loaderInstance;
                }

                function showLoader(options) {
                    options = extend({}, $loadingConfig || {}, options || {});
                    var delay = options.delay || options.showDelay || 0;

                    deregisterStateListener1();
                    deregisterStateListener2();
                    if (options.hideOnStateChange) {
                        deregisterStateListener1 = $rootScope.$on('$stateChangeSuccess', hideLoader);
                        deregisterStateListener2 = $rootScope.$on('$stateChangeError', hideLoader);
                    }

                    //If loading.show() was called previously, cancel it and show with our new options
                    $timeout.cancel(loadingShowDelay);
                    loadingShowDelay = $timeout(noop, delay);
                    loadingShowDelay.then(getLoader).then(function (loader) {
                        return loader.show(options);
                    });

                    return {
                        hide: function deprecatedHide() {
                            $log.error(LOADING_HIDE_DEPRECATED);
                            return hideLoader.apply(this, arguments);
                        },
                        show: function deprecatedShow() {
                            $log.error(LOADING_SHOW_DEPRECATED);
                            return showLoader.apply(this, arguments);
                        },
                        setContent: function deprecatedSetContent(content) {
                            $log.error(LOADING_SET_DEPRECATED);
                            return getLoader().then(function (loader) {
                                loader.show({template: content});
                            });
                        }
                    };
                }

                function hideLoader() {
                    deregisterStateListener1();
                    deregisterStateListener2();
                    $timeout.cancel(loadingShowDelay);
                    getLoader().then(function (loader) {
                        loader.hide();
                    });
                }
            }]);

    yymoblieModule
        .factory('$dialog', [
            '$backdrop',
            '$rootScope',
            '$body',
            '$compile',
            '$timeout',
            '$templateLoader',
            '$$q',
            '$log',
            '$window',
            function ($backdrop, $rootScope, $body, $compile, $timeout, $templateLoader, $$q, $log, $window) {

                /**
                 * @ngdoc controller
                 * @name dialog
                 * @module yymoblie
                 * @description
                 * Instantiated by the {@link yymoblie.service:$dialog} service.
                 *
                 * Be sure to call [remove()](#remove) when you are done with each modal
                 * to clean it up and avoid memory leaks.
                 *
                 * Note: a modal will broadcast 'dialog.shown', 'dialog.hidden', and 'dialog.removed' events from its originating
                 * scope, passing in itself as an event argument. Note: both dialog.removed and dialog.hidden are
                 * called when the dialog is removed.
                 */
                var DialogView = yymoblie.views.Dialog.inherit({
                    /**
                     * @ngdoc method
                     * @name dialog#initialize
                     * @description Creates a new dialog controller instance.
                     * @param {object} options An options object with the following properties:
                     *  - `{object=}` `scope` The scope to be a child of.
                     *    Default: creates a child of $rootScope.
                     *  - `{string=}` `animation` The animation to show & hide with.
                     *    Default: 'slide-in-up'
                     *  - `{boolean=}` `focusFirstInput` Whether to autofocus the first input of
                     *    the dialog when shown. Will only show the keyboard on iOS, to force the keyboard to show
                     *    on Android, please use the [Ionic keyboard plugin](https://github.com/driftyco/ionic-plugin-keyboard#keyboardshow).
                     *    Default: false.
                     *  - `{boolean=}` `backdropClickToClose` Whether to close the dialog on clicking the backdrop.
                     *    Default: true.
                     */
                    initialize: function (opts) {
                        yymoblie.views.Dialog.prototype.initialize.call(this, opts);
                        this.animation = opts.animation || 'slide-in-up';
                        this.position = opts.position || 'center';
                        this.hasBackdrop = !opts.noBackdrop && opts.showBackdrop !== false;
                    },

                    /**
                     * @ngdoc method
                     * @name dialog#show
                     * @description Show this dialog instance.
                     * @returns {promise} A promise which is resolved when the dialog is finished animating in.
                     */
                    show: function (target) {
                        var self = this;

                        if (self.scope.$$destroyed) {
                            $log.error('Cannot call dialog.show() after remove(). Please create a new dialog instance.');
                            return $$q.when();
                        }

                        var dialogEl = jqLite(self.dialogEl);

                        dialogEl.addClass(self.position);

                        self.el.classList.add('visible');

                        if (!self.el.parentElement) {
                            dialogEl.addClass(self.animation);
                            $body.append(self.el);
                        }

                        if (target && self.positionView) {
                            self.positionView(target, dialogEl);
                            // set up a listener for in case the window size changes

                            self._onWindowResize = function () {
                                if (self._isShown) self.positionView(target, dialogEl);
                            };
                            window.addEventListener('resize', self._onWindowResize);
                        }

                        dialogEl.addClass('ng-enter active')
                            .removeClass('ng-leave ng-leave-active');

                        self._isShown = true;
                        if (self.hasBackdrop) {
                            $backdrop.retain();
                            $backdrop.getElement().addClass('backdrop-loading');
                        }

                        yymoblie.views.Dialog.prototype.show.call(self);

                        $timeout(function () {
                            if (!self._isShown) return;
                            dialogEl.addClass('ng-enter-active');
                            //window.dispatchEvent('resize');
                            self.el.classList.add('active');
                        }, 20);

                        return $timeout(function () {
                            if (!self._isShown) return;
                            //After animating in, allow hide on backdrop click
                            self.$el.on('click', function (e) {
                                if (self.backdropClickToClose && e.target === self.el) {
                                    self.hide();
                                }
                            });
                        }, 400);
                    },

                    /**
                     * @ngdoc method
                     * @name dialog#hide
                     * @description Hide this dialog instance.
                     * @returns {promise} A promise which is resolved when the dialog is finished animating out.
                     */
                    hide: function () {
                        var self = this;
                        var dialogEl = jqLite(self.dialogEl);

                        self.el.classList.remove('active');
                        dialogEl.addClass('ng-leave');

                        $timeout(function () {
                            if (self._isShown) return;
                            if (self.hasBackdrop) {
                                $backdrop.release();
                                $backdrop.getElement().removeClass('backdrop-loading');
                            }
                            dialogEl.addClass('ng-leave-active')
                                .removeClass('ng-enter ng-enter-active active');
                        }, 20, false);

                        self.$el.off('click');
                        self._isShown = false;

                        yymoblie.views.Dialog.prototype.hide.call(self);

                        // clean up event listeners
                        if (self.positionView) {
                            window.removeEventListener('resize', self._onWindowResize);
                        }

                        return $timeout(function () {
                            self.el.classList.remove('visible');
                        }, self.hideDelay || 320);
                    },

                    /**
                     * @ngdoc method
                     * @name dialog#remove
                     * @description Remove this dialog instance from the DOM and clean up.
                     * @returns {promise} A promise which is resolved when the dialog is finished animating out.
                     */
                    remove: function () {
                        var self = this;

                        return self.hide().then(function () {
                            self.scope.$destroy();
                            self.$el.remove();
                        });
                    },

                    /**
                     * @ngdoc method
                     * @name dialog#isShown
                     * @returns boolean Whether this dialog is currently shown.
                     */
                    isShown: function () {
                        return !!this._isShown;
                    }
                });

                var createDialog = function (templateString, options) {
                    // Create a new scope for the dialog
                    var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

                    // Compile the template
                    var element = $compile('<div class="dialog-container">' +
                        '<div class="dialog">' + templateString +
                        '</div>' +
                        '</div>>')(scope);

                    options.$el = element;
                    options.el = element[0];
                    options.dialogEl = options.el.querySelector('.dialog');
                    var dialog = new DialogView(options);

                    dialog.scope = scope;

                    return dialog;
                };

                return {
                    /**
                     * @ngdoc method
                     * @name $dialog#fromTemplate
                     * @param {string} templateString The template string to use as the dialog's
                     * content.
                     * @param {object} options Options to be passed {@link yymoblie.controller:dialog#initialize dialog#initialize} method.
                     * @returns {object} An instance of an {@link yymoblie.controller:dialog}
                     * controller.
                     */
                    fromTemplate: function (templateString, options) {
                        var dialog = createDialog(templateString, options || {});
                        return dialog;
                    },
                    /**
                     * @ngdoc method
                     * @name $dialog#fromTemplateUrl
                     * @param {string} templateUrl The url to load the template from.
                     * @param {object} options Options to be passed {@link yymoblie.controller:dialog#initialize dialog#initialize} method.
                     * options object.
                     * @returns {promise} A promise that will be resolved with an instance of
                     * an {@link yymoblie.controller:dialog} controller.
                     */
                    fromTemplateUrl: function (url, options, _) {
                        var cb;
                        //Deprecated: allow a callback as second parameter. Now we return a promise.
                        if (angular.isFunction(options)) {
                            cb = options;
                            options = _;
                        }
                        return $templateLoader.load(url).then(function (templateString) {
                            var dialog = createDialog(templateString, options || {});
                            cb && cb(dialog);
                            return dialog;
                        });
                    }
                };
            }]);

    yymoblieModule
        .factory('$share', ['$q', function($q) {
            return {
                login: function () {
                    var defer = $q.defer();

                    umengshare.login(function(result) {
                        defer.resolve(result);
                    }, function(error) {
                        defer.reject(error);
                    });

                    return defer.promise;
                },
                shareViaWeChat: function (para) {
                    var defer = $q.defer();

                    umengshare.shareViaWeChat(para, function(result) {
                        defer.resolve(result);
                    }, function(error) {
                        defer.reject(error);
                    });

                    return defer.promise;
                }
            };
        }]);
})();

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.distinct = function () {
    return this.reduce(function (new_array, old_array_value) {
        if (new_array.indexOf(old_array_value) == -1) new_array.push(old_array_value);
        return new_array; //最终返回的是 prev value 也就是recorder
    }, []);
}