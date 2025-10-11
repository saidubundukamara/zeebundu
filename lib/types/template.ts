import { ObjectId } from 'mongodb';
import { ContentSection } from './content';

export interface BusinessTemplate {
  _id?: ObjectId;
  name: string;
  slug: string;
  component: string;
  displayName: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  colorScheme: ColorScheme;
  previewImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateSection {
  name: ContentSection;
  displayName: string;
  required: boolean;
  fields: TemplateField[];
  description?: string;
}

export interface TemplateField {
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  validation?: ValidationRule[];
  options?: FieldOption[];
  defaultValue?: any;
  help?: string;
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'url' 
  | 'number' 
  | 'select' 
  | 'multiselect'
  | 'image' 
  | 'video' 
  | 'file'
  | 'array' 
  | 'object'
  | 'boolean'
  | 'color'
  | 'date'
  | 'datetime'
  | 'icon-picker';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'regex' | 'custom';
  value: any;
  message: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface TemplateComponentProps {
  business: any;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}