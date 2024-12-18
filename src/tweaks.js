import GUI from "lil-gui";
import { generateGalaxy } from "./galaxy";
import { parameters } from "./parameters";

export const initTweaks = (scene) => {
  const gui = new GUI();

  gui
    .add(parameters, "count")
    .min(100)
    .max(100000)
    .step(1)
    .onFinishChange(() => generateGalaxy(scene));
  gui
    .add(parameters, "radius")
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => generateGalaxy(scene));
  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(() => generateGalaxy(scene));
  gui
    .add(parameters, "branches")
    .min(1)
    .max(10)
    .step(1)
    .onFinishChange(() => generateGalaxy(scene));
  gui
    .add(parameters, "spin")
    .min(0.1)
    .max(1.2)
    .step(0.01)
    .onChange(() => generateGalaxy(scene));
  gui
    .add(parameters, "randomness")
    .min(1)
    .max(10)
    .step(0.01)
    .onChange(() => generateGalaxy(scene));
  gui
    .addColor(parameters, "insideColor")
    .onFinishChange(() => generateGalaxy(scene));
  gui
    .addColor(parameters, "outsideColor")
    .onFinishChange(() => generateGalaxy(scene));
};
