'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FolderOpen, 
  BarChart3,
  HardDrive,
  Users,
  Building2
} from 'lucide-react';

export default function MediaLibraryPage() {
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleMediaSelect = (media: any) => {
    setSelectedMedia(Array.isArray(media) ? media : [media]);
  };

  const handleUploadComplete = (media: any) => {
    setUploadSuccess(true);
    // Auto-hide success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  // Mock stats - in real app, these would come from API
  const mediaStats = {
    totalFiles: 247,
    totalSize: '2.3 GB',
    imagesCount: 198,
    videosCount: 49,
    businessesCount: 12,
    avgFileSize: '9.5 MB'
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage all media assets across your businesses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {mediaStats.totalSize} used
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3" />
            {mediaStats.totalFiles} files
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{mediaStats.totalFiles}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{mediaStats.imagesCount}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">{mediaStats.videosCount}</p>
              </div>
              <Video className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Businesses</p>
                <p className="text-2xl font-bold">{mediaStats.businessesCount}</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Upload successful!</span>
              <span className="text-sm">Your media has been added to the library.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Assets</CardTitle>
              <CardDescription>
                Browse and manage all media files across your businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaLibrary
                onMediaSelect={handleMediaSelect}
                selectionMode="multiple"
                showUpload={false}
              />
            </CardContent>
          </Card>

          {/* Selection Info */}
          {selectedMedia.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Media ({selectedMedia.length})</CardTitle>
                <CardDescription>
                  Perform bulk actions on selected media files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Download Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Tags
                  </Button>
                  <Button variant="outline" size="sm">
                    Move to Folder
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Add new images and videos to your media library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                }}
                maxFiles={20}
                maxFileSize={50}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>
                  Track your media storage consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Images</span>
                    <span className="text-sm font-medium">1.8 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Videos</span>
                    <span className="text-sm font-medium">500 MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Used</span>
                      <span className="text-sm font-bold">{mediaStats.totalSize} / 5 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '46%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Types</CardTitle>
                <CardDescription>
                  Breakdown of media types in your library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">JPEG</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">PNG</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">MP4</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">WebP</span>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Usage by Business</CardTitle>
                <CardDescription>
                  Media consumption across different businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'QuickFuel Express', files: 45, size: '450 MB', color: 'bg-blue-500' },
                    { name: 'Green Valley Farm', files: 38, size: '380 MB', color: 'bg-green-500' },
                    { name: 'City Center Hotel', files: 62, size: '820 MB', color: 'bg-purple-500' },
                    { name: 'MediCare Pharmacy', files: 23, size: '190 MB', color: 'bg-orange-500' },
                    { name: 'Global assets', files: 79, size: '480 MB', color: 'bg-gray-500' }
                  ].map((business, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${business.color}`}></div>
                        <div>
                          <span className="font-medium">{business.name}</span>
                          <p className="text-sm text-muted-foreground">{business.files} files</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{business.size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}