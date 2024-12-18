import * as THREE from "three";

export const parameters = {
  count: 60000,
  size: 0.01,
  radius: 12,
  branches: 5,
  spin: 0.6,
  randomness: 3,
  insideColor: "#8a9df9",
  outsideColor: "#4d0d62",
};

export const mixedColor = () => {
  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);
  return insideColor.lerp(outsideColor, 0.4);
};
