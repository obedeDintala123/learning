import { ArrowRightIcon, ClockIcon, LockIcon } from "@phosphor-icons/react"

export type LabModuleProps = {
  /** Posição do módulo na trilha (1, 2, 3...) */
  order: number
  title: string
  description: string
  /** Ex.: "45 min" */
  duration?: string
  /** Serviços cobertos, ex.: ["S3", "IAM"] */
  services?: string[]
  /** Link para a página do módulo. Sem href, o módulo fica bloqueado */
  href?: string
}

export default function LabModule({
  order,
  title,
  description,
  duration,
  services = [],
  href,
}: LabModuleProps) {
  const locked = !href

  return (
    <article
      className={`flex h-full flex-col border-2 border-learning-black bg-learning-background p-5 text-learning-black shadow-[5px_5px_0_var(--color-learning-primary)] transition-transform ${
        locked ? "opacity-60" : "hover:-translate-x-0.5 hover:-translate-y-0.5"
      }`}
      aria-disabled={locked}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="grid size-10 place-items-center border-2 border-learning-black bg-learning-primary text-lg font-medium">
          {order}
        </span>

        {duration && (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <ClockIcon size={16} weight="bold" aria-hidden="true" />
            {duration}
          </span>
        )}
      </div>

      <h2 className="mt-4 text-xl leading-tight sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed sm:text-base">{description}</p>

      {services.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {services.map((service) => (
            <li
              key={service}
              className="border border-learning-black px-2 py-0.5 text-sm"
            >
              {service}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        {locked ? (
          <span className="inline-flex items-center gap-2 border border-learning-black px-3 py-2 text-sm font-medium sm:text-base">
            <LockIcon size={18} weight="bold" aria-hidden="true" />
            Em breve
          </span>
        ) : (
          <a
            href={href}
            className="inline-flex items-center gap-2 border border-learning-black bg-learning-primary px-3 py-2 text-sm font-medium sm:text-base"
          >
            Iniciar módulo
            <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}