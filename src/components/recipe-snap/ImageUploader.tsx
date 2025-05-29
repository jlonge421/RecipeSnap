"use client";

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUri: string) => void;
  isProcessing: boolean;
}

export function ImageUploader({ onImageUpload, isProcessing }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB. Please choose a smaller image.');
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.');
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageUpload(file, reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
        toast({
          title: 'Error',
          description: 'Could not read the selected image. Please try again.',
          variant: 'destructive',
        });
      }
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setError(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Upload Ingredient Photo</CardTitle>
        <CardDescription className="text-center">
          Snap a photo of your ingredients, and we&apos;ll suggest recipes!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
          onClick={handleButtonClick}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
               if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
               handleFileChange({ target: fileInputRef.current } as ChangeEvent<HTMLInputElement>);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <Image src={preview} alt="Ingredient preview" layout="fill" objectFit="contain" className="rounded-md p-2" />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <UploadCloud className="w-16 h-16 mb-2" />
              <p className="text-lg font-medium">Click or Drag & Drop to Upload</p>
              <p className="text-sm">PNG, JPG, GIF, WEBP up to 5MB</p>
            </div>
          )}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="flex items-center p-3 text-sm rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <Button
          onClick={handleButtonClick}
          className="w-full"
          disabled={isProcessing || !preview}
          variant="outline"
        >
          {isProcessing ? 'Processing...' : (preview ? 'Change Image' : 'Select Image')}
        </Button>
      </CardContent>
    </Card>
  );
}
