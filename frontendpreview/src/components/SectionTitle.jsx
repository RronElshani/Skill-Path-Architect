export default function SectionTitle({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const maxWidth = align === 'center' ? 'max-w-2xl' : 'max-w-3xl'

  return (
    <div className={`${alignment} ${maxWidth} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
  )
}
