interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-xs transition-all duration-200 placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-50"
            : "border-gray-200 hover:border-gray-300"
        } ${className ?? ""}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
