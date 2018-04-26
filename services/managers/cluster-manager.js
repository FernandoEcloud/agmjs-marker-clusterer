import { MarkerClustererPlus } from './clusterplus/clusterplus'

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable, NgZone } from '@angular/core';
import 'js-marker-clusterer';
import { MarkerManager } from '../../../core/services/managers/marker-manager';
import { GoogleMapsAPIWrapper } from '../../../core/services/google-maps-api-wrapper';

var ClusterManager = (function (_super) {
    __extends(ClusterManager, _super);
    function ClusterManager(_mapsWrapper, _zone) {
        var _this = _super.call(this, _mapsWrapper, _zone) || this;
        _this._mapsWrapper = _mapsWrapper;
        _this._zone = _zone;
        _this._clustererInstance = new Promise(function (resolver) {
            _this._resolver = resolver;
        });
        return _this;
    }
    ClusterManager.prototype.init = function (options) {
        var _this = this;
        this._mapsWrapper.getNativeMap().then(function (map) {
            var clusterer = new MarkerClusterer(map, [], options);

            clusterer.setCalculator((markers, count) => {
                if( markers.length > 1){
                    let index = 0;
                    let sum = 0;
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i]) {
                            sum += parseFloat(markers[i].priceFrom);
                        }
                    }
                    let dv = markers.length;
                    dv = sum / dv;
                    dv = Math.round(dv * 100) / 100;
                    const padding_left = markers.length > 9 ? 25 : 32;
                    return {
                        text: "<small style='color:#f96363;font-size:11px;text-align:center'>\xa0\ <b>u$s"+ dv +"m²</b> </small>\x0D\ <span style='padding-left:25px;padding-top:2px;font-size:22px'>32</span> <small style='font-size:14px;padding-left:6px'>Proyectos</small>",
                        index: index
                    }
                }
                
            });
            _this._resolver(clusterer);
        });
    };
    ClusterManager.prototype.addMarker = function (marker) {
        var clusterPromise = this._clustererInstance;
        var markerPromise = this._mapsWrapper
            .createMarker({
            position: {
                lat: marker.latitude,
                lng: marker.longitude
            },
            label: marker.label,
            draggable: marker.draggable,
            icon: marker.iconUrl,
            opacity: marker.opacity,
            visible: marker.visible,
            zIndex: marker.zIndex,
            title: marker.title,
            clickable: marker.clickable,
            priceFrom: marker.priceFrom,
            labelContent: marker.labelContent,
            labelAnchor: marker.labelAnchor,
            labelClass: marker.labelClass, // the CSS class for the label
            labelInBackground: marker.labelInBackground,
            labelStyle: marker.labelStyle
            
        }, false);
        Promise
            .all([clusterPromise, markerPromise])
            .then(function (_a) {
            var cluster = _a[0], marker = _a[1];
            return cluster.addMarker(marker);
        });
        this._markers.set(marker, markerPromise);
    };
    ClusterManager.prototype.deleteMarker = function (marker) {
        var _this = this;
        var m = this._markers.get(marker);
        if (m == null) {
            // marker already deleted
            return Promise.resolve();
        }
        return m.then(function (m) {
            _this._zone.run(function () {
                _this._clustererInstance.then(function (cluster) {
                    cluster.removeMarker(m);
                    _this._markers.delete(marker);
                });
            });
        });
    };
    ClusterManager.prototype.clearMarkers = function () {
        return this._clustererInstance.then(function (cluster) {
            cluster.clearMarkers();
        });
    };
    ClusterManager.prototype.setGridSize = function (c) {
        this._clustererInstance.then(function (cluster) {
            cluster.setGridSize(c.gridSize);
        });
    };
    ClusterManager.prototype.setMaxZoom = function (c) {
        this._clustererInstance.then(function (cluster) {
            cluster.setMaxZoom(c.maxZoom);
        });
    };
    ClusterManager.prototype.setStyles = function (c) {
        this._clustererInstance.then(function (cluster) {
            cluster.setStyles(c.styles);
        });
    };
    ClusterManager.prototype.setZoomOnClick = function (c) {
        this._clustererInstance.then(function (cluster) {
            if (c.zoomOnClick !== undefined) {
                cluster.zoomOnClick_ = c.zoomOnClick;
            }
        });
    };
    ClusterManager.prototype.setAverageCenter = function (c) {
        this._clustererInstance.then(function (cluster) {
            if (c.averageCenter !== undefined) {
                cluster.averageCenter_ = c.averageCenter;
            }
        });
    };
    ClusterManager.prototype.setImagePath = function (c) {
        this._clustererInstance.then(function (cluster) {
            if (c.imagePath !== undefined) {
                cluster.imagePath_ = c.imagePath;
            }
        });
    };
    ClusterManager.prototype.setMinimumClusterSize = function (c) {
        this._clustererInstance.then(function (cluster) {
            if (c.minimumClusterSize !== undefined) {
                cluster.minimumClusterSize_ = c.minimumClusterSize;
            }
        });
    };
    ClusterManager.prototype.setImageExtension = function (c) {
        this._clustererInstance.then(function (cluster) {
            if (c.imageExtension !== undefined) {
                cluster.imageExtension_ = c.imageExtension;
            }
        });
    };
    return ClusterManager;
}(MarkerManager));
export { ClusterManager };
ClusterManager.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ClusterManager.ctorParameters = function () { return [
    { type: GoogleMapsAPIWrapper, },
    { type: NgZone, },
]; };
//# sourceMappingURL=cluster-manager.js.map