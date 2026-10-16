import type { ButtonHTMLAttributes } from 'react'

type Variant = 'yellow' | 'pink' | 'cyan' | 'green' | 'orange' | 'purple'

const variants: Record<Variant, string> = {
  yellow: 'bg-pop-yellow',
  pink: 'bg-pop-pink',
  cyan: 'bg-pop-cyan',
  green: 'bg-pop-green',
  orange: 'bg-pop-orange',
  purple: 'bg-pop-purple text-white',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'yellow', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`cartoon-box cartoon-press inline-flex items-center gap-2 rounded-xl px-6 py-3 font-display text-lg uppercase ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
