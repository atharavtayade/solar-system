import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Interactive 3D Solar System
 * ----------------------------
 * The visual scale is intentionally compressed so every planet can be seen in one scene.
 * Orbital periods, rotations, diameters, masses, and distances in the info panel use real values.
 */

const canvas = document.querySelector('#scene');
const labelLayer = document.querySelector('#labelLayer');
const tooltip = document.querySelector('#tooltip');
const pauseBtn = document.querySelector('#pauseBtn');
const speedSlider = document.querySelector('#speedSlider');
const speedValue = document.querySelector('#speedValue');
const orbitToggle = document.querySelector('#orbitToggle');
const resetCameraBtn = document.querySelector('#resetCameraBtn');
const fullscreenBtn = document.querySelector('#fullscreenBtn');
const searchBox = document.querySelector('#searchBox');
const planetList = document.querySelector('#planetList');
const infoPanel = document.querySelector('#infoPanel');

const TWO_PI = Math.PI * 2;
const EARTH_YEAR_SECONDS = 12; // One Earth year per 12 seconds at speed 1x, for readable motion.
const DEFAULT_CAMERA = new THREE.Vector3(0, 115, 230);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

const planetData = [
  {
    key: 'mercury',
    name: 'Mercury',
    tagline: 'Smallest planet',
    color: '#b9b2a6',
    secondaryColor: '#6f6a63',
    radius: 0.38,
    orbitRadius: 18,
    period: 0.2408467,
    startAngle: 0.4,
    rotationPeriodDays: 58.646,
    axialTilt: 0.03,
    spinDirection: 1,
    inclination: THREE.MathUtils.degToRad(7.0),
    diameter: '4,879 km',
    mass: '3.30 × 10²³ kg',
    distance: '57.9 million km',
    moons: '0',
    day: '58.6 Earth days',
    year: '88 Earth days',
    facts: [
      'Mercury has almost no atmosphere, so temperatures swing from scorching days to freezing nights.',
      'Despite being closest to the Sun, it is not the hottest planet.',
      'Its surface is heavily cratered and resembles Earth\'s Moon.'
    ]
  },
  {
    key: 'venus',
    name: 'Venus',
    tagline: 'Hottest planet',
    color: '#e7c07b',
    secondaryColor: '#b7793b',
    radius: 0.95,
    orbitRadius: 28,
    period: 0.6152,
    startAngle: 2.2,
    rotationPeriodDays: 243.025,
    axialTilt: THREE.MathUtils.degToRad(177.4),
    spinDirection: -1,
    inclination: THREE.MathUtils.degToRad(3.4),
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    distance: '108.2 million km',
    moons: '0',
    day: '243 Earth days, retrograde',
    year: '224.7 Earth days',
    facts: [
      'Venus has a dense carbon dioxide atmosphere with clouds of sulfuric acid.',
      'Its runaway greenhouse effect makes its surface hotter than Mercury\'s.',
      'Venus rotates backward compared with most planets.'
    ]
  },
  {
    key: 'earth',
    name: 'Earth',
    tagline: 'Our living world',
    color: '#3b82f6',
    secondaryColor: '#22c55e',
    radius: 1,
    orbitRadius: 40,
    period: 1,
    startAngle: 4.1,
    rotationPeriodDays: 0.997,
    axialTilt: THREE.MathUtils.degToRad(23.4),
    spinDirection: 1,
    inclination: 0,
    diameter: '12,742 km',
    mass: '5.97 × 10²⁴ kg',
    distance: '149.6 million km',
    moons: '1',
    day: '23h 56m',
    year: '365.25 Earth days',
    facts: [
      'Earth is the only known world with liquid surface water and life.',
      'Its magnetic field helps shield the atmosphere from solar wind.',
      'About 71% of the surface is covered by oceans.'
    ]
  },
  {
    key: 'mars',
    name: 'Mars',
    tagline: 'The Red Planet',
    color: '#d66b45',
    secondaryColor: '#7c2d12',
    radius: 0.53,
    orbitRadius: 54,
    period: 1.8808,
    startAngle: 5.4,
    rotationPeriodDays: 1.026,
    axialTilt: THREE.MathUtils.degToRad(25.2),
    spinDirection: 1,
    inclination: THREE.MathUtils.degToRad(1.85),
    diameter: '6,779 km',
    mass: '6.42 × 10²³ kg',
    distance: '227.9 million km',
    moons: '2',
    day: '24h 37m',
    year: '687 Earth days',
    facts: [
      'Mars hosts Olympus Mons, the largest volcano known in the Solar System.',
      'Its thin atmosphere is mostly carbon dioxide.',
      'Ancient river valleys show that liquid water once flowed on the surface.'
    ]
  },
  {
    key: 'jupiter',
    name: 'Jupiter',
    tagline: 'Largest planet',
    color: '#d8b384',
    secondaryColor: '#9a6a3a',
    radius: 3.2,
    orbitRadius: 82,
    period: 11.862,
    startAngle: 1.2,
    rotationPeriodDays: 0.4135,
    axialTilt: THREE.MathUtils.degToRad(3.1),
    spinDirection: 1,
    inclination: THREE.MathUtils.degToRad(1.3),
    diameter: '139,820 km',
    mass: '1.90 × 10²⁷ kg',
    distance: '778.5 million km',
    moons: '95 confirmed',
    day: '9h 56m',
    year: '11.86 Earth years',
    facts: [
      'Jupiter is a gas giant more massive than all other planets combined.',
      'The Great Red Spot is a storm larger than Earth.',
      'Its strong gravity influences asteroids, comets, and the rest of the Solar System.'
    ]
  },
  {
    key: 'saturn',
    name: 'Saturn',
    tagline: 'Ringed giant',
    color: '#e7d39a',
    secondaryColor: '#b99b5f',
    radius: 2.7,
    orbitRadius: 112,
    period: 29.457,
    startAngle: 3.0,
    rotationPeriodDays: 0.444,
    axialTilt: THREE.MathUtils.degToRad(26.7),
    spinDirection: 1,
    inclination: THREE.MathUtils.degToRad(2.49),
    diameter: '116,460 km',
    mass: '5.68 × 10²⁶ kg',
    distance: '1.434 billion km',
    moons: '146 confirmed',
    day: '10h 33m',
    year: '29.45 Earth years',
    facts: [
      'Saturn\'s bright rings are made of countless pieces of ice and rock.',
      'It is the least dense planet and would float in water if a large enough ocean existed.',
      'Titan, its largest moon, has a thick atmosphere and liquid methane lakes.'
    ],
    rings: {
      inner: 3.35,
      outer: 5.05,
      color: '#d8c28d',
      tilt: THREE.MathUtils.degToRad(8)
    }
  },
  {
    key: 'uranus',
    name: 'Uranus',
    tagline: 'Ice giant on its side',
    color: '#7dd3fc',
    secondaryColor: '#38bdf8',
    radius: 1.7,
    orbitRadius: 142,
    period: 84.017,
    startAngle: 0.9,
    rotationPeriodDays: 0.718,
    axialTilt: THREE.MathUtils.degToRad(97.8),
    spinDirection: -1,
    inclination: THREE.MathUtils.degToRad(0.77),
    diameter: '50,724 km',
    mass: '8.68 × 10²⁵ kg',
    distance: '2.871 billion km',
    moons: '28 confirmed',
    day: '17h 14m, retrograde',
    year: '84 Earth years',
    facts: [
      'Uranus rotates on its side, likely because of a giant ancient impact.',
      'Methane in its atmosphere gives the planet its blue-green color.',
      'It has faint rings and a cold upper atmosphere.'
    ]
  },
  {
    key: 'neptune',
    name: 'Neptune',
    tagline: 'Windy outer world',
    color: '#2563eb',
    secondaryColor: '#1d4ed8',
    radius: 1.65,
    orbitRadius: 170,
    period: 164.8,
    startAngle: 4.8,
    rotationPeriodDays: 0.671,
    axialTilt: THREE.MathUtils.degToRad(28.3),
    spinDirection: 1,
    inclination: THREE.MathUtils.degToRad(1.77),
    diameter: '49,244 km',
    mass: '1.02 × 10²⁶ kg',
    distance: '4.495 billion km',
    moons: '16 confirmed',
    day: '16h 6m',
    year: '164.8 Earth years',
    facts: [
      'Neptune has some of the fastest winds measured on any planet.',
      'It was the first planet located through mathematical prediction.',
      'Its largest moon, Triton, orbits backward and is geologically active.'
    ]
  }
];

