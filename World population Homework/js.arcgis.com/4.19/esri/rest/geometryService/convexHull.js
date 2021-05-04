// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
define(["exports", "../../geometry/support/jsonUtils", "../../request", "../utils", "./utils"], function(d, g, h, e, k) {
    d.convexHull = async function(a, b, c) {
        const f = b[0].spatialReference;
        a = e.parseUrl(a);
        b = { ...a.query,
            f: "json",
            sr: JSON.stringify(f.toJSON()),
            geometries: JSON.stringify(k.encodeGeometries(b))
        };
        c = e.asValidOptions(b, c);
        return h(a.path + "/convexHull", c).then(({
            data: l
        }) => g.fromJSON(l.geometry).set({
            spatialReference: f
        }))
    };
    Object.defineProperty(d, "__esModule", {
        value: !0
    })
});