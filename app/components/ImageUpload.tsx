'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  imageUrl: string;
  disabled?: boolean;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  imageUrl,
  disabled = false,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled,
  });

  if (imageUrl) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-600" />
              Screenshot Attached
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onImageRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative rounded-lg overflow-hidden border">
            <img
              src={imageUrl}
              alt="Bug screenshot"
              className="w-full h-auto max-h-64 object-contain bg-gray-50"
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Upload
        className={`mx-auto h-12 w-12 mb-4 ${
          isDragActive ? 'text-primary' : 'text-gray-400'
        }`}
      />
      {isDragActive ? (
        <p className="text-primary font-medium">Drop the screenshot here...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">
            Drag & drop a screenshot here
          </p>
          <p className="text-sm text-gray-500">
            or click to select from your computer
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, JPEG, or WebP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}