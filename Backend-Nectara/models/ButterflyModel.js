import mongoose from "mongoose";

const butterflySchema = new mongoose.Schema(
  {
    common_name:      { type: String, required: true, trim: true },
    scientific_name:  { type: String, required: true, trim: true },
    location:         { type: String, required: true, trim: true },
    description:      { type: String, required: true, minlength: 10, trim: true },
    habitat:          { type: String, required: true, trim: true },
    image:            { type: String, required: true, trim: true },
    // Si en tu front siempre envías migratory, puedes dejar required: true.
    // Si a veces no lo mandas, mejor un default:
    migratory:        { type: Boolean, required: true }, // o: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false, // 👈 elimina __v sin tocar transform
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString(); // 👈 id como string para el front
        delete ret._id;
      },
    },
  }
);

// Índice (opcional, corrigiendo tu línea)
butterflySchema.index({ scientific_name: 1 }, { unique: false });

export default mongoose.model("Butterfly", butterflySchema);
