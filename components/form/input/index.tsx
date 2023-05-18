import { InputHTMLAttributes } from "react";
import "./styles.css";

interface InputProps {
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "date"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "checkbox-group"
    | "number";
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    error?: string;
  };
  caption?: string;
  label: string;
  title?: string;
  options?: (string | { value: string; label: string })[];
  helperText?: string;
}

const Input = ({
  name,
  type = "text",
  validation,
  caption,
  label,
  options,
  helperText,
  title,
  ...rest
}: InputProps): JSX.Element => {
  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    id: name,
    name,
    title: title || caption || helperText,
    type,
    required: validation?.required,
    "aria-required": validation?.required,
    ...rest,
  };

  let inputEl: JSX.Element;

  switch (type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "date":
      inputEl = <input {...inputProps} />;
      break;
    case "textarea":
      // @ts-ignore
      inputEl = <textarea {...inputProps} />;
      break;
    case "radio":
      inputEl = (
        <>
          {options?.map((option: any, index) => (
            <div key={option.value}>
              <input
                id={`${name}_${index}`}
                type="radio"
                value={typeof option === "object" ? option.value : option}
                {...inputProps}
              />
              <label htmlFor={`${name}_${index}`}>
                {typeof option === "object" ? option.label : option}
              </label>
            </div>
          ))}
        </>
      );
      break;
    case "checkbox":
      inputEl = <input id={name} type="checkbox" {...inputProps} />;
      break;
    case "select":
      inputEl = (
        // @ts-ignore
        <select {...inputProps} multiple={name.endsWith("[]")}>
          <option value="" disabled>
            {options && options.length > 0 ? label : ""}
          </option>
          {options?.map((option, index) => {
            if (typeof option === "string") {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            } else {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            }
          })}
        </select>
      );
      break;

    case "checkbox-group":
      inputEl = (
        <>
          {options?.map((option, index) => {
            if (typeof option === "string") {
              return (
                <div key={option}>
                  <input
                    id={`${name}_${index}`}
                    type="checkbox"
                    value={option}
                    {...inputProps}
                  />
                  <label htmlFor={`${name}_${index}`}>{option}</label>
                </div>
              );
            } else {
              return (
                <div key={option.value}>
                  <input
                    id={`${name}_${index}`}
                    type="checkbox"
                    value={option.value}
                    {...inputProps}
                  />
                  <label htmlFor={`${name}_${index}`}>{option.label}</label>
                </div>
              );
            }
          })}
        </>
      );
      break;
    default:
      inputEl = <input {...inputProps} />;
      console.error(`Unsupported input type: ${type}`);
  }

  // label = label || (name.includes(".") && name.split(".")[1]) || name;

  return (
    <div key={name} className="input">
      {label && <label htmlFor={name}>{label}</label>}
      {inputEl}
      {validation?.error && (
        <span className="error-msg">{validation?.error}</span>
      )}
      {helperText && <span className="helper-text">{helperText}</span>}
      <span className="caption">{caption}</span>
    </div>
  );
};

export default Input;
