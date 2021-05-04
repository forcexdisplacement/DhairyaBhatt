// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport ../../geometry/support/jsonUtils".split(" "), function(g, e, a, n, h, f, p, k, q, r, t, l, m) {
    a = function(c) {
        function d(b) {
            b = c.call(this, b) || this;
            b.deviationUnit = null;
            b.geometries = null;
            b.maxDeviation = null;
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
    })], a.prototype, "deviationUnit", void 0);
    e.__decorate([f.property({
        json: {
            read: {
                reader: c => c ? c.map(d => m.fromJSON(d)) : null
            },
            write: {
                writer: (c, d) => {
                    d.geometries = c.map(b => b.toJSON())
                }
            }
        }
    })], a.prototype, "geometries", void 0);
    e.__decorate([f.property({
        type: Number,
        json: {
            write: !0
        }
    })], a.prototype, "maxDeviation", void 0);
    a = e.__decorate([k.subclass("esri.tasks.support.GeneralizeParameters")],
        a);
    a.from = h.ensureType(a);
    return a
});