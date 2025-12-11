import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'AlemanaSerigrafiaKey';

/**
 * Descifra un texto cifrado con AES
 * @param encryptedText - Texto cifrado en formato Base64
 * @returns Texto descifrado o null si falla
 */
export const decryptAES = (encryptedText: string): string | null => {
  try {
    // Decodificar URL encoding si existe
    const decoded = decodeURIComponent(encryptedText);
    
    // Descifrar con AES
    const bytes = CryptoJS.AES.decrypt(decoded, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      console.error('Decryption resulted in empty string');
      return null;
    }
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting:', error);
    return null;
  }
};

/**
 * Cifra un texto con AES (útil para testing)
 * @param plainText - Texto a cifrar
 * @returns Texto cifrado en formato Base64
 */
export const encryptAES = (plainText: string): string => {
  return CryptoJS.AES.encrypt(plainText, ENCRYPTION_KEY).toString();
};

/**
 * Valida si un string parece ser un número de teléfono válido
 * @param phone - Número a validar
 * @returns true si es válido
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Debe ser solo números y tener entre 10 y 15 dígitos
  return /^\d{10,15}$/.test(phone);
};
