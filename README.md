# 🪐 Interactive 3D Solar System

## Live Demo

View the deployed project:

https://atharavtayade.github.io/solar-system/

An interactive 3D solar-system visualization built with Three.js. Explore the Sun and the eight planets, inspect real-world planetary data, and control the simulation speed, orbit paths, camera view, and fullscreen mode.

## Project overview

This project is a self-contained browser-based solar-system simulator. The scene uses a compressed visual scale so the entire system fits comfortably on screen, while the information panel presents real orbital and physical values for each planet.

The app is built as a static website with no build step required.

## Project Structure

```text
solar-system/
├── index.html
├── style.css
└── script.js
```

## Features

- Interactive 3D solar-system scene with the Sun, planets, and starfield
- Click-to-focus camera transitions for each planet
- Searchable planet list with live filtering
- Hover tooltips and in-scene labels
- Planet info panels with diameter, mass, distance from the Sun, moons, day length, year length, and facts
- Adjustable simulation speed, pause/resume, orbit visibility toggle, camera reset, and fullscreen mode
- Procedural planet textures and Saturn ring visualization
- Responsive layout for desktop and mobile
- Accessibility-minded controls and reduced-motion support

## Technologies

- HTML5
- CSS3
- JavaScript ES Modules
- Three.js 0.160.0
- OrbitControls
- Canvas API
- WebGL
- GitHub Pages

## Installation

No build step is required.

1. Clone the repository:

   ```bash
   git clone https://github.com/atharavtayade/solar-system.git
   ```

2. Open the project folder:

   ```bash
   cd solar-system
   ```

3. Open `index.html` directly in a browser, or serve it locally:

   ```bash
   python -m http.server 5173
   ```

4. Visit:

   ```text
   http://localhost:5173
   ```

If your browser blocks module loading from the file system, use the local server option above.

## Controls

| Action | Control |
| --- | --- |
| Rotate camera | Left mouse drag |
| Pan camera | Right mouse drag |
| Zoom | Mouse wheel |
| Focus on a planet | Click a planet in the scene or select it from the list |
| Inspect a planet | Drag a planet, then release |
| Pause/resume simulation | Pause / Resume button |
| Change speed | Speed slider |
| Toggle orbit paths | Orbits On / Orbits Off button |
| Reset camera | Reset Camera button |
| Enter fullscreen | Fullscreen button |
| Search planets | Search box in the sidebar |

## Screenshots

Screenshots are not currently included in the repository. Suggested captures for future releases:

- Overview of the full solar-system scene
- Focused planet view with the information panel open
- Fullscreen or mobile layout view

## Author

Atharav Tayade

* B.Tech AI & Data Science
* Ajeenkya DY Patil University
* GitHub: https://github.com/atharavtayade
