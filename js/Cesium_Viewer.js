/**
 * Created by lenovo on 2018/3/28.
 */
// let layerIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
// let tilingScheme = new Cesium.GeographicTilingScheme();
// let proxy= "http://192.168.42.50:8989/ProxyServlet/proxyHandler?url=";

var viewer = new Cesium.Map('cesiumContainer');
var layer;
//添加矢量图svg
var rectangles;
var primitive_t;
var primitive_f;
var points = [];
var scene = viewer.scene;


init();

/**
 * 初始化函数
 */
function init() {
    layer = new Cesium.UrlTemplateImageryProvider({url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"});
    viewer.imageryLayers.addImageryProvider(layer);

    //定位到中国
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.911, 29.21, 20000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0)
        }
    });

    //Draw satellite
    // create cylinder geometry
    // var cylinderEntity = new Cesium.CylinderGeometry({
    //     length: 200000,
    //     topRadius: 80000,
    //     bottomRadius: 200000,
    // });
    // var data = new Data();
    drawSatellite();

    // setTimeout(() => {
    //     viewer.camera.flyTo({
    //         // destination: Cesium.Cartesian3.fromDegrees(109.77158035673244, 19.165324458238587, 701790.9515625), // 设置位置
    //         destination: Cesium.Cartesian3.fromDegrees(159.2, 13.9, 7017900.9515625), // 设置位置
    //
    //         duration: 4, // 设置飞行持续时间，默认会根据距离来计算
    //         orientation: {
    //             heading: 0,
    //             pitch: -1.6,
    //             roll: 0.0
    //         }
    //     })
    // }, 3000);

    //绘制台风
    // drawTyphoon();
    //定期修改颜色
    // setInterval(function () {
    //     // var attributes = primitive_t.getGeometryInstanceAttributes('typhoon');//获取某个实例的属性集
    //     // attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({
    //     //     alpha: 1.0
    //     // }));
    //     if (count == points.length) {
    //         count = 0;
    //     }
    //     var lon = points[count];
    //     var len = points[count + 1];
    //     count = count + 2;
    //     primitive_t.geometry._rectangle = Cesium.Rectangle.fromDegrees(lon - 0.25, len - 0.25, lon + 0.25, len + 0.25);
    //     // primitive_f.update();
    //     viewer.render();
    //     // var attributes = primitive_f.getGeometryInstanceAttributes('typhoon');
    //     // .geometry._rectangle = Cesium.Rectangle.fromDegrees(lon - 0.25, len - 0.25, lon + 0.25, len + 0.25);
    //
    // }, 2000);
}


/**
 *
 * @param primitive
 * @param scene
 * 向primitive添加贴图材质
 */
function applyImageMaterial(primitive, scene) {
    //Sandcastle.declare(applyImageMaterial); // For highlighting in Sandcastle.
    primitive.appearance.material = new Cesium.Material({
        fabric: {
            type: 'Image',
            uniforms: {
                image: './img/map/Typhoon_track.svg'// '../images/wumenchenglou.svg'
            }
        }
    });
}

/**
 *
 * @param scene
 * @param lon
 * @param len
 *在场景中创建primitive
 */

function createPrimitives(scene, lon, len) {
    // rectangles.push(scene.primitives.add(new Cesium.Primitive({
    //     geometryInstances: new Cesium.GeometryInstance({
    //         geometry: new Cesium.RectangleGeometry({
    //             rectangle: Cesium.Rectangle.fromDegrees(lon - 0.25, len - 0.25, lon + 0.25, len + 0.25),//west,south,east,north 2,-50,152,35
    //             vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    //         })
    //     }),
    //     appearance: new Cesium.EllipsoidSurfaceAppearance({
    //         aboveGround: false
    //     })
    // })));

    //添加路径上的关键点
    scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(lon, len),
                radius: 10000.0,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                show: new Cesium.ShowGeometryInstanceAttribute(true) //显示或者隐藏
            }
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: false,
            closed: true
        })
    }));
}

//卫星轨道数据
function drawSatellite() {
    //Multi Satellites
    var multiSate  = new Cesium.CzmlDataSource();
    multiSate.load('./assets/multiSats.czml');
    this.viewer.dataSources.add(multiSate);
}

