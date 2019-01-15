/**
 * Created by lenovo on 2018/3/28.
 */
var myChart = echarts.init(document.getElementById('style_disaster'));
option = {
    xAxis: {
        type: 'category',
        data: ['干旱', '洪水', '泥石流', '地震', '火灾', '风暴', '其他'],
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [12, 20, 15, 8, 7, 11, 13],
        type: 'bar'
    }],
    axisLabel : {
        formatter: '{value}',
        textStyle: {
            color: '#fff'
        }
    }
};
myChart.setOption(option);
