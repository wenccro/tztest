window.onload = function() {
	//权重数据值,1表示是主线 2表示副线,小数点后面的数是权值，权值相同表示可以放同一个位置
	var weightArr = {
		'扫描二维码': 1.0,
		'标准步骤': 1.1,
		'图片步骤': 1.1,
		'产品': 1.1,
		'选择器': 1.1,
		'呼叫专家': 1.2,
		'完成': 1.3,
		'图片': 2.0,
		'视频': 2.0,
		'文字': 2.0,
		'PDF': 2.0,
		'输入文字': 2.1,
		'拍照记录': 2.2,
		'视频记录': 2.2,
		'状态输入': 2.3
	}
	var ulWidthArr=[
		{
			"falgtext":'ulfg1',
			"ulleft":0,
			"ulring":100
		}
	]
	//表示鼠标已按下
	var flag = false;//标记是否可以拖动
	var	texts = '';//得到获取的值
	var scoller = 0 ;//滚动条值;目的是计算出可是区域是什么位置
	//获取div滚动条值移动值
	resetLastUlWidth();//初始化先计算第一个ul的宽度
	$('#getbox').on('scroll',function(e){
		scoller = $(this)[0].scrollLeft;
	});
	$(".select").delegate("li", "mousedown", function(e) {
		flag = true;
		texts = $(this).text();
		var diffX = e.clientX - $(this).offset().left;
		var diffY = e.clientY - $(this).offset().top;
		$("#drags").text(texts);
		//获取可释放元素区域,得到可拖动区域
		var targetAreaLeft = $("#getbox").offset().left;
		var targetAreaTop = $("#getbox").offset().top;
		var targetAreaWidth = $("#getbox").width() - $(this).width() + targetAreaLeft;
		var targetAreaHeight = $("#getbox").height() - $(this).height();

		document.onmousemove = function(e) {
			if (flag) {
				var left = e.clientX - diffX;
				var top = e.clientY - diffY;
				//计算是否在可拖动区域之内
				if (left <= targetAreaWidth && top <= targetAreaHeight && top >= targetAreaTop) {
					$("#drags").offset({
						top: top,
						left: left
					});
				}

			}
		}
		document.onmouseup = function(e) {
			//释放时，去除左边移除框的内容
			if ($("#drags").offset().left < targetAreaLeft) {
				$("#drags").offset({
					top: -100,
					left: -1000
				});
			} else {
				//将元素添加到目标区域中去,传入3个参数，左边位置，上位置，拖动元素内容
				targerAreaAddElement($("#drags").offset().left, $("#drags").offset().top, texts);
				$("#drags").offset({
					top: -100,
					left: -1000
				});
				//重新计算中间横线的宽度
				var grags=$("#getbox")["0"].scrollWidth;
				$("#lineX").width(grags);
			}
			this.onmousemove = null;
			this.onmouseup = null;
			flag = false;
		}
	});
	//处理最终释放的位置，传入left和top值
	function targerAreaAddElement(Left, Top, text) {
		var dragLeft = Left-200;//减200是因为  拖拽元素是基于整个页面的  需要减去选择区域的宽
		var dragTop  = Top;
		var dragText = text;
		var weightNum =weightArr[text];//获取权重值
		//后期需要修改
		var ulwidth=$("#getbox>ul:last-child").width();
		//通过comshow 标志位  拿到已经添加的权值
		var oldUldata=$("#getbox>ul>li.comshow");
		var mainwei = [];//获取显示值
		for(var i=0; i< oldUldata.length;i++){
			mainwei.push(weightArr[oldUldata[i].innerText])
		}
		console.log("移动值"+ mainwei)
		console.log("拖拽left--"+dragLeft, "拖拽top--"+dragTop, "拖拽内容--"+dragText,"权值--"+weightNum,"ul宽度--"+ulwidth);

		//先判断他的目的是  1，在ul里，添加新东西，2在ul里，替换东西 3，重新创建一个ul
		//当拖拽left值小于 ul宽度值是，表示添加或者替换
		if(dragLeft <= ulwidth){
			var rePlace = getLiPlace(weightNum,mainwei);
			console.log(rePlace)
			if(mainwei.indexOf(weightNum) != -1){//说明含有了，那就替换
				$("#getbox>ul>li:eq("+rePlace+")").text(dragText);//替换上去
			}else{//添加
				//添加主线
				$("#getbox>ul>li:eq("+rePlace+")").removeClass("hiddenLi");
				$("#getbox>ul>li:eq("+rePlace+")").addClass("comshow");
				if(weightNum < 2){
					$("#getbox>ul>li:eq("+rePlace+")").text(dragText);
					$("#getbox>ul>li:eq("+rePlace+")").addClass("MainElements");
				}else{
					$("#getbox>ul>li:eq("+rePlace+")>p").text(dragText);;
				}
			}
		}else{//创建一个新的ul,拖拽元素权值必须小于2才能
			if(weightNum < 2){
				//创建一个新的ul
			}
		}



	}
	//为最后一个元素计算 宽度
	function resetLastUlWidth() {
		//计算每一个ul的宽度
		var lis = $(".MainElements").length;
		//每一个主线上元素宽度是 252*lis+50,多出20px
		$("#getbox>ul:last-child").width(152*lis+50*lis+20);
	}

	//根据权值返回一个ul 下面 li的位置
	function getLiPlace(weiNum,arrs) {
		var result = 0;
		switch (weiNum) {
			case 1.0: result = 0;
				break;
			case 1.1: result = 1;
				break;
			case 1.2:
			case 1.3: result = 2;
				break;
			case 2.0: result = 4;
				break;
			case 2.1:
			case 2.2:
			case 2.3: result = 5;
				break;
		}
		//对3，和6 做处理
		if(result ==2){
			result = arrs.indexOf(1.2) == -1 ? 2 : 3;
		}
		if(result == 5){
			var nums =0;
			console.log(arrs)
			console.log(arrs.indexOf(2.1))
			if(arrs.indexOf(2.1)!= -1){
				nums++;
			}else if(arrs.indexOf(2.2)!= -1){
				nums++;
			}else if(arrs.indexOf(2.3)!= -1){
				nums++;
			}else{
				nums =0;
			}
			console.log("dddd"+nums)
			if(nums ==0){
				result=5;
			}else if(nums ==1){
				result=6;
			}else{
				result=7;
			}

		}
		return result;
	}

}
