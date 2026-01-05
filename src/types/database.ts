// Tipos para las tablas de Supabase

export interface Contact {
  id: number;
  phone: string;
  created_at: string;
  updated_in: string;
  last_interaction: string | null;
  values: Record<string, unknown>;
}

export interface ClientProfile {
  id: string; // uuid
  contact_id: number;
  owner_user_id: string | null;
  segment: ClientSegment;
  preferences: Record<string, unknown>;
  chatbot_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  address: string;
  cedula: string;
}

// Segmentos predefinidos para clientes
export type ClientSegment = 
  | 'retail'
  | 'wholesale'
  | 'corporate'
  | 'premium'
  | 'new'
  | 'web_lead';

export const CLIENT_SEGMENTS: { value: ClientSegment; label: string }[] = [
  { value: 'new', label: 'Nuevo Cliente' },
  { value: 'web_lead', label: 'Web Lead' },
  { value: 'retail', label: 'Retail / Minorista' },
  { value: 'wholesale', label: 'Mayorista' },
  { value: 'corporate', label: 'Corporativo / Empresa' },
  { value: 'premium', label: 'Premium' },
];

// Datos del formulario de registro
export interface RegisterFormData {
  fullName: string;
  cedula: string;
  email: string;
  address: string;
  segment: ClientSegment;
}

// Estado del formulario de registro
export interface RegisterFormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  contactExists: boolean;
  profileExists: boolean;
}
