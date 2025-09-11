"use client";
import { useState } from "react"; // Hook para gestionar estados en componentes funcionales
import "./CreateButterfly.css"; // Estilos CSS específicos para este componente
import { createButterfly } from "../services/ButterflyServices"; // Servicio para crear mariposas en backend
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas

// Array con imágenes que representan el progreso del formulario
const progressImages = [
  "/images-form/oruga1.png",
  "/images-form/oruga2.png",
  "/images-form/oruga3.png",
  "/images-form/oruga4.png",
  "/images-form/mariposa1.png",
  "/images-form/mariposa2.png",
  "/images-form/mariposa3.png",
];

// Constantes para la subida a Cloudinary (servicio de almacenamiento de imágenes)
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dauzwfc8z/image/upload";
const CLOUDINARY_PRESET = "mariposas-africa";

// Tiempo que durará el popup de confirmación en milisegundos
const POPUP_DURATION = 10000; // 10 segundos

// Imágenes para estados especiales
const migratoryImage = "/images-form/migratoria.png"; // Si la mariposa es migratoria
const savedImage = "/images-form/guardada1.png"; // Imagen para mostrar cuando se guarda con éxito

const CreateButterfly = () => {
  const navigate = useNavigate(); // Para redireccionar tras crear la mariposa

  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    common_name: "",
    scientific_name: "",
    location: "",
    description: "",
    habitat: "",
    image: "",
    migratory: false,
  });

  // Estado para almacenar mensajes de error por campo
  const [errors, setErrors] = useState({});

  // Estado que indica si está subiendo una imagen (para mostrar botón cargando)
  const [isUploading, setIsUploading] = useState(false);

  // Estado para saber si la mariposa ya se ha guardado (mostrar imagen de guardado)
  const [isSaved, setIsSaved] = useState(false);

  // Estado para mostrar u ocultar el popup de confirmación
  const [showPopup, setShowPopup] = useState(false);

  // Estado para controlar popup de añadir imagen por URL
  const [showImagePopup, setShowImagePopup] = useState(false);

  // Estado temporal para manejar la URL que escribe el usuario en el popup
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Función que actualiza el estado del formulario cuando cambian los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es checkbox, usamos checked, si no, el valor del input
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Cada vez que cambian datos, resetamos el estado de guardado para que el usuario sepa que debe volver a guardar
    setIsSaved(false);
  };

  // Función para subir imagen a Cloudinary cuando el usuario elige un archivo
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Si no hay archivo, no hacemos nada

    setIsUploading(true); // Indicamos que estamos subiendo para deshabilitar botón

    const uploadData = new FormData();
    uploadData.append("file", file); // Añadimos el archivo
    uploadData.append("upload_preset", CLOUDINARY_PRESET); // Añadimos el preset configurado en Cloudinary

    try {
      // 🟡 PETICIÓN POST: Subida de imagen a Cloudinary
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST", // Método POST → estamos enviando datos para crear algo (la imagen en Cloudinary)
        body: uploadData, // El cuerpo de la petición es un FormData (tipo especial para archivos)
      });
      const data = await res.json();

      // Guardamos la URL de la imagen subida en el estado
      setFormData((prev) => ({ ...prev, image: data.secure_url }));

      // Si había errores, los limpiamos
      setErrors((prev) => ({ ...prev, image: null }));
    } catch (err) {
      alert("❌ Error al subir imagen");
      console.error(err);
    } finally {
      setIsUploading(false); // Siempre desactivamos el estado de subida, haya éxito o fallo
    }
  };

  // Abrir popup para que el usuario introduzca una URL manualmente
  const handleOpenImagePopup = () => {
    setImageUrlInput(formData.image || ""); // Ponemos la URL actual para que el usuario pueda modificarla
    setShowImagePopup(true);
  };

  // Cerrar popup de añadir URL
  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
  };

  // Guardar la URL que el usuario puso en el input del popup
  const handleSetImageUrl = () => {
    if (!imageUrlInput.trim()) {
      alert("Introduce una URL válida");
      return;
    }
    setFormData((prev) => ({ ...prev, image: imageUrlInput.trim() }));
    setErrors((prev) => ({ ...prev, image: null }));
    setShowImagePopup(false);
  };

  // Actualizar el input dentro del popup según escribe el usuario
  const handleImageUrlChange = (e) => {
    setImageUrlInput(e.target.value);
  };

  // Validar los campos obligatorios antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.common_name.trim()) newErrors.common_name = "Campo obligatorio";
    if (!formData.scientific_name.trim()) newErrors.scientific_name = "Campo obligatorio";
    if (!formData.location.trim()) newErrors.location = "Campo obligatorio";
    if (!formData.description.trim()) newErrors.description = "Campo obligatorio";
    if (!formData.image || !formData.image.trim()) newErrors.image = "Campo obligatorio";
    return newErrors;
  };

  // Función para enviar el formulario y crear la mariposa
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validamos campos
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors); // Mostramos errores si los hay
      return;
    }

    // 🟢 PETICIÓN POST: Creación de la mariposa en el backend
    // Aquí llamamos al servicio que envía los datos al servidor (CreateNewButterfly hace un fetch con método POST)
    const response = await createButterfly(formData);

    if (response.status === 201) {
      // Si el servidor responde con éxito (201 Created), mostramos un mensaje y redirigimos
      setShowPopup(true); // Mostramos popup éxito
      setIsSaved(true);   // Marcamos estado guardado
      alert("🦋 ¡Mariposa creada con éxito!");
      navigate("/init/galery"); // Redirigimos a galería
    }

    // Cerramos popup y redirigimos tras 10 segundos
    setTimeout(() => {
      setShowPopup(false);
      navigate("/init/galery"); // Redirigimos a galería
    }, POPUP_DURATION);
  };

  // Cerrar popup manualmente y resetear formulario
  const closePopup = () => {
    setShowPopup(false);

    // Reiniciamos formulario y errores
    setFormData({
      common_name: "",
      scientific_name: "",
      location: "",
      description: "",
      habitat: "",
      image: "",
      migratory: false,
    });
    setErrors({});
    navigate("/init/galery"); // Redirigimos a galería
  };

  // Seleccionamos la imagen que se debe mostrar según el estado del formulario
  let currentImage = null;

  if (isSaved) {
    currentImage = savedImage; // Imagen cuando está guardada
  } else if (formData.migratory) {
    currentImage = migratoryImage; // Imagen si es migratoria
  } else {
    // Contamos campos rellenados para saber el progreso
    const filledFieldsCount = [
      formData.common_name,
      formData.scientific_name,
      formData.location,
      formData.description,
      formData.habitat,
      formData.image,
    ].filter(Boolean).length;

    // Seleccionamos imagen según progreso (máximo la última)
    currentImage = progressImages[Math.min(filledFieldsCount, progressImages.length - 1)];
  }

  return (
    <>
      <div
        className="min-h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/image4.jpg')",
          backgroundColor: "#fdf9f6",
        }}
      >
        <form onSubmit={handleSubmit} className="container">
          {/* Primera columna con título e imagen de progreso */}
          <div className="imageContainer">
            <h2 className="title">
              <span>Crear </span>
              <span>Nueva </span>
              <span>Mariposa</span>
            </h2>
            <img src={currentImage} alt="Estado mariposa" className="progressImage" />
          </div>

          {/* Segunda columna: campos de texto */}
          <div className="formFields">
            <label>
              Nombre común:
              <input
                type="text"
                name="common_name"
                value={formData.common_name}
                onChange={handleChange}
                placeholder="Ej: Mariposa Reina Africana"
              />
              {errors.common_name && <p className="error">{errors.common_name}</p>}
            </label>

            <label>
              Nombre científico:
              <input
                type="text"
                name="scientific_name"
                value={formData.scientific_name}
                onChange={handleChange}
                placeholder="Ej: Danaus chrysippus"
              />
              {errors.scientific_name && <p className="error">{errors.scientific_name}</p>}
            </label>

            <label>
              Ubicación:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: África Oriental"
              />
              {errors.location && <p className="error">{errors.location}</p>}
            </label>

            <label>
              Descripción:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Colores y características"
                rows={3}
              />
              {errors.description && <p className="error">{errors.description}</p>}
            </label>

            <label>
              Hábitat:
              <input
                type="text"
                name="habitat"
                value={formData.habitat}
                onChange={handleChange}
                placeholder="¿Dónde la encontramos?"
              />
            </label>
          </div>

          {/* Tercera columna: opciones de imagen, checkbox y botón */}
          <div className="formOptions">
            <label>
              Imagen:
            </label>

            <div className="imageButtons">
              {/* Botón para subir imagen desde archivo */}
              <button
                type="button"
                onClick={() => document.getElementById("imageUploadInput").click()}
                className="butterfly-button"
                disabled={isUploading}
              >
                {isUploading ? "Subiendo..." : "📁 Seleccionar imagen"}
              </button>

              {/* Botón para abrir popup y añadir imagen por URL */}
              <button type="button" onClick={handleOpenImagePopup} className="butterfly-button">
                🌐 Añadir imagen por URL
              </button>

              {/* Input oculto para cargar imagen local */}
              <input
                type="file"
                id="imageUploadInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              {/* Error de imagen si existe */}
              {errors.image && <p className="error">{errors.image}</p>}

              {/* Vista previa de la imagen subida o URL introducida */}
              {formData.image && (
                <div style={{ marginTop: "1rem" }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <p style={{ color: "#cdbfbc", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    ✅ Imagen cargada
                  </p>
                </div>
              )}
            </div>

            {/* Checkbox para indicar si la mariposa es migratoria */}
            <div className="checkboxCentered" style={{ marginTop: "1.5rem" }}>
              <label htmlFor="migratory">
                ¿Es migratoria?
              </label>
              <input
                type="checkbox"
                id="migratory"
                name="migratory"
                checked={formData.migratory}
                onChange={handleChange}
              />
            </div>

            {/* Botón para enviar el formulario */}
            <button type="submit" className="butterfly-button submitButton">
              Crear mariposa
            </button>
          </div>
        </form>

        {/* Popup de confirmación de mariposa guardada */}
        {showPopup && (
          <div className="popupBackground">
            <div className="popupContent">
              <h3>🦋 ¡Mariposa creada con éxito!</h3>
              <img src={savedImage} alt="Mariposa guardada" style={{ width: "150px" }} />
              <button onClick={closePopup} className="butterfly-button">
                Volver a la galería
              </button>
            </div>
          </div>
        )}

        {/* Popup para añadir imagen por URL */}
        {showImagePopup && (
          <div className="popupBackground">
            <div className="popupContent">
              <h3>Introduce la URL de la imagen</h3>
              <input
                type="text"
                value={imageUrlInput}
                onChange={handleImageUrlChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
              />
              <button onClick={handleSetImageUrl} className="butterfly-button" style={{
                backgroundColor: "rgba(155, 224, 165, 0.9)", color: "black", border: "rgba(155, 224, 165, 0.9), 2px"
              }}>
                Guardar
              </button>
              <button onClick={handleCloseImagePopup} className="butterfly-button cancelButton" style={{
                backgroundColor: "#e66035", color: "black"
              }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateButterfly;
