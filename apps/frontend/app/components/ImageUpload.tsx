'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    name: string;
    label: string;
    required?: boolean;
    currentImage?: string; // URL da imagem atual
    onImageChange: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    name,
    label,
    required = false,
    currentImage,
    onImageChange,
}) => {
    const { formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
            onImageChange(file);
        }
    }, [onImageChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onImageChange(null);
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div
                {...getRootProps()}
                className={`mt-1 flex justify-center items-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                    isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : error
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
            >
                <input {...getInputProps()} name={name} />
                
                {preview ? (
                    <div className="relative w-full h-48">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-red-500 text-text-primary rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isDragActive
                                ? 'Solte o arquivo aqui...'
                                : 'Arraste e solte a imagem aqui, ou clique para selecionar'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            JPG, PNG ou WEBP (máx. 5MB)
                        </p>
                    </div>
                )}
            </div>
            
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
