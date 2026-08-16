// ============================================================
// Friedhofkarte - Leaflet Tile Map
// ============================================================

// Größe des ORIGINALBILDES
const MAP_WIDTH = 10000;
const MAP_HEIGHT = 10000;

// Höchste erzeugte Tile-Zoomstufe
const MAX_TILE_ZOOM = 6;

// ------------------------------------------------------------
// Leaflet-Koordinatensystem
// ------------------------------------------------------------

// Bei Leaflet Zoom 6 soll die Originalauflösung gelten.
//
// Deshalb verkleinern wir das Koordinatensystem um 2^6.
// Dadurch passen die erzeugten Tiles exakt zum Leaflet-Grid.

const scale = Math.pow(2, MAX_TILE_ZOOM);

const mapWidth = MAP_WIDTH / scale;
const mapHeight = MAP_HEIGHT / scale;

const bounds = [
    [0, 0],
    [mapHeight, mapWidth]
];

// ------------------------------------------------------------
// Karte erzeugen
// ------------------------------------------------------------

const map = L.map("map", {
    crs: L.CRS.Simple,

    minZoom: 0,
    maxZoom: MAX_TILE_ZOOM,

    zoomSnap: 1,
    zoomDelta: 1,

    zoomControl: true,

    maxBounds: bounds,
    maxBoundsViscosity: 1.0,

    attributionControl: false
});

// ------------------------------------------------------------
// Tile-Layer
// ------------------------------------------------------------

L.tileLayer("tiles/{z}/{x}/{y}.jpg", {
    tileSize: 256,

    minZoom: 0,
    maxZoom: MAX_TILE_ZOOM,

    noWrap: true,

    keepBuffer: 2
}).addTo(map);

// ------------------------------------------------------------
// Karte beim Start komplett anzeigen
// ------------------------------------------------------------

map.fitBounds(bounds);
