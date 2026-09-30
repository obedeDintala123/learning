import React from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import ChangeNavContent from "../change-nav-content"

interface LabHeaderProps {
  name: string
  sections?: {
    id: string
    title?: string
  }[]
  links?: {
    label: string
    href: string
  }[]
  progressBar?: React.ReactNode
}

export default function LabHeader({
  name,
  sections = [],
  links = [],
  progressBar,
}: LabHeaderProps) {
  return (
    <header
      id="header-lab"
      className="fixed top-0 z-50 flex w-full items-center justify-between px-12 py-8 opacity-0"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4">
        <h1 className="header-lab-title truncate text-xl leading-tight sm:text-2xl">
          {name}
        </h1>
        {links && (
          <ChangeNavContent
            sections={sections}
            links={links}
            headingAs="p"
          />
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
