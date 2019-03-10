$(function() {
	index.init();
});
var index = {
	init : function() {
		var self = this;
		self.getMediaSource();
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

        var jk = $(".jk-li span");
        jk.each(function (i,li) {
            var isActive = 0;
            if($(li).hasClass('active')){
                isActive = 1;
			}else {
                isActive = 0;
			}
            switch($(li).text())
            {
                case '有房':
                    youfang = isActive;
                    iswu = 0;
                    break;
                case '有车':
                    youche = isActive;
                    iswu = 0;
                    break;
                case '寿险':
                    youxian = isActive;
                    iswu = 0;
                    break;
                case '无':
                    iswu = isActive;
                    if(isActive==1){
                        youche = 0;
                        youxian = 0;
                        youche = 0;
					}
                    break;
            }
        })
		if (youche == -1 || youfang == -1 || youxian == -1 || iswu == -1) {
			alert("请填写完整后再提交！");
			return false;
		}
		$('#nextsub').unbind('click');
		var params_first = {
			name : 			$('#name').val().replace(/[ ]/g, ""),
			mobile : 		$('#mobile').val(),
			youche: youche,
			youfang: youfang,
			youxian: youxian,
			source: $("#mediaSource").val()
		};
		$.ajax({
			type : 'POST',
			url : APP_HOST + 'api/gdt',
			data : params_first,
			dataType : 'json',
			async : false,
			success : function(response) {
				if (response.code == 2000) {
					top.location.href = '../new/success.html';					
				} else {
					alert("提交失败");
				}
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