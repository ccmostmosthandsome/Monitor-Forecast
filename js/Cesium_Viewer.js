/**
 * Created by lenovo on 2018/3/28.
 */
var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    timeline: false,
    homeButton: false,
    fullscreenButton: false,
    infoBox: false,
    sceneModePicker: true,
    navigationInstructionsInitiallyVisible: false,
    navigationHelpButton: false,
    geocoder: false,
    animation: false,
    selectionIndicator: false,
    vrButton: false,
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({

        //矢量底图（蓝白）
        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        layer: "tdtVecBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false

        //基础底图（彩色）
        // url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        // layer: "tdtBasicLayer",
        // style: "default",
        // format: "image/jpeg",
        // tileMatrixSetID: "GoogleMapsCompatible",
        // show: false


    })
});

//地名标注图层
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false
}));

viewer._cesiumWidget._creditContainer.style.display = "none"; //隐藏logo
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

var promise = Cesium.GeoJsonDataSource.load('http://geos.whu.edu.cn/tms/bintian/json/earthquake.geojson');
promise.then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    var entities = dataSource.entities.values;

    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.billboard.image = "./img/marker/earthquake.png";
    }
});


viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(109.761547, 19.19274, 20000000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0)
    }
});


function location1() {

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(109.761547, 19.192, 1000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0)
        }
    });
}

function ngOnInit() {

}

var datasource = new Array();
for (var i = 0; i < 4; i++) {
    datasource[i] = new Cesium.GeoJsonDataSource();
}
datasource[0].load('http://geos.whu.edu.cn/tms/bintian/json/503.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.BLUE.withAlpha(0.6),
    strokeWidth: 3
});
datasource[1].load('http://geos.whu.edu.cn/tms/bintian/json/622.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.YELLOW.withAlpha(0.6),
    strokeWidth: 3
});
datasource[2].load('http://geos.whu.edu.cn/tms/bintian/json/difference.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.RED.withAlpha(0.4),
    strokeWidth: 3
});
datasource[3].load('http://geos.whu.edu.cn/tms/bintian/json/nongtian.geojson', {
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
    url: 'http://geos.whu.edu.cn/tms/bintian/json/503_1.png',
    rectangle: Cesium.Rectangle.fromDegrees(116.869440415, 29.1936691799, 116.948543516, 29.2698772714)
});
imageprovider[1] = new Cesium.SingleTileImageryProvider({
    url: 'http://geos.whu.edu.cn/tms/bintian/json/622_1.png',
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
    imagelayerpic[1] = viewer.imageryLayers.addImageryProvider(imageprovider[1]);
};

function beforetiff() {
    claar1();
    imagelayerpic[0] = viewer.imageryLayers.addImageryProvider(imageprovider[0]);
};

function beforewater() {
    claar1();
    viewer.dataSources.add(datasource[0]);
};

function afterewater() {
    claar1();
    viewer.dataSources.add(datasource[1]);
};

function scope_extract() {
    claar1();
    viewer.dataSources.add(datasource[2]);
};