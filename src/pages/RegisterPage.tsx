import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faIdCard, 
  faEnvelope, 
  faMapMarkerAlt, 
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faPhone,
  faTags
} from '@fortawesome/free-solid-svg-icons';
import { validateEcuadorianId } from '../utils/ecuadorianIdValidator';
import { decryptAES, isValidPhoneNumber } from '../utils/encryption';
import { registerClient } from '../services/supabaseService';
import type { RegisterFormData } from '../types/database';
import { CLIENT_SEGMENTS } from '../types/database';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const encryptedPhone = searchParams.get('data');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    cedula: '',
    email: '',
    address: '',
    segment: 'new'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'profile_exists'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [decryptedPhone, setDecryptedPhone] = useState<string | null>(null);

  // Formatear el teléfono para mostrar
  const formattedPhone = decryptedPhone ? `+${decryptedPhone}` : '';

  // Descifrar y verificar el teléfono al cargar
  useEffect(() => {
    const checkPhone = async () => {
      if (!encryptedPhone) {
        setSubmitStatus('error');
        setErrorMessage('Enlace inválido - No se proporcionó información');
        setIsCheckingPhone(false);
        return;
      }

      // Descifrar el número de teléfono
      const phone = decryptAES(encryptedPhone);
      
      if (!phone) {
        setSubmitStatus('error');
        setErrorMessage('Enlace inválido - No se pudo descifrar la información');
        setIsCheckingPhone(false);
        return;
      }

      if (!isValidPhoneNumber(phone)) {
        setSubmitStatus('error');
        setErrorMessage('Enlace inválido - Número de teléfono no válido');
        setIsCheckingPhone(false);
        return;
      }

      setDecryptedPhone(phone);
      setIsCheckingPhone(false);
    };

    checkPhone();
  }, [encryptedPhone]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    // Validar nombre
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar cédula o RUC
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula o RUC es requerida';
    } else if (formData.cedula.length === 10) {
      // Validar cédula
      if (!validateEcuadorianId(formData.cedula)) {
        newErrors.cedula = 'La cédula no es válida';
      }
    } else if (formData.cedula.length === 13) {
      // Validar RUC (primeros 10 dígitos deben ser cédula válida)
      if (!validateEcuadorianId(formData.cedula.substring(0, 10))) {
        newErrors.cedula = 'El RUC no es válido';
      }
      if (!formData.cedula.endsWith('001')) {
        newErrors.cedula = 'El RUC debe terminar en 001';
      }
    } else {
      newErrors.cedula = 'La cédula debe tener 10 dígitos o el RUC 13 dígitos';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'La dirección debe ser más específica';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para cédula, solo permitir números
    if (name === 'cedula') {
      const numericValue = value.replace(/\D/g, '').slice(0, 13);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo al escribir
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !decryptedPhone) return;

    setIsLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await registerClient(decryptedPhone, formData);
      
      if (response.success) {
        setSubmitStatus('success');
        // Opcional: redirigir después de un tiempo
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.message || 'Error al registrar. Por favor intenta nuevamente.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setSubmitStatus('error');
        
        // Detectar errores específicos
        if (error.message.includes('PROFILE_EXISTS')) {
          setSubmitStatus('profile_exists');
          setErrorMessage('Ya existe un perfil registrado con este número de teléfono');
        } else if (error.message.includes('cedula')) {
          setErrorMessage('Esta cédula/RUC ya está registrada');
        } else if (error.message.includes('email')) {
          setErrorMessage('Este correo ya está registrado');
        } else {
          setErrorMessage(error.message || 'Error al registrar. Por favor intenta nuevamente.');
        }
      } else {
        setSubmitStatus('error');
        setErrorMessage('Error desconocido al registrar');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading inicial
  if (isCheckingPhone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-400" />
        </motion.div>
      </div>
    );
  }

  // Error de teléfono inválido o descifrado fallido
  if (submitStatus === 'error' && !decryptedPhone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Enlace Inválido</h2>
          <p className="text-gray-300">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  // Éxito
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-400 mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-300 mb-6">
            Gracias por registrarte, {formData.fullName.split(' ')[0]}. 
            Pronto nos pondremos en contacto contigo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Ir al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  // Perfil ya existe
  if (submitStatus === 'profile_exists') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ya Estás Registrado</h2>
          <p className="text-gray-300 mb-6">
            Este número de teléfono ya tiene un perfil asociado. 
            Si necesitas actualizar tus datos, contáctanos directamente.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Registro de Cliente
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Completa tus datos para continuar
          </motion.p>
        </div>

        {/* Phone Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-center justify-center gap-3"
        >
          <FontAwesomeIcon icon={faPhone} className="text-blue-400" />
          <span className="text-blue-300 font-medium">{formattedPhone}</span>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 space-y-6"
        >
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Nombre Completo
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez García"
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.fullName ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.fullName}
              </motion.p>
            )}
          </div>

          {/* Cédula o RUC */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faIdCard} className="mr-2" />
              Cédula o RUC
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Ej: 1712345678 o 1712345678001"
              maxLength={13}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.cedula ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {errors.cedula && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.cedula}
              </motion.p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.cedula.length}/13 - {formData.cedula.length === 10 ? 'Cédula' : formData.cedula.length === 13 ? 'RUC' : 'Ingresa 10 dígitos para cédula o 13 para RUC'}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: correo@ejemplo.com"
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.email ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Dirección
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Av. Principal 123, Sector Norte, Ciudad"
              rows={3}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.address ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
            />
            {errors.address && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.address}
              </motion.p>
            )}
          </div>

          {/* Segmento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faTags} className="mr-2" />
              Tipo de Cliente
            </label>
            <select
              name="segment"
              value={formData.segment}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {CLIENT_SEGMENTS.map(segment => (
                <option key={segment.value} value={segment.value} className="bg-slate-800">
                  {segment.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error general */}
          {submitStatus === 'error' && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {errorMessage}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Registrando...
              </>
            ) : (
              'Completar Registro'
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Al registrarte aceptas nuestros términos y condiciones
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
