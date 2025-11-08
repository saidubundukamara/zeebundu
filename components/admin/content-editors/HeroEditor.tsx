'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MediaPicker, MediaPreview } from '../MediaPicker';
import { 
  Save,
  Image as ImageIcon,
  Video,
  Eye,
  Palette,
  Type,
  Layout,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import { MediaAsset } from '@/lib/types';

interface HeroButton {
  id: string;
  text: string;
  link: string;
  style: 'primary' | 'secondary' | 'outline';
  isVisible: boolean;
}

interface HeroContent {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: MediaAsset;
  backgroundVideo?: MediaAsset;
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  textAlign: 'left' | 'center' | 'right';
  buttons: HeroButton[];
  style: {
    titleSize: 'sm' | 'md' | 'lg' | 'xl';
    titleColor: string;
    descriptionColor: string;
    backgroundColor: string;
  };
}

interface HeroEditorProps {
  content: HeroContent;
  onChange: (content: HeroContent) => void;
  businessId?: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export function HeroEditor({
  content,
  onChange,
  businessId,
  onSave,
  isSaving = false
}: HeroEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'design'>('content');
  const [showPreview, setShowPreview] = useState(false);

  // Normalize content with default values for missing properties
  const normalizedContent: HeroContent = useMemo(() => ({
    title: content.title || '',
    subtitle: content.subtitle,
    description: content.description || '',
    backgroundImage: content.backgroundImage,
    backgroundVideo: content.backgroundVideo,
    overlay: content.overlay || {
      enabled: false,
      color: '#000000',
      opacity: 50
    },
    textAlign: content.textAlign || 'left',
    buttons: content.buttons || [],
    style: content.style || {
      titleSize: 'lg',
      titleColor: '#ffffff',
      descriptionColor: '#e5e7eb',
      backgroundColor: '#1f2937'
    }
  }), [content]);

  const updateField = (field: keyof HeroContent, value: any) => {
    onChange({ ...normalizedContent, [field]: value });
  };

  const updateOverlay = (field: keyof HeroContent['overlay'], value: any) => {
    onChange({
      ...normalizedContent,
      overlay: { ...normalizedContent.overlay, [field]: value }
    });
  };

  const updateStyle = (field: keyof HeroContent['style'], value: any) => {
    onChange({
      ...normalizedContent,
      style: { ...normalizedContent.style, [field]: value }
    });
  };

  const addButton = () => {
    const newButton: HeroButton = {
      id: `btn-${Date.now()}`,
      text: 'Learn More',
      link: '#about',
      style: 'primary',
      isVisible: true
    };
    updateField('buttons', [...normalizedContent.buttons, newButton]);
  };

  const updateButton = (buttonId: string, field: keyof HeroButton, value: any) => {
    const updatedButtons = normalizedContent.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    );
    updateField('buttons', updatedButtons);
  };

  const removeButton = (buttonId: string) => {
    const updatedButtons = normalizedContent.buttons.filter(btn => btn.id !== buttonId);
    updateField('buttons', updatedButtons);
  };

  const buttonStyleOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'outline', label: 'Outline' }
  ];

  const titleSizeOptions = [
    { value: 'sm', label: 'Small', class: 'text-2xl md:text-3xl' },
    { value: 'md', label: 'Medium', class: 'text-3xl md:text-4xl' },
    { value: 'lg', label: 'Large', class: 'text-4xl md:text-5xl' },
    { value: 'xl', label: 'Extra Large', class: 'text-5xl md:text-6xl' }
  ];

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'design', label: 'Design', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative h-64 md:h-80 rounded-lg overflow-hidden"
              style={{ backgroundColor: normalizedContent.style.backgroundColor }}
            >
              {/* Background Media */}
              {normalizedContent.backgroundImage && (
                <img
                  src={normalizedContent.backgroundImage.url}
                  alt="Hero background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {normalizedContent.backgroundVideo && (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                >
                  <source src={normalizedContent.backgroundVideo.url} type="video/mp4" />
                </video>
              )}

              {/* Overlay */}
              {normalizedContent.overlay.enabled && (
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: normalizedContent.overlay.color,
                    opacity: normalizedContent.overlay.opacity / 100
                  }}
                />
              )}

              {/* Content */}
              <div className={`relative h-full flex items-center justify-center p-8`}>
                <div className={`text-${normalizedContent.textAlign} max-w-4xl`}>
                  <h1 
                    className={`font-bold mb-4 ${titleSizeOptions.find(t => t.value === normalizedContent.style.titleSize)?.class}`}
                    style={{ color: normalizedContent.style.titleColor }}
                  >
                    {normalizedContent.title || 'Your Hero Title'}
                  </h1>
                  {normalizedContent.subtitle && (
                    <h2 className="text-xl md:text-2xl mb-4" style={{ color: normalizedContent.style.descriptionColor }}>
                      {normalizedContent.subtitle}
                    </h2>
                  )}
                  <p 
                    className="text-lg md:text-xl mb-8"
                    style={{ color: normalizedContent.style.descriptionColor }}
                  >
                    {normalizedContent.description || 'Your hero description goes here'}
                  </p>
                  <div className="flex gap-4 justify-center">
                    {normalizedContent.buttons.filter(btn => btn.isVisible).map((button, index) => (
                      <button
                        key={button.id || `btn-preview-${index}`}
                        className={`px-6 py-3 rounded-lg font-medium ${
                          button.style === 'primary' ? 'bg-blue-600 text-white' :
                          button.style === 'secondary' ? 'bg-white text-gray-900' :
                          'border-2 border-white text-white'
                        }`}
                      >
                        {button.text || 'Button Text'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Hero Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Main Title</label>
              <Input
                value={normalizedContent.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Your compelling headline"
                className="text-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subtitle (Optional)</label>
              <Input
                value={normalizedContent.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Supporting headline"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={normalizedContent.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your business value proposition"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Text Alignment</label>
              <div className="flex gap-2">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' }
                ].map((align) => (
                  <Button
                    key={align.value}
                    variant={normalizedContent.textAlign === align.value ? 'default' : 'outline'}
                    onClick={() => updateField('textAlign', align.value)}
                  >
                    {align.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Call-to-Action Buttons</label>
                <Button
                  onClick={addButton}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Button
                </Button>
              </div>

              <div className="space-y-3">
                {normalizedContent.buttons.map((button, index) => {
                  // Ensure button has an ID for React key - use index as fallback
                  const buttonId = button.id || `btn-temp-${index}`;
                  return (
                  <div key={buttonId} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Button</span>
                        {!button.isVisible && <Badge variant="secondary">Hidden</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={button.isVisible}
                          onCheckedChange={(checked) => updateButton(button.id, 'isVisible', checked)}
                        />
                        <Button
                          variant="ghost"
                          onClick={() => removeButton(button.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Button Text</label>
                        <Input
                          value={button.text}
                          onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                          placeholder="Button text"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Link</label>
                        <Input
                          value={button.link}
                          onChange={(e) => updateButton(button.id, 'link', e.target.value)}
                          placeholder="/#section or https://..."
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Style</label>
                        <select
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={button.style}
                          onChange={(e) => updateButton(button.id, 'style', e.target.value)}
                        >
                          {buttonStyleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Background Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Background Image */}
            <div>
              <label className="text-sm font-medium mb-3 block">Background Image</label>
              <MediaPreview
                media={normalizedContent.backgroundImage || null}
                onSelect={() => {}}
                onRemove={() => updateField('backgroundImage', undefined)}
                placeholder="Select a background image"
                className="w-full h-48"
              />
              <div className="mt-2">
                <MediaPicker
                  trigger={
                    <Button variant="outline" >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {normalizedContent.backgroundImage ? 'Change Image' : 'Select Image'}
                    </Button>
                  }
                  onSelect={(media) => updateField('backgroundImage', Array.isArray(media) ? media[0] : media)}
                  selectionMode="single"
                  acceptedTypes={['image']}
                  businessId={businessId}
                  category="hero"
                  title="Select Hero Background Image"
                />
              </div>
            </div>

            {/* Background Video */}
            <div>
              <label className="text-sm font-medium mb-3 block">Background Video (Optional)</label>
              <MediaPreview
                media={normalizedContent.backgroundVideo || null}
                onSelect={() => {}}
                onRemove={() => updateField('backgroundVideo', undefined)}
                placeholder="Select a background video"
                className="w-full h-48"
              />
              <div className="mt-2">
                <MediaPicker
                  trigger={
                    <Button variant="outline" >
                      <Video className="w-4 h-4 mr-2" />
                      {normalizedContent.backgroundVideo ? 'Change Video' : 'Select Video'}
                    </Button>
                  }
                  onSelect={(media) => updateField('backgroundVideo', Array.isArray(media) ? media[0] : media)}
                  selectionMode="single"
                  acceptedTypes={['video']}
                  businessId={businessId}
                  category="hero"
                  title="Select Hero Background Video"
                />
              </div>
            </div>

            {/* Overlay Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Overlay</label>
                <Switch
                  checked={normalizedContent.overlay.enabled}
                  onCheckedChange={(checked) => updateOverlay('enabled', checked)}
                />
              </div>

              {normalizedContent.overlay.enabled && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Overlay Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={normalizedContent.overlay.color}
                        onChange={(e) => updateOverlay('color', e.target.value)}
                        className="w-8 h-8 rounded border"
                      />
                      <Input
                        value={normalizedContent.overlay.color}
                        onChange={(e) => updateOverlay('color', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Opacity ({normalizedContent.overlay.opacity}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={normalizedContent.overlay.opacity}
                      onChange={(e) => updateOverlay('opacity', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Design Tab */}
      {activeTab === 'design' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Visual Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title Size</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={normalizedContent.style.titleSize}
                  onChange={(e) => updateStyle('titleSize', e.target.value)}
                >
                  {titleSizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={normalizedContent.style.backgroundColor}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={normalizedContent.style.backgroundColor}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    placeholder="#1f2937"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={normalizedContent.style.titleColor}
                    onChange={(e) => updateStyle('titleColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={normalizedContent.style.titleColor}
                    onChange={(e) => updateStyle('titleColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={normalizedContent.style.descriptionColor}
                    onChange={(e) => updateStyle('descriptionColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={normalizedContent.style.descriptionColor}
                    onChange={(e) => updateStyle('descriptionColor', e.target.value)}
                    placeholder="#e5e7eb"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Hero Section'}
          </Button>
        </div>
      )}
    </div>
  );
}