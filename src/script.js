import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "./style.css";
import { addPlanet, resetPlanets, rotatePlanetsGroup } from "./planets";
import { generateGalaxy, rotateGalaxy } from "./galaxy";
import { initTweaks } from "./tweaks";

// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

initTweaks(scene);
generateGalaxy(scene);

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
  addPlanet(scene);
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

  rotateGalaxy(elapsedTime);
  rotatePlanetsGroup(elapsedTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