const planetByKey = new Map(planetData.map((data) => [data.key, data]));

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020617, 0.0016);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.copy(DEFAULT_CAMERA);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.55;
controls.panSpeed = 0.65;
controls.zoomSpeed = 0.9;
controls.minDistance = 18;
controls.maxDistance = 760;
controls.target.copy(DEFAULT_TARGET);
controls.screenSpacePanning = true;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};
controls.update();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const dragPoint = new THREE.Vector3();
const dragOffset = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const labelPosition = new THREE.Vector3();
const labelProjection = new THREE.Vector3();

const planetMeshes = [];
const orbitLines = [];
let paused = false;
let showOrbits = true;
let simulationSpeed = Number(speedSlider.value);
let draggingKey = null;
let hoverKey = null;
let focusedKey = null;
let focusTween = null;
let pointerDown = { x: 0, y: 0 };
let lastTime = performance.now();

init();
animate();

function init() {
  createStarfield();
  createSun();
  createPlanets();
  buildPlanetList();
  bindEvents();
  updatePauseButton();
  updateSpeedLabel();
}

function createSun() {
  const sunGeometry = new THREE.SphereGeometry(8.5, 48, 24);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc247,
    toneMapped: false
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.name = 'Sun';
  sun.userData.kind = 'sun';
  scene.add(sun);

  // A soft glow sprite makes the Sun readable without expensive bloom post-processing.
  const glowTexture = createSunGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffb347,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.name = 'Sun glow';
  glow.scale.set(34, 34, 1);
  scene.add(glow);

  const sunLight = new THREE.PointLight(0xffffff, 4.5, 900, 1.2);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const ambient = new THREE.HemisphereLight(0x93c5fd, 0x111827, 0.55);
  scene.add(ambient);
}

