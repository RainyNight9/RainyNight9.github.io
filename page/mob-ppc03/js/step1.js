$(function() {
	step1.init();
//	clearTime();
//	sessionTimeoutStart(flowId,null,null,"WAP");
});
var step1 = {
	url:'',
	submitFlag : true,
	init : function() {
		var self = this;
//		step1.getData();
		//第一页提交按钮
		$("#nextStep").bind("click", function() {
			self.submitStep1();
		});
	},
	getData : function(){
		flowId =  window.location.href.split("?flowId=")[1];
		if(flowId == ''){
			window.history.go(-1);
			return;
		}
		$.ajax({
			type : 'GET',
			url : '/do/rsploan/secondStep?flowId='+ flowId,
			dataType : 'json',
			success : function(response) {
				if(response.errorCode){
					alert(response.message);
				}else{
					$('#mobile').val(response.mobile);
					$('#name').val(response.name);
					if(response.mediaSourceId){
						$('#mediaSource').val(response.mediaSourceId);
					}else{
						$('#mediaSource').val("cxx-zhitongseo");
					}
				}
			}
		});
	},
	submitStep1 : function() {
		var self = this;
		if(!self.submitFlag){
			alert("正在处理中");
			return;
		}
		//校验非空
		if(!self.checkParam()){
			self.submitFlag = true;
			return false;
		}
        if(self.submitFlag){
            //防止重复提交
            var nextStep = $("#nextStep");
            var nextStepVal = nextStep.text();
            var n = 0;
            var intervalID;
            function setEnable(){
                n++;
                if(n==10){
                    clearInterval(intervalID);
                    nextStep.removeClass('disabled-btn');
                    nextStep.text(nextStepVal);
                    nextStep.removeAttr("disabled");

                }else{
                    nextStep.attr('disabled',"true")
                    nextStep.addClass('disabled-btn');
                    nextStep.text("数据已提交（"+(10-n)+ "）");
                }
            };
            intervalID = window.setInterval(setEnable,1000);
        }
		self.submitFlag = false;
		//获得campaignCode、pageType
		self.getCampaignCode();
		var params_step1 = {
			flowId :	    window.location.href.split("?flowId=")[1],
			mediaSourceId:	$('#mediaSource').val(),
			mobile : 		$('#mobile').val(),
			name : 			$('#name').val(),
			formCode : 		$('#formCode').val(),
			isDirectForm:   $('#isDirectForm').val(),
			pageType : 		$('#pageType').val(),
			campaignCode : 	$('#campaignCode').val(),
			city : 			$('#cityInput').val(),//城市名称
			age:			$('#age').val(),//年龄
			f1:				$('input[name="isCreditCard"]:checked').val(),//是否有信用卡
			f2:				$('#paid').val(),
			f3 : 			$('input[name="liveTime"]:checked').val(),//居住时间
			f4 : 			$('input[name="hasHouseLoan"]:checked').val(),//在该城市有过房贷
			f5 : 			$('input[name="hasCar"]:checked').val(),//是否有车
			f6 : 			$('input[name="payCarLoan"]:checked').val(),//是否在还车贷
			f7 : 			$('input[name="hasLifeInsurance"]:checked').val(),//是否有寿险保单
			f8 : 			$('input[name="lifeInsuranceTotal"]:checked').parent().text().trim()//年保费合计
		};
		params_step1 = self.buildParam(params_step1);
		var time_before = parseInt(new Date().getTime()/1000);
		$.ajax({
			type : 'POST',
			//url : 'http://120.79.106.132/api/common/add_o2o_second_info',
			url : APP_HOST + 'api/mobs',
			async : false,
			data : params_step1,
			dataType : 'json',
			success : function(response) {
                if (response.code == 2000) {
                    top.location.href = '../new/success.html';
                } else {
                    alert("提交失败");
                }
				self.submitFlag = true;
			},
			error:function(e){
				next = true;
				alert("系统错误！");
				self.submitFlag = true;
			}
		});
	},
	buildParam:function(params){
		var self = this;
		if("1" == params.f1){
			params.f1 = "有信用卡";
		}else{
			params.f1 = "无信用卡";
		}
		if("1" == params.f3){
			params.f3 = "居住时间>6个月";
		}else{
			params.f3 = "居住时间<6个月";
		}
		if("1" == params.f4){
			params.f4 = "有房贷";
		}else{
			params.f4 = "无房贷";
		}
		if("1" == params.f5){
			params.f5 = "有车";
			if("1" == params.f6){
				params.f6 = "有车贷";
			}else{
				params.f6 = "无车贷";
			}
		}else{
			params.f5 = "无车";
			params.f6 = "空";
		}
		if("1" == params.f7){
			params.f7 = "有寿险保单";
			if("2400元以上" == params.f8){
				params.f8 = "年保费>2400";
			}else{
				params.f8 = "年保费<2400";
			}
		}else{
			params.f7 = "无寿险保单";
			params.f8 = "空";
		}
		return params;
	},
	checkParam:function(){
		var self = this;
		if(!self.checkIsNull($('#age').val()) || "0" == $('#age').val()){
			alert("请选择年龄！");
			return false;
		}else if(!self.checkIsNull($('input[name="isCreditCard"]:checked').val())){
			alert("请选择是否有过信用卡！");
			return false;
		}else if(!self.checkIsNull($('#cityInput').val())){
			alert("请选择所在城市！");
			return false;
		}else if(!self.checkIsNull($('input[name="liveTime"]:checked').val())){
			alert("请选择居住时间！");
			return false;
		}else if(!self.checkIsNull($('input[name="hasHouseLoan"]:checked').val())){
			alert("请选择是否在该城市有过房贷！");
			return false;
		}else if(!self.checkIsNull($('input[name="hasCar"]:checked').val())){
			alert("请选择是否名下有私家车！");
			return false;
		}else if("1" == $('input[name="hasCar"]:checked').val() && 
				!self.checkIsNull($('input[name="payCarLoan"]:checked').val())){
			alert("请选择是否在还车贷！");
			return false;
		}else if(!self.checkIsNull($('input[name="hasLifeInsurance"]:checked').val())){
			alert("请选择是否有寿险保单！");
			return false;
		}else if("1" == $('input[name="hasLifeInsurance"]:checked').val() && 
				!self.checkIsNull($('input[name="lifeInsuranceTotal"]:checked').val())){
			alert("请选择名下寿险年保费合计！");
			return false;
		}
		return true;
	},
	checkIsNull:function(param){
		var isNotNull = true;
		if(typeof(param) == 'undefined' || null == param || "" == param){
			isNotNull = false;
		}
		return isNotNull;
	},
	divisonCity:function(city){
		var isMiddleWest = false;
		var middleWestArea = "西安,延安,成都,南充,宜宾,红河,曲靖,昆明,玉溪,楚雄,大理,渭南,汉中,宝鸡,咸阳,绵阳,乐山,自贡,合肥,芜湖,马鞍山,蚌埠,滁州,宿州,黄山," +
				"太原,临汾,长治,运城,晋中,大同,阜阳,宣城,兰州,天水,银川,白银,张掖,吴忠,定西,庆阳,中卫,桂林,南宁,柳州,钦州,玉林,梧州,贵阳,安顺,重庆,乌鲁木齐,遵义,昌吉,伊犁," +
				"巴音郭楞,西宁,郑州,洛阳,南阳,焦作,新乡,安阳,许昌,三门峡,开封,商丘,平顶山,濮阳,济源,武汉,荆州,襄阳,宜昌,孝感,恩施,黄冈,黄石,十堰,咸宁,南昌,赣州,九江,上饶,新余,吉安,萍乡";
		if(middleWestArea.indexOf(city) > -1){
			isMiddleWest = true;
		}
		return isMiddleWest;
	},
	getCampaignCode:function(){
		var self = this;
		var isMiddleWest = self.divisonCity($('#cityInput').val());
		var campaignCode = "XX_CAMP_FLYMRCHD1";
		var pageType = "3";
		
		if(!self.checkCity($('#cityInput').val()) || !self.checkLiveTime() || !self.checkAge() || !self.checkCredit()){
			campaignCode = "XX_CAMP_FLYMRCHD2";
			pageType = "1";
			self.url = "iLoan.html";
		}else if (isMiddleWest){
			//self.url = "success.html";
			if(self.checkHouseLoan() && self.checkCar() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD3";
				pageType = "1";
			}else if(self.checkCar() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD4";
				pageType = "1";
			}else if(self.checkHouseLoan() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD5";
				pageType = "1";
			}else if(self.checkHouseLoan() && self.checkCar()){
				campaignCode = "XX_CAMP_FLYMRCHD6";
				pageType = "1";
			}else if(self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD7";
				pageType = "1";
			}else if(self.checkCar()){
				campaignCode = "XX_CAMP_FLYMRCHD8";
				pageType = "1";
			}else if(self.checkHouseLoan()){
				campaignCode = "XX_CAMP_FLYMRCHD9";
				pageType = "1";
			}else if(!self.checkHouseLoan() && !self.checkCar() && !self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD10";
				pageType = "1";
				self.url = "iLoan.html";
			}
		}else{
			//self.url = "success.html";
			if(self.checkHouseLoan() && self.checkCar() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD11";
				pageType = "1";
			}else if(self.checkCar() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD12";
				pageType = "1";
			}else if(self.checkHouseLoan() && self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD13";
				pageType = "1";
			}else if(self.checkHouseLoan() && self.checkCar()){
				campaignCode = "XX_CAMP_FLYMRCHD14";
				pageType = "1";
			}else if(self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD15";
				pageType = "1";
			}else if(self.checkCar()){
				campaignCode = "XX_CAMP_FLYMRCHD16";
				pageType = "1";
			}else if(self.checkHouseLoan()){
				campaignCode = "XX_CAMP_FLYMRCHD17";
				pageType = "1";
			}else if(!self.checkHouseLoan() && !self.checkCar() && !self.checkLifeInsurance()){
				campaignCode = "XX_CAMP_FLYMRCHD18";
				pageType = "1";
				self.url = "iLoan.html"; 
			}
		}
		$('#campaignCode').val(campaignCode);
    	$('#pageType').val(pageType);
	},
	checkAge:function(){
		if("2" != $('#age').val()){//年龄
			return false;
		}
		return true;
	},
	checkCredit:function(){
		if(!"1" == $('input[name="isCreditCard"]:checked').val()){//是否有过信用卡
			return false;
		}
		return true;
	},
	checkCity:function(city){
		var openCity="滁州,阜阳,宣城,马鞍山,蚌埠,芜湖,合肥,宿州,北京,漳州,三明,龙岩,泉州,南平,莆田,福州,厦门,天水,兰州,张掖,汕头,云浮,揭阳,潮州,中山,东莞,清远,阳江,河源,梅州,惠州,肇庆,茂名," +
				"湛江,广州,深圳,珠海,江门,佛山,韶关,梧州,桂林,柳州,南宁,玉林,钦州,遵义,安顺,贵阳,黔南,海口,三亚,石家庄,唐山,秦皇岛,张家口,沧州,衡水,廊坊,承德,保定,邢台,邯郸,南阳,濮阳,郑州,洛阳,新乡," +
				"安阳,平顶山,开封,三门峡,许昌,焦作,商丘,牡丹江,大庆,哈尔滨,绥化,齐齐哈尔,孝感,荆州,襄阳,宜昌,黄石,武汉,长沙,湘潭,岳阳,郴州,常德,衡阳,株洲,长春,四平,通化,白山,延边,南京,常州," +
				"南通,淮安,镇江,宿迁,泰州,扬州,连云港,苏州,徐州,无锡,南昌,景德镇,萍乡,宜春,吉安,赣州,上饶,九江,新余,鹰潭,锦州,营口,盘锦,鞍山,大连,沈阳,铁岭,呼和浩特," +
				"银川,吴忠,西宁,临沂,青岛,日照,威海,菏泽,滨州,聊城,德州,泰安,济宁,烟台,东营,枣庄,淄博,济南,长治,大同,太原,临汾,运城,晋中,咸阳,延安,汉中,渭南,宝鸡,西安,上海,南充,乐山,绵阳,自贡," +
				"成都,资阳,宜宾,天津,乌鲁木齐,昌吉,巴音郭楞,伊犁哈萨克,曲靖,昆明,玉溪,红河,楚雄,大理,杭州,宁波,嘉兴,绍兴,丽水,金华,湖州,温州,台州,重庆,其他,儋州,义乌,济源,其它,";
		if(openCity.indexOf(city) > -1){
			return true;
		}
		return false;
	},
	checkLiveTime:function(){
		if(!"1" == $('input[name="liveTime"]:checked').val()){//居住时间
			return false;
		}
		return true;
	},
	checkHouseLoan:function(){
		if(!"1" == $('input[name="hasHouseLoan"]:checked').val()){//在该城市有过房贷
			return false;
		}
		return true;
	},
	checkCar:function(){
		if(!"1" == $('input[name="hasCar"]:checked').val()){//是否有车
			return false;
		}
		if("1" == $('input[name="hasCar"]:checked').val()
				&& "1" == $('input[name="payCarLoan"]:checked').val()){//是否在还车贷
			return false;
		}
		return true;
	},
	checkLifeInsurance:function(){
		if(!"1" == $('input[name="hasLifeInsurance"]:checked').val()){//是否有寿险保单
			return false;
		}
		if("1" == $('input[name="hasLifeInsurance"]:checked').val() 
				&& !"1" == $('input[name="lifeInsuranceTotal"]:checked').val()){//保费合计
			return false;
		}
		return true;
	}
};
