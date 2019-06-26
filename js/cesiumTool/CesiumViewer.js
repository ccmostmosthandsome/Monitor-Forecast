(function () {
    window.mainMap = {
        viewer: null,
        scene: null,
        layers: {},
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
        typhoon: {//包含真实路径和预测路径的实体对象，同时会在运行中添加真实路径对象的键值对
            truePath: [],
            prediction: [],
            show: false
        },
        points_pre: [],
        init: function () {
            if (mainMap.isShow) {
                return;
            }
            let cesiumContainer = document.getElementById("cesiumContainer");
            //init viewer, and add layer of google map to viewer
            mainMap.viewer = new Cesium.Viewer("cesiumContainer", {
                fullscreenElement: cesiumContainer,//全屏按钮显示的全屏元素
                animation: true,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: true, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                imageryProvider: new Cesium.UrlTemplateImageryProvider({url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"}),
            });
            mainMap.scene = mainMap.viewer.scene;

            // located to china
            mainMap.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(116.911, 29.21, 20000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: Cesium.Math.toRadians(0)
                }
            });


            //layers
            // mainMap.loadTyphoonLayer();
            mainMap.initDataSource();
            mainMap.initImageLayer();
            mainMap.loadSatellite();
            mainMap.leftClickHandler();
            mainMap.loadEntity();


        },
        fullscreen: function () {
            mainMap.viewer.canvas.requestFullscreen();
        },
        loadLayer: function (nodes) {
            nodes.forEach(function (node) {
                if (node.checked === false) {
                    if (node.type === 'tms') {
                        mainMap.scene.imageryLayers.lowerToBottom(mainMap.layers[node.id]);
                    } else if (node.type === 'image') {
                        let imageLayer = mainMap.imageLayers[node.id];
                        if (mainMap.viewer.imageryLayers.contains(imageLayer)) {
                            mainMap.viewer.imageryLayers.remove(imageLayer, false);
                            delete mainMap.imageLayers[node.id]
                        }
                    } else if (node.type === 'geojson') {
                        let dataSource = mainMap.dataSource[node.id];
                        if (mainMap.viewer.dataSources.contains(dataSource)) {
                            mainMap.viewer.dataSources.remove(dataSource)
                        }
                    } else if (node.type === 'wmts') {
                        let dataSource = mainMap.layers[node.id];
                        if (mainMap.viewer.scene.imageryLayers.contains(dataSource)) {
                            mainMap.viewer.scene.imageryLayers.remove(dataSource)
                        }
                    }
                } else if (node.checked === true) {
                    if (node.type === 'tms') {
                        // if already loaded, raise the layer to top
                        if (mainMap.layers[node.id]) {
                            mainMap.scene.imageryLayers.raiseToTop(mainMap.layers[node.id]);
                        } else {
                            let imageryProvider = new Cesium.createTileMapServiceImageryProvider({
                                url: node.source,
                                // credit: imageCredit
                            });
                            mainMap.layers[node.id] = mainMap.scene.imageryLayers.addImageryProvider(imageryProvider);
                        }
                    } else if (node.type === 'wmts') {
                        let imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
                            url: node.source
                        });
                        mainMap.layers[node.id] = mainMap.viewer.scene.imageryLayers.addImageryProvider(imageryProvider);
                    } else if (node.type === "tianditu") {
                        // if already loaded, raise the layer to top
                        if (mainMap.layers[node.id]) {
                            mainMap.scene.imageryLayers.raiseToTop(mainMap.layers[node.id]);
                        } else {
                            let labelImagery = new Cesium.WebMapTileServiceImageryProvider({
                                url: node.source,
                                // credit: imageCredit,
                                layer: "hn_bigdata_2018dt_ogc_90.7",
                                style: "hn_bigdata_2018dtys1",
                                format: "image/png",
                                tileMatrixSetID: "hn_bigdata_2018dt_ogc_90.7",
                                maximumLevel: 18
                            });
                            mainMap.layers[node.id] = mainMap.scene.imageryLayers.addImageryProvider(labelImagery);
                        }
                    } else if (node.type === "image") {
                        let labelImagery = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                            url: './assets/img/population_density.png',
                            rectangle: Cesium.Rectangle.fromDegrees(108.58251, 18.14273, 111.06905, 20.17357)
                        }));
                        mainMap.imageLayers[node.id] = labelImagery;
                        mainMap.viewer.imageryLayers.add(labelImagery);
                    } else if (node.type === "geojson") {
                        let dataSource = mainMap.dataSource[node.id];
                        mainMap.viewer.dataSources.add(dataSource);

                        //修改DataSource属性
                        // var entities = dataSource.entities.values;
                        // let color = new Cesium.Color;
                        //
                        // switch (node.id) {
                        //     case 'fx_ql':
                        //         Cesium.Color.fromBytes(255, 236, 51, 255, color);
                        //         break;
                        //     case 'fx_fzst':
                        //         Cesium.Color.fromBytes(51, 255, 134, 255, color);
                        //         break;
                        //     case 'fx_xx':
                        //         Cesium.Color.fromBytes(51, 70, 255, 255, color);
                        //         break;
                        //     case 'mz_Village':
                        //         Cesium.Color.fromBytes(255, 51, 172, 255, color);
                        //         break;
                        //     case 'fx_azd':
                        //         Cesium.Color.fromBytes(51, 255, 238, 255, color);
                        //         break;
                        //     case 'gt_bt':
                        //         Cesium.Color.fromBytes(136, 51, 255, 255, color);
                        //         break;
                        //     case 'mz_avoidancepoint':
                        //         Cesium.Color.fromBytes(255, 51, 68, 255, color);
                        //         break;
                        //     case 'mz_Station':
                        //         Cesium.Color.fromBytes(170, 255, 51, 255, color);
                        //         break;
                        //     default:
                        //         Cesium.Color.fromBytes(255, 51, 126, 255, color);
                        // }
                        // for (var i = 0; i < entities.length; i++) {
                        //
                        //     var entity = entities[i];
                        //     entity.billboard = undefined;//设置billboard和point来显示一个点而不是图标
                        //     entity.point = new Cesium.PointGraphics({
                        //         color: color,
                        //         pixelSize: 5
                        //     });
                        // }
                    }
                }
            })
        },
        loadTyphoonLayer: function () {
            if (mainMap.typhoon.show) {
                mainMap.deleteTyphoon();
                mainMap.typhoon.show = false;
            } else {
                let color = new Cesium.Color;
                Cesium.Color.fromBytes(255, 51, 126, 255, color);
                $.getJSON("assets/typhoon/2306291.json", function (data) {
                    // get basic info of typhoon
                    let allTime = data.typhoon[8];
                    let name = data.typhoon[2];
                    let description = '\
                                <p>\
                                  ' + data.typhoon[6] + '\
                                </p>\
                                ';
                    let points = [];

                    // traverse the true position
                    allTime.forEach(moment => {
                        drawIconTyp(name, description, moment);  //Draw typhoon icon by two points
                        mainMap.typhoon[moment[0]] = moment;
                        points.push(moment[4], moment[5]); //save true locations
                    });

                    //draw the true path of typhoon
                    let polyline = mainMap.viewer.entities.add({
                        // id: point[0],
                        name: '台风路径',
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray(points),
                            width: 1.5,
                            // clampToGround:true,
                            material: color,
                        }
                    });
                    mainMap.typhoon.truePath.push(polyline);
                });

                //Draw typhoon icon by two points
                function drawIconTyp(name, description, point) {
                    let typhoon = mainMap.viewer.entities.add({
                        id: point[0],
                        position: Cesium.Cartesian3.fromDegrees(point[4], point[5]),
                        x: point[4],
                        y: point[5],
                        name: name + point[1],
                        ellipse: {
                            semiMinorAxis: 4000.0,
                            semiMajorAxis: 4000.0,
                            fill: true,
                            material: color,
                        }
                    });

                    let des = '\
                                <p>\
                                  ' + point[12][0] + '\
                                </p>\
                                <p>' + dlang.typhoon_center + ':\
                                  ' + point[4] + '°E|' + point[5] + '°N' + '\
                                </p>\
                                \<p>' + dlang.typhoon_air_pressure + ':\
                                  ' + point[6] + 'hPa' + '\
                                </p>\
                                \<p>' + dlang.typhoon_wind_speed + ':\
                                  ' + point[7] + 'm/s' + '\
                                </p>\
                                \<p>' + dlang.typhoon_wind_direction + ':\
                                  ' + point[8] + '\
                                </p>\
                                \<p>' + dlang.typhoon_speed + ':\
                                  ' + point[9] + 'km/h' + '\
                                </p>\
                                ';

                    typhoon.description = des;
                    mainMap.typhoon.truePath.push(typhoon);
                }

                mainMap.typhoon.show = true;
            }
        },
        deleteTyphoon: function () {
            //delete the original typhoon path
            mainMap.typhoon.truePath.forEach(function (value) {
                mainMap.viewer.entities.remove(value)
            })
            //delete the prediction typhoon path
            mainMap.typhoon.prediction.forEach(function (value) {
                mainMap.viewer.entities.remove(value)
            })
        },
        loadSatellite: function () {
            //Multi Satellites
            let multiSate = new Cesium.CzmlDataSource();
            multiSate.load('./assets/czml/multiSats_Chinese.czml');
            mainMap.viewer.dataSources.add(multiSate);
        },
        initDataSource: function () {
            //para
            const scale1 = 1,
                scale2 = 0.1;
            let color = new Cesium.Color();

            //解析GeoJson中的多维坐标，对坐标进行降维，以适应cesium接口
            let polylines = [];
            let getPolyline = function (arr) {
                this.arr = arr;
                if ((typeof arr[0][0]) === 'number') {
                    let polyline = [].concat.apply([], arr);
                    polylines.push(polyline)
                } else {
                    arr.forEach(function (value) {
                        getPolyline(value)
                    })
                }
            };

            //basic layer
            let beforeWater = new Cesium.GeoJsonDataSource('beforeWater');
            let afterWater = new Cesium.GeoJsonDataSource('afterWater');
            let floodDif = new Cesium.GeoJsonDataSource('floodDif');
            let LX_G = new Cesium.GeoJsonDataSource('LX_G');
            let LX_S = new Cesium.GeoJsonDataSource('LX_S');
            let Road_Z = new Cesium.GeoJsonDataSource('Road_Z');
            let railway = new Cesium.GeoJsonDataSource('railway');
            let roadAffected = new Cesium.GeoJsonDataSource('roadAffected');
            let fx_azd = new Cesium.CustomDataSource('fx_azd');
            let fx_fzst = new Cesium.CustomDataSource('fx_fzst');
            let fx_ql = new Cesium.CustomDataSource('fx_ql');
            let fx_xx = new Cesium.CustomDataSource('fx_xx');
            let gt_bt = new Cesium.CustomDataSource('gt_bt');
            let mz_avoidancepoint = new Cesium.CustomDataSource('mz_avoidancepoint');
            let mz_Station = new Cesium.CustomDataSource('mz_Station');
            let mz_Village = new Cesium.CustomDataSource('mz_Village');
            //affected layer
            let affected_bridge = new Cesium.CustomDataSource('affected_bridge');
            let affected_school = new Cesium.CustomDataSource('affected_school');
            let affected_st = new Cesium.CustomDataSource('affected_st');
            let affected_village = new Cesium.CustomDataSource('affected_village');

            //灾前水体矢量数据
            beforeWater.load('./assets/geojson/flood/Water_preDisaster.json', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.BLUE.withAlpha(0.6),
                strokeWidth: 3
            });

            //灾后水体矢量数据
            afterWater.load('./assets/geojson/flood/Water_postDisaster.json', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.DARKORANGE.withAlpha(0.6),
                strokeWidth: 3
            });

            //洪涝范围矢量数据
            floodDif.load('./assets/geojson/flood/SubmergeArea.json', {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.RED.withAlpha(0.4),
                strokeWidth: 3
            });

            //国道
            $.getJSON('./assets/geojson/public/LX_G.json', function (result) {
                result.features.forEach(function (value) {
                    // let coor = [].concat.apply([], value.geometry.coordinates[0]);
                    getPolyline(value.geometry.coordinates);
                    polylines.forEach(function (polyline) {
                        let props = value.properties;
                        let description = '\
                                <p>\
                                  ' + props.LXMC + '\
                                </p>\
                                ';

                        LX_G.entities.add({
                            name: '国道',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray(polyline),
                                width: 3,
                                material: Cesium.Color.fromBytes(51, 141, 255, 255, color),
                            },
                            description: description
                        });
                    });

                    polylines = [];

                });
            });

            //省道
            $.getJSON('./assets/geojson/public/LX_S.json', function (result) {
                result.features.forEach(function (value) {
                    // let coor = [].concat.apply([], value.geometry.coordinates[0]);
                    getPolyline(value.geometry.coordinates);
                    polylines.forEach(function (polyline) {
                        let props = value.properties;
                        let description = '\
                                <p>\
                                  ' + props.LXMC + '\
                                </p>\
                                ';

                        LX_S.entities.add({
                            name: '省道',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray(polyline),
                                width: 2,
                                material: Cesium.Color.fromBytes(51, 227, 255, 255, color),
                            },
                            description: description
                        });
                    });

                    polylines = [];

                });
            });
            //乡道
            $.getJSON('./assets/geojson/public/Road_Z.json', function (result) {
                result.features.forEach(function (value) {
                    // let coor = [].concat.apply([], value.geometry.coordinates[0]);
                    getPolyline(value.geometry.coordinates);
                    polylines.forEach(function (polyline) {
                        let props = value.properties;
                        let description = '\
                                <p>\
                                  ' + props.LXMC + '\
                                </p>\
                                ';

                        Road_Z.entities.add({
                            name: '乡道',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray(polyline),
                                width: 1,
                                material: Cesium.Color.fromBytes(255, 181, 51, 255, color),
                            },
                            description: description
                        });
                    });

                    polylines = [];

                });
            });
            //铁路
            $.getJSON('./assets/geojson/public/railway.json', function (result) {
                result.features.forEach(function (value) {
                    // let coor = [].concat.apply([], value.geometry.coordinates[0]);
                    getPolyline(value.geometry.coordinates);
                    polylines.forEach(function (polyline) {
                        let props = value.properties;
                        let description = '\
                                <p>\
                                  ' + props.name + '\
                                </p>\
                                ';

                        railway.entities.add({
                            name: '铁路',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray(polyline),
                                width: 2,
                                material: Cesium.Color.fromBytes(212, 35, 122, 255, color),
                            },
                            description: description
                        });
                    });

                    polylines = [];

                });
            });
            //受影响道路
            $.getJSON('./assets/geojson/result/Road_affected.json', function (result) {
                result.features.forEach(function (value) {
                    // let coor = [].concat.apply([], value.geometry.coordinates[0]);
                    getPolyline(value.geometry.coordinates);
                    polylines.forEach(function (polyline) {
                        let props = value.properties;
                        let description = '\
                                <p>\
                                  ' + props.LXMC + '\
                                </p>\
                                ';

                        roadAffected.entities.add({
                            name: '受影响道路',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray(polyline),
                                width: 4,
                                material: Cesium.Color.RED.withAlpha(0.4),
                            },
                            description: description
                        });
                    })
                    polylines = [];

                });
            });

            //安置点
            $.getJSON('./assets/geojson/public/fx_azd.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    fx_azd.entities.add({
                        name: '安置点',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_relocation_site.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //房子水田
            $.getJSON('./assets/geojson/public/fx_fzst.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '时间：' + props.FTIME + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '/' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '事件：' + props.DDSCRIB + '\
                                </p>\
                                ';

                    fx_fzst.entities.add({
                        name: '房子水田',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_farm.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //桥梁
            $.getJSON('./assets/geojson/public/fx_ql.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.NAME + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    fx_ql.entities.add({
                        name: '桥梁',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/road/road_ql.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //学校
            $.getJSON('./assets/geojson/public/fx_xx.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    fx_xx.entities.add({
                        name: '学校医院',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_school.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //地灾崩塌点
            $.getJSON('./assets/geojson/public/gt_bt.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '时间：' + props.TBRQ + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '描述：' + props.WHDX + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '植被类型：' + props.ZBLX + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '调查区：' + props.DCQ + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '评级：' + props.ZHDLX + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '调查人：' + props.DCDW + '\
                                </p>\
                                ';

                    gt_bt.entities.add({
                        name: '地灾崩塌点',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_collapse.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //避难场所
            $.getJSON('./assets/geojson/public/mz_avoidancepoint.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_name + props.geo_addr + '\
                                </p>\
                                ' + '\
                                <p>\
                                 ' + '避难类型：' + props.AvoidanceT + '\
                                </p>\
                                ' + '\
                                <p>\
                                 ' + '房屋面积：' + props.FloorArea + '\
                                </p>\
                                ' + '\
                                <p>\
                                 ' + '室内面积：' + props.IndoorArea + '\
                                </p>\
                                ' + '\
                                <p>\
                                 ' + '可容纳：' + props.Population + '人' + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    mz_avoidancepoint.entities.add({
                        name: '避难场所',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_collapse.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //救助站
            $.getJSON('./assets/geojson/public/mz_Station.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_addr + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '类型：' + props.ATCUNIT + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    mz_Station.entities.add({
                        name: '救助站',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_shelter.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //村庄
            $.getJSON('./assets/geojson/public/mz_Village.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '人口：' + props.Population + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '男性：' + props.Male + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '女性：' + props.Female + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '房屋：' + props.Households + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    mz_Village.entities.add({
                        name: '村庄',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/location/location_village.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //受影响桥梁
            $.getJSON('./assets/geojson/result/affected_bridge.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.NAME + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    affected_bridge.entities.add({
                        name: '受影响桥梁',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/accident/accident_bridge.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //受影响学校
            $.getJSON('./assets/geojson/result/affected_school.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    affected_school.entities.add({
                        name: '受影响学校',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/accident/accident_school.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //受影响水田
            $.getJSON('./assets/geojson/result/affected_st.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '时间：' + props.FTIME + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '/' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '事件：' + props.DDSCRIB + '\
                                </p>\
                                ';

                    affected_st.entities.add({
                        name: '受影响水田',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/accident/accident_farm.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //受影响村庄
            $.getJSON('./assets/geojson/result/affected_village.json', function (result) {
                result.features.forEach(function (value) {
                    let coor = value.geometry.coordinates;
                    let props = value.properties;
                    let description = '\
                                <p>\
                                  ' + '名称：' + props.geo_name + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '人口：' + props.Population + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '男性：' + props.Male + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '女性：' + props.Female + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '房屋：' + props.Households + '\
                                </p>\
                                ' + '\
                                <p>\
                                  ' + '地点：' + props.b11_name + '/' + props.b12_name + '/' + props.b13_name + '\
                                </p>\
                                ';

                    affected_village.entities.add({
                        name: '受影响村庄',
                        position: Cesium.Cartesian3.fromDegrees(coor[0], coor[1]),
                        billboard: {
                            image: './assets/img/accident/accident_village.png',
                            scaleByDistance: new Cesium.NearFarScalar(1.5e2, scale1, 1.5e7, scale2),
                        },
                        description: description
                    });
                });
            });

            //修改DataSource的属性
            // let promise = affected_village.load('./assets/geojson/public/mz_Village.json', {
            //     // stroke: Cesium.Color.WHITE,
            //     // fill: Cesium.Color.RED.withAlpha(0.4),
            //     // strokeWidth: 4
            // });
            //
            // promise.then(function(dataSource) {
            //     // mainMap.viewer.dataSources.add(dataSource);
            //
            //     //Get the array of entities
            //     var entities = dataSource.entities.values;
            //
            //     var colorHash = {};
            //     for (var i = 0; i < entities.length; i++) {
            //         //For each entity, create a random color based on the state name.
            //         //Some states have multiple entities, so we store the color in a
            //         //hash so that we use the same color for the entire state.
            //         var entity = entities[i];
            //         var name = entity.name;
            //         var color = colorHash[name];
            //         if (!color) {
            //             color = Cesium.Color.fromRandom({
            //                 alpha : 1.0
            //             });
            //             colorHash[name] = color;
            //         }
            //
            //         entity.billboard = undefined;//设置billboard和point来显示一个点而不是图标
            //         // entity.point = new Cesium.PointGraphics({
            //         //     color: color,
            //         //     pixelSize: 5
            //         // });
            //
            //         let img = new Cesium.ImageMaterialProperty({
            //             // image:'./assets/img/Household Carbon Footprint.svg'
            //             image: './assets/img/school.png'
            //
            //         })
            //
            //         entity.ellipse = new Cesium.EllipseGraphics({
            //             semiMinorAxis: 10.0,
            //             semiMajorAxis: 10.0,
            //             fill: true,
            //             material: img,
            //         })
            //
            //         //Set the polygon material to our random color.
            //         // entity.polygon.material = color;
            //         //Remove the outlines.
            //         // entity.polygon.outline = false;
            //
            //         //Extrude the polygon based on the state's population.  Each entity
            //         //stores the properties for the GeoJSON feature it was created from
            //         //Since the population is a huge number, we divide by 50.
            //         // entity.polygon.extrudedHeight = entity.properties.Population / 50.0;
            //     }
            // }).otherwise(function(error){
            //     //Display any errrors encountered while loading.
            //     window.alert(error);
            // });

            mainMap.dataSource['beforeWater'] = beforeWater;
            mainMap.dataSource['afterWater'] = afterWater;
            mainMap.dataSource['floodDif'] = floodDif;
            mainMap.dataSource['LX_G'] = LX_G;
            mainMap.dataSource['LX_S'] = LX_S;
            mainMap.dataSource['Road_Z'] = Road_Z;
            mainMap.dataSource['railway'] = railway;
            mainMap.dataSource['roadAffected'] = roadAffected;
            mainMap.dataSource['fx_azd'] = fx_azd;
            mainMap.dataSource['fx_fzst'] = fx_fzst;
            mainMap.dataSource['fx_ql'] = fx_ql;
            mainMap.dataSource['fx_xx'] = fx_xx;
            mainMap.dataSource['gt_bt'] = gt_bt;
            mainMap.dataSource['mz_avoidancepoint'] = mz_avoidancepoint;
            mainMap.dataSource['mz_Station'] = mz_Station;
            mainMap.dataSource['mz_Village'] = mz_Village;
            mainMap.dataSource['affected_bridge'] = affected_bridge;
            mainMap.dataSource['affected_school'] = affected_school;
            mainMap.dataSource['affected_st'] = affected_st;
            mainMap.dataSource['affected_village'] = affected_village;
        },
        loadDataSource: function (index) {
            let dataSource = mainMap.dataSource[index];

            // let entities = dataSource.entities.values;
            // let color = new Cesium.Color;
            // let img = new Cesium.ImageMaterialProperty({
            //     image: './assets/img/school.png'
            //
            // });
            //
            // switch (index) {
            //     case 'affected_bridge':
            //         img = new Cesium.ImageMaterialProperty({
            //             image: './assets/img/school.png',
            //             transparent: true
            //         });
            //         break;
            //     case 'affected_school':
            //         img = new Cesium.ImageMaterialProperty({
            //             image: './assets/img/Household Carbon Footprint.svg',
            //             transparent: true
            //         });
            //         break;
            //     case 'affected_st':
            //         img = new Cesium.ImageMaterialProperty({
            //             image: './assets/img/school.png',
            //             transparent: true
            //         });
            //         break;
            //     case 'affected_village':
            //         img = new Cesium.ImageMaterialProperty({
            //             image: './assets/img/school.png',
            //             transparent: true
            //         });
            //         break;
            //     default:
            //         img = new Cesium.ImageMaterialProperty({
            //             image: './assets/img/school.png',
            //             transparent: true
            //         });
            // }
            // //设置图标来显示一个点而不是billboard
            // for (var i = 0; i < entities.length; i++) {
            //     var entity = entities[i];
            //     entity.billboard = undefined;
            //     entity.point = undefined;
            //     entity.ellipse = new Cesium.EllipseGraphics({
            //         semiMinorAxis: 400.0,
            //         semiMajorAxis: 400.0,
            //         fill: true,
            //         material: img,
            //     })
            //
            // }

            if (mainMap.viewer.dataSources.contains(dataSource)) {
                mainMap.viewer.dataSources.remove(dataSource)
            } else {
                mainMap.viewer.dataSources.add(dataSource)
            }
        },
        menuLoadDataSource: function (index) {
            let dataSource = mainMap.dataSource[index];
            if (!mainMap.viewer.dataSources.contains(dataSource)) {
                mainMap.clearDataSource();
                mainMap.clearImageryLayer();
                mainMap.viewer.dataSources.add(dataSource)
            } else {
                mainMap.clearDataSource();
                mainMap.clearImageryLayer();
            }

        },
        clearDataSource: function () {
            Object.keys(mainMap.dataSource).forEach(function (key) {
                mainMap.viewer.dataSources.remove(mainMap.dataSource[key]);
            })
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
        loadPreRailway: function () {
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
                destination: Cesium.Cartesian3.fromDegrees(109.761547, 19.19274, 900000),
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
        menuLoadImage: function (index) {
            let imageLayer = mainMap.imageLayers[index];
            if (mainMap.viewer.imageryLayers.contains(imageLayer)) {
                mainMap.clearImageryLayer();
                mainMap.clearDataSource();
            } else {
                mainMap.clearImageryLayer();
                mainMap.clearDataSource();
                mainMap.viewer.imageryLayers.add(imageLayer);
            }
        },
        loadImageLayer: function (index) {
            let imageLayer = mainMap.imageLayers[index];
            if (mainMap.viewer.imageryLayers.contains(imageLayer)) {
                mainMap.viewer.imageryLayers.remove(imageLayer, false);
            } else {
                mainMap.viewer.imageryLayers.add(imageLayer);
            }
        },
        clearImageryLayer: function () {
            Object.keys(mainMap.imageLayers).forEach(function (key) {
                mainMap.viewer.imageryLayers.remove(mainMap.imageLayers[key], false);
            })
        },
        loadPosRoad: function () {
            let roadAffected = mainMap.dataSource['roadAffected'];
            if (mainMap.viewer.dataSources.contains(roadAffected)) {
                mainMap.viewer.dataSources.remove(roadAffected);
            } else {
                mainMap.viewer.dataSources.add(roadAffected);
            }
        },
        leftClickHandler: function () {
            let handler = new Cesium.ScreenSpaceEventHandler(mainMap.viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var pick = mainMap.viewer.scene.pick(movement.position);
                if (Cesium.defined(pick) && (pick.id.id === 'typhoon_icon')) {
                    alert("卫星数据");
                }
                if (Cesium.defined(pick)) {
                    let id = pick.id._id;
                    if (mainMap.typhoon.hasOwnProperty(id)) {
                        // clear old points
                        mainMap.typhoon.prediction.forEach(e => {
                            mainMap.viewer.entities.remove(e);
                        });


                        let points = [];
                        // get current point
                        let point = mainMap.viewer.entities.getById(id);
                        points.push(point.x);
                        points.push(point.y);

                        let color = new Cesium.Color;
                        Cesium.Color.fromBytes(126, 255, 51, 100, color);

                        // draw the range of the point
                        let range = mainMap.viewer.entities.add({
                            // id: point[0],
                            position: Cesium.Cartesian3.fromDegrees(point.x, point.y),
                            name: "范围",
                            ellipse: {
                                height: 0,
                                semiMinorAxis: 100000.0,
                                semiMajorAxis: 100000.0,
                                fill: true,
                                material: color,
                                outline: true,
                                // outlineColor:,
                                outlineWidth: 2000
                            }
                        });
                        mainMap.typhoon.prediction.push(range);

                        //load new points
                        if (mainMap.typhoon[id][11] !== null) {
                            Cesium.Color.fromBytes(51, 126, 255, 255, color);
                            // draw the prediction points
                            mainMap.typhoon[id][11].BABJ.forEach(moment => {
                                let imageMaterial = new Cesium.ImageMaterialProperty({
                                    image: './img/map/Typhoon.png',
                                    transparent: true
                                });

                                // set positions aims to draw path
                                points.push(moment[2]);
                                points.push(moment[3]);

                                let typhoon = mainMap.viewer.entities.add({
                                    // id: moment[0],
                                    position: Cesium.Cartesian3.fromDegrees(moment[2], moment[3]),
                                    name: dlang.typhoon_forecast,
                                    ellipse: {
                                        semiMinorAxis: 4000.0,
                                        semiMajorAxis: 4000.0,
                                        fill: true,
                                        material: color,
                                    }
                                });

                                mainMap.typhoon.prediction.push(typhoon);
                            });

                            //draw the path of typhoon
                            let polyline = mainMap.viewer.entities.add({
                                // id: point[0],
                                name: dlang.typhoon_path,
                                polyline: {
                                    positions: Cesium.Cartesian3.fromDegreesArray(points),
                                    width: 1.5,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: color
                                    }),
                                }
                            });
                            mainMap.typhoon.prediction.push(polyline);
                        }

                    }
                }


            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        loadEntity: function () {
            // mainMap.viewer.entities.add({
            //     id: 'id',
            //     position: Cesium.Cartesian3.fromDegrees(103.0, 40.0),
            //     name: 'Red ellipse on surface with outline',
            //     ellipse: {
            //         semiMinorAxis: 250000.0,
            //         semiMajorAxis: 400000.0,
            //         height: 200000.0,
            //         extrudedHeight: 400000.0,
            //         fill: true,
            //         material: Cesium.Color.RED.withAlpha(0.5),
            //         outline: true, //必须设置height，否则ouline无法显示
            //         outlineColor: Cesium.Color.BLUE.withAlpha(0.5),
            //         outlineWidth: 10.0//windows系统下不能设置固定为1
            //     }
            //
            // });
            //
            // // 1. Draw a translucent ellipse on the surface with a checkerboard pattern
            // var instance = new Cesium.GeometryInstance({
            //     geometry: new Cesium.EllipseGeometry({
            //         center: Cesium.Cartesian3.fromDegrees(-100.0, 20.0),
            //         semiMinorAxis: 500000.0,
            //         semiMajorAxis: 1000000.0,
            //         rotation: Cesium.Math.PI_OVER_FOUR,
            //         vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
            //     }),
            //     id: 'object returned when this instance is picked and to get/set per-instance attributes'
            // });
            // mainMap.scene.primitives.add(new Cesium.Primitive({
            //     geometryInstances: instance,
            //     appearance: new Cesium.EllipsoidSurfaceAppearance({
            //         material: Cesium.Material.fromType('Checkerboard')
            //     })
            // }));

            // mainMap.viewer.entities.add({
            //     position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            //     billboard : {
            //         image : './assets/flood/afterWater.png' , // default: undefined
            //         // show : true, // default
            //         // pixelOffset : new Cesium.Cartesian2(0, -50), // default: (0, 0)
            //         // eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
            //         // horizontalOrigin : Cesium.HorizontalOrigin.CENTER, // default
            //         // verticalOrigin : Cesium.VerticalOrigin.BOTTOM, // default: CENTER
            //         // scale : 2.0, // default: 1.0
            //         // color : Cesium.Color.LIME, // default: WHITE
            //         // rotation : Cesium.Math.PI_OVER_FOUR, // default: 0.0
            //         // alignedAxis : Cesium.Cartesian3.ZERO, // default
            //         width : 25, // default: undefined
            //         height : 25 // default: undefined
            //     }
            // });

            let wyoming = mainMap.viewer.entities.add({
                id: 'billboard',
                position: Cesium.Rectangle.fromDegrees(-75.59777, 40.03883, -75.49777, 40.13883),
                // rectangle: Cesium.Rectangle.fromDegrees(108.91, 18.85, 109.10, 19.05),
                billboard: {
                    id: 'billboard',
                    image: './assets/flood/afterWater.png',
                    scale: 0.02,
                    // position: Cesium.Rectangle.fromDegrees(-75.59777, 40.03883,-75.49777,40.13883),
                    // width: 200, // default: undefined
                    // height: 200 // default: undefined
                }
            });

            // var wyoming = mainMap.viewer.entities.add({
            //     name : 'Wyoming',
            //     polygon : {
            //         hierarchy : Cesium.Cartesian3.fromDegreesArray([
            //             -109.080842,45.002073,
            //             -105.91517,45.002073,
            //             -104.058488,44.996596,
            //             -104.053011,43.002989,
            //             -104.053011,41.003906,
            //             -105.728954,40.998429,
            //             -107.919731,41.003906,
            //             -109.04798,40.998429,
            //             -111.047063,40.998429,
            //             -111.047063,42.000709,
            //             -111.047063,44.476286,
            //             -111.05254,45.002073]),
            //         height : 0,
            //         material : Cesium.Color.RED.withAlpha(0.5),
            //         outline : true,
            //         outlineColor : Cesium.Color.BLACK
            //     },
            //     description:'divID'//方法一
            // });


            wyoming.description = '\
                                <img\
                                  width="50%"\
                                  style="float:left; margin: 0 1em 1em 0;"\
                                  src="//cesiumjs.org/images/2015/02-02/Flag_of_Wyoming.svg"/>\
                                <p>\
                                  Wyoming is a state in the mountain region of the Western \
                                  United States.\
                                </p>\
                                <p>\
                                  Wyoming is the 10th most extensive, but the least populous \
                                  and the second least densely populated of the 50 United \
                                  States. The western two thirds of the state is covered mostly \
                                  with the mountain ranges and rangelands in the foothills of \
                                  the eastern Rocky Mountains, while the eastern third of the \
                                  state is high elevation prairie known as the High Plains. \
                                  Cheyenne is the capital and the most populous city in Wyoming, \
                                  with a population estimate of 62,448 in 2013.\
                                </p>\
                                <p>\
                                  Source: \
                                  <a style="color: WHITE"\
                                    target="_blank"\
                                    href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
                                </p>';


        }


    };
})();