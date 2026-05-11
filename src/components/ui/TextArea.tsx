interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextArea({ label, id, className, ...props }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        className={`mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-xs transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none ${className ?? ""}`}
        rows={3}
        {...props}
      />
    </div>
  );
}
