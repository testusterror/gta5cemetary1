# Leaflet Image Map

1. Install Pillow:
   `python -m pip install Pillow`

2. Put your original large map image next to `create_tiles.py`.

3. Run:
   `python create_tiles.py meine_karte.png`

4. Copy the generated `tiles` folder into the GitHub repository.

5. Update MAP_WIDTH, MAP_HEIGHT and MAX_ZOOM in `map.js` to the values printed by the generator.