//台风绘制
function drawTyphoon() {
    //绘制台风图标
    var typhoon = viewer.entities.add({
        id:'typhoon_icon',
        position: Cesium.Cartesian3.fromDegrees(109.77158035673244, 19.165324458238587),
        // position: Cesium.Cartesian3.fromDegrees(159.2, 13.9),
        ellipse: {
            semiMinorAxis: 4000.0,
            semiMajorAxis: 4000.0,
            material: "./img/map/Typhoon_track.svg",
            rotation: Cesium.Math.toRadians(60.0)
        }
    });


    //提取台风路径坐标点
    // allTime = typhoonDetail.typhoon[8];
    allTime = typhoon_jsons_view_2430020.typhoon[8];
    allTime.forEach(moment => {
        var BABJ = moment[11].BABJ;
        for (var i = 0; i < BABJ.length; i++) {
            var position = BABJ[i];
            if (i % 8 == 0) {
                createPrimitives(scene, position[2], position[3]);
                points.push(position[2], position[3]);
            }
        }
    });

    //绘制折线
    scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.SimplePolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArray(points),
                // width: 10000.0,//线宽
                // vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                // show: new Cesium.ShowGeometryInstanceAttribute(true) //显示或者隐藏
            }
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: false,
            // closed: true
        })
    }));

    //绘制台风
    primitive_t = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(points[0] - 0.25, points[1] - 0.25, points[0] + 0.25, points[1] + 0.25),//west,south,east,north 2,-50,152,35
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        }),
        id: "typhoon"
    });
    primitive_f = new Cesium.Primitive({
        geometryInstances: primitive_t,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'Image',
                    uniforms: {
                        image: './img/map/Typhoon_track.svg'// '../images/wumenchenglou.svg'
                    }
                }
            }),
            aboveGround: false
        })
    });
    scene.primitives.add(primitive_f);

    //set material
    // applyImageMaterial(rectangles, scene);

    // rectangles.geometryInstances.geometry._rectangle = Cesium.Rectangle.fromDegrees(points[2] - 0.25, points[3] - 0.25, points[2] + 0.25, points[3] + 0.25);
    // rectangles.geometryInstances.geometry._rectangle = Cesium.Rectangle.fromDegrees(points[4] - 0.25, points[5] - 0.25, points[4] + 0.25, points[5] + 0.25);

    addClickEvent();


}

