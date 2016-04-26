/**
 * Created by James on 2015/7/7.
 */
angular.module('yymoblie.directives', [])

    .directive('hideTabs', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                //scope.$watch(attributes.hideTabs, function (value) {
                //    $rootScope.hideTabs = value;
                //});

                //scope.$on('$destroy', function (event) {
                //    $rootScope.hideTabs = false;
                //});
            }
        };
    })
    .directive('onSelectedRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    element.ready(function () {
                        $timeout(function() {
                            scope.$emit('ngSelected');
                        })
                    });
                }

            }
        }
    })
    .directive('loadMoreScroll', function ($timeout) {
        return {
            restrict: 'E',
            scope:{
                loadMore:'&loadmore',
                distance:'@'
            },
            template: function($element, $attrs) {
                return '<div class="loading-div"  style="display: none"><img src="css/img/loading.gif" class="loading-gif"/>加载中...</div>';
            },
            link: function (scope, element, attrs) {
            $(document).bind("scroll",function(){

                if(($(document).scrollTop())+10>=$(document).height()-$(window).height()){
                    $(".loading-div").show();
                    scope.loadMore();
                    scope.$digest();
                }
            });

            }
        }
    })
    .directive('yyHeader', function ($timeout) {
        return {
            restrict: 'E',
            template: '<div class="backBar"><a class="GoBack" ng-if="!isHidden" ng-click="goBack()"><img src="images/backkey.png" width="14" /></a>{{title}}</div>',
            controller: function($scope, $element){
                $scope.goBack=function(){
                    history.go(-1);
                }
            },
            link: function(scope, el, attr) {

            },
            compile: function(element, attributes) {
                return {
                    pre: function preLink(scope, element, attributes) {
                        //scope.title = attributes['title'];
                    },
                    post: function postLink(scope, element, attributes) {
                        scope.title = attributes['title'];
                        scope.isHidden = attributes["hidebackbtn"]=="true"?true:false;
                    }
                };
            }
        }
    })
    .directive('itemPay',function(){
        return {
            restrict:'A',
//			scope:{
//				payData:'='
//			},
            template:'<div class="pay-select clearfix">'
            +'<span class="pay-money" ng-repeat="item in payData" ng-click="spanClick($index,$event)">{{item.val}}</span>'
            +'</div>',
            replace:true,
            link:function(scope,element,attrs){
                var payData = scope.payData;
                scope.spanClick = function(index,e){
                    var toElement = $(e.currentTarget);
                    var sibElement  = toElement.siblings();
                    sibElement.removeClass('active');
                    sibElement.removeClass('act-pay');
                    if(payData[index].val=='其他金额'){
                        toElement.addClass('act-pay');
                        toElement.attr('contenteditable', true);
                        toElement.focus();
                        toElement.html('');
                        toElement.bind('blur', function () {
                            toElement.attr('contenteditable', false);
                            if (toElement.html() == '' || toElement.html() == '其他金额') {
                                toElement.html('其他金额');
                                toElement.removeClass('act-pay');
                            } else {
                                paynum = toElement.html();
                                toElement.html(paynum + '元');
                                toElement.removeClass('act-pay');
                                toElement.addClass('active');
                            }
                        });
                        element.bind('keydown', function (event) {
                            var esc_key = event.which === 27,
                                enter_key = event.which === 13;

                            if (esc_key || enter_key) {
                                event.preventDefault();
                                toElement.blur();
                            }
                        });
                    }else{
                        toElement.addClass('active')
                    }
                }
            }
        }
    })
;