function createPlanets() {
  for (const data of planetData) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 16);
    const material = new THREE.MeshStandardMaterial({
      map: createPlanetTexture(data),
      roughness: 0.88,
      metalness: 0.02
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = data.name;
    mesh.userData.kind = 'planet';
    mesh.userData.key = data.key;
    scene.add(mesh);
    planetMeshes.push(mesh);

    data.mesh = mesh;
    data.angle = data.startAngle;
    data.orbitLine = createOrbitPath(data);
    data.labelElement = createLabel(data);

    if (data.key === 'saturn') {
      addSaturnRings(data);
    }
  }
}

function createOrbitPath(data) {
  const segments = 192;
  const points = [];

  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * TWO_PI;
    const point = orbitalPoint(data, angle);
    points.push(point);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x64748b,
    transparent: true,
    opacity: 0.42
  });
  const orbit = new THREE.LineLoop(geometry, material);
  orbit.name = `${data.name} orbit path`;
  orbit.userData.orbit = true;
  scene.add(orbit);
  orbitLines.push(orbit);
  return orbit;
}

function addSaturnRings(data) {
  const ringGroup = new THREE.Group();
  ringGroup.name = 'Saturn rings';

  const innerRing = createRingMesh(data.rings.inner, data.rings.outer * 0.62, 0.82, 0.52);
  const middleRing = createRingMesh(data.rings.inner + 0.55, data.rings.outer * 0.82, 0.58, 0.38);
  const outerRing = createRingMesh(data.rings.outer * 0.78, data.rings.outer, 0.35, 0.28);

  ringGroup.add(innerRing, middleRing, outerRing);
  ringGroup.rotation.x = Math.PI / 2;
  ringGroup.rotation.z = data.rings.tilt;
  data.mesh.add(ringGroup);
}

function createRingMesh(innerRadius, outerRadius, opacity, radialSegments) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 96, radialSegments);
  const material = new THREE.MeshBasicMaterial({
    color: 0xd8c28d,
    side: THREE.DoubleSide,
    transparent: true,
    opacity,
    depthWrite: false
  });
  return new THREE.Mesh(geometry, material);
}

function createLabel(data) {
  const label = document.createElement('div');
  label.className = 'planet-label';
  label.textContent = data.name;
  labelLayer.appendChild(label);
  return label;
}

