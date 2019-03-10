$(function() {
	index.init();
});
var index = {
	init : function() {
		var self = this;
		self.getMediaSource();
		//保存当前url
//		self.saveUrl();
		//第一页提交按钮
		$("#nextsub").bind("click", function() {
			self.fir();
		});
	},
	getMediaSource : function() {
		var c = window.parent.location.search, a, r = [];
		r = c.match(/(^|[?& ])WT.mc_id[ ]*=([^&]*)(&|$)/i);
		if (r) {
			a = r[2];
		}
		if (!a || a == "direct" || a == "null") {
			a = "CXX-ZHITONGSEO-";
		}
		$("#mediaSource").val(a);
	},
	fir : function() {
		var self = this;
		if(!self.nameVerif($("#name")) || !self.phoneVerif($("#mobile"))){
			return false;
		}
		//事件跟踪代码
//		(new Image).src = 'http://hm.baidu.com/hm.gif?ep=%7Bid%3Aregister%2CeventType%3Aclick%7D&et=1&nv=0&si=570333ccf03d4f5321dfed096f029d90&st=4&v=pixel-1.0&rnd='
//				+ Math.floor(Math.random() * Math.pow(2, 31));
		//PA埋点
//		PAReport.setEventReport("puhuibutton");
		$('#nextsub').unbind('click');
		var params_first = {
			name : 			$('#name').val().replace(/[ ]/g, ""),
			mobile : 		$('#mobile').val(),
			sex : 0,
			source : $("#mediaSource").val()
		};
		$.ajax({
			type : 'POST',
			//url : 'http://120.79.106.132/api/common/add_puhui_basic_applyinfo',
			url : APP_HOST + 'api/mob',
			data : params_first,
			dataType : 'json',
			async : false,
			success : function(response) {
				if (response.code == 2000) {					
					top.location.href = 'step1.html?flowId='+response.data;
				} else {
					alert("提交失败");
				}
//				if (response.errorCode) {
//					alert(response.message);
//				}else if(response.error){
//					alert(response.error.message);
//				}else {
//					top.location.href = 'step1.html?flowId='+response.flowId;
//				}
			},
			error:function(e){
				$("#nextsub").bind("click", function() {
					index.fir();
				});
			}
		});
	},
	nameVerif : function(c, a) {
		var d = c.val(), self = this;
		if (!d || d == '请输入您的姓名') {
			alert("请输入您的姓名");
			c.focus();
			return false;
		} else {
			if (d && !/^([\u4e00-\u9fa5\s]{2}|[a-zA-Z]{4})([\u4e00-\u9fa5\s]{0,18}|[. ]{0,36}|[• ]{0,36}|[a-zA-Z]{0,36})*$/.test(d)) {
				alert("姓名不符合规范！");
				c.focus();
				return false;
			} else {
				if (d == "不详" || d == "不祥" || d == "未知" || d == "不知道"
						|| d.indexOf("姓名") > -1 || d.indexOf("测试") > -1
						|| d.indexOf("test") > -1) {
					alert("姓名不符合规范！");
					c.focus();
					return false;
				} else {
					return true;
				}
			}
		}
	},
	phoneVerif : function(c, a) {
		var d = c.val(), self = this;
		if (!d || d == "请输入您的手机号码") {
			alert("请输入您的手机号码");
			c.focus();
			return false;
		} else {
			if (d && !/^1[3456789]\d{9}$/.test(d)) {
				alert("手机号码格式有误！");
				c.focus();
				return false;
			} else {
				d = d.replace(/\s/g, '');
				d = d || '';
				var repeat = 1;
				var seque = 1;
				for (var i = 1; i < d.length; i++) {
					if (d.charAt(i) == d.charAt(i - 1)) {
						repeat++;
						if (repeat >= 5) {
							alert("手机号码格式有误！");
							c.focus();
							return false;
						}
					} else {
						repeat = 1;
					}
					if (d.charAt(i) - d.charAt(i - 1) == '1') {
						seque++;
						if (seque >= 6) {
							alert("手机号码格式有误！");
							c.focus();
							return false;
						}
					} else {
						seque = 1;
					}
				}
				return true;
			}
		}
	},
};

/**
 *   校验控件绑定
 */
//var indexUI = {
//	isInit : false,
//	//初始化控件
//	initPaui : function() {
//		if (this.isInit) {
//			return;
//		}
//		var $ = jQuery;
//		/*$.paui.use([ 'datepicker' ], function() {
//			var nowDate = new Date();
//			$("#birth").datepicker({
//				defaultDate : (nowDate.getFullYear() - 30) + '-'
//						+ (nowDate.getMonth() + 1) + '-'
//						+ nowDate.getDate(),
//				maxDate : (nowDate.getFullYear()) + '-'
//						+ (nowDate.getMonth() + 1) + '-'
//						+ (nowDate.getDate() - 1)
//			});
//			$(".datepicker-button").hide();
//			$(".datepicker-warpper").addClass("top_show_birth");
//
//		});*/
//		this.isInit = true;
//	}
//};

/*注册协议*/
$('.select-box .select-a').on('click',function () {
    $('body').css('overflow','hidden');
    $('.pc_black').show();
    $('.pto_box').show();
    var pro_close = $('.pto_box').find('.pto_close');
    pro_close.on('click',function () {
        $('body').css('overflow','auto');
        $('.pc_black').hide();
        $('.pto_box').hide();
    })
})