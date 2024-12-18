import * as THREE from "three";
import { parameters, mixedColor } from "./parameters";

let geometry = null;
let material = null;
let points = null;

let galaxyCenterLight = null;

export const generateGalaxy = (scene) => {
  console.log(scene);

  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
    scene.remove(galaxyCenterLight);
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

  galaxyCenterLight = new THREE.PointLight(mixedColor(), 100);
  galaxyCenterLight.position.set(0, 0, 0);
  scene.add(galaxyCenterLight);

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

export const rotateGalaxy = (elapsedTime) => {
  const rotationX = Math.cos(elapsedTime / 10) / 20;
  const rotationZ = Math.sin(elapsedTime / 10) / 20;
  const rotationY = elapsedTime / 50;

  points.rotation.x = rotationX;
  points.rotation.z = rotationZ;
  points.rotation.y = rotationY;
};
