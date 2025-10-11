'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Layout, 
  Building2, 
  Search,
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  PaintBucket,
  Users,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function ContentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - in real app, this would come from API
  const contentTemplates = [
    {
      id: 'gas-station',
      name: 'Gas Station',
      description: 'Complete template for gas stations and fuel services',
      sections: ['hero', 'services', 'about', 'gallery', 'testimonials', 'contact'],
      businesses: 3,
      lastUpdated: '2024-01-15',
      status: 'published'
    },
    {
      id: 'hotel',
      name: 'Hotel & Hospitality',
      description: 'Professional template for hotels and accommodation',
      sections: ['hero', 'rooms', 'amenities', 'gallery', 'reviews', 'booking'],
      businesses: 2,
      lastUpdated: '2024-01-12',
      status: 'published'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      description: 'Healthcare-focused template for pharmacies',
      sections: ['hero', 'services', 'products', 'about', 'contact'],
      businesses: 1,
      lastUpdated: '2024-01-10',
      status: 'draft'
    },
    {
      id: 'farming',
      name: 'Agriculture & Farming',
      description: 'Template for farms and agricultural businesses',
      sections: ['hero', 'products', 'about', 'gallery', 'contact'],
      businesses: 1,
      lastUpdated: '2024-01-08',
      status: 'published'
    }
  ];

  const businessContent = [
    {
      id: '1',
      businessName: 'QuickFuel Express',
      template: 'Gas Station',
      completedSections: 5,
      totalSections: 6,
      lastModified: '2024-01-15',
      status: 'published',
      slug: 'quickfuel-express'
    },
    {
      id: '2',
      businessName: 'Green Valley Farm',
      template: 'Agriculture & Farming',
      completedSections: 4,
      totalSections: 5,
      lastModified: '2024-01-14',
      status: 'draft',
      slug: 'green-valley-farm'
    },
    {
      id: '3',
      businessName: 'City Center Hotel',
      template: 'Hotel & Hospitality',
      completedSections: 6,
      totalSections: 6,
      lastModified: '2024-01-13',
      status: 'published',
      slug: 'city-center-hotel'
    },
    {
      id: '4',
      businessName: 'MediCare Pharmacy',
      template: 'Pharmacy',
      completedSections: 3,
      totalSections: 5,
      lastModified: '2024-01-12',
      status: 'draft',
      slug: 'medicare-pharmacy'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case 'draft':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><AlertCircle className="w-3 h-3 mr-1" />Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompletionColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage templates and content across all businesses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Content Guidelines
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{contentTemplates.filter(t => t.status === 'published').length}</p>
              </div>
              <Layout className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">{businessContent.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Sites</p>
                <p className="text-2xl font-bold">{businessContent.filter(b => b.status === 'published').length}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="businesses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Businesses
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search businesses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="gas-station">Gas Station</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="farming">Farming</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Business Content List */}
          <div className="grid gap-4">
            {businessContent.map((business) => (
              <Card key={business.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{business.businessName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <PaintBucket className="w-3 h-3 mr-1" />
                            {business.template}
                          </Badge>
                          {getStatusBadge(business.status)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Progress */}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getCompletionColor(business.completedSections, business.totalSections)} transition-all`}
                              style={{ width: `${(business.completedSections / business.totalSections) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {business.completedSections}/{business.totalSections}
                          </span>
                        </div>
                      </div>

                      {/* Last Modified */}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Last Modified</p>
                        <p className="text-sm font-medium mt-1">{business.lastModified}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/businesses/${business.id}/content`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/business/${business.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            {contentTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Layout className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-muted-foreground text-sm">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {template.sections.length} sections
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {template.businesses} businesses using
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Updated {template.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(template.status)}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Template Sections:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.sections.map((section) => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Usage</CardTitle>
                <CardDescription>Most popular business templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentTemplates.map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.businesses} businesses
                          </p>
                        </div>
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(template.businesses / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Completion</CardTitle>
                <CardDescription>Average completion rates by template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { template: 'Gas Station', completion: 85 },
                    { template: 'Hotel', completion: 95 },
                    { template: 'Pharmacy', completion: 60 },
                    { template: 'Farming', completion: 78 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.template}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              item.completion >= 90 ? 'bg-green-500' :
                              item.completion >= 70 ? 'bg-blue-500' :
                              item.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.completion}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest content updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Updated hero section', business: 'QuickFuel Express', time: '2 hours ago', type: 'edit' },
                  { action: 'Published new content', business: 'City Center Hotel', time: '5 hours ago', type: 'publish' },
                  { action: 'Added gallery images', business: 'Green Valley Farm', time: '1 day ago', type: 'media' },
                  { action: 'Created new template', business: 'System', time: '2 days ago', type: 'template' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'edit' ? 'bg-blue-500' :
                      activity.type === 'publish' ? 'bg-green-500' :
                      activity.type === 'media' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.business}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}