function addClickEvent(){
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        if (Cesium.defined(pick) && (pick.id.id === 'typhoon_icon')) {
            alert("卫星数据");
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};


var count = 0;
// setInterval(function () {
//     // rectangles.geometryInstances.geometry._rectangle = Cesium.Rectangle.fromDegrees(points[2] - 0.25, points[3] - 0.25, points[2] + 0.25, points[3] + 0.25);
//
//     if (count == points.length) {
//         count = 0;
//     }
//     var lon = points[count];
//     var len = points[count + 1];
//     count = count + 2;
//     rectangles.geometryInstances.geometry._rectangle = Cesium.Rectangle.fromDegrees(lon - 0.25, len - 0.25, lon + 0.25, len + 0.25);
// }, 1000);


// createPrimitives(scene);
// createButtons(scene);
// applyImageMaterial(rectangle, scene);

// var viewer = new Cesium.Viewer('cesiumContainer', {
//     baseLayerPicker: false,
//     timeline: false,
//     homeButton: false,
//     fullscreenButton: false,
//     infoBox: false,
//     sceneModePicker: true,
//     navigationInstructionsInitiallyVisible: false,
//     navigationHelpButton: false,
//     geocoder: false,
//     animation: false,
//     selectionIndicator: false,
//     vrButton: false,
//     imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
//
//         //矢量底图（蓝白）
//         // url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
//         // layer: "tdtVecBasicLayer",
//         // style: "default",
//         // format: "image/jpeg",
//         // tileMatrixSetID: "GoogleMapsCompatible",
//         // show: false
//
//         //基础底图（彩色）
//         // url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
//         // layer: "tdtBasicLayer",
//         // style: "default",
//         // format: "image/jpeg",
//         // tileMatrixSetID: "GoogleMapsCompatible",
//         // show: false
//
//         url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk=96249d38b31b728b6d706eed7539bd9f",
//         layer: "tdtBasicLayer",
//         style: "default",
//         format: "image/jpeg",
//         tileMatrixSetID: "GoogleMapsCompatible",
//         show: false
//
//         // 吉奥
//         // proxy: this.defaultProxy,
//         // credit: cfg.Title,
//         // url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
//         // tilingScheme: tilingScheme,
//         // minimumLevel: 9,
//         // maximumLevel: 19,
//         // tileMatrixLabels: layerIndex
//
//     })
// });


// var image = {
//     "Name": "影像地图",
//     "Type": "raster",
//     "Url": "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali" //"https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
// };
//
// function addWebMapTileServiceImageryProvider(cfg) {
//     let layerIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
//     let tilingScheme = new Cesium.GeographicTilingScheme();
//     let layer = new Cesium.WebMapTileServiceImageryProvider({
//         // proxy: this.defaultProxy,
//         credit: cfg.Title,
//         url: cfg.Url,
//         layer: cfg.Options.Layer,
//         style: cfg.Options.Style,
//         format: cfg.Options.Format,
//         tileMatrixSetID: cfg.Options.MatrixSet,
//         tilingScheme: tilingScheme,
//         // minimumLevel: 9,
//         // maximumLevel: 19,
//         tileMatrixLabels: layerIndex
//     });
//     viewer.imageryLayers.addImageryProvider(layer)
// }

// addWebMapTileServiceImageryProvider(image);

//地名标注图层
// viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
//     url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
//     layer: "tdtAnnoLayer",
//     style: "default",
//     format: "image/jpeg",
//     tileMatrixSetID: "GoogleMapsCompatible",
//     show: false
// }));

// viewer._cesiumWidget._creditContainer.style.display = "none"; //隐藏logo
// viewer.scene.skyBox.show = false;
// viewer.scene.backgroundColor = new Cesium.Color(0.1, 0.1, 0.1, 0.0);
// viewer.scene.backgroundColor = new Cesium.Color.DARKGRAY;
//viewer.scene.screenSpaceCameraController.minimumZoomDistance=400;
//显示帧率
//viewer.scene.debugShowFramesPerSecond = true;
//灯光
//viewer.scene.globe.enableLighting = true;
//各向异性过滤
//viewer.scene.allowTextureFilterAnisotropic = true;

//一带一路矢量
/*
var yidaiyilu =new Cesium.GeoJsonDataSource();
yidaiyilu.load('http://geos.whu.edu.cn/tms/bintian/json/earthquake.geojson', {
    markerSize: 48,
    markerColor: Cesium.Color.RED,
    markerSymbol: 'bakery'
});
viewer.dataSources.add(yidaiyilu);
*/


// var promise = Cesium.GeoJsonDataSource.load('http://geos.whu.edu.cn/tms/bintian/json/earthquake.geojson');
// promise.then(function (dataSource) {
//     viewer.dataSources.add(dataSource);
//     var entities = dataSource.entities.values;
//
//     for (var i = 0; i < entities.length; i++) {
//         var entity = entities[i];
//         entity.billboard.image = "./img/marker/earthquake.png";
//     }
// });


// viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(109.761547, 19.19274, 20000000),
//     orientation: {
//         heading: Cesium.Math.toRadians(0),
//         pitch: Cesium.Math.toRadians(-90),
//         roll: Cesium.Math.toRadians(0)
//     }
// });


function location1() {

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.911, 29.21, 10000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-80),
            roll: Cesium.Math.toRadians(0)
        }
    });
}

var datasource = new Array();
for (var i = 0; i < 4; i++) {
    datasource[i] = new Cesium.GeoJsonDataSource();
}
datasource[0].load('http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/503.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.BLUE.withAlpha(0.6),
    strokeWidth: 3
});
datasource[1].load('http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/622.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.YELLOW.withAlpha(0.6),
    strokeWidth: 3
});
datasource[2].load('http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/difference.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.RED.withAlpha(0.4),
    strokeWidth: 3
});
datasource[3].load('http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/nongtian.geojson', {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK.withAlpha(0.6),
    strokeWidth: 3
});

