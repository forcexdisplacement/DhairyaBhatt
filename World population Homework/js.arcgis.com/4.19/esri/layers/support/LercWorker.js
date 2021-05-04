// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.19/esri/copyright.txt for details.
//>>built
require({
    cache: {
        "esri/chunks/LercCodec": function() {
            define(["exports"], function(V) {
                function M(n) {
                    N[0] = n;
                    return N[0]
                }
                const N = new Float32Array(1),
                    w = M(3.4028234663852886E38);
                var da = M(Math.max(-w, Math.min(-Infinity, w)));
                V.decode = function(n, l) {
                    l = l || {};
                    var f = l.inputOffset || 0;
                    var k = l.encodedMaskData || null === l.encodedMaskData;
                    var x = new Uint8Array(n, f, 10);
                    x = String.fromCharCode.apply(null, x);
                    if ("CntZImage" != x.trim()) throw "Unexpected file identifier string: " + x;
                    f += 10;
                    var a = new DataView(n, f, 24);
                    var O = a.getInt32(0, !0);
                    var P = a.getInt32(4, !0);
                    var A = a.getUint32(8, !0);
                    var t = a.getUint32(12, !0);
                    var X = a.getFloat64(16, !0);
                    f += 24;
                    if (!k) {
                        a = new DataView(n, f, 16);
                        var c = {};
                        c.numBlocksY = a.getUint32(0, !0);
                        c.numBlocksX = a.getUint32(4, !0);
                        c.numBytes = a.getUint32(8, !0);
                        c.maxValue = a.getFloat32(12, !0);
                        f += 16;
                        if (0 < c.numBytes) {
                            k = new Uint8Array(Math.ceil(t * A / 8));
                            a = new DataView(n, f, c.numBytes);
                            var p = a.getInt16(0, !0);
                            var u = 2;
                            var E = 0;
                            do {
                                if (0 < p)
                                    for (; p--;) k[E++] = a.getUint8(u++);
                                else {
                                    var H = a.getUint8(u++);
                                    for (p = -p; p--;) k[E++] = H
                                }
                                p = a.getInt16(u, !0);
                                u += 2
                            } while (u < c.numBytes);
                            if (-32768 !== p || E < k.length) throw "Unexpected end of mask RLE encoding";
                            c.bitset = k;
                            f += c.numBytes
                        } else 0 === (c.numBytes | c.numBlocksY | c.maxValue) && (k = new Uint8Array(Math.ceil(t * A / 8)), c.bitset = k)
                    }
                    a = new DataView(n, f, 16);
                    var D = k = H = E = u = p = void 0;
                    p = a.getUint32(0, !0);
                    u = a.getUint32(4, !0);
                    E = a.getUint32(8, !0);
                    H = a.getFloat32(12, !0);
                    f += 16;
                    D = u;
                    k = p;
                    D += 0 < t % D ? 1 : 0;
                    var B = k + (0 < A % k ? 1 : 0);
                    k = Array(D * B);
                    for (var y = 1E9, I = 0, F = 0; F < B; F++)
                        for (var J = 0; J < D; J++) {
                            var e = 0;
                            a = new DataView(n, f, Math.min(10, n.byteLength -
                                f));
                            var d = {};
                            k[I++] = d;
                            var b = a.getUint8(0);
                            e++;
                            d.encoding = b & 63;
                            if (3 < d.encoding) throw "Invalid block encoding (" + d.encoding + ")";
                            if (2 === d.encoding) f++, y = Math.min(y, 0);
                            else {
                                if (0 !== b && 2 !== b) {
                                    b >>= 6;
                                    d.offsetType = b;
                                    if (2 === b) d.offset = a.getInt8(1), e++;
                                    else if (1 === b) d.offset = a.getInt16(1, !0), e += 2;
                                    else if (0 === b) d.offset = a.getFloat32(1, !0), e += 4;
                                    else throw "Invalid block offset type";
                                    y = Math.min(d.offset, y);
                                    if (1 === d.encoding)
                                        if (b = a.getUint8(e), e++, d.bitsPerPixel = b & 63, b >>= 6, d.numValidPixelsType = b, 2 === b) d.numValidPixels =
                                            a.getUint8(e), e++;
                                        else if (1 === b) d.numValidPixels = a.getUint16(e, !0), e += 2;
                                    else if (0 === b) d.numValidPixels = a.getUint32(e, !0), e += 4;
                                    else throw "Invalid valid pixel count type";
                                }
                                f += e;
                                if (3 != d.encoding)
                                    if (0 === d.encoding) {
                                        a = (E - 1) / 4;
                                        if (a !== Math.floor(a)) throw "uncompressed block has invalid length";
                                        e = new ArrayBuffer(4 * a);
                                        b = new Uint8Array(e);
                                        b.set(new Uint8Array(n, f, 4 * a));
                                        e = new Float32Array(e);
                                        for (b = 0; b < e.length; b++) y = Math.min(y, e[b]);
                                        d.rawData = e;
                                        f += 4 * a
                                    } else 1 === d.encoding && (a = Math.ceil(d.numValidPixels * d.bitsPerPixel /
                                        8), e = new ArrayBuffer(4 * Math.ceil(a / 4)), b = new Uint8Array(e), b.set(new Uint8Array(n, f, a)), d.stuffedData = new Uint32Array(e), f += a)
                            }
                        }
                    D = y;
                    n = f;
                    f = null != l.noDataValue ? M(Math.max(-w, Math.min(l.noDataValue, w))) : da;
                    B = l.encodedMaskData;
                    b = l.returnMask;
                    y = 0;
                    I = u;
                    F = p;
                    J = Math.floor(t / I);
                    d = Math.floor(A / F);
                    e = 2 * X;
                    B = B || (c ? c.bitset : null);
                    var r;
                    a = new(l.pixelType || Float32Array)(t * A);
                    b && B && (r = new Uint8Array(t * A));
                    b = new Float32Array(J * d);
                    for (var m, g, Q = 0; Q <= F; Q++) {
                        var R = Q !== F ? d : A % F;
                        if (0 !== R)
                            for (var S = 0; S <= I; S++) {
                                var G = S !== I ?
                                    J : t % I;
                                if (0 !== G) {
                                    var h = Q * t * d + S * J,
                                        T = t - G,
                                        q = k[y],
                                        z;
                                    if (2 > q.encoding) {
                                        if (0 === q.encoding) var C = q.rawData;
                                        else {
                                            m = z = C = void 0;
                                            g = q.stuffedData;
                                            var K = q.bitsPerPixel,
                                                Y = q.numValidPixels,
                                                Z = q.offset,
                                                aa = e,
                                                ea = b,
                                                ba = H,
                                                W = (1 << K) - 1,
                                                ca = 0,
                                                v = 0,
                                                fa = Math.ceil((ba - Z) / aa);
                                            g[g.length - 1] <<= 8 * (4 * g.length - Math.ceil(K * Y / 8));
                                            for (m = 0; m < Y; m++) 0 === v && (C = g[ca++], v = 32), v >= K ? (z = C >>> v - K & W, v -= K) : (v = K - v, z = (C & W) << v & W, C = g[ca++], v = 32 - v, z += C >>> v), ea[m] = z < fa ? Z + z * aa : ba;
                                            C = b
                                        }
                                        z = 0
                                    } else var L = 2 === q.encoding ? 0 : q.offset;
                                    if (B)
                                        for (g = 0; g < R; g++) {
                                            if (h & 7) {
                                                var U =
                                                    B[h >> 3];
                                                U <<= h & 7
                                            }
                                            for (m = 0; m < G; m++) h & 7 || (U = B[h >> 3]), U & 128 ? (r && (r[h] = 1), a[h++] = 2 > q.encoding ? C[z++] : L) : (r && (r[h] = 0), a[h++] = f), U <<= 1;
                                            h += T
                                        } else if (2 > q.encoding)
                                            for (g = 0; g < R; g++) {
                                                for (m = 0; m < G; m++) a[h++] = C[z++];
                                                h += T
                                            } else
                                                for (g = 0; g < R; g++)
                                                    if (a.fill) a.fill(L, h, h + G), h += G + T;
                                                    else {
                                                        for (m = 0; m < G; m++) a[h++] = L;
                                                        h += T
                                                    }
                                    if (1 === q.encoding && z !== q.numValidPixels) throw "Block and Mask do not match";
                                    y++
                                }
                            }
                    }
                    L = r;
                    r = {
                        width: t,
                        height: A,
                        pixelData: a,
                        minValue: D,
                        maxValue: H,
                        noDataValue: f
                    };
                    L && (r.maskData = L);
                    l.returnEncodedMask && c && (r.encodedMaskData =
                        c.bitset ? c.bitset : null);
                    if (l.returnFileInfo && (r.fileInfo = {
                            fileIdentifierString: x,
                            fileVersion: O,
                            imageType: P,
                            height: A,
                            width: t,
                            maxZError: X,
                            eofOffset: n,
                            mask: c ? {
                                numBlocksX: c.numBlocksX,
                                numBlocksY: c.numBlocksY,
                                numBytes: c.numBytes,
                                maxValue: c.maxValue
                            } : null,
                            pixels: {
                                numBlocksX: u,
                                numBlocksY: p,
                                numBytes: E,
                                maxValue: H,
                                minValue: D,
                                noDataValue: f
                            }
                        }, l.computeUsedBitDepths)) {
                        l = r.fileInfo;
                        c = u * p;
                        x = {};
                        for (O = 0; O < c; O++) P = k[O], 0 === P.encoding ? x.float32 = !0 : 1 === P.encoding ? x[P.bitsPerPixel] = !0 : x[0] = !0;
                        c = Object.keys(x);
                        l.bitDepths =
                            c
                    }
                    return r
                }
            })
        },
        "*noref": 1
    }
});
define(["../../chunks/LercCodec"], function(V) {
    let M = function() {
        function N() {}
        N.prototype._decode = function(w) {
            w = V.decode(w.buffer, w.options);
            return Promise.resolve({
                result: w,
                transferList: [w.pixelData.buffer]
            })
        };
        return N
    }();
    return function() {
        return new M
    }
});