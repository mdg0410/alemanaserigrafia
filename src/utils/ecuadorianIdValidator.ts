export const validateEcuadorianId = (id: string): boolean => {
  // Verificar longitud
  if (id.length !== 10) return false;

  // Verificar que todos sean números
  if (!/^\d+$/.test(id)) return false;

  // Verificar código de provincia
  const province = parseInt(id.substring(0, 2));
  if (![...Array(24).keys()].map(i => i + 1).concat([30, 90, 99]).includes(province)) {
    return false;
  }

  // Verificar tercer dígito
  const thirdDigit = parseInt(id[2]);
  if (thirdDigit > 5) return false;

  // Algoritmo de validación
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const verifier = parseInt(id[9]);
  
  let sum = 0;
  for (let i = 0; i < coefficients.length; i++) {
    let value = parseInt(id[i]) * coefficients[i];
    if (value > 9) value -= 9;
    sum += value;
  }

  const residue = sum % 10;
  const calculatedVerifier = residue === 0 ? 0 : 10 - residue;

  return calculatedVerifier === verifier;
};

export const formatPhoneNumber = (phone: string): string => {
  // Eliminar todo excepto números
  const cleaned = phone.replace(/\D/g, '');
  
  // Si empieza con 0, quitarlo
  const withoutLeadingZero = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
  
  // Si no tiene código de país, agregar +593
  const withCountryCode = withoutLeadingZero.startsWith('593') 
    ? withoutLeadingZero 
    : `593${withoutLeadingZero}`;
  
  return `+${withCountryCode}`;
};
