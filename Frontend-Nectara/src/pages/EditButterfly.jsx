import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOneButterfly, updateButterfly, validateButterflyData } from '../services/ButterflyServices';

const EditButterfly = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    common_name: '',
    scientific_name: '',
    location: '',
    description: '',
    habitat: '',
    image: '',
    migratory: false
  });

  // Cargar datos de la mariposa al montar el componente
  useEffect(() => {
    const loadButterfly = async () => {
      try {
        setLoading(true);
        const butterfly = await getOneButterfly(id);
        
        // Normalizar datos (manejar diferentes formatos)
        setFormData({
          common_name: butterfly.common_name || butterfly.commonName || '',
          scientific_name: butterfly.scientific_name || butterfly.scientificName || '',
          location: butterfly.location || '',
          description: butterfly.description || '',
          habitat: butterfly.habitat || '',
          image: butterfly.image || '',
          migratory: butterfly.migratory ?? butterfly.is_migratory ?? butterfly.isMigratory ?? false
        });
        
        setErrors({});
        setMessage('');
      } catch (error) {
        console.error('Error al cargar la mariposa:', error);
        setMessage('Error al cargar los datos de la mariposa');
      } finally {
        setLoading(false);
      }
    };

    loadButterfly();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos
    const validation = validateButterflyData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Por favor, corrige los errores marcados');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      
      // Actualizar mariposa
      await updateButterfly(id, formData);
      
      setMessage('¡Mariposa actualizada exitosamente!');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate(`/butterflydetail/${id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar la mariposa:', error);
      setMessage('Error al actualizar la mariposa. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/butterflydetail/${id}`);
  };

  const handleBackToGallery = () => {
    navigate('/galery');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-500 border-t-transparent mb-4"></div>
          <div className="text-2xl text-stone-700" style={{ fontFamily: 'Georgia, serif' }}>
            Cargando datos de la mariposa...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md border border-stone-200 p-4 transform rotate-1">
            <nav className="flex items-center space-x-2 text-sm text-stone-600" style={{ fontFamily: 'Georgia, serif' }}>
              <button
                onClick={handleBackToGallery}
                className="flex items-center space-x-1 hover:text-stone-800 transition-colors"
              >
                <span>🏠</span>
                <span>Galería</span>
              </button>
              <span>〉</span>
              <button
                onClick={() => navigate(`/butterflydetail/${id}`)}
                className="hover:text-stone-800 transition-colors"
              >
                📖 Detalle
              </button>
              <span>〉</span>
              <span className="text-stone-800 font-medium">
                ✏️ Editar {formData.common_name}
              </span>
            </nav>
          </div>
        </div>

        {/* Formulario principal */}
        <div className="bg-white rounded-lg shadow-xl border-2 border-stone-300 p-8 transform -rotate-1">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-stone-800 tracking-wide mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              ✏️ Editar Mariposa
            </h1>
            <p className="text-stone-600 italic text-lg" style={{ fontFamily: 'Georgia, serif' }}>
              Actualizando registro #{id}
            </p>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.includes('Error') || message.includes('errores')
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <p style={{ fontFamily: 'Georgia, serif' }}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre común */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  🦋 Nombre Común *
                </label>
                <input
                  type="text"
                  name="common_name"
                  value={formData.common_name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg transition-colors ${
                    errors.commonName ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                  placeholder="Ej: Mariposa Reina Africana"
                />
                {errors.commonName && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                    {errors.commonName}
                  </p>
                )}
              </div>

              {/* Nombre científico */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  🔬 Nombre Científico *
                </label>
                <input
                  type="text"
                  name="scientific_name"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg transition-colors ${
                    errors.scientificName ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                  placeholder="Ej: Danaus chrysippus"
                />
                {errors.scientificName && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                    {errors.scientificName}
                  </p>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  📍 Ubicación *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg transition-colors ${
                    errors.location ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                  placeholder="Ej: África subsahariana"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Hábitat */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  🌿 Hábitat *
                </label>
                <input
                  type="text"
                  name="habitat"
                  value={formData.habitat}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg transition-colors ${
                    errors.habitat ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                  placeholder="Ej: Sabana y zonas abiertas"
                />
                {errors.habitat && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                    {errors.habitat}
                  </p>
                )}
              </div>
            </div>

            {/* URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                🖼️ URL de la Imagen *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg transition-colors ${
                  errors.image ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                  {errors.image}
                </p>
              )}
              
              {/* Vista previa de la imagen */}
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-stone-600 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Vista previa:
                  </p>
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <img
                      src={formData.image}
                      alt="Vista previa"
                      className="w-32 h-24 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                📝 Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 border rounded-lg transition-colors resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-stone-500'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
                placeholder="Describe las características, comportamiento y particularidades de esta mariposa..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Comportamiento migratorio */}
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="migratory"
                  checked={formData.migratory}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-stone-300 rounded focus:ring-blue-500"
                />
                <span className="text-stone-700 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                  🛫 Esta especie es migratoria
                </span>
              </label>
              <p className="mt-2 text-sm text-stone-600" style={{ fontFamily: 'Georgia, serif' }}>
                Marca esta opción si la mariposa realiza migraciones estacionales
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-3 text-stone-600 border-2 border-stone-300 rounded-lg hover:bg-stone-50 transition-colors transform hover:scale-105"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ❌ Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg transition-all transform hover:scale-105 ${
                  saving
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-stone-500 border-t-transparent"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>💾</span>
                    <span>Actualizar Mariposa</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-lg border border-stone-300 transform rotate-2">
            <p className="text-stone-600 italic text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Los cambios se guardarán en la base de datos del proyecto 🦋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditButterfly;