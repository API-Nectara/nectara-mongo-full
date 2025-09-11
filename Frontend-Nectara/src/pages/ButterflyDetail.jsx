import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  getAllButterflies,
  getOneButterfly,
  updateButterfly,
  deleteButterfly,
} from "../services/ButterflyServices";

const ButterflyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [butterfly, setButterfly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [allButterflies, setAllButterflies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estado del formulario de edición
  const [editForm, setEditForm] = useState({
    common_name: "",
    scientific_name: "",
    location: "",
    description: "",
    habitat: "",
    image: "",
    migratory: false,
  });

  // Estado para Cloudinary
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchAllButterflies();
  }, []);

  useEffect(() => {
    if (allButterflies.length > 0) {
      // Buscar por ID como string y como número para mayor compatibilidad
      const index = allButterflies.findIndex(
        (b) => String(b.id) === String(id)
      );
      if (index !== -1) {
        setCurrentIndex(index);
        setButterfly(allButterflies[index]);
        setEditForm(allButterflies[index]);
        setLoading(false);
      } else {
        setError("Mariposa no encontrada");
        setLoading(false);
      }
    }
  }, [id, allButterflies]);

  // Función para obtener todas las mariposas usando tu service
  const fetchAllButterflies = async () => {
    try {
      console.log("🔄 Cargando todas las mariposas...");
      const data = await getAllButterflies();
      console.log("✅ Mariposas cargadas:", data.length);
      setAllButterflies(data);
    } catch (err) {
      console.error("❌ Error al cargar mariposas:", err);
      setError("Error al cargar las mariposas: " + err.message);
      setLoading(false);
    }
  };

  // Navegación entre páginas usando IDs de la base de datos
  const handlePageFlip = (direction) => {
    if (isFlipping) return;

    setIsFlipping(true);

    setTimeout(() => {
      let newIndex;
      if (direction === "next" && currentIndex < allButterflies.length - 1) {
        newIndex = currentIndex + 1;
      } else if (direction === "prev" && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else {
        setIsFlipping(false);
        return;
      }

      setCurrentIndex(newIndex);
      const newButterfly = allButterflies[newIndex];
      setButterfly(newButterfly);
      setEditForm(newButterfly);
      // Navegar usando el ID real de la base de datos
      console.log("🔄 Navegando a mariposa ID:", newButterfly.id);
      navigate(`/init/butterflydetail/${newButterfly.id}`, { replace: true });

      setTimeout(() => setIsFlipping(false), 100);
    }, 300);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Subir imagen a Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mariposas-africa");
    formData.append("cloud_name", "dauzwfc8z");

    try {
      setUploading(true);
      console.log("☁️ Subiendo imagen a Cloudinary...");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dauzwfc8z/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Imagen subida exitosamente:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      alert("❌ Error al subir imagen: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Manejar subida de archivos con validación
  const handleFileUpload = async (file) => {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("⚠️ Por favor selecciona una imagen válida (JPG, PNG, GIF, etc.)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      alert("⚠️ La imagen es demasiado grande. Máximo 5MB permitidos.");
      return;
    }

    console.log("📁 Procesando archivo:", {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
    });

    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      console.log("✅ URL de imagen obtenida:", imageUrl);
      setEditForm((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Actualizar mariposa usando tu service
  const handleUpdate = async () => {
    try {
      console.log("✏️ Iniciando actualización de mariposa...");

      // Normalizar datos para compatibilidad con ambos formatos
      const normalizedData = {
        ...editForm,
        // Asegurar compatibilidad con ambos formatos de migración
        migratory: editForm.migratory || editForm.is_migratory || false,
        is_migratory: editForm.migratory || editForm.is_migratory || false,
      };

      console.log("📝 Datos a actualizar:", normalizedData);

      const updatedButterfly = await updateButterfly(
        butterfly.id,
        normalizedData
      );
      console.log("✅ Mariposa actualizada exitosamente:", updatedButterfly);

      // Mostrar alerta y redirigir a galería
      alert("¡Ya puedes verla actualizada en la galería!");
      navigate("/init/galery");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert("❌ Error al actualizar: " + error.message);
    }
  };

  // Eliminar mariposa usando tu service
  const handleDelete = async () => {
    if (
      !window.confirm(
        "🗑️ ¿Estás seguro de que quieres eliminar esta mariposa?\n\nEsta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      console.log("🗑️ Iniciando eliminación de mariposa ID:", butterfly.id);

      await deleteButterfly(butterfly.id);
      console.log("✅ Mariposa eliminada exitosamente");

      alert("✅ Mariposa eliminada exitosamente");
      navigate("/init/galery");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
      alert("❌ Error al eliminar: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 pt-20 sm:pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p
            className="text-black font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Cargando espécimen...
          </p>
        </div>
      </div>
    );
  }

  if (error || !butterfly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 pt-20 sm:pt-24">
        <div className="text-center">
          <h2
            className="text-2xl text-black mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Error
          </h2>
          <p
            className="text-black mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {error || "Mariposa no encontrada"}
          </p>
          <button
            onClick={() => navigate("/init/galery")}
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
              fontSize: "1rem",
              color: "#ffffff",
              backgroundColor: "#e66035",
              padding: "0.7rem 1.8rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease",
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c61e0f")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#e66035")}
          >
            Volver a la Galería
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center p-2 sm:p-4 pt-20 sm:pt-24"
      style={{
        backgroundImage: "url('/image4.jpg')",
        backgroundColor: "#fdf9f6",
      }}
    >
      {/* Header con gradiente y efectos */}
      <div className="relative py-12 px-6 mb-4 sm:mb-8">
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-teal-700/10"
          style={{
            background: "linear-gradient(to right, #c61e0f15, #216b8115)",
          }}
        ></div>
        <div className="relative text-center">
          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
              background:
                "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Cuaderno de Campo
          </h1>
          <div className="mx-auto w-32 h-0.5 bg-gradient-to-r from-red-900/30 to-teal-700/30"></div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto mb-4">
        <nav
          className="flex items-center text-sm"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <button
            onClick={() => navigate("/init")}
            className="text-black hover:text-gray-600 transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Inicio
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <button
            onClick={() => navigate("/init/galery")}
            className="text-black hover:text-gray-600 transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Galería
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span
            className="text-black font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {butterfly ? butterfly.common_name : "Cargando..."}
          </span>
        </nav>
      </div>

      {/* Libro */}
      <div style={{ perspective: "2500px" }} className="mx-auto mb-6">
        <div
          className={`relative w-full max-w-7xl mx-auto transition-transform duration-300 ${
            isFlipping ? "animate-pulse" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            height: "auto",
            minHeight: "600px",
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-gray-200 flex flex-col lg:flex-row relative">
            {/* Página izquierda - Imagen de la mariposa */}
            <div className="w-full lg:w-1/2 lg:border-r-4 border-gray-100 order-1 lg:order-1">
              <div
                className="w-full h-full relative bg-white flex flex-col justify-center items-center p-6 sm:p-12"
                style={{
                  minHeight: "400px",
                }}
              >
                <div className="relative z-10 text-center max-w-md w-full">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 sm:p-8 shadow-2xl border-4 border-gray-300">
                    <img
                      src={butterfly.image}
                      alt={butterfly.common_name}
                      className="w-full max-w-64 h-48 sm:h-64 object-cover rounded-lg shadow-lg mb-4 sm:mb-6 mx-auto border-4 border-white"
                      onError={(e) => {
                        e.target.src = "/images-home/butterfly-placeholder.jpg";
                      }}
                    />

                    <h2
                      className="text-xl sm:text-3xl text-black mb-3"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {butterfly.common_name}
                    </h2>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <p
                        className="text-xs sm:text-sm text-black mb-2 uppercase tracking-wide"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Notas de campo:
                      </p>
                      <p
                        className="text-black italic text-sm sm:text-lg leading-relaxed"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {butterfly.description.length > 100
                          ? butterfly.description.substring(0, 100) + "..."
                          : butterfly.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Página derecha - Información científica */}
            <div className="w-full lg:w-1/2 order-2 lg:order-2">
              <div className="w-full h-full p-6 sm:p-12 bg-white relative">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <header className="mb-6 sm:mb-8">
                    <h1
                      className="text-2xl sm:text-4xl text-black mb-3"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Datos Científicos
                    </h1>
                    <div className="h-1 w-24 bg-black rounded mb-4"></div>
                  </header>

                  {/* Contenido principal */}
                  <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto">
                    {!isEditing ? (
                      // Vista de lectura
                      <>
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h3
                            className=" text-black text-xs sm:text-sm uppercase tracking-wide mb-3"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            Clasificación Taxonómica
                          </h3>
                          <p
                            className="text-xl sm:text-2xl text-black mb-2"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {butterfly.common_name}
                          </p>
                          <p
                            className="text-base sm:text-lg text-black italic font-normal"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {butterfly.scientific_name}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <h4
                              className=" text-black text-xs sm:text-sm uppercase tracking-wide mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Ubicación
                            </h4>
                            <p
                              className="text-black text-base sm:text-lg"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {butterfly.location}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <h4
                              className=" text-black text-xs sm:text-sm uppercase tracking-wide mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Hábitat
                            </h4>
                            <p
                              className="text-black text-base sm:text-lg"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {butterfly.habitat}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <h4
                              className="text-black text-xs sm:text-sm uppercase tracking-wide mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Comportamiento Migratorio
                            </h4>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  butterfly.migratory || butterfly.is_migratory
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <p
                                className="text-black text-base sm:text-lg"
                                style={{ fontFamily: "Georgia, serif" }}
                              >
                                {butterfly.migratory || butterfly.is_migratory
                                  ? "Migratoria"
                                  : "No migratoria"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                          <h4
                            className=" text-black text-xs sm:text-sm uppercase tracking-wide mb-3"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            Descripción Científica
                          </h4>
                          <p
                            className="text-black leading-relaxed text-base sm:text-lg"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {butterfly.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      // Vista de edición
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Nombre Común
                            </label>
                            <input
                              type="text"
                              name="common_name"
                              value={editForm.common_name}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              style={{ fontFamily: "Georgia, serif" }}
                            />
                          </div>

                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Nombre Científico
                            </label>
                            <input
                              type="text"
                              name="scientific_name"
                              value={editForm.scientific_name}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent italic font-normal"
                              style={{ fontFamily: "Georgia, serif" }}
                            />
                          </div>

                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Ubicación
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={editForm.location}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              style={{ fontFamily: "Georgia, serif" }}
                            />
                          </div>

                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Hábitat
                            </label>
                            <input
                              type="text"
                              name="habitat"
                              value={editForm.habitat}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              style={{ fontFamily: "Georgia, serif" }}
                            />
                          </div>

                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Descripción
                            </label>
                            <textarea
                              name="description"
                              value={editForm.description}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              style={{ fontFamily: "Georgia, serif" }}
                            />
                          </div>

                          {/* Upload de imagen con Cloudinary */}
                          <div>
                            <label
                              className="block text-sm font-medium text-black mb-2"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Imagen
                            </label>

                            {/* Zona de drag and drop */}
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive
                                  ? "border-gray-500 bg-gray-50"
                                  : "border-gray-300 bg-gray-25"
                              }`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              {uploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mb-2"></div>
                                  <p
                                    className="text-black"
                                    style={{ fontFamily: "Georgia, serif" }}
                                  >
                                    Subiendo imagen...
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Upload
                                    size={32}
                                    className="text-gray-600 mb-2"
                                  />
                                  <p
                                    className="text-black mb-2"
                                    style={{ fontFamily: "Georgia, serif" }}
                                  >
                                    Arrastra una imagen aquí o
                                  </p>
                                  <label
                                    className="butterfly-button"
                                    style={{
                                      fontFamily: "Georgia, serif",
                                      fontWeight: "normal",
                                      fontSize: "0.9rem",
                                      color: "#e66035",
                                      backgroundColor: "transparent",
                                      padding: "0.5rem 1rem",
                                      border: "1px solid #e66035",
                                      cursor: "pointer",
                                      boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.2)",
                                      transition: "all 0.3s ease",
                                      display: "inline-block",
                                      textAlign: "center",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        "#e66035";
                                      e.target.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor =
                                        "transparent";
                                      e.target.style.color = "#e66035";
                                    }}
                                  >
                                    Seleccionar archivo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files[0]) {
                                          handleFileUpload(e.target.files[0]);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              )}
                            </div>

                            {/* URL manual */}
                            <div className="mt-2">
                              <input
                                type="url"
                                name="image"
                                value={editForm.image}
                                onChange={handleInputChange}
                                placeholder="O pega una URL de imagen"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                style={{ fontFamily: "Georgia, serif" }}
                              />
                            </div>

                            {/* Preview de la imagen */}
                            {editForm.image && (
                              <div className="mt-3">
                                <img
                                  src={editForm.image}
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                  onError={(e) => {
                                    e.target.src =
                                      "/images-home/butterfly-placeholder.jpg";
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="migratory"
                              checked={
                                editForm.migratory || editForm.is_migratory
                              }
                              onChange={handleInputChange}
                              className="mr-2 w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <label
                              className="text-sm font-medium text-black"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              Especie migratoria
                            </label>
                          </div>
                        </div>

                        {/* Botones de guardar/cancelar */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 flex-col sm:flex-row">
                          <button
                            className="butterfly-button"
                            onClick={handleUpdate}
                            style={{
                              fontFamily: "Georgia, serif",
                              fontWeight: "normal",
                              fontSize: "1rem",
                              color: "#ffffff",
                              backgroundColor: "#16a34a",
                              padding: "0.7rem 1.8rem",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                              transition: "background-color 0.3s ease",
                              flex: "1",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#15803d")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#16a34a")
                            }
                          >
                            Guardar Cambios
                          </button>
                          <button
                            className="butterfly-button"
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm(butterfly);
                            }}
                            style={{
                              fontFamily: "Georgia, serif",
                              fontWeight: "normal",
                              fontSize: "1rem",
                              color: "#ffffff",
                              backgroundColor: "#6b7280",
                              padding: "0.7rem 1.8rem",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                              transition: "background-color 0.3s ease",
                              flex: "1",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#4b5563")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#6b7280")
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer con botones de acción */}
                  {!isEditing && (
                    <footer className="pt-6 border-t-2 border-gray-200">
                      {/* Botones de acción */}
                      <div className="flex gap-3 flex-wrap mb-6">
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="butterfly-button"
                          style={{
                            fontFamily: "Georgia, serif",
                            fontWeight: "normal",
                            fontSize: "0.95rem",
                            color: "#e66035",
                            border: "1px solid #e66035",
                            padding: "0.5rem 1.25rem",
                            display: "inline-block",
                            width: "100%",
                            textAlign: "center",
                            textDecoration: "none",
                            transition: "0.3s",
                            backgroundColor: "transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#e66035";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#e66035";
                          }}
                        >
                          Editar Especimen
                        </button>

                        <button
                          onClick={handleDelete}
                          className="butterfly-button"
                          style={{
                            fontFamily: "Georgia, serif",
                            fontWeight: "normal",
                            fontSize: "0.95rem",
                            color: "#dc2626",
                            border: "1px solid #dc2626",
                            padding: "0.5rem 1.25rem",
                            display: "inline-block",
                            width: "100%",
                            textAlign: "center",
                            textDecoration: "none",
                            transition: "0.3s",
                            backgroundColor: "transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#dc2626";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#dc2626";
                          }}
                        >
                          Eliminar Especimen
                        </button>
                      </div>

                      <div className="text-center">
                        <div className="flex justify-center gap-1 mb-3">
                          {allButterflies.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                index === currentIndex
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className="text-xs sm:text-sm text-black font-medium"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Página {currentIndex + 1} de {allButterflies.length}
                        </p>
                      </div>
                    </footer>
                  )}

                  {/* Footer de edición */}
                  {isEditing && (
                    <footer className="pt-6 border-t-2 border-gray-200">
                      <div className="text-center">
                        <p
                          className="text-xs sm:text-sm text-black font-medium"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Modo de edición activo
                        </p>
                      </div>
                    </footer>
                  )}
                </div>
              </div>
            </div>

            {/* Línea central del libro - solo en desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-400 to-transparent transform -translate-x-0.5 z-10"></div>

            {/* Flechas de navegación dentro del libro */}
            <button
              onClick={() => handlePageFlip("prev")}
              disabled={currentIndex === 0 || isFlipping}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all duration-200 ${
                currentIndex === 0 || isFlipping
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-white text-black hover:bg-gray-100 hover:scale-110"
              }`}
              style={{
                fontFamily: "Georgia, serif",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => handlePageFlip("next")}
              disabled={
                currentIndex === allButterflies.length - 1 || isFlipping
              }
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all duration-200 ${
                currentIndex === allButterflies.length - 1 || isFlipping
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-white text-black hover:bg-gray-100 hover:scale-110"
              }`}
              style={{
                fontFamily: "Georgia, serif",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Sombra del libro */}
          <div className="absolute -bottom-6 left-6 right-6 h-6 bg-black/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ButterflyDetail;
