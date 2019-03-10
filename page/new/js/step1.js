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
        //获得campaignCode、pageType
        self.getCampaignCode();
        var ph_city = [
            "包头市",
            "吉林市",
            "延边朝鲜族自治州",
            "松原市",
            "商洛市",
            "达州市",
            "丹东市",
            "葫芦岛市",
            "衢州市",
            "哈尔滨市",
            "安顺市",
            "珠海市",
            "海口市",
            "天水市",
            "红河哈尼族彝族自治州",
            "大连市",
            "烟台市",
            "汕头市",
            "上海市",
            "淄博市",
            "无锡市",
            "苏州市",
            "厦门市",
            "东莞市",
            "宁波市",
            "昆明市",
            "丽水市",
            "蚌埠市",
            "河源市",
            "合肥市",
            "武汉市",
            "咸阳市",
            "长沙市",
            "太原市",
            "九江市",
            "济南市",
            "三亚市",
            "邯郸市",
            "深圳市",
            "赣州市",
            "马鞍山市",
            "南昌市",
            "贵阳市",
            "南京市",
            "中山市",
            "佛山市",
            "重庆市",
            "东营市",
            "石家庄市",
            "上饶市",
            "南通市",
            "钦州市",
            "西安市",
            "茂名市",
            "芜湖市",
            "兰州市",
            "广州市",
            "三门峡市",
            "长春市",
            "荆州市",
            "新乡市",
            "商丘市",
            "呼和浩特市",
            "常州市",
            "曲靖市",
            "玉溪市",
            "开封市",
            "四平市",
            "株洲市",
            "湘潭市",
            "岳阳市",
            "宿迁市",
            "成都市",
            "平顶山市",
            "常德市",
            "南宁市",
            "潮州市",
            "衡阳市",
            "郑州市",
            "宜昌市",
            "宝鸡市",
            "楚雄彝族自治州",
            "沈阳市",
            "大理白族自治州",
            "杭州市",
            "黄山市",
            "德州市",
            "锦州市",
            "淮安市",
            "梧州市",
            "福州市",
            "滁州市",
            "洛阳市",
            "绵阳市",
            "永州市",
            "运城市",
            "怀化市",
            "西宁市",
            "新疆维吾尔自治区",
            "邢台市",
            "聊城市",
            "桂林市",
            "盘锦市",
            "北京市",
            "廊坊市",
            "六安市",
            "湛江市",
            "扬州市",
            "泰州市",
            "徐州市",
            "连云港市",
            "镇江市",
            "安阳市",
            "漳州市",
            "温州市",
            "舟山市",
            "威海市",
            "青岛市",
            "抚州市",
            "嘉兴市",
            "惠州市",
            "淮北市",
            "南充市",
            "大庆市",
            "许昌市",
            "焦作市",
            "江门市",
            "吉安市",
            "天津市",
            "自贡市",
            "景德镇市",
            "黄石市",
            "安康市",
            "乌鲁木齐市",
            "宜春市",
            "营口市",
            "泉州市",
            "绍兴市",
            "咸宁市",
            "陇南市",
            "武威市",
            "白山市",
            "牡丹江市",
            "绥化市",
            "汕尾市",
            "鞍山市",
            "保定市",
            "沧州市",
            "宣城市",
            "昌吉回族自治州",
            "十堰市",
            "眉山市",
            "鹰潭市",
            "清远市",
            "龙岩市",
            "通化市",
            "哈密地区",
            "德阳市",
            "菏泽市",
            "黔南布依族苗族自治州",
            "齐齐哈尔市",
            "宜宾市",
            "贵港市",
            "肇庆市",
            "巴音郭楞蒙古自治州",
            "随州市",
            "湖州市",
            "日照市",
            "乐山市",
            "亳州市",
            "南阳市",
            "临沂市",
            "渭南市",
            "大同市",
            "滨州市",
            "酒泉市",
            "秦皇岛市",
            "西双版纳傣族自治州",
            "长治市",
            "荆门市",
            "遵义市",
            "唐山市",
            "伊犁哈萨克自治州",
            "金华市",
            "丽江市",
            "内江市",
            "泰安市",
            "延安市",
            "阳江市",
            "新余市",
            "宿州市",
            "资阳市",
            "泸州市",
            "临汾市",
            "玉林市",
            "铁岭市",
            "防城港市",
            "承德市",
            "柳州市",
            "南平市",
            "黄冈市",
            "濮阳市",
            "郴州市",
            "枣庄市",
            "襄阳市",
            "晋城市",
            "张掖市",
            "晋中市",
            "济宁市",
            "阜阳市",
            "百色市",
            "孝感市",
            "萍乡市",
            "莆田市",
            "三明市",
            "忻州市",
            "儋州市",
            "银川市",
            "揭阳市",
            "云浮市",
            "台州市",
            "衡水市",
            "梅州市",
            "韶关市",
            "汉中市",
            "张家口市",
            "榆林市"
        ];
        //判断客户选择的城市是否是普惠O2O展业城市
        var is_city = false;
        var city_val = $('#cityInput').val();
        for(var c1 in ph_city){
            if(ph_city[c1].indexOf(city_val)>-1){
                is_city = true;
            }
        };

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
        var pl_params = {
            flowId :	    window.location.href.split("?flowId=")[1]
        };
        params_step1 = self.buildParam(params_step1);
        //判断客户选择信息是否符合O2O
        $.ajax({
            type : 'POST',
            url : 'http://paservice.adks.cn/api/PhPiliang/add_puhui_pl_info',
            data : params_step1,
            dataType : 'json',
            async : false,
            success : function(response) {
                if (response.id > 0) {
                    top.location.href = 'success.html';
                } else {
                    alert("提交失败");
                }
            },
            error:function(e){
                next = true;
                alert("系统错误！");
                self.submitFlag = true;
            }
        });
		/* if(is_city&&params_step1.age=='2'&&params_step1.f1=='有信用卡'&&params_step1.f3=='居住时间>6个月'&&params_step1.f4=='有房贷'&&params_step1.f5=='有车'&&params_step1.f6=='无车贷'&&params_step1.f7=='有寿险保单'&&params_step1.f8=='年保费>2400'){
		 //符合O2O走实时接口
		 $.ajax({
		 type : 'POST',
		 url : 'http://paservice.adks.cn/api/common/add_o2o_second_info',
		 //url : 'http://www.con.com/api/common/add_o2o_second_info',    //测试
		 //			url : '/do/rsploan/saveApplyInfo',
		 async : false,
		 data : params_step1,
		 dataType : 'json',
		 success : function(response) {
		 if (response.code == 0 && response.msg != "") {
		 top.location.href = response.msg;
		 } else {
		 alert("非法操作");
		 }
		 //				if (response.code == 0) {
		 //					top.location.href = "success.html";
		 //				} else {
		 //					alert("非法操作");
		 //				}
		 //				if(response.errorCode){
		 //					alert(response.message);
		 //				}else{
		 //					top.location.href = self.url;
		 //				}
		 self.submitFlag = true;
		 },
		 error:function(e){
		 next = true;
		 alert("系统错误！");
		 self.submitFlag = true;
		 }
		 })
		 }else {
		 $.ajax({
		 type : 'POST',
		 url : 'http://paservice.adks.cn/api/PhPiliang/add_puhui_pl_info',
		 data : pl_params,
		 dataType : 'json',
		 async : false,
		 success : function(response) {
		 if (response.id > 0) {
		 top.location.href = 'success.html';
		 } else {
		 alert("提交失败");
		 }
		 },
		 error:function(e){
		 next = true;
		 alert("系统错误！");
		 self.submitFlag = true;
		 }
		 });
		 }*/


		/*$.ajax({
		 type : 'POST',
		 //url : 'http://paservice.adks.cn/api/common/add_o2o_second_info',
		 url : 'http://www.con.com/api/common/add_o2o_second_info',    //测试
		 //			url : '/do/rsploan/saveApplyInfo',
		 async : false,
		 data : params_step1,
		 dataType : 'json',
		 success : function(response) {
		 if (response.code == 0 && response.msg != "") {
		 //top.location.href = response.msg;
		 } else {
		 alert("非法操作");
		 }
		 //				if (response.code == 0) {
		 //					top.location.href = "success.html";
		 //				} else {
		 //					alert("非法操作");
		 //				}
		 //				if(response.errorCode){
		 //					alert(response.message);
		 //				}else{
		 //					top.location.href = self.url;
		 //				}
		 self.submitFlag = true;
		 },
		 error:function(e){
		 next = true;
		 alert("系统错误！");
		 self.submitFlag = true;
		 }

		 });*/

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