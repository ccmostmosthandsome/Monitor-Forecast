/**
 * Created by lenovo on 2018/3/28.
 */
function importdata() {
    if ($("#data1")[0].style.display == "none") {
        $("#data2")[0].style.display = "none";
        $("#data3")[0].style.display = "none";
        $("#data1")[0].style.display = "block";
    } else {
        $("#data1")[0].style.display = "none";
    }
}

function importdata_water() {
    if ($("#data2")[0].style.display == "none") {
        $("#data1")[0].style.display = "none";
        $("#data3")[0].style.display = "none";
        $("#data2")[0].style.display = "block";

    } else {
        $("#data2")[0].style.display = "none";
    }
}

function importdata_road() {
    if ($("#data3")[0].style.display == "none") {
        $("#data1")[0].style.display = "none";
        $("#data2")[0].style.display = "none";
        $("#data3")[0].style.display = "block";

    } else {
        $("#data3")[0].style.display = "none";
    }
}
