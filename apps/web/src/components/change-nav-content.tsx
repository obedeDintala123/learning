import React from "react"

export default function ChangeNavContent() {
  const [activeSection, setActiveSection] = React.useState("hero")

  React.useEffect(() => {
    const ids = ["hero", "projects"]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.5 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
  return (
    <nav className="transition-all main-nav absolute top-0 left-1/2 flex h-20 w-200 -translate-x-1/2 items-center justify-center gap-4 bg-learning-black text-white duration-500 [clip-path:polygon(0_0,100%_0,90%_100%,10%_100%)]">
      {activeSection === "hero" ? (
        <>
          <a href="/">Home</a>
          <a href="#projects">Projetos</a>
          <a href="#about">Sobre</a>
        </>
      ) : activeSection === "projects" ? (
        <h1 className="text-5xl">Projetos</h1>
      ) : (
         <h1 className="text-5xl">Sobre</h1>
      )}
    </nav>
  )
}
