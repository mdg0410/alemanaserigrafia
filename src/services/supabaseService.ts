import { createClient } from '@supabase/supabase-js';
import type { Contact, ClientProfile, RegisterFormData } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Flujo completo de registro usando RPC (Remote Procedure Call)
 * 
 * Ventajas:
 * - Una sola llamada a la BD (transacción atómica)
 * - Sin problemas de RLS
 * - Más seguro (security definer)
 * - Validaciones en la BD
 */
export const registerClient = async (
  phone: string,
  formData: RegisterFormData
): Promise<{ client_id: string; success: boolean; message: string }> => {
  // Llamar el RPC que maneja todo el flujo
  const { data, error } = await supabase.rpc('register_client_from_web', {
    p_phone: phone,
    p_full_name: formData.fullName,
    p_email: formData.email.toLowerCase(),
    p_address: formData.address,
    p_cedula: formData.cedula,
  });

  if (error) {
    console.error('Error en RPC de registro:', error);
    throw new Error(error.message);
  }

  // Verificar respuesta del RPC
  if (!data || !data.success) {
    const errorMsg = data?.error || 'Error desconocido al registrar cliente';
    console.error('Error de negocio:', errorMsg);
    throw new Error(errorMsg);
  }

  return {
    client_id: data.client_id,
    success: data.success,
    message: data.message,
  };
};

export default supabase;
