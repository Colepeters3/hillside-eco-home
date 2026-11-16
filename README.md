# Hillside Sanctuary — Interactive Sustainable House

**Live website:** https://colepeters3.github.io/hillside-eco-home/  
**Repository:** https://github.com/Colepeters3/hillside-eco-home

This Three.js project is an interactive 3D concept for an Environmental Science class, based on a reference illustration of a modern, sustainable house built into a wooded hillside.

## Design overview

The building has a **glass-walled, cantilevered upper living floor** and an **earth-sheltered lower floor**. There are two separate ways to reach the house:

- **Upper access:** a winding **driveway across the top of the hillside** approaches from the high ground, crosses a raised section, and connects to the **rear entrance of the upper floor**.
- **Lower access:** a recessed entrance faces the landscape below the house.

The lower landscape features a **meandering river with rocky banks and cascading waterfalls**. This river **replaces the lake/pond** shown in earlier versions. Terraced gardens, trees, and a greenhouse complete the landscape.

## Sustainability systems

- Rooftop photovoltaic **solar panels**
- Planted **green roof**
- **Earth-sheltered construction**, natural daylight, and passive shading
- Conceptual **vertical-axis wind turbine**
- **Rainwater storage** tanks and potential nonpotable reuse
- Potential **greywater recycling**, subject to treatment and local requirements
- **Greenhouse** and terraced food-growing beds
- Wood, stone, and potential lower-impact building materials

These systems illustrate sustainable strategies; the model does not establish that the house is net-zero or fully self-sufficient.

## Explore the model

| Control | Function |
| --- | --- |
| Left-click and drag | Rotate the camera |
| Scroll wheel / pinch | Zoom |
| Right-click and drag | Pan |
| **01 / Exterior** | Overall house and hillside |
| **02 / Water** | River and waterfalls |
| **03 / Roof** | Solar array and living roof |
| **04 / Driveway** | Upper approach road and access |
| **05 / Interior** | Close view of the upper glass living level |
| Feature buttons / '+' markers | Learn about individual sustainability systems |
| Hide roof / Reset view | Adjust roof visibility or restore camera |

## Website files

- `index.html` — site layout, controls, and library import map
- `style.css` — visual design and responsive UI
- `main.js` — Three.js house, hillside, river, driveway, vegetation, lighting, and interaction
- `README.md` — this documentation

Three.js loads from a CDN, so the webpage needs internet access.

## Run on GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Set **Build and deployment** to **Deploy from a branch**.
3. Select `main` and `/(root)`, then save.
4. Open https://colepeters3.github.io/hillside-eco-home/
5. After new changes, allow GitHub Pages to redeploy and hard-refresh using **Ctrl + Shift + R** if needed.

### Optional local testing

From the folder containing `index.html`, run `py -m http.server 8000` on Windows (or `python -m http.server 8000` where available), then visit http://127.0.0.1:8000/. Localhost works only while that server is running.

## Design limitations

This is a **visual concept, not an engineered construction plan**. The driveway grade, vehicle access, retaining walls, bridge support, drainage and slope stability have not been verified. River erosion, setbacks, flood safety, and water quality would require site-specific analysis. Solar output, wind production, battery sizing, water treatment, heating/cooling loads, and embodied carbon also require real calculations.

**Next design goals:** refine the roadway grade and terrain intersection, make water movement more realistic, and incorporate higher-quality architecture, vegetation, and material assets.
