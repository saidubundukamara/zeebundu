'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image, Video, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';

interface MediaUploadProps {
  businessId?: string;
  onUploadComplete?: (media: any) => void;
  onUploadError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploaded?: boolean;
  mediaId?: string;
}

export function MediaUpload({
  businessId,
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
  maxFiles = 10,
  maxFileSize = 10,
}: MediaUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [globalTags, setGlobalTags] = useState('');
  const [globalCategory, setGlobalCategory] = useState('general');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file type.`);
          }
        });
      });

      // Process accepted files
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
      }));

      setFiles((prevFiles) => {
        const combined = [...prevFiles, ...newFiles];
        if (combined.length > maxFiles) {
          toast.error(`Maximum ${maxFiles} files allowed.`);
          return combined.slice(0, maxFiles);
        }
        return combined;
      });
    },
    [maxFiles, maxFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize * 1024 * 1024,
    maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFile = async (fileData: UploadFile, index: number, alt?: string, tags?: string) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    if (businessId) formData.append('businessId', businessId);
    if (alt) formData.append('alt', alt);
    formData.append('tags', tags || globalTags);
    formData.append('category', globalCategory);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = {
          ...newFiles[index],
          progress: 100,
          uploaded: true,
          mediaId: result.data._id,
        };
        return newFiles;
      });

      onUploadComplete?.(result.data);
      toast.success(`${fileData.file.name} uploaded successfully!`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = {
          ...newFiles[index],
          error: errorMessage,
        };
        return newFiles;
      });

      onUploadError?.(errorMessage);
      toast.error(`Failed to upload ${fileData.file.name}: ${errorMessage}`);
    }
  };

  const uploadAllFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map((fileData, index) => {
        if (fileData.uploaded || fileData.error) return Promise.resolve();
        
        return uploadFile(fileData, index);
      });

      await Promise.all(uploadPromises);
      
    } catch (error) {
      console.error('Batch upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supports images and videos up to {maxFileSize}MB each
                </p>
              </div>
            )}
          </div>

          {/* Global Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <Label htmlFor="globalTags">Tags (comma-separated)</Label>
              <Input
                id="globalTags"
                value={globalTags}
                onChange={(e) => setGlobalTags(e.target.value)}
                placeholder="e.g., hero, gallery, product"
              />
            </div>
            <div>
              <Label htmlFor="globalCategory">Category</Label>
              <Select value={globalCategory} onValueChange={setGlobalCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="hero">Hero Images</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="testimonials">Testimonials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Files to Upload ({files.length})</CardTitle>
              <Button
                onClick={uploadAllFiles}
                disabled={uploading || files.every(f => f.uploaded || f.error)}
                className="ml-auto"
              >
                {uploading ? 'Uploading...' : 'Upload All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {fileData.file.type.startsWith('image/') ? (
                      <img
                        src={fileData.preview}
                        alt={fileData.file.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(fileData.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.file.name}
                      </p>
                      {fileData.uploaded && (
                        <Badge variant="success">Uploaded</Badge>
                      )}
                      {fileData.error && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileData.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {fileData.progress > 0 && fileData.progress < 100 && (
                      <Progress value={fileData.progress} className="mt-2" />
                    )}

                    {/* Error Message */}
                    {fileData.error && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{fileData.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}