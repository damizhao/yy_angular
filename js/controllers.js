angular.module('yymoblie.controllers', [])
//支付
    .controller('PayController', function ($scope,$state,$stateParams,Common,locals) {
        $scope.payData = [
            {val:'50元'},
            {val:'100元'},
            {val:'200元'},
            {val:'500元'},
            {val:'1000元'},
            {val:'其他金额'}
        ];
        $scope.userphone = $stateParams.userphone;
        var info = JSON.parse(locals.get('data',''));
        $scope.payBind = function(){
        	var money = $('.active').text();
        	money = money.replace('元','');
        	console.log(money);
        	var para = {
        		uid:'927ab35a74fd4494ae590d05bfb0da4e',
        		phone:info.mobile,
        		money:money
        	}
        	Common.payBind(para).then(function(result){
        		location.href=result.data;
        	});
        	
        }
    })
//  账户登录
    .controller('LoginCtrl',function($scope,$state,$interval,$loading,Common,locals){
    	$scope.fnFocus = function(){
        	$scope.phoner = false;
        }
        $scope.phoner = false;
        $scope.phone = '';
        $scope.password = '';
		$scope.fnBlur = function(){
			if(!(/^1[0-9]\d{5,9}$/.test($scope.phone))){
				if($scope.phone==''){
		  	 		$scope.phoner = false;
		  	 	}else{
		  	 		$scope.phoner = true;
		  	 	}
			}	 
        }
        $scope.loginUse = function(){
        	if($scope.phone==''||$scope.password==''){
        		alert("请输入手机号码");
        	}else{
        		var para = {
		        	mobile:$scope.phone,
		        	password:$scope.password
		        }
		        Common.loginSub(para).then(function(result){
		        	locals.setObject('data',result.data);
		        	$state.go('deviceinfo')
		        })
        	}
        	
        }
        
    })
//	账户注册
    .controller('RegisterForm',function($scope,$state,$interval,$loading,Common,$stateParams,locals){
	  	//$scope.code ='';
 		//$scope.password = '';
        $scope.paracont = "获取验证码";
        $scope.paraclass = '';
//    	$scope.phone="";
        $scope.params={
        	phone:"",
        	password:'',
        	code:''
        }
        var second = 60,
            timePromise = undefined;
        $scope.fnFocus = function(){
        	$scope.phoner = false;
        }
        $scope.phoner = false;
       	$scope.fnBlur1 = function(){
        	  if(!(/^1[0-9]\d{5,9}$/.test($scope.params.phone))){
        	  	 if($scope.params.phone==''){
        	  	 	$scope.phoner = false;
        	  	 }else{
        	  	 	$scope.phoner = true;
        	  	 }
        	  }
        }
        $scope.fnBlur = function(){
        	  if(!(/^1[0-9]\d{5,9}$/.test($scope.params.phone))){
        	  	 if($scope.params.phone==''){
        	  	 	$scope.phoner = false;
        	  	 }else{
        	  	 	$scope.phoner = true;
        	  	 }
        	  }else{
        	  	$scope.VerificationUse();
        	  }
        }
//      修改密码下一步
        $scope.NextmodifyPass = function(){
        	if($scope.params.phone==''||$scope.params.code==''){
        		alert('请输入正确信息');
        	}else{
        		var para ={
	        		mobile:$scope.params.phone,
	        		code:$scope.params.code
	        	}
	        	Common.psdFind(para).then(function(reuslt){
	        		$state.go('modifypassword',{phNum:para.mobile});
	        	})
        	}
        	
        }
//      判断号码是否是会员
        $scope.VerificationUse = function(){
        	var param = {
        		mobile:$scope.params.phone
        	}
        	Common.getSub(param).then(function(result){
        		if(result.code==302){
        			$state.go("modifyregister",{phoneNum:param.mobile});
        		}
        	});
        }
//      发送手机验证
        $scope.verification = function(){
            if ( angular.isDefined(timePromise) ) return;
            if($scope.params.phone==''){
            	alert('请输入号码');
            	return false;
            }else{
		        var para = {
		        	mobile:$scope.params.phone
		        }
		        Common.getDWZ(para).then(function(result){
		        	$loading.show({template:'发送成功...', duration: 1500});
		        });
		        timePromise = $interval(function(){
		            if(second<=0){
		                $interval.cancel(timePromise);
		                timePromise = undefined;
		                second = 60;
		                $scope.paracont = "重发验证码";
		                $scope.paraclass = "";
		            }else{
		                $scope.paracont = second + "秒后可重发";
		                $scope.paraclass = "intime";
		                second--;
		
		            }
		        },1000,100);
            }
        }
//      注册提交
        $scope.RegSubmit = function(){
        	var para = {
        		mobile:$scope.params.phone,
        		password:$scope.params.password,
        		code:$scope.params.code
        	}
//      	console.log(para.mobile);
//      	console.log(para.password);
//      	console.log(para.code);
        	Common.regSub(para).then(function(result){
        		$state.go("login");
        	})
        }
//      修改手机号码
		$scope.oldphone = $stateParams.oldphone;
		$scope.phoneSave = function(){
			if($scope.params.phone==''||$scope.params.code==''){
				alert('请输入要填的信息！')
			}else{
				var info = JSON.parse(locals.get('data',''));
				var para={
					mobile:$scope.params.phone,
					code:$scope.params.code,
					uid:info.id
				}
				Common.phoneSave(para).then(function(result){
					locals.setObject('data',result.data);
					$state.go('mencentinfo');
				})
			}
			
		}
    })
    .controller('ModifyregisterCtrl',function($scope,$state,$stateParams){
    	$scope.phoneNum =$stateParams.phoneNum;
    })
//  修改密码
    .controller('modifyPassCtrl',function($scope,locals,Common,$state,$stateParams){
    	$scope.password = '';
    	$scope.repassword = '';
    	$scope.modifyPassword = function(){
    		if($scope.password==''||$scope.repassword==''){
    			alert('请输入新密码');
    		}else{
 				$scope.phoneNum =$stateParams.phNum;
    			var para = {
	    			mobile:$scope.phoneNum,
	    			password:$scope.password,
	    			repassword:$scope.repassword
	    		}
	    		Common.psdModify(para).then(function(result){
	    			$state.go('rightpassword');
	    		})
    		}
    		
    	}
    })
//  登陆
    .controller('SigninCtrl',function($scope,$state,$stateParams,locals,Common){
    	$scope.password ='';
    	$scope.phNum = $stateParams.phNum;
    	$scope.loginUse = function(){
    		var para = {
	        	mobile:$scope.phNum,
	        	password:$scope.password
	        }
	        Common.loginSub(para).then(function(result){
	        	locals.setObject('data',result.data);
	        	$state.go('deviceinfo')
	        })
        	
        }
    })
//  设备展示
    .controller('devController',function($scope,$state,Common,locals){
    	var info = JSON.parse(locals.get('data',''))
        $scope.deviceShow = false;
        $scope.username = '';
        $scope.mifi = '';
        $scope.email ='';
        $scope.uid = info.id;
        var info = JSON.parse(locals.get('data',''));
        console.log(info.mobile);
        $scope.Devclose = function(){
            $scope.deviceShow = false;
        }
        $scope.Devopen = function(){
            $scope.deviceShow = true;
        }
        $scope.deviceSub = function(){
        	if($scope.uid==''||$scope.mifi==''){
        		alert('请输入设备编码！');
        	}else{
        		var para={
        			uid:$scope.uid,
	        		mifiId:$scope.mifi,
	        		userName:$scope.username,
	        		email:$scope.email
	        	}
        		Common.deviceSub(para).then(function(result){
        			$state.go('pay',{userphone:info.mobile})
        		})
        	}
        	
        }
    })
//  个人中心
	.controller('membercenterCtrl',function($scope,$state,locals,Common){
		var info = JSON.parse(locals.get('data',''));
		$scope.username = info.name;
		$scope.userphone = info.mobile;
	})
//  个人中心信息修改
	.controller('mencentinfoCtrl',function($scope,$state,locals){
		var info = JSON.parse(locals.get('data',''));
		var mobile = info.mobile;
//		var j = mobile.substring(3,8);
//		var nmobile = mobile.replace(j,'****');
		$scope.username = info.name;
		$scope.userphone = info.mobile;
	})
//	修改姓名
	.controller('modifynameCtrl',function($scope,$state,$stateParams,Common,locals){
		$scope.oldname = $stateParams.oldname;
		var info = JSON.parse(locals.get('data',''));
		$scope.nameSave = function(){
			var para={
				name:$scope.rename,
				uid:info.id
			}
			if($scope.rename==''){
				alert("请输入修改的姓名！");
			}else{
				Common.nameSave(para).then(function(result){
					locals.setObject('data',result.data);
					$state.go('mencentinfo');
				})
			}
		}
	})
// 个人中心修改密码
	.controller('modifyphonelistCtrl',function($scope,$state,$stateParams,Common,locals){
		$scope.oldpassword='';
		$scope.newpassword ='';
		$scope.repassword='';
		var info = JSON.parse(locals.get('data',''));
		$scope.padSave = function(){
			if($scope.oldpassword!=info.word){
				alert('您输入的密码不匹配')
			}else{
				if($scope.newpassword==''||$scope.repassword==''){
					alert('输入内容不能为空！')
				}else{
					var para = {
						oldpassword:$scope.oldpassword,
						password:$scope.newpassword,
						repassword:$scope.repassword,
						uid:info.id
					}
					Common.padSave(para).then(function(result){
						$state.go('login')
					})
				}	
			}
			
		}
	})
//	我的设备
	.controller('mydeviceCtrl',function($scope,locals,Common){
		var info = JSON.parse(locals.get('data',''));
		var para ={
			uid:info.id
		}
		Common.deviceBind(para).then(function(result){
//			console.log(result.data);
			$scope.lists = result.data;
		})
	})
//	我的设备细节
	.controller('devicemanageCtrl',function($scope,$state,$stateParams,Common,locals){
		$scope.deviceNum = $stateParams.deviceNum;

	})
//	收支明细
    .controller('paymentsCtrl',function($scope,Common,locals){
    	$scope.targetName ='';
    	var page = 1;
    	var len;
		var info = JSON.parse(locals.get('data',''));
		var para = {
			uid:'927ab35a74fd4494ae590d05bfb0da4e',
			record_type:'',
			status:'',
			start_date:'',
			end_date:'',
			page_size:'',
			page_no:page
		}
		Common.deviceInfo(para).then(function(result){
			$scope.dInfo = result.data;
			console.log(len);
			//page++;
		});
			
		setTimeout(function(){
		var myScroll;
    	myScroll = new IScroll('#wrapper',{ probeType: 3, mouseWheel: true });
//  	myScroll.on("scroll",function(){
//			var y = this.y,
//			maxY = this.maxScrollY - y;
//
//		});
		myScroll.on("slideUp",function(){
				var para ={
					uid:'927ab35a74fd4494ae590d05bfb0da4e',
					record_type:'',
					status:'',
					start_date:'',
					end_date:'',
					page_size:'',
					page_no:page+1
				}
				Common.deviceInfo(para).then(function(result){
					len = result.data.length;
					if(len==0){
						alert('没有更多数据')
					}else{
						$scope.dInfo = result.data;
						page++;
					}
				})
		})
		},2000)
    })
;
