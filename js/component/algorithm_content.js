var modelList = [];

// $(document).ready(function () {
//     loadModelList();
// });

function loadModelList() {
    var url = server_GeoJModelBuilder+"GeoJModelBuilder-Server/algorithm/all";
    $.ajax({
        url: url,
        contentType: "application/json;charset=UTF-8",
        type: "GET",
        success: function (result) {
            if (result != null) {
                initModelList(result);
            }
        }
    });
}

function query() {
    var name = $("#schameName").val();
    var url = server_GeoJModelBuilder+"GeoJModelBuilder-Server/algorithm/all";
    $.ajax({
        url: url,
        contentType: "application/json;charset=UTF-8",
        type: "GET",
        success: function (result) {
            modelList = new Array();
            for (var i = 0; i < result.length; i++) {
                let model = result[i];
                if (model.name.indexOf(name) !== -1) {
                    modelList.push(model);
                }
            }
            initModelList(modelList);
        }
    });
}

function reset() {
    loadModelList();
}

//将服务返回的数据显示
function initModelList(list) {
    modelList = new Array();
    for (var i = 0; i < list.length; i++) {
        let model = list[i];
        if (model.referenceID != "*" && model.applicationCategory != "工作流") {
            modelList.push(model);
        }
    }
    addSchema(modelList);//添加列表显示
    var pageHtml = "";
    pageHtml += '<li class="disabled"><a href="javascript:void(0)">上一页</a></li>';
    pageHtml += '<li class="disabled"><a href="javascript:void(0)">下一页</a></li>';
    pageHtml += '<em style="padding: 10px 12px; float: right;">共 <b style="color:#1cb9ff;" id="pageTotalCount">'
        + modelList.length
        + '</b> 条记录&nbsp;&nbsp;&nbsp;共 <b style="color:#1cb9ff;" id="pageTotalPage">' + 1 + '</b> 页</em>';
    $("#pagination").html(pageHtml);
}

//artTemplate 调用添加方案列表
function addSchema(sArray) {
    var data = {
        list: sArray
    };
    var listhtml = template("schemalist", data);
    $("#schema_list tr:eq(0)").nextAll().remove();
    $("#schema_list tr:eq(0)").after(listhtml);
}


function showAlgorithmInfo(dom, index) {
    $('#infoModal').modal('toggle');
    // var model = modelList[parseInt(modelIndex)];

    // let identifier = dom.getAttribute("class")
    // switch (index) {
    //     case 1:
    //         var url = server_GeoJModelBuilder + "GeoJModelBuilder-Server/service/process/detail/" + identifier;
    //         $.ajax({
    //             url: url,
    //             contentType: "application/json;charset=UTF-8",
    //             type: "GET",
    //             success: function (result) {
    //                 // if (result.status == 200) {
    //                 // $("#infoModal_id").html(result.detail.id);
    //                 // $("#infoModal_name").html(result.detail.name);
    //                 // $("#infoModal_title").html(result.detail.title);
    //                 // $("#infoModal_description").html(result);
    //                 // if (result.detail.inputs != null) {
    //                 //     // addInputListSchema(result.detail.inputs);
    //                 // }
    //                 // if (result.detail.outputs != null) {
    //                 //     // addOutputListSchema(result.detail.outputs);
    //                 // }
    //                 result = result.replace(/</g, '&lt;');
    //                 result = result.replace(/>/g, '&gt;');
    //                 $('.modal-body').html("<pre style='border: none;background-color: inherit;height: 680px ;overflow: scroll;\n" +
    //                     "overflow-x: scroll;'>" + result + "</pre>")
    //                 $('#infoModal').modal('toggle');
    //                 // } else {
    //                 //     $('#noInfoModal').modal('toggle');
    //                 // }
    //             }
    //         });
    //     case 2:
    //         var url = server_GeoJModelBuilder + "GeoJModelBuilder-Server/workflow/template/detail/?identifier=" + identifier;
    //         $.ajax({
    //             url: url,
    //             contentType: "application/json;charset=UTF-8",
    //             type: "GET",
    //             success: function (result) {
    //                 // if (result.status == 200) {
    //                 // $("#infoModal_id").html(result.detail.id);
    //                 // $("#infoModal_name").html(result.detail.name);
    //                 // $("#infoModal_title").html(result.detail.title);
    //                 // $("#infoModal_description").html(result);
    //                 // if (result.detail.inputs != null) {
    //                 //     // addInputListSchema(result.detail.inputs);
    //                 // }
    //                 // if (result.detail.outputs != null) {
    //                 //     // addOutputListSchema(result.detail.outputs);
    //                 // }
    //                 result = result.replace(/</g, '&lt;');
    //                 result = result.replace(/>/g, '&gt;');
    //                 $('.modal-body').html("<pre style='border: none;background-color: inherit;height: 680px ;overflow: scroll;\n" +
    //                     "overflow-x: scroll;'>" + result + "</pre>")
    //                 $('#infoModal').modal('toggle');
    //                 // } else {
    //                 //     $('#noInfoModal').modal('toggle');
    //                 // }
    //             }
    //         });
    //     default:
    //         break;
    // }
}

//artTemplate 调用添加方案列表
function addInputListSchema(sArray) {
    var data = {
        list: sArray
    };
    var listhtml = template("iolist", data);
    $("#infoModal_inputList tr:eq(0)").nextAll().remove();
    $("#infoModal_inputList tr:eq(0)").after(listhtml);
}

function addOutputListSchema(sArray) {
    var data = {
        list: sArray
    };
    var listhtml = template("iolist", data);
    $("#infoModal_outputList tr:eq(0)").nextAll().remove();
    $("#infoModal_outputList tr:eq(0)").after(listhtml);
}