var imageprovider = new Array();
var imagelayerpic = new Array();
for (var i = 0; i < 2; i++) {
    imageprovider[i] = new Cesium.SingleTileImageryProvider();
}
imageprovider[0] = new Cesium.SingleTileImageryProvider({
    url: 'http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/503_1.png',
    rectangle: Cesium.Rectangle.fromDegrees(116.869440415, 29.1936691799, 116.948543516, 29.2698772714)
});
imageprovider[1] = new Cesium.SingleTileImageryProvider({
    url: 'http://202.114.118.61:8099/ERPlatform_proxy/Proxy?url=http://geos.whu.edu.cn/tms/bintian/json/622_1.png',
    rectangle: Cesium.Rectangle.fromDegrees(116.869064939, 29.1940659558, 116.946987028, 29.2702316496)
});
var imageryLayer = new Array();

function claar1() {
    viewer.imageryLayers.remove(imagelayerpic[1]);
    viewer.imageryLayers.remove(imagelayerpic[0]);
    viewer.dataSources.remove(datasource[0]);
    viewer.dataSources.remove(datasource[1]);
    viewer.dataSources.remove(datasource[2]);

}

function aftertiff01() {
    claar1();
};

function beforetiff() {
    claar1();
};

//加载灾前水体影像
function loadBefWatTif() {
    claar1();
    imagelayerpic[1] = viewer.imageryLayers.addImageryProvider(imageprovider[1]);
}

//加载灾后水体影像
function loadAftWatTif() {
    claar1();
    imagelayerpic[1] = viewer.imageryLayers.addImageryProvider(imageprovider[1]);

}

//加载灾前水体数据（处理结果）
function loadBefWat() {
    claar1();
    viewer.dataSources.add(datasource[0]);
};

//加载灾后水体数据（处理结果）
function loadAftWat() {
    claar1();
    viewer.dataSources.add(datasource[1]);
};

//加载洪涝范围数据
function loadScoExt() {
    claar1();
    viewer.dataSources.add(datasource[2]);
};

//加载洪涝灾害评估报告
function loadWatAss() {

}




// Shane Carty - 12713771
// Orbital Prediction for Earth Observation

// This module contains functions to create custom buttons for Cesium globe, as well as to draw polygons
// and points onto the screen, which are then used for queries


var clock = viewer.clock;
var scene = viewer.scene;
var globe = scene.globe;
var ellipsoid = scene.globe.ellipsoid;
var primitives = scene.primitives;
var handler;

