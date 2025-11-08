'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaLibrary } from './MediaLibrary';
import { MediaUpload } from './MediaUpload';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter,
  Check,
  X,
  Eye,
  Info
} from 'lucide-react';
import { MediaAsset } from '@/lib/types';

interface MediaPickerProps {
  trigger?: React.ReactNode;
  onSelect: (media: MediaAsset | MediaAsset[]) => void;
  selectionMode?: 'single' | 'multiple';
  acceptedTypes?: ('image' | 'video')[];
  businessId?: string;
  category?: string;
  maxSelection?: number;
  selectedMedia?: MediaAsset[];
  title?: string;
  description?: string;
}

export function MediaPicker({
  trigger,
  onSelect,
  selectionMode = 'single',
  acceptedTypes = ['image', 'video'],
  businessId,
  category,
  maxSelection = 10,
  selectedMedia = [],
  title = 'Select Media',
  description = 'Choose media from your library or upload new files'
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Reset selection when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelected([...selectedMedia]);
    }
  };

  // Handle clicking on a media item
  const handleMediaClick = (media: MediaAsset | MediaAsset[]) => {
    const items = Array.isArray(media) ? media : [media];
    const item = items[0];
    if (!item) return;

    if (selectionMode === 'single') {
      // Single mode: replace selection
      setSelected([item]);
    } else {
      // Multiple mode: toggle selection
      setSelected(prev => {
        const isSelected = prev.some(m => m._id?.toString() === item._id?.toString());
        
        if (isSelected) {
          // Remove from selection
          return prev.filter(m => m._id?.toString() !== item._id?.toString());
        } else {
          // Add to selection if under limit
          if (prev.length < maxSelection) {
            return [...prev, item];
          }
          return prev;
        }
      });
    }
  };

  // Confirm and close
  const handleConfirm = () => {
    if (selected.length === 0) return;
    
    if (selectionMode === 'single') {
      onSelect(selected[0]);
    } else {
      onSelect(selected);
    }
    setOpen(false);
  };

  // Cancel and close
  const handleCancel = () => {
    setSelected([...selectedMedia]);
    setOpen(false);
  };

  // Handle successful upload
  const handleUploadComplete = (media: MediaAsset) => {
    // Add uploaded media to selection
    if (selectionMode === 'single') {
      setSelected([media]);
    } else if (selected.length < maxSelection) {
      setSelected(prev => [...prev, media]);
    }
    // Switch to library tab
    setActiveTab('library');
  };

  // Remove item from selection
  const handleRemove = (mediaId: string) => {
    setSelected(prev => prev.filter(m => m._id?.toString() !== mediaId));
  };

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2">
      <ImageIcon className="w-4 h-4" />
      Select Media
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Selection Summary */}
          {selected.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  {selected.length} {selectionMode === 'single' ? 'item' : `item${selected.length > 1 ? 's' : ''}`} selected
                  {selectionMode === 'multiple' && ` (max ${maxSelection})`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected([])}
                  className="text-blue-700 hover:text-blue-800 h-auto py-1"
                >
                  Clear
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((item) => (
                  <div
                    key={item._id?.toString()}
                    className="flex items-center gap-2 bg-white border rounded px-2 py-1 text-xs"
                  >
                    <span className="truncate max-w-32">{item.originalName}</span>
                    <button
                      onClick={() => handleRemove(item._id?.toString() || '')}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Media Library
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload New
                </TabsTrigger>
              </TabsList>

              {activeTab === 'library' && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search media..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-48"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-blue-50' : ''}
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Filter Info */}
            {showFilters && (
              <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {acceptedTypes.map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}s only
                    </Badge>
                  ))}
                  {businessId && (
                    <Badge variant="secondary" className="text-xs">
                      Business specific
                    </Badge>
                  )}
                  {category && (
                    <Badge variant="secondary" className="text-xs">
                      Category: {category}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <TabsContent value="library" className="h-full overflow-auto m-0 p-4">
                {/* Preview of selected items */}
                {selected.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3">Selected Preview:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {selected.map((item) => {
                        // Helper to get URL string safely
                        const getItemUrl = (urlValue: any): string => {
                          if (!urlValue) return '';
                          if (typeof urlValue === 'string') return urlValue;
                          if (typeof urlValue === 'object') {
                            return urlValue.url || urlValue.href || urlValue.src || '';
                          }
                          return String(urlValue);
                        };

                        const itemUrl = getItemUrl(item.url);
                        const itemThumbnail = getItemUrl(item.thumbnailUrl);
                        const isImage = item.mimeType?.toLowerCase().startsWith('image/') || 
                          (itemUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif|ico)(\?|$)/i.test(itemUrl)) ||
                          (!item.mimeType?.toLowerCase().startsWith('video/') && itemUrl);
                        
                        return (
                        <div key={item._id?.toString()} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-100">
                            {isImage && (itemThumbnail || itemUrl) ? (
                              <img
                                src={itemThumbnail || itemUrl}
                                alt={item.alt || item.originalName || 'Selected media'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Try fallback to original URL if thumbnail fails
                                  const img = e.currentTarget;
                                  if (itemThumbnail && img.src !== itemUrl) {
                                    img.src = itemUrl;
                                  } else {
                                    img.style.display = 'none';
                                    img.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/></svg></div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemove(item._id?.toString() || '')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            type="button"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs truncate">{item.originalName}</p>
                          </div>
                          <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <MediaLibrary
                  businessId={businessId}
                  onMediaSelect={handleMediaClick}
                  selectionMode={selectionMode}
                  filterCategory={category}
                  showUpload={false}
                />
              </TabsContent>

              <TabsContent value="upload" className="h-full overflow-auto m-0">
                <MediaUpload
                  businessId={businessId}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                  }}
                  acceptedFileTypes={
                    acceptedTypes.includes('image') && acceptedTypes.includes('video')
                      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
                      : acceptedTypes.includes('image')
                      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                      : ['video/mp4', 'video/webm']
                  }
                  maxFiles={selectionMode === 'single' ? 1 : maxSelection}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              {selectionMode === 'single' 
                ? 'Select one item' 
                : `Select up to ${maxSelection} items`
              }
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                type="button"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// MediaPreview component for showing selected media
interface MediaPreviewProps {
  media: MediaAsset | string | { url?: string; thumbnailUrl?: string; mimeType?: string; originalName?: string; alt?: string; dimensions?: any; [key: string]: any } | null;
  onRemove?: () => void;
  onSelect?: () => void;
  placeholder?: string;
  className?: string;
}

export function MediaPreview({ 
  media, 
  onRemove, 
  onSelect, 
  placeholder = "No media selected",
  className = "w-full h-48"
}: MediaPreviewProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Normalize media object to handle different formats (URL string, partial object, full MediaAsset)
  const normalizedMedia = React.useMemo(() => {
    if (!media) return null;
    
    // If it's a string, convert to MediaAsset-like object
    if (typeof media === 'string') {
      const urlStr = media;
      return {
        url: urlStr,
        thumbnailUrl: urlStr,
        mimeType: /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(urlStr) ? 'image/jpeg' : 'video/mp4',
        originalName: urlStr.split('/').pop() || 'media',
        alt: urlStr.split('/').pop() || 'media',
        dimensions: undefined
      };
    }
    
    // If it's an object, ensure it has required properties
    const mediaObj = media as any;
    const url = mediaObj.url || mediaObj.src || mediaObj.image || '';
    return {
      url: url,
      thumbnailUrl: mediaObj.thumbnailUrl || mediaObj.thumbnail || url,
      mimeType: mediaObj.mimeType || mediaObj.type || '',
      originalName: mediaObj.originalName || mediaObj.name || mediaObj.filename || (typeof url === 'string' ? url.split('/').pop() : 'media') || 'media',
      alt: mediaObj.alt || mediaObj.originalName || mediaObj.name || mediaObj.filename || (typeof url === 'string' ? url.split('/').pop() : 'media') || 'media',
      dimensions: mediaObj.dimensions
    };
  }, [media]);

  React.useEffect(() => {
    if (normalizedMedia) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [normalizedMedia?.url, normalizedMedia?.thumbnailUrl]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!normalizedMedia || !normalizedMedia.url) {
    return (
      <div 
        className={`${className} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors`}
        onClick={onSelect}
        role="button"
        tabIndex={0}
      >
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{placeholder}</p>
          <p className="text-xs text-gray-400 mt-1">Click to select media</p>
        </div>
      </div>
    );
  }

  const getImageSrc = () => {
    if (normalizedMedia.thumbnailUrl && !imageError) {
      return normalizedMedia.thumbnailUrl;
    }
    return normalizedMedia.url;
  };

  // Safely check if media is an image
  const isImage = normalizedMedia.mimeType?.startsWith('image/') || 
    (normalizedMedia.url && /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(normalizedMedia.url));

  return (
    <div className={`${className} relative rounded-lg overflow-hidden border group bg-gray-50`}>
      {isImage ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {imageError && (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Image unavailable</p>
                <p className="text-xs text-gray-400">{normalizedMedia.originalName}</p>
              </div>
            </div>
          )}
          
          {!imageError && (
            <img
              src={getImageSrc()}
              alt={normalizedMedia.alt || normalizedMedia.originalName}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </div>
            <p className="text-sm font-medium">{normalizedMedia.originalName}</p>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
          {onSelect && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSelect}
              className="bg-white text-black hover:bg-gray-100"
              type="button"
            >
              <Eye className="w-4 h-4 mr-1" />
              Change
            </Button>
          )}
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="bg-red-500 text-white hover:bg-red-600"
              type="button"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
        <p className="text-white text-sm font-medium truncate">{normalizedMedia.originalName}</p>
        <p className="text-gray-300 text-xs">
          {normalizedMedia.dimensions ? `${normalizedMedia.dimensions.width} × ${normalizedMedia.dimensions.height}` : 'Video'}
        </p>
      </div>
    </div>
  );
}