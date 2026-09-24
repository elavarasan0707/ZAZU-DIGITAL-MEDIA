export type UserRole = 'admin' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  category: 'SEO' | 'Social Media' | 'PPC & Ads' | 'Branding' | 'Web Development' | 'Strategy' | string;
  service: string;
  description: string;
  results: string;
  metrics: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  order: number;
  active: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  planType: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  popular?: boolean;
  isCustom?: boolean;
  order: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  projectTopic: string;
  message: string;
  status: 'new' | 'in_progress' | 'in-progress' | 'replied' | 'archived' | 'closed' | string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorRole: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string;
  createdAt?: string;
}

export interface SiteSettings {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  address?: string;
  updatedAt?: string;
}
