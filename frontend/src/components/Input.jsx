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
  className = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
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
        className="input-field"
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
