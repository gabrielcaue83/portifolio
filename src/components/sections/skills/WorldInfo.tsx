type Props = { title: string; text: string; chips: string[]; className?: string }

/** Cartão com o que é a habilidade, sobreposto ao mundo. */
export function WorldInfo({ title, text, chips, className = '' }: Props) {
  return (
    <div className={`world-info ${className}`}>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="chips">
        {chips.map((c) => (
          <span key={c} className="chip">
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
