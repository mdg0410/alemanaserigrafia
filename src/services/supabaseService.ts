import { createClient } from '@supabase/supabase-js';
import type { Contact, ClientProfile, RegisterFormData } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Busca un contacto por número de teléfono
 */
export const findContactByPhone = async (phone: string): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contact')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error finding contact:', error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuevo contacto
 */
export const createContact = async (phone: string): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contact')
    .insert({
      phone,
      values: {}
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }

  return data;
};

/**
 * Actualiza la última interacción del contacto
 */
export const updateContactLastInteraction = async (contactId: number): Promise<void> => {
  const { error } = await supabase
    .from('contact')
    .update({ last_interaction: new Date().toISOString() })
    .eq('id', contactId);

  if (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

/**
 * Verifica si ya existe un client_profile para el contacto
 */
export const findClientProfileByContactId = async (contactId: number): Promise<ClientProfile | null> => {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('contact_id', contactId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error finding client profile:', error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuevo perfil de cliente
 */
export const createClientProfile = async (
  contactId: number,
  formData: RegisterFormData
): Promise<ClientProfile> => {
  const { data, error } = await supabase
    .from('client_profiles')
    .insert({
      contact_id: contactId,
      full_name: formData.fullName,
      email: formData.email,
      cedula: formData.cedula,
      address: formData.address,
      segment: formData.segment,
      preferences: {},
      chatbot_metadata: {},
      owner_user_id: null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client profile:', error);
    throw error;
  }

  return data;
};

/**
 * Flujo completo de registro:
 * 1. Busca o crea el contacto
 * 2. Verifica si ya tiene un perfil
 * 3. Crea el perfil si no existe
 */
export const registerClient = async (
  phone: string,
  formData: RegisterFormData
): Promise<{ contact: Contact; profile: ClientProfile; isNewContact: boolean; isNewProfile: boolean }> => {
  let isNewContact = false;
  let isNewProfile = false;

  // Paso 1: Buscar o crear contacto
  let contact = await findContactByPhone(phone);
  
  if (!contact) {
    contact = await createContact(phone);
    isNewContact = true;
  } else {
    // Actualizar última interacción si ya existía
    await updateContactLastInteraction(contact.id);
  }

  // Paso 2: Verificar si ya tiene perfil
  let profile = await findClientProfileByContactId(contact.id);

  if (profile) {
    // Ya tiene perfil registrado
    throw new Error('PROFILE_EXISTS');
  }

  // Paso 3: Crear perfil
  profile = await createClientProfile(contact.id, formData);
  isNewProfile = true;

  return { contact, profile, isNewContact, isNewProfile };
};

export default supabase;
