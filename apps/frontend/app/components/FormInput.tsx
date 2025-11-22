'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date';
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
    className = '',
    ...rest
}) => {
    const { register, formState: { errors } } = useFormContext();
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`space-y-1 ${className}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type={isPassword && !showPassword ? 'password' : type}
                    placeholder={placeholder || label}
                    {...register(name)}
                    {...rest}
                    className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    label: string;
    options: { value: string | number; label: string }[];
    required?: boolean;
    className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    name,
    label,
    options,
    required = false,
    className = '',
    ...rest
}) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`space-y-1 ${className}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                {...register(name)}
                {...rest}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }`}
            >
                <option value="">Selecione...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
    name,
    label,
    required = false,
    className = '',
    ...rest
}) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`space-y-1 ${className}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={name}
                {...register(name)}
                {...rest}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }`}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
