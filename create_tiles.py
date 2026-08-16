#!/usr/bin/env python3
"""
create_tiles.py
Create Leaflet-compatible image tiles from a large map image.

Usage:
    python create_tiles.py meine_karte.png

The generated "tiles" folder can be copied directly into the GitHub
repository next to index.html.
"""

import math
import sys
from pathlib import Path
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

TILE_SIZE = 256
OUTPUT_FORMAT = "JPEG"
JPEG_QUALITY = 92


def make_zoom_image(img, zoom_dir):
    """Create tiles for one zoom level."""
    width, height = img.size
    cols = math.ceil(width / TILE_SIZE)
    rows = math.ceil(height / TILE_SIZE)

    for y in range(rows):
        for x in range(cols):
            left = x * TILE_SIZE
            upper = y * TILE_SIZE
            right = min(left + TILE_SIZE, width)
            lower = min(upper + TILE_SIZE, height)

            tile = img.crop((left, upper, right, lower))

            # Keep edge tiles at 256x256. Transparent/empty space is black.
            if tile.size != (TILE_SIZE, TILE_SIZE):
                padded = Image.new("RGB", (TILE_SIZE, TILE_SIZE), (0, 0, 0))
                padded.paste(tile.convert("RGB"), (0, 0))
                tile = padded
            else:
                tile = tile.convert("RGB")

            out_dir = zoom_dir / str(x)
            out_dir.mkdir(parents=True, exist_ok=True)
            tile.save(
                out_dir / f"{y}.jpg",
                format=OUTPUT_FORMAT,
                quality=JPEG_QUALITY,
                optimize=True
            )

    print(f"  Zoom {zoom_dir.name}: {cols} x {rows} = {cols * rows} Tiles")


def create_tiles(source):
    source = Path(source)

    if not source.exists():
        raise FileNotFoundError(f"Datei nicht gefunden: {source}")

    print(f"Lade: {source}")
    img = Image.open(source)
    img.load()

    original_width, original_height = img.size
    print(f"Originalgröße: {original_width} x {original_height}")

    output = source.parent / "tiles"
    if output.exists():
        print(f"Lösche vorhandenen Tile-Ordner: {output}")
        import shutil
        shutil.rmtree(output)
    output.mkdir()

    # Zoom 0 = stärkste Verkleinerung, letzter Zoom = Originalauflösung.
    # Dadurch ist die gesamte Karte bereits auf niedrigen Zoomstufen sichtbar.
    max_dimension = max(original_width, original_height)
    max_zoom = max(0, math.ceil(math.log2(max_dimension / TILE_SIZE)))

    print(f"Erzeuge Zoomstufen 0 bis {max_zoom} ...")

    for zoom in range(max_zoom + 1):
        scale = 2 ** (max_zoom - zoom)

        target_width = max(1, math.ceil(original_width / scale))
        target_height = max(1, math.ceil(original_height / scale))

        if (target_width, target_height) == img.size:
            zoom_img = img
        else:
            zoom_img = img.resize(
                (target_width, target_height),
                Image.Resampling.LANCZOS
            )

        make_zoom_image(zoom_img, output / str(zoom))

        if zoom_img is not img:
            zoom_img.close()

    # Kleine Info-Datei für die Webseite / spätere Erweiterungen.
    info = output / "map-info.txt"
    info.write_text(
        f"width={original_width}\n"
        f"height={original_height}\n"
        f"tile_size={TILE_SIZE}\n"
        f"max_zoom={max_zoom}\n",
        encoding="utf-8"
    )

    print("\nFertig!")
    print(f"Tiles befinden sich in: {output}")
    print("Diesen Ordner komplett in dein GitHub-Repository kopieren.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Verwendung: python create_tiles.py meine_karte.png")
        sys.exit(1)

    create_tiles(sys.argv[1])
