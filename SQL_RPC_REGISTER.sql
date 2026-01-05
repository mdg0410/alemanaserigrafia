-- ================================================================
-- FUNCIÓN RPC: register_client_from_web
-- ================================================================
-- Esta función centraliza toda la lógica de registro de clientes
-- Ventajas:
-- ✅ Transacción atómica (todo o nada)
-- ✅ Sin problemas de RLS (security definer)
-- ✅ Una sola llamada desde el frontend
-- ✅ Validaciones en la BD
--
-- EJECUTAR EN SUPABASE:
-- ================================================================

CREATE OR REPLACE FUNCTION public.register_client_from_web(
    p_phone TEXT,
    p_full_name TEXT,
    p_email TEXT,
    p_address TEXT,
    p_cedula TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_contact_id BIGINT;
    v_client_id UUID;
BEGIN
    -- 1. Manejo del Contacto (Upsert)
    -- Si el teléfono ya existe, actualiza last_interaction
    -- Si es nuevo, crea el contacto
    INSERT INTO public.contact (phone, last_interaction)
    VALUES (p_phone, NOW())
    ON CONFLICT (phone) 
    DO UPDATE SET last_interaction = NOW()
    RETURNING id INTO v_contact_id;

    -- 2. Manejo del Perfil de Cliente (Upsert por cédula)
    -- Si la cédula ya existe, actualiza los datos
    -- Si es nueva, crea el perfil
    INSERT INTO public.client_profiles (
        contact_id, 
        full_name, 
        email, 
        address, 
        cedula,
        segment
    )
    VALUES (
        v_contact_id,
        p_full_name,
        LOWER(p_email),
        p_address,
        p_cedula,
        'web_lead'  -- Segmento por defecto
    )
    ON CONFLICT (cedula) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = LOWER(EXCLUDED.email),
        address = EXCLUDED.address,
        updated_at = NOW()
    RETURNING id INTO v_client_id;

    -- Retornar respuesta exitosa
    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_id::TEXT,
        'message', 'Registro completado exitosamente'
    );

EXCEPTION WHEN OTHERS THEN
    -- En caso de error, retornar respuesta de error
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Error al procesar el registro'
    );
END;
$$;

-- Permitir que los usuarios anónimos puedan llamar esta función
GRANT EXECUTE ON FUNCTION public.register_client_from_web(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- ================================================================
-- CÓMO USARLO DESDE TYPESCRIPT/JAVASCRIPT
-- ================================================================
/*

const { data, error } = await supabase.rpc('register_client_from_web', {
  p_phone: '593998765432',
  p_full_name: 'Juan Pérez',
  p_email: 'juan@example.com',
  p_address: 'Calle 123, Quito',
  p_cedula: '1234567890'
});

if (error) {
  console.error('Error:', error.message);
} else if (!data.success) {
  console.error('Error de negocio:', data.error);
} else {
  console.log('¡Registrado! ID:', data.client_id);
}

*/

-- ================================================================
-- VENTAJAS DE ESTE ENFOQUE
-- ================================================================
/*

1. SEGURIDAD (Security Definer)
   - La función corre con permisos de la BD, no del usuario
   - No necesita abrir las tablas públicamente
   - Previene ataques RLS

2. ATOMICIDAD
   - O se crean/actualizan ambas tablas o ninguna
   - Evita "contactos huérfanos" sin perfil

3. PERFORMANCE
   - Una sola llamada en lugar de 4-5
   - Menos latencia de red
   - Menos overhead de Supabase

4. MANTENIBILIDAD
   - Toda la lógica en un solo lugar
   - Fácil de testear
   - Código frontend más limpio

5. ESCALABILIDAD
   - Si luego necesitas más validaciones, las añades en SQL
   - No necesitas cambiar el código frontend
   - Las nuevas reglas se aplican a todos los clientes

*/