// add buttons to toolbar of Cesium Globe
// Sandcastle.addToolbarButton('Full Screen', function(){
//     Cesium.Fullscreen.requestFullscreen(scene.canvas);
//
//     var screenWidth = screen.width;
//     $('#cesiumContainer div div div canvas').prop('width', screenWidth);
//
// });
//
// $('#toolbar > button:nth-child(1)').prop('title', "Show Globe Fullscreen")
//
//
// Sandcastle.addToolbarButton('Select Location', function(){
//     handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//
//     handler.setInputAction(function(click) {
//         var cartesian = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
//
//         if (cartesian) {
//             var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//
//             var longitude = Cesium.Math.toDegrees(cartographic.longitude);
//             var latitude = Cesium.Math.toDegrees(cartographic.latitude);
//
//             document.getElementById("long").value = longitude;
//             document.getElementById("lat").value = latitude;
//
//             viewer.entities.add({
//                 position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
//                 point : {
//                     pixelSize : 3,
//                     color : Cesium.Color.YELLOW
//                 }
//             });
//         }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// });
//
// $('#toolbar > button:nth-child(2)').prop('title', "Select Location for Query")
//
//
// Sandcastle.addToolbarButton('Show Footprint', function(){
//     handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//
//     handler.setInputAction(function(click) {
//
//         var pickedObject = scene.pick(click.position);
//
//         if (Cesium.defined(pickedObject)) {
//
//             var czmlSatId = pickedObject.id._id;
//             var satName = czmlSatId.split("/")[1];
//
//             var swathWidthString = document.getElementById("swath_width").value;
//             swathWidthString =  swathWidthString.replace(/'/gi, "\"");
//
//             var swathWidthDict = $.parseJSON(swathWidthString);
//             var swathWidth = swathWidthDict[satName]
//             if(swathWidthString == ""){
//
//                 swathWidth = 2000 * 1000;
//                 var secondMultiplier = swathWidth/250000.0;  // for every 250km of swath width, add one second between footprints
//                 var intervalBetweenFootPrints = 1000.0 * secondMultiplier;
//
//
//                 var numberOfFootPrintsAtAtime = parseInt(30/ Math.ceil(secondMultiplier));
//
//                 drawFootPrintInterval(czmlSatId, numberOfFootPrintsAtAtime, intervalBetweenFootPrints, swathWidth);
//
//             }else{
//                 // formula to decide how often to draw footprint of satellite
//                 var secondMultiplier = swathWidth/250000.0;  // for every 250km of swath width, add one second between footprints
//                 var intervalBetweenFootPrints = 1000.0 * secondMultiplier
//                 var numberOfFootPrintsAtAtime = parseInt(30/ Math.ceil(secondMultiplier));
//
//                 drawFootPrintInterval(czmlSatId, numberOfFootPrintsAtAtime, intervalBetweenFootPrints, swathWidth);
//
//             }
//
//         }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// });
//
// $('#toolbar > button:nth-child(3)').prop('title', "Left Click Satellite to Show Instrument Footprint")
//
//
// Sandcastle.addToolbarButton('Select Polygon', function(){
//
//     document.getElementById("long").value = "";
//     document.getElementById("lat").value = "";
//     var points = []
//     handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//
//     handler.setInputAction(function(event) {
//         var cartesian = viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
//
//         if (cartesian) {
//             var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//
//             var longitude = Cesium.Math.toDegrees(cartographic.longitude);
//             var latitude = Cesium.Math.toDegrees(cartographic.latitude);
//
//             var currentValue1 = document.getElementById("long").value
//             var currentValue2 = document.getElementById("lat").value
//
//
//             if(currentValue1 === ""){
//                 document.getElementById("long").value = longitude;
//                 document.getElementById("lat").value = latitude;
//             }else{
//                 document.getElementById("long").value = currentValue1 + "," + longitude;
//                 document.getElementById("lat").value = currentValue2 + "," + latitude;
//             }
//
//             viewer.entities.add({
//                 position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
//                 point : {
//                     pixelSize : 3,
//                     color : Cesium.Color.YELLOW
//                 }
//             });
//
//             points.push(longitude);
//             points.push(latitude);
//
//         } else {
//             entity.label.show = false;
//         }
//
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//
//     handler.setInputAction(function(event) {
//         var cartesian = viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
//         if (cartesian) {
//             var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//
//             var longitude = Cesium.Math.toDegrees(cartographic.longitude);
//             var latitude = Cesium.Math.toDegrees(cartographic.latitude);
//
//             var currentValue1 = document.getElementById("long").value
//             var currentValue2 = document.getElementById("lat").value
//
//             if(currentValue1 === ""){
//                 document.getElementById("long").value = longitude;
//                 document.getElementById("lat").value = latitude;
//             }else{
//                 document.getElementById("long").value = currentValue1 + "," + longitude;
//                 document.getElementById("lat").value = currentValue2 + "," + latitude;
//             }
//
//             viewer.entities.add({
//                 position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
//                 point : {
//                     pixelSize : 3,
//                     color : Cesium.Color.RED
//                 }
//             });
//             points.push(longitude);
//             points.push(latitude);
//
//             drawShape(points);
//             points = []
//
//
//
//         } else {
//             entity.label.show = false;
//         }
//
//     }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
//
// });
//
// $('#toolbar > button:nth-child(4)').prop('title', "Select Polygon for Query (Left Click Initial Points, Right Click to Close Polygon)")
//

/*
Sandcastle.addToolbarButton('Reset', function(){
	viewer.entities.removeAll();
});
*/

// // utility functions
//
// function dropMarker(cartographic){
//     var longitude = Cesium.Math.toDegrees(cartographic.longitude);
//     var latitude = Cesium.Math.toDegrees(cartographic.latitude);
//     var height = cartographic.height;
//
//     viewer.entities.add({
//         name : 'Red cone',
//         position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
//         cylinder : {
//             length : 400000.0,
//             topRadius : 0.0,
//             bottomRadius : 200000.0,
//             material : Cesium.Color.RED.withAlpha(0.5)
//         }
//     });
//
// }
//
// function drawShape(points){
//     viewer.entities.add({
//         polygon : {
//             hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
//             material : Cesium.Color.RED.withAlpha(0.5),
//             outline: true,
//             outlineColor: Cesium.Color.BLACK
//         }
//
//     });
// }
//
// Sandcastle.reset = function() {
//     handler = handler && handler.destroy();
// };
//
// $('.cesium-button').addClass('cesium-button-toolbar')
