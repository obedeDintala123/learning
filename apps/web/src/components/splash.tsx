import React from "react"
import { CloudIcon } from "@phosphor-icons/react"
import { animate } from "animejs"

export default function SplashScreen() {
  const iconRef = React.useRef<SVGSVGElement>(null)
  const progressRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const icon = iconRef.current
    const progress = progressRef.current

    if (!icon || !progress) return

    const iconIntro = animate(icon, {
      opacity: [0, 1],
      scale: [0.72, 1],
      y: [18, 0],
      duration: 650,
      ease: "out(3)",
    })
    const iconPulse = animate(icon, {
      scale: [1, 1.08, 1],
      duration: 1200,
      delay: 650,
      loop: true,
      ease: "inOut(2)",
    })
    const progressAnimation = animate(progress, {
      width: ["0%", "100%"],
      duration: 1900,
      ease: "inOut(2)",
      onComplete: () => {
        const splash = document.querySelector<HTMLElement>("#splash")
        splash?.classList.add("pointer-events-none", "opacity-0")

        window.setTimeout(() => {
          if (splash) splash.hidden = true
          document.documentElement.dataset.splashComplete = "true"
          document.dispatchEvent(new Event("splashcomplete"))
        }, 350)
      },
    })

    return () => {
      iconIntro.cancel()
      iconPulse.cancel()
      progressAnimation.cancel()
    }
  }, [])

  return (
    <div
      id="splash"
      className="fixed inset-0 z-[100] grid min-h-svh place-items-center bg-learning-black text-learning-background transition-opacity duration-300"
      role="status"
      aria-label="Carregando"
    >
      <div className="flex w-[min(18rem,70vw)] flex-col items-center">
        <CloudIcon
          ref={iconRef}
          size={76}
          weight="duotone"
          className="mb-8 text-learning-primary"
          aria-hidden="true"
        />

        <div
          className="h-1 w-full overflow-hidden bg-learning-background/20"
          role="progressbar"
          aria-label="Carregamento"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div ref={progressRef} className="h-full w-0 bg-learning-primary" />
        </div>
      </div>
    </div>
  )
}
