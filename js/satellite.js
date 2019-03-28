function checkButton(submitButtonClicked) {
    submit_type = submitButtonClicked.value;

    // $.ajax({
    //     type: "get",
    //     dataType:"jsonp",  //数据格式设置为jsonp
    //     jsonp:"callback",  //Jquery生成验证参数的名称
    //     url: "http://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=53.3013018&longitude=-6.5379840&visible=false&type=overpass",
    //     cache: false,
    //     error: function () {
    //         alert("数据传输错误");
    //     }, success: function (data) {
    //         if (window.console) {
    //             document.getElementById("satellite_result").innerText = data;
    //             console.log(data);
    //         }
    //     }
    // })


    // $.ajax({
    //     type: "GET",
    //     url: "http://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=53.3013018&longitude=-6.5379840&visible=false&type=overpass",
    //     dataType: "json",  //数据格式设置为jsonp
    //     // jsonp: "callback",  //Jquery生成验证参数的名称
    //     success: function (data) {  //成功的回调函数
    //         alert(data);
    //     },
    //     error: function (e) {
    //         alert("error");
    //     }
    // });


    // $.get("https://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=53.3013018&longitude=-6.5379840&visible=false&type=overpass",
    //     null, function (data) {
    //         alert("Data: " + data);
    //     });


    var request = new XMLHttpRequest();


    request.open('GET', 'http://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=53.3013018&longitude=-6.5379840&visible=false&type=overpass');

    request.setRequestHeader('Access-Control-Allow-Headers', '*');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
        }
    };

    request.send();

    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', 'https://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=53.3013018&longitude=-6.5379840&visible=false&type=overpass');
    // xhr.onload = function(e) {
    //     var data = JSON.parse(this.response);
    //     alert(data);
    //
    // }
    //
    // xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    // xhr.send();


}