function buildPlanetList() {
  const fragment = document.createDocumentFragment();

  for (const data of planetData) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'planet-row';
    button.dataset.key = data.key;

    const dot = document.createElement('span');
    dot.className = 'planet-dot';
    dot.style.color = data.color;
    dot.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0 8%, ${data.color} 9% 58%, ${data.secondaryColor} 100%)`;

    const text = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = data.name;
    const subtitle = document.createElement('small');
    subtitle.textContent = data.tagline;
    text.append(title, subtitle);

    button.append(dot, text);
    button.addEventListener('click', () => focusPlanet(data.key));
    fragment.appendChild(button);
  }

  planetList.appendChild(fragment);
}

function bindEvents() {
  window.addEventListener('resize', onResize);

  renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  controls.addEventListener('start', () => {
    if (!draggingKey) {
      focusTween = null;
      hideTooltip();
    }
  });

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    updatePauseButton();
  });

  speedSlider.addEventListener('input', () => {
    simulationSpeed = Number(speedSlider.value);
    updateSpeedLabel();
  });

  orbitToggle.addEventListener('click', () => {
    showOrbits = !showOrbits;
    orbitToggle.textContent = showOrbits ? 'Orbits On' : 'Orbits Off';
    orbitToggle.setAttribute('aria-pressed', String(showOrbits));
    for (const orbit of orbitLines) {
      orbit.visible = showOrbits;
    }
  });

  resetCameraBtn.addEventListener('click', resetCamera);

  fullscreenBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
  });

  searchBox.addEventListener('input', filterPlanetList);
  searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const firstVisible = planetList.querySelector('.planet-row:not([hidden])');
      if (firstVisible) {
        focusPlanet(firstVisible.dataset.key);
      }
    }
  });
}

function onPointerDown(event) {
  if (event.button !== 0) return;

  const key = getPlanetAtPointer(event);
  if (!key) return;

  const data = planetByKey.get(key);
  draggingKey = key;
  pointerDown = { x: event.clientX, y: event.clientY };
  document.body.classList.add('is-dragging-planet');
  hideTooltip();

  controls.enabled = false;
  camera.getWorldDirection(planeNormal);
  dragPlane.setFromNormalAndCoplanarPoint(planeNormal, data.mesh.position);

  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);

  if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
    dragOffset.copy(data.mesh.position).sub(dragPoint);
  } else {
    dragOffset.set(0, 0, 0);
  }

  renderer.domElement.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function onPointerMove(event) {
  if (draggingKey) {
    const data = planetByKey.get(draggingKey);
    if (!data) return;

    const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
    if (moved > 5) {
      setPointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);

      if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        data.mesh.position.copy(dragPoint).add(dragOffset);
      }
    }

    event.preventDefault();
    return;
  }

  updateHover(event);
}

function onPointerUp(event) {
  if (!draggingKey) return;

  const key = draggingKey;
  const data = planetByKey.get(key);
  draggingKey = null;
  document.body.classList.remove('is-dragging-planet');
  controls.enabled = true;

  try {
    renderer.domElement.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released by the browser.
  }

  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  if (moved <= 5 && data) {
    focusPlanet(key);
  } else if (data) {
    // Release returns the planet to its calculated orbit so the simulation remains stable.
    data.mesh.position.copy(orbitalPoint(data, data.angle));
  }

  updateHover(event);
}

function updateHover(event) {
  const key = getPlanetAtPointer(event);
  hoverKey = key;

  if (!key) {
    canvas.style.cursor = 'default';
    hideTooltip();
    return;
  }

  const data = planetByKey.get(key);
  canvas.style.cursor = 'grab';
  tooltip.textContent = data.name;
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
  tooltip.style.opacity = '1';
}

function hideTooltip() {
  tooltip.style.opacity = '0';
}

function getPlanetAtPointer(event) {
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(planetMeshes, false);
  return hits.length ? hits[0].object.userData.key : null;
}

function setPointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function focusPlanet(key) {
  const data = planetByKey.get(key);
  if (!data) return;

  focusedKey = key;
  setActivePlanet(key);
  renderInfoPanel(data);

  const planetPosition = data.mesh.position.clone();
  const viewDistance = Math.max(18, data.radius * 8 + 16);
  const endCamera = planetPosition.clone().add(new THREE.Vector3(viewDistance * 0.75, viewDistance * 0.45, viewDistance * 0.9));
  const endTarget = planetPosition.clone();

  focusTween = {
    elapsed: 0,
    duration: 0.9,
    startCamera: camera.position.clone(),
    endCamera,
    startTarget: controls.target.clone(),
    endTarget
  };
}

function resetCamera() {
  focusedKey = null;
  setActivePlanet(null);
  infoPanel.classList.add('empty');
  infoPanel.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true">✦</span>
      <h2>Select a planet</h2>
      <p>Click a planet in the scene or choose one from the list to focus the camera and view facts.</p>
    </div>
  `;
  focusTween = {
    elapsed: 0,
    duration: 1,
    startCamera: camera.position.clone(),
    endCamera: DEFAULT_CAMERA.clone(),
    startTarget: controls.target.clone(),
    endTarget: DEFAULT_TARGET.clone()
  };
}

