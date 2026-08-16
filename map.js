// ============================================================
// Great Chaparell Cemetery
// Leaflet Image Tile Map
// ============================================================

const MAP_WIDTH = 10000;
const MAP_HEIGHT = 10000;

const TILE_SIZE = 256;
const MAX_ZOOM = 6;


// ------------------------------------------------------------
// Eigenes Koordinatensystem
// ------------------------------------------------------------

// Bei Zoom 6 entspricht ein Kartenpunkt einem Originalpixel.
// Bei Zoom 5 entspricht ein Kartenpunkt zwei Originalpixeln usw.

const CemeteryCRS = L.extend({}, L.CRS.Simple, {

    transformation: new L.Transformation(
        1,
        0,
        1,
        0
    ),

    scale: function (zoom) {
        return Math.pow(2, zoom);
    },

    zoom: function (scale) {
        return Math.log(scale) / Math.LN2;
    }
});


// ------------------------------------------------------------
// Größe der Karte auf Zoom 0
// ------------------------------------------------------------

const scale = Math.pow(2, MAX_ZOOM);

const mapWidth = MAP_WIDTH / scale;
const mapHeight = MAP_HEIGHT / scale;


// ------------------------------------------------------------
// Karten-Grenzen
// ------------------------------------------------------------

const bounds = [
    [0, 0],
    [mapHeight, mapWidth]
];


// ------------------------------------------------------------
// Leaflet Karte
// ------------------------------------------------------------

const map = L.map("map", {

    crs: CemeteryCRS,

    minZoom: 0,
    maxZoom: MAX_ZOOM,

    zoomControl: true,

    attributionControl: false,

    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});


// ------------------------------------------------------------
// Tile Layer
// ------------------------------------------------------------

L.tileLayer("tiles/{z}/{x}/{y}.jpg", {

    tileSize: TILE_SIZE,

    minZoom: 0,
    maxZoom: MAX_ZOOM,

    noWrap: true,

    keepBuffer: 2

}).addTo(map);


// ------------------------------------------------------------
// Startansicht
// ------------------------------------------------------------

map.fitBounds(bounds);
