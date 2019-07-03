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
	//表示鼠标已按下
	var flag = false,
		texts;
	$(".select").delegate("li", "mousedown", function(e) {
		flag = true;
		texts = $(this).text();
		var diffX = e.screenX - $(this).offset().left;
		var diffY = e.clientY - $(this).offset().top;
		$("#drags").text(texts);
		//获取可释放元素区域,得到可拖动区域
		var targetAreaLeft = $("#getbox").offset().left;
		var targetAreaTop = $("#getbox").offset().top;
		var targetAreaWidth = $("#getbox").width() - $(this).width() + targetAreaLeft;
		var targetAreaHeight = $("#getbox").height() - $(this).height();

		document.onmousemove = function(e) {
			if (flag) {
				var left = ($(window).scrollLeft()) * 1 + (e.screenX - diffX) * 1;
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
					left: -100
				});
			} else {
				//将元素添加到目标区域中去,传入3个参数，左边位置，上位置，拖动元素内容
				targerAreaAddElement($("#drags").offset().left, $("#drags").offset().top, texts)
			}
			this.onmousemove = null;
			this.onmouseup = null;
			flag = false;
		}
	});
	//处理最终释放的位置，传入left和top值
	function targerAreaAddElement(Left, Top, text) {
		console.log(Left, Top, text)
	}
}
