import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import "./style.css";

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

//Textures
const textureLoader = new THREE.TextureLoader();

const planet1Color = textureLoader.load(
  "./static/textures/grass-patchy/color.jpg"
);
planet1Color.colorSpace = THREE.SRGBColorSpace;
planet1Color.wrapS = THREE.RepeatWrapping;
planet1Color.wrapT = THREE.RepeatWrapping;
planet1Color.repeat.set(10, 10);

const planet1Normal = textureLoader.load(
  "./static/textures/grass-patchy/normal.jpg"
);
const planet1Roughness = textureLoader.load(
  "./static/textures/grass-patchy/roughness.jpg"
);
const planet1Metalness = textureLoader.load(
  "./static/textures/grass-patchy/metalness.jpg"
);
const planet1Ao = textureLoader.load("./static/textures/grass-patchy/ao.jpg");

const planet2Color = textureLoader.load(
  "./static/textures/ground-wood/color.jpg"
);
planet2Color.colorSpace = THREE.SRGBColorSpace;
planet2Color.wrapS = THREE.RepeatWrapping;
planet2Color.wrapT = THREE.RepeatWrapping;
planet2Color.repeat.set(10, 10);

const planet2Normal = textureLoader.load(
  "./static/textures/ground-wood/normal.jpg"
);
const planet2Roughness = textureLoader.load(
  "./static/textures/ground-wood/roughness.jpg"
);
const planet2Metalness = textureLoader.load(
  "./static/textures/ground-wood/metalness.jpg"
);
const planet2Ao = textureLoader.load("./static/textures/ground-wood/ao.jpg");
const planet2Displacement = textureLoader.load(
  "./static/textures/ground-wood/disp.jpg"
);

const planet3Color = textureLoader.load(
  "./static/textures/metal-corroded/color.jpg"
);
planet3Color.colorSpace = THREE.SRGBColorSpace;
planet3Color.wrapS = THREE.RepeatWrapping;
planet3Color.wrapT = THREE.RepeatWrapping;
planet3Color.repeat.set(10, 10);

const planet3Normal = textureLoader.load(
  "./static/textures/metal-corroded/normal.jpg"
);
const planet3Roughness = textureLoader.load(
  "./static/textures/metal-corroded/roughness.jpg"
);
const planet3Metalness = textureLoader.load(
  "./static/textures/metal-corroded/metalness.jpg"
);
const planet3Ao = textureLoader.load("./static/textures/metal-corroded/ao.jpg");
const planet3Displacement = textureLoader.load(
  "./static/textures/metal-corroded/disp.jpg"
);

const planetColors = [planet1Color, planet2Color, planet3Color];

// Scene
const scene = new THREE.Scene();

let parameters = {
  count: 60000,
  size: 0.01,
  radius: 12,
  branches: 5,
  spin: 0.6,
  randomness: 3,
  insideColor: "#8a9df9",
  outsideColor: "#4d0d62",
};

let geometry = null;
let material = null;
let points = null;

let planets = [];
const planetsGroup = new THREE.Group();
scene.add(planetsGroup);

const addPlanet = () => {
  //sphere mesh looking like a planet
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: planetColors[Math.floor(Math.random() * planetColors.length)],
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  //add a planet randomly on the galaxy plane
  const randomX =
    (Math.random() > 0.5 ? 1 : -1) * Math.random() * parameters.radius;
  const randomZ =
    (Math.random() > 0.5 ? 1 : -1) * Math.random() * parameters.radius;
  const randomY = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.05;

  sphere.position.set(randomX, randomY, randomZ);
  planets.push(sphere);
  planetsGroup.add(sphere);
};

const resetPlanets = () => {
  planets.forEach((planet) => {
    planet.geometry.dispose();
    planet.material.dispose();
    planetsGroup.remove(planet);
  });
  planets = [];
};

const generateGalaxy = () => {
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    //positions
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const angle =
      (Math.PI * 2 * (i % parameters.branches)) / parameters.branches;

    const randomX =
      Math.pow(Math.random(), parameters.randomness) *
      (Math.random() > 0.5 ? 1 : -1) *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomness) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.1 * radius);
    const randomZ =
      Math.pow(Math.random(), parameters.randomness) *
      (Math.random() > 0.5 ? 1 : -1) *
      radius;

    positions[i3] = Math.cos(angle + spinAngle) * radius + randomX; //x
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(angle + spinAngle) * radius + randomZ; //z

    //colors

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const galaxyCenterLight = new THREE.PointLight(parameters.insideColor, 100);
  galaxyCenterLight.position.set(0, 0, 0);
  scene.add(galaxyCenterLight);

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

//tweaks
gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(0.1)
  .max(1.2)
  .step(0.01)
  .onChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(1)
  .max(10)
  .step(0.01)
  .onChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const mainFrame = document.querySelector(".main-frame");
const sizes = {
  width: mainFrame.clientWidth,
  height: mainFrame.clientHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = mainFrame.clientWidth;
  sizes.height = mainFrame.clientHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

document.querySelector("#create-planet").addEventListener("click", (e) => {
  addPlanet();
});

document.querySelector("#reset-planet").addEventListener("click", (e) => {
  resetPlanets();
});
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const rotationX = Math.cos(elapsedTime / 10) / 20;
  const rotationZ = Math.sin(elapsedTime / 10) / 20;
  const rotationY = elapsedTime / 50;

  points.rotation.x = rotationX;
  points.rotation.z = rotationZ;
  points.rotation.y = rotationY;

  planetsGroup.rotation.x = rotationX;
  planetsGroup.rotation.z = rotationZ;
  planetsGroup.rotation.y = rotationY;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
