import { Controller } from "react-hook-form"
import { Select } from "@/components/ui/select"

interface SelectFieldProps {
  name: string
  label: string
  options: { label: string; value: string }[]
  control: any
  defaultValue?: string
}

export const SelectField = ({
  name,
  label,
  options,
  control,
  defaultValue,
}: SelectFieldProps) => (
  <div>
    <label>{label}</label>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ""}
      render={({ field }) => (
        <Select {...field}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    />
  </div>
)
