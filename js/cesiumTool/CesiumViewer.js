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
        typhoon: {//包含多个DataSource，同时会在运行中添加真实路径对象的键值对
            show: false,
            originPoint: new Cesium.CustomDataSource('originPoint'),
            originLine: new Cesium.CustomDataSource('originLine'),
            range: new Cesium.CustomDataSource('range'),
            forecastPoint: new Cesium.CustomDataSource('forecastPoint'),
            forecastLine: new Cesium.CustomDataSource('forecastLine'),
            rangeArr: new Array(),
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
                    }
                }
            })
        },
        loadTyphoonLayer: function () {
            //Judge whether show the typhoon
            if (mainMap.typhoon.show) {
                mainMap.deleteTyphoon();
                mainMap.typhoon.show = false;
            } else {
                //Add entities of point and polyline to dataSource
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
                        mainMap.typhoon[moment[0]] = moment;//save point details to global variable
                        points.push(moment[4], moment[5]); //save true locations
                    });

                    //draw the true path of typhoon
                    let polyline = mainMap.typhoon.originLine.entities.add({
                        // id: point[0],
                        name: '台风路径',
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray(points),
                            width: 1.5,
                            // clampToGround:true,
                            material: color,
                            height: 2
                        }
                    });
                });

                /**
                 * Draw typhoon icon by two points
                 * @param name
                 * @param description
                 * @param point
                 */
                function drawIconTyp(name, description, point) {
                    let typhoon = mainMap.typhoon.originPoint.entities.add({
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
                            height: 5
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
                                  ' + point[8].replace(/E/g, "东").replace(/S/g, "南").replace(/W/g, "西").replace(/N/g, "北") + '\
                                </p>\
                                \<p>' + dlang.typhoon_speed + ':\
                                  ' + point[9] + 'km/h' + '\
                                </p>\
                                ';
                    if (point[10].length > 0) {
                        des += '\<p>' + dlang.typhoon_radius + ':\
                            ' + 'NE:' + point[10][0][1] + 'km' + '&nbsp;&nbsp;SE:' + point[10][0][2] + 'km' + '&nbsp;&nbsp;WS:' + point[10][0][3] + 'km' + '&nbsp;&nbsp;NW:' + point[10][0][4] + 'km' + '\
                        </p>\
                        ' + '\<p>' + dlang.typhoon_affect_area + ':\
                            ' + '正在计算' + 'km<sup>2</sup>' + '\
                        </p>\
                        ' + '\<p>' + dlang.typhoon_affect_pop + ':\
                            ' + '正在计算' + '万人' + '\
                        </p>\
                        ';
                    }

                    typhoon.description = des;
                }

                //Add dataSource to the dataSource collection of viewer, meanwhile adjust level of these dataSource of typhoon
                let dataSources = mainMap.viewer.dataSources;
                let typhoon = mainMap.typhoon;
                dataSources.add(typhoon.originPoint);
                dataSources.add(typhoon.forecastPoint);
                dataSources.add(typhoon.range);
                dataSources.add(typhoon.originLine);
                dataSources.add(typhoon.forecastLine);

                mainMap.typhoon.show = true;
            }
        },
        loadTyphoonArea: function (id) {
            //Judge whether has this original point
            if (mainMap.typhoon.originPoint.entities.getById(id)) {
                // clear old points, polyline and range
                mainMap.typhoon.forecastPoint.entities.removeAll();
                mainMap.typhoon.forecastLine.entities.removeAll();
                mainMap.typhoon.range.entities.removeAll();

                let points = [];
                // get current point
                let point = mainMap.typhoon.originPoint.entities.getById(id);
                points.push(point.x);
                points.push(point.y);

                let color = new Cesium.Color;
                Cesium.Color.fromBytes(126, 255, 51, 100, color);

                /**
                 * draw the range of the point
                 * @param lon
                 * @param lat
                 * @param radius
                 * @param degree1
                 * @param degree2
                 * @returns {Array}
                 */
                function computeCirclularFlight(lon, lat, radius, degree1, degree2) {
                    let Ea = 6378137;      //   赤道半径
                    let Eb = 6356725;      // 极半径
                    let positionArr = [];
                    positionArr.push(lon);
                    positionArr.push(lat);
                    //需求正北是0° cesium正东是0°
                    for (let i = degree1; i <= degree2; i++) {
                        let dx = radius * Math.sin(i * Math.PI / 180.0);
                        let dy = radius * Math.cos(i * Math.PI / 180.0);

                        let ec = Eb + (Ea - Eb) * (90.0 - lat) / 90.0;
                        let ed = ec * Math.cos(lat * Math.PI / 180);

                        let BJD = lon + (dx / ed) * 180.0 / Math.PI;
                        let BWD = lat + (dy / ec) * 180.0 / Math.PI;

                        positionArr.push(BJD);
                        positionArr.push(BWD);
                    }
                    return positionArr;
                }

                if (mainMap.typhoon[id][10].length > 0) {
                    let widths = mainMap.typhoon[id][10][0];
                    var speedNE = widths[1];
                    var speedSE = widths[2];
                    var speedSW = widths[3];
                    var speedNW = widths[4];

                    let positionArrNE = computeCirclularFlight(point.x, point.y, speedNE * 1000, 0, 90);
                    let positionArrSE = computeCirclularFlight(point.x, point.y, speedSE * 1000, 90, 180);
                    let positionArrSW = computeCirclularFlight(point.x, point.y, speedSW * 1000, 180, 270);
                    let positionArrNW = computeCirclularFlight(point.x, point.y, speedNW * 1000, 270, 360);

                    //adjust coordinates from cesium to geoJson style and save it.
                    mainMap.typhoon.rangeArr = [];
                    let rangeArr = mainMap.typhoon.rangeArr;
                    let NEGeoJson = [];
                    let SEGeoJson = [];
                    let SWGeoJson = [];
                    let NWGeoJson = [];
                    let temp = [];
                    positionArrNE.forEach(function (value, index, array) {
                        if (index % 2) {
                            temp.push(value);
                            NEGeoJson.push(temp);
                            temp = [];
                        } else {
                            temp.push(value)
                        }
                    });
                    positionArrSE.forEach(function (value, index, array) {
                        if (index % 2) {
                            temp.push(value);
                            SEGeoJson.push(temp);
                            temp = [];
                        } else {
                            temp.push(value)
                        }
                    });
                    positionArrSW.forEach(function (value, index, array) {
                        if (index % 2) {
                            temp.push(value);
                            SWGeoJson.push(temp);
                            temp = [];
                        } else {
                            temp.push(value)
                        }
                    });
                    positionArrNW.forEach(function (value, index, array) {
                        if (index % 2) {
                            temp.push(value);
                            NWGeoJson.push(temp);
                            temp = [];
                        } else {
                            temp.push(value)
                        }
                    });
                    rangeArr.push(NEGeoJson, SEGeoJson, SWGeoJson, NWGeoJson);

                    let rangeNE = mainMap.typhoon.range.entities.add({
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                                positionArrNE
                            )),
                            height: 3,
                            // extrudedHeight : 1000.0,
                            outline: true,
                            outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
                            outlineWidth: 100,
                            material: color
                        }
                    });
                    let rangeSE = mainMap.typhoon.range.entities.add({
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                                positionArrSE
                            )),
                            height: 3,
                            // extrudedHeight : 1000.0,
                            outline: true,
                            outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
                            outlineWidth: 1,
                            material: color
                        }
                    });
                    let rangeSW = mainMap.typhoon.range.entities.add({
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                                positionArrSW
                            )),
                            height: 3,
                            // extrudedHeight : 1000.0,
                            outline: true,
                            outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
                            outlineWidth: 1,
                            material: color
                        }
                    });
                    let rangeNW = mainMap.typhoon.range.entities.add({
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                                positionArrNW
                            )),
                            height: 3,
                            // extrudedHeight : 1000.0,
                            outline: true,
                            outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
                            outlineWidth: 1,
                            material: color
                        }
                    });
                }

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

                        let typhoon = mainMap.typhoon.forecastPoint.entities.add({
                            // id: moment[0],
                            position: Cesium.Cartesian3.fromDegrees(moment[2], moment[3]),
                            name: dlang.typhoon_forecast,
                            ellipse: {
                                semiMinorAxis: 4000.0,
                                semiMajorAxis: 4000.0,
                                fill: true,
                                material: color,
                                height: 4
                            }
                        });
                    });

                    //draw the path of typhoon
                    let polyline = mainMap.typhoon.forecastLine.entities.add({
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
                }

            }
        },
        deleteTyphoon: function () {
            //delete the original typhoon path
            mainMap.typhoon.originPoint.entities.removeAll();
            mainMap.typhoon.originLine.entities.removeAll();
            mainMap.typhoon.range.entities.removeAll();
            mainMap.typhoon.forecastPoint.entities.removeAll();
            mainMap.typhoon.forecastLine.entities.removeAll();
        },
        getAffectedAreaInfo: function (id) {
            //Judge whether this point has range property
            let typhoon = mainMap.typhoon;
            let entity = typhoon.originPoint.entities.getById(id);

            if (typhoon.rangeArr.length !== 0) {
                console.log(typhoon.rangeArr)
                var featureCollection = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": typhoon.rangeArr,
                            },
                            "properties": null
                        }
                    ]
                };

                console.log(featureCollection)
                var wpsService = new WpsService({
                    url: "http://202.114.118.87:8080/wps10/WebProcessingService",
                    version: "1.0.0"
                });
                // inputs
                var inputGenerator = new InputGenerator();
                var referenceInput = inputGenerator.createComplexDataInput_wps_1_0_and_2_0(
                    "TiffLoad",
                    "application/geotiff",
                    null,
                    null,
                    true,
                    "http://202.114.118.87:8080/wps10/datas/hainan.tif"
                );
                var literalInput = inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(
                    "GeoJson",
                    "xs:string",
                    null,
                    JSON.stringify(featureCollection)
                );

                var inputs = [referenceInput, literalInput];
                var outputGenerator = new OutputGenerator();
                var complexOutput = outputGenerator.createLiteralOutput_WPS_1_0("OutputData", false);
                var outputs = [complexOutput];
                wpsService.execute(
                    function (wpsResponse) {
                        if (wpsResponse.executeResponse.responseDocument.outputs[0] != null) {
                            var result = wpsResponse.executeResponse.responseDocument.outputs[0].data.literalData.value.split(",");
                            var populatiaon = result[0];
                            var area = result[1];
                            console.log("population:" + populatiaon);
                            console.log("area:" + area)
                            let value = entity.description._value;
                            let i = 1
                            entity.description._value = value.replace(/正在计算/g, function () {
                                switch (i) {
                                    case 1:
                                        i++;
                                        return area;
                                    case 2:
                                        i++;
                                        return populatiaon;
                                }
                            })
                        } else {
                            // $("#infwin-pop").text("0.00");
                            // $("#infwin-area").text("0.00");
                        }
                    },
                    "PNumberProcess",
                    "document",
                    "sync",
                    false,
                    inputs,
                    outputs
                );

            }
        },
        planEvacuation: function () {
            // 读取数据
            var start_long = [];
            var start_lat = [];
            var end_long = [];
            var end_lat = [];
            var shusan_dian = [];
            var shusan_ronliang = [];
            for (var i = 0; i < mainMap.typhoon.rangeArr[0].length; i++) {
                start_long.push(typhoonMap.geom_evacuationPoints[i].getFirstCoordinate().x);
                start_lat.push(typhoonMap.geom_evacuationPoints[i].getFirstCoordinate().y);
                shusan_dian.push(typhoonMap.geom_evacuationPoints[i].properties.people_num);
            }
            for (var j = 0; j < typhoonMap.geom_sheltersFree.length; j++) {
                end_long.push(typhoonMap.geom_sheltersFree[j].getFirstCoordinate().x);
                end_lat.push(typhoonMap.geom_sheltersFree[j].getFirstCoordinate().y);
                shusan_ronliang.push(typhoonMap.geom_sheltersFree[j].properties.people_num);
            }
            var inputData = {
                "start_long": start_long,
                "start_lat": start_lat,
                "end_long": end_long,
                "end_lat": end_lat,
                "shusan_dian": shusan_dian,
                "shusan_rongliang": shusan_ronliang
            };
            // 发起WPS请求
            var wpsService = new WpsService({
                url: "http://202.114.118.87:8080/wps10/WebProcessingService",
                version: "1.0.0"
            });
            // inputs
            var inputGenerator = new InputGenerator();
            var literalInput = inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(
                "JsonData",
                "xs:string",
                null,
                JSON.stringify(inputData)
            );
            var inputs = [literalInput];
            var outputGenerator = new OutputGenerator();
            var literalOutput = outputGenerator.createLiteralOutput_WPS_1_0("OutputData", false);
            var outputs = [literalOutput];
            wpsService.execute(
                function (wpsResponse) {
                    if (wpsResponse.executeResponse != null &&
                        wpsResponse.executeResponse.responseDocument.outputs[0] != null &&
                        wpsResponse.executeResponse.responseDocument.outputs[0].data.literalData.value.length > 0) {
                        var result = JSON.parse(
                            wpsResponse.executeResponse.responseDocument.outputs[0].data.literalData.value
                        );
                        // 显示路径图层
                        typhoonMap.evacutionPathPeople = [];
                        result.shusan_renshu.var.map(function (lines, idx) {
                            for (var i = 0; i < lines.length; i++) {
                                if (lines[i] >= 1.0) {
                                    typhoonMap.evacutionPathPeople.push(lines[i]);
                                }
                            }
                        });
                        typhoonMap.evacutionPathCost = [];
                        result.shusan_dis_time.distance.map(function (num, idx) {
                            typhoonMap.evacutionPathCost.push(
                                [num, result.shusan_dis_time.duration[idx]])
                        });
                        var pathData = [].concat.apply([], result.path.map(function (lines, idx) {
                            var points = [];
                            for (var i = 0; i < lines.length; i++) {
                                var linePoints = lines[i].split(";");
                                var j = 1;
                                if (i < 1) {
                                    j = 0;
                                }
                                for (j; j < linePoints.length; j++) {
                                    var point = linePoints[j].split(",");
                                    points.push([parseFloat(point[0]), parseFloat(point[1])]);
                                }
                            }
                            return {
                                coords: points
                            };
                        }));
                        var option = {
                            series: [{
                                type: 'lines',
                                coordinateSystem: 'bmap',
                                polyline: true,
                                data: pathData,
                                silent: false,
                                lineStyle: {
                                    normal: {
                                        color: '#fff',
                                        opacity: 0.8,
                                        width: 4
                                    }
                                },
                                emphasis: {
                                    lineStyle: {
                                        color: '#fff',
                                        opacity: 1.0,
                                        width: 5
                                    }
                                },
                                progressiveThreshold: 500,
                                progressive: 200
                            }]
                        };
                        typhoonMap.removeEvacutionLayer();
                        typhoonMap.layer_evacuationPath = new maptalks.E3Layer('疏散规划路径图层', option)
                            .addTo(typhoonMap.map);
                        typhoonMap.layer_evacuationPath.getEChartsInstance().on('click', function (params) {
                            var info = "此路径疏散人数：" + typhoonMap.evacutionPathPeople[params.dataIndex] + "\n" +
                                "此路径长度（米）：" + typhoonMap.evacutionPathCost[params.dataIndex][0] + "\n" +
                                "此路径耗时（秒）：" + typhoonMap.evacutionPathCost[params.dataIndex][1];
                            alert(info);
                        });
                        typhoonMap.loadEvacuationPointsLayer();
                        typhoonWin.process.loadProcess("人员疏散规划计算成功！");
                    }
                },
                "ShuSanProcess",
                "document",
                "sync",
                false,
                inputs,
                outputs
            );
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
                    mainMap.loadTyphoonArea(id);
                    mainMap.getAffectedAreaInfo(id);
                }


            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        loadEntity: function () {

        },


    };
})();