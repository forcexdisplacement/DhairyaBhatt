// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
define("../../chunks/_rollupPluginBabelHelpers ../../chunks/tslib.es6 ../../core/has ../../core/Logger ../../core/accessorSupport/ensureType ../../core/accessorSupport/decorators/property ../../core/jsonMap ../../core/accessorSupport/decorators/subclass ../../core/urlUtils ../../core/uuid ../../portal/support/resourceExtension ../../core/JSONSupport ../../geometry/Polyline ../../geometry/support/jsonUtils ../../geometry".split(" "), function(h, e, b, p, k, f, q, l, r, t, u, m, n, g, v) {
    b = function(a) {
        function c(d) {
            d =
                a.call(this, d) || this;
            d.extendHow = "default-curve-extension";
            d.polylines = null;
            d.trimExtendTo = null;
            return d
        }
        h._inheritsLoose(c, a);
        return c
    }(m.JSONSupport);
    e.__decorate([f.property({
        type: String,
        json: {
            write: !0
        }
    })], b.prototype, "extendHow", void 0);
    e.__decorate([f.property({
        type: [n],
        json: {
            read: {
                reader: a => a ? a.map(c => g.fromJSON(c)) : null
            },
            write: {
                writer: (a, c) => {
                    c.polylines = a.map(d => d.toJSON())
                }
            }
        }
    })], b.prototype, "polylines", void 0);
    e.__decorate([f.property({
        json: {
            read: {
                reader: a => a ? g.fromJSON(a) : null
            },
            write: {
                writer: (a,
                    c) => {
                    c.trimExtendTo = a.toJSON()
                }
            }
        }
    })], b.prototype, "trimExtendTo", void 0);
    b = e.__decorate([l.subclass("esri.tasks.support.TrimExtendParameters")], b);
    b.from = k.ensureType(b);
    return b
});