function setActivePlanet(key) {
  for (const button of planetList.querySelectorAll('.planet-row')) {
    const isActive = button.dataset.key === key;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }

  for (const data of planetData) {
    data.labelElement.classList.toggle('is-focused', data.key === key);
  }
}

function renderInfoPanel(data) {
  infoPanel.classList.remove('empty');
  infoPanel.replaceChildren();

  const header = document.createElement('div');
  header.className = 'info-header';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'info-title-wrap';

  const kicker = document.createElement('p');
  kicker.className = 'info-kicker';
  kicker.textContent = 'Planet profile';

  const title = document.createElement('h2');
  title.textContent = data.name;

  const subtitle = document.createElement('p');
  subtitle.textContent = data.tagline;

  titleWrap.append(kicker, title, subtitle);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close-info';
  close.setAttribute('aria-label', `Close ${data.name} information`);
  close.textContent = '×';
  close.addEventListener('click', () => {
    focusedKey = null;
    setActivePlanet(null);
    infoPanel.classList.add('empty');
    infoPanel.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">✦</span>
        <h2>Select a planet</h2>
        <p>Click a planet in the scene or choose one from the list to focus the camera and view facts.</p>
      </div>
    `;
  });

  header.append(titleWrap, close);

  const grid = document.createElement('dl');
  grid.className = 'info-grid';
  addInfoRow(grid, 'Diameter', data.diameter);
  addInfoRow(grid, 'Mass', data.mass);
  addInfoRow(grid, 'Distance from Sun', data.distance);
  addInfoRow(grid, 'Moons', data.moons);
  addInfoRow(grid, 'Day length', data.day);
  addInfoRow(grid, 'Year length', data.year);

  const facts = document.createElement('section');
  facts.className = 'fact-card';
  const factsTitle = document.createElement('h3');
  factsTitle.textContent = 'Facts';
  const factsList = document.createElement('ul');

  for (const fact of data.facts) {
    const item = document.createElement('li');
    item.textContent = fact;
    factsList.appendChild(item);
  }

  facts.append(factsTitle, factsList);
  infoPanel.append(header, grid, facts);
}

function addInfoRow(grid, term, value) {
  const row = document.createElement('div');
  row.className = 'info-row';

  const dt = document.createElement('dt');
  dt.textContent = term;

  const dd = document.createElement('dd');
  dd.textContent = value;

  row.append(dt, dd);
  grid.appendChild(row);
}

function filterPlanetList() {
  const query = searchBox.value.trim().toLowerCase();

  for (const button of planetList.querySelectorAll('.planet-row')) {
    const data = planetByKey.get(button.dataset.key);
    const haystack = `${data.name} ${data.tagline} ${data.diameter}`.toLowerCase();
    button.hidden = query.length > 0 && !haystack.includes(query);
  }
}

function updatePauseButton() {
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  pauseBtn.setAttribute('aria-pressed', String(paused));
}

function updateSpeedLabel() {
  speedValue.textContent = `${simulationSpeed.toFixed(2)}×`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      fullscreenBtn.textContent = 'Fullscreen unavailable';
      window.setTimeout(() => {
        fullscreenBtn.textContent = 'Fullscreen';
      }, 1400);
    });
  } else {
    document.exitFullscreen();
  }
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
}

function animate(now = performance.now()) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (!paused) {
    updateSolarSystem(delta * simulationSpeed);
  }

  updateFocusTween(delta);
  controls.update();
  updateLabels();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updateSolarSystem(delta) {
  for (const data of planetData) {
    const angularSpeed = TWO_PI / (data.period * EARTH_YEAR_SECONDS);
    data.angle += delta * angularSpeed;

    if (draggingKey !== data.key) {
      data.mesh.position.copy(orbitalPoint(data, data.angle));
    }

    const spinSpeed = computeSpinSpeed(data.rotationPeriodDays, data.spinDirection);
    data.mesh.rotation.y += delta * spinSpeed;
    data.mesh.rotation.z = data.axialTilt;
  }

  const sun = scene.getObjectByName('Sun');
  const glow = scene.getObjectByName('Sun glow');
  if (sun) sun.rotation.y += delta * 0.08;
  if (glow) glow.material.opacity = 0.68 + Math.sin(performance.now() * 0.0012) * 0.04;
}

function computeSpinSpeed(rotationPeriodDays, spinDirection) {
  // Real rotation periods are far too slow to notice in a browser demo, so this keeps
  // the relative ordering while making every planet visibly rotate.
  const period = Math.max(0.1, Math.abs(rotationPeriodDays));
  return (0.28 / Math.sqrt(period)) * spinDirection;
}

function updateFocusTween(delta) {
  if (!focusTween) return;

  focusTween.elapsed += delta;
  const rawT = Math.min(focusTween.elapsed / focusTween.duration, 1);
  const t = easeInOutCubic(rawT);

  camera.position.lerpVectors(focusTween.startCamera, focusTween.endCamera, t);
  controls.target.lerpVectors(focusTween.startTarget, focusTween.endTarget, t);

  if (rawT >= 1) {
    focusTween = null;
  }
}

function updateLabels() {
  for (const data of planetData) {
    const label = data.labelElement;
    data.mesh.getWorldPosition(labelPosition);
    labelPosition.y += data.radius + 1.25;
    labelProjection.copy(labelPosition).project(camera);

    const visible = labelProjection.z > -1 && labelProjection.z < 1;
    if (!visible) {
      label.style.opacity = '0';
      continue;
    }

    const x = (labelProjection.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-labelProjection.y * 0.5 + 0.5) * window.innerHeight;
    label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    label.style.opacity = '1';
  }
}

function orbitalPoint(data, angle) {
  const x = Math.cos(angle) * data.orbitRadius;
  const z = Math.sin(angle) * data.orbitRadius;
  const point = new THREE.Vector3(x, 0, z);

  if (data.inclination) {
    point.applyAxisAngle(new THREE.Vector3(1, 0, 0), data.inclination);
  }

  return point;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createPlanetTexture(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  const base = context.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, data.secondaryColor);
  base.addColorStop(0.45, data.color);
  base.addColorStop(1, data.secondaryColor);
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Procedural bands/noise avoid external texture dependencies and keep the files portable.
  if (['jupiter', 'saturn'].includes(data.key)) {
    for (let index = 0; index < 24; index += 1) {
      const y = (index / 24) * canvas.height;
      const height = 4 + Math.random() * 8;
      context.fillStyle = index % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(60,35,20,0.14)';
      context.fillRect(0, y, canvas.width, height);
    }

    if (data.key === 'jupiter') {
      context.fillStyle = 'rgba(185, 83, 55, 0.72)';
      context.beginPath();
      context.ellipse(166, 78, 22, 9, -0.15, 0, TWO_PI);
      context.fill();
      context.strokeStyle = 'rgba(255, 237, 213, 0.45)';
      context.lineWidth = 2;
      context.stroke();
    }
  } else if (data.key === 'earth') {
    context.fillStyle = 'rgba(34, 197, 94, 0.72)';
    for (let index = 0; index < 18; index += 1) {
      context.beginPath();
      context.ellipse(
        (index * 37) % canvas.width,
        38 + Math.sin(index) * 24,
        20 + (index % 3) * 7,
        8 + (index % 4) * 3,
        index * 0.4,
        0,
        TWO_PI
      );
      context.fill();
    }
    context.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let index = 0; index < 8; index += 1) {
      context.fillRect((index * 43) % canvas.width, 22 + index * 9, 34, 3);
    }
  } else {
    for (let index = 0; index < 900; index += 1) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = 0.05 + Math.random() * 0.12;
      context.fillStyle = `rgba(255,255,255,${alpha})`;
      context.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createSunGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

  gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
  gradient.addColorStop(0.18, 'rgba(255, 210, 80, 0.86)');
  gradient.addColorStop(0.45, 'rgba(249, 115, 22, 0.34)');
  gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createStarfield() {
  const count = 2200;
  const radius = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const i = index * 3;
    const distance = radius * (0.35 + Math.random() * 0.65);
    const theta = Math.random() * TWO_PI;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i] = distance * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = distance * Math.cos(phi);
    positions[i + 2] = distance * Math.sin(phi) * Math.sin(theta);

    const warmth = Math.random();
    colors[i] = warmth > 0.72 ? 1.0 : 0.72 + Math.random() * 0.18;
    colors[i + 1] = warmth > 0.72 ? 0.82 + Math.random() * 0.12 : 0.86 + Math.random() * 0.12;
    colors[i + 2] = warmth > 0.72 ? 0.62 + Math.random() * 0.18 : 0.95 + Math.random() * 0.05;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(geometry, material);
  stars.name = 'Starfield';
  scene.add(stars);
}
