import React, { ChangeEvent } from "react";

interface Option {
    label: string;
    value: string;
}

interface Props {
    options: Option[];
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    defaultValue?: string;
}

const Select: React.FC<Props> = ({ options, onChange, defaultValue }) => {
    return (
        <select
            defaultValue={defaultValue}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
            {options.map(({ label, value }) => {
                return (
                    <option key={value} value={value}>
                        {label}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
