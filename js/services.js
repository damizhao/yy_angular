/**
 * Created by James on 2015/7/29.
 */
angular.module('yymoblie.services', [])

   .factory('authenticationInterceptor', function ($rootScope, $q, $loading, $timeout, SERVER   ) {
        return {
            request: function (config) {
                if (!!config.url.indexOf && (config.url.indexOf(SERVER.url) > -1 || config.url.indexOf(SERVER.imgUrl) > -1)){
                    console.log('Url:' + config.url);
                    console.log('Send:' + JSON.stringify(config.data));
                    if(location.href.indexOf("home")==-1){
                        $loading.show({template:'加载中...', noBackdrop: 'true'});
                    }
                    if(config.url.indexOf('/SendMobileAndPass') === -1 &&
                        config.url.indexOf('/Login') === -1 ) {

                        if (config.data) {
                            config.data['apiKey'] = "test";
                        } else {
                            config.data = {'apiKey': "test"};
                        }
                        return config;
                    }
                } else {
                    return config;
                }
            },

            requestError: function (rejection) {
                $loading.hide();
                console.error(rejection);
                return $q.reject(rejection);
            },

            response: function (response) {
                var url = response.config && response.config.url;
                if (url && url.indexOf(SERVER.url) > -1 || url.indexOf(SERVER.imgUrl) > -1){
                    $loading.hide();
                    //console.log('Receive:' + JSON.stringify(response.data));
                    var data = response.data;
                    if (data.code!=302&&data.code != 200) {
                        if(data.code == 300){
                            return $q.reject(response);
                        }
                        //提示信息
                        $loading.show({
                            template: data.info,
                            duration: 2000
                        });
                        data.error = data.message;
                        return $q.reject(response);
                    };
                    /*if (data.data != undefined && !data.data) {
                        //提示信息
                        $loading.show({
                            template: data.message,
                            duration: 2000
                        });
                        data.error = data.message;
                        return $q.reject(response);
                    };*/
                };

                return response;
            },

            responseError: function (rejection) {
                $loading.hide();
                if ( rejection.status === 401) {
                    //console.error("Not logged in");
                    //$rootScope.$broadcast('auth-loginRequired');
                   /* var wxshare="n";
                    if(formWeixin){
                        wxshare="y";
                    }
                    if(location.href.indexOf("profile")!=-1&&formType=="mp"){
                        window.sessionStorage.setItem("needToProfile",true);
                    }
                    var urls =encodeURIComponent(SERVER.url+"/Register/WXLoginWeb?&shopid="+shopid+"&ruri="+location.href.split("#")[1]+"&wxshare="+wxshare);
                    location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APP_ID+"&redirect_uri="+urls+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";*/
                }

                return $q.reject(rejection);
            }

        };
    })

    .factory('networkInterceptor', function ($q) {
        return {
            request: function (config) {
                var networkState;

                if (navigator.connection) {
                    networkState = navigator.connection.type;
                } else {
                    return config;
                }

                // console.log(networkState);

                return config;
            },
 
            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {
                return response;
            },

            responseError: function (rejection) {
                return $q.reject(rejection);
            }

        };
    })
    .factory('Storage', function ($q) {

        var authDefer = $q.defer();
        var historyDefer = $q.defer();

        var errorHandler = function (err) {
            console.error("Error", err);
        };

        //获取本地存储obj值
        var _getObjItem = function(obj, key) {
            var json = sessionStorage.getItem(obj);
            if (json == null || json == undefined || json == "undefined" || json == "") {
                return undefined;
            } else {
                json = JSON.parse(json);
            }
            if (arguments.length == 1) {
                return json;
            } else {
                return json[key];
            }
        };
        //设置本地存储obj值
        var _setObjItem = function(obj, key, value) {
            if (arguments.length == 2) {
                sessionStorage.setItem(obj, JSON.stringify(key));
                return;
            }
            var json = sessionStorage.getItem(obj);
            if (json == null || json == undefined || json == "undefined" || json == "") {
                json = {};
            } else {
                json = JSON.parse(json);
            }
            json[key] = value;
            sessionStorage.setItem(obj, JSON.stringify(json));
        };
        //删除本地存储obj值
        var _removeObjItem = function(obj, key) {
            if (arguments.length == 1) {
                sessionStorage.removeItem(obj);
                return;
            }
            var json = sessionStorage.getItem(obj);
            if (json == null || json == undefined || json == "undefined" || json == "") {
                return;
            } else {
                json = JSON.parse(json);
            }
            delete json[key];
            sessionStorage.setItem(obj, JSON.stringify(json));
        };

        var o = {
            authPromise: authDefer.promise,
            saveCredentials: errorHandler,
            historyPromise:historyDefer.promise,
            saveHistory: errorHandler,
            getObjItem: _getObjItem,
            setObjItem: _setObjItem,
            removeObjItem: _removeObjItem
        };

        o.authPromise.finally(function () {

            // bind saveCredentials function
            o.saveCredentials = function (credentials) {

                var defer = $q.defer();

                this.setObjItem('user', credentials);
                defer.resolve();
                //defer.reject();

                return defer.promise;
            };

            o.deleteCredentials = function () {
                var defer = $q.defer();

                this.removeObjItem('user');
                defer.resolve();

                return defer.promise;
            };

        }, errorHandler.bind(null, "Promise not fired"));

        o.historyPromise.finally(function () {

            // bind saveCredentials function
            o.saveHistory = function (history) {

                var defer = $q.defer();

                this.setObjItem('history', history);
                defer.resolve();
                //defer.reject();

                return defer.promise;
            };

            o.deleteHistory = function () {
                var defer = $q.defer();

                this.removeObjItem('history');
                defer.resolve();

                return defer.promise;
            };

        }, errorHandler.bind(null, "Promise not fired"));

        var userObj = _getObjItem('user');
        if (!!userObj) {
            o.credentials = userObj;

            authDefer.resolve(o.credentials);
        } else {
            authDefer.reject();
        }

        var historyObj = _getObjItem('history');
        if (!!historyObj) {
            o.history = historyObj;

            historyDefer.resolve(o.history);
        } else {
            historyDefer.reject();
        }

        return o;
    })

    .factory('User', function ($q, Storage) {

        var userDefer = $q.defer();
        var historyDefer = $q.defer();

        var user = {
            loadingPromise: userDefer.promise,
            user: {},
            historyPromise: historyDefer.promise,
            historySearch: []
        };

        user.save = function (newUser) {
            userDefer = $q.defer();
            user.loadingPromise = userDefer.promise;

            Storage.saveCredentials(newUser).then(function () {
               // angular.extend(user.user, newUser);

                userDefer.resolve();
            }, function () {
                userDefer.reject();
            });

            return userDefer.promise;
        };

        // delete object - essentially logout
        user.clear = function () {
            userDefer = $q.defer();
            user.loadingPromise = userDefer.promise;

            Storage.deleteCredentials().finally(function () {
                user.user = {};

                userDefer.reject();
            });

            return userDefer.promise;
        };

        user.addHistory = function(para){

            historyDefer = $q.defer();
            user.historyPromise = historyDefer.promise;
            if(user.historySearch.indexOf(para) == -1){
                user.historySearch.push(para);
            }

           /* Storage.saveHistory(user.historySearch).then(function () {
                historyDefer.resolve();
            }, function () {
                historyDefer.reject();
            });*/

            return historyDefer.promise;
        };

        user.clearHistory = function(){

            historyDefer = $q.defer();
            user.historyPromise = historyDefer.promise;

            Storage.deleteHistory().finally(function () {
                user.historySearch = [];

                historyDefer.reject();
            });

            return historyDefer.promise;
        };

        Storage.authPromise.then(function (loadedUser) {
            angular.copy(loadedUser, user.user);
            // console.log('User retrieved:' + user.user);

            if (user.user.ID) {
                userDefer.resolve();
            } else {
                userDefer.resolve();
            }

        }, function () {

            userDefer.resolve();
        });

        Storage.historyPromise.then(function (history) {
            angular.copy(history, user.historySearch);

            if (user.historySearch) {
                historyDefer.resolve();
            } else {
                historyDefer.resolve();
            }

        }, function () {
            // we need to auth here
            historyDefer.reject();
        });

        return user;
    })
    .factory('Common', function ($q, $http,SERVER) {
        var o = {};
//      手机号发送验证码
        o.getDWZ = function (para) {
            var defer = $q.defer();
            var req = {
                method: 'POST',
                //url: SERVER.url + '/user/msg',
             	url:'http://native.youyoumob.com/v2/user/msg?apiKey=test',
                headers: {
                    'Content-Type':undefined
                },
                data:para
            };
            $http(req)
                .success(function (data) {
                    defer.resolve(data);
                }).error(function (err, status) {
                defer.reject(err, status);
            });

            return defer.promise;
        };
//      判断手机号是否已经注册
		o.getSub = function (para) {
            var defer = $q.defer();
            var req = {
                method: 'POST',
//              url: SERVER.url + '/user/registed',
             	url:'http://native.youyoumob.com/v2/user/registed?apiKey=test',
                headers: {
                    'Content-Type':undefined
                },
                data:para
            };
            $http(req)
                .success(function (data) {
                    defer.resolve(data);
                }).error(function (err, status) {
                defer.reject(err, status);
            });

            return defer.promise;
        };
//      账号注册
        o.regSub = function (para) {
            var defer = $q.defer();
            var req = {
                method: 'POST',
//              url: SERVER.url + '/user/registed',
             	url:'http://native.youyoumob.com/v2/user/register?apiKey=test',
                headers: {
                    'Content-Type':undefined
                },
                data:para
            };
            $http(req)
                .success(function (data) {
                    defer.resolve(data);
                }).error(function (err, status) {
                defer.reject(err, status);
            });

            return defer.promise;
        };
//      登陆
		o.loginSub = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/login?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	找回密码
		o.psdFind = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/checkmobile?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	修改密码
		o.psdModify = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/resetpwd?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	用户绑定设备
		o.deviceSub = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/mifi/userlink?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	个人中心 修改姓名 手机 密码
		o.nameSave = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/resetinfo?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	手机号码
		o.phoneSave = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/resetinfo?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	手机号码
		o.padSave = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/user/resetinfo?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	获取用户绑定信息
		o.deviceBind = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/mifi/userlinkinfo?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	设备具体信息
		o.deviceInfo = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/mifi/consumeRecord?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
//  	充值
		o.payBind = function (para) {
        var defer = $q.defer();
        var req = {
            method: 'POST',
//              url: SERVER.url + '/user/registed',
         	url:'http://native.youyoumob.com/v2/mifi/docharge?apiKey=test',
            headers: {
                'Content-Type':undefined
            },
            data:para
        };
        $http(req)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err, status) {
            defer.reject(err, status);
        });

        	return defer.promise;
    	};
        return o;
        
    })
    .factory('locals',function($window){
    	return{
    		//存储对象，以JSON格式存储
    		setObject:function(key,value){
    			$window.localStorage[key]=JSON.stringify(value);
    		},
    		get:function(key,defaultValue){
    			//var info = JSON.parse($window.localStorage[key]);
	          return  $window.localStorage[key] || defaultValue;
	        },
    		
    	}
    })
;
