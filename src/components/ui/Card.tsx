import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tilt?: 'left' | 'right' | 'none'
  /** Classe de fundo, ex: `bg-pop-pink` */
  color?: string
}

const tilts = {
  left: '-rotate-2',
  right: 'rotate-2',
  none: '',
}

export function Card({ tilt = 'none', color = 'bg-white', className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${color} ${tilts[tilt]} ${className}`}
      {...props}
    />
  )
}
