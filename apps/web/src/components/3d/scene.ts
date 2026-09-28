import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { loadModel, resumeModelMotion, stopModelMotion, updateModel } from "./model"

export function createScene(container: HTMLElement, canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, 6)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  })
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false
  controls.minDistance = 2.5
  controls.maxDistance = 12
  const initialCameraPosition = camera.position.clone()
  const initialCameraTarget = controls.target.clone()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = false

  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Guarda a referência do modelo carregado (usado para calcular o
  // enquadramento da câmera ao focar em um hotspot)
  let currentModel: THREE.Object3D | null = null
  loadModel("/models/cloud.glb", scene, container)
    .then((model) => {
      currentModel = model
    })
    .catch((error) => {
      console.error("Erro ao carregar o modelo 3D:", error)
    })

  function onResize() {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(container)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const clock = new THREE.Clock()
  let hotspotsRevealed = false
  const cameraTransitionDuration = 1.2
  let elapsedSeconds = 0
  let cameraTransition: {
    fromPosition: THREE.Vector3
    toPosition: THREE.Vector3
    fromTarget: THREE.Vector3
    toTarget: THREE.Vector3
    elapsed: number
    purpose: "top" | "initial"
  } | null = null

  // ---------------------------------------------------------------------
  // Hotspots: esferas invisíveis usadas como área clicável para cada
  // ponto de interesse da ilha. Mais confiável que testar a geometria
  // visual da nuvem, que é curva e não tem faces/normais distintas.
  // ---------------------------------------------------------------------
  const hotspots: THREE.Mesh[] = []

  function focusCamera(targetPosition: THREE.Vector3) {
    if (!currentModel) return

    const bounds = new THREE.Box3().setFromObject(currentModel)
    const size = bounds.getSize(new THREE.Vector3())
    const distance = Math.min(
      controls.maxDistance,
      Math.max(
        controls.minDistance,
        (Math.max(size.x, size.z) /
          (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) *
          1.15
      )
    )

    cameraTransition = {
      fromPosition: camera.position.clone(),
      toPosition: new THREE.Vector3(
        targetPosition.x,
        targetPosition.y + distance,
        targetPosition.z + distance * 0.001
      ),
      fromTarget: controls.target.clone(),
      toTarget: targetPosition.clone(),
      elapsed: 0,
      purpose: "top",
    }
  }

  function createHotspot(
    name: string,
    position: THREE.Vector3,
    radius: number,
    onSelect: () => void
  ) {
    const geometry = new THREE.SphereGeometry(radius, 8, 8)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0,
    })
    const hotspot = new THREE.Mesh(geometry, material)
    hotspot.position.copy(position)
    hotspot.userData = {
      name,
      title: {
        aws: "AWS",
        azure: "Microsoft Azure",
        google: "Google Cloud",

      }[name] ?? name,
      select: () => {
        stopModelMotion()
        focusCamera(position)
      },
      action: onSelect,
    }
    scene.add(hotspot)
    hotspots.push(hotspot)
    return hotspot
  }

  // Ajuste as posições (x, y, z) e o raio de cada esfera conforme a
  // posição real de cada elemento no seu modelo
  createHotspot("aws", new THREE.Vector3(0, 0.3, -0.1), 0.9, () => {
    console.log("Ação: clicou na aws")
  })

  createHotspot(
    "azure",
    new THREE.Vector3(1.3, 0.6, 0),
    0.4,
    () => {
      console.log("Ação: Microsoft Azure")
    }
  )

  createHotspot("google", new THREE.Vector3(0.7, 0.5, 1.1), 0.3, () => {
    console.log("Ação: Google Cloud")
  })

  function onClick(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    // Testa só os hotspots, não a nuvem/modelo
    const intersects = raycaster.intersectObjects(hotspots, false)

    if (intersects.length > 0) {
      const hit = intersects[0]
      const { name } = hit.object.userData
      hit.object.userData.select()
      console.log("Hotspot clicado:", name)
    }
  }

  canvas.addEventListener("click", onClick)

  function onHotspotAction(event: Event) {
    const { name } = (event as CustomEvent<{ name: string }>).detail
    const hotspot = hotspots.find((item) => item.userData.name === name)
    hotspot?.userData.action()
  }

  container.addEventListener("hotspotaction", onHotspotAction)

  function onHotspotsResetRequest() {
    if (!hotspotsRevealed || cameraTransition?.purpose === "initial") return

    cameraTransition = {
      fromPosition: camera.position.clone(),
      toPosition: initialCameraPosition.clone(),
      fromTarget: controls.target.clone(),
      toTarget: initialCameraTarget.clone(),
      elapsed: 0,
      purpose: "initial",
    }
  }

  container.addEventListener("hotspotsresetrequest", onHotspotsResetRequest)

  function onIslandExploreRequest() {
    if (
      !currentModel ||
      hotspotsRevealed ||
      cameraTransition?.purpose === "top"
    ) {
      return
    }

    stopModelMotion()
    const islandCenter = new THREE.Box3()
      .setFromObject(currentModel)
      .getCenter(new THREE.Vector3())
    focusCamera(islandCenter)
  }

  container.addEventListener("islandexplorerequest", onIslandExploreRequest)

  let animationId: number
  let modelReadyNotified = false

  function animate() {
    animationId = requestAnimationFrame(animate)
    const deltaSeconds = clock.getDelta()
    elapsedSeconds += deltaSeconds

    if (cameraTransition) {
      cameraTransition.elapsed = Math.min(
        cameraTransition.elapsed + deltaSeconds,
        cameraTransitionDuration
      )
      const progress = cameraTransition.elapsed / cameraTransitionDuration
      const easedProgress = progress * progress * (3 - 2 * progress)

      camera.position.lerpVectors(
        cameraTransition.fromPosition,
        cameraTransition.toPosition,
        easedProgress
      )
      controls.target.lerpVectors(
        cameraTransition.fromTarget,
        cameraTransition.toTarget,
        easedProgress
      )

      if (progress === 1) {
        const transitionPurpose = cameraTransition.purpose
        cameraTransition = null

        if (transitionPurpose === "initial") {
          hotspotsRevealed = false
          resumeModelMotion(elapsedSeconds)
          container.dispatchEvent(new CustomEvent("hotspotsreset"))
        } else if (!hotspotsRevealed) {
          hotspotsRevealed = true
          container.dispatchEvent(
            new CustomEvent("hotspotsreveal", {
              detail: hotspots.map(({ userData }) => ({
                name: userData.name as string,
                title: userData.title as string,
              })),
            })
          )
        }
      }
    }

    if (hotspotsRevealed) {
      const containerBounds = container.getBoundingClientRect()

      hotspots.forEach((hotspot, index) => {
        const name = hotspot.userData.name as string
        const card = container.querySelector<HTMLElement>(
          `[data-hotspot-card="${name}"]`
        )
        const arrow = container.querySelector<SVGPathElement>(
          `[data-hotspot-arrow="${name}"]`
        )
        const arrowIcon = container.querySelector<HTMLElement>(
          `[data-hotspot-arrow-icon="${name}"]`
        )

        if (!card || !arrow || !arrowIcon) return

        const hotspotWorldPosition = hotspot.getWorldPosition(new THREE.Vector3())
        const projectedPosition = hotspotWorldPosition.project(camera)
        const startX = ((projectedPosition.x + 1) / 2) * containerBounds.width
        const startY = ((1 - projectedPosition.y) / 2) * containerBounds.height
        const cardBounds = card.getBoundingClientRect()
        const cardCenterX = cardBounds.left - containerBounds.left + cardBounds.width / 2
        const cardCenterY = cardBounds.top - containerBounds.top + cardBounds.height / 2
        const directionX = startX - cardCenterX
        const directionY = startY - cardCenterY
        const scale = Math.min(
          cardBounds.width / 2 / Math.max(Math.abs(directionX), 1),
          cardBounds.height / 2 / Math.max(Math.abs(directionY), 1)
        )
        const endX = cardCenterX + directionX * scale
        const endY = cardCenterY + directionY * scale
        const distance = Math.max(Math.hypot(endX - startX, endY - startY), 1)
        const bend = (index % 2 === 0 ? 1 : -1) * Math.min(90, distance * 0.18)
        const controlX = (startX + endX) / 2 - (endY - startY) / distance * bend
        const controlY = (startY + endY) / 2 + (endX - startX) / distance * bend

        arrow.setAttribute(
          "d",
          `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
        )
        arrowIcon.style.left = `${endX}px`
        arrowIcon.style.top = `${endY}px`
        arrowIcon.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(endY - controlY, endX - controlX)}rad)`
      })
    }

    controls.update()
    updateModel(elapsedSeconds)
    renderer.render(scene, camera)

    if (currentModel && !modelReadyNotified) {
      modelReadyNotified = true
      container.dispatchEvent(new CustomEvent("modelready"))
    }
  }
  animate()

  return () => {
    cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    controls.dispose()
    renderer.dispose()
    canvas.removeEventListener("click", onClick)
    container.removeEventListener("hotspotaction", onHotspotAction)
    container.removeEventListener("hotspotsresetrequest", onHotspotsResetRequest)
    container.removeEventListener("islandexplorerequest", onIslandExploreRequest)
  }
}