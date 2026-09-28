import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
import { showLoaderError, updateLoader } from "./loader"
import type { Object3D, Scene } from "three"

const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath("/draco/")

const loader = new GLTFLoader()

loader.setDRACOLoader(dracoLoader)

let model: Object3D | null = null
let baseY = 0
let motionEnabled = true
let motionStartTime = 0

export function loadModel(
  path: string,
  scene: Scene,
  container: HTMLElement
): Promise<Object3D> {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        model = gltf.scene
        model.scale.setScalar(2)
        baseY = model.position.y
        scene.add(model)
        resolve(model)
      },
      (progress) => {
        updateLoader(progress, container)
      },
      (error) => {
        showLoaderError(container)
        reject(error)
      }
    )
  })
}

export function updateModel(timeSeconds: number) {
  if (!model || !motionEnabled) return

  const motionTime = timeSeconds - motionStartTime
  model.rotation.y = motionTime * 0.2
  model.position.y = baseY + Math.sin(motionTime * 2) * 0.15
}

export function stopModelMotion() {
  motionEnabled = false
  if (!model) return

  model.rotation.y = 0
  model.position.y = baseY
}

export function resumeModelMotion(timeSeconds: number) {
  motionStartTime = timeSeconds
  motionEnabled = true
}
