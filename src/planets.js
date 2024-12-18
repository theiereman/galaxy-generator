// src/planets.js
import * as THREE from "three";
import { parameters } from "./parameters.js";

const textureLoader = new THREE.TextureLoader();

const grassPlanet = {
  color: textureLoader.load("./textures/grass-patchy/color.jpg"),
  normal: null,
  roughness: textureLoader.load("./textures/grass-patchy/roughness.jpg"),
  metalness: textureLoader.load("./textures/grass-patchy/metalness.jpg"),
  ao: textureLoader.load("./textures/grass-patchy/ao.jpg"),
  displacement: null,
};

const dirtPlanet = {
  color: textureLoader.load("./textures/ground-wood/color.jpg"),
  normal: textureLoader.load("./textures/ground-wood/normal.jpg"),
  roughness: null,
  metalness: null,
  ao: textureLoader.load("./textures/ground-wood/ao.jpg"),
  displacement: textureLoader.load("./textures/ground-wood/disp.jpg"),
};

const metalPlanet = {
  color: textureLoader.load("./textures/metal-corroded/color.jpg"),
  normal: textureLoader.load("./textures/metal-corroded/normal.jpg"),
  roughness: textureLoader.load("./textures/metal-corroded/roughness.jpg"),
  metalness: textureLoader.load("./textures/metal-corroded/metalness.jpg"),
  ao: textureLoader.load("./textures/metal-corroded/ao.jpg"),
  displacement: textureLoader.load("./textures/metal-corroded/disp.jpg"),
};

let planets = [grassPlanet, dirtPlanet, metalPlanet];
let createdPlanets = [];
const planetsGroup = new THREE.Group();

export const addPlanet = (scene) => {
  const geometry = new THREE.SphereGeometry(0.5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: planets[Math.floor(Math.random() * planets.length)].color,
    normalMap: planets[Math.floor(Math.random() * planets.length)].normal,
    roughnessMap: planets[Math.floor(Math.random() * planets.length)].roughness,
    metalnessMap: planets[Math.floor(Math.random() * planets.length)].metalness,
    aoMap: planets[Math.floor(Math.random() * planets.length)].ao,
    displacementMap:
      planets[Math.floor(Math.random() * planets.length)].displacement,
    displacementScale: 0.05,
  });

  const planet = new THREE.Mesh(geometry, material);
  const randomX =
    (Math.random() > 0.5 ? 1 : -1) * Math.random() * parameters.radius;
  const randomZ =
    (Math.random() > 0.5 ? 1 : -1) * Math.random() * parameters.radius;
  const randomY = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.05;
  planet.position.set(randomX, randomY, randomZ);

  createdPlanets.push(planet);
  planetsGroup.add(planet);

  if (!scene.children.includes(planetsGroup)) {
    scene.add(planetsGroup);
  }
};

export const resetPlanets = () => {
  createdPlanets.forEach((planet) => {
    planetsGroup.remove(planet);
    planet.geometry.dispose();
    planet.material.dispose();
  });

  createdPlanets = [];
};

export const rotatePlanetsGroup = (elapsedTime) => {
  const rotationX = Math.cos(elapsedTime / 10) / 20;
  const rotationZ = Math.sin(elapsedTime / 10) / 20;
  const rotationY = elapsedTime / 50;

  planetsGroup.rotation.y = rotationY;
  planetsGroup.rotation.x = rotationX;
  planetsGroup.rotation.z = rotationZ;
};
