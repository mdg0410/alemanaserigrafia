import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faList, 
  faMessage,
  faMapMarkerAlt,
  faClock,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Validación del formulario
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }
    
    if (!formData.service) {
      errors.service = 'Por favor selecciona un servicio';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simular envío del formulario (aquí iría la lógica real de envío)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setFormErrors({});
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Eliminar el error cuando el usuario comienza a corregir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: "Ubicación",
      details: "Calle Principal #123, Ciudad",
      ariaLabel: "Nuestra ubicación"
    },
    {
      icon: faClock,
      title: "Horario",
      details: "Lun - Vie: 9:00 - 18:00",
      ariaLabel: "Nuestro horario de atención"
    },
    {
      icon: faEnvelopeOpen,
      title: "Correo",
      details: "contacto@alemanaprint.com",
      ariaLabel: "Nuestro correo electrónico"
    }
  ];

  const formFields = [
    { name: 'name', label: 'Nombre completo', icon: faUser, type: 'text', required: true },
    { name: 'email', label: 'Correo electrónico', icon: faEnvelope, type: 'email', required: true },
    { name: 'phone', label: 'Teléfono', icon: faPhone, type: 'tel', required: false }
  ];

  return (
    <section 
      id="contacto" 
      className="section py-20 bg-gradient-to-b from-light to-gray-100 relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Encabezado */}
          <div className="text-center mb-12">
            <motion.h2
              id="contact-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              Contáctanos
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ¿Tienes un proyecto en mente? Cuéntanos sobre él y te ayudaremos a hacerlo realidad.
            </motion.p>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                aria-label={info.ariaLabel}
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mb-4"
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={info.icon} />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.details}</p>
              </motion.div>
            ))}
          </div>

          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-elevated"
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                {formFields.map((field) => (
                  <div key={field.name} className="relative">
                    <label 
                      htmlFor={field.name} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={field.icon} />
                      </div>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-primary focus:border-primary
                          ${formErrors[field.name] 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-300'
                          }`}
                        aria-required={field.required}
                        aria-invalid={!!formErrors[field.name]}
                        aria-describedby={formErrors[field.name] ? `${field.name}-error` : undefined}
                        required={field.required}
                      />
                    </div>
                    {formErrors[field.name] && (
                      <p 
                        id={`${field.name}-error`} 
                        className="mt-1 text-sm text-red-500"
                      >
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="relative">
                  <label 
                    htmlFor="service" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Servicio de interés <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </div>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary focus:border-primary
                        ${formErrors.service 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300'
                        }`}
                      aria-required="true"
                      aria-invalid={!!formErrors.service}
                      aria-describedby={formErrors.service ? "service-error" : undefined}
                      required
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="textil">Serigrafía Textil</option>
                      <option value="publicitaria">Serigrafía Publicitaria</option>
                      <option value="industrial">Serigrafía Industrial</option>
                      <option value="artistica">Serigrafía Artística</option>
                    </select>
                    {/* Flecha personalizada para el select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  {formErrors.service && (
                    <p 
                      id="service-error" 
                      className="mt-1 text-sm text-red-500"
                    >
                      {formErrors.service}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div 
                    className="absolute left-3 top-3 text-gray-400"
                    aria-hidden="true"
                  >
                    <FontAwesomeIcon icon={faMessage} />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                      ${formErrors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300'
                      }`}
                    aria-required="true"
                    aria-invalid={!!formErrors.message}
                    aria-describedby={formErrors.message ? "message-error" : undefined}
                    required
                  ></textarea>
                </div>
                {formErrors.message && (
                  <p 
                    id="message-error" 
                    className="mt-1 text-sm text-red-500"
                  >
                    {formErrors.message}
                  </p>
                )}
              </div>

              <div className="text-center mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 text-lg min-w-[200px] relative"
                  aria-live="polite"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>
              </div>

              {/* Mensaje de estado */}
              <AnimatePresence>
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    aria-live="assertive"
                    className={`text-center mt-6 p-4 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {submitStatus === 'success' 
                      ? '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
                      : 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Decoración de fondo */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};

export default ContactSection;