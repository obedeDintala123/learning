import React from "react"
import { cn } from "cn"

export type NavLink = {
  label: string
  href: string
}

export type NavSection = {
  id: string
  title?: string
}

interface ChangeNavContentProps {
  sections: NavSection[]
  links?: NavLink[]
  threshold?: number
  headingAs?: "h1" | "h2" | "p"
  className?: string
}

export default function ChangeNavContent({
  sections,
  links = [],

  threshold = 0.5,
  headingAs: Heading = "h1",
  className,
}: ChangeNavContentProps) {
  const [activeSection, setActiveSection] = React.useState(sections[0]?.id)

  const idsKey = sections.map((section) => section.id).join(",")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold }
    )

    idsKey.split(",").forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [idsKey, threshold])

  const current = sections.find((section) => section.id === activeSection)

  return (
    <nav
      className={cn(
        "main-nav absolute top-0 left-1/2 flex h-20 w-200 -translate-x-1/2 items-center justify-center gap-4 bg-learning-black text-white transition-all duration-500 [clip-path:polygon(0_0,100%_0,90%_100%,10%_100%)]",
        className
      )}
    >
      {current?.title ? (
        <Heading className="text-5xl">{current.title}</Heading>
      ) : (
        links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))
      )}
    </nav>
  )
}
