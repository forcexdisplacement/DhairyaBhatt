// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
require({
    cache: {
        "esri/widgets/Legend/LegendViewModel": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/Accessor ../../core/Collection ../../intl/locale ../../intl ../../core/Handles ../../core/watchUtils ./support/ActiveLayerInfo".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x, L, Q) {
                    const C = D.ofType(Q),
                        S = "esri.layers.BuildingSceneLayer esri.layers.CSVLayer esri.layers.FeatureLayer esri.layers.GeoJSONLayer esri.layers.GeoRSSLayer esri.layers.GroupLayer esri.layers.HeatmapLayer esri.layers.ImageryLayer esri.layers.ImageryTileLayer esri.layers.MapImageLayer esri.layers.OGCFeatureLayer esri.layers.PointCloudLayer esri.layers.StreamLayer esri.layers.SceneLayer esri.layers.TileLayer esri.layers.WMSLayer esri.layers.WMTSLayer esri.layers.WCSLayer".split(" "),
                        H = ["view.basemapView.baseLayerViews", "view.groundView.layerViews", "view.layerViews", "view.basemapView.referenceLayerViews"];
                    A = function(U) {
                        function V(c) {
                            c = U.call(this, c) || this;
                            c._handles = new x;
                            c._layerViewByLayerId = {};
                            c._layerInfosByLayerViewId = {};
                            c._activeLayerInfosByLayerViewId = {};
                            c._activeLayerInfosWithNoParent = new D;
                            c.activeLayerInfos = new C;
                            c.basemapLegendVisible = !1;
                            c.groundLegendVisible = !1;
                            c.keepCacheOnDestroy = !1;
                            c.respectLayerVisibility = !0;
                            c.layerInfos = [];
                            c.view = null;
                            return c
                        }
                        E._inheritsLoose(V,
                            U);
                        var d = V.prototype;
                        d.initialize = function() {
                            this._handles.add(L.init(this, "view", this._viewHandles), "view");
                            this._handles.add(I.onLocaleChange(() => this._refresh()))
                        };
                        d.destroy = function() {
                            this._destroyViewActiveLayerInfos();
                            this._handles.destroy();
                            this.view = this._handles = null
                        };
                        d._viewHandles = function() {
                            this._handles.remove("state");
                            this.view && this._handles.add(L.init(this, "state", this._stateHandles), "state")
                        };
                        d._stateHandles = function() {
                            this._resetAll();
                            "ready" === this.state && this._watchPropertiesAndAllLayerViews()
                        };
                        d._resetAll = function() {
                            this._handles.remove(["all-layer-views", "legend-properties"]);
                            this._destroyViewActiveLayerInfos();
                            this.activeLayerInfos.removeAll()
                        };
                        d._destroyViewActiveLayerInfos = function() {
                            Object.keys(this._activeLayerInfosByLayerViewId).forEach(this._destroyViewActiveLayerInfo, this)
                        };
                        d._destroyViewActiveLayerInfo = function(c) {
                            this._handles.remove(c);
                            const n = this._activeLayerInfosByLayerViewId[c];
                            delete this._activeLayerInfosByLayerViewId[c];
                            n && n.parent && n.parent.children.remove(n)
                        };
                        d._watchPropertiesAndAllLayerViews =
                            function() {
                                const {
                                    allLayerViews: c
                                } = this.view;
                                c.length && this._refresh();
                                this._handles.add(c.on("change", this._allLayerViewsChangeHandle.bind(this)), "all-layer-views");
                                this._handles.add(L.watch(this, "layerInfos, basemapLegendVisible, groundLegendVisible", this._propertiesChangeHandle.bind(this)), "legend-properties")
                            };
                        d._allLayerViewsChangeHandle = function(c) {
                            c.removed.forEach(n => this._destroyViewActiveLayerInfo(n.uid));
                            this._refresh()
                        };
                        d._propertiesChangeHandle = function() {
                            this._destroyViewActiveLayerInfos();
                            this._refresh()
                        };
                        d._refresh = function() {
                            this._layerInfosByLayerViewId = {};
                            this.activeLayerInfos.removeAll();
                            this._generateLayerViews().filter(this._filterLayerViewsByLayerInfos, this).filter(this._isLayerViewSupported, this).forEach(this._generateActiveLayerInfo, this);
                            this._sortActiveLayerInfos(this.activeLayerInfos)
                        };
                        d._sortActiveLayerInfos = function(c) {
                            if (!(2 > c.length)) {
                                var n = [];
                                c.forEach(F => {
                                    if (!F.parent) {
                                        var h = F.layer.parent;
                                        (h = (h = h && "uid" in h && this._layerViewByLayerId[h.uid]) && this._activeLayerInfosByLayerViewId[h.uid]) &&
                                        -1 !== c.indexOf(h) && (n.push(F), F.parent = h, h.children.add(F), this._sortActiveLayerInfos(h.children))
                                    }
                                });
                                c.removeMany(n);
                                var u = {};
                                this.view.allLayerViews.forEach((F, h) => u[F.layer.uid] = h);
                                c.sort((F, h) => (u[h.layer.uid] || 0) - (u[F.layer.uid] || 0))
                            }
                        };
                        d._generateLayerViews = function() {
                            const c = [];
                            H.filter(this._filterLayerViews, this).map(this.get, this).filter(n => null != n).forEach(this._collectLayerViews("layerViews", c));
                            return c
                        };
                        d._filterLayerViews = function(c) {
                            const n = !this.groundLegendVisible && "view.groundView.layerViews" ===
                                c;
                            return !(!this.basemapLegendVisible && ("view.basemapView.baseLayerViews" === c || "view.basemapView.referenceLayerViews" === c)) && !n
                        };
                        d._collectLayerViews = function(c, n) {
                            const u = F => {
                                F && F.forEach(h => {
                                    n.push(h);
                                    u(h[c])
                                });
                                return n
                            };
                            return u
                        };
                        d._filterLayerViewsByLayerInfos = function(c) {
                            const n = this.layerInfos;
                            return n && n.length ? n.some(u => this._hasLayerInfo(u, c)) : !0
                        };
                        d._hasLayerInfo = function(c, n) {
                            const u = this._isLayerUIDMatching(c.layer, n.layer.uid);
                            u && (this._layerInfosByLayerViewId[n.uid] = c);
                            return u
                        };
                        d._isLayerUIDMatching =
                            function(c, n) {
                                return c && (c.uid === n || this._hasLayerUID(c.layers, n))
                            };
                        d._hasLayerUID = function(c, n) {
                            return c && c.some(u => this._isLayerUIDMatching(u, n))
                        };
                        d._isLayerViewSupported = function(c) {
                            return -1 < S.indexOf(c.layer.declaredClass) ? (this._layerViewByLayerId[c.layer.uid] = c, !0) : !1
                        };
                        d._generateActiveLayerInfo = function(c) {
                            this._isLayerActive(c) ? this._buildActiveLayerInfo(c) : (this._handles.remove(c.uid), this._handles.add(L.watch(c, "legendEnabled, layer.legendEnabled", () => this._layerActiveHandle(c)), c.uid))
                        };
                        d._layerActiveHandle = function(c) {
                            this._isLayerActive(c) && (this._handles.remove(c.uid), this._buildActiveLayerInfo(c))
                        };
                        d._isLayerActive = function(c) {
                            return this.respectLayerVisibility ? c.legendEnabled && c.get("layer.legendEnabled") : !0
                        };
                        d._buildActiveLayerInfo = function(c) {
                            var n, u = c.layer;
                            const F = c.uid;
                            var h = this._layerInfosByLayerViewId[F];
                            let w = this._activeLayerInfosByLayerViewId[F];
                            w || (w = new Q({
                                layer: u,
                                layerView: c,
                                title: h && void 0 !== h.title && h.layer.uid === u.uid ? h.title : u.title,
                                view: this.view,
                                respectLayerVisibility: this.respectLayerVisibility,
                                keepCacheOnDestroy: this.keepCacheOnDestroy,
                                sublayerIds: h && h.sublayerIds || []
                            }), this._activeLayerInfosByLayerViewId[F] = w);
                            h = u.parent && "uid" in u.parent && this._layerViewByLayerId[null == (n = u.parent) ? void 0 : n.uid];
                            w.parent = this._activeLayerInfosByLayerViewId[null == h ? void 0 : h.uid];
                            if (!this._handles.has(F)) {
                                n = L.watch(u, "title", l => this._titleHandle(l, w));
                                h = L.watch(u, "renderer?, opacity, pointSymbol?, lineSymbol?, polygonSymbol?", () => this._constructLegendElements(w));
                                const q = L.whenTrue(this.view, "stationary",
                                        () => this._scaleHandle(w)),
                                    y = L.watch(c, "_effectiveRenderer", () => this._constructLegendElements(w));
                                n = [n, h, q, y];
                                this.respectLayerVisibility && (c = L.watch(c, "legendEnabled", l => this._legendEnabledHandle(l, w)), u = L.watch(u, "legendEnabled", l => this._legendEnabledHandle(l, w)), n.push(c, u));
                                this._handles.add(n, F)
                            }
                            w.isScaleDriven || this._constructLegendElements(w);
                            this._addActiveLayerInfo(w)
                        };
                        d._titleHandle = function(c, n) {
                            n.title = c;
                            this._constructLegendElements(n)
                        };
                        d._legendEnabledHandle = function(c, n) {
                            c ? this._addActiveLayerInfo(n) :
                                this._removeActiveLayerInfo(n)
                        };
                        d._scaleHandle = function(c) {
                            c.isScaleDriven && this._constructLegendElements(c)
                        };
                        d._addActiveLayerInfo = function(c) {
                            const {
                                layerView: n,
                                layer: u
                            } = c;
                            if (this._isLayerActive(n) && -1 === this.activeLayerInfos.indexOf(c)) {
                                var F = c.parent;
                                if (F) - 1 === F.children.indexOf(c) && F.children.push(c), this._sortActiveLayerInfos(F.children);
                                else {
                                    var h;
                                    F = null == (h = this.layerInfos) ? void 0 : h.some(w => w.layer.uid === u.uid);
                                    u.parent && "uid" in u.parent && !F ? this._activeLayerInfosWithNoParent.add(c) : (this.activeLayerInfos.add(c),
                                        this._sortActiveLayerInfos(this.activeLayerInfos))
                                }
                                if (this._activeLayerInfosWithNoParent.length) {
                                    const w = [];
                                    this._activeLayerInfosWithNoParent.forEach(q => {
                                        var y = q.layer.parent;
                                        y = y && "uid" in y && this._layerViewByLayerId[null == y ? void 0 : y.uid];
                                        if (y = this._activeLayerInfosByLayerViewId[null == y ? void 0 : y.uid]) w.push(q), q.parent = y
                                    });
                                    w.length && (this._activeLayerInfosWithNoParent.removeMany(w), w.forEach(q => this._addActiveLayerInfo(q)))
                                }
                            }
                        };
                        d._removeActiveLayerInfo = function(c) {
                            const n = c.parent;
                            n ? n.children.remove(c) :
                                this.activeLayerInfos.remove(c)
                        };
                        d._constructLegendElements = function(c) {
                            const n = c.layer;
                            "featureCollections" in n && n.featureCollections ? c.buildLegendElementsForFeatureCollections(n.featureCollections) : "renderer" in n && n.renderer ? c.buildLegendElementsForRenderer(n.renderer) : "url" in n && n.url ? c.buildLegendElementsForTools() : c.children.forEach(u => this._constructLegendElements(u))
                        };
                        E._createClass(V, [{
                            key: "state",
                            get: function() {
                                return this.get("view.ready") ? "ready" : "disabled"
                            }
                        }]);
                        return V
                    }(t);
                    P.__decorate([z.property({
                            type: C
                        })],
                        A.prototype, "activeLayerInfos", void 0);
                    P.__decorate([z.property()], A.prototype, "basemapLegendVisible", void 0);
                    P.__decorate([z.property()], A.prototype, "groundLegendVisible", void 0);
                    P.__decorate([z.property()], A.prototype, "keepCacheOnDestroy", void 0);
                    P.__decorate([z.property()], A.prototype, "respectLayerVisibility", void 0);
                    P.__decorate([z.property()], A.prototype, "layerInfos", void 0);
                    P.__decorate([z.property({
                        readOnly: !0
                    })], A.prototype, "state", null);
                    P.__decorate([z.property()], A.prototype, "view", void 0);
                    return A = P.__decorate([X.subclass("esri.widgets.Legend.LegendViewModel")], A)
                })
        },
        "esri/widgets/Legend/support/ActiveLayerInfo": function() {
            define("require ../../../chunks/_rollupPluginBabelHelpers ../../../chunks/tslib.es6 ../../../core/has ../../../core/maybe ../../../core/Logger ../../../core/accessorSupport/ensureType ../../../core/accessorSupport/decorators/property ../../../core/jsonMap ../../../core/accessorSupport/decorators/subclass ../../../core/urlUtils ../../../core/uuid ../../../portal/support/resourceExtension ../../../core/promiseUtils ../../../core/Accessor ../../../core/Collection ../../../layers/support/fieldUtils ../../../Color ../../../core/screenUtils ../../../kernel ../../../request ../../../symbols/SimpleFillSymbol ../../../symbols/SimpleMarkerSymbol ../../../symbols ../../../core/Handles ../../../renderers/visualVariables/support/SizeVariableLegendOptions ../../../symbols/support/cimSymbolUtils ../../../symbols/support/utils ../../../renderers/support/jsonUtils ../../../core/watchUtils ../../../layers/support/ExportImageParameters ../../../symbols/support/symbolUtils ../../../renderers/support/rendererConversion ./clusterUtils ./utils ./colorRampUtils ./heatmapRampUtils ./relationshipRampUtils ./sizeRampUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x, L, Q, C, S, H, U, V, d, c, n, u, F, h, w, q, y, l, b, e, k, G, R, Y) {
                    function W(na) {
                        return "esri.renderers.SimpleRenderer" === na.declaredClass
                    }

                    function ba(na) {
                        return "esri.renderers.ClassBreaksRenderer" === na.declaredClass
                    }

                    function T(na) {
                        return "esri.renderers.UniqueValueRenderer" === na.declaredClass
                    }

                    function ja(na) {
                        return "esri.renderers.HeatmapRenderer" === na.declaredClass
                    }

                    function aa(na) {
                        return "esri.renderers.PointCloudClassBreaksRenderer" === na.declaredClass
                    }

                    function ka(na) {
                        return "esri.renderers.PointCloudStretchRenderer" ===
                            na.declaredClass
                    }

                    function ca(na) {
                        return "esri.renderers.PointCloudUniqueValueRenderer" === na.declaredClass
                    }

                    function oa(na) {
                        return "esri.renderers.DotDensityRenderer" === na.declaredClass
                    }

                    function ma(na) {
                        return "esri.layers.BuildingSceneLayer" === na.declaredClass
                    }

                    function sa(na) {
                        na = "authoringInfo" in na && (null == na ? void 0 : na.authoringInfo);
                        return "univariate-color-size" === (null == na ? void 0 : na.type)
                    }

                    function ua(na) {
                        na = "authoringInfo" in na && (null == na ? void 0 : na.authoringInfo);
                        return "univariate-color-size" === (null ==
                            na ? void 0 : na.type) && "above-and-below" === (null == na ? void 0 : na.univariateTheme)
                    }
                    const va = z.getLogger("esri.widgets.Legend.support.ActiveLayerInfo"),
                        wa = /^\s*(return\s+)?\$view\.scale\s*(;)?\s*$/i,
                        Ba = new N.JSONMap({
                            esriGeometryPoint: "point",
                            esriGeometryMultipoint: "multipoint",
                            esriGeometryPolyline: "polyline",
                            esriGeometryPolygon: "polygon",
                            esriGeometryMultiPatch: "multipatch"
                        }),
                        Fa = {
                            u1: [0, 1],
                            u2: [0, 3],
                            u4: [0, 15],
                            u8: [0, 255],
                            s8: [-128, 127],
                            u16: [0, 65535],
                            s16: [-32768, 32767],
                            u32: [0, 4294967295],
                            s32: [-2147483648, 2147483647],
                            f32: [-3.4 * 1E39, 3.4 * 1E39],
                            f64: [-Number.MAX_VALUE, Number.MAX_VALUE]
                        },
                        za = new V({
                            size: 6,
                            outline: {
                                color: [128, 128, 128, .5],
                                width: .5
                            }
                        }),
                        Ga = new U({
                            style: "solid"
                        }),
                        Ha = new V({
                            style: "path",
                            path: "M10,5 L5,0 0,5 M5,0 L5,15",
                            size: 15,
                            outline: {
                                width: 1,
                                color: [85, 85, 85, 1]
                            }
                        });
                    let xa = {};
                    v = function(na) {
                        function Aa(a) {
                            a = na.call(this, a) || this;
                            a._handles = new c;
                            a._hasColorRamp = !1;
                            a._hasOpacityRamp = !1;
                            a._hasSizeRamp = !1;
                            a._webStyleSymbolCache = new Map;
                            a._dotDensityUrlCache = new Map;
                            a._scaleDrivenSizeVariable = null;
                            a._hasClusterSizeVariable = !1;
                            a.children = new x;
                            a.layerView = null;
                            a.layer = null;
                            a.legendElements = [];
                            a.parent = null;
                            a.keepCacheOnDestroy = !1;
                            a.respectLayerVisibility = !0;
                            a.sublayerIds = [];
                            a.title = null;
                            a.view = null;
                            return a
                        }
                        P._inheritsLoose(Aa, na);
                        var da = Aa.prototype;
                        da.initialize = function() {
                            const a = () => this.notifyChange("ready");
                            this._handles.add([w.on(this, "children", "change", g => {
                                const {
                                    added: r,
                                    removed: B
                                } = g, K = this._handles;
                                r.map(O => {
                                    const ea = `activeLayerInfo-ready-watcher-${O.layer.uid}`;
                                    K.add(w.init(O, "ready", a), ea)
                                });
                                B.forEach(O =>
                                    K.remove(O.layer.uid));
                                a()
                            })]);
                            this.keepCacheOnDestroy || (xa = {})
                        };
                        da.destroy = function() {
                            this._handles.destroy();
                            this._scaleDrivenSizeVariable = this._dotDensityUrlCache = this._webStyleSymbolCache = this._handles = null;
                            this.keepCacheOnDestroy || (xa = null)
                        };
                        da.buildLegendElementsForFeatureCollections = async function(a) {
                            a = a.map(g => {
                                if ("esri.layers.FeatureLayer" === g.declaredClass) return this._getRendererLegendElements(g.renderer, {
                                    title: g.title
                                });
                                if (g.featureSet && g.featureSet.features.length) {
                                    var r = g.layerDefinition,
                                        B = r && r.drawingInfo;
                                    B = B && h.fromJSON(B.renderer);
                                    r = Ba.read(r.geometryType);
                                    return B ? this._getRendererLegendElements(B, {
                                        title: g.name,
                                        geometryType: r
                                    }) : (va.warn("drawingInfo not available!"), null)
                                }
                                return null
                            });
                            try {
                                const g = [];
                                await I.eachAlways(a).then(r => {
                                    r.forEach(({
                                        value: B
                                    }) => B && g.push(...B))
                                });
                                this.legendElements = g;
                                this.notifyChange("ready")
                            } catch (g) {
                                va.warn("error while building legend for layer!", g)
                            }
                        };
                        da.buildLegendElementsForRenderer = async function(a) {
                            try {
                                this.legendElements = await this._getRendererLegendElements(a),
                                    this.notifyChange("ready")
                            } catch (g) {
                                va.warn("error while building legend for layer!", g)
                            }
                        };
                        da.buildLegendElementsForTools = async function() {
                            const a = this.layer;
                            "esri.layers.WMTSLayer" === a.declaredClass ? this._constructLegendElementsForWMTSlayer() : "esri.layers.WMSLayer" === a.declaredClass ? await this._constructLegendElementsForWMSSublayers() : ma(a) ? await this._constructLegendElementsForBuildingSceneLayer() : "esri.layers.MapImageLayer" === a.declaredClass || "esri.layers.TileLayer" === a.declaredClass || ma(a) ? await this._constructLegendElementsForSublayers() :
                                (this._handles.remove("imageryLayers-watcher"), await this._getLegendLayers(`${a.uid}-default`).then(async g => {
                                    this.legendElements = [];
                                    this.notifyChange("ready");
                                    g = g.map(async r => {
                                        if ("esri.layers.ImageryLayer" === a.declaredClass || "esri.layers.ImageryTileLayer" === a.declaredClass) {
                                            const B = a.watch(["renderingRule", "bandIds"], () => I.debounce(async () => {
                                                xa["default"] = null;
                                                a.renderer ? await this.buildLegendElementsForRenderer(a.renderer) : await this.buildLegendElementsForTools()
                                            })());
                                            this._handles.add(B, "imageryLayers-watcher")
                                        }(r =
                                            this._generateSymbolTableElementForLegendLayer(r)) && r.infos.length && ("esri.layers.ImageryLayer" === a.declaredClass && (r.title = a.title), this.legendElements.push(r));
                                        this.notifyChange("ready")
                                    });
                                    await Promise.allSettled(g)
                                }).catch(g => {
                                    va.warn("Request to server for legend has failed!", g)
                                }))
                        };
                        da._getParentLayerOpacity = function(a) {
                            let g = 1;
                            const r = a.parent;
                            r && "uid" in r && (g = this._getParentLayerOpacity(r));
                            return a.opacity * g
                        };
                        da._isGroupActive = function() {
                            const a = this.children;
                            return a.length ? a.some(g => g.ready) :
                                !1
                        };
                        da._isScaleDrivenSizeVariable = function(a) {
                            if (a && "size" !== a.type) return !1;
                            const g = a.minSize,
                                r = a.maxSize;
                            return "object" === typeof g && g ? this._isScaleDrivenSizeVariable(g) : "object" === typeof r && r ? this._isScaleDrivenSizeVariable(r) : !!a.expression || wa.test(a.valueExpression)
                        };
                        da._isLayerScaleDriven = function(a) {
                            if ("minScale" in a && 0 < a.minScale || "maxScale" in a && 0 < a.maxScale) return !0;
                            if ("sublayers" in a && a.sublayers) return a.sublayers.some(r => this._isLayerScaleDriven(r));
                            const g = a.parent;
                            if (!1 === a.loaded &&
                                g && "esri.layers.MapImageLayer" === g.declaredClass && "source" in a && a.source && "map-layer" === a.source.type)
                                for (const r of g.sourceJSON.layers)
                                    if (r.id === a.source.mapLayerId && (0 < r.minScale || 0 < r.maxScale)) return !0;
                            return !1
                        };
                        da._constructLegendElementsForWMTSlayer = function() {
                            this.legendElements = [];
                            this._handles.remove("wmts-activeLayer-watcher");
                            const a = this.layer.activeLayer;
                            this._handles.add(w.watch(this.layer, "activeLayer", () => this._constructLegendElementsForWMTSlayer()), "wmts-activeLayer-watcher");
                            if (a.styleId &&
                                a.styles) {
                                let g = null;
                                a.styles.some(r => a.styleId === r.id ? (g = r.legendUrl, !0) : !1);
                                g && (this.legendElements = [{
                                    type: "symbol-table",
                                    title: a.title,
                                    infos: [{
                                        src: g,
                                        opacity: this.opacity
                                    }]
                                }])
                            }
                            this.notifyChange("ready")
                        };
                        da._constructLegendElementsForWMSSublayers = async function() {
                            this.legendElements = [];
                            this._handles.remove("wms-sublayers-watcher");
                            const a = this.layer;
                            let g = null;
                            if (a.customParameters || a.customLayerParameters) g = { ...a.customParameters,
                                ...a.customLayerParameters
                            };
                            this._handles.add(w.watch(this.layer,
                                "sublayers", () => this._constructLegendElementsForWMSSublayers()), "wms-sublayers-watcher");
                            this.legendElements = await this._generateLegendElementsForWMSSublayers(a.sublayers, g);
                            this.notifyChange("ready")
                        };
                        da._generateLegendElementsForWMSSublayers = async function(a, g) {
                            const r = [];
                            this._handles.add(a.on("change", () => this._constructLegendElementsForWMSSublayers()), "wms-sublayers-watcher");
                            a = a.toArray();
                            for (const B of a) a = B.watch(["title", "visible", "legendEnabled"], () => this._constructLegendElementsForWMSSublayers()),
                                this._handles.add(a, "wms-sublayers-watcher"), B.visible && B.legendEnabled && (a = await this._generateSymbolTableElementForWMSSublayer(B, g)) && a.infos.length && r.unshift(a);
                            return r
                        };
                        da._generateSymbolTableElementForWMSSublayer = async function(a, g) {
                            return !a.legendUrl && a.sublayers ? (g = (await this._generateLegendElementsForWMSSublayers(a.sublayers, g)).filter(r => r), {
                                type: "symbol-table",
                                title: a.title,
                                infos: g
                            }) : this._generateSymbolTableElementForLegendUrl(a, g)
                        };
                        da._generateSymbolTableElementForLegendUrl = async function(a,
                            g) {
                            var r;
                            let B = a.legendUrl;
                            if (B) {
                                var K = {
                                    type: "symbol-table",
                                    title: a.title || a.name || a.id && a.id + "",
                                    infos: []
                                };
                                g && (B += "?" + p.objectToQuery(g));
                                g = null;
                                a = null == (r = a.layer) ? void 0 : r.opacity;
                                try {
                                    if (g = (await H(B, {
                                            responseType: "image"
                                        })).data) g.style.opacity = a
                                } catch {}
                                K.infos.push({
                                    src: B,
                                    preview: g,
                                    opacity: a
                                });
                                return K
                            }
                        };
                        da._getLegendLayers = function(a, g) {
                            const r = xa && xa[a];
                            return r ? Promise.resolve(r) : this._legendRequest(g).then(B => {
                                B = B.layers;
                                return xa[a] = B
                            })
                        };
                        da._legendRequest = function(a) {
                            var g = this.layer;
                            a = {
                                f: "json",
                                dynamicLayers: a
                            };
                            if ("esri.layers.ImageryLayer" === g.declaredClass) {
                                var r = g.exportImageServiceParameters.renderingRule;
                                r && (a.renderingRule = JSON.stringify(r.toJSON()));
                                g.bandIds && (a.bandIds = g.bandIds.join());
                                if (g.raster || g.viewId) {
                                    const {
                                        raster: B,
                                        viewId: K
                                    } = g;
                                    a = {
                                        raster: B,
                                        viewId: K,
                                        ...a
                                    }
                                }
                            }
                            r = g.url.replace(/(\/)+$/, "");
                            "version" in g && 10.01 <= g.version ? (g = r.indexOf("?"), r = -1 < g ? r.substring(0, g) + "/legend" + r.substring(g) : r + "/legend") : (g = r.toLowerCase().indexOf("/rest/"), g = r.substring(0, g) + r.substring(g + 5, r.length),
                                r = "https://utility.arcgis.com/sharing/tools/legend?soapUrl\x3d" + encodeURI(g) + "\x26returnbytes\x3dtrue");
                            return H(r, {
                                query: a
                            }).then(B => B.data)
                        };
                        da._constructLegendElementsForBuildingSceneLayer = async function() {
                            this.legendElements = [];
                            this._handles.remove("sublayers-watcher");
                            const a = this.layer;
                            this._handles.add(w.watch(a, "sublayers", () => this._constructLegendElementsForBuildingSceneLayer()), "sublayers-watcher");
                            try {
                                this.legendElements = await this._generateLegendElementsForBuildingSublayers(a.sublayers,
                                    this.opacity), this.notifyChange("ready")
                            } catch (g) {
                                va.warn("Request to server for legend has failed!", g)
                            }
                        };
                        da._generateLegendElementsForBuildingSublayers = async function(a, g) {
                            let r = [];
                            this._handles.add(a.on("change", () => this._constructLegendElementsForBuildingSceneLayer()), "sublayers-watcher");
                            a = a.toArray();
                            for (const K of a)
                                if (a = K.watch(["renderer", "opacity", "title", "visible"], () => this._constructLegendElementsForBuildingSceneLayer()), this._handles.add(a, "sublayers-watcher"), K.visible) {
                                    a = K && null != K.opacity ?
                                        K.opacity : null;
                                    var B = null != a ? a * g : g;
                                    "building-group" === K.type ? (a = {
                                        type: "symbol-table",
                                        title: K.title,
                                        infos: []
                                    }, B = await this._generateLegendElementsForBuildingSublayers(K.sublayers, B), a.infos.push(...B), r = [a, ...r]) : K.renderer && (r = [...await this._getRendererLegendElements(K.renderer, {
                                        title: K.title,
                                        opacity: B,
                                        sublayer: K
                                    }), ...r])
                                }
                            return r.filter(K => !!K && ("infos" in K ? 0 < K.infos.length : !0))
                        };
                        da._constructLegendElementsForSublayers = async function() {
                            this.legendElements = [];
                            this._handles.remove("sublayers-watcher");
                            const a = this.layer;
                            this._handles.add(w.watch(a, "sublayers", () => this._constructLegendElementsForSublayers), "sublayers-watcher");
                            try {
                                this.legendElements = await this._generateLegendElementsForSublayers(a.sublayers, this.opacity), this.notifyChange("ready")
                            } catch (g) {
                                va.warn("Request to server for legend has failed!", g)
                            }
                        };
                        da._generateLegendElementsForSublayers = async function(a, g, r) {
                            const B = this.layer;
                            let K = [];
                            this._handles.add(a.on("change", () => this._constructLegendElementsForSublayers()), "sublayers-watcher");
                            a = a.toArray();
                            !r && this.sublayerIds && this.sublayerIds.length && (a = this.sublayerIds.map(O => B.findSublayerById(O)).filter(Boolean));
                            for (const O of a) a = O.watch("renderer, opacity, title, visible, legendEnabled", () => this._constructLegendElementsForSublayers()), this._handles.add(a, "sublayers-watcher"), O.visible && O.legendEnabled && (!this.respectLayerVisibility || this._isSublayerInScale(O)) && (a = O && null != O.opacity ? O.opacity : null, a = null != a ? a * g : g, O.renderer && !O.sublayers && 2 < O.originIdOf("renderer") ? (await O.load(),
                                K = [...await this._getRendererLegendElements(O.renderer, {
                                    title: O.title,
                                    opacity: a,
                                    sublayer: O
                                }), ...K]) : (a = await this._generateSymbolTableElementForSublayer(O, a, r)) && K.unshift(a));
                            return K.filter(O => !!O && ("infos" in O ? 0 < O.infos.length : !0))
                        };
                        da._generateSymbolTableElementForSublayer = async function(a, g, r) {
                            if (!r) {
                                r = new Map;
                                var B = new q.ExportImageParameters({
                                    layer: this.layer
                                });
                                const K = B.hasDynamicLayers ? B.dynamicLayers : null;
                                B.destroy();
                                (await this._getLegendLayers(K || `${this.layer.uid}-${a.id}-default`, K)).forEach(O =>
                                    r.set(O.layerId, O))
                            }
                            B = r.get(a.id);
                            return !B && a.sublayers ? (g = await this._generateLegendElementsForSublayers(a.sublayers, g, r), {
                                type: "symbol-table",
                                title: a.title,
                                infos: g
                            }) : this._generateSymbolTableElementForLegendLayer(B, a, g)
                        };
                        da._generateSymbolTableElementForLegendLayer = function(a, g, r) {
                            var B;
                            if (!a || !a.legend || this.respectLayerVisibility && !this._isLegendLayerInScale(a, g)) return null;
                            var K = null == g ? void 0 : g.renderer;
                            let O = (null == g ? void 0 : g.title) || a.layerName;
                            K && (!g || 2 < (null == g ? void 0 : g.originIdOf("renderer"))) &&
                                (K = (null == g ? void 0 : g.title) || this._getRendererTitle(K, g)) && (O && "string" !== typeof K && "title" in K && (K.title = O), O = K);
                            const ea = {
                                    type: "symbol-table",
                                    title: O,
                                    legendType: a.legendType ? a.legendType : null,
                                    infos: []
                                },
                                Z = g ? this._sanitizeLegendForSublayer(a.legend.slice(), g) : a.legend;
                            0 < (null == (B = a.legendGroups) ? void 0 : B.length) ? a.legendGroups.forEach(fa => {
                                var ra;
                                const ia = {
                                    type: "symbol-table",
                                    title: fa.heading,
                                    legendType: a.legendType ? a.legendType : null,
                                    infos: this._generateSymbolTableElementInfosForLegendLayer(Z.filter(ha =>
                                        ha.groupId === fa.id), a.layerId, r)
                                };
                                0 < (null == (ra = ia.infos) ? void 0 : ra.length) && ea.infos.push(ia)
                            }) : ea.infos = this._generateSymbolTableElementInfosForLegendLayer(Z, a.layerId, r);
                            return 0 < ea.infos.length ? ea : null
                        };
                        da._generateSymbolTableElementInfosForLegendLayer = function(a, g, r) {
                            return a.map(B => {
                                let K = B.url;
                                if (B.imageData && 0 < B.imageData.length) K = `data:image/png;base64,${B.imageData}`;
                                else if (0 !== K.indexOf("http")) K = S.addTokenParameter(`${this.layer.url}/${g}/images/${K}`);
                                else return null;
                                return {
                                    label: B.label,
                                    src: K,
                                    opacity: null == r ? this.opacity : r,
                                    width: B.width,
                                    height: B.height
                                }
                            }).filter(B => !!B)
                        };
                        da._isSublayerInScale = function(a) {
                            const g = a.minScale || 0;
                            a = a.maxScale || 0;
                            return 0 < g && g < this.scale || a > this.scale ? !1 : !0
                        };
                        da._isLegendLayerInScale = function(a, g) {
                            g = g || this.layer;
                            let r = null,
                                B = null,
                                K = !0;
                            !g.minScale && 0 !== g.minScale || !g.maxScale && 0 !== g.maxScale ? (0 === a.minScale && g.tileInfo && (r = g.tileInfo.lods[0].scale), 0 === a.maxScale && g.tileInfo && (B = g.tileInfo.lods[g.tileInfo.lods.length - 1].scale)) : (r = Math.min(g.minScale,
                                a.minScale) || g.minScale || a.minScale, B = Math.max(g.maxScale, a.maxScale));
                            if (0 < r && r < this.scale || B > this.scale) K = !1;
                            return K
                        };
                        da._sanitizeLegendForSublayer = function(a, g) {
                            if ("version" in this.layer && 10.1 > this.layer.version || 0 === a.length) return a;
                            g = g.renderer;
                            let r = null,
                                B = null;
                            a.some(K => K.values) && a.some((K, O) => {
                                K.values || (r = O, B = K, B.label || (B.label = "others"));
                                return null != B
                            });
                            g ? "unique-value" === g.type ? B && (a.splice(r, 1), a.push(B)) : "class-breaks" === g.type && (B && a.splice(r, 1), a.reverse(), B && a.push(B)) : B && (a.splice(r,
                                1), a.push(B));
                            return a
                        };
                        da._getRendererLegendElements = async function(a, g = {}) {
                            var r = this.view;
                            r = W(a) || ba(a) || T(a) || ja(a) || oa(a) ? "2d" === r.type || l.isSupportedRenderer3D(a) : "raster-stretch" === a.type || "raster-colormap" === a.type || "raster-shaded-relief" === a.type || aa(a) || ka(a) || ca(a) || "vector-field" === a.type;
                            return r ? aa(a) || ka(a) || ca(a) || "esri.renderers.PointCloudRGBRenderer" === a.declaredClass ? this._constructPointCloudRendererLegendElements(a, g) : oa(a) ? this._constructDotDensityRendererLegendElements(a) : this._constructRendererLegendElements(a,
                                g) : (va.warn(`Renderer of type '${a.type}' not supported!`), [])
                        };
                        da._getPointCloudRendererTitle = function(a) {
                            return a.legendOptions && a.legendOptions.title || a.field
                        };
                        da._constructPointCloudRendererLegendElements = function(a, g = {}) {
                            g = g.title;
                            const r = [];
                            let B = null;
                            var K = null;
                            if (aa(a)) B = {
                                type: "symbol-table",
                                title: g || this._getPointCloudRendererTitle(a),
                                infos: []
                            }, a.colorClassBreakInfos.forEach(O => {
                                B.infos.unshift({
                                    label: O.label || O.minValue + " - " + O.maxValue,
                                    value: [O.minValue, O.maxValue],
                                    symbol: this._getAppliedCloneSymbol(za,
                                        O.color)
                                })
                            });
                            else if (ka(a)) {
                                K = a.stops;
                                let O = null;
                                if (K.length && (1 === K.length && (O = K[0].color), !O)) {
                                    const ea = K[0].value,
                                        Z = K[K.length - 1].value;
                                    null != ea && null != Z && (O = k.getColorFromPointCloudStops(ea + (Z - ea) / 2, K))
                                }
                                B = {
                                    type: "symbol-table",
                                    title: null,
                                    infos: [{
                                        label: null,
                                        value: null,
                                        symbol: this._getAppliedCloneSymbol(za, O || za.color)
                                    }]
                                };
                                K = k.getRampStopsForPointCloud(a.stops);
                                K = {
                                    type: "color-ramp",
                                    title: g || this._getPointCloudRendererTitle(a),
                                    infos: K,
                                    preview: y.renderColorRampPreviewHTML(K.map(ea => ea.color))
                                }
                            } else ca(a) &&
                                (B = {
                                    type: "symbol-table",
                                    title: g || this._getPointCloudRendererTitle(a),
                                    infos: []
                                }, a.colorUniqueValueInfos.forEach(O => {
                                    B.infos.push({
                                        label: O.label || O.values.join(", "),
                                        value: O.values.join(", "),
                                        symbol: this._getAppliedCloneSymbol(za, O.color)
                                    })
                                }));
                            B && B.infos.length && r.push(B);
                            K && K.infos.length && r.push(K);
                            g = r.reduce((O, ea) => O.concat(ea.infos), []).filter(O => !!O.symbol).map(O => this._getSymbolPreview(O, this.opacity, {
                                symbolConfig: {
                                    applyColorModulation: !!a.colorModulation
                                }
                            }));
                            return I.eachAlways(g).then(() =>
                                r)
                        };
                        da._getElementInfoForDotDensity = function(a, g) {
                            const {
                                backgroundColor: r,
                                outline: B,
                                dotSize: K
                            } = a, O = K + "-" + g + "-" + r + "-" + (B && JSON.stringify(B.toJSON())), ea = this._dotDensityUrlCache;
                            a = ea.has(O) ? ea.get(O) : y.renderDotDensityPreviewHTML(a, g);
                            ea.set(O, a);
                            return {
                                opacity: 1,
                                src: a.src,
                                preview: a,
                                width: a.width,
                                height: a.height
                            }
                        };
                        da._constructDotDensityRendererLegendElements = function(a) {
                            const g = a.calculateDotValue(this.view.scale),
                                r = {
                                    type: "symbol-table",
                                    title: {
                                        value: g && Math.round(g),
                                        unit: a.legendOptions && a.legendOptions.unit ||
                                            ""
                                    },
                                    infos: []
                                };
                            a.attributes.forEach(B => {
                                const K = this._getElementInfoForDotDensity(a, B.color);
                                K.label = B.label || B.valueExpressionTitle || B.field;
                                r.infos.push(K)
                            });
                            return Promise.resolve([r])
                        };
                        da._constructRendererLegendElements = async function(a, g = {}) {
                            const {
                                title: r,
                                sublayer: B
                            } = g, K = B || this.layer;
                            a = await this._loadRenderer(a);
                            this._hasSizeRamp = this._hasOpacityRamp = this._hasColorRamp = !1;
                            this._scaleDrivenSizeVariable = null;
                            const O = await this._getVisualVariableLegendElements(a, K) || [],
                                ea = {
                                    type: "symbol-table",
                                    title: r || this._getRendererTitle(a, K),
                                    infos: []
                                };
                            let Z = null,
                                fa = !1;
                            const ra = new Set;
                            if (sa(a)) {
                                var ia = r,
                                    ha = ua(a) ? "univariate-above-and-below-ramp" : "univariate-color-size-ramp",
                                    pa = O.findIndex(la => "color-ramp" === la.type);
                                pa = O.splice(pa, 1)[0];
                                var qa = O.findIndex(la => "size-ramp" === la.type);
                                qa = O.splice(qa, 1)[0];
                                var ya = [];
                                pa && (ia = pa.title, ya.push(pa));
                                qa && (ia = qa.title, ya.push(qa));
                                0 < ya.length && O.push({
                                    type: ha,
                                    title: ia,
                                    infos: ya
                                })
                            } else if (ja(a)) ia = G.getHeatmapRampStops(a), O.push({
                                type: "heatmap-ramp",
                                title: r,
                                infos: ia,
                                preview: y.renderColorRampPreviewHTML(ia.map(la => la.color))
                            });
                            else if (T(a)) {
                                if ((ha = a && a.authoringInfo) && "relationship" === ha.type) {
                                    const {
                                        focus: la,
                                        numClasses: ta,
                                        field1: Ca,
                                        field2: Da
                                    } = ha;
                                    if (ta && Ca && Da) {
                                        pa = [Ca, Da];
                                        ha = R.getRotationAngleForFocus(la) || 0;
                                        for (ia of pa) {
                                            const {
                                                field: Ia,
                                                normalizationField: Ea,
                                                label: Ja
                                            } = ia;
                                            pa = Ja || {
                                                field: this._getFieldAlias(Ia, K),
                                                normField: Ea && this._getFieldAlias(Ea, K)
                                            };
                                            qa = Ha.clone();
                                            qa.angle = ha;
                                            ea.infos.push({
                                                label: pa,
                                                symbol: qa
                                            });
                                            ra.add(qa);
                                            ha += 90
                                        }
                                        ia = R.getRelationshipRampElement({
                                            focus: la,
                                            numClasses: ta,
                                            infos: a.uniqueValueInfos
                                        });
                                        O.unshift(ia)
                                    }
                                } else {
                                    const la = a.field;
                                    a.uniqueValueInfos.forEach(ta => {
                                        ta.symbol && ea.infos.push({
                                            label: ta.label || this._getDomainName(la, ta.value, K) || ta.value,
                                            value: ta.value,
                                            symbol: ta.symbol
                                        })
                                    })
                                }
                                a.defaultSymbol && (ea.infos.push({
                                    label: a.defaultLabel || "others",
                                    symbol: a.defaultSymbol
                                }), fa = !0)
                            } else if (ba(a)) Z = this._isUnclassedRenderer(a), Z && this._hasSizeRamp || (a.classBreakInfos.forEach(la => {
                                la.symbol && ea.infos.unshift({
                                    label: la.label || (Z ? null : la.minValue + " - " + la.maxValue),
                                    value: [la.minValue, la.maxValue],
                                    symbol: la.symbol
                                })
                            }), Z && (ea.title = null), this._updateInfosforClassedSizeRenderer(a, ea.infos)), a.defaultSymbol && !Z && (ea.infos.push({
                                label: a.defaultLabel || "others",
                                symbol: a.defaultSymbol
                            }), fa = !0);
                            else if ("raster-stretch" === a.type)
                                if ("esri.layers.ImageryTileLayer" === this.layer.declaredClass && "Map" === (null == (qa = this.layer) ? void 0 : null == (ya = qa.raster) ? void 0 : ya.tileType)) this._getServerSideLegend();
                                else if ("esri.layers.ImageryTileLayer" === this.layer.declaredClass || "esri.layers.WCSLayer" ===
                                this.layer.declaredClass) ia = this._constructTileImageryStretchRendererElements(a), "stretch-ramp" === ia.type ? O.push(ia) : ea.infos = ia;
                            else {
                                ia = this.layer;
                                a.statistics && a.statistics.length ? (qa = null != a.statistics[0].min ? a.statistics[0].min : a.statistics[0][0], pa = null != a.statistics[0].max ? a.statistics[0].max : a.statistics[0][1]) : (qa = null == (pa = a) ? void 0 : pa.outputMin, pa = null == (ha = a) ? void 0 : ha.outputMax);
                                ha = [];
                                ha = m.unwrap(ia.renderingRule ? await ia.generateRasterInfo(ia.renderingRule) : ia.serviceRasterInfo);
                                const la =
                                    ha.keyProperties.BandProperties;
                                1 === ha.bandCount ? (qa = null != qa ? qa : ha.statistics && ha.statistics[0].min, pa = null != pa ? pa : ha.statistics && ha.statistics[0].max, qa || pa ? O.push(this._getStretchLegendElements(a, {
                                        min: qa,
                                        max: pa
                                    })) : this._getServerSideLegend()) : ia.bandIds && 1 === ia.bandIds.length ? (qa = null != qa ? qa : ha.statistics && ha.statistics[ia.bandIds[0]].min, pa = null != pa ? pa : ha.statistics && ha.statistics[ia.bandIds[0]].max, qa || pa ? O.push(this._getStretchLegendElements(a, {
                                        min: qa,
                                        max: pa
                                    })) : this._getServerSideLegend()) :
                                    3 <= ha.bandCount ? la && la.length >= ha.bandCount ? ia.bandIds && 3 === ia.bandIds.length ? (ha = ia.bandIds.map(ta => la[ta].BandName), ea.infos = this._createSymbolTableElementMultiBand(ha)) : "lerc" === ia.format ? (ha = [0, 1, 2].map(ta => la[ta].BandName), ea.infos = this._createSymbolTableElementMultiBand(ha)) : this._getServerSideLegend() : "lerc" === ia.format ? (ha = ["band1", "band2", "band3"], ea.infos = this._createSymbolTableElementMultiBand(ha)) : this._getServerSideLegend() : this._getServerSideLegend()
                            } else if ("raster-colormap" === a.type) a.colormapInfos.forEach(la => {
                                ea.infos.push({
                                    label: la.label,
                                    value: la.value,
                                    symbol: this._getAppliedCloneSymbol(Ga, la.color)
                                })
                            });
                            else if (W(a)) {
                                ia = a.symbol;
                                switch (g.geometryType) {
                                    case "point":
                                        ia = "pointSymbol" in K && K.pointSymbol;
                                        break;
                                    case "polyline":
                                        ia = "lineSymbol" in K && K.lineSymbol;
                                        break;
                                    case "polygon":
                                        ia = "polygonSymbol" in K && K.polygonSymbol
                                }
                                a.symbol && !this._hasSizeRamp && ea.infos.push({
                                    label: a.label,
                                    symbol: ia
                                })
                            } else "vector-field" === a.type ? (a.outputUnit && (this.title = "(" + a.toJSON().outputUnit + ")"), ea.title = a.attributeField, ia = a.getClassBreakInfos(),
                                null != ia && ia.length ? ia.forEach(la => {
                                    ea.infos.push({
                                        label: la.minValue + " - " + la.maxValue,
                                        symbol: la.symbol
                                    })
                                }) : ea.infos.push({
                                    label: a.attributeField,
                                    symbol: a.getDefaultSymbol()
                                })) : "raster-shaded-relief" === a.type && O.push(this._getStretchLegendElements(a, {
                                min: 0,
                                max: 255
                            }));
                            ia = a.defaultSymbol;
                            !ia || fa || W(a) || Z && !this._hasColorRamp && !this._hasSizeRamp && !this._hasOpacityRamp || O.push({
                                type: "symbol-table",
                                infos: [{
                                    label: a.defaultLabel || "others",
                                    symbol: ia
                                }]
                            });
                            ea.infos.length && O.unshift(ea);
                            const Ka = null == g.opacity ?
                                this.opacity : g.opacity,
                                La = this._isTallSymbol("visualVariables" in a && a.visualVariables),
                                Ma = "esri.layers.ImageryLayer" === this.layer.declaredClass || "esri.layers.ImageryTileLayer" === this.layer.declaredClass;
                            g = O.reduce((la, ta) => la.concat(this._getAllInfos(ta)), []).filter(la => !(!la || !la.symbol)).map(la => this._getSymbolPreview(la, Ka, {
                                applyScaleDrivenSize: !ra.has(la.symbol),
                                symbolConfig: {
                                    isTall: La,
                                    isSquareFill: Ma
                                }
                            }));
                            a = null;
                            await I.eachAlways(g);
                            return O
                        };
                        da._getServerSideLegend = function() {
                            setTimeout(() =>
                                this.buildLegendElementsForTools(), 0)
                        };
                        da._getAllInfos = function(a) {
                            const g = null == a ? void 0 : a.infos;
                            return g ? g.reduce((r, B) => r.concat(this._getAllInfos(B)), []) : [a]
                        };
                        da._constructTileImageryStretchRendererElements = function(a) {
                            function g(ra) {
                                var ia;
                                const ha = (null != K && null != (ia = K.bandIds) && ia.length ? K.bandIds : Array.from(Array(Math.min(O.bandCount, 3)).keys())).map(pa => ra && ra[pa] && ra[pa].BandName || "band" + (pa + 1));
                                3 > ha.length ? ha.push(ha[1]) : 3 < ha.length && ha.splice(3);
                                return ha
                            }
                            var r, B;
                            const K = this.layer,
                                O =
                                K.rasterInfo,
                                ea = O.bandCount || a.statistics.length;
                            var Z, fa = [];
                            fa = O.keyProperties && O.keyProperties.BandProperties;
                            (Z = null != a && null != (r = a.statistics) && r.length ? a.statistics : null == O ? void 0 : O.statistics) ? (r = void 0 !== Z[0].min ? Z[0].min : Z[0][0], Z = Z[0].max || Z[0][1]) : (Z = Fa[K.rasterInfo.pixelType.toLowerCase()], r = Z[0], Z = Z[1]);
                            if (1 === O.bandCount || 1 === (null == (B = K.bandIds) ? void 0 : B.length)) return this._getStretchLegendElements(a, {
                                min: r,
                                max: Z
                            });
                            fa = fa && fa.length >= ea ? g(fa) : g();
                            return this._createSymbolTableElementMultiBand(fa)
                        };
                        da._getStretchLegendElements = function(a, g) {
                            a = k.getStrectchRampStops(a.colorRamp, g);
                            return {
                                type: "stretch-ramp",
                                title: "",
                                infos: a,
                                preview: y.renderColorRampPreviewHTML(a.map(r => r.color))
                            }
                        };
                        da._createSymbolTableElementMultiBand = function(a) {
                            const g = [],
                                r = ["red", "green", "blue"];
                            a.forEach((B, K) => {
                                g.push({
                                    label: {
                                        colorName: r[K],
                                        bandName: B
                                    },
                                    src: e.RGB_IMG_SOURCE[K],
                                    opacity: 1
                                })
                            });
                            return g
                        };
                        da._updateInfosforClassedSizeRenderer = function(a, g) {
                            const r = a.authoringInfo && "class-breaks-size" === a.authoringInfo.type,
                                B =
                                a.classBreakInfos.some(K => F.isVolumetricSymbol(K.symbol));
                            if (r && B) {
                                const K = Y.REAL_WORLD_MAX_SIZE;
                                a = a.classBreakInfos.length;
                                const O = (K - Y.REAL_WORLD_MIN_SIZE) / (1 < a ? a - 1 : a);
                                g.forEach((ea, Z) => {
                                    ea.size = K - O * Z
                                })
                            }
                        };
                        da._isTallSymbol = function(a) {
                            let g = !1,
                                r = !1;
                            if (a)
                                for (let B = 0; B < a.length && (!g || !r); B++) {
                                    const K = a[B];
                                    "size" === K.type && ("height" === K.axis && (g = !0), "width-and-depth" === K.axis && (r = !0))
                                }
                            return g && r
                        };
                        da._getSymbolPreview = async function(a, g, r) {
                            var B = null == a.size && this._hasSizeRamp ? C.px2pt(22) : a.size;
                            this._scaleDrivenSizeVariable &&
                                null != r && r.applyScaleDrivenSize && ({
                                    getSize: B
                                } = await new Promise(function(K, O) {
                                    E(["../../../renderers/visualVariables/support/visualVariableUtils"], K, O)
                                }), B = B(this._scaleDrivenSizeVariable, null, {
                                    view: this.view.type,
                                    scale: this.scale,
                                    shape: "simple-marker" === a.symbol.type ? a.symbol.style : null
                                }));
                            return y.renderPreviewHTML(a.symbol, {
                                size: B,
                                opacity: g,
                                scale: !1,
                                symbolConfig: null == r ? void 0 : r.symbolConfig
                            }).then(K => {
                                a.preview = K;
                                return a
                            }).catch(() => {
                                a.preview = null;
                                return a
                            })
                        };
                        da._loadRenderer = async function(a) {
                            var g,
                                r;
                            const B = [];
                            var K = this.layer;
                            a = a.clone();
                            this._hasClusterSizeVariable = !1;
                            const O = "visualVariables" in a && (null == (g = a.visualVariables) ? void 0 : g.some(Z => "size" === Z.type && "outline" !== Z.target && !wa.test(Z.valueExpression)));
                            if (a && "visualVariables" in a && !O && "featureReduction" in K && "cluster" === (null == (r = K.featureReduction) ? void 0 : r.type) && (g = m.unwrap(b.getClusterSizeVariable(this.layerView._effectiveRenderer, this.view)))) {
                                K = K.featureReduction;
                                if ("clusterMinSize" in K && "clusterMaxSize" in K) {
                                    const {
                                        clusterMinSize: Z,
                                        clusterMaxSize: fa
                                    } = K;
                                    g.legendOptions = new n({
                                        showLegend: Z !== fa
                                    })
                                }
                                a.visualVariables = (a.visualVariables || []).concat([g]);
                                this._hasClusterSizeVariable = !0
                            }
                            const ea = await this._getMedianColor(a);
                            if (ba(a) || T(a)) K = (a.classBreakInfos || a.uniqueValueInfos).map(Z => this._fetchSymbol(Z.symbol, ea).then(fa => {
                                Z.symbol = fa
                            }).catch(() => {
                                Z.symbol = null
                            })), Array.prototype.push.apply(B, K);
                            B.push(this._fetchSymbol(a.symbol || a.defaultSymbol, a.defaultSymbol ? null : ea).then(Z => {
                                this._applySymbolToRenderer(a, Z, W(a))
                            }).catch(() => {
                                this._applySymbolToRenderer(a, null, W(a))
                            }));
                            return I.eachAlways(B).then(() => a)
                        };
                        da._applySymbolToRenderer = function(a, g, r) {
                            r ? a.symbol = g : a.defaultSymbol = g
                        };
                        da._getMedianColor = async function(a) {
                            if (!("visualVariables" in a && a.visualVariables)) return null;
                            a = a.visualVariables.find(B => "color" === B.type);
                            if (!a) return null;
                            var g = null,
                                r = null;
                            if (a.stops) {
                                if (1 === a.stops.length) return a.stops[0].color;
                                g = a.stops[0].value;
                                r = a.stops[a.stops.length - 1].value
                            }
                            g += (r - g) / 2;
                            ({
                                getColor: r
                            } = await new Promise(function(B, K) {
                                E(["../../../renderers/visualVariables/support/visualVariableUtils"],
                                    B, K)
                            }));
                            return r(a, g)
                        };
                        da._fetchSymbol = function(a, g) {
                            if (!a) return Promise.reject();
                            if ("web-style" === a.type) {
                                var r = a.portal;
                                r = a.name + "-" + a.styleName + "-" + a.styleUrl + "-" + (r && r.url) + "-" + (r && r.user && r.user.username);
                                const B = this._webStyleSymbolCache;
                                B.has(r) || ("2d" === this.view.type ? B.set(r, a.fetchCIMSymbol()) : B.set(r, a.fetchSymbol()));
                                return B.get(r).then(K => this._getAppliedCloneSymbol(K, g)).catch(() => {
                                    va.warn("Fetching web-style failed!");
                                    return Promise.reject()
                                })
                            }
                            return Promise.resolve(this._getAppliedCloneSymbol(a,
                                g))
                        };
                        da._getAppliedCloneSymbol = function(a, g) {
                            if (!a || !g) return a;
                            a = a.clone();
                            const r = g && g.toRgba(); - 1 < a.type.indexOf("3d") ? this._applyColorTo3dSymbol(a, r) : "cim" === a.type ? u.applyCIMSymbolColor(a, g) : a.color && (a.color = new Q(r || a.color));
                            return a
                        };
                        da._applyColorTo3dSymbol = function(a, g) {
                            g && a.symbolLayers.forEach(r => {
                                r && (r.material || (r.material = {}), r.material.color = new Q(g))
                            })
                        };
                        da._getVisualVariableLegendElements = async function(a, g) {
                            if (!("visualVariables" in a && a.visualVariables) || "vector-field" === a.type) return null;
                            var r = a.visualVariables,
                                B = [];
                            const K = [],
                                O = [];
                            for (const fa of r) "color" === fa.type ? B.push(fa) : "size" === fa.type ? K.push(fa) : "opacity" === fa.type && O.push(fa);
                            r = [...B, ...K, ...O];
                            let ea;
                            if (0 === B.length && ba(a) && a.classBreakInfos && 1 === a.classBreakInfos.length) var Z = (Z = a.classBreakInfos[0]) && Z.symbol;
                            0 === B.length && W(a) && (Z = a.symbol);
                            Z && (-1 < Z.type.indexOf("3d") ? (B = Z.symbolLayers.getItemAt(0), "water" === B.type ? m.isSome(B.color) && (ea = B.color) : m.isSome(B.material) && m.isSome(B.material.color) && (ea = B.material.color)) :
                                Z.url || (ea = Z.color));
                            return (await Promise.all(r.map(async fa => {
                                if (!fa.legendOptions || !1 !== fa.legendOptions.showLegend) {
                                    const ia = this._getRampTitle(fa, g);
                                    let ha = null;
                                    var ra = "getField" in g && g.getField && g.getField(fa.field);
                                    ra = ra && L.isDateField(ra);
                                    "color" === fa.type ? (fa = await k.getRampStops(fa, null, ra), ha = {
                                            type: "color-ramp",
                                            title: ia,
                                            infos: fa,
                                            preview: y.renderColorRampPreviewHTML(fa.map(pa => pa.color))
                                        }, this._hasColorRamp || (this._hasColorRamp = !(null == ha.infos || !ha.infos.length))) : "size" === fa.type && "outline" !==
                                        fa.target ? wa.test(fa.valueExpression) ? this._hasClusterSizeVariable || (this._scaleDrivenSizeVariable = fa) : (ha = {
                                            type: "size-ramp",
                                            title: this._hasClusterSizeVariable ? this._getClusterTitle(fa) : ia,
                                            infos: await Y.getRampStops(a, fa, await this._getMedianColor(a), this.scale, this.view.type, ra)
                                        }, this._hasSizeRamp || (this._hasSizeRamp = !(null == ha.infos || !ha.infos.length))) : "opacity" === fa.type && (fa = await k.getRampStops(fa, ea, ra), ha = {
                                            type: "opacity-ramp",
                                            title: ia,
                                            infos: fa,
                                            preview: y.renderColorRampPreviewHTML(fa.map(pa =>
                                                pa.color))
                                        }, this._hasOpacityRamp || (this._hasOpacityRamp = !(null == ha.infos || !ha.infos.length)));
                                    return ha && ha.infos ? ha : null
                                }
                            }))).filter(fa => !!fa)
                        };
                        da._getDomainName = function(a, g, r) {
                            return a && "function" !== typeof a ? (r = (a = "getField" in r && r.getField && r.getField(a)) && "getFieldDomain" in r && r.getFieldDomain ? r.getFieldDomain(a.name) : null) && "coded-value" === r.type ? r.getName(g) : null : null
                        };
                        da._getClusterTitle = function(a) {
                            var g = this.layer;
                            a = a.field;
                            if ("featureReduction" in g && g.featureReduction && "cluster" === g.featureReduction.type &&
                                (g = g.featureReduction, g = (g = "popupTemplate" in g && g.popupTemplate) && g.fieldInfos))
                                for (const r of g)
                                    if (r.fieldName === a) return "cluster_count" === a ? r.label || {
                                        showCount: !0
                                    } : r.label;
                            return {
                                showCount: !0
                            }
                        };
                        da._getRampTitle = function(a, g) {
                            let r = a.field,
                                B = a.normalizationField,
                                K = !1,
                                O = !1,
                                ea = !1;
                            var Z = null;
                            r = "function" === typeof r ? null : r;
                            B = "function" === typeof B ? null : B;
                            Z = a.legendOptions && a.legendOptions.title;
                            if (null == Z)
                                if (a.valueExpressionTitle) Z = a.valueExpressionTitle;
                                else {
                                    if ("renderer" in g && g.renderer && "authoringInfo" in
                                        g.renderer && g.renderer.authoringInfo && g.renderer.authoringInfo.visualVariables)
                                        for (a = g.renderer.authoringInfo.visualVariables, Z = 0; Z < a.length; Z++) {
                                            const fa = a[Z];
                                            if ("color" === fa.type) {
                                                if ("ratio" === fa.style) {
                                                    K = !0;
                                                    break
                                                }
                                                if ("percent" === fa.style) {
                                                    O = !0;
                                                    break
                                                }
                                                if ("percent-of-total" === fa.style) {
                                                    ea = !0;
                                                    break
                                                }
                                            }
                                        }
                                    Z = {
                                        field: r && this._getFieldAlias(r, g),
                                        normField: B && this._getFieldAlias(B, g),
                                        ratio: K,
                                        ratioPercent: O,
                                        ratioPercentTotal: ea
                                    }
                                }
                            return Z
                        };
                        da._getRendererTitle = function(a, g) {
                            if (a.legendOptions && a.legendOptions.title) return a.legendOptions.title;
                            if (a.valueExpressionTitle) return a.valueExpressionTitle;
                            let r = a.field,
                                B = null,
                                K = null;
                            ba(a) && (B = a.normalizationField, K = "percent-of-total" === a.normalizationType);
                            r = "function" === typeof r ? null : r;
                            B = "function" === typeof B ? null : B;
                            a = null;
                            if (r || B) a = {
                                field: r && this._getFieldAlias(r, g),
                                normField: B && this._getFieldAlias(B, g),
                                normByPct: K
                            };
                            return a
                        };
                        da._getFieldAlias = function(a, g) {
                            var r = "popupTemplate" in g && g.popupTemplate;
                            r = r && r.fieldInfos;
                            let B = null;
                            r && r.some(O => a === O.fieldName ? (B = O, !0) : !1);
                            r = null;
                            "getField" in g &&
                                g.getField ? r = g.getField(a) : "fieldsIndex" in g && g.fieldsIndex && (r = g.fieldsIndex.get(a));
                            g = B || r;
                            let K = null;
                            g && (K = B && B.label || r && r.alias || "name" in g && g.name || "fieldName" in g && g.fieldName);
                            return K
                        };
                        da._isUnclassedRenderer = function(a) {
                            const g = a.visualVariables;
                            let r = !1;
                            ba(a) && a.classBreakInfos && 1 === a.classBreakInfos.length && g && (r = a.field ? g.some(B => !(!B || a.field !== B.field || (a.normalizationField || B.normalizationField) && a.normalizationField !== B.normalizationField)) : !!g.length);
                            return r
                        };
                        P._createClass(Aa, [{
                            key: "opacity",
                            get: function() {
                                var a;
                                const g = this.layer.opacity,
                                    r = null == (a = this.parent) ? void 0 : a.opacity;
                                a = (a = this.layer.parent) && "uid" in a ? this._getParentLayerOpacity(a) : null;
                                return null != r ? r * g : null != a ? a * g : g
                            }
                        }, {
                            key: "ready",
                            get: function() {
                                return null === this.layer ? !0 : 0 < this.children.length ? this._isGroupActive() : 0 < this.legendElements.length
                            }
                        }, {
                            key: "scale",
                            get: function() {
                                return this.view && this.view.scale
                            }
                        }, {
                            key: "isScaleDriven",
                            get: function() {
                                var a = this.layer;
                                if (null === a) return !1;
                                if ("featureReduction" in
                                    a && a.featureReduction && "cluster" === a.featureReduction.type) return !0;
                                if ("renderer" in a && a.renderer) {
                                    if ("dot-density" === a.renderer.type) return !0;
                                    const g = a.get("renderer.valueExpression");
                                    if (wa.test(g)) return !0;
                                    if (a = a.get("renderer.visualVariables")) return a.some(r => this._isScaleDrivenSizeVariable(r))
                                }
                                return this._isLayerScaleDriven(this.layer)
                            }
                        }, {
                            key: "version",
                            get: function() {
                                return this._get("version") + 1
                            }
                        }]);
                        return Aa
                    }(M);
                    A.__decorate([X.property()], v.prototype, "children", void 0);
                    A.__decorate([X.property()],
                        v.prototype, "layerView", void 0);
                    A.__decorate([X.property()], v.prototype, "layer", void 0);
                    A.__decorate([X.property()], v.prototype, "legendElements", void 0);
                    A.__decorate([X.property({
                        readOnly: !0
                    })], v.prototype, "opacity", null);
                    A.__decorate([X.property()], v.prototype, "parent", void 0);
                    A.__decorate([X.property({
                        readOnly: !0,
                        dependsOn: []
                    })], v.prototype, "ready", null);
                    A.__decorate([X.property()], v.prototype, "keepCacheOnDestroy", void 0);
                    A.__decorate([X.property()], v.prototype, "respectLayerVisibility", void 0);
                    A.__decorate([X.property({
                        readOnly: !0
                    })], v.prototype, "scale", null);
                    A.__decorate([X.property()], v.prototype, "sublayerIds", void 0);
                    A.__decorate([X.property({
                        readOnly: !0
                    })], v.prototype, "isScaleDriven", null);
                    A.__decorate([X.property()], v.prototype, "title", void 0);
                    A.__decorate([X.property({
                        readOnly: !0,
                        dependsOn: ["ready"],
                        value: 0
                    })], v.prototype, "version", null);
                    A.__decorate([X.property()], v.prototype, "view", void 0);
                    return v = A.__decorate([f.subclass("esri.widgets.Legend.support.ActiveLayerInfo")], v)
                })
        },
        "esri/layers/support/ExportImageParameters": function() {
            define("exports ../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/Accessor ./commonProperties ../../core/HandleOwner ./sublayerUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x) {
                    const L = {
                        visible: "visibleSublayers",
                        definitionExpression: "layerDefs",
                        labelingInfo: "hasDynamicLayers",
                        labelsVisible: "hasDynamicLayers",
                        opacity: "hasDynamicLayers",
                        minScale: "visibleSublayers",
                        maxScale: "visibleSublayers",
                        renderer: "hasDynamicLayers",
                        source: "hasDynamicLayers"
                    };
                    E.ExportImageParameters = function(Q) {
                        function C(H) {
                            H = Q.call(this, H) || this;
                            H.scale = 0;
                            return H
                        }
                        P._inheritsLoose(C, Q);
                        var S = C.prototype;
                        S.destroy = function() {
                            this.layer = null
                        };
                        S.toJSON = function() {
                            var H =
                                this.layer;
                            H = {
                                dpi: H.dpi,
                                format: H.imageFormat,
                                transparent: H.imageTransparency,
                                gdbVersion: H.gdbVersion || null
                            };
                            this.hasDynamicLayers && this.dynamicLayers ? H.dynamicLayers = this.dynamicLayers : H = { ...H,
                                layers: this.layers,
                                layerDefs: this.layerDefs
                            };
                            return H
                        };
                        P._createClass(C, [{
                            key: "dynamicLayers",
                            get: function() {
                                if (!this.hasDynamicLayers) return null;
                                const H = this.visibleSublayers.map(U => U.toExportImageJSON());
                                return H.length ? JSON.stringify(H) : null
                            }
                        }, {
                            key: "hasDynamicLayers",
                            get: function() {
                                return this.layer && x.isExportDynamic(this.visibleSublayers,
                                    this.layer.serviceSublayers, this.layer)
                            }
                        }, {
                            key: "layer",
                            set: function(H) {
                                this._get("layer") !== H && (this._set("layer", H), this.handles.remove("layer"), H && this.handles.add([H.allSublayers.on("change", () => this.notifyChange("visibleSublayers")), H.on("sublayer-update", U => this.notifyChange(L[U.propertyName]))], "layer"))
                            }
                        }, {
                            key: "layers",
                            get: function() {
                                const H = this.visibleSublayers;
                                return H ? H.length ? "show:" + H.map(U => U.id).join(",") : "show:-1" : null
                            }
                        }, {
                            key: "layerDefs",
                            get: function() {
                                const H = this.visibleSublayers.filter(U =>
                                    null != U.definitionExpression);
                                return H.length ? JSON.stringify(H.reduce((U, V) => {
                                    U[V.id] = V.definitionExpression;
                                    return U
                                }, {})) : null
                            }
                        }, {
                            key: "version",
                            get: function() {
                                this.commitProperty("layers");
                                this.commitProperty("layerDefs");
                                this.commitProperty("dynamicLayers");
                                this.commitProperty("timeExtent");
                                const H = this.layer;
                                H && (H.commitProperty("dpi"), H.commitProperty("imageFormat"), H.commitProperty("imageTransparency"), H.commitProperty("gdbVersion"));
                                return (this._get("version") || 0) + 1
                            }
                        }, {
                            key: "visibleSublayers",
                            get: function() {
                                const H = [];
                                if (!this.layer) return H;
                                var U = this.layer.sublayers;
                                const V = d => {
                                    const c = this.scale,
                                        n = 0 === d.minScale || c <= d.minScale,
                                        u = 0 === d.maxScale || c >= d.maxScale;
                                    d.visible && (0 === c || n && u) && (d.sublayers ? d.sublayers.forEach(V) : H.unshift(d))
                                };
                                U && U.forEach(V);
                                U = this._get("visibleSublayers");
                                return !U || U.length !== H.length || U.some((d, c) => H[c] !== d) ? H : U
                            }
                        }]);
                        return C
                    }(M.HandleOwnerMixin(D));
                    A.__decorate([J.property({
                        readOnly: !0
                    })], E.ExportImageParameters.prototype, "dynamicLayers", null);
                    A.__decorate([J.property({
                            readOnly: !0
                        })],
                        E.ExportImageParameters.prototype, "hasDynamicLayers", null);
                    A.__decorate([J.property()], E.ExportImageParameters.prototype, "layer", null);
                    A.__decorate([J.property({
                        readOnly: !0
                    })], E.ExportImageParameters.prototype, "layers", null);
                    A.__decorate([J.property({
                        readOnly: !0
                    })], E.ExportImageParameters.prototype, "layerDefs", null);
                    A.__decorate([J.property({
                        type: Number
                    })], E.ExportImageParameters.prototype, "scale", void 0);
                    A.__decorate([J.property(I.combinedViewLayerTimeExtentProperty)], E.ExportImageParameters.prototype,
                        "timeExtent", void 0);
                    A.__decorate([J.property({
                        readOnly: !0
                    })], E.ExportImageParameters.prototype, "version", null);
                    A.__decorate([J.property({
                        readOnly: !0
                    })], E.ExportImageParameters.prototype, "visibleSublayers", null);
                    E.ExportImageParameters = A.__decorate([N.subclass("esri.layers.mixins.ExportImageParameters")], E.ExportImageParameters);
                    Object.defineProperty(E, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/layers/support/sublayerUtils": function() {
            define(["exports"], function(E) {
                function P(A, v) {
                    if (!A || !A.length) return !0;
                    v = v.slice().reverse().flatten(({
                        sublayers: J
                    }) => J && J.toArray().reverse()).map(J => J.id).toArray();
                    if (A.length > v.length) return !1;
                    let m = 0;
                    const z = v.length;
                    for (const {
                            id: J
                        } of A) {
                        for (; m < z && v[m] !== J;) m++;
                        if (m >= z) return !1
                    }
                    return !0
                }
                E.isExportDynamic = function(A, v, m) {
                    return A.some(z => {
                            const J = z.source;
                            return !(!J || "map-layer" === J.type && J.mapLayerId === z.id && (!J.gdbVersion || J.gdbVersion === m.gdbVersion)) || 2 < z.originIdOf("renderer") || 2 < z.originIdOf("labelingInfo") || 2 < z.originIdOf("opacity") || 2 < z.originIdOf("labelsVisible")
                        }) ?
                        !0 : !P(A, v)
                };
                E.isSublayerOverhaul = function(A) {
                    return !!A && A.some(v => null != v.minScale || v.layerDefinition && null != v.layerDefinition.minScale)
                };
                E.shouldWriteSublayerStructure = function(A, v, m) {
                    return v.flatten(({
                        sublayers: z
                    }) => z).length !== A.length || A.some(z => z.originIdOf("minScale") > m || z.originIdOf("maxScale") > m || z.originIdOf("renderer") > m || z.originIdOf("labelingInfo") > m || z.originIdOf("opacity") > m || z.originIdOf("labelsVisible") > m || z.originIdOf("source") > m) ? !0 : !P(A, v)
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/renderers/support/rendererConversion": function() {
            define(["exports", "../../core/has", "../../core/maybe", "../../core/Error", "../../symbols/support/symbolConversion"], function(E, P, A, v, m) {
                function z(f) {
                    return A.isNone(f) || "simple" === f.type || "unique-value" === f.type || "class-breaks" === f.type || "dictionary" === f.type
                }

                function J(f, p) {
                    if (!p) return null;
                    p = Array.isArray(p) ? p : [p];
                    if (0 < p.length) {
                        const t = p.map(I => I.details.symbol.type || I.details.symbol.declaredClass).filter(I => !!I);
                        t.sort();
                        const D = [];
                        t.forEach((I, M) => {
                            0 !== M && I === t[M - 1] || D.push(I)
                        });
                        return new v("renderer-conversion-3d:unsupported-symbols", `Renderer contains symbols (${D.join(", ")}) which are not supported in 3D`, {
                            renderer: f,
                            symbolErrors: p
                        })
                    }
                    return null
                }

                function X(f) {
                    const p = f.uniqueValueInfos.map(D => m.to3D(D.symbol).error).filter(D => !!D),
                        t = m.to3D(f.defaultSymbol);
                    t.error && p.unshift(t.error);
                    return J(f, p)
                }

                function N(f) {
                    const p = f.classBreakInfos.map(D => m.to3D(D.symbol).error).filter(D => !!D),
                        t = m.to3D(f.defaultSymbol);
                    t.error &&
                        p.unshift(t.error);
                    return J(f, p)
                }
                E.isSupportedRenderer3D = z;
                E.validateTo3D = function(f) {
                    if (A.isNone(f)) return null;
                    if (!z(f)) return new v("renderer-conversion-3d:unsupported-renderer", `Unsupported renderer of type '${f.type||f.declaredClass}'`, {
                        renderer: f
                    });
                    switch (f.type) {
                        case "simple":
                            return J(f, m.to3D(f.symbol).error);
                        case "unique-value":
                            return X(f);
                        case "class-breaks":
                            return N(f)
                    }
                    return null
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/support/clusterUtils": function() {
            define(["exports",
                "../../../renderers/visualVariables/SizeVariable"
            ], function(E, P) {
                const A = (v, m) => {
                    v = v.featuresTilingScheme.getClosestInfoForScale(v.scale).level;
                    return null != m && m.levels ? m.levels[v] : null
                };
                E.getClusterSizeVariable = function(v, m) {
                    if (!(v && "visualVariables" in v && v.visualVariables)) return null;
                    v = v.visualVariables.find(z => "size" === z.type);
                    return (m = A(m, v)) ? new P({
                        field: v.field,
                        minSize: m[2].size,
                        minDataValue: m[2].value,
                        maxSize: m[3].size,
                        maxDataValue: m[3].value
                    }) : null
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/support/utils": function() {
            define(["exports", "../../../intl/date", "../../../renderers/support/numberUtils"], function(E, P, A) {
                const v = P.convertDateFormatToIntlOptions("short-date");
                E.RGB_IMG_SOURCE = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwcdIkqhiWn5fHwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6JrzFUAAAAASUVORK5CYII\x3d", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwaeIkqhiWl5/HwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6sKxboAAAAASUVORK5CYII\x3d",
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwadJEqhiWl5fPwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu75+IUcAAAAASUVORK5CYII\x3d"
                ];
                E.createStopLabel = function(m, z, J, X) {
                    let N = "";
                    0 === z ? N = "\x3c " : z === J && (N = "\x3e ");
                    z = null;
                    z = X ? P.formatDate(m, v) : A.format(m);
                    return N + z
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/renderers/support/numberUtils": function() {
            define(["exports", "../../intl/number", "../../intl"], function(E,
                P, A) {
                function v(p, t) {
                    return p - t
                }

                function m(p, t) {
                    let D;
                    D = Number(p.toFixed(t));
                    D < p ? p = D + 1 / 10 ** t : (p = D, D -= 1 / 10 ** t);
                    D = Number(D.toFixed(t));
                    p = Number(p.toFixed(t));
                    return [D, p]
                }

                function z(p, t, D, I, M) {
                    p = X(p, t, D, I);
                    t = null == p.next || p.next <= M;
                    return (null == p.previous || p.previous <= M) && t || p.previous + p.next <= 2 * M
                }

                function J(p) {
                    p = String(p);
                    var t = p.match(N);
                    if (t && t[1]) return {
                        integer: t[1].split("").length,
                        fractional: t[3] ? t[3].split("").length : 0
                    };
                    if (-1 < p.toLowerCase().indexOf("e") && (t = p.split("e"), p = t[0], t = t[1], p && t)) {
                        p =
                            Number(p);
                        t = Number(t);
                        const D = 0 < t;
                        D || (t = Math.abs(t));
                        p = J(p);
                        D ? (p.integer += t, p.fractional = t > p.fractional ? 0 : p.fractional - t) : (p.fractional += t, p.integer = t > p.integer ? 1 : p.integer - t);
                        return p
                    }
                    return {
                        integer: 0,
                        fractional: 0
                    }
                }

                function X(p, t, D, I) {
                    const M = {
                        previous: null,
                        next: null
                    };
                    if (null != D) {
                        const x = p - D;
                        M.previous = Math.floor(Math.abs(100 * (t - D - x) / x))
                    }
                    null != I && (p = I - p, M.next = Math.floor(Math.abs(100 * (I - t - p) / p)));
                    return M
                }
                const N = /^-?(\d+)(\.(\d+))?$/i,
                    f = {
                        maximumFractionDigits: 20
                    };
                E.format = function(p) {
                    return P.formatNumber(p,
                        f)
                };
                E.numDigits = J;
                E.percentChange = X;
                E.round = function(p, t = {}) {
                    p = p.slice(0);
                    const {
                        tolerance: D = 2,
                        strictBounds: I = !1,
                        indexes: M = p.map((L, Q) => Q)
                    } = t;
                    M.sort(v);
                    for (t = 0; t < M.length; t++) {
                        const L = M[t],
                            Q = p[L],
                            C = 0 === L ? null : p[L - 1],
                            S = L === p.length - 1 ? null : p[L + 1],
                            H = J(Q).fractional;
                        if (H) {
                            let U = 0,
                                V = !1;
                            for (var x = void 0; U <= H && !V;) x = m(Q, U), x = I && 0 === t ? x[1] : x[0], V = z(Q, x, C, S, D), U++;
                            V && (p[L] = x)
                        }
                    }
                    return p
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/support/colorRampUtils": function() {
            define(["require",
                "exports", "../../../Color", "./utils"
            ], function(E, P, A, v) {
                function m(f, p) {
                    const t = [],
                        D = f.length - 1;
                    5 === f.length ? t.push(0, 2, 4) : t.push(0, D);
                    return f.map((I, M) => -1 < t.indexOf(M) ? v.createStopLabel(I, M, D, p) : null)
                }
                async function z(f, p, t = N) {
                    t = new A(t);
                    f = (await new Promise(function(D, I) {
                        E(["../../../renderers/visualVariables/support/visualVariableUtils"], D, I)
                    })).getOpacity(p, f);
                    null != f && (t.a = f);
                    return t
                }

                function J(f, p) {
                    const {
                        startIndex: t,
                        endIndex: D,
                        weight: I
                    } = X(f, p);
                    if (t === D) return p[t].color;
                    f = A.blendColors(p[t].color,
                        p[D].color, I);
                    return new A(f)
                }

                function X(f, p) {
                    let t = 0,
                        D = p.length - 1;
                    p.some((I, M) => {
                        if (f < I.value) return D = M, !0;
                        t = M;
                        return !1
                    });
                    return {
                        startIndex: t,
                        endIndex: D,
                        weight: (f - p[t].value) / (p[D].value - p[t].value)
                    }
                }
                const N = new A([64, 64, 64]);
                P.getColorFromPointCloudStops = J;
                P.getRampStops = async function(f, p, t) {
                    let D = !1,
                        I = [],
                        M = [];
                    if (f.stops) {
                        var x = f.stops;
                        I = x.map(Q => Q.value);
                        (D = x.some(Q => !!Q.label)) && (M = x.map(Q => Q.label))
                    }
                    x = I[I.length - 1];
                    if (null == I[0] && null == x) return null;
                    const L = D ? null : m(I, t);
                    return (await Promise.all(I.map(async (Q,
                        C) => {
                        const S = "opacity" === f.type ? await z(Q, f, p) : (await new Promise(function(H, U) {
                            E(["../../../renderers/visualVariables/support/visualVariableUtils"], H, U)
                        })).getColor(f, Q);
                        return {
                            value: Q,
                            color: S,
                            label: D ? M[C] : L[C]
                        }
                    }))).reverse()
                };
                P.getRampStopsForPointCloud = function(f) {
                    let p = !1,
                        t = [],
                        D = [];
                    t = f.map(x => x.value);
                    (p = f.some(x => !!x.label)) && (D = f.map(x => x.label));
                    const I = t[t.length - 1];
                    if (null == t[0] && null == I) return null;
                    const M = p ? null : m(t, !1);
                    return t.map((x, L) => {
                        const Q = J(x, f);
                        return {
                            value: x,
                            color: Q,
                            label: p ?
                                D[L] : M[L]
                        }
                    }).reverse()
                };
                P.getStrectchRampStops = function(f, p) {
                    let t = [];
                    if (f && "multipart" === f.type) f.colorRamps.reverse().forEach(function(D, I) {
                        0 === I ? t.push({
                            value: p.max,
                            color: new A(D.toColor),
                            label: "high"
                        }) : t.push({
                            value: null,
                            color: new A(D.toColor),
                            label: ""
                        });
                        I === f.colorRamps.length - 1 ? t.push({
                            value: p.min,
                            color: new A(D.fromColor),
                            label: "low"
                        }) : t.push({
                            value: null,
                            color: new A(D.fromColor),
                            label: ""
                        })
                    });
                    else {
                        let D, I;
                        f && "algorithmic" === f.type ? (D = f.fromColor, I = f.toColor) : (D = [0, 0, 0, 1], I = [255, 255, 255, 1]);
                        t = [{
                            value: p.max,
                            color: new A(I),
                            label: "high"
                        }, {
                            value: p.min,
                            color: new A(D),
                            label: "low"
                        }]
                    }
                    return t
                };
                Object.defineProperty(P, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/support/heatmapRampUtils": function() {
            define(["exports", "../../../renderers/support/HeatmapColorStop"], function(E, P) {
                E.getHeatmapRampStops = function(A) {
                    A = A.colorStops;
                    let v = A.length - 1;
                    if (A && A[0]) {
                        const m = A[v];
                        m && 1 !== m.ratio && (A = A.slice(0), A.push(new P({
                            ratio: 1,
                            color: m.color
                        })), v++)
                    }
                    return A.map((m, z) => {
                        let J = "";
                        0 === z ? J = "low" : z === v && (J =
                            "high");
                        return {
                            color: m.color,
                            label: J,
                            ratio: m.ratio
                        }
                    }).reverse()
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/support/relationshipRampUtils": function() {
            define(["exports", "../../../core/lang", "../../../symbols/support/gfxUtils", "../../../symbols/support/previewSymbol3D"], function(E, P, A, v) {
                function m(f) {
                    if (f) {
                        var {
                            type: p
                        } = f;
                        return -1 < p.indexOf("3d") ? v.getSymbolLayerFill(f.symbolLayers.getItemAt(0)) : "simple-line" === p || "simple-marker" === f.type && ("x" === f.style || "cross" === f.style) ?
                            (f = A.getStroke(f)) && f.color : A.getFill(f)
                    }
                }

                function z(f, p) {
                    const t = p.HH.label,
                        D = p.LL.label,
                        I = p.HL.label;
                    p = p.LH.label;
                    switch (f) {
                        case "HH":
                            return {
                                top: t,
                                bottom: D,
                                left: I,
                                right: p
                            };
                        case "HL":
                            return {
                                top: I,
                                bottom: p,
                                left: D,
                                right: t
                            };
                        case "LL":
                            return {
                                top: D,
                                bottom: t,
                                left: p,
                                right: I
                            };
                        case "LH":
                            return {
                                top: p,
                                bottom: I,
                                left: t,
                                right: D
                            };
                        default:
                            return {
                                top: t,
                                bottom: D,
                                left: I,
                                right: p
                            }
                    }
                }

                function J(f) {
                    let p = X[f];
                    f && null == p && (p = X.HH);
                    return p || 0
                }
                const X = {
                        HH: 315,
                        HL: 45,
                        LL: 135,
                        LH: 225
                    },
                    N = {
                        2: [
                            ["HL", "HH"],
                            ["LL", "LH"]
                        ],
                        3: [
                            ["HL", "HM",
                                "HH"
                            ],
                            ["ML", "MM", "MH"],
                            ["LL", "LM", "LH"]
                        ],
                        4: [
                            ["HL", "HM1", "HM2", "HH"],
                            ["M2L", "M2M1", "M2M2", "M2H"],
                            ["M1L", "M1M1", "M1M2", "M1H"],
                            ["LL", "LM1", "LM2", "LH"]
                        ]
                    };
                E.getRelationshipRampColors2D = function(f, p) {
                    const t = [],
                        D = f.length ** .5;
                    f = P.clone(f);
                    var I = (p || "HH").split("");
                    p = I[0];
                    for (I = "H" === I[1]; f.length;) {
                        const M = [];
                        for (; M.length < D;) M.push(f.shift());
                        I && M.reverse();
                        t.push(M)
                    }
                    "L" === p && t.reverse();
                    return t
                };
                E.getRelationshipRampElement = function(f) {
                    const {
                        focus: p,
                        infos: t,
                        numClasses: D
                    } = f;
                    var I = N[D];
                    const M = {};
                    t.forEach(x => {
                        M[x.value] = {
                            label: x.label,
                            fill: m(x.symbol)
                        }
                    });
                    f = [];
                    for (let x = 0; x < D; x++) {
                        const L = [];
                        for (let Q = 0; Q < D; Q++) L.push(M[I[x][Q]].fill);
                        f.push(L)
                    }
                    I = z(p, M);
                    return {
                        type: "relationship-ramp",
                        numClasses: D,
                        focus: p,
                        colors: f,
                        labels: I,
                        rotation: J(p)
                    }
                };
                E.getRotationAngleForFocus = J;
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/symbols/support/previewSymbol3D": function() {
            define("exports ../../core/has ../../core/maybe ../../core/Logger ../../core/Error ../../core/promiseUtils ../../core/screenUtils ./IconSymbol3DLayerResource ../../assets ./ObjectSymbol3DLayerResource ../../core/colorUtils ./styleUtils ./gfxUtils ./utils ./previewUtils ./renderUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x) {
                    function L(l) {
                        const b = l.outline;
                        var e = A.isSome(l.material) ? l.material.color : null;
                        e = A.isSome(e) ? e.toHex() : null;
                        if (A.isNone(b)) return "fill" === l.type && "#ffffff" === e ? {
                            color: "#bdc3c7",
                            width: .75
                        } : null;
                        l = J.pt2px(b.size) || 0;
                        return {
                            color: "rgba(" + (A.isSome(b.color) ? b.color.toRgba() : "255,255,255,1") + ")",
                            width: Math.min(l, 80)
                        }
                    }

                    function Q(l, b) {
                        var e = b && b.resource;
                        e = e && e.href;
                        if (l.thumbnail && l.thumbnail.url) return Promise.resolve(l.thumbnail.url);
                        if (e && "object" !== b.type) return Promise.resolve(I.getIconHref(l,
                            b));
                        const k = N.getAssetUrl("esri/images/Legend/legend3dsymboldefault.png");
                        return l.styleOrigin && (l.styleOrigin.styleName || l.styleOrigin.styleUrl) ? t.resolveWebStyleSymbol(l.styleOrigin, {
                            portal: l.styleOrigin.portal
                        }, "webRef").catch(G => G).then(G => {
                            var R;
                            return (null == G ? void 0 : null == (R = G.thumbnail) ? void 0 : R.url) || k
                        }) : Promise.resolve(k)
                    }

                    function C(l, b = 1) {
                        const e = l.a;
                        l = p.toHSV(l);
                        const {
                            r: k,
                            g: G,
                            b: R
                        } = p.toRGB({
                            h: l.h,
                            s: l.s / b,
                            v: 100 - (100 - l.v) / b
                        });
                        return [k, G, R, e]
                    }

                    function S(l) {
                        return "water" === l.type ? A.isNone(l.color) ?
                            null : l.color : A.isNone(l.material) || A.isNone(l.material.color) ? null : l.material.color
                    }

                    function H(l, b = 0) {
                        var e = S(l);
                        if (!e) {
                            if ("fill" === l.type) return null;
                            b = M.adjustColorComponentBrightness(D.defaultThematicColor.r, b);
                            return [b, b, b, 100]
                        }
                        l = e.toRgba();
                        for (e = 0; 3 > e; e++) l[e] = M.adjustColorComponentBrightness(l[e], b);
                        return l
                    }
                    async function U(l, b) {
                        l = l.style;
                        return "none" === l ? null : {
                            type: "pattern",
                            x: 0,
                            y: 0,
                            src: await D.getPatternUrlWithColor(N.getAssetUrl(`esri/symbols/patterns/${l}.png`), b.toCss(!0)),
                            width: 5,
                            height: 5
                        }
                    }

                    function V(l) {
                        return l.outline ? L(l) : {
                            color: "rgba(0, 0, 0, 1)",
                            width: 1.5
                        }
                    }

                    function d(l, b) {
                        l = S(l);
                        if (!l) return null;
                        let e;
                        e = "rgba(" + (M.adjustColorComponentBrightness(l.r, b) + ",");
                        e += M.adjustColorComponentBrightness(l.g, b) + ",";
                        e += M.adjustColorComponentBrightness(l.b, b) + ",";
                        return e + l.a + ");"
                    }

                    function c(l, b) {
                        b = d(l, b);
                        if (!b) return {};
                        l = Math.min(l.size ? J.pt2px(l.size) : .75, 80);
                        return {
                            color: b,
                            width: l
                        }
                    }

                    function n(l, b, e) {
                        e *= .75;
                        return {
                            type: "linear",
                            x1: e ? .25 * e : 0,
                            y1: e ? .5 * e : 0,
                            x2: e || 4,
                            y2: e ? .5 * e : 4,
                            colors: [{
                                color: l,
                                offset: 0
                            }, {
                                color: b,
                                offset: 1
                            }]
                        }
                    }

                    function u(l) {
                        const b = l.depth,
                            e = l.height;
                        return (l = l.width) && b && e && l === b && l < e
                    }

                    function F(l, b, e) {
                        const k = [];
                        if (!l) return k;
                        switch (l.type) {
                            case "icon":
                                switch (l.resource && l.resource.primitive || X.defaultPrimitive) {
                                    case "circle":
                                        k.push({
                                            shape: {
                                                type: "circle",
                                                cx: 0,
                                                cy: 0,
                                                r: .5 * b
                                            },
                                            fill: H(l, 0),
                                            stroke: L(l)
                                        });
                                        break;
                                    case "square":
                                        k.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [0, b]
                                                }, {
                                                    command: "L",
                                                    values: [0, 0]
                                                }, {
                                                    command: "L",
                                                    values: [b, 0]
                                                }, {
                                                    command: "L",
                                                    values: [b, b]
                                                }, {
                                                    command: "Z",
                                                    values: []
                                                }]
                                            },
                                            fill: H(l, 0),
                                            stroke: L(l)
                                        });
                                        break;
                                    case "triangle":
                                        k.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [0, b]
                                                }, {
                                                    command: "L",
                                                    values: [.5 * b, 0]
                                                }, {
                                                    command: "L",
                                                    values: [b, b]
                                                }, {
                                                    command: "Z",
                                                    values: []
                                                }]
                                            },
                                            fill: H(l, 0),
                                            stroke: L(l)
                                        });
                                        break;
                                    case "cross":
                                        k.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [.5 * b, 0]
                                                }, {
                                                    command: "L",
                                                    values: [.5 * b, b]
                                                }, {
                                                    command: "M",
                                                    values: [0, .5 * b]
                                                }, {
                                                    command: "L",
                                                    values: [b, .5 * b]
                                                }]
                                            },
                                            stroke: V(l)
                                        });
                                        break;
                                    case "x":
                                        k.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [0, 0]
                                                }, {
                                                    command: "L",
                                                    values: [b, b]
                                                }, {
                                                    command: "M",
                                                    values: [b, 0]
                                                }, {
                                                    command: "L",
                                                    values: [0, b]
                                                }]
                                            },
                                            stroke: V(l)
                                        });
                                        break;
                                    case "kite":
                                        k.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [0, .5 * b]
                                                }, {
                                                    command: "L",
                                                    values: [.5 * b, 0]
                                                }, {
                                                    command: "L",
                                                    values: [b, .5 * b]
                                                }, {
                                                    command: "L",
                                                    values: [.5 * b, b]
                                                }, {
                                                    command: "Z",
                                                    values: []
                                                }]
                                            },
                                            fill: H(l, 0),
                                            stroke: L(l)
                                        })
                                }
                                break;
                            case "object":
                                switch (l.resource && l.resource.primitive || f.defaultPrimitive) {
                                    case "cone":
                                        var G = H(l, 0);
                                        l = H(l, -.6);
                                        l = n(G, l, e ? 20 : b);
                                        b = M.getConeShapes(b, e);
                                        k.push({
                                            shape: b[0],
                                            fill: l
                                        });
                                        k.push({
                                            shape: b[1],
                                            fill: l
                                        });
                                        break;
                                    case "inverted-cone":
                                        e = H(l, 0);
                                        l = H(l, -.6);
                                        l = n(e, l, b);
                                        b = M.getInvertedConeShapes(b);
                                        k.push({
                                            shape: b[0],
                                            fill: l
                                        });
                                        k.push({
                                            shape: b[1],
                                            fill: e
                                        });
                                        break;
                                    case "cube":
                                        b = M.getCubeShapes(b, e);
                                        k.push({
                                            shape: b[0],
                                            fill: H(l, 0)
                                        });
                                        k.push({
                                            shape: b[1],
                                            fill: H(l, -.3)
                                        });
                                        k.push({
                                            shape: b[2],
                                            fill: H(l, -.5)
                                        });
                                        break;
                                    case "cylinder":
                                        {
                                            G = H(l, 0);
                                            const R = H(l, -.6);G = n(G, R, e ? 20 : b);b = M.getCylinderShapes(b, e);k.push({
                                                shape: b[0],
                                                fill: G
                                            });k.push({
                                                shape: b[1],
                                                fill: G
                                            });k.push({
                                                shape: b[2],
                                                fill: H(l, 0)
                                            });
                                            break
                                        }
                                    case "diamond":
                                        b = M.getDiamondShapes(b);
                                        k.push({
                                            shape: b[0],
                                            fill: H(l, -.3)
                                        });
                                        k.push({
                                            shape: b[1],
                                            fill: H(l, 0)
                                        });
                                        k.push({
                                            shape: b[2],
                                            fill: H(l, -.3)
                                        });
                                        k.push({
                                            shape: b[3],
                                            fill: H(l, -.7)
                                        });
                                        break;
                                    case "sphere":
                                        e = H(l, 0);
                                        l = H(l, -.6);
                                        l = n(e, l);
                                        l.x1 = 0;
                                        l.y1 = 0;
                                        l.x2 = .25 * b;
                                        l.y2 = .25 * b;
                                        k.push({
                                            shape: {
                                                type: "circle",
                                                cx: 0,
                                                cy: 0,
                                                r: .5 * b
                                            },
                                            fill: l
                                        });
                                        break;
                                    case "tetrahedron":
                                        b = M.getTetrahedronShapes(b), k.push({
                                            shape: b[0],
                                            fill: H(l, -.3)
                                        }), k.push({
                                            shape: b[1],
                                            fill: H(l, 0)
                                        }), k.push({
                                            shape: b[2],
                                            fill: H(l, -.6)
                                        })
                                }
                        }
                        return k
                    }

                    function h(l, b) {
                        const e = b && b.size ? J.pt2px(b.size) : null,
                            k =
                            b && b.maxSize ? J.pt2px(b.maxSize) : null,
                            G = b && b.disableUpsampling,
                            R = l.symbolLayers,
                            Y = [];
                        let W = 0,
                            ba = 0;
                        const T = R.getItemAt(R.length - 1);
                        let ja;
                        T && "icon" === T.type && (ja = T.size && J.pt2px(T.size));
                        R.forEach(aa => {
                            if ("icon" === aa.type || "object" === aa.type) {
                                var ka = "icon" === aa.type ? aa.size && J.pt2px(aa.size) : 0,
                                    ca = e || ka ? Math.ceil(Math.min(e || ka, k || 120)) : 22;
                                if (aa && aa.resource && aa.resource.href) {
                                    var oa = Q(l, aa).then(function(ma) {
                                        const sa = aa.get("material.color");
                                        var ua = "icon" === aa.type ? "multiply" : "tint";
                                        return x.tintImageWithColor(ma,
                                            ca, sa, ua, G)
                                    }).then(function(ma) {
                                        const sa = ma.width,
                                            ua = ma.height;
                                        W = Math.max(W, sa);
                                        ba = Math.max(ba, ua);
                                        return [{
                                            shape: {
                                                type: "image",
                                                x: 0,
                                                y: 0,
                                                width: sa,
                                                height: ua,
                                                src: ma.url
                                            },
                                            fill: null,
                                            stroke: null
                                        }]
                                    });
                                    Y.push(oa)
                                } else {
                                    let ma = ca;
                                    "icon" === aa.type && ja && e && (ma = ka / ja * ca);
                                    ka = "tall" === (null == b ? void 0 : b.symbolConfig) || (null == b ? void 0 : null == (oa = b.symbolConfig) ? void 0 : oa.isTall) || ("object" === aa.type ? u(aa) : !1);
                                    W = Math.max(W, ka ? 20 : ma);
                                    ba = Math.max(ba, ma);
                                    Y.push(Promise.resolve(F(aa, ma, ka)))
                                }
                            }
                        });
                        return z.eachAlways(Y).then(function(aa) {
                            const ka = [];
                            aa.forEach(function(ca) {
                                ca.value ? ka.push(ca.value) : ca.error && y.warn("error while building swatchInfo!", ca.error)
                            });
                            return x.renderSymbol(ka, [W, ba], {
                                node: b && b.node,
                                scale: !1,
                                opacity: b && b.opacity
                            })
                        })
                    }

                    function w(l, b) {
                        const e = l.symbolLayers,
                            k = [];
                        l = I.isVolumetricSymbol(l);
                        const G = b && b.size ? J.pt2px(b.size) : null,
                            R = (b && b.maxSize ? J.pt2px(b.maxSize) : null) || 80;
                        let Y = 0,
                            W = 0,
                            ba;
                        e.forEach((T, ja) => {
                            if (T && ("line" === T.type || "path" === T.type)) {
                                var aa = [];
                                switch (T.type) {
                                    case "line":
                                        var ka = c(T, 0),
                                            ca = ka && ka.width || 0;
                                        0 ===
                                            ja && (ba = ca);
                                        var oa = Math.min(G || ca, R);
                                        ja = 0 === ja ? oa : G ? ca / ba * oa : oa;
                                        ca = 20 < ja ? 2 * ja : 40;
                                        W = Math.max(W, ja);
                                        Y = Math.max(Y, ca);
                                        ka.width = ja;
                                        aa.push({
                                            shape: {
                                                type: "path",
                                                path: [{
                                                    command: "M",
                                                    values: [0, .5 * W]
                                                }, {
                                                    command: "L",
                                                    values: [Y, .5 * W]
                                                }]
                                            },
                                            stroke: ka
                                        });
                                        break;
                                    case "path":
                                        ja = Math.min(G || 22, R);
                                        ka = H(T, 0);
                                        ca = H(T, -.2);
                                        var ma = d(T, -.4);
                                        ma = ma ? {
                                            color: ma,
                                            width: 1
                                        } : {};
                                        if ("quad" === T.profile) {
                                            var sa;
                                            const ua = null != (sa = T.width) ? sa : T.size;
                                            T = null != (oa = T.height) ? oa : T.size;
                                            oa = M.getPathSymbolShapes(ua && T ? ua / T : 1, 0 === T, 0 === ua);
                                            T = { ...ma,
                                                join: "bevel"
                                            };
                                            aa.push({
                                                shape: oa[0],
                                                fill: ca,
                                                stroke: T
                                            });
                                            aa.push({
                                                shape: oa[1],
                                                fill: ca,
                                                stroke: T
                                            });
                                            aa.push({
                                                shape: oa[2],
                                                fill: ka,
                                                stroke: T
                                            })
                                        } else aa.push({
                                            shape: M.shapes.pathSymbol3DLayer[0],
                                            fill: ca,
                                            stroke: ma
                                        }), aa.push({
                                            shape: M.shapes.pathSymbol3DLayer[1],
                                            fill: ka,
                                            stroke: ma
                                        });
                                        Y = W = Math.max(W, ja)
                                }
                                k.push(aa)
                            }
                        });
                        return Promise.resolve(x.renderSymbol(k, [Y, W], {
                            node: b && b.node,
                            scale: l,
                            opacity: b && b.opacity
                        }))
                    }
                    async function q(l, b) {
                        const e = "mesh-3d" === l.type;
                        l = l.symbolLayers;
                        var k = b && b.size ? J.pt2px(b.size) : null;
                        const G =
                            b && b.maxSize ? J.pt2px(b.maxSize) : null;
                        k = k || 22;
                        const R = [];
                        let Y = 0,
                            W = 0;
                        var ba = !1;
                        for (let oa = 0; oa < l.length; oa++) {
                            var T = l.getItemAt(oa);
                            const ma = [];
                            if (!e || "fill" === T.type) {
                                var ja = M.shapes.fill[0];
                                switch (T.type) {
                                    case "fill":
                                        var aa = L(T);
                                        ba = Math.min(k, G || 120);
                                        Y = Math.max(Y, ba);
                                        W = Math.max(W, ba);
                                        ba = !0;
                                        var ka = H(T, 0),
                                            ca = "pattern" in T && T.pattern;
                                        T = S(T);
                                        !e && A.isSome(ca) && "style" === ca.type && "solid" !== ca.style && T && (ka = await U(ca, T));
                                        ma.push({
                                            shape: ja,
                                            fill: ka,
                                            stroke: aa
                                        });
                                        break;
                                    case "line":
                                        T = {
                                            stroke: c(T, 0),
                                            shape: ja
                                        };
                                        Y = Math.max(Y, 22);
                                        W = Math.max(W, 22);
                                        ma.push(T);
                                        break;
                                    case "extrude":
                                        ja = {
                                            join: "round",
                                            ...c(T, -.4)
                                        };
                                        aa = H(T, 0);
                                        T = H(T, -.2);
                                        ka = Math.min(k, G || 120);
                                        ca = M.getExtrudeSymbolShapes(ka);
                                        ja.width = 1;
                                        ma.push({
                                            shape: ca[0],
                                            fill: T,
                                            stroke: ja
                                        });
                                        ma.push({
                                            shape: ca[1],
                                            fill: T,
                                            stroke: ja
                                        });
                                        ma.push({
                                            shape: ca[2],
                                            fill: aa,
                                            stroke: ja
                                        });
                                        T = 22 * .7 + .5 * ka;
                                        Y = Math.max(Y, 22);
                                        W = Math.max(W, T);
                                        break;
                                    case "water":
                                        ba = S(T), T = C(ba), ja = C(ba, 2), aa = C(ba, 3), ka = M.getWaterSymbolShapes(), ba = !0, ma.push({
                                                shape: ka[0],
                                                fill: T
                                            }), ma.push({
                                                shape: ka[1],
                                                fill: ja
                                            }),
                                            ma.push({
                                                shape: ka[2],
                                                fill: aa
                                            }), T = Math.min(k, G || 120), Y = Math.max(Y, T), W = Math.max(W, T)
                                }
                                R.push(ma)
                            }
                        }
                        return Promise.resolve(x.renderSymbol(R, [Y, W], {
                            node: b && b.node,
                            scale: ba,
                            opacity: b && b.opacity
                        }))
                    }
                    const y = v.getLogger("esri.symbols.support.previewSymbol3D");
                    E.getPatternDescriptor = U;
                    E.getSymbolLayerFill = H;
                    E.previewSymbol3D = function(l, b) {
                        if (0 === l.symbolLayers.length) return Promise.reject(new m("symbolPreview: renderPreviewHTML3D", "No symbolLayers in the symbol."));
                        let e = null;
                        switch (l.type) {
                            case "point-3d":
                                e =
                                    h(l, b);
                                break;
                            case "line-3d":
                                e = w(l, b);
                                break;
                            case "polygon-3d":
                            case "mesh-3d":
                                e = q(l, b)
                        }
                        return e ? e : Promise.reject(new m("symbolPreview: swatchInfo3D", "symbol not supported."))
                    };
                    Object.defineProperty(E, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/core/colorUtils": function() {
            define(["exports"], function(E) {
                function P(f, p) {
                    const t = [];
                    let D, I;
                    if (f[0].length !== p.length) throw "dimensions do not match";
                    const M = f.length,
                        x = f[0].length;
                    let L = 0;
                    for (D = 0; D < M; D++) {
                        for (I = L = 0; I < x; I++) L += f[D][I] * p[I];
                        t.push(L)
                    }
                    return t
                }

                function A(f) {
                    f = [f.r / 255, f.g / 255, f.b / 255].map(p => .04045 >= p ? p / 12.92 : ((p + .055) / 1.055) ** 2.4);
                    f = P(X, f);
                    return {
                        x: 100 * f[0],
                        y: 100 * f[1],
                        z: 100 * f[2]
                    }
                }

                function v(f) {
                    f = P(N, [f.x / 100, f.y / 100, f.z / 100]).map(p => Math.min(1, Math.max(.0031308 >= p ? 12.92 * p : 1.055 * p ** (1 / 2.4) - .055, 0)));
                    return {
                        r: Math.round(255 * f[0]),
                        g: Math.round(255 * f[1]),
                        b: Math.round(255 * f[2])
                    }
                }

                function m(f) {
                    f = [f.x / 95.047, f.y / 100, f.z / 108.883].map(p => p > (6 / 29) ** 3 ? p ** (1 / 3) : 1 / 3 * (29 / 6) ** 2 * p + 4 / 29);
                    return {
                        l: 116 * f[1] - 16,
                        a: 500 * (f[0] - f[1]),
                        b: 200 * (f[1] - f[2])
                    }
                }

                function z(f) {
                    const p =
                        f.l;
                    f = [(p + 16) / 116 + f.a / 500, (p + 16) / 116, (p + 16) / 116 - f.b / 200].map(t => t > 6 / 29 ? t ** 3 : 3 * (6 / 29) ** 2 * (t - 4 / 29));
                    return {
                        x: 95.047 * f[0],
                        y: 100 * f[1],
                        z: 108.883 * f[2]
                    }
                }

                function J(f) {
                    if ("r" in f && "g" in f && "b" in f) return f;
                    if ("l" in f && "c" in f && "h" in f) {
                        var p = f.c;
                        var t = f.h;
                        p = {
                            l: f.l,
                            a: p * Math.cos(t),
                            b: p * Math.sin(t)
                        };
                        return v(z(p))
                    }
                    if ("l" in f && "a" in f && "b" in f) return v(z(f));
                    if ("x" in f && "y" in f && "z" in f) return v(f);
                    if ("h" in f && "s" in f && "v" in f) {
                        {
                            t = (f.h + 360) % 360 / 60;
                            p = f.v / 100 * 255;
                            f = f.s / 100 * p;
                            const D = f * (1 - Math.abs(t % 2 - 1));
                            switch (Math.floor(t)) {
                                case 0:
                                    t = {
                                        r: f,
                                        g: D,
                                        b: 0
                                    };
                                    break;
                                case 1:
                                    t = {
                                        r: D,
                                        g: f,
                                        b: 0
                                    };
                                    break;
                                case 2:
                                    t = {
                                        r: 0,
                                        g: f,
                                        b: D
                                    };
                                    break;
                                case 3:
                                    t = {
                                        r: 0,
                                        g: D,
                                        b: f
                                    };
                                    break;
                                case 4:
                                    t = {
                                        r: D,
                                        g: 0,
                                        b: f
                                    };
                                    break;
                                case 5:
                                case 6:
                                    t = {
                                        r: f,
                                        g: 0,
                                        b: D
                                    };
                                    break;
                                default:
                                    t = {
                                        r: 0,
                                        g: 0,
                                        b: 0
                                    }
                            }
                            t.r = Math.round(t.r + p - f);
                            t.g = Math.round(t.g + p - f);
                            t.b = Math.round(t.b + p - f);
                            p = t
                        }
                        return p
                    }
                    return f
                }
                const X = [
                        [.4124, .3576, .1805],
                        [.2126, .7152, .0722],
                        [.0193, .1192, .9505]
                    ],
                    N = [
                        [3.2406, -1.5372, -.4986],
                        [-.9689, 1.8758, .0415],
                        [.0557, -.204, 1.057]
                    ];
                E.darken = function(f, p) {
                    f = m(A(f));
                    f.l *= 1 - p;
                    return v(z(f))
                };
                E.toHSV = function(f) {
                    if ("h" in
                        f && "s" in f && "v" in f) return f;
                    var p = J(f); {
                        f = p.r;
                        const t = p.g,
                            D = p.b;
                        p = Math.max(f, t, D);
                        const I = p - Math.min(f, t, D);
                        f = 0 === I ? 0 : p === f ? (t - D) / I % 6 : p === t ? (D - f) / I + 2 : (f - t) / I + 4;
                        0 > f && (f += 6);
                        f = {
                            h: 60 * f,
                            s: 100 * (0 === I ? 0 : I / p),
                            v: 100 / 255 * p
                        }
                    }
                    return f
                };
                E.toLAB = function(f) {
                    return "l" in f && "a" in f && "b" in f ? f : m(A(J(f)))
                };
                E.toLCH = function(f) {
                    if (!("l" in f && "c" in f && "h" in f)) {
                        {
                            var p = m(A(J(f)));
                            f = p.l;
                            var t = p.a;
                            const D = p.b;
                            p = Math.sqrt(t * t + D * D);
                            t = Math.atan2(D, t);
                            t = 0 < t ? t : t + 2 * Math.PI;
                            f = {
                                l: f,
                                c: p,
                                h: t
                            }
                        }
                    }
                    return f
                };
                E.toRGB = J;
                E.toXYZ = function(f) {
                    return "x" in
                        f && "y" in f && "z" in f ? f : A(J(f))
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/symbols/support/previewUtils": function() {
            define(["exports", "../../Color"], function(E, P) {
                function A(v, m) {
                    return Math.round(Math.min(Math.max(v + 191.25 * m, 0), 255))
                }
                E.adjustColorBrightness = function(v, m) {
                    if ("type" in v && ("linear" === v.type || "pattern" === v.type)) return v;
                    v = new P(v);
                    return new P([A(v.r, m), A(v.g, m), A(v.b, m), v.a])
                };
                E.adjustColorComponentBrightness = A;
                E.getConeShapes = function(v, m) {
                    let z = m ? 20 : v;
                    m = m ? 4 : 6;
                    z = 22 >=
                        z ? z - .5 * m : z - m;
                    m = .15 * z;
                    const J = z;
                    v -= m;
                    return [{
                        type: "ellipse",
                        cx: .5 * z,
                        cy: v,
                        rx: .5 * z,
                        ry: m
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.5 * J, 0]
                        }, {
                            command: "L",
                            values: [J, v]
                        }, {
                            command: "L",
                            values: [0, v]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getCubeShapes = function(v, m) {
                    let z = m ? 20 : v;
                    var J = m ? 4 : 6;
                    J = z = 22 >= z ? z - .5 * J : z - J;
                    m = m ? .35 * z : .5 * z;
                    return [{
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.5 * J, 0]
                        }, {
                            command: "L",
                            values: [J, .5 * m]
                        }, {
                            command: "L",
                            values: [.5 * J, m]
                        }, {
                            command: "L",
                            values: [0, .5 * m]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0, .5 * m]
                        }, {
                            command: "L",
                            values: [.5 * J, m]
                        }, {
                            command: "L",
                            values: [.5 * J, v]
                        }, {
                            command: "L",
                            values: [0, v - .5 * m]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.5 * J, m]
                        }, {
                            command: "L",
                            values: [.5 * J, v]
                        }, {
                            command: "L",
                            values: [J, v - .5 * m]
                        }, {
                            command: "L",
                            values: [J, .5 * m]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getCylinderShapes = function(v, m) {
                    var z = m ? 20 : v;
                    m = m ? 4 : 6;
                    z = 22 >= z ? z - .5 * m : z - m;
                    m = .5 * z;
                    const J = .15 * z;
                    v -= J;
                    return [{
                        type: "ellipse",
                        cx: .5 * z,
                        cy: v,
                        rx: m,
                        ry: J
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0, J]
                        }, {
                            command: "L",
                            values: [0, v]
                        }, {
                            command: "L",
                            values: [z, v]
                        }, {
                            command: "L",
                            values: [z, J]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "ellipse",
                        cx: .5 * z,
                        cy: J,
                        rx: m,
                        ry: J
                    }]
                };
                E.getDiamondShapes = function(v) {
                    var m = v;
                    m = 22 > m ? m - 2 : m - 4;
                    const z = Math.floor(v / 10) - 1 || 1;
                    return [{
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.45 * m, 0]
                        }, {
                            command: "L",
                            values: [m, .5 * v - z]
                        }, {
                            command: "L",
                            values: [.45 * m - z, .5 * v + z]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.45 * m, 0]
                        }, {
                            command: "L",
                            values: [.45 * m - z, .5 * v + z]
                        }, {
                            command: "L",
                            values: [0, .5 * v - z]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0, .5 * v - z]
                        }, {
                            command: "L",
                            values: [.45 * m - z, .5 * v + z]
                        }, {
                            command: "L",
                            values: [.45 * m, v]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.45 * m, v]
                        }, {
                            command: "L",
                            values: [m, .5 * v - z]
                        }, {
                            command: "L",
                            values: [.45 * m - z, .5 * v + z]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getExtrudeSymbolShapes = function(v) {
                    v *= .5;
                    return [{
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0, .7 * 11]
                        }, {
                            command: "L",
                            values: [6.6, 22 * .7]
                        }, {
                            command: "L",
                            values: [6.6, 22 * .7 + v]
                        }, {
                            command: "L",
                            values: [0, 22 *
                                .7 + v - .7 * 11
                            ]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [6.6, 22 * .7]
                        }, {
                            command: "L",
                            values: [6.6, 22 * .7 + v]
                        }, {
                            command: "L",
                            values: [22, v]
                        }, {
                            command: "L",
                            values: [22, 0]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [6.6, 0]
                        }, {
                            command: "L",
                            values: [22, 0]
                        }, {
                            command: "L",
                            values: [6.6, 22 * .7]
                        }, {
                            command: "L",
                            values: [0, .7 * 11]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getInvertedConeShapes = function(v) {
                    let m = v;
                    m = 22 > m ? m - 3 : m - 6;
                    const z = .15 * m,
                        J = m;
                    return [{
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0,
                                0
                            ]
                        }, {
                            command: "L",
                            values: [J, 0]
                        }, {
                            command: "L",
                            values: [.5 * J, v - z]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "ellipse",
                        cx: .5 * m,
                        cy: 0,
                        rx: .5 * m,
                        ry: z
                    }]
                };
                E.getPathSymbolShapes = function(v, m, z) {
                    let J = 22,
                        X = 22;
                    1 > v ? J *= .75 : 1 < v && (X *= 1.25);
                    let N = v = 22;
                    m && z && (J = X = v = N = 0);
                    return [{
                        type: "path",
                        path: [{
                            command: "M",
                            values: [v, 0]
                        }, {
                            command: "L",
                            values: [z ? v : .875 * v, 0]
                        }, {
                            command: "L",
                            values: [z ? J - .5 * v : 0, X - .5 * N]
                        }, {
                            command: "L",
                            values: [J - .5 * v, X - .5 * N]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [v, 0]
                        }, {
                            command: "L",
                            values: [v,
                                m ? 0 : .125 * N
                            ]
                        }, {
                            command: "L",
                            values: [J - .5 * v, m ? X - .5 * N : N]
                        }, {
                            command: "L",
                            values: [J - .5 * v, X - .5 * N]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [J - .5 * v, X - .5 * N]
                        }, {
                            command: "L",
                            values: [z ? J - .5 * v : 0, X - .5 * N]
                        }, {
                            command: "L",
                            values: [z ? J - .5 * v : 0, m ? X - .5 * N : N]
                        }, {
                            command: "L",
                            values: [J - .5 * v, m ? X - .5 * N : N]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getTetrahedronShapes = function(v) {
                    var m = v;
                    m = 22 > m ? m - 1 : m - 2;
                    return [{
                        type: "path",
                        path: [{
                                command: "M",
                                values: [.45 * v, 0]
                            }, {
                                command: "L",
                                values: [v, m]
                            }, {
                                command: "L",
                                values: [.45 * v, .6 * m]
                            },
                            {
                                command: "Z",
                                values: []
                            }
                        ]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [.45 * v, 0]
                        }, {
                            command: "L",
                            values: [.45 * v, .6 * m]
                        }, {
                            command: "L",
                            values: [0, m]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }, {
                        type: "path",
                        path: [{
                            command: "M",
                            values: [0, m]
                        }, {
                            command: "L",
                            values: [.45 * v, .6 * m]
                        }, {
                            command: "L",
                            values: [v, m]
                        }, {
                            command: "Z",
                            values: []
                        }]
                    }]
                };
                E.getWaterSymbolShapes = function() {
                    return [{
                            type: "path",
                            path: "M80,80.2v-27c-1.5,0.7-2.8,1.6-3.9,2.8c-1.8,2.1-4.4,3.3-7.1,3.5c-2.7-0.1-5.3-1.4-7.1-3.4c-2.2-2.3-4.7-3.6-7.4-3.6s-5.1,1.3-7.3,3.6c-1.8,2.1-4.4,3.3-7.2,3.4c-2.7-0.1-5.3-1.4-7.1-3.4c-2.2-2.3-4.7-3.6-7.4-3.6s-5.1,1.3-7.4,3.6c-1.8,2.1-4.4,3.3-7.2,3.4C8.3,59.3,5.7,58,3.9,56c-1.1-1.2-2.4-2.1-3.9-2.8v27"
                        },
                        {
                            type: "path",
                            path: "M11,59.4c2.7-0.1,5.3-1.4,7.1-3.4c2.2-2.3,4.7-3.6,7.4-3.6s5.1,1.3,7.4,3.6c1.8,2,4.4,3.3,7.2,3.4c2.7-0.1,5.3-1.4,7.1-3.4c2.2-2.3,4.7-3.6,7.3-3.6s5.1,1.3,7.4,3.6c1.8,2.1,4.4,3.3,7.2,3.4c2.7-0.1,5.3-1.4,7.1-3.4c1.1-1.2,2.4-2.1,3.9-2.8v-24c-1.5,0.7-2.8,1.6-3.9,2.8c-1.8,2.1-4.4,3.3-7.1,3.5c-2.7-0.1-5.3-1.4-7.1-3.4c-2.2-2.3-4.7-3.6-7.4-3.6s-5.1,1.3-7.3,3.6c-1.8,2.1-4.4,3.3-7.2,3.4c-2.7-0.1-5.3-1.4-7.1-3.4c-2.2-2.3-4.7-3.6-7.4-3.6s-5.1,1.3-7.4,3.6c-1.8,2.1-4.4,3.3-7.2,3.4c-2.7-0.1-5.3-1.4-7.1-3.4c-1.1-1.2-2.4-2.1-3.9-2.8v24c1.5,0.7,2.8,1.6,3.9,2.8C5.7,58,8.3,59.3,11,59.4z"
                        },
                        {
                            type: "path",
                            path: "M11,35.4c2.7-0.1,5.3-1.4,7.1-3.4c2.2-2.3,4.7-3.6,7.4-3.6s5.1,1.3,7.4,3.6c1.8,2,4.4,3.3,7.2,3.4c2.7-0.1,5.3-1.4,7.1-3.4c2.2-2.3,4.7-3.6,7.3-3.6s5.1,1.3,7.4,3.6c1.8,2.1,4.4,3.3,7.2,3.4c2.7-0.1,5.3-1.4,7.1-3.4c1.1-1.2,2.4-2.1,3.9-2.8V3.6c-1.5,0.7-2.8,1.6-3.9,2.8c-2.2,2.1-4.6,3.4-7.1,3.4s-5-1.3-7.1-3.4s-4.7-3.6-7.4-3.6s-5.1,1.3-7.3,3.6S42.5,9.9,40,9.9s-5-1.3-7.1-3.4s-4.7-3.6-7.4-3.6s-5.1,1.3-7.3,3.6c-1.8,2.1-4.4,3.3-7.2,3.4c-2.5,0-5-1.3-7.1-3.4C2.8,5.3,1.4,4.3,0,3.6v25.6c1.5,0.7,2.8,1.6,3.9,2.8C5.7,34.1,8.3,35.3,11,35.4z"
                        }
                    ]
                };
                E.shapes = {
                    fill: [{
                        type: "path",
                        path: "M -10,-10 L 10,0 L 10,10 L -10,10 L -10,-10 Z"
                    }],
                    squareFill: [{
                        type: "path",
                        path: "M -10,-10 L 10,-10 L 10,10 L -10,10 L -10,-10 Z"
                    }],
                    pathSymbol3DLayer: [{
                        type: "path",
                        path: "M 3,12 L 12,0 L 11,-2 L -4,5 L -1,5 L 1,7 L 3,10 L 3,12 Z"
                    }, {
                        type: "circle",
                        cx: -2,
                        cy: 10,
                        r: 5
                    }],
                    extrudeSymbol3DLayer: [{
                        type: "path",
                        path: "M -7,-5 L -2,0 L -2,7 L -7,3 L -7,-5 Z"
                    }, {
                        type: "path",
                        path: "M -2,0 L -2,7 L 10,-3 L 10,-10 L -2,0 Z"
                    }, {
                        type: "path",
                        path: "M -7,-5 L -2,0 L 10,-10 L -2,-10 L -7,-5 Z"
                    }],
                    cone: [{
                        type: "path",
                        path: "M 0,-10 L -8,5 L -4,6.5 L 0,7 L 4,6.5 L 8,5 Z"
                    }],
                    tallCone: [{
                        type: "path",
                        path: "M 0,-9 L -3.5,7 L -1.5,7.8 L 0,8 L 1.5,7.8 L 3.5,7 L 0,-9 Z"
                    }],
                    invertedCone: [{
                        type: "path",
                        path: "M 0,7 L -8,-8 L 8,-8 Z"
                    }, {
                        type: "path",
                        path: "M -8,-8 L -4,-9.5 L 0,-10 L 4,-9.5 L 8,-8 L 4,-6.5 L 0,-6 L -4,-6.5 Z"
                    }],
                    cube: [{
                        type: "path",
                        path: "M -10,-7 L 0,-12 L 10,-7 L 0,-2 L -10,-7 Z"
                    }, {
                        type: "path",
                        path: "M -10,-7 L 0,-2 L 0,12 L -10,7 L -10,-7 Z"
                    }, {
                        type: "path",
                        path: "M 0,-2 L 10,-7 L 10,7 L 0,12 L 0,-2 Z"
                    }],
                    tallCube: [{
                        type: "path",
                        path: "M -3.5,-8.5 L 0,-9.5 L 3.5,-8.5 L 0,-7.5 L -3.5,-8.5 Z"
                    }, {
                        type: "path",
                        path: "M -3.5,-8.5 L 0,-7.5 L 0,9 L -3.5,8 L -3.5,-8.5 Z"
                    }, {
                        type: "path",
                        path: "M 0,-7.5 L 3.5,-8.5 L 3.5,8 L 0,9 L 0,-7.5 Z"
                    }],
                    cylinder: [{
                        type: "path",
                        path: "M -8,-9 L -8,7 L -4,8.5 L 0,9 L 4,8.5 L 8,7 L 8,-9 Z"
                    }, {
                        type: "ellipse",
                        cx: 0,
                        cy: -9,
                        rx: 8,
                        ry: 2
                    }],
                    tallCylinder: [{
                        type: "path",
                        path: "M -3.5,-9 L -3.5,7 L -1.5,7.8 L 0,8 L 1.5,7.8 L 3.5,7 L 3.5,-9 Z"
                    }, {
                        type: "ellipse",
                        cx: 0,
                        cy: -9,
                        rx: 3.5,
                        ry: 1
                    }],
                    diamond: [{
                        type: "path",
                        path: "M 0,-10 L 10,-1 L -1,1 L 0,-10 Z"
                    }, {
                        type: "path",
                        path: "M 0,-10 L -1,1 L -8,-1 L 0,-10 Z"
                    }, {
                        type: "path",
                        path: "M -1,1 L 0,10 L -8,-1 L -1,1 Z"
                    }, {
                        type: "path",
                        path: "M -1,0 L 0,10 L 10,-1 L -1,1 Z"
                    }],
                    tetrahedron: [{
                        type: "path",
                        path: "M 0,-10 L 10,7 L 0,0 L 0,-10 Z"
                    }, {
                        type: "path",
                        path: "M 0,-10 L 0,0 L -8,7 L 0,-10 Z"
                    }, {
                        type: "path",
                        path: "M 10,7 L 0,0 L -8,7 L 10,7 Z"
                    }]
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/symbols/support/renderUtils": function() {
            define("exports ../../core/has ../../core/Error ../../kernel ../../request ../../core/colorUtils ../../libs/maquette/projection ../../libs/maquette/projector ./svgUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N) {
                    function f(t, D, I) {
                        return t ? m(t, {
                            responseType: "image"
                        }).then(M => {
                            M = M.data;
                            const x = M.width,
                                L = M.height,
                                Q = x / L;
                            let C = D;
                            I && (C = Math.min(C, Math.max(x, L)));
                            return {
                                image: M,
                                width: 1 >= Q ? Math.ceil(C * Q) : C,
                                height: 1 >= Q ? C : Math.ceil(C / Q)
                            }
                        }) : Promise.reject(new A("renderUtils: imageDataSize", "href not provided."))
                    }
                    const p = X.createProjector();
                    E.renderSymbol = function(t, D, I) {
                        const M = Math.ceil(D[0]);
                        D = Math.ceil(D[1]);
                        if (!t.some(L => !!L.length)) return null;
                        const x = I && I.node || document.createElement("div");
                        null != I.opacity && (x.style.opacity = I.opacity.toString());
                        p.append(x, N.renderSVG.bind(null, t, M, D, I));
                        return x
                    };
                    E.tintImageWithColor = function(t, D, I, M, x) {
                        return f(t, D, x).then(L => {
                            const Q = L.width ? L.width : D,
                                C = L.height ? L.height : D;
                            var S;
                            if (S = L.image) S = I && "ignore" !== M ? "multiply" === M && 255 === I.r && 255 === I.g && 255 === I.b && 1 === I.a ? !1 : !0 : !1;
                            if (S) {
                                var H = L.image.width,
                                    U = L.image.height;
                                (P("edge") || P("ie")) && /\.svg$/i.test(t) && (--H, --U);
                                S = Math.ceil(Q);
                                var V = Math.ceil(C);
                                var d = document.createElement("canvas");
                                d.width =
                                    S;
                                d.height = V;
                                d.style.width = S + "px";
                                d.style.height = V + "px";
                                d = d.getContext("2d");
                                d.clearRect(0, 0, S, V);
                                S = d;
                                S.drawImage(L.image, 0, 0, H, U, 0, 0, Q, C);
                                V = S.getImageData(0, 0, Q, C);
                                d = [I.r / 255, I.g / 255, I.b / 255, I.a];
                                const n = z.toHSV(I);
                                for (let u = 0; u < V.data.length; u += 4) {
                                    L = V.data;
                                    H = u;
                                    U = d;
                                    var c = n;
                                    switch (M) {
                                        case "multiply":
                                            L[H + 0] *= U[0];
                                            L[H + 1] *= U[1];
                                            L[H + 2] *= U[2];
                                            L[H + 3] *= U[3];
                                            break;
                                        default:
                                            {
                                                const F = z.toHSV({
                                                    r: L[H + 0],
                                                    g: L[H + 1],
                                                    b: L[H + 2]
                                                });F.h = c.h;F.s = c.s;F.v = F.v / 100 * c.v;c = z.toRGB(F);L[H + 0] = c.r;L[H + 1] = c.g;L[H + 2] = c.b;L[H + 3] *= U[3]
                                            }
                                    }
                                }
                                S.putImageData(V,
                                    0, 0);
                                t = S.canvas.toDataURL("image/png")
                            } else(S = v.id && v.id.findCredential(t)) && S.token && (L = -1 === t.indexOf("?") ? "?" : "\x26", t = `${t}${L}token=${S.token}`);
                            return {
                                url: t,
                                width: Q,
                                height: C
                            }
                        }).catch(function() {
                            return {
                                url: t,
                                width: D,
                                height: D
                            }
                        })
                    };
                    Object.defineProperty(E, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/symbols/support/svgUtils": function() {
            define("exports ../../core/has ../../core/Logger ../../Color ../../widgets/support/widgetUtils ../../chunks/index ../../chunks/mat2d ../../chunks/mat2df32".split(" "), function(E,
                P, A, v, m, z, J, X) {
                function N(b, e) {
                    b *= l / 180;
                    return Math.abs(e * Math.sin(b)) + Math.abs(e * Math.cos(b))
                }

                function f(b) {
                    return b.map(e => `${e.command} ${e.values.join(" ")}`).join(" ").trim()
                }

                function p(b, e, k, G) {
                    if (b) {
                        if ("circle" === b.type) return z.jsx("circle", {
                            fill: e,
                            "fill-rule": "evenodd",
                            stroke: k.color,
                            "stroke-width": k.width,
                            "stroke-linecap": k.cap,
                            "stroke-linejoin": k.join,
                            "stroke-dasharray": k.dashArray,
                            "stroke-miterlimit": "4",
                            cx: b.cx,
                            cy: b.cy,
                            r: b.r
                        });
                        if ("ellipse" === b.type) return z.jsx("ellipse", {
                            fill: e,
                            "fill-rule": "evenodd",
                            stroke: k.color,
                            "stroke-width": k.width,
                            "stroke-linecap": k.cap,
                            "stroke-linejoin": k.join,
                            "stroke-dasharray": k.dashArray,
                            "stroke-miterlimit": "4",
                            cx: b.cx,
                            cy: b.cy,
                            rx: b.rx,
                            ry: b.ry
                        });
                        if ("rect" === b.type) return z.jsx("rect", {
                            fill: e,
                            "fill-rule": "evenodd",
                            stroke: k.color,
                            "stroke-width": k.width,
                            "stroke-linecap": k.cap,
                            "stroke-linejoin": k.join,
                            "stroke-dasharray": k.dashArray,
                            "stroke-miterlimit": "4",
                            x: b.x,
                            y: b.y,
                            width: b.width,
                            height: b.height
                        });
                        if ("image" === b.type) return z.jsx("image", {
                            href: b.src,
                            x: b.x,
                            y: b.y,
                            width: b.width,
                            height: b.height,
                            preserveAspectRatio: "none"
                        });
                        if ("path" === b.type) return b = "string" !== typeof b.path ? f(b.path) : b.path, z.jsx("path", {
                            fill: e,
                            "fill-rule": "evenodd",
                            stroke: k.color,
                            "stroke-width": k.width,
                            "stroke-linecap": k.cap,
                            "stroke-linejoin": k.join,
                            "stroke-dasharray": k.dashArray,
                            "stroke-miterlimit": "4",
                            d: b
                        });
                        if ("text" === b.type) return z.jsx("text", {
                            fill: e,
                            "fill-rule": "evenodd",
                            stroke: k.color,
                            "stroke-width": k.width,
                            "stroke-linecap": k.cap,
                            "stroke-linejoin": k.join,
                            "stroke-dasharray": k.dashArray,
                            "stroke-miterlimit": "4",
                            "text-anchor": G.align,
                            "text-decoration": G.decoration,
                            kerning: G.kerning,
                            rotate: G.rotate,
                            "text-rendering": u,
                            "font-style": G.font.style,
                            "font-variant": G.font.variant,
                            "font-weight": G.font.weight,
                            "font-size": G.font.size,
                            "font-family": G.font.family,
                            x: b.x,
                            y: b.y
                        }, b.text)
                    }
                    return null
                }

                function t(b) {
                    const e = {
                        fill: "none",
                        pattern: null,
                        linearGradient: null
                    };
                    if (b)
                        if ("type" in b && "pattern" === b.type) {
                            var k = `patternId-${++c}`;
                            e.fill = `url(#${k})`;
                            e.pattern = {
                                id: k,
                                x: b.x,
                                y: b.y,
                                width: b.width,
                                height: b.height,
                                image: {
                                    x: 0,
                                    y: 0,
                                    width: b.width,
                                    height: b.height,
                                    href: b.src
                                }
                            }
                        } else "type" in b && "linear" === b.type ? (k = `linearGradientId-${++n}`, e.fill = `url(#${k})`, e.linearGradient = {
                            id: k,
                            x1: b.x1,
                            y1: b.y1,
                            x2: b.x2,
                            y2: b.y2,
                            stops: b.colors.map(G => ({
                                offset: G.offset,
                                color: G.color && (new v(G.color)).toString()
                            }))
                        }) : b && (b = new v(b), e.fill = b.toString());
                    return e
                }

                function D(b) {
                    const e = {
                        color: "none",
                        width: 1,
                        cap: "butt",
                        join: "4",
                        dashArray: "none"
                    };
                    if (b && (null != b.width && (e.width = b.width), b.cap && (e.cap = b.cap), b.join && (e.join = b.join.toString()), b.color &&
                            (e.color = (new v(b.color)).toString()), b.style)) {
                        let G = null;
                        b.style in y && (G = y[b.style]);
                        if (Array.isArray(G)) {
                            G = G.slice(0);
                            for (var k = 0; k < G.length; ++k) G[k] *= b.width;
                            if ("butt" !== b.cap) {
                                for (k = 0; k < G.length; k += 2) G[k] -= b.width, 1 > G[k] && (G[k] = 1);
                                for (k = 1; k < G.length; k += 2) G[k] += b.width
                            }
                            G = G.join(",")
                        }
                        e.dashArray = G
                    }
                    return e
                }

                function I(b, e) {
                    const k = {
                        align: null,
                        decoration: null,
                        kerning: null,
                        rotate: null,
                        font: {
                            style: null,
                            variant: null,
                            weight: null,
                            size: null,
                            family: null
                        }
                    };
                    b && (k.align = b.align, k.decoration = b.decoration,
                        k.kerning = b.kerning ? "auto" : "0", k.rotate = b.rotated ? "90" : "0", k.font.style = e.style || "normal", k.font.variant = e.variant || "normal", k.font.weight = e.weight || "normal", k.font.size = e.size && e.size.toString() || "10pt", k.font.family = e.family || "serif");
                    return k
                }

                function M(b) {
                    const {
                        pattern: e,
                        linearGradient: k
                    } = b;
                    return e ? z.jsx("pattern", {
                            id: e.id,
                            patternUnits: "userSpaceOnUse",
                            x: e.x,
                            y: e.y,
                            width: e.width,
                            height: e.height
                        }, z.jsx("image", {
                            x: e.image.x,
                            y: e.image.y,
                            width: e.image.width,
                            height: e.image.height,
                            href: e.image.href
                        })) :
                        k ? (b = k.stops.map((G, R) => z.jsx("stop", {
                            key: `${R}-stop`,
                            offset: G.offset,
                            "stop-color": G.color
                        })), z.jsx("linearGradient", {
                            id: k.id,
                            gradientUnits: "userSpaceOnUse",
                            x1: k.x1,
                            y1: k.y1,
                            x2: k.x2,
                            y2: k.y2
                        }, b)) : null
                }

                function x(b, e, k) {
                    return J.translate(b, J.identity(b), [e, k])
                }

                function L(b, e, k, G, R) {
                    J.scale(b, J.identity(b), [e, k]);
                    b[4] = b[4] * e - G * e + G;
                    b[5] = b[5] * k - R * k + R;
                    return b
                }

                function Q(b, e, k, G) {
                    var R = e % 360 * Math.PI / 180;
                    J.rotate(b, J.identity(b), R);
                    e = Math.cos(R);
                    R = Math.sin(R);
                    const Y = b[4],
                        W = b[5];
                    b[4] = Y * e - W * R + G * R - k * e + k;
                    b[5] =
                        W * e + Y * R - k * R - G * e + G;
                    return b
                }

                function C(b, e) {
                    w && "left" in w ? (w.left > b && (w.left = b), w.right < b && (w.right = b), w.top > e && (w.top = e), w.bottom < e && (w.bottom = e)) : w = {
                        left: b,
                        bottom: e,
                        right: b,
                        top: e
                    }
                }

                function S(b) {
                    const e = b.args,
                        k = e.length;
                    switch (b.action) {
                        case "M":
                        case "L":
                        case "C":
                        case "S":
                        case "Q":
                        case "T":
                            for (b = 0; b < k; b += 2) C(e[b], e[b + 1]);
                            q.x = e[k - 2];
                            q.y = e[k - 1];
                            break;
                        case "H":
                            for (b = 0; b < k; ++b) C(e[b], q.y);
                            q.x = e[k - 1];
                            break;
                        case "V":
                            for (b = 0; b < k; ++b) C(q.x, e[b]);
                            q.y = e[k - 1];
                            break;
                        case "m":
                            b = 0;
                            "x" in q || (C(q.x = e[0], q.y = e[1]),
                                b = 2);
                            for (; b < k; b += 2) C(q.x += e[b], q.y += e[b + 1]);
                            break;
                        case "l":
                        case "t":
                            for (b = 0; b < k; b += 2) C(q.x += e[b], q.y += e[b + 1]);
                            break;
                        case "h":
                            for (b = 0; b < k; ++b) C(q.x += e[b], q.y);
                            break;
                        case "v":
                            for (b = 0; b < k; ++b) C(q.x, q.y += e[b]);
                            break;
                        case "c":
                            for (b = 0; b < k; b += 6) C(q.x + e[b], q.y + e[b + 1]), C(q.x + e[b + 2], q.y + e[b + 3]), C(q.x += e[b + 4], q.y += e[b + 5]);
                            break;
                        case "s":
                        case "q":
                            for (b = 0; b < k; b += 4) C(q.x + e[b], q.y + e[b + 1]), C(q.x += e[b + 2], q.y += e[b + 3]);
                            break;
                        case "A":
                            for (b = 0; b < k; b += 7) C(e[b + 5], e[b + 6]);
                            q.x = e[k - 2];
                            q.y = e[k - 1];
                            break;
                        case "a":
                            for (b = 0; b < k; b +=
                                7) C(q.x += e[b + 5], q.y += e[b + 6])
                    }
                }

                function H(b, e, k) {
                    const G = F[b.toLowerCase()];
                    "number" === typeof G && (G ? e.length >= G && (b = {
                        action: b,
                        args: e.slice(0, e.length - e.length % G)
                    }, k.push(b), S(b)) : (b = {
                        action: b,
                        args: []
                    }, k.push(b), S(b)))
                }

                function U(b) {
                    const e = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                    if ("circle" === b.type) e.x = b.cx - b.r, e.y = b.cy - b.r, e.width = 2 * b.r, e.height = 2 * b.r;
                    else if ("ellipse" === b.type) e.x = b.cx - b.rx, e.y = b.cy - b.ry, e.width = 2 * b.rx, e.height = 2 * b.ry;
                    else if ("image" === b.type || "rect" === b.type) e.x = b.x, e.y = b.y, e.width = b.width,
                        e.height = b.height;
                    else if ("path" === b.type) {
                        {
                            const R = ("string" !== typeof b.path ? f(b.path) : b.path).match(h),
                                Y = [];
                            w = {};
                            q = {};
                            if (R) {
                                b = "";
                                var k = [],
                                    G = R.length;
                                for (let W = 0; W < G; ++W) {
                                    const ba = R[W],
                                        T = parseFloat(ba);
                                    isNaN(T) ? (b && H(b, k, Y), k = [], b = ba) : k.push(T)
                                }
                                H(b, k, Y);
                                b = {
                                    x: 0,
                                    y: 0,
                                    width: 0,
                                    height: 0
                                };
                                w && "left" in w && (b.x = w.left, b.y = w.top, b.width = w.right - w.left, b.height = w.bottom - w.top)
                            } else b = null
                        }
                        e.x = b.x;
                        e.y = b.y;
                        e.width = b.width;
                        e.height = b.height
                    }
                    return e
                }

                function V(b) {
                    const e = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                    let k = null,
                        G =
                        Number.NEGATIVE_INFINITY,
                        R = Number.NEGATIVE_INFINITY;
                    for (const Y of b) k ? (k.x = Math.min(k.x, Y.x), k.y = Math.min(k.y, Y.y), G = Math.max(G, Y.x + Y.width), R = Math.max(R, Y.y + Y.height)) : (k = e, k.x = Y.x, k.y = Y.y, G = Y.x + Y.width, R = Y.y + Y.height);
                    k && (k.width = G - k.x, k.height = R - k.y);
                    return k
                }

                function d(b, e, k, G, R, Y, W, ba) {
                    var T = (W && Y ? N(Y, e) : e) / 2;
                    const ja = (W && Y ? N(Y, k) : k) / 2,
                        aa = b.width + G,
                        ka = b.height + G;
                    W = X.create();
                    const ca = X.create();
                    var oa = !1;
                    if (R && 0 !== aa && 0 !== ka) {
                        R = aa / ka;
                        oa = e > k ? e : k;
                        let ma = 1,
                            sa = 1;
                        isNaN(oa) || (1 < R ? (ma = oa / aa, sa = oa /
                            R / ka) : (sa = oa / ka, ma = oa * R / aa));
                        J.multiply(ca, ca, L(W, ma, sa, T, ja));
                        oa = !0
                    }
                    R = b.x + (aa - G) / 2;
                    b = b.y + (ka - G) / 2;
                    J.multiply(ca, ca, x(W, T - R, ja - b));
                    !oa && (aa > e || ka > k) && (T = aa / e > ka / k, e = (T ? e : k) / (T ? aa : ka), J.multiply(ca, ca, L(W, e, e, R, b)));
                    Y && J.multiply(ca, ca, Q(W, Y, R, b));
                    ba && J.multiply(ca, ca, x(W, ba[0], ba[1]));
                    return `matrix(${ca[0]},${ca[1]},${ca[2]},${ca[3]},${ca[4]},${ca[5]})`
                }
                let c = 0,
                    n = 0;
                A = P("android");
                const u = P("chrome") || A && 4 <= A ? "auto" : "optimizeLegibility",
                    F = {
                        m: 2,
                        l: 2,
                        h: 1,
                        v: 1,
                        c: 6,
                        s: 4,
                        q: 4,
                        t: 2,
                        a: 7,
                        z: 0
                    },
                    h = /([A-DF-Za-df-z])|([-+]?\d*[.]?\d+(?:[eE][-+]?\d+)?)/g;
                let w = {},
                    q = {};
                const y = {
                        solid: "none",
                        shortdash: [4, 1],
                        shortdot: [1, 1],
                        shortdashdot: [4, 1, 1, 1],
                        shortdashdotdot: [4, 1, 1, 1, 1, 1],
                        dot: [1, 3],
                        dash: [4, 3],
                        longdash: [8, 3],
                        dashdot: [4, 3, 1, 3],
                        longdashdot: [8, 3, 1, 3],
                        longdashdotdot: [8, 3, 1, 3, 1, 3]
                    },
                    l = Math.PI;
                E.computeBBox = V;
                E.generateFillAttributes = t;
                E.generateStrokeAttributes = D;
                E.generateTextAttributes = I;
                E.getBoundingBox = U;
                E.getTransformMatrix = d;
                E.renderDef = M;
                E.renderSVG = function(b, e, k, G) {
                    const R = [],
                        Y = [];
                    for (const ba of b) {
                        b = [];
                        var W = [];
                        let T = 0,
                            ja = 0,
                            aa = 0;
                        for (const ka of ba) {
                            const {
                                shape: ca,
                                fill: oa,
                                stroke: ma,
                                font: sa,
                                offset: ua
                            } = ka;
                            T += ma && ma.width || 0;
                            const va = t(oa),
                                wa = D(ma),
                                Ba = "text" === ca.type ? I(ca, sa) : null;
                            R.push(M(va));
                            b.push(p(ca, va.fill, wa, Ba));
                            W.push(U(ca));
                            ua && (ja += ua[0], aa += ua[1])
                        }
                        W = d(V(W), e, k, T, null == G ? void 0 : G.scale, null == G ? void 0 : G.rotation, null == G ? void 0 : G.useRotationSize, [ja, aa]);
                        Y.push(z.jsx("g", {
                            transform: W
                        }, b))
                    }
                    null != G && G.useRotationSize && null != G && G.rotation && (e = N(null == G ? void 0 : G.rotation, e), k = N(null == G ? void 0 : G.rotation, k));
                    return z.jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: e,
                        height: k
                    }, z.jsx("defs", null, R), Y)
                };
                E.renderShape = p;
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/chunks/mat2d": function() {
            define(["exports", "./common"], function(E, P) {
                function A(d, c) {
                    d[0] = c[0];
                    d[1] = c[1];
                    d[2] = c[2];
                    d[3] = c[3];
                    d[4] = c[4];
                    d[5] = c[5];
                    return d
                }

                function v(d) {
                    d[0] = 1;
                    d[1] = 0;
                    d[2] = 0;
                    d[3] = 1;
                    d[4] = 0;
                    d[5] = 0;
                    return d
                }

                function m(d, c, n, u, F, h, w) {
                    d[0] = c;
                    d[1] = n;
                    d[2] = u;
                    d[3] = F;
                    d[4] = h;
                    d[5] = w;
                    return d
                }

                function z(d, c) {
                    const n = c[0],
                        u = c[1],
                        F = c[2],
                        h = c[3],
                        w = c[4];
                    c = c[5];
                    let q = n * h - u * F;
                    if (!q) return null;
                    q = 1 / q;
                    d[0] = h * q;
                    d[1] = -u * q;
                    d[2] = -F * q;
                    d[3] = n * q;
                    d[4] = (F * c - h * w) * q;
                    d[5] = (u * w - n * c) * q;
                    return d
                }

                function J(d) {
                    return d[0] * d[3] - d[1] * d[2]
                }

                function X(d, c, n) {
                    const u = c[0],
                        F = c[1],
                        h = c[2],
                        w = c[3],
                        q = c[4];
                    c = c[5];
                    const y = n[0],
                        l = n[1],
                        b = n[2],
                        e = n[3],
                        k = n[4];
                    n = n[5];
                    d[0] = u * y + h * l;
                    d[1] = F * y + w * l;
                    d[2] = u * b + h * e;
                    d[3] = F * b + w * e;
                    d[4] = u * k + h * n + q;
                    d[5] = F * k + w * n + c;
                    return d
                }

                function N(d, c, n) {
                    const u = c[0],
                        F = c[1],
                        h = c[2],
                        w = c[3],
                        q = c[4];
                    c = c[5];
                    const y = Math.sin(n);
                    n = Math.cos(n);
                    d[0] = u * n + h * y;
                    d[1] = F * n + w * y;
                    d[2] = u * -y + h * n;
                    d[3] = F * -y + w * n;
                    d[4] = q;
                    d[5] = c;
                    return d
                }

                function f(d, c, n) {
                    const u = c[1],
                        F = c[2],
                        h = c[3],
                        w = c[4],
                        q = c[5],
                        y = n[0];
                    n = n[1];
                    d[0] = c[0] * y;
                    d[1] = u * y;
                    d[2] = F * n;
                    d[3] = h * n;
                    d[4] = w;
                    d[5] = q;
                    return d
                }

                function p(d, c, n) {
                    const u = c[0],
                        F = c[1],
                        h = c[2],
                        w = c[3],
                        q = c[4];
                    c = c[5];
                    const y = n[0];
                    n = n[1];
                    d[0] = u;
                    d[1] = F;
                    d[2] = h;
                    d[3] = w;
                    d[4] = u * y + h * n + q;
                    d[5] = F * y + w * n + c;
                    return d
                }

                function t(d, c) {
                    const n = Math.sin(c);
                    c = Math.cos(c);
                    d[0] = c;
                    d[1] = n;
                    d[2] = -n;
                    d[3] = c;
                    d[4] = 0;
                    d[5] = 0;
                    return d
                }

                function D(d, c) {
                    d[0] = c[0];
                    d[1] = 0;
                    d[2] = 0;
                    d[3] = c[1];
                    d[4] = 0;
                    d[5] = 0;
                    return d
                }

                function I(d, c) {
                    d[0] = 1;
                    d[1] = 0;
                    d[2] = 0;
                    d[3] = 1;
                    d[4] = c[0];
                    d[5] = c[1];
                    return d
                }

                function M(d) {
                    return "mat2d(" + d[0] + ", " + d[1] + ", " + d[2] + ", " + d[3] + ", " + d[4] + ", " + d[5] + ")"
                }

                function x(d) {
                    return Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2 + d[3] ** 2 + d[4] ** 2 + d[5] ** 2 + 1)
                }

                function L(d, c, n) {
                    d[0] = c[0] + n[0];
                    d[1] = c[1] + n[1];
                    d[2] = c[2] + n[2];
                    d[3] = c[3] + n[3];
                    d[4] = c[4] + n[4];
                    d[5] = c[5] + n[5];
                    return d
                }

                function Q(d, c, n) {
                    d[0] = c[0] - n[0];
                    d[1] = c[1] - n[1];
                    d[2] = c[2] - n[2];
                    d[3] = c[3] - n[3];
                    d[4] = c[4] - n[4];
                    d[5] = c[5] - n[5];
                    return d
                }

                function C(d, c, n) {
                    d[0] = c[0] * n;
                    d[1] = c[1] * n;
                    d[2] = c[2] * n;
                    d[3] = c[3] * n;
                    d[4] = c[4] * n;
                    d[5] = c[5] * n;
                    return d
                }

                function S(d, c, n, u) {
                    d[0] = c[0] + n[0] * u;
                    d[1] = c[1] + n[1] * u;
                    d[2] = c[2] + n[2] * u;
                    d[3] = c[3] + n[3] * u;
                    d[4] = c[4] + n[4] * u;
                    d[5] = c[5] + n[5] * u;
                    return d
                }

                function H(d, c) {
                    return d[0] === c[0] && d[1] === c[1] && d[2] === c[2] && d[3] === c[3] && d[4] === c[4] && d[5] === c[5]
                }

                function U(d, c) {
                    const n = d[0],
                        u = d[1],
                        F = d[2],
                        h = d[3],
                        w = d[4];
                    d = d[5];
                    const q = c[0],
                        y = c[1],
                        l = c[2],
                        b = c[3],
                        e = c[4];
                    c = c[5];
                    return Math.abs(n - q) <= P.EPSILON * Math.max(1, Math.abs(n), Math.abs(q)) && Math.abs(u - y) <= P.EPSILON * Math.max(1, Math.abs(u),
                        Math.abs(y)) && Math.abs(F - l) <= P.EPSILON * Math.max(1, Math.abs(F), Math.abs(l)) && Math.abs(h - b) <= P.EPSILON * Math.max(1, Math.abs(h), Math.abs(b)) && Math.abs(w - e) <= P.EPSILON * Math.max(1, Math.abs(w), Math.abs(e)) && Math.abs(d - c) <= P.EPSILON * Math.max(1, Math.abs(d), Math.abs(c))
                }
                var V = Object.freeze({
                    __proto__: null,
                    copy: A,
                    identity: v,
                    set: m,
                    invert: z,
                    determinant: J,
                    multiply: X,
                    rotate: N,
                    scale: f,
                    translate: p,
                    fromRotation: t,
                    fromScaling: D,
                    fromTranslation: I,
                    str: M,
                    frob: x,
                    add: L,
                    subtract: Q,
                    multiplyScalar: C,
                    multiplyScalarAndAdd: S,
                    exactEquals: H,
                    equals: U,
                    mul: X,
                    sub: Q
                });
                E.add = L;
                E.copy = A;
                E.determinant = J;
                E.equals = U;
                E.exactEquals = H;
                E.frob = x;
                E.fromRotation = t;
                E.fromScaling = D;
                E.fromTranslation = I;
                E.identity = v;
                E.invert = z;
                E.mat2d = V;
                E.mul = X;
                E.multiply = X;
                E.multiplyScalar = C;
                E.multiplyScalarAndAdd = S;
                E.rotate = N;
                E.scale = f;
                E.set = m;
                E.str = M;
                E.sub = Q;
                E.subtract = Q;
                E.translate = p
            })
        },
        "esri/chunks/mat2df32": function() {
            define(["exports"], function(E) {
                function P() {
                    const N = new Float32Array(6);
                    N[0] = 1;
                    N[3] = 1;
                    return N
                }

                function A(N) {
                    const f = new Float32Array(6);
                    f[0] = N[0];
                    f[1] = N[1];
                    f[2] = N[2];
                    f[3] = N[3];
                    f[4] = N[4];
                    f[5] = N[5];
                    return f
                }

                function v(N, f, p, t, D, I) {
                    const M = new Float32Array(6);
                    M[0] = N;
                    M[1] = f;
                    M[2] = p;
                    M[3] = t;
                    M[4] = D;
                    M[5] = I;
                    return M
                }

                function m(N, f) {
                    return new Float32Array(N, f, 6)
                }

                function z(N, f, p, t) {
                    const D = f[t];
                    f = f[t + 1];
                    N[t] = p[0] * D + p[2] * f + p[4];
                    N[t + 1] = p[1] * D + p[3] * f + p[5]
                }

                function J(N, f, p, t = 0, D = 0, I = 2) {
                    for (D = D || f.length / I; t < D; t++) z(N, f, p, t * I)
                }
                var X = Object.freeze({
                    __proto__: null,
                    create: P,
                    clone: A,
                    fromValues: v,
                    createView: m,
                    transform: z,
                    transformMany: J
                });
                E.clone = A;
                E.create = P;
                E.createView = m;
                E.fromValues = v;
                E.mat2df32 = X;
                E.transform = z;
                E.transformMany = J
            })
        },
        "esri/widgets/Legend/support/sizeRampUtils": function() {
            define("require exports ../../../Color ../../../symbols ../../../symbols/support/cimSymbolUtils ../../../symbols/support/utils ../../../renderers/support/numberUtils ./utils".split(" "), function(E, P, A, v, m, z, J, X) {
                function N(d, c) {
                    const n = d.length - 1;
                    return d.map((u, F) => X.createStopLabel(u, F, n, c))
                }

                function f(d, c) {
                    d = null == d ? void 0 : d.authoringInfo;
                    const n = "univariate-color-size" ===
                        (null == d ? void 0 : d.type);
                    let u = [12, 30];
                    if (n) {
                        const F = c[0],
                            h = c[c.length - 1];
                        u = c.map(w => 12 + (w - F) / (h - F) * 18)
                    }
                    n && "below" === (null == d ? void 0 : d.univariateTheme) && u.reverse();
                    return u
                }

                function p(d, c) {
                    const n = d.classBreakInfos,
                        u = n.length;
                    c = 2 > u || !(2 <= c) ? n[0].symbol.clone() : n[u - 1].symbol.clone();
                    d.visualVariables.some(F => "color" === F.type) && (-1 < c.type.indexOf("3d") ? I(c) : M(c));
                    return c
                }

                function t(d, c) {
                    let n = null,
                        u = null;
                    "simple" === d.type ? n = d.symbol : "class-breaks" === d.type ? (n = (d = d.classBreakInfos) && d[0] && d[0].symbol,
                        u = 1 < d.length) : "unique-value" === d.type && (n = (d = d.uniqueValueInfos) && d[0] && d[0].symbol, u = 1 < d.length);
                    if (!n || D(n)) return null;
                    n = n.clone();
                    if (c || u) - 1 < n.type.indexOf("3d") ? I(n) : M(n);
                    return n
                }

                function D(d) {
                    return d ? v.isSymbol3D(d) ? d.symbolLayers ? d.symbolLayers.some(c => c && "fill" === c.type) : !1 : -1 !== d.type.indexOf("fill") : !1
                }

                function I(d) {
                    "line-3d" === d.type ? d.symbolLayers.forEach(c => {
                        c.material = {
                            color: V
                        }
                    }) : d.symbolLayers.forEach(c => {
                        "icon" !== c.type || c.resource && c.resource.href ? c.material = {
                            color: U
                        } : (c.material = {
                            color: H
                        }, c.outline = {
                            color: V,
                            size: 1.5
                        })
                    })
                }

                function M(d) {
                    "cim" === d.type ? m.applyCIMSymbolColor(d, new A(U)) : -1 !== d.type.indexOf("line") ? d.color = V : (d.color = H, "simple-marker" === d.type && (d.outline = {
                        color: V,
                        width: 1.5
                    }))
                }
                async function x(d, c, n, u) {
                    const F = (await new Promise(function(q, y) {
                            E(["../../../renderers/visualVariables/support/visualVariableUtils"], q, y)
                        })).getSizeRangeAtScale(d, n, u),
                        h = F && L(F);
                    if (F || h) {
                        var w = h.map(q => {
                            {
                                const y = F.minSize,
                                    l = F.maxSize,
                                    b = d.minDataValue,
                                    e = d.maxDataValue;
                                let k = null;
                                q = k = q <=
                                    y ? b : q >= l ? e : (q - y) / (l - y) * (e - b) + b
                            }
                            return q
                        });
                        w = J.round(w);
                        for (let q = 1; q < w.length - 1; q++) {
                            const y = await Q(d, c, w[q], w[q - 1], n, u);
                            y && (w[q] = y[0], h[q] = y[1])
                        }
                        return w
                    }
                }

                function L(d) {
                    const c = d.minSize;
                    d = (d.maxSize - c) / 4;
                    const n = [];
                    for (let u = 0; 5 > u; u++) n.push(c + d * u);
                    return n
                }
                async function Q(d, c, n, u, F, h) {
                    const w = await C(d, c, n, F, h);
                    u = await C(d, c, u, F, h);
                    var q = J.numDigits(n),
                        y = q.fractional,
                        l = q.integer;
                    let b = q = null;
                    0 < n && 1 > n && (q = 10 ** y, n *= q, l = J.numDigits(n).integer);
                    for (y = l - 1; 0 <= y; y--) {
                        var e = 10 ** y;
                        l = Math.floor(n / e) * e;
                        e *= Math.ceil(n / e);
                        null != q && (l /= q, e /= q);
                        let k = (l + e) / 2;
                        [, k] = J.round([l, k, e], {
                            indexes: [1]
                        });
                        const G = await C(d, c, l, F, h),
                            R = await C(d, c, e, F, h),
                            Y = await C(d, c, k, F, h),
                            W = J.percentChange(w, G, u, null),
                            ba = J.percentChange(w, R, u, null),
                            T = J.percentChange(w, Y, u, null);
                        let ja = 20 >= W.previous,
                            aa = 20 >= ba.previous;
                        ja && aa && (W.previous <= ba.previous ? (ja = !0, aa = !1) : (aa = !0, ja = !1));
                        ja ? b = [l, G] : aa ? b = [e, R] : 20 >= T.previous && (b = [k, Y]);
                        if (b) break
                    }
                    return b
                }
                async function C(d, c, n, u, F) {
                    const {
                        getSize: h
                    } = await new Promise(function(w, q) {
                        E(["../../../renderers/visualVariables/support/visualVariableUtils"],
                            w, q)
                    });
                    return h(d, n, {
                        scale: u,
                        view: F,
                        shape: "simple-marker" === c.type ? c.style : null
                    })
                }

                function S(d, c) {
                    d = d.clone();
                    if (v.isSymbol3D(d)) z.isVolumetricSymbol(d) || d.symbolLayers.forEach(n => {
                        "fill" !== n.type && (n.size = c)
                    });
                    else if ("esri.symbols.SimpleMarkerSymbol" === d.declaredClass) d.size = c;
                    else if ("esri.symbols.PictureMarkerSymbol" === d.declaredClass) {
                        const n = d.width,
                            u = d.height;
                        d.height = c;
                        d.width = n / u * c
                    } else "esri.symbols.SimpleLineSymbol" === d.declaredClass ? d.width = c : "esri.symbols.TextSymbol" === d.declaredClass &&
                        d.font && (d.font.size = c);
                    return d
                }
                const H = [255, 255, 255],
                    U = [200, 200, 200],
                    V = [128, 128, 128];
                P.REAL_WORLD_MAX_SIZE = 30;
                P.REAL_WORLD_MIN_SIZE = 12;
                P.getRampStops = async function(d, c, n, u, F, h) {
                    var w, q, y = c.legendOptions;
                    y = y && y.customValues;
                    const l = t(d, n);
                    var b = null != c.minSize && null != c.maxSize;
                    n = c.stops && 1 < c.stops.length;
                    var e = !!c.target;
                    if (l && (y || b || n && !e)) {
                        var k = z.isVolumetricSymbol(l),
                            G = null,
                            R = b = null;
                        b = k && !n ? J.round([c.minDataValue, c.maxDataValue]) : y || await x(c, l, u, F);
                        y = null == d ? void 0 : d.authoringInfo;
                        var Y = (e =
                            "univariate-color-size" === (null == y ? void 0 : y.type)) && "above-and-below" === (null == y ? void 0 : y.univariateTheme);
                        !b && n && (b = c.stops.map(ja => ja.value), (G = c.stops.some(ja => !!ja.label)) && (R = c.stops.map(ja => ja.label)));
                        k && 2 < (null == (w = b) ? void 0 : w.length) && !Y && (b = [b[0], b[b.length - 1]]);
                        if (!b) return null;
                        e && 5 !== (null == (q = b) ? void 0 : q.length) && (b = L({
                            minSize: b[0],
                            maxSize: b[b.length - 1]
                        }));
                        var W = k ? f(d, b) : null,
                            ba = z.getSymbolOutlineSize(l),
                            T = G ? null : N(b, h);
                        return (await Promise.all(b.map(async (ja, aa) => {
                            const ka = k ? W[aa] :
                                await C(c, l, ja, u, F),
                                ca = S(Y && "class-breaks" === d.type ? p(d, aa) : l, ka);
                            return {
                                value: ja,
                                symbol: ca,
                                label: G ? R[aa] : T[aa],
                                size: ka,
                                outlineSize: ba
                            }
                        }))).reverse()
                    }
                };
                Object.defineProperty(P, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/styles/Card": function() {
            define("../../../chunks/_rollupPluginBabelHelpers ../../../chunks/tslib.es6 ../../../core/has ../../../core/Logger ../../../core/accessorSupport/ensureType ../../../core/accessorSupport/decorators/property ../../../core/jsonMap ../../../core/accessorSupport/decorators/subclass ../../../core/urlUtils ../../../core/uuid ../../../portal/support/resourceExtension ../../../core/screenUtils ../../../intl/substitute ../../../intl ../../../core/Handles ../../support/widgetUtils ../../support/decorators/accessibleHandler ../../support/decorators/messageBundle ../../../chunks/index ../../Widget ../../../symbols/support/svgUtils ./support/relationshipUtils ./support/univariateUtils ../support/styleUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x, L, Q, C, S, H, U, V, d) {
                    const c = window.devicePixelRatio;
                    A = function(n) {
                        function u(h, w) {
                            h = n.call(this, h, w) || this;
                            h._handles = new M;
                            h._hasIndicators = !1;
                            h._selectedSectionName = null;
                            h._sectionNames = [];
                            h._sectionMap = new Map;
                            h.activeLayerInfos = null;
                            h.layout = "stack";
                            h.messages = null;
                            h.messagesCommon = null;
                            h.type = "card";
                            h.view = null;
                            return h
                        }
                        E._inheritsLoose(u, n);
                        var F = u.prototype;
                        F.initialize = function() {
                            this.own([this.watch("activeLayerInfos", h => {
                                this._handles.removeAll();
                                this._watchForSectionChanges(h)
                            })])
                        };
                        F.destroy = function() {
                            this._handles.destroy();
                            this._handles = null
                        };
                        F.render = function() {
                            this._hasIndicators = "auto" === this.layout && 768 >= this.view.container.clientWidth || "stack" === this.layout;
                            var h = this.activeLayerInfos;
                            h = h && h.toArray().map(y => this._renderLegendForLayer(y)).filter(y => !!y);
                            this._hasIndicators ? this._selectedSectionName && -1 !== this._sectionNames.indexOf(this._selectedSectionName) || (this._selectedSectionName = this._sectionNames && this._sectionNames[0]) : this._selectedSectionName = null;
                            const w =
                                this._sectionNames.length;
                            var q = this._sectionNames.map((y, l) => {
                                l = D.substitute(this.messagesCommon.pagination.pageText, {
                                    index: l + 1,
                                    total: w
                                });
                                return C.jsx("div", {
                                    key: y,
                                    role: "tab",
                                    id: y,
                                    "aria-label": l,
                                    "aria-controls": `${y}-panel`,
                                    "aria-selected": (this._selectedSectionName === y).toString(),
                                    tabIndex: this._selectedSectionName === y ? 0 : -1,
                                    title: l,
                                    onclick: this._selectSection,
                                    onkeydown: this._focusSection,
                                    bind: this,
                                    class: this.classes("esri-legend--card__carousel-indicator", {
                                        ["esri-legend--card__carousel-indicator--activated"]: this._selectedSectionName ===
                                            y
                                    }),
                                    "data-section-name": y
                                })
                            });
                            q = this._hasIndicators && 1 < w ? C.jsx("div", {
                                class: "esri-legend--card__carousel-indicator-container",
                                key: "carousel-navigation",
                                role: "tablist"
                            }, q) : null;
                            h = this._hasIndicators ? this._sectionMap.get(this._selectedSectionName) : h && h.length ? h : null;
                            return C.jsx("div", {
                                class: this.classes("esri-legend--card", {
                                    ["esri-legend--stacked"]: this._hasIndicators
                                })
                            }, h ? h : C.jsx("div", {
                                class: "esri-legend--card__message"
                            }, this.messages.noLegend), q)
                        };
                        F._selectSection = function(h) {
                            if (h = h.target.getAttribute("data-section-name")) this._selectedSectionName =
                                h
                        };
                        F._focusSection = function(h) {
                            switch (h.key) {
                                case "ArrowLeft":
                                case "ArrowRight":
                                    this._switchSectionOnArrowPress(h);
                                    break;
                                case "Enter":
                                case " ":
                                    this._selectSection(h)
                            }
                        };
                        F._switchSectionOnArrowPress = function(h) {
                            const w = h.key,
                                q = "ArrowLeft" === w ? -1 : 1;
                            h = h.target.getAttribute("data-section-name");
                            h = this._sectionNames.indexOf(h);
                            const y = this._sectionNames;
                            let l = null; - 1 !== h && (y[h + q] ? l = document.getElementById(y[h + q]) : "ArrowLeft" === w ? l = document.getElementById(y[y.length - 1]) : "ArrowRight" === w && (l = document.getElementById(y[0])),
                                l && l.focus())
                        };
                        F._watchForSectionChanges = function(h) {
                            this._generateSectionNames();
                            h && (h.forEach(w => {
                                const q = `activeLayerInfo-${w.layer.uid}-version-change`;
                                this._handles.remove(q);
                                this._watchForSectionChanges(w.children);
                                this._handles.add(w.watch("version", () => this._generateSectionNames()), q)
                            }), this._handles.remove("activeLayerInfos-collection-change"), this._handles.add(h.on("change", () => this._watchForSectionChanges(h)), "activeLayerInfos-collection-change"))
                        };
                        F._generateSectionNames = function() {
                            this._sectionNames.length =
                                0;
                            this._selectedSectionName = null;
                            this.activeLayerInfos && this.activeLayerInfos.forEach(this._generateSectionNamesForActiveLayerInfo, this)
                        };
                        F._getSectionName = function(h, w, q) {
                            return `${this.id}${h.uid}-type-${w.type}-${q}`
                        };
                        F._generateSectionNamesForActiveLayerInfo = function(h) {
                            h.children.forEach(this._generateSectionNamesForActiveLayerInfo, this);
                            h.legendElements && h.legendElements.forEach((w, q) => {
                                this._sectionNames.push(this._getSectionName(h.layer, w, q))
                            })
                        };
                        F._renderLegendForLayer = function(h) {
                            if (!h.ready) return null;
                            if (h.children.length) {
                                var w = h.children.map(q => this._renderLegendForLayer(q)).toArray();
                                return C.jsx("div", {
                                    key: h.layer.uid,
                                    class: this.classes("esri-legend--card__service", "esri-legend--card__group-layer")
                                }, C.jsx("div", {
                                    class: "esri-legend--card__service-caption-container"
                                }, h.title), w)
                            } {
                                if ((w = h.legendElements) && !w.length) return null;
                                const q = w.some(y => "relationship-ramp" === y.type);
                                w = w.map((y, l) => this._renderLegendForElement(y, h, l, q)).filter(y => !!y);
                                return w.length ? C.jsx("div", {
                                    key: h.layer.uid,
                                    class: this.classes("esri-legend--card__service", {
                                        ["esri-legend--card__group-layer-child"]: !!h.parent
                                    })
                                }, C.jsx("div", {
                                    class: "esri-legend--card__service-caption-container"
                                }, C.jsx("div", {
                                    class: "esri-legend--card__service-caption-text"
                                }, h.title)), C.jsx("div", {
                                    class: "esri-legend--card__service-content"
                                }, w)) : null
                            }
                        };
                        F._renderLegendForElement = function(h, w, q, y = !1) {
                            const l = "color-ramp" === h.type,
                                b = "opacity-ramp" === h.type;
                            var e = "size-ramp" === h.type;
                            const k = w.layer;
                            var G = h.title,
                                R = null;
                            "string" === typeof G ? R = G : G && (R = d.getTitle(this.messages, G, l || b), R = G.title ?
                                `${G.title} (${R})` : R);
                            q = this._getSectionName(k, h, q);
                            G = this._hasIndicators ? C.jsx("div", null, C.jsx("h3", {
                                class: this.classes("esri-widget__heading", "esri-legend--card__carousel-title")
                            }, w.title), C.jsx("h4", {
                                class: this.classes("esri-widget__heading", "esri-legend--card__layer-caption")
                            }, R)) : R ? C.jsx("h4", {
                                class: this.classes("esri-widget__heading", "esri-legend--card__layer-caption")
                            }, R) : null;
                            R = null;
                            "symbol-table" === h.type ? (e = h.infos.map((Y, W) => this._renderLegendForElementInfo(Y, w, h.legendType, W)).filter(Y =>
                                    !!Y), e.length && (R = C.jsx("div", {
                                    class: this.classes({
                                        ["esri-legend--card__label-container"]: !(e[0].properties.classes && e[0].properties.classes["esri-legend--card__symbol-row"]) && !y,
                                        ["esri-legend--card__relationship-label-container"]: y
                                    })
                                }, e))) : "color-ramp" === h.type || "opacity-ramp" === h.type || "heatmap-ramp" === h.type ? R = this._renderLegendForRamp(h, k.opacity) : e ? R = this._renderSizeRamp(h, k.opacity) : "relationship-ramp" === h.type ? R = U.renderRelationshipRamp(h, this.id, k.opacity) : "univariate-above-and-below-ramp" ===
                                h.type ? R = this._renderUnivariateAboveAndBelowRamp(h, k.opacity) : "univariate-color-size-ramp" === h.type && (R = this._renderUnivariateColorSizeRamp(h, k.opacity));
                            if (!R) return null;
                            y = C.jsx("div", {
                                key: q,
                                class: "esri-legend--card__section",
                                id: `${q}-panel`,
                                role: "tabpanel",
                                "aria-labelledby": q,
                                tabIndex: 0
                            }, [G, R]);
                            this._sectionMap.set(q, y);
                            return y
                        };
                        F._renderUnivariateAboveAndBelowRamp = function(h, w) {
                            const {
                                sizeRampElement: q,
                                colorRampElement: y
                            } = V.getUnivariateAboveAndBelowRampElements(h, w, "horizontal");
                            h = V.getUnivariateSizeRampSize(q,
                                "full", !0, "horizontal");
                            var l = V.getUnivariateColorRampSize(q, "above", !0, "horizontal"),
                                b = V.getUnivariateColorRampSize(q, "below", !0, "horizontal");
                            l = V.getUnivariateColorRampPreview(y, {
                                width: l,
                                height: 12,
                                rampAlignment: "horizontal",
                                opacity: w,
                                type: "above"
                            });
                            w = V.getUnivariateColorRampPreview(y, {
                                width: b,
                                height: 12,
                                rampAlignment: "horizontal",
                                opacity: w,
                                type: "below"
                            });
                            var e = V.getUnivariateColorRampMargin(q, "card");
                            b = q.infos.map(G => G.label);
                            const k = b.length - 1;
                            b = b.map((G, R) => 0 === R || R === k ? C.jsx("div", {
                                    key: R
                                }, G) :
                                null);
                            e = {
                                marginTop: "3px",
                                marginLeft: `${e}px`,
                                display: "flex"
                            };
                            h = {
                                width: `${h}px`,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            };
                            return C.jsx("div", {
                                class: "esri-legend--card__layer-row",
                                key: "size-ramp-preview",
                                styles: {
                                    display: "flex",
                                    flexDirection: "column"
                                }
                            }, C.jsx("div", {
                                class: this.classes("esri-legend--card__symbol-container", "esri-legend__size-ramp--horizontal"),
                                styles: {
                                    display: "flex",
                                    flexDirection: "row"
                                }
                            }, q.infos.map((G, R) => C.jsx("div", {
                                key: R,
                                class: "esri-legend--card__symbol",
                                bind: G.preview,
                                afterCreate: d.attachToNode
                            }))), l ? C.jsx("div", {
                                class: "esri-univariate-above-and-below-ramp__color--card",
                                styles: e,
                                key: "color-ramp-preview"
                            }, C.jsx("div", {
                                bind: l,
                                afterCreate: d.attachToNode
                            }), C.jsx("div", {
                                bind: w,
                                afterCreate: d.attachToNode
                            })) : null, C.jsx("div", {
                                class: "esri-legend__layer-cell esri-legend__layer-cell--info"
                            }, C.jsx("div", {
                                class: "esri-legend__ramp-labels",
                                styles: h
                            }, b)))
                        };
                        F._renderUnivariateColorSizeRamp = function(h, w) {
                            const {
                                sizeRampElement: q,
                                colorRampElement: y
                            } = V.getUnivariateColorSizeRampElements(h,
                                "horizontal");
                            h = V.getUnivariateSizeRampSize(q, "full", !1, "horizontal");
                            var l = V.getUnivariateColorRampSize(q, "full", !1, "horizontal");
                            w = V.getUnivariateColorRampPreview(y, {
                                width: l,
                                height: 12,
                                rampAlignment: "horizontal",
                                opacity: w,
                                type: "full"
                            });
                            var b = V.getUnivariateColorRampMargin(q, "card");
                            const e = q.infos.length - 1;
                            l = q.infos.map((k, G) => 0 === G || G === e ? C.jsx("div", {
                                key: G
                            }, k.label) : null);
                            b = {
                                marginTop: "3px",
                                marginLeft: `${b}px`,
                                display: "flex"
                            };
                            h = {
                                width: `${h}px`,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            };
                            return C.jsx("div", {
                                class: "esri-legend--card__layer-row",
                                key: "size-ramp-preview",
                                styles: {
                                    display: "flex",
                                    flexDirection: "column"
                                }
                            }, C.jsx("div", {
                                class: this.classes("esri-legend--card__symbol-container", "esri-legend__size-ramp--horizontal"),
                                styles: {
                                    display: "flex",
                                    flexDirection: "row"
                                }
                            }, q.infos.map((k, G) => C.jsx("div", {
                                key: G,
                                class: "esri-legend--card__symbol",
                                bind: k.preview,
                                afterCreate: d.attachToNode
                            }))), C.jsx("div", {
                                    class: "esri-univariate-above-and-below-ramp__color--card",
                                    styles: b,
                                    key: "color-ramp-preview"
                                },
                                C.jsx("div", {
                                    bind: w,
                                    afterCreate: d.attachToNode
                                })), C.jsx("div", {
                                class: "esri-legend__layer-cell esri-legend__layer-cell--info"
                            }, C.jsx("div", {
                                class: "esri-legend__ramp-labels",
                                styles: h
                            }, l)))
                        };
                        F._renderLegendForElementInfo = function(h, w, q, y) {
                            var l = w.layer;
                            if (h.type) return this._renderLegendForElement(h, w, y);
                            w = d.isImageryStretchedLegend(l, q);
                            if (h.preview) {
                                var b;
                                if (!h.symbol || -1 === h.symbol.type.indexOf("simple-fill")) {
                                    if (!h.label) return C.jsx("div", {
                                        key: y,
                                        bind: h.preview,
                                        afterCreate: d.attachToNode
                                    });
                                    var e = {
                                        ["esri-legend--card__symbol-cell"]: this._hasIndicators
                                    };
                                    return C.jsx("div", {
                                        key: y,
                                        class: this.classes("esri-legend--card__layer-row", {
                                            ["esri-legend--card__symbol-row"]: this._hasIndicators
                                        })
                                    }, C.jsx("div", {
                                        class: this.classes(e),
                                        bind: h.preview,
                                        afterCreate: d.attachToNode
                                    }), C.jsx("div", {
                                        class: this.classes("esri-legend--card__image-label", {
                                            ["esri-legend--card__label-cell"]: this._hasIndicators
                                        })
                                    }, d.getTitle(this.messages, h.label, !1) || ""))
                                }
                                let k = q = w = 255,
                                    G = 0,
                                    R = 255,
                                    Y = 255,
                                    W = 255,
                                    ba = 0;
                                const T = h.symbol.color &&
                                    h.symbol.color.a,
                                    ja = h.symbol.outline && h.symbol.outline.color && h.symbol.outline.color.a;
                                T && (w = h.symbol.color.r, q = h.symbol.color.g, k = h.symbol.color.b, G = h.symbol.color.a * l.opacity);
                                ja && (R = h.symbol.outline.color.r, Y = h.symbol.outline.color.g, W = h.symbol.outline.color.b, ba = h.symbol.outline.color.a * l.opacity);
                                e = (l = null != (e = null == (b = h.symbol.color) ? void 0 : b.isBright) ? e : !0) ? "rgba(255, 255, 255, .6)" : "rgba(0, 0, 0, .6)";
                                return C.jsx("div", {
                                    key: y,
                                    class: "esri-legend--card__layer-row"
                                }, C.jsx("div", {
                                    class: "esri-legend--card__label-element",
                                    styles: {
                                        background: T ? `rgba(${w}, ${q}, ${k}, ${G})` : "none",
                                        color: l ? "black" : "white",
                                        textShadow: `-1px -1px 0 ${e},
                                              1px -1px 0 ${e},
                                              -1px 1px 0 ${e},
                                              1px 1px 0 ${e}`,
                                        border: ja ? `1px solid rgba(${R}, ${Y}, ${W}, ${ba})` : "none"
                                    }
                                }, " ", h.label, " "))
                            }
                            if (h.src) return e = this._renderImage(h, l, w), C.jsx("div", {
                                key: y,
                                class: "esri-legend--card__layer-row"
                            }, e, C.jsx("div", {
                                class: "esri-legend--card__image-label"
                            }, h.label || ""))
                        };
                        F._renderImage = function(h, w, q) {
                            const {
                                label: y,
                                src: l,
                                opacity: b
                            } = h;
                            q = {
                                ["esri-legend--card__imagery-layer-image--stretched"]: q,
                                ["esri-legend--card__symbol"]: !q
                            };
                            w = {
                                opacity: `${null!=b?b:w.opacity}`
                            };
                            return C.jsx("img", {
                                alt: d.getTitle(this.messages, y, !1),
                                src: l,
                                border: 0,
                                width: h.width,
                                height: h.height,
                                class: this.classes(q),
                                styles: w
                            })
                        };
                        F._renderSizeRampLines = function(h) {
                            h = h.infos;
                            var w = h[0],
                                q = h[h.length - 1],
                                y = w.symbol;
                            h = this._hasIndicators;
                            w = t.pt2px(w.size + w.outlineSize) * c;
                            q = t.pt2px(q.size + q.outlineSize) * c;
                            const l = h ? w : w + 50 * c,
                                b = h ? w / 2 + 50 * c : w;
                            var e;
                            y ? -1 < y.type.indexOf("3d") ? (e = y.symbolLayers && y.symbolLayers.length) ? (e = y.symbolLayers.getItemAt(e - 1).get("resource.primitive"), e = "triangle" === e || "cone" ===
                                e || "tetrahedron" === e) : e = void 0 : e = "triangle" === y.style : e = void 0;
                            if (y)
                                if (-1 < y.type.indexOf("3d")) {
                                    var k = y.symbolLayers && y.symbolLayers.length;
                                    k ? (y = y.symbolLayers.getItemAt(k - 1), y = y.resource && y.resource.primitive, y = "circle" === y || "cross" === y || "kite" === y || "sphere" === y || "cube" === y || "diamond" === y) : y = void 0
                                } else y = y.style, y = "circle" === y || "diamond" === y || "cross" === y;
                            else y = void 0;
                            k = document.createElement("canvas");
                            k.width = l;
                            k.height = b;
                            k.style.width = `${k.width/c}px`;
                            k.style.height = `${k.height/c}px`;
                            const G =
                                k.getContext("2d");
                            if (h) {
                                G.beginPath();
                                var R = l / 2 - q / 2;
                                G.moveTo(0, 0);
                                G.lineTo(R, b);
                                R = l / 2 + q / 2;
                                G.moveTo(l, 0);
                                G.lineTo(R, b)
                            } else G.beginPath(), G.moveTo(0, b / 2 - q / 2), G.lineTo(l, 0), G.moveTo(0, b / 2 + q / 2), G.lineTo(l, b);
                            G.strokeStyle = "#ddd";
                            G.stroke();
                            return C.jsx("div", {
                                bind: k,
                                afterCreate: d.attachToNode,
                                styles: h ? {
                                    display: "flex",
                                    marginTop: `-${e?0:y?w/2:0}px`,
                                    marginBottom: `-${e?q:y?q/2:0}px`
                                } : {
                                    display: "flex",
                                    marginRight: `-${e?0:y?w/2:0}px`,
                                    marginLeft: `-${e?0:y?q/2:0}px`
                                }
                            })
                        };
                        F._renderSizeRamp = function(h, w) {
                            var q =
                                h.infos;
                            const y = q[0].label,
                                l = q[q.length - 1].label;
                            let b = q[0].preview;
                            q = q[q.length - 1].preview;
                            const e = this._hasIndicators,
                                k = {
                                    "flex-direction": e ? "column" : "row-reverse"
                                };
                            b && (b = b.cloneNode(!0), b.style.display = "flex");
                            q && (q = q.cloneNode(!0), q.style.display = "flex");
                            w = {
                                opacity: null != w ? `${w}` : ""
                            };
                            return C.jsx("div", {
                                class: this.classes("esri-legend--card__layer-row", {
                                    ["esri-legend--card__size-ramp-row"]: e
                                })
                            }, C.jsx("div", {
                                class: "esri-legend--card__ramp-label"
                            }, e ? y : l), C.jsx("div", {
                                class: "esri-legend--card__size-ramp-container",
                                styles: k
                            }, C.jsx("div", {
                                bind: b,
                                afterCreate: d.attachToNode,
                                class: "esri-legend--card__size-ramp-preview",
                                styles: w
                            }), this._renderSizeRampLines(h), C.jsx("div", {
                                bind: q,
                                afterCreate: d.attachToNode,
                                class: "esri-legend--card__size-ramp-container",
                                styles: w
                            })), C.jsx("div", {
                                class: "esri-legend--card__ramp-label"
                            }, e ? l : y))
                        };
                        F._renderLegendForRamp = function(h, w) {
                            var q = h.infos;
                            const y = "heatmap-ramp" === h.type,
                                l = q.length - 1;
                            var b = 2 < l && !y ? 25 * l : 100;
                            const e = b + 20,
                                k = q.slice(0).reverse();
                            k.forEach((W, ba) => {
                                W.offset = y ? W.ratio :
                                    ba / l
                            });
                            const G = k.length - 1;
                            h = (h = 0 !== k.length % 2 && k[k.length / 2 | 0]) && C.jsx("div", {
                                class: "esri-legend--card__interval-separators-container"
                            }, C.jsx("div", {
                                class: "esri-legend--card__interval-separator"
                            }, "|"), C.jsx("div", {
                                class: "esri-legend--card__ramp-label"
                            }, h.label));
                            const R = q[q.length - 1].label;
                            q = q[0].label;
                            let Y = null;
                            null != w && (Y = `opacity: ${w}`);
                            w = H.renderSVG([
                                [{
                                    shape: {
                                        type: "path",
                                        path: "M0 12.5 L10 0 L10 25 Z"
                                    },
                                    fill: k[0].color,
                                    stroke: {
                                        width: 0
                                    }
                                }, {
                                    shape: {
                                        type: "rect",
                                        x: 10,
                                        y: 0,
                                        width: b,
                                        height: 25
                                    },
                                    fill: {
                                        type: "linear",
                                        x1: 10,
                                        y1: 0,
                                        x2: b + 10,
                                        y2: 0,
                                        colors: k
                                    },
                                    stroke: {
                                        width: 0
                                    }
                                }, {
                                    shape: {
                                        type: "path",
                                        path: `M${b+10} 0 L${e} ${12.5} L${b+10} ${25} Z`
                                    },
                                    fill: k[G].color,
                                    stroke: {
                                        width: 0
                                    }
                                }]
                            ], e, 25);
                            ({
                                messages: b
                            } = this);
                            return C.jsx("div", {
                                class: "esri-legend--card__layer-row"
                            }, C.jsx("div", {
                                class: "esri-legend--card__ramp-label"
                            }, y ? b[R] : R), C.jsx("div", {
                                class: "esri-legend--card__symbol-container"
                            }, C.jsx("div", {
                                style: Y
                            }, w), h), C.jsx("div", {
                                class: "esri-legend--card__ramp-label"
                            }, y ? b[q] : q))
                        };
                        return u
                    }(S);
                    P.__decorate([z.property()], A.prototype,
                        "activeLayerInfos", void 0);
                    P.__decorate([z.property()], A.prototype, "layout", void 0);
                    P.__decorate([z.property(), Q.messageBundle("esri/widgets/Legend/t9n/Legend")], A.prototype, "messages", void 0);
                    P.__decorate([z.property(), Q.messageBundle("esri/t9n/common")], A.prototype, "messagesCommon", void 0);
                    P.__decorate([z.property({
                        readOnly: !0
                    })], A.prototype, "type", void 0);
                    P.__decorate([z.property()], A.prototype, "view", void 0);
                    P.__decorate([L.accessibleHandler()], A.prototype, "_selectSection", null);
                    return A = P.__decorate([X.subclass("esri.widgets.Legend.styles.Card")],
                        A)
                })
        },
        "esri/widgets/Legend/styles/support/relationshipUtils": function() {
            define("exports ../../../../core/has ../../../../core/Logger ../../../support/widgetUtils ../../../../chunks/index ../../../../symbols/support/svgUtils".split(" "), function(E, P, A, v, m, z) {
                function J(f, p, t) {
                    const D = `${t}_arrowStart`;
                    t = `${t}_arrowEnd`;
                    f = "left" === f;
                    const I = {
                        markerStart: null,
                        markerEnd: null
                    };
                    switch (p) {
                        case "HL":
                            f ? I.markerStart = `url(#${t})` : I.markerEnd = `url(#${D})`;
                            break;
                        case "LL":
                            I.markerStart = `url(#${t})`;
                            break;
                        case "LH":
                            f ?
                                I.markerEnd = `url(#${D})` : I.markerStart = `url(#${t})`;
                            break;
                        default:
                            I.markerEnd = `url(#${D})`
                    }
                    return I
                }

                function X(f, p, t, D = 60) {
                    const {
                        focus: I,
                        numClasses: M,
                        colors: x,
                        rotation: L
                    } = f;
                    f = !!I;
                    const Q = Math.sqrt(D ** 2 + D ** 2) + (f ? 0 : 5);
                    let C = null;
                    null != t && (C = `opacity: ${t}`);
                    t = [];
                    const S = [];
                    var H = [],
                        U = (D || 75) / M;
                    for (var V = 0; V < M; V++) {
                        var d = V * U;
                        for (var c = 0; c < M; c++) {
                            var n = c * U;
                            const u = z.generateFillAttributes(x[V][c]),
                                F = z.generateStrokeAttributes(null);
                            n = {
                                type: "rect",
                                x: n,
                                y: d,
                                width: U,
                                height: U
                            };
                            t.push(z.renderDef(u));
                            S.push(z.renderShape(n,
                                u.fill, F, null));
                            H.push(z.getBoundingBox(n))
                        }
                    }
                    U = null;
                    f || (U = "margin: -15px -15px -18px -15px");
                    V = J("left", I, p);
                    d = J("right", I, p);
                    c = z.computeBBox(H);
                    H = z.getTransformMatrix(c, Q, Q, 0, !1, L, !1);
                    c = z.getTransformMatrix(c, Q, Q, 0, !1, f ? -45 : null, !1);
                    return m.jsx("div", {
                        style: C,
                        class: f ? N.diamondMidColRamp : N.squareTableCell
                    }, m.jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: Q,
                        height: Q,
                        style: U
                    }, m.jsx("defs", null, m.jsx("marker", {
                        id: `${p}_arrowStart`,
                        markerWidth: "10",
                        markerHeight: "10",
                        refX: "5",
                        refY: "5",
                        markerUnits: "strokeWidth",
                        orient: "auto"
                    }, m.jsx("polyline", {
                        points: "0,0 5,5 0,10",
                        fill: "none",
                        stroke: "#555555",
                        "stroke-width": "1"
                    })), m.jsx("marker", {
                        id: `${p}_arrowEnd`,
                        markerWidth: "10",
                        markerHeight: "10",
                        refX: "0",
                        refY: "5",
                        markerUnits: "strokeWidth",
                        orient: "auto"
                    }, m.jsx("polyline", {
                        points: "5,0 0,5 5,10",
                        fill: "none",
                        stroke: "#555555",
                        "stroke-width": "1"
                    })), t), m.jsx("g", {
                        transform: H
                    }, S), m.jsx("g", {
                        transform: c
                    }, m.jsx("line", {
                        fill: "none",
                        stroke: "#555555",
                        "stroke-width": "1",
                        "marker-start": V.markerStart,
                        "marker-end": V.markerEnd,
                        x1: -10,
                        y1: D - 15,
                        x2: -10,
                        y2: 15
                    }), m.jsx("line", {
                        fill: "none",
                        stroke: "#555555",
                        "stroke-width": "1",
                        "marker-start": d.markerStart,
                        "marker-end": d.markerEnd,
                        x1: 15,
                        y1: D + 10,
                        x2: D - 15,
                        y2: D + 10
                    }))))
                }
                const N = {
                    diamondContainer: "esri-relationship-ramp--diamond__container",
                    diamondLeftCol: "esri-relationship-ramp--diamond__left-column",
                    diamondRightCol: "esri-relationship-ramp--diamond__right-column",
                    diamondMidCol: "esri-relationship-ramp--diamond__middle-column",
                    diamondMidColLabel: "esri-relationship-ramp--diamond__middle-column--label",
                    diamondMidColRamp: "esri-relationship-ramp--diamond__middle-column--ramp",
                    squareTable: "esri-relationship-ramp--square__table",
                    squareTableRow: "esri-relationship-ramp--square__table-row",
                    squareTableCell: "esri-relationship-ramp--square__table-cell",
                    squareTableLabel: "esri-relationship-ramp--square__table-label",
                    squareTableLabelLeftBottom: "esri-relationship-ramp--square__table-label--left-bottom",
                    squareTableLabelRightBottom: "esri-relationship-ramp--square__table-label--right-bottom",
                    squareTableLabelLeftTop: "esri-relationship-ramp--square__table-label--left-top",
                    squareTableLabelRightTop: "esri-relationship-ramp--square__table-label--right-top"
                };
                E.renderRelationshipRamp = function(f, p, t) {
                    const {
                        focus: D,
                        labels: I
                    } = f, M = !!D;
                    f = X(f, p, t);
                    return M ? m.jsx("div", {
                        class: N.diamondContainer
                    }, m.jsx("div", {
                        class: N.diamondLeftCol
                    }, I.left), m.jsx("div", {
                        class: N.diamondMidCol
                    }, m.jsx("div", {
                        class: N.diamondMidColLabel
                    }, I.top), f, m.jsx("div", {
                        class: N.diamondMidColLabel
                    }, I.bottom)), m.jsx("div", {
                        class: N.diamondRightCol
                    }, I.right)) : m.jsx("div", {
                        class: N.squareTable
                    }, m.jsx("div", {
                            class: N.squareTableRow
                        },
                        m.jsx("div", {
                            class: v.classes(N.squareTableCell, N.squareTableLabel, N.squareTableLabelRightBottom)
                        }, I.left), m.jsx("div", {
                            class: N.squareTableCell
                        }), m.jsx("div", {
                            class: v.classes(N.squareTableCell, N.squareTableLabel, N.squareTableLabelLeftBottom)
                        }, I.top)), m.jsx("div", {
                        class: N.squareTableRow
                    }, m.jsx("div", {
                        class: N.squareTableCell
                    }), f, m.jsx("div", {
                        class: N.squareTableCell
                    })), m.jsx("div", {
                            class: N.squareTableRow
                        }, m.jsx("div", {
                            class: v.classes(N.squareTableCell, N.squareTableLabel, N.squareTableLabelRightTop)
                        }, I.bottom),
                        m.jsx("div", {
                            class: N.squareTableCell
                        }), m.jsx("div", {
                            class: v.classes(N.squareTableCell, N.squareTableLabel, N.squareTableLabelLeftTop)
                        }, I.right)))
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/styles/support/univariateUtils": function() {
            define("exports ../../../../core/has ../../../../core/Logger ../../../../core/screenUtils ../../../support/widgetUtils ../../../../libs/maquette/projection ../../../../libs/maquette/projector ../../../../chunks/index ../../../../symbols/support/symbolUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N) {
                    function f(x = "vertical") {
                        return "vertical" === x ? X.jsx("svg", {
                            height: "4",
                            width: "10"
                        }, X.jsx("line", {
                            x1: "0",
                            y1: "2",
                            x2: "10",
                            y2: "2",
                            style: "stroke:rgb(200, 200, 200);stroke-width:1"
                        })) : X.jsx("svg", {
                            height: "10",
                            width: "10"
                        }, X.jsx("line", {
                            x1: "5",
                            y1: "0",
                            x2: "5",
                            y2: "10",
                            style: "stroke:rgb(200, 200, 200);stroke-width:1"
                        }))
                    }

                    function p(x, L = "vertical") {
                        const Q = document.createElement("div");
                        Q.style.height = "20px";
                        Q.className = M.univariateAboveAndBelowSymbol;
                        null != x && (Q.style.opacity = x.toString());
                        I.append(Q, f.bind(null, L));
                        return Q
                    }

                    function t(x, L, Q = "vertical", C) {
                        x.infos.forEach((S, H) => {
                            if (C && 2 === H) S.preview = p(L, Q);
                            else {
                                H = v.pt2px(S.size) + ("horizontal" === Q ? 20 : 10);
                                const U = "div" === S.preview.tagName.toLowerCase(),
                                    V = U ? S.preview : document.createElement("div");
                                V.className = M.univariateAboveAndBelowSymbol;
                                "horizontal" === Q ? V.style.width = `${H}px` : V.style.height = `${H}px`;
                                U || V.appendChild(S.preview);
                                S.preview = V
                            }
                        })
                    }

                    function D(x, L, Q, C = "vertical") {
                        let S = 0;
                        x = x.infos;
                        const H = Math.floor(x.length / 2);
                        var U = "full" ===
                            L || "above" === L ? 0 : H;
                        for (L = "full" === L || "below" === L ? x.length - 1 : H; U <= L; U++)
                            if (Q && U === H) S += "horizontal" === C ? 10 : 20;
                            else {
                                const V = v.pt2px(x[U].size) + ("horizontal" === C ? 20 : 10);
                                S += V
                            }
                        return Math.round(S)
                    }
                    const I = J.createProjector(),
                        M = {
                            univariateAboveAndBelowSymbol: "esri-univariate-above-and-below-ramp__symbol",
                            colorRamp: "esri-legend__color-ramp"
                        };
                    E.getUnivariateAboveAndBelowRampElements = function(x, L, Q = "vertical") {
                        var C = x.infos;
                        x = C.filter(({
                            type: H
                        }) => "size-ramp" === H)[0];
                        C = C.filter(({
                            type: H
                        }) => "color-ramp" === H)[0];
                        x && (x = { ...x
                        }, x.infos = [...x.infos]);
                        C && (C = { ...C
                        }, C.infos = [...C.infos]);
                        t(x, L, Q, !0);
                        if ("horizontal" === Q) {
                            var S;
                            x.infos.reverse();
                            null == (S = C) ? void 0 : S.infos.reverse()
                        }
                        return {
                            sizeRampElement: x,
                            colorRampElement: C
                        }
                    };
                    E.getUnivariateColorRampMargin = function(x, L = "classic") {
                        x = x.infos;
                        return "classic" === L ? (v.pt2px(x[0].size) + 10) / 2 : (v.pt2px(x[0].size) - v.pt2px(x[x.length - 1].size)) / 2
                    };
                    E.getUnivariateColorRampPreview = function(x, L) {
                        if (!x) return null;
                        x = x.infos.map(Q => Q.color);
                        x = N.renderColorRampPreviewHTML("full" ===
                            L.type ? x : "above" === L.type ? x.slice(0, 3) : x.slice(2, 5), {
                                width: L.width,
                                height: L.height,
                                align: L.rampAlignment
                            });
                        x.className = M.colorRamp;
                        null != L.opacity && (x.style.opacity = L.opacity.toString());
                        return x
                    };
                    E.getUnivariateColorRampSize = function(x, L, Q, C = "vertical") {
                        const S = D(x, L, Q, C);
                        x = x.infos;
                        var H = Math.floor(x.length / 2);
                        const U = "full" === L || "above" === L ? 0 : H;
                        H = "full" === L || "below" === L ? x.length - 1 : H;
                        Q = Q ? "vertical" === C ? 20 : 10 : 0;
                        C = "vertical" === C ? 10 * ("full" === L ? 2 : 1) : 20 * ("full" === L ? 2 : 1);
                        return Math.round(S - (v.pt2px("full" ===
                            L ? x[U].size + x[H].size : "above" === L ? x[U].size : x[H].size) / 2 + Q / 2 + C / 2))
                    };
                    E.getUnivariateColorSizeRampElements = function(x, L = "vertical") {
                        var Q = x.infos;
                        x = Q.filter(({
                            type: S
                        }) => "size-ramp" === S)[0];
                        Q = Q.filter(({
                            type: S
                        }) => "color-ramp" === S)[0];
                        x && (x = { ...x
                        }, x.infos = [...x.infos]);
                        Q && (Q = { ...Q
                        }, Q.infos = [...Q.infos]);
                        t(x, null, L, !1);
                        if ("horizontal" === L) {
                            var C;
                            x.infos.reverse();
                            null == (C = Q) ? void 0 : C.infos.reverse()
                        }
                        return {
                            sizeRampElement: x,
                            colorRampElement: Q
                        }
                    };
                    E.getUnivariateSizeRampSize = D;
                    Object.defineProperty(E, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/widgets/Legend/support/styleUtils": function() {
            define(["exports", "../../../intl/substitute", "../../../intl"], function(E, P, A) {
                E.attachToNode = function(v) {
                    v.appendChild(this)
                };
                E.getTitle = function(v, m, z) {
                    if (m) {
                        if ("string" === typeof m || "number" === typeof m) return m;
                        if ("value" in m || "unit" in m) return P.substitute(v.dotValue, m);
                        if ("colorName" in m || "bandName" in m) return v[m.colorName] + ": " + (v[m.bandName] || m.bandName);
                        if ("showCount" in m) return m.showCount ? v.clusterCountTitle : null;
                        var J = null;
                        z ? J = m.ratioPercentTotal ? "showRatioPercentTotal" : m.ratioPercent ? "showRatioPercent" : m.ratio ? "showRatio" : m.normField ? "showNormField" : m.field ? "showField" : null : z || (J = m.normField ? "showNormField" : m.normByPct ? "showNormPct" : m.field ? "showField" : null);
                        return J ? P.substitute("showField" === J ? "{field}" : v[J], {
                            field: m.field,
                            normField: m.normField
                        }) : null
                    }
                };
                E.isImageryStretchedLegend = function(v, m) {
                    return !!(m && "Stretched" === m && 10.3 <= v.version && "esri.layers.ImageryLayer" === v.declaredClass)
                };
                E.isRendererTitle = function(v,
                    m) {
                    return !m
                };
                Object.defineProperty(E, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/widgets/Legend/styles/Classic": function() {
            define("../../../chunks/_rollupPluginBabelHelpers ../../../chunks/tslib.es6 ../../../core/has ../../../core/Logger ../../../core/accessorSupport/ensureType ../../../core/accessorSupport/decorators/property ../../../core/jsonMap ../../../core/accessorSupport/decorators/subclass ../../../core/urlUtils ../../../core/uuid ../../../portal/support/resourceExtension ../../../intl/number ../../../intl ../../support/widgetUtils ../../support/decorators/messageBundle ../../../chunks/index ../../Widget ./support/relationshipUtils ./support/univariateUtils ../support/styleUtils".split(" "),
                function(E, P, A, v, m, z, J, X, N, f, p, t, D, I, M, x, L, Q, C, S) {
                    const H = {
                            display: "flex",
                            alignItems: "flex-start"
                        },
                        U = {
                            marginLeft: "3px"
                        },
                        V = {
                            display: "table-cell",
                            verticalAlign: "middle"
                        };
                    A = function(d) {
                        function c(u, F) {
                            u = d.call(this, u, F) || this;
                            u.activeLayerInfos = null;
                            u.messages = null;
                            u.type = "classic";
                            return u
                        }
                        E._inheritsLoose(c, d);
                        var n = c.prototype;
                        n.render = function() {
                            var u = this.activeLayerInfos;
                            u = u && u.toArray().map(F => this._renderLegendForLayer(F)).filter(F => !!F);
                            return x.jsx("div", null, u && u.length ? u : x.jsx("div", {
                                    class: "esri-legend__message"
                                },
                                this.messages.noLegend))
                        };
                        n._renderLegendForLayer = function(u) {
                            if (!u.ready) return null;
                            var F = !!u.children.length;
                            const h = `${"esri-legend__"}${u.layer.uid}-version-${u.version}`,
                                w = u.title ? x.jsx("h3", {
                                    class: this.classes("esri-widget__heading", "esri-legend__service-label")
                                }, u.title) : null;
                            if (F) return F = u.children.map(q => this._renderLegendForLayer(q)).toArray(), x.jsx("div", {
                                key: h,
                                class: this.classes("esri-legend__service", "esri-legend__group-layer")
                            }, w, F);
                            if ((F = u.legendElements) && !F.length) return null;
                            F =
                                F.map(q => this._renderLegendForElement(q, u.layer)).filter(q => !!q);
                            return F.length ? x.jsx("div", {
                                key: h,
                                class: this.classes("esri-legend__service", {
                                    ["esri-legend__group-layer-child"]: !!u.parent
                                }),
                                tabIndex: 0
                            }, w, x.jsx("div", {
                                class: "esri-legend__layer"
                            }, F)) : null
                        };
                        n._renderLegendForElement = function(u, F, h) {
                            var w = "color-ramp" === u.type,
                                q = "opacity-ramp" === u.type;
                            const y = "size-ramp" === u.type;
                            let l = null;
                            if ("symbol-table" === u.type || y) {
                                var b = u.infos.map(k => this._renderLegendForElementInfo(k, F, y, u.legendType)).filter(k =>
                                    !!k);
                                b.length && (l = x.jsx("div", {
                                    class: "esri-legend__layer-body"
                                }, b))
                            } else "color-ramp" === u.type || "opacity-ramp" === u.type || "heatmap-ramp" === u.type || "stretch-ramp" === u.type ? l = this._renderLegendForRamp(u, F.opacity) : "relationship-ramp" === u.type ? l = Q.renderRelationshipRamp(u, this.id, F.opacity) : "univariate-above-and-below-ramp" === u.type ? l = this._renderUnivariateAboveAndBelowRamp(u, F.opacity) : "univariate-color-size-ramp" === u.type && (l = this._renderUnivariateColorSizeRamp(u, F.opacity));
                            if (!l) return null;
                            b = u.title;
                            var e = null;
                            "string" === typeof b ? e = b : b && (e = S.getTitle(this.messages, b, w || q), e = S.isRendererTitle(b, w || q) && b.title ? `${b.title} (${e})` : e);
                            w = h ? "esri-legend__layer-child-table" : "esri-legend__layer-table";
                            q = e ? x.jsx("div", {
                                class: "esri-legend__layer-caption"
                            }, e) : null;
                            return x.jsx("div", {
                                class: this.classes(w, {
                                    ["esri-legend__layer-table--size-ramp"]: y || !h
                                })
                            }, q, l)
                        };
                        n._renderUnivariateAboveAndBelowRamp = function(u, F) {
                            const {
                                sizeRampElement: h,
                                colorRampElement: w
                            } = C.getUnivariateAboveAndBelowRampElements(u, F);
                            var q =
                                C.getUnivariateColorRampSize(h, "above", !0);
                            u = C.getUnivariateColorRampSize(h, "below", !0);
                            const y = C.getUnivariateColorRampPreview(w, {
                                width: 12,
                                height: q,
                                rampAlignment: "vertical",
                                opacity: F,
                                type: "above"
                            });
                            F = C.getUnivariateColorRampPreview(w, {
                                width: 12,
                                height: u,
                                rampAlignment: "vertical",
                                opacity: F,
                                type: "below"
                            });
                            var l = C.getUnivariateColorRampMargin(h);
                            const b = h.infos.map(W => W.label),
                                e = b.map((W, ba) => {
                                    const T = 2 === ba;
                                    return 0 === ba ? x.jsx("div", {
                                        key: ba,
                                        class: W ? y ? "esri-univariate-above-and-below-ramp__label" : "esri-legend__ramp-label" : null
                                    }, W) : T ? x.jsx("div", null) : null
                                }),
                                k = b.length - 1,
                                G = Math.floor(b.length / 2),
                                R = b.map((W, ba) => {
                                    const T = ba === k;
                                    return ba === G || T ? x.jsx("div", {
                                        key: ba,
                                        class: W ? y ? "esri-univariate-above-and-below-ramp__label" : "esri-legend__ramp-label" : null
                                    }, W) : null
                                }),
                                Y = {
                                    display: "table-cell",
                                    verticalAlign: "middle"
                                };
                            l = {
                                marginTop: `${l}px`
                            };
                            q = {
                                height: `${q}px`
                            };
                            u = {
                                height: `${u}px`
                            };
                            return x.jsx("div", {
                                key: "univariate-above-and-below-ramp-preview",
                                styles: H
                            }, x.jsx("div", {
                                class: "esri-legend__layer-body"
                            }, h.infos.map((W, ba) => x.jsx("div", {
                                class: this.classes("esri-legend__layer-row", "esri-legend__size-ramp")
                            }, x.jsx("div", {
                                class: "esri-legend__symbol",
                                styles: Y,
                                bind: W.preview,
                                afterCreate: S.attachToNode
                            }), y || 0 !== ba % 2 ? null : x.jsx("div", {
                                class: "esri-legend__layer-cell esri-legend__layer-cell--info"
                            }, b[ba])))), y ? x.jsx("div", {
                                styles: l,
                                key: "color-ramp-preview"
                            }, x.jsx("div", {
                                styles: U
                            }, x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramps",
                                bind: y,
                                afterCreate: S.attachToNode
                            })), x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramp-labels",
                                styles: q
                            }, e))), x.jsx("div", {
                                styles: U
                            }, x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramps",
                                bind: F,
                                afterCreate: S.attachToNode
                            })), x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramp-labels",
                                styles: u
                            }, R)))) : null)
                        };
                        n._renderUnivariateColorSizeRamp = function(u, F) {
                            const {
                                sizeRampElement: h,
                                colorRampElement: w
                            } = C.getUnivariateColorSizeRampElements(u);
                            var q = C.getUnivariateColorRampMargin(h);
                            u = C.getUnivariateColorRampSize(h, "full", !1);
                            F = C.getUnivariateColorRampPreview(w, {
                                width: 12,
                                height: u,
                                rampAlignment: "vertical",
                                opacity: F,
                                type: "full"
                            });
                            const y = h.infos.length - 1,
                                l = h.infos.map((e, k) => 0 === k || k === y ? x.jsx("div", {
                                    key: k,
                                    class: e.label ? w ? "esri-univariate-above-and-below-ramp__label" : "esri-legend__ramp-label" : null
                                }, e.label) : null),
                                b = {
                                    display: "table-cell",
                                    verticalAlign: "middle"
                                };
                            q = {
                                marginTop: `${q}px`
                            };
                            u = {
                                height: `${u}px`
                            };
                            return x.jsx("div", {
                                key: "univariate-above-and-below-ramp-preview",
                                styles: H
                            }, x.jsx("div", {
                                class: "esri-legend__layer-body"
                            }, h.infos.map(e => x.jsx("div", {
                                class: this.classes("esri-legend__layer-row",
                                    "esri-legend__size-ramp")
                            }, x.jsx("div", {
                                class: "esri-legend__symbol",
                                styles: b,
                                bind: e.preview,
                                afterCreate: S.attachToNode
                            })))), x.jsx("div", {
                                styles: q,
                                key: "color-ramp-preview"
                            }, x.jsx("div", {
                                styles: U
                            }, x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramps",
                                bind: F,
                                afterCreate: S.attachToNode
                            })), x.jsx("div", {
                                styles: V
                            }, x.jsx("div", {
                                class: "esri-legend__ramp-labels",
                                styles: u
                            }, l)))))
                        };
                        n._renderLegendForRamp = function(u, F) {
                            const h = u.infos,
                                w = "heatmap-ramp" === u.type,
                                q = "stretch-ramp" === u.type,
                                y = u.preview;
                            y.className =
                                `${"esri-legend__color-ramp"} ${"opacity-ramp"===u.type?"esri-legend__opacity-ramp":""}`;
                            null != F && (y.style.opacity = F.toString());
                            u = h.map(l => x.jsx("div", {
                                class: l.label ? "esri-legend__ramp-label" : null
                            }, w ? this.messages[l.label] : q ? this._getStretchStopLabel(l) : l.label));
                            F = {
                                height: y.style.height
                            };
                            return x.jsx("div", {
                                    class: "esri-legend__layer-row"
                                }, x.jsx("div", {
                                    class: "esri-legend__layer-cell esri-legend__layer-cell--symbols",
                                    styles: {
                                        width: "24px"
                                    }
                                }, x.jsx("div", {
                                    class: "esri-legend__ramps",
                                    bind: y,
                                    afterCreate: S.attachToNode
                                })),
                                x.jsx("div", {
                                    class: "esri-legend__layer-cell esri-legend__layer-cell--info"
                                }, x.jsx("div", {
                                    class: "esri-legend__ramp-labels",
                                    styles: F
                                }, u)))
                        };
                        n._getStretchStopLabel = function(u) {
                            return u.label ? this.messages[u.label] + ": " + t.formatNumber(u.value, {
                                style: "decimal",
                                notation: -1 < u.value.toString().indexOf("e") ? "scientific" : "standard"
                            }) : ""
                        };
                        n._renderLegendForElementInfo = function(u, F, h, w) {
                            if (u.type) return this._renderLegendForElement(u, F, !0);
                            let q = null;
                            w = S.isImageryStretchedLegend(F, w);
                            u.preview ? q = x.jsx("div", {
                                class: "esri-legend__symbol",
                                bind: u.preview,
                                afterCreate: S.attachToNode
                            }) : u.src && (q = this._renderImage(u, F, w));
                            if (!q) return null;
                            F = {
                                ["esri-legend__imagery-layer-info--stretched"]: w
                            };
                            return x.jsx("div", {
                                class: "esri-legend__layer-row"
                            }, x.jsx("div", {
                                class: this.classes("esri-legend__layer-cell esri-legend__layer-cell--symbols", {
                                    ["esri-legend__imagery-layer-info--stretched"]: w,
                                    ["esri-legend__size-ramp"]: !w && h
                                })
                            }, q), x.jsx("div", {
                                    class: this.classes("esri-legend__layer-cell esri-legend__layer-cell--info", F)
                                },
                                S.getTitle(this.messages, u.label, !1) || ""))
                        };
                        n._renderImage = function(u, F, h) {
                            const {
                                label: w,
                                src: q,
                                opacity: y
                            } = u;
                            h = {
                                ["esri-legend__imagery-layer-image--stretched"]: h,
                                ["esri-legend__symbol"]: !h
                            };
                            F = {
                                opacity: `${null!=y?y:F.opacity}`
                            };
                            return x.jsx("img", {
                                alt: S.getTitle(this.messages, w, !1),
                                src: q,
                                border: 0,
                                width: u.width,
                                height: u.height,
                                class: this.classes(h),
                                styles: F
                            })
                        };
                        return c
                    }(L);
                    P.__decorate([z.property()], A.prototype, "activeLayerInfos", void 0);
                    P.__decorate([z.property(), M.messageBundle("esri/widgets/Legend/t9n/Legend")],
                        A.prototype, "messages", void 0);
                    P.__decorate([z.property({
                        readOnly: !0
                    })], A.prototype, "type", void 0);
                    return A = P.__decorate([X.subclass("esri.widgets.Legend.styles.Classic")], A)
                })
        },
        "*noref": 1
    }
});
define("../chunks/_rollupPluginBabelHelpers ../chunks/tslib.es6 ../core/has ../core/Logger ../core/accessorSupport/decorators/property ../core/accessorSupport/decorators/aliasOf ../core/accessorSupport/decorators/cast ../core/jsonMap ../core/accessorSupport/decorators/subclass ../core/urlUtils ../core/uuid ../portal/support/resourceExtension ../core/Handles ../core/watchUtils ./support/widgetUtils ./support/decorators/messageBundle ../chunks/index ./Widget ./Legend/LegendViewModel ./Legend/styles/Card ./Legend/styles/Classic".split(" "), function(E,
    P, A, v, m, z, J, X, N, f, p, t, D, I, M, x, L, Q, C, S, H) {
    A = function(U) {
        function V(c, n) {
            c = U.call(this, c, n) || this;
            c._handles = new D;
            c.activeLayerInfos = null;
            c.basemapLegendVisible = !1;
            c.groundLegendVisible = !1;
            c.keepCacheOnDestroy = !1;
            c.respectLayerVisibility = !0;
            c.iconClass = "esri-icon-layer-list";
            c.label = void 0;
            c.layerInfos = null;
            c.messages = null;
            c.style = new H;
            c.view = null;
            c.viewModel = new C;
            return c
        }
        E._inheritsLoose(V, U);
        var d = V.prototype;
        d.initialize = function() {
            this.own(I.on(this, "activeLayerInfos", "change", () => this._refreshActiveLayerInfos(this.activeLayerInfos)),
                I.init(this, "style", (c, n) => {
                    n && c !== n && n.destroy();
                    c && (c.activeLayerInfos = this.activeLayerInfos, "card" === c.type && (c.view = this.view))
                }))
        };
        d.destroy = function() {
            this._handles.destroy();
            this._handles = null
        };
        d.castStyle = function(c) {
            if (c instanceof S || c instanceof H) return c;
            if ("string" === typeof c) return "card" === c ? new S : new H;
            if (c && "string" === typeof c.type) {
                const n = { ...c
                };
                delete n.type;
                return new("card" === c.type ? S : H)(n)
            }
            return new H
        };
        d.render = function() {
            return L.jsx("div", {
                class: this.classes("esri-legend",
                    "esri-widget", this.style instanceof H ? "esri-widget--panel" : null)
            }, this.style.render())
        };
        d._refreshActiveLayerInfos = function(c) {
            this._handles.removeAll();
            c.forEach(n => this._renderOnActiveLayerInfoChange(n));
            this.scheduleRender()
        };
        d._renderOnActiveLayerInfoChange = function(c) {
            var n = I.init(c, "version", () => this.scheduleRender());
            this._handles.add(n, `version_${c.layer.uid}`);
            n = I.on(c, "children", "change", () => {
                c.children.forEach(u => this._renderOnActiveLayerInfoChange(u))
            });
            this._handles.add(n, `children_${c.layer.uid}`);
            c.children.forEach(u => this._renderOnActiveLayerInfoChange(u))
        };
        return V
    }(Q);
    P.__decorate([z.aliasOf("viewModel.activeLayerInfos")], A.prototype, "activeLayerInfos", void 0);
    P.__decorate([z.aliasOf("viewModel.basemapLegendVisible")], A.prototype, "basemapLegendVisible", void 0);
    P.__decorate([z.aliasOf("viewModel.groundLegendVisible")], A.prototype, "groundLegendVisible", void 0);
    P.__decorate([z.aliasOf("viewModel.keepCacheOnDestroy")], A.prototype, "keepCacheOnDestroy", void 0);
    P.__decorate([z.aliasOf("viewModel.respectLayerVisibility")],
        A.prototype, "respectLayerVisibility", void 0);
    P.__decorate([m.property()], A.prototype, "iconClass", void 0);
    P.__decorate([m.property({
        aliasOf: {
            source: "messages.widgetLabel",
            overridable: !0
        }
    })], A.prototype, "label", void 0);
    P.__decorate([z.aliasOf("viewModel.layerInfos")], A.prototype, "layerInfos", void 0);
    P.__decorate([m.property(), x.messageBundle("esri/widgets/Legend/t9n/Legend")], A.prototype, "messages", void 0);
    P.__decorate([m.property()], A.prototype, "style", void 0);
    P.__decorate([J.cast("style")], A.prototype,
        "castStyle", null);
    P.__decorate([z.aliasOf("viewModel.view")], A.prototype, "view", void 0);
    P.__decorate([m.property()], A.prototype, "viewModel", void 0);
    return A = P.__decorate([N.subclass("esri.widgets.Legend")], A)
});