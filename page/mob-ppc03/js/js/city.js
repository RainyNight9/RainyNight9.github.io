//所有城市 ajax请求所有城市
var allCity=['南通','徐州','苏州','南京','扬州','泰州','镇江','连云港','哈尔滨','宿迁','佛山','长春','北京','无锡','上海','贵阳','济南','宁波','西安','广州','淮安','常州','威海','江门','温州','东营','南昌','安顺','武汉','延边','沧州','珠海','太原','海口','唐山','天水','红河','大连','烟台','汕头','秦皇岛','肇庆','淄博','呼和浩特','龙岩','滨州','长治','深圳','许昌','厦门','东莞','昆明','曲靖','金华','丽水','蚌埠','河源','湛江','合肥','漳州','杭州','揭阳','咸阳','长沙','九江','三亚','邯郸','南宁','柳州','赣州','洛阳','青岛','石家庄','马鞍山','银川','保定','中山','重庆','绍兴','襄阳','云浮','聊城','泰安','临汾','芜湖','枣庄','大庆','上饶','钦州','株洲','泉州','郑州','茂名','兰州','衡阳','三门峡','惠州','荆州','嘉兴','三明','台州','衡水','沈阳','新乡','商丘','莆田','临沂','桂林','菏泽','清远','梅州','成都','韶关','玉溪','开封','四平','滁州','汉中','张家口','湘潭','岳阳','天津','济宁','平顶山','阳江','常德','通化','湖州','安阳','潮州','廊坊','运城','宜昌','宝鸡','楚雄','黄山','德州','锦州','梧州','邢台','福州','盘锦','自贡','景德镇','黄石','乌鲁木齐','营口','白山','绥化','宣城','鹰潭','黔南','齐齐哈尔','宜宾','巴音郭楞','鞍山','日照','焦作','渭南','大同','西宁','酒泉','西双版纳','伊犁哈萨克','牡丹江','吴忠','吉安','延安','新余','宿州','玉林','铁岭','承德','濮阳','郴州','张掖','晋中','阜阳','南阳','孝感','萍乡','南平','大理','百色','丽江','昌吉','资阳','防城港','汕尾','哈密','贵港','宜春','新疆维吾尔','舟山','泸州','黄冈','陇南','晋城','绵阳','德阳','随州','乐山','亳州','荆门','遵义','内江','永州','怀化','六安','抚州','淮北','南充','安康','咸宁','武威','十堰','眉山'];
var isHaveCity = true;
//显示城市列表
function showCity(id){
	$(id).parent().on('click',function(e) {
		$("#cityinput").val("")
	    e.preventDefault(); 
	    e.stopPropagation();
	    var docHeight = $(document).height();
	    var temp_scrollTop = $(window).scrollTop();
	    $('#popup_city').addClass('slideLeft').css('min-height',docHeight);
	    $(window).scrollTop(0);
        displayItems("");
	});
}
// function hideError(){
// 	$('.error').hide();
// }

function displayItems(items) {
	var strHtml = '';
	for (var i = 0; i < allCity.length; i++) {//国内所在城市匹配
		var reg = new RegExp('^' + items + '.*$', 'im');
		if (reg.test(allCity[i])) {
			strHtml += '<li class="list-search" onclick=\"choseCity(this);\" rel="" data-countryCode="">' + allCity[i] + '</li>';
		}
//		if (reg.test(allCity[i]['county_name']) || reg.test(allCity[i]['county_spell_full']) || reg.test(allCity[i]['county_spell_short'])) {
//				strHtml += '<li class="list-search" onclick=\"choseCity(this);\" rel="' +allCity[i]['county_spell_short'] + '" data-countryCode="'+allCity[i]['city_code']+'">' + allCity[i]['county_name'] + '</li>';
//		}
	}
	if (strHtml == '') {
		suggest_tip = '<li class="gray search_result_tip">对不起，找不到：' + items + '</li>';
		suggest_tip += '<li class="gray search_result_tip">如果县级市查询无结果，请使用地级市查询</li>';
		isHaveCity = false;
	}
	else {
		suggest_tip = '';
	}
	strHtml = suggest_tip + '<li><ul class="ui-listview">' + strHtml + '</ul></li>';
	$("#citylist").html(strHtml).show();
}
//选择城市
function choseCity(e){
	cityNo =$(e).attr("data-countryCode");
	var selectedCity_name = $(e).text();
	var selectedCity_countyCode = $(e).attr("data-countryCode");
	$("#cityInput").val(selectedCity_name);
	$("#cityInput").attr("selectedCity_countyCode",selectedCity_countyCode);
	$('#popup_city').removeClass('slideLeft');
    if($('#overflow')){$('#overflow').scrollTop(0);}
	$(document.body).scrollTop(0);
}
	
$(".searchinput").focus(function(){
	$(this).css("backgroundColor","#fff");
});
$(function(){
	showCity("#cityInput");
	$("#cityinput").on("input",function(){
		displayItems($("#cityinput").val());
	});
	$(".icon-close").on('click',function(){
		$('#popup_city').removeClass('slideLeft');
	    $(window).scrollTop(options['oldScrollTop']);
	});
});