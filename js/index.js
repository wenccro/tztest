window.onload = function () {
    for(var i=0; i<300; i++){
        $(".buttomsUls").append("<li>"+i+"</li>")
    }
    $("#foo").delegate("li","mousedown",function(e){

        var diffX = e.clientX - $(this).pageX; //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
        var diffY = e.clientY - $(this).pageY;
         console.log($(this).text(),diffX,diffY)
        // $(document).mousemove(function(e){
        //     consoel.log(e.clientX,e.clientY);
        // });
    });




}