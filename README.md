# Hillside Eco Home — Interactive 3D Model

A Three.js model of a two-story earth-sheltered sustainable house with a lower-level entrance, solar panels, green roof, rainwater harvesting, cistern and pond.

## View locally

Because this project uses JavaScript modules, run a local server in this directory:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. Internet access is needed for the Three.js CDN.

## Publish using GitHub Pages

1. Create a new **public** GitHub repository (for example `hillside-eco-home`).
2. Upload `index.html`, `main.js`, and `style.css` to the **root** of the repository (README is optional).
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, select **Deploy from a branch**; select `main` and `/(root)`, then **Save**.
5. Wait for the deployment and visit `https://YOUR-USERNAME.github.io/hillside-eco-home/` (replace YOUR-USERNAME).

## Controls

- Drag to rotate
- Scroll or pinch to zoom
- Click numbered markers or feature buttons for explanations
- Hide roof, hide markers, or reset the camera

## Notes

This is an illustrative concept model, not a scaled architectural drawing. Pond water is not potable by default, rainwater is seasonal, and any water reuse needs appropriate treatment and compliance with local rules. Solar sizing, structural loads, water balance, drainage, and energy performance would require engineering calculations.
