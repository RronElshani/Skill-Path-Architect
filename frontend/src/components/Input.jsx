export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  hint,
  autoComplete,
  required = false,
  className = '',
  tone = 'light'
}) {
  const labelClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const hintClass = tone === 'dark' ? 'text-slate-500' : 'text-slate-500'
  const fieldClass = tone === 'dark'
    ? 'input-field border-slate-700 bg-slate-900 text-white placeholder:text-slate-500'
    : 'input-field'

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium ${labelClass}`}>
          {label}
          {required && <span className="ml-0.5 text-brand-600">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={fieldClass}
      />
      {hint && <p className={`text-xs ${hintClass}`}>{hint}</p>}
    </div>
  )
}
