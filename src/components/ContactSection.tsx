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
import serigrafiaBackground from '../assets/Contact/serigrafia-bg.png';
import { 
  isMobileDevice, 
  formatWhatsAppMessage, 
  getEmailSubject, 
  formatEmailBody 
} from '../utils/deviceDetection';

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
  // Números de WhatsApp para contacto (sin el +)
  const WHATSAPP_NUMBERS = ['593968676893', '593986112559'];
  // Correo electrónico de contacto
  const CONTACT_EMAIL = 'ventas1@inkgraph.net';

  // Función para obtener un número de WhatsApp aleatorio
  const getRandomWhatsAppNumber = (): string => {
    const randomIndex = Math.floor(Math.random() * WHATSAPP_NUMBERS.length);
    return WHATSAPP_NUMBERS[randomIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Esperar un poco para simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Detectar si el usuario está en móvil o escritorio
      if (isMobileDevice()) {
        // Envía a WhatsApp con un número aleatorio
        const randomNumber = getRandomWhatsAppNumber();
        const whatsappMessage = formatWhatsAppMessage(formData);
        window.open(`https://wa.me/${randomNumber}?text=${whatsappMessage}`, '_blank');
      } else {
        // Envía a correo electrónico
        const subject = getEmailSubject();
        const body = formatEmailBody(formData);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      }
      
      // Marcar como enviado correctamente
      setSubmitStatus('success');
      
      // Limpiar el formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
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
      details: "Av. Eloy Alfaro, Quito 170144",
      ariaLabel: "Nuestra ubicación"
    },
    {
      icon: faClock,
      title: "Horario",
      details: "Lun - Vie: 8:00 - 17:30",
      ariaLabel: "Nuestro horario de atención"
    },
    {
      icon: faEnvelopeOpen,
      title: "Correo",
      details: "ventas1@inkgraph.net",
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
      id="contact"
      className="relative min-h-screen w-full"
      aria-labelledby="contact-heading"
    >
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${serigrafiaBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        aria-hidden="true"
      />

      {/* Overlay para mejorar la legibilidad */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="container-custom relative z-10 py-20">
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
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              Contáctanos
            </motion.h2>
            <motion.p
              className="text-xl text-gray-200 max-w-2xl mx-auto"
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
                className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                aria-label={info.ariaLabel}
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mb-4"
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={info.icon} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-gray-200">{info.details}</p>
              </motion.div>
            ))}
          </div>

          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-lg"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                        placeholder={                          field.name === 'name' ? 'Ej: Juan Pérez' :
                          field.name === 'email' ? 'Ej: juan@ejemplo.com' :
                          field.name === 'phone' ? 'Ej: +593 96 867 6893' : ''
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all
                          bg-white/90 backdrop-blur-sm
                          focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white
                          ${formErrors[field.name] 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 hover:border-gray-400'
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg appearance-none
                        bg-white/90 backdrop-blur-sm
                        focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white
                        ${formErrors.service 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 hover:border-gray-400'
                        }`}
                      aria-required="true"
                      aria-invalid={!!formErrors.service}
                      aria-describedby={formErrors.service ? "service-error" : undefined}
                      required
                    >
                      <option value="">Selecciona el tipo de servicio</option>
                      <option value="textil">Serigrafía Textil - Estampados en telas</option>
                      <option value="publicitaria">Serigrafía Publicitaria - Materiales promocionales</option>
                      <option value="industrial">Serigrafía Industrial - Aplicaciones especializadas</option>
                      <option value="artistica">Serigrafía Artística - Impresiones de arte</option>
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
                    placeholder="Describe tu proyecto o consulta aquí. Por ejemplo: Necesito estampar 100 camisetas con mi logo empresarial..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg
                      bg-white/90 backdrop-blur-sm
                      focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white
                      ${formErrors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 hover:border-gray-400'
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
    </section>
  );
};

export default ContactSection;