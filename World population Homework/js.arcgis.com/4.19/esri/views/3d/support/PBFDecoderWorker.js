// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
require({
    cache: {
        "esri/rest/query/operations/pbfQueryUtils": function() {
            define(["exports", "./pbfFeatureServiceParser"], function(c, C) {
                c.parsePBFFeatureQuery = function(y, F) {
                    var I = C.parseFeatureQuery(y, F);
                    y = I.queryResult.featureResult;
                    F = I.queryResult.queryGeometry;
                    I = I.queryResult.queryGeometryType;
                    if (y && y.features && y.features.length && y.objectIdFieldName) {
                        const N = y.objectIdFieldName;
                        for (const E of y.features) E.attributes && (E.objectId = E.attributes[N])
                    }
                    y && (y.queryGeometry = F, y.queryGeometryType = I);
                    return y
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/rest/query/operations/pbfFeatureServiceParser": function() {
            define("exports ../../../core/maybe ../../../core/Logger ../../../core/Error ../../../layers/graphics/OptimizedGeometry ./pbfOptimizedFeatureSet ../../../core/pbf".split(" "), function(c, C, y, F, I, N, E) {
                function B(d) {
                    return d >= V.length ? null : V[d]
                }

                function M(d, l, z) {
                    for (z = l.createPointGeometry(z); d.next();) switch (d.tag()) {
                        case 3:
                            {
                                var K = d.getUInt32();K = d.pos() + K;
                                let v = 0;
                                for (; d.pos() < K;) l.addCoordinatePoint(z,
                                    d.getSInt64(), v++);
                                break
                            }
                        default:
                            d.skip()
                    }
                    return z
                }

                function q(d, l, z) {
                    const K = l.createGeometry(z);
                    for (z = 2 + (z.hasZ ? 1 : 0) + (z.hasM ? 1 : 0); d.next();) switch (d.tag()) {
                        case 2:
                            var v = d.getUInt32();
                            v = d.pos() + v;
                            for (var O = 0; d.pos() < v;) l.addLength(K, d.getUInt32(), O++);
                            break;
                        case 3:
                            v = d.getUInt32();
                            v = d.pos() + v;
                            O = 0;
                            for (l.allocateCoordinates(K); d.pos() < v;) l.addCoordinate(K, d.getSInt64(), O), O++, O === z && (O = 0);
                            break;
                        default:
                            d.skip()
                    }
                    return K
                }

                function u(d) {
                    const l = new I;
                    let z = "esriGeometryPoint";
                    for (; d.next();) switch (d.tag()) {
                        case 2:
                            var K =
                                d.getUInt32();
                            for (K = d.pos() + K; d.pos() < K;) l.lengths.push(d.getUInt32());
                            break;
                        case 3:
                            K = d.getUInt32();
                            for (K = d.pos() + K; d.pos() < K;) l.coords.push(d.getSInt64());
                            break;
                        case 1:
                            z = N.OPTIMIZED_GEOMETRY_TYPES[d.getEnum()];
                            break;
                        default:
                            d.skip()
                    }
                    return {
                        queryGeometry: l,
                        queryGeometryType: z
                    }
                }

                function L(d) {
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            return d.getString();
                        case 2:
                            return d.getFloat();
                        case 3:
                            return d.getDouble();
                        case 4:
                            return d.getSInt32();
                        case 5:
                            return d.getUInt32();
                        case 6:
                            return d.getInt64();
                        case 7:
                            return d.getUInt64();
                        case 8:
                            return d.getSInt64();
                        case 9:
                            return d.getBool();
                        default:
                            return d.skip(), null
                    }
                    return null
                }

                function P(d) {
                    const l = {
                        type: B(0)
                    };
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            l.name = d.getString();
                            break;
                        case 2:
                            l.type = B(d.getEnum());
                            break;
                        case 3:
                            l.alias = d.getString();
                            break;
                        case 4:
                            var z = d.getEnum();
                            z = z >= W.length ? null : W[z];
                            l.sqlType = z;
                            break;
                        case 5:
                            try {
                                l.domain = JSON.parse(d.getString())
                            } catch (K) {
                                S.error(new F("query:parsing-pbf", "Failed to parse domain", {
                                    error: K
                                })), l.domain = null
                            }
                            break;
                        case 6:
                            l.defaultValue = d.getString();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function g(d) {
                    const l = {};
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            l.name = d.getString();
                            break;
                        case 2:
                            l.isSystemMaintained = d.getBool();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function p(d, l, z, K) {
                    const v = l.createFeature(z);
                    let O = 0;
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            {
                                const T = K[O++].name;v.attributes[T] = d.processMessage(L);
                                break
                            }
                        case 2:
                            v.geometry = d.processMessageWithArgs(q, l, z);
                            break;
                        case 4:
                            v.centroid = d.processMessageWithArgs(M, l, z);
                            break;
                        default:
                            d.skip()
                    }
                    return v
                }

                function a(d) {
                    const l = [1, 1, 1, 1];
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            l[0] = d.getDouble();
                            break;
                        case 2:
                            l[1] = d.getDouble();
                            break;
                        case 4:
                            l[2] = d.getDouble();
                            break;
                        case 3:
                            l[3] = d.getDouble();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function h(d) {
                    const l = [0, 0, 0, 0];
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            l[0] = d.getDouble();
                            break;
                        case 2:
                            l[1] = d.getDouble();
                            break;
                        case 4:
                            l[2] = d.getDouble();
                            break;
                        case 3:
                            l[3] = d.getDouble();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function t(d) {
                    const l = {
                        originPosition: 0 >= k.length ? null : k[0]
                    };
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            var z =
                                d.getEnum();
                            l.originPosition = z >= k.length ? null : k[z];
                            break;
                        case 2:
                            l.scale = d.processMessage(a);
                            break;
                        case 3:
                            l.translate = d.processMessage(h);
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function w(d) {
                    const l = {};
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            l.shapeAreaFieldName = d.getString();
                            break;
                        case 2:
                            l.shapeLengthFieldName = d.getString();
                            break;
                        case 3:
                            l.units = d.getString();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function e(d, l) {
                    for (l = l.createSpatialReference(); d.next();) switch (d.tag()) {
                        case 1:
                            l.wkid = d.getUInt32();
                            break;
                        case 5:
                            l.wkt =
                                d.getString();
                            break;
                        case 2:
                            l.latestWkid = d.getUInt32();
                            break;
                        case 3:
                            l.vcsWkid = d.getUInt32();
                            break;
                        case 4:
                            l.latestVcsWkid = d.getUInt32();
                            break;
                        default:
                            d.skip()
                    }
                    return l
                }

                function r(d, l) {
                    const z = l.createFeatureResult();
                    z.geometryType = 0 >= l.geometryTypes.length ? null : l.geometryTypes[0];
                    let K = !1;
                    for (; d.next();) switch (d.tag()) {
                        case 1:
                            z.objectIdFieldName = d.getString();
                            break;
                        case 3:
                            z.globalIdFieldName = d.getString();
                            break;
                        case 4:
                            z.geohashFieldName = d.getString();
                            break;
                        case 5:
                            z.geometryProperties = d.processMessage(w);
                            break;
                        case 7:
                            var v = d.getEnum();
                            z.geometryType = v >= l.geometryTypes.length ? null : l.geometryTypes[v];
                            break;
                        case 8:
                            z.spatialReference = d.processMessageWithArgs(e, l);
                            break;
                        case 10:
                            z.hasZ = d.getBool();
                            break;
                        case 11:
                            z.hasM = d.getBool();
                            break;
                        case 12:
                            z.transform = d.processMessage(t);
                            break;
                        case 9:
                            v = d.getBool();
                            z.exceededTransferLimit = v;
                            break;
                        case 13:
                            l.addField(z, d.processMessage(P));
                            break;
                        case 15:
                            K || (l.prepareFeatures(z), K = !0);
                            l.addFeature(z, d.processMessageWithArgs(p, l, z, z.fields));
                            break;
                        case 2:
                            z.uniqueIdField =
                                d.processMessage(g);
                            break;
                        default:
                            d.skip()
                    }
                    l.finishFeatureResult(z);
                    return z
                }

                function D(d, l) {
                    const z = {};
                    let K = null;
                    for (; d.next();) switch (d.tag()) {
                        case 4:
                            K = d.processMessageWithArgs(u);
                            break;
                        case 1:
                            z.featureResult = d.processMessageWithArgs(r, l);
                            break;
                        default:
                            d.skip()
                    }
                    C.isSome(K) && z.featureResult && l.addQueryGeometry(z, K);
                    return z
                }
                const S = y.getLogger("esri.tasks.operations.pbfFeatureServiceParser"),
                    V = "esriFieldTypeSmallInteger esriFieldTypeInteger esriFieldTypeSingle esriFieldTypeDouble esriFieldTypeString esriFieldTypeDate esriFieldTypeOID esriFieldTypeGeometry esriFieldTypeBlob esriFieldTypeRaster esriFieldTypeGUID esriFieldTypeGlobalID esriFieldTypeXML".split(" "),
                    W = "sqlTypeBigInt sqlTypeBinary sqlTypeBit sqlTypeChar sqlTypeDate sqlTypeDecimal sqlTypeDouble sqlTypeFloat sqlTypeGeometry sqlTypeGUID sqlTypeInteger sqlTypeLongNVarchar sqlTypeLongVarbinary sqlTypeLongVarchar sqlTypeNChar sqlTypeNVarchar sqlTypeOther sqlTypeReal sqlTypeSmallInt sqlTypeSqlXml sqlTypeTime sqlTypeTimestamp sqlTypeTimestamp2 sqlTypeTinyInt sqlTypeVarbinary sqlTypeVarchar".split(" "),
                    k = ["upperLeft", "lowerLeft"];
                c.parseFeatureQuery = function(d, l) {
                    try {
                        const z = new E(new Uint8Array(d), new DataView(d));
                        for (d = {}; z.next();) switch (z.tag()) {
                            case 2:
                                d.queryResult = z.processMessageWithArgs(D, l);
                                break;
                            default:
                                z.skip()
                        }
                        return d
                    } catch (z) {
                        throw new F("query:parsing-pbf", "Error while parsing FeatureSet PBF payload", {
                            error: z
                        });
                    }
                };
                c.parseFieldType = B;
                c.parseTransform = t;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/graphics/OptimizedGeometry": function() {
            define(["../../chunks/_rollupPluginBabelHelpers"], function(c) {
                return function() {
                    function C(F = [], I = [], N = !1) {
                        this.lengths = null != F ? F : [];
                        this.coords =
                            null != I ? I : [];
                        this.hasIndeterminateRingOrder = N
                    }
                    var y = C.prototype;
                    y.forEachVertex = function(F) {
                        let I = 0;
                        this.lengths.length || F(this.coords[0], this.coords[1]);
                        for (let N = 0; N < this.lengths.length; N++) {
                            const E = this.lengths[N];
                            for (let B = 0; B < E; B++) F(this.coords[2 * (B + I)], this.coords[2 * (B + I) + 1]);
                            I += E
                        }
                    };
                    y.clone = function() {
                        return new C(this.lengths.slice(), this.coords.slice(), this.hasIndeterminateRingOrder)
                    };
                    c._createClass(C, [{
                        key: "isPoint",
                        get: function() {
                            return 0 === this.lengths.length
                        }
                    }]);
                    return C
                }()
            })
        },
        "esri/rest/query/operations/pbfOptimizedFeatureSet": function() {
            define("exports ../../../geometry/support/spatialReferenceUtils ../../../core/unitUtils ../../../layers/graphics/OptimizedFeature ../../../layers/graphics/OptimizedFeatureSet ../../../layers/graphics/OptimizedGeometry".split(" "),
                function(c, C, y, F, I, N) {
                    const E = ["esriGeometryPoint", "esriGeometryMultipoint", "esriGeometryPolyline", "esriGeometryPolygon"];
                    let B = function() {
                        function M(u) {
                            this.options = u;
                            this.geometryTypes = E;
                            this._vertexDimension = this._coordinatePtr = 0
                        }
                        var q = M.prototype;
                        q.createFeatureResult = function() {
                            return new I
                        };
                        q.prepareFeatures = function(u) {
                            this._vertexDimension = 2;
                            u.hasZ && this._vertexDimension++;
                            u.hasM && this._vertexDimension++
                        };
                        q.finishFeatureResult = function(u) {
                            if (u && u.features && u.hasZ && this.options.sourceSpatialReference &&
                                u.spatialReference && !C.equals(u.spatialReference, this.options.sourceSpatialReference) && !u.spatialReference.vcsWkid) {
                                var L = y.getMetersPerVerticalUnitForSR(this.options.sourceSpatialReference),
                                    P = y.getMetersPerVerticalUnitForSR(u.spatialReference);
                                L /= P;
                                if (1 !== L)
                                    for (const g of u.features)
                                        if (g.geometry && g.geometry.coords)
                                            for (u = g.geometry.coords, P = 2; P < u.length; P += 3) u[P] *= L
                            }
                        };
                        q.addFeature = function(u, L) {
                            u.features.push(L)
                        };
                        q.createFeature = function() {
                            return new F
                        };
                        q.createSpatialReference = function() {
                            return {
                                wkid: 0
                            }
                        };
                        q.createGeometry = function() {
                            return new N
                        };
                        q.addField = function(u, L) {
                            u.fields.push(L)
                        };
                        q.allocateCoordinates = function(u) {
                            u.coords.length = u.lengths.reduce((L, P) => L + P, 0) * this._vertexDimension;
                            this._coordinatePtr = 0
                        };
                        q.addCoordinate = function(u, L) {
                            u.coords[this._coordinatePtr++] = L
                        };
                        q.addCoordinatePoint = function(u, L) {
                            u.coords.push(L)
                        };
                        q.addLength = function(u, L) {
                            u.lengths.push(L)
                        };
                        q.addQueryGeometry = function(u, L) {
                            u.queryGeometry = L.queryGeometry;
                            u.queryGeometryType = L.queryGeometryType
                        };
                        q.createPointGeometry =
                            function() {
                                return new N
                            };
                        return M
                    }();
                    c.OPTIMIZED_GEOMETRY_TYPES = E;
                    c.OptimizedFeatureSetParserContext = B;
                    Object.defineProperty(c, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/core/unitUtils": function() {
            define("exports ./has ./jsonMap ../geometry/support/WKIDUnitConversion ../geometry/support/spatialReferenceUtils ../geometry/SpatialReference ../geometry/support/Ellipsoid ../geometry/projectionEllipsoid".split(" "), function(c, C, y, F, I, N, E, B) {
                function M(v) {
                    if (v = l[v]) return v;
                    throw Error("unknown measure");
                }

                function q(v) {
                    return d[v].baseUnit
                }

                function u(v, O = null) {
                    O = O || M(v);
                    return d[O].baseUnit === v
                }

                function L(v, O, T) {
                    if (O === T) return v;
                    const X = M(O);
                    if (X !== M(T)) throw Error("incompatible units");
                    v = u(O, X) ? v : v * d[X].units[O].inBaseUnits;
                    return u(T, X) ? v : v / d[X].units[T].inBaseUnits
                }

                function P(v, O) {
                    return 3E3 > L(v, O, "meters") ? "meters" : "kilometers"
                }

                function g(v, O) {
                    return 1E5 > L(v, O, "meters") ? "meters" : "kilometers"
                }

                function p(v, O) {
                    return 1E3 > L(v, O, "feet") ? "feet" : "miles"
                }

                function a(v, O) {
                    return 1E5 > L(v, O, "feet") ? "feet" : "miles"
                }

                function h(v) {
                    return k.fromJSON(v.toLowerCase()) ||
                        null
                }

                function t(v, O = E.earth.metersPerDegree) {
                    return w(v, !0) || O
                }

                function w(v, O = !1) {
                    let T, X, aa = null;
                    null != v && ("object" === typeof v ? (T = v.wkid, X = v.wkt) : "number" === typeof v ? T = v : "string" === typeof v && (X = v));
                    if (T) {
                        if (I.isWKIDFromMars(T)) return E.mars.metersPerDegree;
                        if (I.isWKIDFromMoon(T)) return E.moon.metersPerDegree;
                        aa = S.values[S[T]];
                        !aa && O && W.has(T) && (aa = r)
                    } else X && (-1 !== X.search(/^PROJCS/i) ? (v = D.exec(X)) && v[1] && (aa = parseFloat(v[1].split(",")[1])) : -1 !== X.search(/^GEOCCS/i) && (v = V.exec(X)) && v[1] && (aa = parseFloat(v[1].split(",")[1])));
                    return aa
                }

                function e(v) {
                    let O, T, X = null;
                    null != v && ("object" === typeof v ? (O = v.wkid, T = v.wkt) : "number" === typeof v ? O = v : "string" === typeof v && (T = v));
                    O ? X = S.units[S[O]] : T && -1 !== T.search(/^PROJCS/i) && (v = D.exec(T)) && v[1] && (X = (v = /[\\"\\']{1}([^\\"\\']+)/.exec(v[1])) && v[1]);
                    return X ? h(X) : null
                }
                const r = E.earth.radius * Math.PI / 200,
                    D = /UNIT\[([^\]]+)\]\]$/i,
                    S = F,
                    V = /UNIT\[([^\]]+)\]/i,
                    W = new Set([4261, 4305, 4807, 4810, 4811, 4812, 4816, 4819, 4821, 4901, 4902, 37225, 104139, 104140]),
                    k = y.strict()({
                        meter: "meters",
                        foot: "feet",
                        foot_us: "us-feet",
                        foot_clarke: "clarke-feet",
                        yard_clarke: "clarke-yards",
                        link_clarke: "clarke-links",
                        yard_sears: "sears-yards",
                        foot_sears: "sears-feet",
                        chain_sears: "sears-chains",
                        chain_benoit_1895_b: "benoit-1895-b-chains",
                        yard_indian: "indian-yards",
                        yard_indian_1937: "indian-1937-yards",
                        foot_gold_coast: "gold-coast-feet",
                        chain_sears_1922_truncated: "sears-1922-truncated-chains",
                        "50_kilometers": "50-kilometers",
                        "150_kilometers": "150-kilometers"
                    });
                C = {
                    millimeters: {
                        inBaseUnits: .001
                    },
                    centimeters: {
                        inBaseUnits: .01
                    },
                    decimeters: {
                        inBaseUnits: .1
                    },
                    meters: {
                        inBaseUnits: 1
                    },
                    kilometers: {
                        inBaseUnits: 1E3
                    },
                    inches: {
                        inBaseUnits: .0254
                    },
                    feet: {
                        inBaseUnits: .3048
                    },
                    yards: {
                        inBaseUnits: .9144
                    },
                    miles: {
                        inBaseUnits: 1609.344
                    },
                    "nautical-miles": {
                        inBaseUnits: 1852
                    },
                    "us-feet": {
                        inBaseUnits: 1200 / 3937
                    }
                };
                F = {
                    "square-millimeters": {
                        inBaseUnits: 1E-6
                    },
                    "square-centimeters": {
                        inBaseUnits: 1E-4
                    },
                    "square-decimeters": {
                        inBaseUnits: .1 * .1
                    },
                    "square-meters": {
                        inBaseUnits: 1
                    },
                    "square-kilometers": {
                        inBaseUnits: 1E6
                    },
                    "square-inches": {
                        inBaseUnits: 6.4516E-4
                    },
                    "square-feet": {
                        inBaseUnits: .09290304
                    },
                    "square-yards": {
                        inBaseUnits: .83612736
                    },
                    "square-miles": {
                        inBaseUnits: 2589988.110336
                    },
                    "square-us-feet": {
                        inBaseUnits: (v => v * v)(1200 / 3937)
                    },
                    acres: {
                        inBaseUnits: 4046.8564224
                    },
                    ares: {
                        inBaseUnits: 100
                    },
                    hectares: {
                        inBaseUnits: 1E4
                    }
                };
                const d = {
                        length: {
                            baseUnit: "meters",
                            units: C
                        },
                        area: {
                            baseUnit: "square-meters",
                            units: F
                        },
                        volume: {
                            baseUnit: "liters",
                            units: {
                                liters: {
                                    inBaseUnits: 1
                                },
                                "cubic-millimeters": {
                                    inBaseUnits: 1E3 * 1E-9
                                },
                                "cubic-centimeters": {
                                    inBaseUnits: .001
                                },
                                "cubic-decimeters": {
                                    inBaseUnits: 1
                                },
                                "cubic-meters": {
                                    inBaseUnits: 1E3
                                },
                                "cubic-kilometers": {
                                    inBaseUnits: 1E12
                                },
                                "cubic-inches": {
                                    inBaseUnits: .016387064
                                },
                                "cubic-feet": {
                                    inBaseUnits: .09290304 * 304.8
                                },
                                "cubic-yards": {
                                    inBaseUnits: 764.554857984
                                },
                                "cubic-miles": {
                                    inBaseUnits: 4.16818182544058E12
                                }
                            }
                        },
                        angle: {
                            baseUnit: "radians",
                            units: {
                                radians: {
                                    inBaseUnits: 1
                                },
                                degrees: {
                                    inBaseUnits: Math.PI / 180
                                }
                            }
                        }
                    },
                    l = function() {
                        const v = {};
                        for (const O in d)
                            for (const T in d[O].units) v[T] = O;
                        return v
                    }(),
                    z = {
                        esriAcres: "acres",
                        esriAres: "ares",
                        esriHectares: "hectares",
                        esriSquareCentimeters: "square-centimeters",
                        esriSquareDecimeters: "square-decimeters",
                        esriSquareFeet: "square-feet",
                        esriSquareInches: "square-inches",
                        esriSquareKilometers: "square-kilometers",
                        esriSquareMeters: "square-meters",
                        esriSquareMiles: "square-miles",
                        esriSquareMillimeters: "square-millimeters",
                        esriSquareUsFeet: "square-us-feet",
                        esriSquareYards: "square-yards"
                    },
                    K = {
                        esriCentimeters: "centimeters",
                        esriDecimeters: "decimeters",
                        esriFeet: "feet",
                        esriInches: "inches",
                        esriKilometers: "kilometers",
                        esriMeters: "meters",
                        esriMiles: "miles",
                        esriMillimeters: "millimeters",
                        esriNauticalMiles: "nautical-miles",
                        esriYards: "yards"
                    };
                C = y.strict()(z);
                F = y.strict()(K);
                y = y.strict()({ ...z,
                    ...K
                });
                c.areaUnitsJSONMap = C;
                c.baseUnitForMeasure = q;
                c.baseUnitForUnit = function(v) {
                    return q(M(v))
                };
                c.convertUnit = L;
                c.getDefaultUnitSystem = function(v) {
                    if (!v) return null;
                    switch (e(v)) {
                        case "feet":
                        case "us-feet":
                        case "clarke-feet":
                        case "clarke-yards":
                        case "clarke-links":
                        case "sears-yards":
                        case "sears-feet":
                        case "sears-chains":
                        case "benoit-1895-b-chains":
                        case "indian-yards":
                        case "indian-1937-yards":
                        case "gold-coast-feet":
                        case "sears-1922-truncated-chains":
                            return "imperial";
                        case "50-kilometers":
                        case "150-kilometers":
                        case "meters":
                            return "metric"
                    }
                    return null
                };
                c.getMetersPerUnit = w;
                c.getMetersPerUnitForSR = t;
                c.getMetersPerVerticalUnitForSR = function(v) {
                    if (v && "object" === typeof v && !I.isEarth(v)) return 1;
                    v = t(v);
                    return 1E5 < v ? 1 : v
                };
                c.getUnitString = e;
                c.getVerticalUnitStringForSR = function(v) {
                    const O = t(v),
                        T = v instanceof N ? B.getReferenceEllipsoid(v).metersPerDegree : 1E5;
                    return O >= T ? "meters" : e(v)
                };
                c.inchesPerMeter = 39.37;
                c.isBaseUnit = u;
                c.isMeasurementSystem = function(v) {
                    return "imperial" ===
                        v || "metric" === v
                };
                c.lengthToDegrees = function(v, O, T) {
                    return L(v, O, "meters") / (T * Math.PI / 180)
                };
                c.lengthUnitsJSONMap = F;
                c.measureForUnit = M;
                c.measurementAreaUnits = "metric imperial square-inches square-feet square-yards square-miles square-us-feet square-meters square-kilometers acres ares hectares".split(" ");
                c.measurementLengthUnits = "metric imperial inches feet yards miles nautical-miles us-feet meters kilometers".split(" ");
                c.preferredImperialAreaUnit = function(v, O) {
                    return 1E6 > L(v, O, "square-feet") ? "square-feet" :
                        "square-miles"
                };
                c.preferredImperialLengthUnit = p;
                c.preferredImperialVerticalLengthUnit = a;
                c.preferredLengthUnit = function(v, O, T) {
                    switch (T) {
                        case "metric":
                            return P(v, O);
                        case "imperial":
                            return p(v, O);
                        default:
                            return T
                    }
                };
                c.preferredMetricAreaUnit = function(v, O) {
                    return 3E6 > L(v, O, "square-meters") ? "square-meters" : "square-kilometers"
                };
                c.preferredMetricLengthUnit = P;
                c.preferredMetricVerticalLengthUnit = g;
                c.preferredVerticalLengthUnit = function(v, O, T) {
                    switch (T) {
                        case "metric":
                            return g(v, O);
                        case "imperial":
                            return a(v,
                                O);
                        default:
                            return T
                    }
                };
                c.unitFromRESTJSON = h;
                c.unitToRESTJSON = function(v) {
                    return k.toJSON(v) || null
                };
                c.unitsJSONMap = y;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/geometry/projectionEllipsoid": function() {
            define(["exports", "./support/spatialReferenceUtils", "./SpatialReference", "./support/Ellipsoid"], function(c, C, y, F) {
                function I(q) {
                    return new y({
                        wkt: `GEOCCS["Spherical geocentric",
    DATUM["Not specified",
      SPHEROID["Sphere",${q.radius},0]],
    PRIMEM["Greenwich",0.0,
      AUTHORITY["EPSG","8901"]],
    UNIT["m",1.0],
    AXIS["Geocentric X",OTHER],
    AXIS["Geocentric Y",EAST],
    AXIS["Geocentric Z",NORTH]
  ]`
                    })
                }
                const N = I(F.earth),
                    E = I(F.mars),
                    B = I(F.moon),
                    M = new y({
                        wkt: `GEOCCS["WGS 84",
  DATUM["WGS_1984",
    SPHEROID["WGS 84",${F.earth.radius},298.257223563,
      AUTHORITY["EPSG","7030"]],
    AUTHORITY["EPSG","6326"]],
  PRIMEM["Greenwich",0,
    AUTHORITY["EPSG","8901"]],
  UNIT["m",1.0,
    AUTHORITY["EPSG","9001"]],
  AXIS["Geocentric X",OTHER],
  AXIS["Geocentric Y",OTHER],
  AXIS["Geocentric Z",NORTH],
  AUTHORITY["EPSG","4978"]
]`
                    });
                c.SphericalECEFSpatialReference = N;
                c.SphericalPCPFMars = E;
                c.SphericalPCPFMoon = B;
                c.WGS84ECEFSpatialReference = M;
                c.createSphericalPCPF = I;
                c.getReferenceEllipsoid = function(q) {
                    return q && (C.isMars(q) || q === E) ? F.mars : q && (C.isMoon(q) || q === B) ? F.moon : F.earth
                };
                c.getReferenceEllipsoidFromWKID = function(q) {
                    return C.isWKIDFromMars(q) ? F.mars : C.isWKIDFromMoon(q) ? F.moon : F.earth
                };
                c.getSphericalPCPF = function(q) {
                    return q && (C.isMars(q) || q === E) ? E : q && (C.isMoon(q) || q === B) ? B : N
                };
                c.getSphericalPCPFForEllipsoid = function(q) {
                    return q &&
                        q === F.mars ? E : q && q === F.moon ? B : N
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/graphics/OptimizedFeature": function() {
            define(["../../chunks/_rollupPluginBabelHelpers"], function(c) {
                return function() {
                    function C(y = null, F = {}, I, N) {
                        this.geohashY = this.geohashX = this.displayId = 0;
                        this.geometry = y;
                        F && (this.attributes = F);
                        I && (this.centroid = I);
                        null != N && (this.objectId = N)
                    }
                    C.prototype.weakClone = function() {
                        const y = new C(this.geometry, this.attributes, this.centroid, this.objectId);
                        y.displayId = this.displayId;
                        y.geohashX = this.geohashX;
                        y.geohashY = this.geohashY;
                        return y
                    };
                    c._createClass(C, [{
                        key: "hasGeometry",
                        get: function() {
                            return !(!this.geometry || !this.geometry.coords || !this.geometry.coords.length)
                        }
                    }]);
                    return C
                }()
            })
        },
        "esri/layers/graphics/OptimizedFeatureSet": function() {
            define(function() {
                return function() {
                    function c() {
                        this.spatialReference = this.geometryType = this.geometryProperties = this.geohashFieldName = this.globalIdFieldName = this.objectIdFieldName = null;
                        this.hasM = this.hasZ = !1;
                        this.features = [];
                        this.fields = [];
                        this.transform = null;
                        this.exceededTransferLimit = !1;
                        this.queryGeometry = this.queryGeometryType = this.uniqueIdField = null
                    }
                    c.prototype.weakClone = function() {
                        const C = new c;
                        C.objectIdFieldName = this.objectIdFieldName;
                        C.globalIdFieldName = this.globalIdFieldName;
                        C.geohashFieldName = this.geohashFieldName;
                        C.geometryProperties = this.geometryProperties;
                        C.geometryType = this.geometryType;
                        C.spatialReference = this.spatialReference;
                        C.hasZ = this.hasZ;
                        C.hasM = this.hasM;
                        C.features = this.features;
                        C.fields = this.fields;
                        C.transform =
                            this.transform;
                        C.exceededTransferLimit = this.exceededTransferLimit;
                        C.uniqueIdField = this.uniqueIdField;
                        C.queryGeometry = this.queryGeometry;
                        C.queryGeometryType = this.queryGeometryType;
                        return C
                    };
                    return c
                }()
            })
        },
        "esri/rest/query/operations/pbfDehydratedFeatureSet": function() {
            define("exports ../../../core/compilerUtils ../../../geometry/SpatialReference ../../../core/uid ../../../layers/support/Field ../../../layers/graphics/featureConversionUtils ./zscale ../../../layers/graphics/dehydratedFeatures".split(" "),
                function(c, C, y, F, I, N, E, B) {
                    function M(h, t) {
                        return t
                    }

                    function q(h, t, w, e) {
                        switch (w) {
                            case 0:
                                return g(h, t + e, 0);
                            case 1:
                                return "lowerLeft" === h.originPosition ? g(h, t + e, 1) : p(h, t + e, 1)
                        }
                    }

                    function u(h, t, w, e) {
                        switch (w) {
                            case 2:
                                return g(h, t, 2);
                            default:
                                return q(h, t, w, e)
                        }
                    }

                    function L(h, t, w, e) {
                        switch (w) {
                            case 2:
                                return g(h, t, 3);
                            default:
                                return q(h, t, w, e)
                        }
                    }

                    function P(h, t, w, e) {
                        switch (w) {
                            case 3:
                                return g(h, t, 3);
                            default:
                                return u(h, t, w, e)
                        }
                    }

                    function g({
                        translate: h,
                        scale: t
                    }, w, e) {
                        return h[e] + w * t[e]
                    }

                    function p({
                            translate: h,
                            scale: t
                        },
                        w, e) {
                        return h[e] - w * t[e]
                    }
                    let a = function() {
                        function h(w) {
                            this.options = w;
                            this.geometryTypes = ["point", "multipoint", "polyline", "polygon"];
                            this.previousCoordinate = [0, 0];
                            this.transform = null;
                            this.applyTransform = M;
                            this.lengths = [];
                            this.vertexDimension = this.toAddInCurrentPath = this.currentLengthIndex = 0;
                            this.coordinateBuffer = null;
                            this.coordinateBufferPtr = 0;
                            this.AttributesConstructor = function() {}
                        }
                        var t = h.prototype;
                        t.createFeatureResult = function() {
                            return new B.DehydratedFeatureSetClass
                        };
                        t.finishFeatureResult = function(w) {
                            this.options.applyTransform &&
                                (w.transform = null);
                            this.AttributesConstructor = function() {};
                            this.coordinateBuffer = null;
                            this.lengths.length = 0;
                            if (w.hasZ) {
                                var e = E.getGeometryZScaler(w.geometryType, this.options.sourceSpatialReference, w.spatialReference);
                                if (e)
                                    for (const r of w.features) e(r.geometry)
                            }
                        };
                        t.createSpatialReference = function() {
                            return new y
                        };
                        t.addField = function(w, e) {
                            w.fields.push(I.fromJSON(e));
                            const r = w.fields.map(D => D.name);
                            this.AttributesConstructor = function() {
                                for (const D of r) this[D] = null
                            }
                        };
                        t.addFeature = function(w, e) {
                            const r =
                                this.options.maxStringAttributeLength ? this.options.maxStringAttributeLength : 0;
                            if (0 < r)
                                for (const D in e.attributes) {
                                    const S = e.attributes[D];
                                    "string" === typeof S && S.length > r && (e.attributes[D] = "")
                                }
                            w.features.push(e)
                        };
                        t.addQueryGeometry = function(w, e) {
                            const {
                                queryGeometry: r,
                                queryGeometryType: D
                            } = e;
                            e = N.unquantizeOptimizedGeometry(r.clone(), r, !1, !1, this.transform);
                            e = N.convertToGeometry(e, D, !1, !1);
                            let S = null;
                            switch (D) {
                                case "esriGeometryPoint":
                                    S = "point";
                                    break;
                                case "esriGeometryPolygon":
                                    S = "polygon";
                                    break;
                                case "esriGeometryPolyline":
                                    S =
                                        "polyline";
                                    break;
                                case "esriGeometryMultipoint":
                                    S = "multipoint"
                            }
                            e.type = S;
                            w.queryGeometryType = D;
                            w.queryGeometry = e
                        };
                        t.prepareFeatures = function(w) {
                            this.transform = w.transform;
                            this.options.applyTransform && w.transform && (this.applyTransform = this.deriveApplyTransform(w));
                            this.vertexDimension = 2;
                            w.hasZ && this.vertexDimension++;
                            w.hasM && this.vertexDimension++;
                            switch (w.geometryType) {
                                case "point":
                                    this.addCoordinate = (e, r, D) => this.addCoordinatePoint(e, r, D);
                                    this.createGeometry = e => this.createPointGeometry(e);
                                    break;
                                case "polygon":
                                    this.addCoordinate =
                                        (e, r, D) => this.addCoordinatePolygon(e, r, D);
                                    this.createGeometry = e => this.createPolygonGeometry(e);
                                    break;
                                case "polyline":
                                    this.addCoordinate = (e, r, D) => this.addCoordinatePolyline(e, r, D);
                                    this.createGeometry = e => this.createPolylineGeometry(e);
                                    break;
                                case "multipoint":
                                    this.addCoordinate = (e, r, D) => this.addCoordinateMultipoint(e, r, D);
                                    this.createGeometry = e => this.createMultipointGeometry(e);
                                    break;
                                default:
                                    C.neverReached(w.geometryType)
                            }
                        };
                        t.createFeature = function() {
                            this.currentLengthIndex = this.lengths.length = 0;
                            this.previousCoordinate[0] =
                                0;
                            this.previousCoordinate[1] = 0;
                            return new B.DehydratedFeatureClass(F.generateUID(), null, new this.AttributesConstructor)
                        };
                        t.allocateCoordinates = function() {
                            const w = this.lengths.reduce((e, r) => e + r, 0);
                            this.coordinateBuffer = new Float64Array(w * this.vertexDimension);
                            this.coordinateBufferPtr = 0
                        };
                        t.addLength = function(w, e, r) {
                            0 === this.lengths.length && (this.toAddInCurrentPath = e);
                            this.lengths.push(e)
                        };
                        t.createPointGeometry = function(w) {
                            w = {
                                type: "point",
                                x: 0,
                                y: 0,
                                spatialReference: w.spatialReference,
                                hasZ: !!w.hasZ,
                                hasM: !!w.hasM
                            };
                            w.hasZ && (w.z = 0);
                            w.hasM && (w.m = 0);
                            return w
                        };
                        t.addCoordinatePoint = function(w, e, r) {
                            e = this.applyTransform(this.transform, e, r, 0);
                            switch (r) {
                                case 0:
                                    w.x = e;
                                    break;
                                case 1:
                                    w.y = e;
                                    break;
                                case 2:
                                    w.hasZ ? w.z = e : w.m = e;
                                    break;
                                case 3:
                                    w.m = e
                            }
                        };
                        t.transformPathLikeValue = function(w, e) {
                            let r = 0;
                            1 >= e && (r = this.previousCoordinate[e], this.previousCoordinate[e] += w);
                            return this.applyTransform(this.transform, w, e, r)
                        };
                        t.addCoordinatePolyline = function(w, e, r) {
                            this.dehydratedAddPointsCoordinate(w.paths, e, r)
                        };
                        t.addCoordinatePolygon = function(w,
                            e, r) {
                            this.dehydratedAddPointsCoordinate(w.rings, e, r)
                        };
                        t.addCoordinateMultipoint = function(w, e, r) {
                            0 === r && w.points.push([]);
                            e = this.transformPathLikeValue(e, r);
                            w.points[w.points.length - 1].push(e)
                        };
                        t.createPolygonGeometry = function(w) {
                            return {
                                type: "polygon",
                                rings: [
                                    []
                                ],
                                spatialReference: w.spatialReference,
                                hasZ: !!w.hasZ,
                                hasM: !!w.hasM
                            }
                        };
                        t.createPolylineGeometry = function(w) {
                            return {
                                type: "polyline",
                                paths: [
                                    []
                                ],
                                spatialReference: w.spatialReference,
                                hasZ: !!w.hasZ,
                                hasM: !!w.hasM
                            }
                        };
                        t.createMultipointGeometry = function(w) {
                            return {
                                type: "multipoint",
                                points: [],
                                spatialReference: w.spatialReference,
                                hasZ: !!w.hasZ,
                                hasM: !!w.hasM
                            }
                        };
                        t.dehydratedAddPointsCoordinate = function(w, e, r) {
                            0 === r && 0 === this.toAddInCurrentPath-- && (w.push([]), this.toAddInCurrentPath = this.lengths[++this.currentLengthIndex] - 1, this.previousCoordinate[0] = 0, this.previousCoordinate[1] = 0);
                            e = this.transformPathLikeValue(e, r);
                            w = w[w.length - 1];
                            0 === r && w.push(new Float64Array(this.coordinateBuffer.buffer, this.coordinateBufferPtr * Float64Array.BYTES_PER_ELEMENT, this.vertexDimension));
                            this.coordinateBuffer[this.coordinateBufferPtr++] =
                                e
                        };
                        t.deriveApplyTransform = function(w) {
                            const {
                                hasZ: e,
                                hasM: r
                            } = w;
                            return e && r ? P : e ? u : r ? L : q
                        };
                        return h
                    }();
                    c.DehydratedFeatureSetParserContext = a;
                    Object.defineProperty(c, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/core/compilerUtils": function() {
            define(["exports", "./has"], function(c, C) {
                c.neverReached = function(y) {};
                c.neverReachedSilent = function(y) {};
                c.tuple = (...y) => y;
                c.typeCast = function(y) {
                    return () => y
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/core/uid": function() {
            define(["exports"], function(c) {
                let C =
                    0;
                c.NullUID = 0;
                c.generateUID = function() {
                    return ++C
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/support/Field": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/enumeration ../../core/accessorSupport/decorators/reader ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport ./domains ./fieldType".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L, P, g, p, a) {
                    var h;
                    const t = new E.JSONMap({
                        binary: "binary",
                        coordinate: "coordinate",
                        countOrAmount: "count-or-amount",
                        dateAndTime: "date-and-time",
                        description: "description",
                        locationOrPlaceName: "location-or-place-name",
                        measurement: "measurement",
                        nameOrTitle: "name-or-title",
                        none: "none",
                        orderedOrRanked: "ordered-or-ranked",
                        percentageOrRatio: "percentage-or-ratio",
                        typeOrCategory: "type-or-category",
                        uniqueIdentifier: "unique-identifier"
                    });
                    y = h = function(w) {
                        function e(D) {
                            D = w.call(this,
                                D) || this;
                            D.alias = null;
                            D.defaultValue = void 0;
                            D.description = null;
                            D.domain = null;
                            D.editable = !0;
                            D.length = -1;
                            D.name = null;
                            D.nullable = !0;
                            D.type = null;
                            D.valueType = null;
                            return D
                        }
                        c._inheritsLoose(e, w);
                        var r = e.prototype;
                        r.readDescription = function(D, {
                            description: S
                        }) {
                            let V;
                            try {
                                V = JSON.parse(S)
                            } catch (W) {}
                            return V ? V.value : null
                        };
                        r.readValueType = function(D, {
                            description: S
                        }) {
                            let V;
                            try {
                                V = JSON.parse(S)
                            } catch (W) {}
                            return V ? t.fromJSON(V.fieldValueType) : null
                        };
                        r.clone = function() {
                            return new h({
                                alias: this.alias,
                                defaultValue: this.defaultValue,
                                description: this.description,
                                domain: this.domain && this.domain.clone() || null,
                                editable: this.editable,
                                length: this.length,
                                name: this.name,
                                nullable: this.nullable,
                                type: this.type,
                                valueType: this.valueType
                            })
                        };
                        return e
                    }(g.JSONSupport);
                    C.__decorate([N.property({
                        type: String,
                        json: {
                            write: !0
                        }
                    })], y.prototype, "alias", void 0);
                    C.__decorate([N.property({
                        type: [String, Number],
                        json: {
                            write: {
                                allowNull: !0
                            }
                        }
                    })], y.prototype, "defaultValue", void 0);
                    C.__decorate([N.property()], y.prototype, "description", void 0);
                    C.__decorate([M.reader("description")],
                        y.prototype, "readDescription", null);
                    C.__decorate([N.property({
                        types: p.types,
                        json: {
                            read: {
                                reader: p.fromJSON
                            },
                            write: !0
                        }
                    })], y.prototype, "domain", void 0);
                    C.__decorate([N.property({
                        type: Boolean,
                        json: {
                            write: !0
                        }
                    })], y.prototype, "editable", void 0);
                    C.__decorate([N.property({
                        type: I.Integer,
                        json: {
                            write: !0
                        }
                    })], y.prototype, "length", void 0);
                    C.__decorate([N.property({
                        type: String,
                        json: {
                            write: !0
                        }
                    })], y.prototype, "name", void 0);
                    C.__decorate([N.property({
                        type: Boolean,
                        json: {
                            write: !0
                        }
                    })], y.prototype, "nullable", void 0);
                    C.__decorate([B.enumeration(a.kebabDict)],
                        y.prototype, "type", void 0);
                    C.__decorate([N.property()], y.prototype, "valueType", void 0);
                    C.__decorate([M.reader("valueType", ["description"])], y.prototype, "readValueType", null);
                    return y = h = C.__decorate([q.subclass("esri.layers.support.Field")], y)
                })
        },
        "esri/core/accessorSupport/decorators/enumeration": function() {
            define(["exports", "./property", "../../jsonMap"], function(c, C, y) {
                c.enumeration = function(F, I = {
                    ignoreUnknown: !0
                }) {
                    F = F instanceof y.JSONMap ? F : new y.JSONMap(F, I);
                    F = {
                        type: null != I && I.ignoreUnknown ? F.apiValues : String,
                        readOnly: null == I ? void 0 : I.readOnly,
                        json: {
                            type: F.jsonValues,
                            read: null != I && I.readOnly ? !1 : {
                                reader: F.read
                            },
                            write: {
                                writer: F.write
                            }
                        }
                    };
                    void 0 !== (null == I ? void 0 : I.default) && (F.json.default = I.default);
                    return C.property(F)
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/support/domains": function() {
            define("exports ../../core/has ./Domain ./CodedValueDomain ./InheritedDomain ./RangeDomain".split(" "), function(c, C, y, F, I, N) {
                function E(B, M) {
                    switch (B.type) {
                        case "range":
                            {
                                const q = "range" in
                                    B ? B.range[1] : B.maxValue;
                                if (+M < ("range" in B ? B.range[0] : B.minValue) || +M > q) return c.DomainValidationError.VALUE_OUT_OF_RANGE;
                                break
                            }
                        case "coded-value":
                        case "codedValue":
                            if (null == B.codedValues || B.codedValues.every(q => null == q || q.code !== M)) return c.DomainValidationError.INVALID_CODED_VALUE
                    }
                    return null
                }(function(B) {
                    B.VALUE_OUT_OF_RANGE = "domain-validation-error::value-out-of-range";
                    B.INVALID_CODED_VALUE = "domain-validation-error::invalid-coded-value"
                })(c.DomainValidationError || (c.DomainValidationError = {}));
                C = {
                    key: "type",
                    base: y,
                    typeMap: {
                        range: N,
                        "coded-value": F,
                        inherited: I
                    }
                };
                c.DomainBase = y;
                c.CodedValueDomain = F;
                c.InheritedDomain = I;
                c.RangeDomain = N;
                c.fromJSON = function(B) {
                    if (!B || !B.type) return null;
                    switch (B.type) {
                        case "range":
                            return N.fromJSON(B);
                        case "codedValue":
                            return F.fromJSON(B);
                        case "inherited":
                            return I.fromJSON(B)
                    }
                    return null
                };
                c.getDomainRange = function(B) {
                    if (B && "range" === B.type) return {
                        min: "range" in B ? B.range[0] : B.minValue,
                        max: "range" in B ? B.range[1] : B.maxValue
                    }
                };
                c.isValidDomainValue = function(B, M) {
                    return null ===
                        E(B, M)
                };
                c.types = C;
                c.validateDomainValue = E;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/support/Domain": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/enumeration ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L, P) {
                    y = new E.JSONMap({
                        inherited: "inherited",
                        codedValue: "coded-value",
                        range: "range"
                    });
                    P = function(g) {
                        function p(a) {
                            a = g.call(this, a) || this;
                            a.name = null;
                            a.type = null;
                            return a
                        }
                        c._inheritsLoose(p, g);
                        return p
                    }(P.JSONSupport);
                    C.__decorate([N.property({
                        type: String,
                        json: {
                            write: !0
                        }
                    })], P.prototype, "name", void 0);
                    C.__decorate([B.enumeration(y)], P.prototype, "type", void 0);
                    return P = C.__decorate([M.subclass("esri.layers.support.Domain")], P)
                })
        },
        "esri/layers/support/CodedValueDomain": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/lang ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/accessorSupport/decorators/enumeration ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ./CodedValue ./Domain".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L, P, g) {
                    var p;
                    y = p = function(a) {
                        function h(w) {
                            w = a.call(this, w) || this;
                            w.codedValues = null;
                            w.type = "coded-value";
                            return w
                        }
                        c._inheritsLoose(h, a);
                        var t = h.prototype;
                        t.getName = function(w) {
                            let e = null;
                            if (this.codedValues) {
                                const r = String(w);
                                this.codedValues.some(D => {
                                    String(D.code) === r && (e = D.name);
                                    return !!e
                                })
                            }
                            return e
                        };
                        t.clone = function() {
                            return new p({
                                codedValues: F.clone(this.codedValues),
                                name: this.name
                            })
                        };
                        return h
                    }(g);
                    C.__decorate([E.property({
                            type: [P["default"]],
                            json: {
                                write: !0
                            }
                        })],
                        y.prototype, "codedValues", void 0);
                    C.__decorate([B.enumeration({
                        codedValue: "coded-value"
                    })], y.prototype, "type", void 0);
                    return y = p = C.__decorate([M.subclass("esri.layers.support.CodedValueDomain")], y)
                })
        },
        "esri/layers/support/CodedValue": function() {
            define("exports ../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L, P) {
                    var g;
                    c.CodedValue = g = function(p) {
                        function a(h) {
                            h = p.call(this, h) || this;
                            h.name = null;
                            h.code = null;
                            return h
                        }
                        C._inheritsLoose(a, p);
                        a.prototype.clone = function() {
                            return new g({
                                name: this.name,
                                code: this.code
                            })
                        };
                        return a
                    }(P.JSONSupport);
                    y.__decorate([E.property({
                        type: String,
                        json: {
                            write: !0
                        }
                    })], c.CodedValue.prototype, "name", void 0);
                    y.__decorate([E.property({
                        type: [String, Number],
                        json: {
                            write: !0
                        }
                    })], c.CodedValue.prototype, "code", void 0);
                    c.CodedValue = g = y.__decorate([M.subclass("esri.layers.support.CodedValue")],
                        c.CodedValue);
                    c.default = c.CodedValue;
                    Object.defineProperty(c, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/layers/support/InheritedDomain": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/accessorSupport/decorators/enumeration ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ./Domain".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L) {
                    var P;
                    y = P = function(g) {
                        function p(a) {
                            a = g.call(this, a) || this;
                            a.type = "inherited";
                            return a
                        }
                        c._inheritsLoose(p, g);
                        p.prototype.clone = function() {
                            return new P
                        };
                        return p
                    }(L);
                    C.__decorate([E.enumeration({
                        inherited: "inherited"
                    })], y.prototype, "type", void 0);
                    return y = P = C.__decorate([B.subclass("esri.layers.support.InheritedDomain")], y)
                })
        },
        "esri/layers/support/RangeDomain": function() {
            define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/accessorSupport/decorators/enumeration ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ./Domain".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L) {
                    var P;
                    y = P = function(g) {
                        function p(a) {
                            a = g.call(this, a) || this;
                            a.maxValue = null;
                            a.minValue = null;
                            a.type = "range";
                            return a
                        }
                        c._inheritsLoose(p, g);
                        p.prototype.clone = function() {
                            return new P({
                                maxValue: this.maxValue,
                                minValue: this.minValue,
                                name: this.name
                            })
                        };
                        return p
                    }(L);
                    C.__decorate([N.property({
                        type: Number,
                        json: {
                            type: [Number],
                            read: {
                                source: "range",
                                reader(g, p) {
                                    return p.range && p.range[1]
                                }
                            },
                            write: {
                                enabled: !1,
                                overridePolicy() {
                                    return {
                                        enabled: null != this.maxValue && null == this.minValue
                                    }
                                },
                                target: "range",
                                writer(g, p, a) {
                                    p[a] = [this.minValue || 0, g]
                                }
                            }
                        }
                    })], y.prototype, "maxValue", void 0);
                    C.__decorate([N.property({
                        type: Number,
                        json: {
                            type: [Number],
                            read: {
                                source: "range",
                                reader(g, p) {
                                    return p.range && p.range[0]
                                }
                            },
                            write: {
                                target: "range",
                                writer(g, p, a) {
                                    p[a] = [g, this.maxValue || 0]
                                }
                            }
                        }
                    })], y.prototype, "minValue", void 0);
                    C.__decorate([E.enumeration({
                        range: "range"
                    })], y.prototype, "type", void 0);
                    return y = P = C.__decorate([B.subclass("esri.layers.support.RangeDomain")], y)
                })
        },
        "esri/layers/support/fieldType": function() {
            define(["exports",
                "../../core/jsonMap"
            ], function(c, C) {
                C = new C.JSONMap({
                    esriFieldTypeSmallInteger: "small-integer",
                    esriFieldTypeInteger: "integer",
                    esriFieldTypeSingle: "single",
                    esriFieldTypeDouble: "double",
                    esriFieldTypeLong: "long",
                    esriFieldTypeString: "string",
                    esriFieldTypeDate: "date",
                    esriFieldTypeOID: "oid",
                    esriFieldTypeGeometry: "geometry",
                    esriFieldTypeBlob: "blob",
                    esriFieldTypeRaster: "raster",
                    esriFieldTypeGUID: "guid",
                    esriFieldTypeGlobalID: "global-id",
                    esriFieldTypeXML: "xml"
                });
                c.kebabDict = C;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/graphics/featureConversionUtils": function() {
            define("exports ../../core/Logger ../../core/Error ../../geometry/support/jsonUtils ./OptimizedFeature ./OptimizedFeatureSet ./OptimizedGeometry".split(" "), function(c, C, y, F, I, N, E) {
                function B(b, f) {
                    return b ? f ? 4 : 3 : f ? 3 : 2
                }

                function M(b, f, n, m) {
                    if (b) {
                        if (n) return f && m ? ra : la;
                        if (f && m) return ua
                    } else if (f && m) return la;
                    return sa
                }

                function q({
                    scale: b,
                    translate: f
                }, n) {
                    return Math.round((n - f[0]) / b[0])
                }

                function u({
                    scale: b,
                    translate: f
                }, n) {
                    return Math.round((f[1] -
                        n) / b[1])
                }

                function L({
                    scale: b,
                    translate: f
                }, n) {
                    return n * b[0] + f[0]
                }

                function P({
                    scale: b,
                    translate: f
                }, n) {
                    return f[1] - n * b[1]
                }

                function g(b) {
                    b = b.coords;
                    return {
                        x: b[0],
                        y: b[1]
                    }
                }

                function p(b, f) {
                    b.coords[0] = f.x;
                    b.coords[1] = f.y;
                    return b
                }

                function a(b) {
                    b = b.coords;
                    return {
                        x: b[0],
                        y: b[1],
                        z: b[2]
                    }
                }

                function h(b, f) {
                    b.coords[0] = f.x;
                    b.coords[1] = f.y;
                    b.coords[2] = f.z;
                    return b
                }

                function t(b) {
                    b = b.coords;
                    return {
                        x: b[0],
                        y: b[1],
                        m: b[2]
                    }
                }

                function w(b, f) {
                    b.coords[0] = f.x;
                    b.coords[1] = f.y;
                    b.coords[2] = f.m;
                    return b
                }

                function e(b) {
                    b = b.coords;
                    return {
                        x: b[0],
                        y: b[1],
                        z: b[2],
                        m: b[3]
                    }
                }

                function r(b, f) {
                    b.coords[0] = f.x;
                    b.coords[1] = f.y;
                    b.coords[2] = f.z;
                    b.coords[3] = f.m;
                    return b
                }

                function D(b, f) {
                    return b && f ? r : b ? h : f ? w : p
                }

                function S(b, f, n, m, A) {
                    n = D(n, m);
                    for (const x of f) {
                        const {
                            geometry: H,
                            attributes: G
                        } = x;
                        let J;
                        H && (J = n(new E, H));
                        b.push(new I(J, G, null, G[A]))
                    }
                    return b
                }

                function V(b, f, n, m) {
                    for (const A of f) {
                        const {
                            geometry: x,
                            attributes: H
                        } = A;
                        let G;
                        x && (G = W(x, n, m));
                        b.push({
                            attributes: H,
                            geometry: G
                        })
                    }
                    return b
                }

                function W(b, f, n) {
                    if (!b) return null;
                    const m = B(f, n),
                        A = [];
                    for (let x = 0; x < b.coords.length; x += m) {
                        const H = [];
                        for (let G = 0; G < m; G++) H.push(b.coords[x + G]);
                        A.push(H)
                    }
                    return f ? n ? {
                        points: A,
                        hasZ: f,
                        hasM: n
                    } : {
                        points: A,
                        hasZ: f
                    } : n ? {
                        points: A,
                        hasM: n
                    } : {
                        points: A
                    }
                }

                function k(b, f, n, m, A) {
                    n = B(n, m);
                    for (const x of f) {
                        f = x.geometry;
                        m = x.attributes;
                        let H;
                        f && (H = d(new E, f, n));
                        b.push(new I(H, m, null, m[A]))
                    }
                    return b
                }

                function d(b, f, n = B(f.hasZ, f.hasM)) {
                    b.lengths[0] = f.points.length;
                    const m = b.coords;
                    let A = 0;
                    for (const x of f.points)
                        for (f = 0; f < n; f++) m[A++] = x[f];
                    return b
                }

                function l(b, f, n) {
                    if (!b) return null;
                    const m = B(f, n),
                        {
                            coords: A,
                            lengths: x
                        } = b;
                    b = [];
                    let H = 0;
                    for (const G of x) {
                        const J = [];
                        for (let Q = 0; Q < G; Q++) {
                            const R = [];
                            for (let U = 0; U < m; U++) R.push(A[H++]);
                            J.push(R)
                        }
                        b.push(J)
                    }
                    return f ? n ? {
                        paths: b,
                        hasZ: f,
                        hasM: n
                    } : {
                        paths: b,
                        hasZ: f
                    } : n ? {
                        paths: b,
                        hasM: n
                    } : {
                        paths: b
                    }
                }

                function z(b, f, n, m, A) {
                    n = B(n, m);
                    for (const x of f) {
                        f = x.geometry;
                        m = x.attributes;
                        let H;
                        f && (H = K(new E, f, n));
                        b.push(new I(H, m, null, m[A]))
                    }
                    return b
                }

                function K(b, f, n = B(f.hasZ, f.hasM)) {
                    const {
                        lengths: m,
                        coords: A
                    } = b;
                    let x = 0;
                    for (const H of f.paths) {
                        for (const G of H)
                            for (f =
                                0; f < n; f++) A[x++] = G[f];
                        m.push(H.length)
                    }
                    return b
                }

                function v(b, f, n) {
                    if (!b) return null;
                    const m = B(f, n),
                        {
                            coords: A,
                            lengths: x
                        } = b;
                    b = [];
                    let H = 0;
                    for (const G of x) {
                        const J = [];
                        for (let Q = 0; Q < G; Q++) {
                            const R = [];
                            for (let U = 0; U < m; U++) R.push(A[H++]);
                            J.push(R)
                        }
                        b.push(J)
                    }
                    return f ? n ? {
                        rings: b,
                        hasZ: f,
                        hasM: n
                    } : {
                        rings: b,
                        hasZ: f
                    } : n ? {
                        rings: b,
                        hasM: n
                    } : {
                        rings: b
                    }
                }

                function O(b, f, n, m, A) {
                    for (const x of f) {
                        f = x.geometry;
                        const H = x.centroid,
                            G = x.attributes;
                        let J;
                        f && (J = T(new E, f, n, m));
                        H ? b.push(new I(J, G, p(new E, H), G[A])) : b.push(new I(J, G,
                            null, G[A]))
                    }
                    return b
                }

                function T(b, f, n = f.hasZ, m = f.hasM) {
                    X(b, f.rings, n, m);
                    return b
                }

                function X(b, f, n, m) {
                    n = B(n, m);
                    const {
                        lengths: A,
                        coords: x
                    } = b;
                    m = 0;
                    A.length = x.length = 0;
                    for (const H of f) {
                        for (const G of H)
                            for (f = 0; f < n; f++) x[m++] = G[f];
                        A.push(H.length)
                    }
                    return b
                }

                function aa(b, f, n, m, A, x) {
                    b.length = 0;
                    if (!n) {
                        for (const H of f) b.push(new I(null, H.attributes, null, H.attributes[x]));
                        return b
                    }
                    switch (n) {
                        case "esriGeometryPoint":
                            return S(b, f, m, A, x);
                        case "esriGeometryMultipoint":
                            return k(b, f, m, A, x);
                        case "esriGeometryPolyline":
                            return z(b,
                                f, m, A, x);
                        case "esriGeometryPolygon":
                            return O(b, f, m, A, x);
                        default:
                            ha.error("convertToFeatureSet:unknown-geometry", new y(`Unable to parse unknown geometry type '${n}'`)), b.length = 0
                    }
                    return b
                }

                function ia(b, f, n, m) {
                    b = b && ("coords" in b ? b : b.geometry);
                    if (!b) return null;
                    switch (f) {
                        case "esriGeometryPoint":
                            return f = g, n && m ? f = e : n ? f = a : m && (f = t), f(b);
                        case "esriGeometryMultipoint":
                            return W(b, n, m);
                        case "esriGeometryPolyline":
                            return l(b, n, m);
                        case "esriGeometryPolygon":
                            return v(b, n, m);
                        default:
                            ha.error("convertToGeometry:unknown-geometry",
                                new y(`Unable to parse unknown geometry type '${f}'`))
                    }
                }

                function ma(b, f, n, m, A) {
                    b.length = 0;
                    switch (n) {
                        case "esriGeometryPoint":
                            var x = g;
                            m && A ? x = e : m ? x = a : A && (x = t);
                            for (var H of f) {
                                const {
                                    geometry: G,
                                    attributes: J
                                } = H;
                                m = G ? x(G) : null;
                                b.push({
                                    attributes: J,
                                    geometry: m
                                })
                            }
                            break;
                        case "esriGeometryMultipoint":
                            return V(b, f, m, A);
                        case "esriGeometryPolyline":
                            for (const G of f) {
                                const {
                                    geometry: J,
                                    attributes: Q
                                } = G;
                                let R;
                                J && (R = l(J, m, A));
                                b.push({
                                    attributes: Q,
                                    geometry: R
                                })
                            }
                            break;
                        case "esriGeometryPolygon":
                            for (x of f) {
                                const {
                                    geometry: G,
                                    attributes: J,
                                    centroid: Q
                                } = x;
                                let R;
                                G && (R = v(G, m, A));
                                Q ? (H = g(Q), b.push({
                                    attributes: J,
                                    centroid: H,
                                    geometry: R
                                })) : b.push({
                                    attributes: J,
                                    geometry: R
                                })
                            }
                            break;
                        default:
                            ha.error("convertToFeatureSet:unknown-geometry", new y(`Unable to parse unknown geometry type '${n}'`))
                    }
                    return b
                }

                function na(b, f, n, m, A, x, H = n, G = m) {
                    b.lengths.length && (b.lengths.length = 0);
                    b.coords.length && (b.coords.length = 0);
                    if (!f || !f.coords.length) return null;
                    A = oa[A];
                    const {
                        coords: J,
                        lengths: Q
                    } = f;
                    f = B(n, m);
                    const R = B(n && H, m && G);
                    n = M(n, m, H, G);
                    if (!Q.length) return n(b.coords,
                        J, 0, 0, q(x, J[0]), u(x, J[1])), b.lengths.length && (b.lengths.length = 0), b.coords.length = f, b;
                    let U, Z = 0,
                        Y, ba = 0;
                    for (const ea of Q) {
                        if (ea < A) continue;
                        let da = 0;
                        Y = ba;
                        G = m = q(x, J[Z]);
                        U = H = u(x, J[Z + 1]);
                        n(b.coords, J, Y, Z, G, U);
                        da++;
                        Z += f;
                        Y += R;
                        for (let ca = 1; ca < ea; ca++, Z += f)
                            if (G = q(x, J[Z]), U = u(x, J[Z + 1]), G !== m || U !== H) n(b.coords, J, Y, Z, G - m, U - H), Y += R, da++, m = G, H = U;
                        da >= A && (b.lengths.push(da), ba = Y)
                    }
                    b.coords.length = ba;
                    return b.coords.length ? b : null
                }

                function pa(b, f, n, m, A, x, H) {
                    let G = m,
                        J = 0;
                    for (let R = x + n; R < H; R += n) {
                        {
                            var Q = f[R];
                            const U = f[R +
                                    1],
                                Z = f[H],
                                Y = f[H + 1];
                            let ba = f[x],
                                ea = f[x + 1],
                                da = Z - ba,
                                ca = Y - ea;
                            if (0 !== da || 0 !== ca) {
                                const fa = ((Q - ba) * da + (U - ea) * ca) / (da * da + ca * ca);
                                1 < fa ? (ba = Z, ea = Y) : 0 < fa && (ba += da * fa, ea += ca * fa)
                            }
                            da = Q - ba;
                            ca = U - ea;
                            Q = da * da + ca * ca
                        }
                        Q > G && (J = R, G = Q)
                    }
                    G > m && (J - x > n && pa(b, f, n, m, A, x, J), A(b, f, b.length, J, f[J], f[J + 1]), H - J > n && pa(b, f, n, m, A, J, H))
                }

                function qa(b, f, n, m, A) {
                    const {
                        coords: x,
                        lengths: H
                    } = f, G = n ? m ? ra : la : m ? la : sa;
                    n = B(n, m);
                    if (!x.length) return b !== f && (b.lengths.length = 0, b.coords.length = 0), b;
                    if (!H.length) return G(b.coords, x, 0, 0, L(A, x[0]), P(A, x[1])),
                        b !== f && (b.lengths.length = 0, b.coords.length = n), b;
                    const [J, Q] = A.scale;
                    m = 0;
                    for (let R = 0; R < H.length; R++) {
                        const U = H[R];
                        b.lengths[R] = U;
                        let Z = L(A, x[m]),
                            Y = P(A, x[m + 1]);
                        G(b.coords, x, m, m, Z, Y);
                        m += n;
                        for (let ba = 1; ba < U; ba++, m += n) Z += x[m] * J, Y -= x[m + 1] * Q, G(b.coords, x, m, m, Z, Y)
                    }
                    b !== f && (b.lengths.length = H.length, b.coords.length = x.length);
                    return b
                }

                function ta(b, f, n, m) {
                    let A = 0,
                        x = b[m * f],
                        H = b[m * (f + 1)];
                    for (let G = 1; G < n; G++) {
                        const J = x + b[m * (f + G)],
                            Q = H + b[m * (f + G) + 1],
                            R = (J - x) * (Q + H);
                        x = J;
                        H = Q;
                        A += R
                    }
                    return .5 * A
                }
                const ha = C.getLogger("esri.tasks.support.optimizedFeatureSet"),
                    oa = {
                        esriGeometryPoint: 0,
                        esriGeometryPolyline: 2,
                        esriGeometryPolygon: 3,
                        esriGeometryMultipoint: 0
                    },
                    sa = (b, f, n, m, A, x) => {
                        b[n] = A;
                        b[n + 1] = x
                    },
                    la = (b, f, n, m, A, x) => {
                        b[n] = A;
                        b[n + 1] = x;
                        b[n + 2] = f[m + 2]
                    },
                    ua = (b, f, n, m, A, x) => {
                        b[n] = A;
                        b[n + 1] = x;
                        b[n + 2] = f[m + 3]
                    },
                    ra = (b, f, n, m, A, x) => {
                        b[n] = A;
                        b[n + 1] = x;
                        b[n + 2] = f[m + 2];
                        b[n + 3] = f[m + 3]
                    },
                    ja = [],
                    ka = [];
                c.convertFromFeature = function(b, f, n, m, A) {
                    ja[0] = b;
                    [b] = aa(ka, ja, f, n, m, A);
                    ja.length = ka.length = 0;
                    return b
                };
                c.convertFromFeatureSet = function(b, f) {
                    const n = new N,
                        {
                            hasM: m,
                            hasZ: A,
                            features: x,
                            objectIdFieldName: H,
                            spatialReference: G,
                            geometryType: J,
                            exceededTransferLimit: Q,
                            transform: R,
                            fields: U
                        } = b;
                    U && (n.fields = U);
                    n.geometryType = J;
                    n.objectIdFieldName = H || f;
                    n.spatialReference = G;
                    if (!n.objectIdFieldName) return ha.error(new y("optimized-features:invalid-objectIdFieldName", "objectIdFieldName is missing")), n;
                    x && aa(n.features, x, J, A, m, n.objectIdFieldName);
                    Q && (n.exceededTransferLimit = Q);
                    m && (n.hasM = m);
                    A && (n.hasZ = A);
                    R && (n.transform = R);
                    return n
                };
                c.convertFromFeatures = aa;
                c.convertFromGeometry = function(b, f, n) {
                    if (!b) return null;
                    const m = new E;
                    "hasZ" in b && null == f && (f = b.hasZ);
                    "hasM" in b && null == n && (n = b.hasM);
                    if (F.isPoint(b)) return D(null != f ? f : null != b.z, null != n ? n : null != b.m)(m, b);
                    if (F.isPolygon(b)) return T(m, b, f, n);
                    if (F.isPolyline(b)) return K(m, b, B(f, n));
                    if (F.isMultipoint(b)) return d(m, b, B(f, n));
                    ha.error("convertFromGeometry:unknown-geometry", new y(`Unable to parse unknown geometry type '${b}'`))
                };
                c.convertFromGraphics = function(b, f, n, m, A, x) {
                    const H = b.length;
                    switch (n) {
                        case "esriGeometryPoint":
                            S(b, f, m, A, x);
                            break;
                        case "esriGeometryMultipoint":
                            k(b,
                                f, m, A, x);
                            break;
                        case "esriGeometryPolyline":
                            z(b, f, m, A, x);
                            break;
                        case "esriGeometryPolygon":
                            O(b, f, m, A, x);
                            break;
                        default:
                            ha.error("convertToFeatureSet:unknown-geometry", new y(`Unable to parse unknown geometry type '${n}'`))
                    }
                    for (m = 0; m < f.length; m++) b[m + H].geometryType = n, b[m + H].insertAfter = f[m].insertAfter, b[m + H].groupId = f[m].groupId;
                    return b
                };
                c.convertFromMultipoint = d;
                c.convertFromMultipointFeatures = k;
                c.convertFromNestedArray = X;
                c.convertFromPoint = function(b, f, n = D(null != f.z, null != f.m)) {
                    return n(b, f)
                };
                c.convertFromPointFeatures =
                    S;
                c.convertFromPolygon = T;
                c.convertFromPolyline = K;
                c.convertFromPolylineFeatures = z;
                c.convertToFeature = function(b, f, n, m) {
                    ka[0] = b;
                    ma(ja, ka, f, n, m);
                    b = ja[0];
                    ja.length = ka.length = 0;
                    return b
                };
                c.convertToFeatureSet = function(b) {
                    const {
                        objectIdFieldName: f,
                        spatialReference: n,
                        transform: m,
                        fields: A,
                        hasM: x,
                        hasZ: H,
                        features: G,
                        geometryType: J,
                        exceededTransferLimit: Q,
                        uniqueIdField: R,
                        queryGeometry: U,
                        queryGeometryType: Z
                    } = b;
                    b = ma([], G, J, H, x);
                    const Y = ia(U, Z, !1, !1);
                    b = {
                        features: b,
                        fields: A,
                        geometryType: J,
                        objectIdFieldName: f,
                        spatialReference: n,
                        uniqueIdField: R,
                        queryGeometry: Y
                    };
                    m && (b.transform = m);
                    Q && (b.exceededTransferLimit = Q);
                    x && (b.hasM = x);
                    H && (b.hasZ = H);
                    return b
                };
                c.convertToFeatures = ma;
                c.convertToGeometry = ia;
                c.convertToMultipoint = W;
                c.convertToMultipointFeatures = V;
                c.convertToPoint = function(b, f, n) {
                    return b ? f ? n ? e(b) : a(b) : n ? t(b) : g(b) : null
                };
                c.convertToPolygon = v;
                c.convertToPolyline = l;
                c.deltaDecodeGeometry = function(b, f) {
                    const n = b.clone(),
                        m = b.coords;
                    b = b.lengths;
                    let A = 0;
                    for (let G = 0; G < b.length; G++) {
                        const J = b[G];
                        var x = m[f * A],
                            H = m[f * A + 1];
                        for (let Q = 1; Q <
                            J; Q++) x += m[f * (A + Q)], H += m[f * (A + Q) + 1], n.coords[f * (A + Q)] = x, n.coords[f * (A + Q) + 1] = H;
                        A += J
                    }
                    return n
                };
                c.deltaEncodeGeometry = function(b, f) {
                    const n = b.clone(),
                        m = b.coords;
                    b = b.lengths;
                    let A = 0;
                    for (let H = 0; H < b.length; H++) {
                        const G = b[H];
                        let J = m[f * A];
                        var x = m[f * A + 1];
                        for (let Q = 1; Q < G; Q++) {
                            const R = m[f * (A + Q)],
                                U = m[f * (A + Q) + 1];
                            x = U - x;
                            n.coords[f * (A + Q)] = R - J;
                            n.coords[f * (A + Q) + 1] = x;
                            J = R;
                            x = U
                        }
                        A += G
                    }
                    return n
                };
                c.generalizeOptimizedGeometry = function(b, f, n, m, A, x, H = n, G = m) {
                    b.lengths.length && (b.lengths.length = 0);
                    b.coords.length && (b.coords.length =
                        0);
                    if (!f || !f.coords.length) return null;
                    A = oa[A];
                    const {
                        coords: J,
                        lengths: Q
                    } = f;
                    f = B(n, m);
                    const R = B(n && H, m && G);
                    n = M(n, m, H, G);
                    if (!Q.length) return n(b.coords, J, 0, 0, J[0], J[1]), b.lengths.length && (b.lengths.length = 0), b.coords.length = f, b;
                    m = 0;
                    x *= x;
                    for (const U of Q) {
                        if (U < A) {
                            m += U * f;
                            continue
                        }
                        H = b.coords.length / R;
                        G = m;
                        const Z = m + (U - 1) * f;
                        n(b.coords, J, b.coords.length, G, J[G], J[G + 1]);
                        pa(b.coords, J, f, x, n, G, Z);
                        n(b.coords, J, b.coords.length, Z, J[Z], J[Z + 1]);
                        G = b.coords.length / R - H;
                        G >= A ? b.lengths.push(G) : b.coords.length = H * R;
                        m += U *
                            f
                    }
                    return b.coords.length ? b : null
                };
                c.getBoundsOptimizedGeometry = function(b, f, n, m) {
                    if (!f || !f.coords || !f.coords.length) return null;
                    n = B(n, m);
                    let A = m = Number.POSITIVE_INFINITY,
                        x = Number.NEGATIVE_INFINITY,
                        H = Number.NEGATIVE_INFINITY;
                    if (f && f.coords) {
                        f = f.coords;
                        for (let G = 0; G < f.length; G += n) {
                            const J = f[G],
                                Q = f[G + 1];
                            m = Math.min(m, J);
                            x = Math.max(x, J);
                            A = Math.min(A, Q);
                            H = Math.max(H, Q)
                        }
                    }
                    b[0] = m;
                    b[1] = A;
                    b[2] = x;
                    b[3] = H;
                    return b
                };
                c.getQuantizedArea = function(b, f) {
                    const {
                        coords: n,
                        lengths: m
                    } = b;
                    let A = b = 0;
                    for (let x = 0; x < m.length; x++) A +=
                        ta(n, b, m[x], f), b += x;
                    return Math.abs(A)
                };
                c.getQuantizedBoundsOptimizedGeometry = function(b, f, n, m) {
                    n = B(n, m);
                    const {
                        lengths: A,
                        coords: x
                    } = f;
                    m = f = Number.POSITIVE_INFINITY;
                    let H = Number.NEGATIVE_INFINITY,
                        G = Number.NEGATIVE_INFINITY,
                        J = 0;
                    for (const Q of A) {
                        let R = x[J],
                            U = x[J + 1];
                        f = Math.min(R, f);
                        m = Math.min(U, m);
                        H = Math.max(R, H);
                        G = Math.max(U, G);
                        J += n;
                        for (let Z = 1; Z < Q; Z++, J += n) {
                            const Y = x[J],
                                ba = x[J + 1];
                            R += Y;
                            U += ba;
                            0 > Y && (f = Math.min(f, R));
                            0 < Y && (H = Math.max(H, R));
                            0 > ba ? m = Math.min(m, U) : 0 < ba && (G = Math.max(G, U))
                        }
                    }
                    b[0] = f;
                    b[1] = m;
                    b[2] =
                        H;
                    b[3] = G;
                    return b
                };
                c.getSignedQuantizedRingArea = ta;
                c.quantizeOptimizedFeatureSet = function(b, f) {
                    const {
                        geometryType: n,
                        features: m,
                        hasM: A,
                        hasZ: x
                    } = f;
                    if (!b) return f;
                    for (let H = 0; H < m.length; H++) {
                        const G = m[H],
                            J = G.weakClone();
                        J.geometry = new E;
                        na(J.geometry, G.geometry, A, x, n, b);
                        G.centroid && (J.centroid = new E, na(J.centroid, G.centroid, A, x, "esriGeometryPoint", b));
                        m[H] = J
                    }
                    f.transform = b;
                    return f
                };
                c.quantizeOptimizedGeometry = na;
                c.quantizeX = q;
                c.quantizeY = u;
                c.removeCollinearVectices = function(b, f, n, m, A) {
                    if (!f || !f.coords ||
                        !f.coords.length) return null;
                    n = oa[n];
                    const {
                        coords: x,
                        lengths: H
                    } = f;
                    f = M(m, A, m, A);
                    m = B(m, A);
                    let G = A = 0,
                        J = 0,
                        Q = 0;
                    for (const Z of H) {
                        G = Q;
                        f(b.coords, x, G, A, x[A], x[A + 1]);
                        A += m;
                        var R = x[A];
                        let Y = x[A + 1],
                            ba = R,
                            ea = Y;
                        var U = Y / R;
                        G += m;
                        f(b.coords, x, G, A, ba, ea);
                        A += m;
                        for (let da = 2; da < Z; da++) {
                            R = x[A];
                            Y = x[A + 1];
                            const ca = Y / R,
                                fa = U === ca || !isFinite(U) && !isFinite(ca);
                            U = fa && isFinite(ca) ? 0 <= U && 0 <= ca || 0 >= U && 0 >= ca : 0 <= ea && 0 <= Y || 0 >= ea && 0 >= Y;
                            fa && U ? (ba += R, ea += Y) : (ba = R, ea = Y, G += m);
                            f(b.coords, x, G, A, ba, ea);
                            A += m;
                            U = ca
                        }
                        G += m;
                        R = (G - Q) / m;
                        R >= n && (b.lengths[J] =
                            R, Q = G, J++)
                    }
                    b.coords.length > Q && (b.coords.length = Q);
                    b.lengths.length > J && (b.lengths.length = J);
                    return b.coords.length && b.lengths.length ? b : null
                };
                c.removeZMValues = function(b, f, n, m, A, x) {
                    const H = B(n, m);
                    n = M(n, m, A, x);
                    m = f.coords;
                    b.coords.length = 0;
                    b.lengths.length = 0;
                    b.lengths.push(...f.lengths);
                    for (f = 0; f < m.length; f += H) n(b.coords, m, b.coords.length, f, m[f], m[f + 1]);
                    return b
                };
                c.unquantizeOptimizedFeatureSet = function(b) {
                    const {
                        transform: f,
                        features: n,
                        hasM: m,
                        hasZ: A
                    } = b;
                    if (!f) return b;
                    for (const x of n) x.geometry && qa(x.geometry,
                        x.geometry, m, A, f), x.centroid && qa(x.centroid, x.centroid, m, A, f);
                    b.transform = null;
                    return b
                };
                c.unquantizeOptimizedGeometry = qa;
                c.unquantizeX = L;
                c.unquantizeY = P;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/rest/query/operations/zscale": function() {
            define(["exports", "../../../core/maybe", "../../../geometry/support/spatialReferenceUtils", "../../../core/unitUtils"], function(c, C, y, F) {
                function I(E, B, M) {
                    if (null == E.hasM || E.hasZ)
                        for (const q of B)
                            for (const u of q) 2 < u.length && (u[2] *= M)
                }

                function N(E, B,
                    M) {
                    if (E)
                        for (const u of E) {
                            E = u.geometry;
                            var q = M;
                            if (E && E.spatialReference && !y.equals(E.spatialReference, B) && (q = F.getMetersPerVerticalUnitForSR(E.spatialReference) / q, 1 !== q))
                                if ("x" in E) null != E.z && (E.z *= q);
                                else if ("rings" in E) I(E, E.rings, q);
                            else if ("paths" in E) I(E, E.paths, q);
                            else if ("points" in E && (null == E.hasM || E.hasZ))
                                for (const L of E.points) 2 < L.length && (L[2] *= q)
                        }
                }
                c.getGeometryZScaler = function(E, B, M) {
                    if (C.isNone(B) || C.isNone(M) || M.vcsWkid || y.equals(B, M)) return null;
                    B = F.getMetersPerVerticalUnitForSR(B);
                    M = F.getMetersPerVerticalUnitForSR(M);
                    const q = B / M;
                    if (1 === q) return null;
                    switch (E) {
                        case "point":
                        case "esriGeometryPoint":
                            return u => {
                                u && null != u.z && (u.z *= q)
                            };
                        case "polyline":
                        case "esriGeometryPolyline":
                            return u => {
                                if (u)
                                    for (const L of u.paths)
                                        for (const P of L) 2 < P.length && (P[2] *= q)
                            };
                        case "polygon":
                        case "esriGeometryPolygon":
                            return u => {
                                if (u)
                                    for (const L of u.rings)
                                        for (const P of L) 2 < P.length && (P[2] *= q)
                            };
                        case "multipoint":
                        case "esriGeometryMultipoint":
                            return u => {
                                if (u)
                                    for (const L of u.points) 2 < L.length && (L[2] *=
                                        q)
                            };
                        default:
                            return null
                    }
                };
                c.unapplyEditsZUnitScaling = function(E, B, M) {
                    if ((E || B) && M) {
                        var q = F.getMetersPerVerticalUnitForSR(M);
                        N(E, M, q);
                        N(B, M, q)
                    }
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/graphics/dehydratedFeatures": function() {
            define("exports ../../core/has ../../core/typedArrayUtil ../../core/maybe ../../geometry/SpatialReference ../../geometry/support/typeUtils ../../core/uid ../../geometry/support/aaBoundingRect ../support/Field ../../core/byteSizeEstimations ../../geometry/support/aaBoundingBox ../../geometry/support/quantizationUtils ./dehydratedFeatureComparison".split(" "),
                function(c, C, y, F, I, N, E, B, M, q, u, L, P) {
                    function g(e, r, D) {
                        if (!e) return null;
                        switch (r) {
                            case "point":
                                return {
                                    x: e.x,
                                    y: e.y,
                                    z: e.z,
                                    m: e.m,
                                    hasZ: null != e.z,
                                    hasM: null != e.m,
                                    type: "point",
                                    spatialReference: D
                                };
                            case "polyline":
                                return {
                                    paths: e.paths,
                                    hasZ: !!e.hasZ,
                                    hasM: !!e.hasM,
                                    type: "polyline",
                                    spatialReference: D
                                };
                            case "polygon":
                                return {
                                    rings: e.rings,
                                    hasZ: !!e.hasZ,
                                    hasM: !!e.hasM,
                                    type: "polygon",
                                    spatialReference: D
                                };
                            case "multipoint":
                                return {
                                    points: e.points,
                                    hasZ: !!e.hasZ,
                                    hasM: !!e.hasM,
                                    type: "multipoint",
                                    spatialReference: D
                                }
                        }
                    }

                    function p(e) {
                        if (F.isNone(e)) return 0;
                        let r = 32;
                        switch (e.type) {
                            case "point":
                                r += 42;
                                break;
                            case "polyline":
                            case "polygon":
                                {
                                    var D = 0;
                                    const S = 2 + (e.hasZ ? 1 : 0) + (e.hasM ? 1 : 0);e = "polyline" === e.type ? e.paths : e.rings;
                                    for (const V of e) D += V.length;r += 8 * D * S + 64;r += 128 * D;r = r + 34 + 32 * (e.length + 1);
                                    break
                                }
                            case "multipoint":
                                D = e.points.length;
                                r += 8 * D * (2 + (e.hasZ ? 1 : 0) + (e.hasM ? 1 : 0)) + 64;
                                r += 128 * D;
                                r = r + 34 + 32;
                                break;
                            case "extent":
                                r += 98;
                                e.hasM && (r += 32);
                                e.hasZ && (r += 32);
                                break;
                            case "mesh":
                                r += y.estimateSize(e.vertexAttributes.position), r += y.estimateSize(e.vertexAttributes.normal),
                                    r += y.estimateSize(e.vertexAttributes.uv), r += y.estimateSize(e.vertexAttributes.tangent)
                        }
                        return r
                    }

                    function a(e, r) {
                        u.empty(r);
                        "mesh" === e.type && (e = e.extent);
                        switch (e.type) {
                            case "point":
                                r[0] = r[3] = e.x;
                                r[1] = r[4] = e.y;
                                e.hasZ && (r[2] = r[5] = e.z);
                                break;
                            case "polyline":
                                for (var D = 0; D < e.paths.length; D++) u.expandWithNestedArray(r, e.paths[D], e.hasZ);
                                break;
                            case "polygon":
                                for (D = 0; D < e.rings.length; D++) u.expandWithNestedArray(r, e.rings[D], e.hasZ);
                                break;
                            case "multipoint":
                                u.expandWithNestedArray(r, e.points, e.hasZ);
                                break;
                            case "extent":
                                r[0] = e.xmin, r[1] = e.ymin, r[3] = e.xmax, r[4] = e.ymax, null != e.zmin && (r[2] = e.zmin), null != e.zmax && (r[5] = e.zmax)
                        }
                    }

                    function h(e, r) {
                        B.empty(r);
                        "mesh" === e.type && (e = e.extent);
                        switch (e.type) {
                            case "point":
                                r[0] = r[2] = e.x;
                                r[1] = r[3] = e.y;
                                break;
                            case "polyline":
                                for (var D = 0; D < e.paths.length; D++) B.expandWithNestedArray(r, e.paths[D]);
                                break;
                            case "polygon":
                                for (D = 0; D < e.rings.length; D++) B.expandWithNestedArray(r, e.rings[D]);
                                break;
                            case "multipoint":
                                B.expandWithNestedArray(r, e.points);
                                break;
                            case "extent":
                                r[0] = e.xmin,
                                    r[1] = e.ymin, r[2] = e.xmax, r[3] = e.ymax
                        }
                    }
                    const t = u.create(),
                        w = B.create();
                    c.equals = P.equals;
                    c.DehydratedFeatureClass = function(e, r, D) {
                        this.uid = e;
                        this.geometry = r;
                        this.attributes = D;
                        this.visible = !0;
                        this.centroid = this.objectId = null
                    };
                    c.DehydratedFeatureSetClass = function() {
                        this.exceededTransferLimit = !1;
                        this.features = [];
                        this.fields = [];
                        this.hasZ = this.hasM = !1;
                        this.transform = this.spatialReference = this.geohashFieldName = this.geometryProperties = this.globalIdFieldName = this.objectIdFieldName = this.geometryType = null
                    };
                    c.computeAABB =
                        a;
                    c.computeAABR = h;
                    c.estimateGeometryObjectSize = p;
                    c.estimateSize = function(e) {
                        let r;
                        r = 32 + q.estimateAttributesObjectSize(e.attributes);
                        return r = r + 3 + (8 + p(e.geometry))
                    };
                    c.expandAABB = function(e, r) {
                        a(e, t);
                        u.expandWithAABB(r, t)
                    };
                    c.expandAABR = function(e, r) {
                        h(e, w);
                        B.expand(r, w)
                    };
                    c.fromFeatureSetJSON = function(e) {
                        const r = N.featureGeometryTypeKebabDictionary.fromJSON(e.geometryType),
                            D = I.fromJSON(e.spatialReference),
                            S = e.transform,
                            V = e.features.map(W => {
                                var k = e.objectIdFieldName;
                                W = {
                                    uid: E.generateUID(),
                                    objectId: k &&
                                        W.attributes ? W.attributes[k] : null,
                                    attributes: W.attributes,
                                    geometry: g(W.geometry, r, D),
                                    visible: !0
                                };
                                if ((k = W.geometry) && S) switch (k.type) {
                                    case "point":
                                        W.geometry = L.unquantizePoint(S, k, k, k.hasZ, k.hasM);
                                        break;
                                    case "multipoint":
                                        W.geometry = L.unquantizeMultipoint(S, k, k, k.hasZ, k.hasM);
                                        break;
                                    case "polygon":
                                        W.geometry = L.unquantizePolygon(S, k, k, k.hasZ, k.hasM);
                                        break;
                                    case "polyline":
                                        W.geometry = L.unquantizePolyline(S, k, k, k.hasZ, k.hasM)
                                }
                                return W
                            });
                        return {
                            geometryType: r,
                            features: V,
                            spatialReference: D,
                            fields: e.fields ?
                                e.fields.map(W => M.fromJSON(W)) : null,
                            objectIdFieldName: e.objectIdFieldName,
                            globalIdFieldName: e.globalIdFieldName,
                            geohashFieldName: e.geohashFieldName,
                            geometryProperties: e.geometryProperties,
                            hasZ: e.hasZ,
                            hasM: e.hasM,
                            exceededTransferLimit: e.exceededTransferLimit,
                            transform: null
                        }
                    };
                    c.fromJSONGeometry = g;
                    c.getObjectId = function(e, r) {
                        return null != e.objectId ? e.objectId : e.attributes && r ? e.attributes[r] : null
                    };
                    c.hasGeometry = function(e) {
                        return F.isSome(e.geometry)
                    };
                    c.hasVertices = function(e) {
                        if (!e) return !1;
                        switch (e.type) {
                            case "extent":
                            case "point":
                                return !0;
                            case "polyline":
                                for (const r of e.paths)
                                    if (0 < r.length) return !0;
                                return !1;
                            case "polygon":
                                for (const r of e.rings)
                                    if (0 < r.length) return !0;
                                return !1;
                            case "multipoint":
                                return 0 < e.points.length;
                            case "mesh":
                                return e.vertexAttributes && e.vertexAttributes.position && 0 < e.vertexAttributes.position.length
                        }
                    };
                    c.isDehydratedPoint = function(e) {
                        return "point" === e.type
                    };
                    c.isFeatureGeometry = function(e) {
                        return N.isFeatureGeometryType(e.type)
                    };
                    c.makeDehydratedPoint = function(e, r, D, S) {
                        return {
                            x: e,
                            y: r,
                            z: D,
                            hasZ: null != D,
                            hasM: !1,
                            spatialReference: S,
                            type: "point"
                        }
                    };
                    c.numVertices = function(e) {
                        if (F.isNone(e)) return 0;
                        switch (e.type) {
                            case "point":
                                return 1;
                            case "polyline":
                                var r = 0;
                                for (var D of e.paths) r += D.length;
                                return r;
                            case "polygon":
                                D = 0;
                                for (r of e.rings) D += r.length;
                                return D;
                            case "multipoint":
                                return e.points.length;
                            case "extent":
                                return 2;
                            case "mesh":
                                return (e = e.vertexAttributes && e.vertexAttributes.position) ? e.length / 3 : 0
                        }
                    };
                    Object.defineProperty(c, "__esModule", {
                        value: !0
                    })
                })
        },
        "esri/geometry/support/aaBoundingRect": function() {
            define(["exports", "../../core/has",
                "../../core/maybe", "../Extent"
            ], function(c, C, y, F) {
                function I(g = P) {
                    return [g[0], g[1], g[2], g[3]]
                }

                function N(g) {
                    return g[0] >= g[2] ? 0 : g[2] - g[0]
                }

                function E(g) {
                    return g[1] >= g[3] ? 0 : g[3] - g[1]
                }

                function B(g, p, a) {
                    return p >= g[0] && a >= g[1] && p <= g[2] && a <= g[3]
                }

                function M(g, p) {
                    g[0] = p[0];
                    g[1] = p[1];
                    g[2] = p[2];
                    g[3] = p[3];
                    return g
                }

                function q(g) {
                    return 4 === g.length
                }

                function u(g, p, a) {
                    return g < p ? p : g > a ? a : g
                }
                const L = [Infinity, Infinity, -Infinity, -Infinity],
                    P = [0, 0, 0, 0];
                c.NEGATIVE_INFINITY = L;
                c.POSITIVE_INFINITY = [-Infinity, -Infinity,
                    Infinity, Infinity
                ];
                c.UNIT = [0, 0, 1, 1];
                c.ZERO = P;
                c.allFinite = function(g) {
                    for (let p = 0; 4 > p; p++)
                        if (!isFinite(g[p])) return !1;
                    return !0
                };
                c.area = function(g) {
                    return N(g) * E(g)
                };
                c.center = function(g, p = [0, 0]) {
                    p[0] = (g[0] + g[2]) / 2;
                    p[1] = (g[1] + g[3]) / 2;
                    return p
                };
                c.clone = function(g) {
                    return [g[0], g[1], g[2], g[3]]
                };
                c.contains = function(g, p) {
                    return p[0] >= g[0] && p[2] <= g[2] && p[1] >= g[1] && p[3] <= g[3]
                };
                c.containsPoint = function(g, p) {
                    return B(g, p[0], p[1])
                };
                c.containsPointObject = function(g, p) {
                    return B(g, p.x, p.y)
                };
                c.containsPointWithMargin =
                    function(g, p, a) {
                        return p[0] >= g[0] - a && p[1] >= g[1] - a && p[0] <= g[2] + a && p[1] <= g[3] + a
                    };
                c.containsXY = B;
                c.create = I;
                c.diameter = function(g) {
                    const p = N(g);
                    g = E(g);
                    return Math.sqrt(p * p + g * g)
                };
                c.distance = function(g, p) {
                    const a = (g[1] + g[3]) / 2,
                        h = Math.max(Math.abs(p[0] - (g[0] + g[2]) / 2) - N(g) / 2, 0);
                    g = Math.max(Math.abs(p[1] - a) - E(g) / 2, 0);
                    return Math.sqrt(h * h + g * g)
                };
                c.empty = function(g) {
                    return g ? M(g, L) : I(L)
                };
                c.equals = function(g, p, a) {
                    if (y.isNone(g) || y.isNone(p)) return g === p;
                    if (!q(g) || !q(p)) return !1;
                    if (a)
                        for (let h = 0; h < g.length; h++) {
                            if (!a(g[h],
                                    p[h])) return !1
                        } else
                            for (a = 0; a < g.length; a++)
                                if (g[a] !== p[a]) return !1;
                    return !0
                };
                c.expand = function(g, p, a = g) {
                    if ("length" in p)
                        if (q(p)) a[0] = Math.min(g[0], p[0]), a[1] = Math.min(g[1], p[1]), a[2] = Math.max(g[2], p[2]), a[3] = Math.max(g[3], p[3]);
                        else {
                            if (2 === p.length || 3 === p.length) a[0] = Math.min(g[0], p[0]), a[1] = Math.min(g[1], p[1]), a[2] = Math.max(g[2], p[0]), a[3] = Math.max(g[3], p[1])
                        }
                    else switch (p.type) {
                        case "extent":
                            a[0] = Math.min(g[0], p.xmin);
                            a[1] = Math.min(g[1], p.ymin);
                            a[2] = Math.max(g[2], p.xmax);
                            a[3] = Math.max(g[3], p.ymax);
                            break;
                        case "point":
                            a[0] = Math.min(g[0], p.x), a[1] = Math.min(g[1], p.y), a[2] = Math.max(g[2], p.x), a[3] = Math.max(g[3], p.y)
                    }
                    return a
                };
                c.expandPointInPlace = function(g, p) {
                    p[0] < g[0] && (g[0] = p[0]);
                    p[0] > g[2] && (g[2] = p[0]);
                    p[1] < g[1] && (g[1] = p[1]);
                    p[1] > g[3] && (g[3] = p[1])
                };
                c.expandWithNestedArray = function(g, p, a = g) {
                    const h = p.length;
                    let t = g[0],
                        w = g[1],
                        e = g[2];
                    g = g[3];
                    for (let r = 0; r < h; r++) {
                        const D = p[r];
                        t = Math.min(t, D[0]);
                        w = Math.min(w, D[1]);
                        e = Math.max(e, D[0]);
                        g = Math.max(g, D[1])
                    }
                    a[0] = t;
                    a[1] = w;
                    a[2] = e;
                    a[3] = g;
                    return a
                };
                c.fromExtent =
                    function(g, p = I()) {
                        p[0] = g.xmin;
                        p[1] = g.ymin;
                        p[2] = g.xmax;
                        p[3] = g.ymax;
                        return p
                    };
                c.fromValues = function(g, p, a, h, t = I()) {
                    t[0] = g;
                    t[1] = p;
                    t[2] = a;
                    t[3] = h;
                    return t
                };
                c.height = E;
                c.intersection = function(g, p, a = g) {
                    const h = p[0],
                        t = p[1],
                        w = p[2];
                    p = p[3];
                    a[0] = u(g[0], h, w);
                    a[1] = u(g[1], t, p);
                    a[2] = u(g[2], h, w);
                    a[3] = u(g[3], t, p);
                    return a
                };
                c.intersects = function(g, p) {
                    return Math.max(p[0], g[0]) <= Math.min(p[2], g[2]) && Math.max(p[1], g[1]) <= Math.min(p[3], g[3])
                };
                c.is = q;
                c.isPoint = function(g) {
                    return (0 === N(g) || !isFinite(g[0])) && (0 === E(g) || !isFinite(g[1]))
                };
                c.offset = function(g, p, a, h = g) {
                    h[0] = g[0] + p;
                    h[1] = g[1] + a;
                    h[2] = g[2] + p;
                    h[3] = g[3] + a;
                    return h
                };
                c.pad = function(g, p, a = g) {
                    a[0] = g[0] - p;
                    a[1] = g[1] - p;
                    a[2] = g[2] + p;
                    a[3] = g[3] + p;
                    return a
                };
                c.set = M;
                c.setMax = function(g, p, a = g) {
                    a[2] = p[0];
                    a[3] = p[1];
                    a !== g && (a[0] = g[0], a[1] = g[1]);
                    return g
                };
                c.setMin = function(g, p, a = g) {
                    a[0] = p[0];
                    a[1] = p[1];
                    a !== g && (a[2] = g[2], a[3] = g[3]);
                    return a
                };
                c.size = function(g, p) {
                    p[0] = g[2] - g[0];
                    p[1] = g[3] - g[1]
                };
                c.toExtent = function(g, p) {
                    return new F({
                        xmin: g[0],
                        ymin: g[1],
                        xmax: g[2],
                        ymax: g[3],
                        spatialReference: p
                    })
                };
                c.width = N;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/core/byteSizeEstimations": function() {
            define(["exports"], function(c) {
                function C(y) {
                    return 32 + y.length
                }
                c.estimateAttributesObjectSize = function(y) {
                    if (!y) return 0;
                    let F = 32;
                    for (const I in y)
                        if (y.hasOwnProperty(I)) {
                            const N = y[I];
                            switch (typeof N) {
                                case "string":
                                    F += C(N);
                                    break;
                                case "number":
                                    F += 16;
                                    break;
                                case "boolean":
                                    F += 4
                            }
                        }
                    return F
                };
                c.estimateFixedArraySize = function(y, F) {
                    return 32 + y.length * F
                };
                c.estimateNumberByteSize = function() {
                    return 16
                };
                c.estimateStringByteSize =
                    C;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/geometry/support/aaBoundingBox": function() {
            define(["exports", "../../core/maybe", "../Extent", "./aaBoundingRect"], function(c, C, y, F) {
                function I(a = g) {
                    return [a[0], a[1], a[2], a[3], a[4], a[5]]
                }

                function N(a, h, t, w, e, r, D = I()) {
                    D[0] = a;
                    D[1] = h;
                    D[2] = t;
                    D[3] = w;
                    D[4] = e;
                    D[5] = r;
                    return D
                }

                function E(a) {
                    return a[0] >= a[3] ? 0 : a[3] - a[0]
                }

                function B(a) {
                    return a[1] >= a[4] ? 0 : a[4] - a[1]
                }

                function M(a) {
                    return a[2] >= a[5] ? 0 : a[5] - a[2]
                }

                function q(a, h) {
                    return Math.max(h[0], a[0]) <=
                        Math.min(h[3], a[3]) && Math.max(h[1], a[1]) <= Math.min(h[4], a[4]) && Math.max(h[2], a[2]) <= Math.min(h[5], a[5])
                }

                function u(a, h) {
                    a[0] = h[0];
                    a[1] = h[1];
                    a[2] = h[2];
                    a[3] = h[3];
                    a[4] = h[4];
                    a[5] = h[5];
                    return a
                }

                function L(a) {
                    return 6 === a.length
                }
                const P = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity],
                    g = [0, 0, 0, 0, 0, 0],
                    p = I();
                c.NEGATIVE_INFINITY = P;
                c.POSITIVE_INFINITY = [-Infinity, -Infinity, -Infinity, Infinity, Infinity, Infinity];
                c.ZERO = g;
                c.allFinite = function(a) {
                    for (let h = 0; 6 > h; h++)
                        if (!isFinite(a[h])) return !1;
                    return !0
                };
                c.center = function(a, h = [0, 0, 0]) {
                    h[0] = a[0] + E(a) / 2;
                    h[1] = a[1] + B(a) / 2;
                    h[2] = a[2] + M(a) / 2;
                    return h
                };
                c.contains = function(a, h) {
                    return h[0] >= a[0] && h[1] >= a[1] && h[2] >= a[2] && h[3] <= a[3] && h[4] <= a[4] && h[5] <= a[5]
                };
                c.containsPoint = function(a, h) {
                    return h[0] >= a[0] && h[1] >= a[1] && h[2] >= a[2] && h[0] <= a[3] && h[1] <= a[4] && h[2] <= a[5]
                };
                c.containsPointWithMargin = function(a, h, t) {
                    return h[0] >= a[0] - t && h[1] >= a[1] - t && h[2] >= a[2] - t && h[0] <= a[3] + t && h[1] <= a[4] + t && h[2] <= a[5] + t
                };
                c.create = I;
                c.depth = B;
                c.diameter = function(a) {
                    const h = E(a),
                        t = M(a);
                    a = B(a);
                    return Math.sqrt(h * h + t * t + a * a)
                };
                c.empty = function(a) {
                    return a ? u(a, P) : I(P)
                };
                c.equals = function(a, h, t) {
                    if (C.isNone(a) || C.isNone(h)) return a === h;
                    if (!L(a) || !L(h)) return !1;
                    if (t)
                        for (let w = 0; w < a.length; w++) {
                            if (!t(a[w], h[w])) return !1
                        } else
                            for (t = 0; t < a.length; t++)
                                if (a[t] !== h[t]) return !1;
                    return !0
                };
                c.expandWithAABB = function(a, h) {
                    a[0] = Math.min(a[0], h[0]);
                    a[1] = Math.min(a[1], h[1]);
                    a[2] = Math.min(a[2], h[2]);
                    a[3] = Math.max(a[3], h[3]);
                    a[4] = Math.max(a[4], h[4]);
                    a[5] = Math.max(a[5], h[5])
                };
                c.expandWithBuffer = function(a,
                    h, t = 0, w = h.length / 3) {
                    let e = a[0],
                        r = a[1],
                        D = a[2],
                        S = a[3],
                        V = a[4],
                        W = a[5];
                    for (let k = 0; k < w; k++) e = Math.min(e, h[t + 3 * k]), r = Math.min(r, h[t + 3 * k + 1]), D = Math.min(D, h[t + 3 * k + 2]), S = Math.max(S, h[t + 3 * k]), V = Math.max(V, h[t + 3 * k + 1]), W = Math.max(W, h[t + 3 * k + 2]);
                    a[0] = e;
                    a[1] = r;
                    a[2] = D;
                    a[3] = S;
                    a[4] = V;
                    a[5] = W
                };
                c.expandWithNestedArray = function(a, h, t) {
                    const w = h.length;
                    let e = a[0],
                        r = a[1],
                        D = a[2],
                        S = a[3],
                        V = a[4],
                        W = a[5];
                    if (t)
                        for (t = 0; t < w; t++) {
                            var k = h[t];
                            e = Math.min(e, k[0]);
                            r = Math.min(r, k[1]);
                            D = Math.min(D, k[2]);
                            S = Math.max(S, k[0]);
                            V = Math.max(V, k[1]);
                            W = Math.max(W, k[2])
                        } else
                            for (t = 0; t < w; t++) k = h[t], e = Math.min(e, k[0]), r = Math.min(r, k[1]), S = Math.max(S, k[0]), V = Math.max(V, k[1]);
                    a[0] = e;
                    a[1] = r;
                    a[2] = D;
                    a[3] = S;
                    a[4] = V;
                    a[5] = W
                };
                c.expandWithOffset = function(a, h, t, w) {
                    a[0] = Math.min(a[0], a[0] + h);
                    a[3] = Math.max(a[3], a[3] + h);
                    a[1] = Math.min(a[1], a[1] + t);
                    a[4] = Math.max(a[4], a[4] + t);
                    a[2] = Math.min(a[2], a[2] + w);
                    a[5] = Math.max(a[5], a[5] + w)
                };
                c.expandWithRect = function(a, h) {
                    a[0] = Math.min(a[0], h[0]);
                    a[1] = Math.min(a[1], h[1]);
                    a[3] = Math.max(a[3], h[2]);
                    a[4] = Math.max(a[4], h[3])
                };
                c.expandWithVec3 =
                    function(a, h) {
                        a[0] = Math.min(a[0], h[0]);
                        a[1] = Math.min(a[1], h[1]);
                        a[2] = Math.min(a[2], h[2]);
                        a[3] = Math.max(a[3], h[0]);
                        a[4] = Math.max(a[4], h[1]);
                        a[5] = Math.max(a[5], h[2])
                    };
                c.fromExtent = function(a, h = I()) {
                    h[0] = a.xmin;
                    h[1] = a.ymin;
                    h[2] = a.zmin;
                    h[3] = a.xmax;
                    h[4] = a.ymax;
                    h[5] = a.zmax;
                    return h
                };
                c.fromMinMax = function(a, h, t = I()) {
                    t[0] = a[0];
                    t[1] = a[1];
                    t[2] = a[2];
                    t[3] = h[0];
                    t[4] = h[1];
                    t[5] = h[2];
                    return t
                };
                c.fromRect = function(a, h) {
                    a[0] = h[0];
                    a[1] = h[1];
                    a[2] = Number.NEGATIVE_INFINITY;
                    a[3] = h[2];
                    a[4] = h[3];
                    a[5] = Number.POSITIVE_INFINITY;
                    return a
                };
                c.fromValues = N;
                c.getMax = function(a, h) {
                    h[0] = a[3];
                    h[1] = a[4];
                    h[2] = a[5];
                    return h
                };
                c.getMin = function(a, h) {
                    h[0] = a[0];
                    h[1] = a[1];
                    h[2] = a[2];
                    return h
                };
                c.height = M;
                c.intersects = q;
                c.intersectsClippingArea = function(a, h) {
                    return C.isNone(h) ? !0 : q(a, h)
                };
                c.is = L;
                c.isPoint = function(a) {
                    return 0 === E(a) && 0 === B(a) && 0 === M(a)
                };
                c.maximumDimension = function(a) {
                    return Math.max(E(a), M(a), B(a))
                };
                c.offset = function(a, h, t, w, e = a) {
                    e[0] = a[0] + h;
                    e[1] = a[1] + t;
                    e[2] = a[2] + w;
                    e[3] = a[3] + h;
                    e[4] = a[4] + t;
                    e[5] = a[5] + w;
                    return e
                };
                c.scale = function(a,
                    h, t = a) {
                    const w = a[0] + E(a) / 2,
                        e = a[1] + B(a) / 2,
                        r = a[2] + M(a) / 2;
                    t[0] = w + (a[0] - w) * h;
                    t[1] = e + (a[1] - e) * h;
                    t[2] = r + (a[2] - r) * h;
                    t[3] = w + (a[3] - w) * h;
                    t[4] = e + (a[4] - e) * h;
                    t[5] = r + (a[5] - r) * h;
                    return t
                };
                c.set = u;
                c.setMax = function(a, h, t = a) {
                    t[3] = h[0];
                    t[4] = h[1];
                    t[5] = h[2];
                    t !== a && (t[0] = a[0], t[1] = a[1], t[2] = a[2]);
                    return a
                };
                c.setMin = function(a, h, t = a) {
                    t[0] = h[0];
                    t[1] = h[1];
                    t[2] = h[2];
                    t !== a && (t[3] = a[3], t[4] = a[4], t[5] = a[5]);
                    return t
                };
                c.size = function(a, h = [0, 0, 0]) {
                    h[0] = E(a);
                    h[1] = B(a);
                    h[2] = M(a);
                    return h
                };
                c.toExtent = function(a, h) {
                    return isFinite(a[2]) ||
                        isFinite(a[5]) ? new y({
                            xmin: a[0],
                            xmax: a[3],
                            ymin: a[1],
                            ymax: a[4],
                            zmin: a[2],
                            zmax: a[5],
                            spatialReference: h
                        }) : new y({
                            xmin: a[0],
                            xmax: a[3],
                            ymin: a[1],
                            ymax: a[4],
                            spatialReference: h
                        })
                };
                c.toRect = function(a, h) {
                    h || (h = F.create());
                    h[0] = a[0];
                    h[1] = a[1];
                    h[2] = a[3];
                    h[3] = a[4];
                    return h
                };
                c.width = E;
                c.wrap = function(a, h, t, w, e, r) {
                    return N(a, h, t, w, e, r, p)
                };
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/geometry/support/quantizationUtils": function() {
            define(["exports", "./jsonUtils"], function(c, C) {
                function y({
                        scale: k,
                        translate: d
                    },
                    l) {
                    return Math.round((l - d[0]) / k[0])
                }

                function F({
                    scale: k,
                    translate: d
                }, l) {
                    return Math.round((d[1] - l) / k[1])
                }

                function I(k, d, l) {
                    const z = [];
                    let K, v, O, T;
                    for (let X = 0; X < l.length; X++) {
                        const aa = l[X];
                        if (0 < X) {
                            if (O = y(k, aa[0]), T = F(k, aa[1]), O !== K || T !== v) z.push(d(aa, O - K, T - v)), K = O, v = T
                        } else K = y(k, aa[0]), v = F(k, aa[1]), z.push(d(aa, K, v))
                    }
                    return 0 < z.length ? z : null
                }

                function N(k, d, l, z) {
                    return I(k, l ? z ? W : V : z ? V : S, d)
                }

                function E(k, d, l, z) {
                    const K = [];
                    l = l ? z ? W : V : z ? V : S;
                    for (z = 0; z < d.length; z++) {
                        const v = I(k, l, d[z]);
                        v && 3 <= v.length && K.push(v)
                    }
                    return K.length ?
                        K : null
                }

                function B(k, d, l, z) {
                    const K = [];
                    l = l ? z ? W : V : z ? V : S;
                    for (z = 0; z < d.length; z++) {
                        const v = I(k, l, d[z]);
                        v && 2 <= v.length && K.push(v)
                    }
                    return K.length ? K : null
                }

                function M({
                    scale: k,
                    translate: d
                }, l) {
                    return l * k[0] + d[0]
                }

                function q({
                    scale: k,
                    translate: d
                }, l) {
                    return d[1] - l * k[1]
                }

                function u(k, d, l) {
                    const z = Array(l.length);
                    if (!l.length) return z;
                    const [K, v] = k.scale;
                    let O = M(k, l[0][0]);
                    k = q(k, l[0][1]);
                    z[0] = d(l[0], O, k);
                    for (let T = 1; T < l.length; T++) {
                        const X = l[T];
                        O += X[0] * K;
                        k -= X[1] * v;
                        z[T] = d(X, O, k)
                    }
                    return z
                }

                function L(k, d, l) {
                    const z =
                        Array(l.length);
                    for (let K = 0; K < l.length; K++) z[K] = u(k, d, l[K]);
                    return z
                }

                function P(k, d, l, z) {
                    return u(k, l ? z ? W : V : z ? V : S, d)
                }

                function g(k, d, l, z) {
                    return L(k, l ? z ? W : V : z ? V : S, d)
                }

                function p(k, d, l, z) {
                    return L(k, l ? z ? W : V : z ? V : S, d)
                }

                function a(k, d, l) {
                    let [z, K] = l[0], v = Math.min(z, d[0]), O = Math.min(K, d[1]), T = Math.max(z, d[2]);
                    d = Math.max(K, d[3]);
                    for (let X = 1; X < l.length; X++) {
                        const [aa, ia] = l[X];
                        z += aa;
                        K += ia;
                        0 > aa && (v = Math.min(v, z));
                        0 < aa && (T = Math.max(T, z));
                        0 > ia ? O = Math.min(O, K) : 0 < ia && (d = Math.max(d, K))
                    }
                    k[0] = v;
                    k[1] = O;
                    k[2] = T;
                    k[3] = d;
                    return k
                }

                function h(k, d) {
                    if (!d.length) return null;
                    k[0] = k[1] = Number.POSITIVE_INFINITY;
                    k[2] = k[3] = Number.NEGATIVE_INFINITY;
                    for (let l = 0; l < d.length; l++) a(k, k, d[l]);
                    return k
                }

                function t(k, d, l, z, K) {
                    d.xmin = y(k, l.xmin);
                    d.ymin = F(k, l.ymin);
                    d.xmax = y(k, l.xmax);
                    d.ymax = F(k, l.ymax);
                    d !== l && (z && (d.zmin = l.zmin, d.zmax = l.zmax), K && (d.mmin = l.mmin, d.mmax = l.mmax));
                    return d
                }

                function w(k, d, l, z, K) {
                    d.points = N(k, l.points, z, K);
                    return d
                }

                function e(k, d, l, z, K) {
                    d.x = y(k, l.x);
                    d.y = F(k, l.y);
                    d !== l && (z && (d.z = l.z), K && (d.m = l.m));
                    return d
                }

                function r(k,
                    d, l, z, K) {
                    k = E(k, l.rings, z, K);
                    if (!k) return null;
                    d.rings = k;
                    return d
                }

                function D(k, d, l, z, K) {
                    k = B(k, l.paths, z, K);
                    if (!k) return null;
                    d.paths = k;
                    return d
                }
                const S = (k, d, l) => [d, l],
                    V = (k, d, l) => [d, l, k[2]],
                    W = (k, d, l) => [d, l, k[2], k[3]];
                c.equals = function(k, d) {
                    if (k === d || null == k && null == d) return !0;
                    if (null == k || null == d) return !1;
                    let l, z, K, v;
                    k && "upperLeft" === k.originPosition ? (l = k.translate[0], z = k.translate[1], k = k.scale[0]) : (l = k.extent.xmin, z = k.extent.ymax, k = k.tolerance);
                    d && "upperLeft" === d.originPosition ? (K = d.translate[0], v = d.translate[1],
                        d = d.scale[0]) : (K = d.extent.xmin, v = d.extent.ymax, d = d.tolerance);
                    return l === K && z === v && k === d
                };
                c.getQuantizedBoundsCoordsArray = a;
                c.getQuantizedBoundsCoordsArrayArray = h;
                c.getQuantizedBoundsPaths = function(k) {
                    return h([0, 0, 0, 0], k)
                };
                c.getQuantizedBoundsPoints = function(k) {
                    const d = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
                    return a(d, d, k)
                };
                c.getQuantizedBoundsRings = function(k) {
                    return h([0, 0, 0, 0], k)
                };
                c.quantizeBounds = function(k, d, l) {
                    d[0] = y(k, l[0]);
                    d[3] =
                        F(k, l[1]);
                    d[2] = y(k, l[2]);
                    d[1] = F(k, l[3]);
                    return d
                };
                c.quantizeExtent = t;
                c.quantizeGeometry = function(k, d) {
                    return k && d ? C.isPoint(d) ? e(k, {}, d, !1, !1) : C.isPolyline(d) ? D(k, {}, d, !1, !1) : C.isPolygon(d) ? r(k, {}, d, !1, !1) : C.isMultipoint(d) ? w(k, {}, d, !1, !1) : C.isExtent(d) ? t(k, {}, d, !1, !1) : null : null
                };
                c.quantizeMultipoint = w;
                c.quantizePaths = B;
                c.quantizePoint = e;
                c.quantizePoints = N;
                c.quantizePolygon = r;
                c.quantizePolyline = D;
                c.quantizeRings = E;
                c.quantizeX = y;
                c.quantizeY = F;
                c.toQuantizationTransform = function(k) {
                    return k ? {
                        originPosition: "upper-left" ===
                            k.originPosition ? "upperLeft" : "lower-left" === k.originPosition ? "lowerLeft" : k.originPosition,
                        scale: k.tolerance ? [k.tolerance, k.tolerance] : [1, 1],
                        translate: k.extent ? [k.extent.xmin, k.extent.ymax] : [0, 0]
                    } : null
                };
                c.unquantizeBounds = function(k, d, l) {
                    return l ? (d[0] = M(k, l[0]), d[1] = q(k, l[3]), d[2] = M(k, l[2]), d[3] = q(k, l[1]), d) : [M(k, d[0]), q(k, d[3]), M(k, d[2]), q(k, d[1])]
                };
                c.unquantizeCoordsArray = u;
                c.unquantizeCoordsArrayArray = L;
                c.unquantizeExtent = function(k, d, l, z, K) {
                    d.xmin = M(k, l.xmin);
                    d.ymin = q(k, l.ymin);
                    d.xmax = M(k, l.xmax);
                    d.ymax = q(k, l.ymax);
                    d !== l && (z && (d.zmin = l.zmin, d.zmax = l.zmax), K && (d.mmin = l.mmin, d.mmax = l.mmax));
                    return d
                };
                c.unquantizeMultipoint = function(k, d, l, z, K) {
                    d.points = P(k, l.points, z, K);
                    return d
                };
                c.unquantizePaths = g;
                c.unquantizePoint = function(k, d, l, z, K) {
                    d.x = M(k, l.x);
                    d.y = q(k, l.y);
                    d !== l && (z && (d.z = l.z), K && (d.m = l.m));
                    return d
                };
                c.unquantizePoints = P;
                c.unquantizePolygon = function(k, d, l, z, K) {
                    d.rings = p(k, l.rings, z, K);
                    return d
                };
                c.unquantizePolyline = function(k, d, l, z, K) {
                    d.paths = g(k, l.paths, z, K);
                    return d
                };
                c.unquantizeRings =
                    p;
                c.unquantizeX = M;
                c.unquantizeY = q;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "esri/layers/graphics/dehydratedFeatureComparison": function() {
            define(["exports", "../../core/has", "../../core/maybe"], function(c, C, y) {
                function F(q, u) {
                    if (q === u) return !0;
                    if (null == q || null == u || q.length !== u.length) return !1;
                    for (let L = 0; L < q.length; L++) {
                        const P = q[L],
                            g = u[L];
                        if (P.length !== g.length) return !1;
                        for (let p = 0; p < P.length; p++)
                            if (P[p] !== g[p]) return !1
                    }
                    return !0
                }

                function I(q, u) {
                    if (q === u) return !0;
                    if (null == q || null == u || q.length !==
                        u.length) return !1;
                    for (let L = 0; L < q.length; L++)
                        if (!F(q[L], u[L])) return !1;
                    return !0
                }

                function N(q, u) {
                    return E(q.spatialReference, u.spatialReference) ? q.x === u.x && q.y === u.y && q.z === u.z && q.m === u.m : !1
                }

                function E(q, u) {
                    return q === u || q && u && q.equals(u)
                }

                function B(q, u) {
                    if (q === u) return !0;
                    if (y.isNone(q) || y.isNone(u) || q.type !== u.type) return !1;
                    switch (q.type) {
                        case "point":
                            return N(q, u);
                        case "extent":
                            return q = q.hasZ !== u.hasZ || q.hasM !== u.hasM ? !1 : E(q.spatialReference, u.spatialReference) ? q.xmin === u.xmin && q.ymin === u.ymin &&
                                q.zmin === u.zmin && q.xmax === u.xmax && q.ymax === u.ymax && q.zmax === u.zmax : !1, q;
                        case "polyline":
                            return q = q.hasZ !== u.hasZ || q.hasM !== u.hasM ? !1 : E(q.spatialReference, u.spatialReference) ? I(q.paths, u.paths) : !1, q;
                        case "polygon":
                            return q = q.hasZ !== u.hasZ || q.hasM !== u.hasM ? !1 : E(q.spatialReference, u.spatialReference) ? I(q.rings, u.rings) : !1, q;
                        case "multipoint":
                            return q = q.hasZ !== u.hasZ || q.hasM !== u.hasM ? !1 : E(q.spatialReference, u.spatialReference) ? F(q.points, u.points) : !1, q;
                        case "mesh":
                            return !1
                    }
                }

                function M(q, u) {
                    if (q === u) return !0;
                    if (!q || !u) return !1;
                    const L = Object.keys(q),
                        P = Object.keys(u);
                    if (L.length !== P.length) return !1;
                    for (const g of L)
                        if (q[g] !== u[g]) return !1;
                    return !0
                }
                c.equals = function(q, u) {
                    return q === u ? !0 : null != q && null != u && q.objectId === u.objectId && B(q.geometry, u.geometry) && M(q.attributes, u.attributes) ? !0 : !1
                };
                c.pointEquals = N;
                Object.defineProperty(c, "__esModule", {
                    value: !0
                })
            })
        },
        "*noref": 1
    }
});
define(["../../../rest/query/operations/pbfQueryUtils", "../../../rest/query/operations/pbfDehydratedFeatureSet"], function(c, C) {
    let y = function() {
        function F() {}
        F.prototype._parseFeatureQuery = function(I) {
            I = c.parsePBFFeatureQuery(I.buffer, new C.DehydratedFeatureSetParserContext(I.options));
            I = { ...I,
                spatialReference: I.spatialReference.toJSON(),
                fields: I.fields ? I.fields.map(N => N.toJSON()) : void 0
            };
            return Promise.resolve(I)
        };
        return F
    }();
    return function() {
        return new y
    }
});