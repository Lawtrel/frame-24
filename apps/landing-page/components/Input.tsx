import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, name, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <input
            id={name}
            name={name}
            className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none transition-all duration-150 
        ${error
                ? 'border-red-600 focus:border-red-500'
                : 'border-gray-600 focus:border-red-700 focus:ring-1 focus:ring-red-700'
            }`}
            {...props}
        />
    </div>
);

export default Input;