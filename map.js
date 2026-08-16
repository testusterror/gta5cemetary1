// Größe der Originalkarte.
// Diese Werte werden später vom Tile-Generator automatisch aus
// deiner Originaldatei ermittelt.
const MAP_WIDTH = 10000;
const MAP_HEIGHT = 10000;

// Anzahl der Zoomstufen.
// Für 10.000 x 10.000 mit 256px Tiles: 0 bis 6.
const MAX_ZOOM = 6;

// Leaflet CRS.Simple behandelt die Karte als normales Bild,
// nicht als geografische Weltkarte.
const bounds = [
    [0, 0],
    [MAP_HEIGHT, MAP_WIDTH]
];

const map = L.map("map", {
    crs: L.CRS.Simple,

    minZoom: 0,
    maxZoom: MAX_ZOOM,

    zoomSnap: 1,
    zoomDelta: 1,

    zoomControl: true,

    maxBounds: bounds,
    maxBoundsViscosity: 1.0,

    attributionControl: false
});

// TileLayer.
// x = Spalte, y = Zeile, z = Zoomstufe.
L.tileLayer("tiles/{z}/{x}/{y}.jpg", {
    tileSize: 256,
    minZoom: 0,
    maxZoom: MAX_ZOOM,

    noWrap: true,

    // Schwarzer Hintergrund für Bereiche außerhalb
    // bzw. für die gepaddeten Rand-Tiles.
    errorTileUrl: ""
}).addTo(map);

// Beim Start die komplette Karte anzeigen.
map.fitBounds(bounds);
