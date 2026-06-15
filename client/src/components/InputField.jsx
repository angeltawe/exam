// src/components/InputField.jsx
// A reusable labeled input. Using one component for all form fields keeps
// styling consistent and reduces repeated markup across forms.

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  as = "input", // pass as="textarea" for multi-line fields
}) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
