(function () {
    window.mainMap = {
        viewer: null,
        layer: null,
        map: null,
        isShow: false,
        dataSource: {
            'LX_S': null,
            'LX_G': null,
            'floodDif': null,
            'afterWater': null,
            'beforeWater': null
        },
        imageLayers: {
            'beforeWater': null,
            'afterWater': null,
            'rain': null
        },
        points: [],
        init: function () {
            if (mainMap.isShow) {
                return;
            }
            //init viewer, and add layer of google map to viewer
            mainMap.viewer = new Cesium.Viewer("cesiumContainer", {
                animation: false,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: true, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                imageryProvider: new Cesium.UrlTemplateImageryProvider({url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"}),
            });
            mainMap.layer = mainMap.viewer.imageryLayers.get(0);
            // mainMap.viewer = new Cesium.Map('cesiumContainer');
            // mainMap.layer = new Cesium.WebMapTileServiceImageryProvider({
            //     url: "http://59.212.37.22/mapserver/label/WMTS/1.0/hn_bigdata_2018dt/hn_bigdata_2018dtys1?Service=WMTS&REQUEST=GetTile&Version=1.0.0&layer=hn_bigdata_2018dt_tdt_96&tileMatrixSet=hn_bigdata_2018dt_tdt_96&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=hn_bigdata_2018dtys1&Format=image/png",
            //     layer: "hn_bigdata_2018dt_tdt_96",
            //     style: "hn_bigdata_2018dtys1",
            //     format: "image/png",
            //     tileMatrixSetID: "hn_bigdata_2018dt_tdt_96",
            //     // maximumLevel: 18
            // });
            // mainMap.viewer.imageryLayers.addImageryProvider(mainMap.layer);

            //located to china
            mainMap.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(116.911, 29.21, 20000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: Cesium.Math.toRadians(0)
                }
            });

            mainMap.loadTyphoonLayer();
            mainMap.initDataSource();
            mainMap.initImageLayer();
            // mainMap.loadRoad();
            mainMap.loadSatellite();
            mainMap.leftClickHandler();

        },
        loadTyphoonLayer: function () {
            $.getJSON("assets/typhoon/2306291.json", function (data) {
                let allTime = data.typhoon[8];

                allTime.forEach(moment => {
                    drawIconTyp(moment[4], moment[5]);  //Draw typhoon icon by two points
                    mainMap.points.push(moment[4], moment[5]);
                });

                //绘制折线
                mainMap.viewer.scene.primitives.add(new Cesium.Primitive({
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: new Cesium.SimplePolylineGeometry({
                            positions: Cesium.Cartesian3.fromDegreesArray(mainMap.points),
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
            });

            //Draw typhoon icon by two points
            function drawIconTyp(point1, point2) {
                primitive_t = new Cesium.GeometryInstance({
                    geometry: new Cesium.RectangleGeometry({
                        rectangle: Cesium.Rectangle.fromDegrees(point1 - 0.1, point2 - 0.1, point1 + 0.1, point2 + 0.1),//west,south,east,north 2,-50,152,35
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
                mainMap.viewer.scene.primitives.add(primitive_f);
            }
        },
        loadSatellite: function () {
            //Multi Satellites
            let multiSate = new Cesium.CzmlDataSource();
            multiSate.load('./assets/czml/multiSats_Chinese.czml');
            mainMap.viewer.dataSources.add(multiSate);
        },
        initDataSource: function () {
            let beforeWater = new Cesium.GeoJsonDataSource();
            let afterWater = new Cesium.GeoJsonDataSource();
            let floodDif = new Cesium.GeoJsonDataSource();
            let LX_G = new Cesium.GeoJsonDataSource();
            let LX_S = new Cesium.GeoJsonDataSource();
            let Road_Z = new Cesium.GeoJsonDataSource();
            let railway = new Cesium.GeoJsonDataSource();
            let roadAffected = new Cesium.GeoJsonDataSource();

            beforeWater.load('./assets/geojson/beforeWater.geojson', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.BLUE.withAlpha(0.6),
                strokeWidth: 3
            });
            afterWater.load('./assets/geojson/afterWater.geojson', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.DARKORANGE.withAlpha(0.6),
                strokeWidth: 3
            });
            floodDif.load('./assets/geojson/floodDif.geojson', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.RED.withAlpha(0.4),
                strokeWidth: 3
            });
            LX_G.load('./assets/geojson/LX_G.json', {
                stroke: Cesium.Color.BLUE,
                fill: Cesium.Color.BLUE.withAlpha(0.6),
                strokeWidth: 1
            });
            LX_S.load('./assets/geojson/LX_S.json', {
                stroke: Cesium.Color(255, 204, 102, 1),
                fill: Cesium.Color.YELLOW.withAlpha(0.6),
                strokeWidth: 1
            });
            Road_Z.load('./assets/geojson/Road_Z.json', {
                stroke: Cesium.Color.GREEN,
                fill: Cesium.Color.RED.withAlpha(0.4),
                strokeWidth: 1
            });
            railway.load('./assets/geojson/railway.json', {
                stroke: Cesium.Color.RED,
                fill: Cesium.Color.RED.withAlpha(0.4),
                strokeWidth: 2
            });
            roadAffected.load('./assets/geojson/road_affected.json', {
                stroke: Cesium.Color.WHITE,
                fill: Cesium.Color.RED.withAlpha(0.4),
                strokeWidth: 4
            });

            mainMap.dataSource['beforeWater'] = beforeWater;
            mainMap.dataSource['afterWater'] = afterWater;
            mainMap.dataSource['floodDif'] = floodDif;
            mainMap.dataSource['LX_G'] = LX_G;
            mainMap.dataSource['LX_S'] = LX_S;
            mainMap.dataSource['Road_Z'] = Road_Z;
            mainMap.dataSource['railway'] = railway;
            mainMap.dataSource['roadAffected'] = roadAffected;
        },
        loadDataSource: function (index) {
            let dataSource = mainMap.dataSource[index];
            if (mainMap.viewer.dataSources.contains(dataSource)) {
                mainMap.viewer.dataSources.remove(dataSource)
            } else {
                mainMap.viewer.dataSources.add(dataSource)
            }
        },
        clearDataSource: function () {
            for (let key in mainMap.dataSource) {
                viewer.imageryLayers.remove(mainMap.dataSource[key]);
            }
        },
        deleteDataSource: function (index) {
            viewer.imageryLayers.remove(mainMap.dataSource[index]);
        },
        loadPreRoad: function () {
            let LX_G = mainMap.dataSource['LX_G'];
            let LX_S = mainMap.dataSource['LX_S'];
            let Road_Z = mainMap.dataSource['Road_Z'];

            if (mainMap.viewer.dataSources.contains(LX_G)) {
                mainMap.viewer.dataSources.remove(LX_G);
            } else {
                mainMap.viewer.dataSources.add(LX_G);
            }
            if (mainMap.viewer.dataSources.contains(LX_S)) {
                mainMap.viewer.dataSources.remove(LX_S);
            } else {
                mainMap.viewer.dataSources.add(LX_S);
            }
            if (mainMap.viewer.dataSources.contains(Road_Z)) {
                mainMap.viewer.dataSources.remove(Road_Z);
            } else {
                mainMap.viewer.dataSources.add(Road_Z);
            }

            // mainMap.viewer.dataSources.add(mainMap.dataSource['Road_Z'])
        },
        loadPreRailway:function(){
            let railway = mainMap.dataSource['railway'];
            if (mainMap.viewer.dataSources.contains(railway)) {
                mainMap.viewer.dataSources.remove(railway);
            } else {
                mainMap.viewer.dataSources.add(railway);
            }
        },
        location: function () {
            // locate to hainan
            mainMap.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(109.761547, 19.19274, 2000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: Cesium.Math.toRadians(0)
                }
            });
        },
        initImageLayer: function () {
            mainMap.imageLayers['beforeWater'] = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                url: './assets/flood/beforeWater.png',
                rectangle: Cesium.Rectangle.fromDegrees(108.91, 18.85, 109.10, 19.05)
            }));

            mainMap.imageLayers['afterWater'] = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                url: './assets/flood/afterWater.png',
                rectangle: Cesium.Rectangle.fromDegrees(108.91, 18.85, 109.10, 19.05)
            }));

            mainMap.imageLayers['rainRange'] = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                url: './assets/rain/rain.png',
                rectangle: Cesium.Rectangle.fromDegrees(108.58251, 18.14273, 111.06905, 20.17357)
            }));
        },
        loadImageLayer: function (index) {
            let imageLayer = mainMap.imageLayers[index];
            if (mainMap.viewer.imageryLayers.contains(imageLayer)) {
                mainMap.viewer.imageryLayers.remove(imageLayer, false);
            } else {
                mainMap.viewer.imageryLayers.add(imageLayer);
            }
        },
        loadPosRoad: function () {
            let roadAffected = mainMap.dataSource['roadAffected'];
            if (mainMap.viewer.dataSources.contains(roadAffected)) {
                mainMap.viewer.dataSources.remove(roadAffected);
            } else {
                mainMap.viewer.dataSources.add(roadAffected);
                mainMap.viewer.dataSources.raiseToTop(roadAffected);
            }
        },
        leftClickHandler: function () {
            let handler = new Cesium.ScreenSpaceEventHandler(mainMap.viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var pick = mainMap.viewer.scene.pick(movement.position);
                console.log(pick)
                if (Cesium.defined(pick) && (pick.id.id === 'typhoon_icon')) {
                    alert("卫星数据");
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }


    };
})();