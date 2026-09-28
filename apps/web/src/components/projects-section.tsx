import React from "react"
import { animate, stagger } from "animejs"
import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react"
import { createCanvas } from "@/components/3d/canvas"

type Hotspot = { name: string; title: string }

const hotspotCardPositions: Record<string, React.CSSProperties> = {
  aws: { top: "10%", left: "3%" },
  azure: { top: "10%", right: "3%" },
  google: { top: "50%", right: "4%" },
}

export default function ProjectsSection() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hotspots, setHotspots] = React.useState<Hotspot[]>([])
  const [modelReady, setModelReady] = React.useState(false)

  React.useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const handleHotspotsReveal = (event: Event) => {
      setHotspots((event as CustomEvent<Hotspot[]>).detail)
    }
    const handleHotspotsReset = () => setHotspots([])
    const handleModelReady = () => setModelReady(true)

    container.addEventListener("hotspotsreveal", handleHotspotsReveal)
    container.addEventListener("hotspotsreset", handleHotspotsReset)
    container.addEventListener("modelready", handleModelReady)
    const { cleanup } = createCanvas(container)

    return () => {
      container.removeEventListener("hotspotsreveal", handleHotspotsReveal)
      container.removeEventListener("hotspotsreset", handleHotspotsReset)
      container.removeEventListener("modelready", handleModelReady)
      cleanup?.()
    }
  }, [])

  React.useEffect(() => {
    if (hotspots.length === 0 || !containerRef.current) return

    animate(containerRef.current.querySelectorAll("[data-hotspot-card]"), {
      opacity: [0, 1],
      y: [16, 0],
      delay: stagger(90),
      duration: 450,
      ease: "out(3)",
    })
    animate(containerRef.current.querySelectorAll("[data-hotspot-arrow]"), {
      strokeDashoffset: [1, 0],
      delay: stagger(90),
      duration: 850,
      ease: "out(3)",
    })
  }, [hotspots])

  return (
    <section id="projects" className="min-h-svh w-full bg-learning-black">
      <div ref={containerRef} className="relative h-svh w-full">
        <div
          id="model-loader"
          className={`pointer-events-none absolute inset-0 z-10 grid place-items-center bg-learning-black/50 text-learning-background transition-opacity duration-300 ${modelReady ? "opacity-0" : ""}`}
          role="status"
          aria-live="polite"
          aria-hidden={modelReady}
        >
          <div className="flex items-center gap-3">
            <span
              id="loader-spinner"
              className="size-4 animate-spin rounded-full border-2 border-learning-primary border-r-transparent"
              aria-hidden="true"
            />
            <span id="loader-message">Carregando modelo 3D</span>
            <span id="loader-progress">0%</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-learning-background/20">
            <div
              id="loader-bar"
              className="h-full w-0 bg-learning-primary transition-[width] duration-150"
            />
          </div>
        </div>
        {hotspots.length > 0 && (
          <>
            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible text-learning-primary"
              aria-hidden="true"
            >
              {hotspots.map((hotspot) => (
                <path
                  key={hotspot.name}
                  data-hotspot-arrow={hotspot.name}
                  pathLength="1"
                  d="M 0 0"
                  className="fill-none stroke-current stroke-3 [stroke-dasharray:1] [stroke-dashoffset:1]"
                />
              ))}
            </svg>
            <button
              type="button"
              className="absolute bottom-1/2 left-10 z-40 inline-flex -translate-y-1/2 items-center gap-2 border-2 border-learning-black bg-learning-background px-3 py-2 text-sm font-medium text-learning-black shadow-[3px_3px_0_var(--color-learning-primary)] sm:px-4 sm:text-base"
              onClick={() =>
                containerRef.current?.dispatchEvent(
                  new CustomEvent("hotspotsresetrequest")
                )
              }
            >
              <ArrowCounterClockwiseIcon
                size={18}
                weight="bold"
                aria-hidden="true"
              />
              Voltar
            </button>
          </>
        )}
        {hotspots.map((hotspot) => (
          <React.Fragment key={hotspot.name}>
            <ArrowRightIcon
              data-hotspot-arrow-icon={hotspot.name}
              weight="bold"
              className="pointer-events-none absolute z-30 size-6 text-learning-primary"
              aria-hidden="true"
            />
            <article
              data-hotspot-card={hotspot.name}
              className="absolute z-30 w-[min(10.5rem,42vw)] border-2 border-learning-black bg-learning-background p-3 text-learning-black opacity-0 shadow-[4px_4px_0_var(--color-learning-primary)] sm:w-48 sm:p-4"
              style={hotspotCardPositions[hotspot.name]}
            >
              <h2 className="text-base leading-tight sm:text-lg">
                {hotspot.title}
              </h2>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 border border-learning-black bg-learning-primary px-2 py-1 text-sm font-medium sm:mt-3 sm:px-3"
                onClick={() =>
                  containerRef.current?.dispatchEvent(
                    new CustomEvent("hotspotaction", {
                      detail: { name: hotspot.name },
                    })
                  )
                }
              >
                Iniciar
                <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
              </button>
            </article>
          </React.Fragment>
        ))}

        {modelReady && hotspots.length === 0 && (
          <article className="absolute right-24 bottom-6 z-30 w-[min(26rem,calc(100%-2rem))] border-2 border-learning-black bg-learning-background p-4 text-learning-black shadow-[5px_5px_0_var(--color-learning-primary)] sm:bottom-8 sm:p-5">
            <h2 className="text-xl sm:text-2xl">Cloud Island</h2>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">
              Explore AWS, Azure e Google Cloud em ambientes simulados localmente
              com Floci e MiniStack. Aprenda os conceitos da cloud construindo e
              experimentando na prática
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 border border-learning-black bg-learning-primary px-3 py-2 text-sm font-medium sm:text-base"
              onClick={() =>
                containerRef.current?.dispatchEvent(
                  new CustomEvent("islandexplorerequest")
                )
              }
            >
              Explorar a ilha
              <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </article>
        )}
      </div>
    </section>
  )
}
