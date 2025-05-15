/**
 * Utilidad para detectar el tipo de dispositivo
 */

/**
 * Detecta si el dispositivo actual es móvil
 * @returns {boolean} True si es un dispositivo móvil, False si es escritorio
 */
export const isMobileDevice = (): boolean => {
  // Verificamos si window existe (para SSR)
  if (typeof window === 'undefined') return false;
  
  // Verificamos si el navegador tiene un userAgent que indique móvil
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
  );
};

/**
 * Formatea los datos del formulario para WhatsApp
 * @param formData Los datos del formulario
 * @returns {string} El texto formateado para WhatsApp
 */
export const formatWhatsAppMessage = (formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}): string => {
  // Convertir el tipo de servicio a nombre legible
  let serviceName = '';
  switch (formData.service) {
    case 'textil':
      serviceName = 'Serigrafía Textil - Estampados en telas';
      break;
    case 'publicitaria':
      serviceName = 'Serigrafía Publicitaria - Materiales promocionales';
      break;
    case 'industrial':
      serviceName = 'Serigrafía Industrial - Aplicaciones especializadas';
      break;
    case 'artistica':
      serviceName = 'Serigrafía Artística - Impresiones de arte';
      break;
    default:
      serviceName = formData.service;
  }

  return encodeURIComponent(
    `*Nuevo contacto desde la web de Alemana Serigrafía*\n\n` +
    `*Nombre:* ${formData.name}\n` +
    `*Email:* ${formData.email}\n` +
    `*Teléfono:* ${formData.phone || 'No proporcionado'}\n` +
    `*Servicio:* ${serviceName}\n\n` +
    `*Mensaje:*\n${formData.message}`
  );
};

/**
 * Formatea el asunto del correo electrónico
 * @returns {string} El asunto para el correo electrónico
 */
export const getEmailSubject = (): string => {
  return encodeURIComponent('Nueva consulta desde la web de Alemana Serigrafía');
};

/**
 * Formatea el cuerpo del correo electrónico
 * @param formData Los datos del formulario
 * @returns {string} El cuerpo del correo electrónico
 */
export const formatEmailBody = (formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}): string => {
  // Convertir el tipo de servicio a nombre legible
  let serviceName = '';
  switch (formData.service) {
    case 'textil':
      serviceName = 'Serigrafía Textil - Estampados en telas';
      break;
    case 'publicitaria':
      serviceName = 'Serigrafía Publicitaria - Materiales promocionales';
      break;
    case 'industrial':
      serviceName = 'Serigrafía Industrial - Aplicaciones especializadas';
      break;
    case 'artistica':
      serviceName = 'Serigrafía Artística - Impresiones de arte';
      break;
    default:
      serviceName = formData.service;
  }

  return encodeURIComponent(
    `Nuevo contacto desde la web de Alemana Serigrafía\n\n` +
    `Nombre: ${formData.name}\n` +
    `Email: ${formData.email}\n` +
    `Teléfono: ${formData.phone || 'No proporcionado'}\n` +
    `Servicio: ${serviceName}\n\n` +
    `Mensaje:\n${formData.message}`
  );
};
