/**
 * Cesium Controller
 */
class CesiumController {
    /**
     * 构造函数，单例模式
     * @returns {CesiumController|*}
     */
    constructor() {
        if (!CesiumController.instance) {
            this.viewer = new Cesium.Viewer('cesiumContainer', {
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
                scene3DOnly: true,
                selectionIndicator: false,
                vrButton: true,
                shadows: true,
                imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=73b60501dff8cd656dfcea1d9cbef774",
                    layer: "tdtBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                })
            });
            CesiumController.instance = this;
        }
        return CesiumController.instance
    }

    // 获取实例(单例)
    static getInstance() {
        if (!this.instance) {
            this.instance = new CesiumController();
        }
        return this.instance;
    }




    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
}