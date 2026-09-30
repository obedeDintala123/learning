import React from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"

interface LabHeaderProps {
  name: string
  nav?: {
    label: string
    href: string
  }[]
  progressBar?: React.ReactNode
}

export default function LabHeader({
  name,
  nav = [],
  progressBar,
}: LabHeaderProps) {
  return (
    <header
      id="header"
      className="fixed top-0 z-50 flex w-full items-center justify-between px-12 py-8 opacity-0"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4">
        <h1 className="truncate text-xl leading-tight sm:text-2xl">{name}</h1>
        {nav.length > 0 && (
          <nav className="main-nav absolute top-0 left-1/2 flex h-20 w-200 -translate-x-1/2 items-center justify-center gap-4 bg-learning-black text-white transition-all duration-500 [clip-path:polygon(0_0,100%_0,90%_100%,10%_100%)]">
            <ul className="flex items-center gap-4 text-sm sm:gap-6 sm:text-base">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {progressBar && (
        <div className="border-t border-learning-black px-4 py-2 sm:px-8">
          {progressBar}
        </div>
      )}

      <a
        href="/"
        className="inline-flex shrink-0 items-center gap-2 border border-learning-black bg-learning-primary px-3 py-1 text-sm font-medium shadow-[3px_3px_0_var(--color-learning-black)]"
      >
        <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
        Voltar
      </a>
    </header>
  )
}
