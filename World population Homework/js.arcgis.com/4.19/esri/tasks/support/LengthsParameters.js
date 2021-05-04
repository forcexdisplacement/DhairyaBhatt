// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport ../../geometry/Polyline ../../geometry/support/jsonUtils ../../geometry".split(" "), function(g, e, a, p, h, f, q, k, r, t, u, l, m, n, v) {
    a = function(c) {
        function d(b) {
            b =
                c.call(this, b) || this;
            b.calculationType = null;
            b.geodesic = null;
            b.lengthUnit = null;
            b.polylines = null;
            return b
        }
        g._inheritsLoose(d, c);
        return d
    }(l.JSONSupport);
    e.__decorate([f.property({
        type: String,
        json: {
            write: !0
        }
    })], a.prototype, "calculationType", void 0);
    e.__decorate([f.property({
        type: Boolean,
        json: {
            write: !0
        }
    })], a.prototype, "geodesic", void 0);
    e.__decorate([f.property({
        json: {
            write: !0
        }
    })], a.prototype, "lengthUnit", void 0);
    e.__decorate([f.property({
        type: [m],
        json: {
            read: {
                reader: c => c ? c.map(d => n.fromJSON(d)) : null
            },
            write: {
                writer: (c, d) => {
                    d.polylines = c.map(b => b.toJSON())
                }
            }
        }
    })], a.prototype, "polylines", void 0);
    a = e.__decorate([k.subclass("esri.tasks.support.LengthsParameters")], a);
    a.from = h.ensureType(a);
    return a
});