import { Link } from 'react-router-dom'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  fullWidth = false,
  ...rest
}) {
  const classes = [
    variants[variant] || variants.primary,
    sizes[size] || '',
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-60 pointer-events-none' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  )
}
