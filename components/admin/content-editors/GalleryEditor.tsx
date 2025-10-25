'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MediaPicker, MediaPreview } from '../MediaPicker';
import { 
  Plus, 
  Trash2, 
  Move, 
  Edit,
  Save,
  Image as ImageIcon,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { MediaAsset } from '@/lib/types';

// ImageThumbnail component with error handling
interface ImageThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

function ImageThumbnail({ src, alt, className }: ImageThumbnailProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      {error ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

interface GalleryImage {
  id: string;
  media: MediaAsset;
  caption?: string;
  alt?: string;
  isVisible: boolean;
  order: number;
}

interface GalleryContent {
  title: string;
  description?: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'lightbox';
  columns: number;
  images: GalleryImage[];
}

interface GalleryEditorProps {
  content: GalleryContent;
  onChange: (content: GalleryContent) => void;
  businessId?: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export function GalleryEditor({
  content,
  onChange,
  businessId,
  onSave,
  isSaving = false
}: GalleryEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const updateField = (field: keyof GalleryContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const addImages = (newMedia: MediaAsset | MediaAsset[]) => {
    const mediaArray = Array.isArray(newMedia) ? newMedia : [newMedia];
    const newImages: GalleryImage[] = mediaArray.map((media, index) => ({
      id: `${Date.now()}-${index}`,
      media,
      caption: '',
      alt: media.alt || media.originalName,
      isVisible: true,
      order: content.images.length + index
    }));

    updateField('images', [...content.images, ...newImages]);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = content.images
      .filter(img => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    updateField('images', updatedImages);
  };

  const updateImage = (imageId: string, updates: Partial<GalleryImage>) => {
    const updatedImages = content.images.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    updateField('images', updatedImages);
  };

  const toggleImageVisibility = (imageId: string) => {
    updateImage(imageId, { isVisible: !content.images.find(img => img.id === imageId)?.isVisible });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...content.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update order values
    const reorderedImages = newImages.map((img, index) => ({ ...img, order: index }));
    updateField('images', reorderedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const layoutOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'masonry', label: 'Masonry Layout' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'lightbox', label: 'Lightbox Gallery' }
  ];

  const columnOptions = [
    { value: 1, label: '1 Column' },
    { value: 2, label: '2 Columns' },
    { value: 3, label: '3 Columns' },
    { value: 4, label: '4 Columns' },
    { value: 5, label: '5 Columns' }
  ];

  return (
    <div className="space-y-6">
      {/* Gallery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Gallery Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Gallery Title</label>
              <Input
                value={content.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Our Gallery"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Layout Style</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content.layout}
                onChange={(e) => updateField('layout', e.target.value)}
              >
                {layoutOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of your gallery"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Columns</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content.columns}
                onChange={(e) => updateField('columns', parseInt(e.target.value))}
              >
                {columnOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gallery Images ({content.images.filter(img => img.isVisible).length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <MediaPicker
                trigger={
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Images
                  </Button>
                }
                onSelect={addImages}
                selectionMode="multiple"
                acceptedTypes={['image']}
                businessId={businessId}
                category="gallery"
                maxSelection={20}
                title="Select Gallery Images"
                description="Choose images for your gallery"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {content.images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images in gallery</h3>
              <p className="text-gray-500 mb-4">Add some images to get started with your gallery</p>
              <MediaPicker
                trigger={
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Images
                  </Button>
                }
                onSelect={addImages}
                selectionMode="multiple"
                acceptedTypes={['image']}
                businessId={businessId}
                category="gallery"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Gallery Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Preview ({content.layout} layout)</h4>
                <div 
                  className={`grid gap-2 ${
                    content.layout === 'grid' 
                      ? `grid-cols-${Math.min(content.columns, 4)}` 
                      : 'grid-cols-4'
                  }`}
                >
                  {content.images
                    .filter(img => img.isVisible)
                    .slice(0, 8)
                    .map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square bg-gray-200 rounded overflow-hidden"
                      >
                        <ImageThumbnail
                          src={image.media.thumbnailUrl || image.media.url}
                          alt={image.alt || image.caption || 'Gallery image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
                {content.images.filter(img => img.isVisible).length > 8 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{content.images.filter(img => img.isVisible).length - 8} more images
                  </p>
                )}
              </div>

              {/* Image Management */}
              <div className="space-y-3">
                {content.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`border rounded-lg p-4 ${!image.isVisible ? 'opacity-60 bg-gray-50' : 'bg-white'}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-move text-gray-400 mt-2">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <ImageThumbnail
                          src={image.media.thumbnailUrl || image.media.url}
                          alt={image.alt || image.caption || 'Gallery image'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Image Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{image.media.originalName}</span>
                            <Badge variant="outline">#{index + 1}</Badge>
                            {!image.isVisible && (
                              <Badge variant="secondary">Hidden</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => toggleImageVisibility(image.id)}
                              title={image.isVisible ? 'Hide image' : 'Show image'}
                            >
                              {image.isVisible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setEditingImage(editingImage === image.id ? null : image.id)}
                              title="Edit details"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => removeImage(image.id)}
                              title="Remove image"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {editingImage === image.id && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Caption</label>
                              <Input
                                value={image.caption || ''}
                                onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                                placeholder="Image caption"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Alt Text</label>
                              <Input
                                value={image.alt || ''}
                                onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                                placeholder="Alt text for accessibility"
                              />
                            </div>
                          </div>
                        )}

                        {image.caption && editingImage !== image.id && (
                          <p className="text-sm text-gray-600 italic">"{image.caption}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Gallery'}
          </Button>
        </div>
      )}
    </div>
  );
}