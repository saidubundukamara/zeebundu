'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Image, 
  Video, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Copy,
  Tag,
  Calendar,
  HardDrive,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { MediaAsset } from '@/lib/types';

// Helper function to safely extract URL string
function getUrlString(urlValue: any): string {
  if (!urlValue) return '';
  if (typeof urlValue === 'string') return urlValue;
  if (typeof urlValue === 'object') {
    // Handle cases where URL might be in object format
    return urlValue.url || urlValue.href || urlValue.src || '';
  }
  return String(urlValue);
}

// MediaThumbnail component with error handling and loading states
interface MediaThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string; // Original URL to use if thumbnail fails
}

function MediaThumbnail({ src, alt, className, fallbackSrc }: MediaThumbnailProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Ensure src is a string
  const srcString = getUrlString(src);
  const fallbackString = fallbackSrc ? getUrlString(fallbackSrc) : null;

  // Reset states when src changes
  useEffect(() => {
    if (srcString && srcString.trim() !== '') {
      setLoading(true);
      setError(false);
      setUseFallback(false);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [srcString, fallbackString]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Try using the fallback URL if thumbnail failed
    if (!useFallback && fallbackString && fallbackString !== srcString) {
      setUseFallback(true);
      setLoading(true);
      setError(false);
      return;
    }
    
    // Only log in development mode to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.warn('Image failed to load:', {
        src: srcString,
        fallback: fallbackString,
        triedFallback: useFallback
      });
    }
    setLoading(false);
    setError(true);
  };
  
  if (!srcString || srcString.trim() === '') {
    return (
      <div className={`${className || 'w-full h-full'} bg-gray-100 flex items-center justify-center rounded`}>
        <Image className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  // Use fallback if thumbnail failed
  const imageSrc = useFallback && fallbackString ? fallbackString : srcString;

  return (
    <div className={`relative ${className || 'w-full h-full'} overflow-hidden rounded`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <Image className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-500 block">Failed to load</span>
          </div>
        </div>
      ) : (
        <img
          key={useFallback ? 'fallback' : 'primary'}
          src={imageSrc}
          alt={alt || 'Media thumbnail'}
          className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
}

interface MediaLibraryProps {
  businessId?: string;
  onMediaSelect?: (media: MediaAsset | MediaAsset[]) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  filterCategory?: string;
  showUpload?: boolean;
}

export function MediaLibrary({
  businessId,
  onMediaSelect,
  selectionMode = 'none',
  filterCategory,
  showUpload = true,
}: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(filterCategory || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [editingMedia, setEditingMedia] = useState<MediaAsset | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  const fetchMedia = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (businessId) params.append('businessId', businessId);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const currentPage = reset ? 0 : page;
      params.append('limit', ITEMS_PER_PAGE.toString());
      params.append('skip', (currentPage * ITEMS_PER_PAGE).toString());

      const response = await fetch(`/api/media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');

      const result = await response.json();
      
      // Ensure media items have required properties with proper URL extraction
      const normalizedMedia = (result.data || []).map((item: any) => {
        const url = getUrlString(item.url || item.src || item.image);
        const thumbnailUrl = getUrlString(item.thumbnailUrl || item.thumbnail || item.url || item.src || item.image);
        
        // Normalize mimeType - ensure it's lowercase and properly formatted
        let mimeType = (item.mimeType || item.type || '').toLowerCase().trim();
        
        // If mimeType is missing but we have originalName, try to infer it
        if (!mimeType && item.originalName) {
          const ext = item.originalName.split('.').pop()?.toLowerCase();
          const mimeTypeMap: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'bmp': 'image/bmp',
            'avif': 'image/avif',
            'ico': 'image/x-icon',
          };
          mimeType = mimeTypeMap[ext || ''] || '';
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Normalizing media item:', {
            original: item.url,
            normalized: url,
            thumbnail: thumbnailUrl,
            mimeType: mimeType,
            originalMimeType: item.mimeType,
            originalName: item.originalName,
            isImage: mimeType.startsWith('image/')
          });
        }
        
        return {
          ...item,
          url,
          thumbnailUrl,
          mimeType: mimeType,
          originalName: item.originalName || item.name || item.filename || 'media',
          tags: Array.isArray(item.tags) ? item.tags : [],
          alt: item.alt || '',
          size: item.size || 0,
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });
      
      if (reset) {
        setMedia(normalizedMedia);
        setPage(0);
      } else {
        setMedia(prev => [...prev, ...normalizedMedia]);
      }
      
      setHasMore(result.pagination?.hasMore || false);
      
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [businessId, selectedType, selectedCategory, searchTerm, page]);

  useEffect(() => {
    fetchMedia(true);
  }, [businessId, selectedType, selectedCategory, searchTerm]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 0) {
      fetchMedia(false);
    }
  }, [page]);

  const handleMediaSelection = (mediaItem: MediaAsset) => {
    if (selectionMode === 'none') return;

    const mediaId = mediaItem._id?.toString();
    if (!mediaId) return;

    if (selectionMode === 'single') {
      setSelectedMedia(new Set([mediaId]));
      onMediaSelect?.(mediaItem);
    } else {
      const newSelection = new Set(selectedMedia);
      if (newSelection.has(mediaId)) {
        newSelection.delete(mediaId);
      } else {
        newSelection.add(mediaId);
      }
      setSelectedMedia(newSelection);
      
      const selectedItems = media.filter(m => 
        m._id && newSelection.has(m._id.toString())
      );
      onMediaSelect?.(selectedItems);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete media');

      setMedia(prev => prev.filter(m => m._id?.toString() !== mediaId));
      setSelectedMedia(prev => {
        const newSelection = new Set(prev);
        newSelection.delete(mediaId);
        return newSelection;
      });

      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Failed to delete media:', error);
      toast.error('Failed to delete media');
    }
  };

  const updateMedia = async (mediaId: string, updates: Partial<MediaAsset>) => {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update media');

      const result = await response.json();
      
      setMedia(prev => prev.map(m => 
        m._id?.toString() === mediaId ? result.data : m
      ));

      toast.success('Media updated successfully');
      setEditingMedia(null);
    } catch (error) {
      console.error('Failed to update media:', error);
      toast.error('Failed to update media');
    }
  };

  const copyUrl = (url: string) => {
    const urlString = getUrlString(url);
    navigator.clipboard.writeText(urlString);
    toast.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  // Helper function to check if media is an image
  const isImageMedia = (mediaItem: MediaAsset, mediaUrl: string): boolean => {
    // First check mimeType (most reliable)
    if (mediaItem.mimeType) {
      const mimeType = mediaItem.mimeType.toLowerCase().trim();
      if (mimeType.startsWith('image/')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Detected as image by mimeType:', mimeType, mediaItem.originalName);
        }
        return true;
      }
    }
    
    // Fallback: check URL for image extensions
    if (mediaUrl) {
      const urlLower = mediaUrl.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.avif', '.ico'];
      const hasImageExt = imageExtensions.some(ext => urlLower.includes(ext));
      if (hasImageExt && process.env.NODE_ENV === 'development') {
        console.log('Detected as image by URL extension:', mediaUrl, mediaItem.originalName);
      }
      return hasImageExt;
    }
    
    // Last resort: if it's not a video, assume it might be an image (for Cloudinary URLs)
    if (mediaItem.mimeType && !mediaItem.mimeType.toLowerCase().startsWith('video/')) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Assuming image (not video):', mediaItem.mimeType, mediaItem.originalName);
      }
      return true;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('NOT detected as image:', {
        mimeType: mediaItem.mimeType,
        url: mediaUrl,
        originalName: mediaItem.originalName
      });
    }
    
    return false;
  };

  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <Image className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="hero">Hero Images</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="testimonials">Testimonials</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Info */}
      {selectedMedia.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedMedia.size} item{selectedMedia.size > 1 ? 's' : ''} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMedia(new Set())}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Media Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
          : 'space-y-2'
      }>
        {media.map((mediaItem) => {
          const isSelected = selectedMedia.has(mediaItem._id?.toString() || '');
          const mediaUrl = getUrlString(mediaItem.url);
          const thumbnailUrl = getUrlString(mediaItem.thumbnailUrl);
          
          if (viewMode === 'grid') {
            return (
              <Card 
                key={mediaItem._id?.toString()}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleMediaSelection(mediaItem)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square relative mb-2 overflow-hidden rounded">
                    {isImageMedia(mediaItem, mediaUrl) ? (
                      <MediaThumbnail
                        src={thumbnailUrl || mediaUrl}
                        fallbackSrc={thumbnailUrl ? mediaUrl : undefined}
                        alt={mediaItem.alt || mediaItem.originalName || 'Media thumbnail'}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                        {getMediaIcon(mediaItem.mimeType || '')}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            {mediaItem.mimeType || 'unknown'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectionMode !== 'none' && (
                      <Checkbox
                        checked={isSelected}
                        className="absolute top-2 left-2"
                      />
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/80 hover:bg-white"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingMedia(mediaItem)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(mediaUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a 
                            href={mediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a 
                            href={mediaUrl} 
                            download={mediaItem.originalName}
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMedia(mediaItem._id?.toString() || '')}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate">
                      {mediaItem.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(mediaItem.size)}
                    </p>
                    {mediaItem.tags && mediaItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mediaItem.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {mediaItem.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mediaItem.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          } else {
            return (
              <Card 
                key={mediaItem._id?.toString()}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleMediaSelection(mediaItem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {selectionMode !== 'none' && (
                      <Checkbox checked={isSelected} />
                    )}
                    
                    <div className="flex-shrink-0 w-16 h-16">
                      {isImageMedia(mediaItem, mediaUrl) ? (
                        <MediaThumbnail
                          src={thumbnailUrl || mediaUrl}
                          fallbackSrc={thumbnailUrl ? mediaUrl : undefined}
                          alt={mediaItem.alt || mediaItem.originalName}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          {getMediaIcon(mediaItem.mimeType || '')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {mediaItem.originalName}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <HardDrive className="h-3 w-3 mr-1" />
                          {formatFileSize(mediaItem.size)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(mediaItem.createdAt)}
                        </span>
                        {mediaItem.dimensions && (
                          <span>
                            {mediaItem.dimensions.width} × {mediaItem.dimensions.height}
                          </span>
                        )}
                      </div>
                      {mediaItem.tags && mediaItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mediaItem.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingMedia(mediaItem)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(mediaUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a 
                            href={mediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a 
                            href={mediaUrl} 
                            download={mediaItem.originalName}
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMedia(mediaItem._id?.toString() || '')}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          }
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {media.length === 0 && !loading && (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Upload some media to get started.'}
          </p>
        </div>
      )}

      {/* Edit Media Dialog */}
      {editingMedia && (
        <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {editingMedia.mimeType.startsWith('image/') ? (
                  <img
                    src={getUrlString(editingMedia.url)}
                    alt={editingMedia.alt || editingMedia.originalName}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getMediaIcon(editingMedia.mimeType)}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editAlt">Alt Text</Label>
                  <Textarea
                    id="editAlt"
                    value={editingMedia.alt || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      alt: e.target.value
                    })}
                    placeholder="Describe this image..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="editTags">Tags (comma-separated)</Label>
                  <Input
                    id="editTags"
                    value={(editingMedia.tags || []).join(', ')}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="e.g., hero, gallery, product"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingMedia(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => updateMedia(
                      editingMedia._id?.toString() || '',
                      {
                        alt: editingMedia.alt,
                        tags: editingMedia.tags
                      }
                    )}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}