// Ionic Health App

angular.module('yymoblie', ['ui.router','yymoblie.controllers','yymoblie.services','yymoblie.base','yymoblie.directives'])

    .run(function ( $rootScope) {

    })
    .config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('register',{
                templateUrl:'views/register.html',
                url:'/register',
                controller:'RegisterForm'
            })
            .state('modifyregister',{
                templateUrl:'views/modifyregister.html',
                url:'/modifyregister/:phoneNum',
                controller:'ModifyregisterCtrl'
            })
            .state('login',{
                templateUrl:'views/login.html',
                url:'/login',
                contorller:'LoginCtrl'
                
            })
            .state('signIn',{
                templateUrl:'views/signIn.html',
                url:'/signIn/:phNum',
                controller:'SigninCtrl'
            })
            .state('retrievepd',{
                templateUrl:'views/retrievepd.html',
                url:'/retrievepd',
                controller:'RegisterForm'
            
            })
            .state('modifypassword',{
            	templateUrl:'views/modifypassword.html',
            	url:'/modifypassword/:phNum',
            	controller:'modifyPassCtrl'
            })
            .state('right',{
                templateUrl:'views/right.html',
                url:'/right'
            })
            .state('rightpassword',{
            	templateUrl:'views/rightpassword.html',
            	url:'/rightpassword'
            })
            .state('pay',{
                templateUrl:'views/pay.html',
                url:'/pay/:userphone',
                controller:'PayController'
            })
            .state('payments',{
                templateUrl:'views/payments.html',
                url:'/payments',
                controller:'paymentsCtrl'
            })
            .state('deviceinfo',{
                templateUrl:'views/deviceinfo.html',
                url:'/deviceinfo',
                controller:'devController'
            })
            .state('devicemanage',{
                templateUrl:'views/devicemanage.html',
                url:'/devicemanage/:deviceNum',
                controller:'devicemanageCtrl'
            })
            .state('memberCenter',{
                templateUrl:'views/memberCenter.html',
                url:'/memberCenter',
                controller:'membercenterCtrl'
            })
            .state('mencentinfo',{
                templateUrl:'views/mencentinfo.html',
                url:'/mencentinfo',
                controller:'mencentinfoCtrl'
            })
            .state('modifyname',{
                templateUrl:'views/modifyname.html',
                url:'/modifyname/:oldname',
                controller:'modifynameCtrl'
            })
            .state('modifyphone',{
                templateUrl:'views/modifyphone.html',
                url:'/modifyphone/:oldphone',
                controller:'RegisterForm'
            })
            .state('modifyphonelist',{
                templateUrl:'views/modifyphonelist.html',
                url:'/modifyphonelist',
                controller:'modifyphonelistCtrl'
            })
            .state('mycapital',{
                templateUrl:'views/mycapital.html',
                url:'/mycapital/:userphone',
                controller:'PayController'
            })
            .state('mydevice',{
                templateUrl:'views/mydevice.html',
                url:'/mydevice',
                controller:'mydeviceCtrl'
            })
        $urlRouterProvider.otherwise('login')

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/home');
    }])

    .constant('SERVER', {
        url: "http://native.youyoumob.com/v2",
        imgUrl: location.href.indexOf('wm.guoboshi')==-1?'http://img01.jk724.com':'http://jk724img01.guoboshi.com'

    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');

        // check network status of app and handle requests accordingly
        $httpProvider.interceptors.push('networkInterceptor');
    })

    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            //'http://teapi.guoboshi.com/**',
            'http://wmapi.jk724.com/!**',
            'http://img01.jk724.com/!**'
        ]);
    })
;


