export const validateEcuadorianId = (id: string): boolean => {
    // 1. Limpieza y Verificación de Longitud
    const processedId = id.replace(/\D/g, ''); // Eliminar no-dígitos
    const len = processedId.length;

    // RUC (13 dígitos) o Cédula (10 dígitos)
    if (len !== 10 && len !== 13) return false;
    
    // Si es RUC, verificar que el sufijo sea '001'
    if (len === 13) {
        if (processedId.substring(10) !== '001') {
            return false;
        }
    }

    // El número base para la validación es siempre los primeros 10 dígitos.
    const baseId = processedId.substring(0, 10);
    const verifierDigit = parseInt(baseId[9]);
    const thirdDigit = parseInt(baseId[2]);
    const province = parseInt(baseId.substring(0, 2));

    // 2. Verificaciones Iniciales Comunes
    
    // Verificar código de provincia (01 a 24, 30 (extranjeros), 90 (no usados), 99 (otros/especiales))
    if (province < 1 || (province > 24 && province !== 30 && province !== 90 && province !== 99)) return false;
    
    // RUCs de Sociedades (9) o Sector Público (6) o Persona Natural (0-5)
    if (thirdDigit < 0 || thirdDigit > 9) return false;


    // ######################################################
    // 3. Lógica de Validación (Factor 10 vs Factor 11)
    // ######################################################

    let calculatedVerifier = -1;

    // ------------------------------------------------------
    // A. RUC y Cédula de Personas Naturales (3er dígito < 6)
    // ------------------------------------------------------
    if (thirdDigit >= 0 && thirdDigit <= 5) {
        const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let sum = 0;
        
        for (let i = 0; i < coefficients.length; i++) {
            let value = parseInt(baseId[i]) * coefficients[i];
            if (value > 9) value -= 9; // El "truco" del factor 10
            sum += value;
        }
        
        const residue = sum % 10;
        calculatedVerifier = residue === 0 ? 0 : 10 - residue;

    // ------------------------------------------------------
    // B. RUC de Sociedades (3er dígito 9) y Público (3er dígito 6) - Factor 11
    // ------------------------------------------------------
    } else if (thirdDigit === 6 || thirdDigit === 9) {
        
        // Coeficientes diferentes para RUC de sociedades (Factor 11)
        const isPublic = thirdDigit === 6;
        const coefficients = isPublic 
            ? [3, 2, 7, 6, 5, 4, 3, 2] // Coeficientes Sector Público (Factor 11)
            : [4, 3, 2, 7, 6, 5, 4, 3, 2]; // Coeficientes Sociedades Privadas (Factor 11)

        const limit = isPublic ? 8 : 9; // El sector público solo usa 8 coeficientes
        let sum = 0;

        for (let i = 0; i < limit; i++) {
            sum += parseInt(baseId[i]) * coefficients[i];
        }

        const modulo = isPublic ? 11 : 10;
        
        const residue = sum % modulo;
        
        if (isPublic) {
            // Factor 11 (Público): si el residuo es 0, el verificador es 0
            calculatedVerifier = residue === 0 ? 0 : modulo - residue;
            if (residue === 1) return false; // RUC público con residuo 1 es inválido
        } else {
            // Factor 10 (Privado)
            calculatedVerifier = residue === 0 ? 0 : 10 - residue;
        }

    } else {
        // Cualquier otro valor de tercer dígito no es válido (ej: 7, 8)
        return false;
    }

    // 4. Verificación Final
    return calculatedVerifier === verifierDigit;
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
