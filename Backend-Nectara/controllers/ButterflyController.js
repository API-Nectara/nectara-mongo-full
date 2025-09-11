import ButterflyModel from "../models/ButterflyModel.js";
import mongoose from "mongoose";

export const getAllButterflies = async (_req, res) => {
  try {
    // Mongoose: find()
    const butterflies = await ButterflyModel.find(); // sin .lean() para que aplique el toJSON (id)
    res.status(200).json(butterflies);
  } catch (error) {
    console.error("getAllButterflies error:", error);
    res.status(500).json({ message: "Error obteniendo butterflies" });
  }
};

export const getOneButterfly = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato de ObjectId (evita CastError)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    // Mongoose: findById()
    const butterfly = await ButterflyModel.findById(id);
    if (!butterfly) {
      return res.status(404).json({ error: "Butterfly no found" });
    }
    res.json(butterfly);
  } catch (error) {
    console.error("getOneButterfly error:", error);
    res.status(500).json({ error: "Error obteniendo butterfly" });
  }
};

export const deleteButterfly = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    // Mongoose: findByIdAndDelete()
    await ButterflyModel.findByIdAndDelete(id);
    res.status(200).json({ message: "The butterfly has been deleted successfully!" });
  } catch (error) {
    console.error("deleteButterfly error:", error);
    res.status(500).json({ message: "Error eliminando butterfly" });
  }
};

export const createButterfly = async (req, res) => {
  try {
    const { common_name, scientific_name, location, description, habitat, image, migratory } = req.body;

    // Mongoose: create()
    const newButterfly = await ButterflyModel.create({
      common_name,
      scientific_name,
      location,
      description,
      habitat,
      image,
      migratory
    });

    // newButterfly.toJSON() ya trae "id" (por el transform del schema)
    res.status(201).json({
      message: "Mariposa creada correctamente",
      data: newButterfly,
      id: newButterfly.id
    });
  } catch (error) {
    console.error("createButterfly error:", error);
    res.status(500).json({ error: "Error creando mariposa" });
  }
};

export const updateButterfly = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    // Mongoose: findById()
    const butterfly = await ButterflyModel.findById(id);
    if (!butterfly) {
      return res.status(404).json({ error: "Butterfly no encontrada" });
    }

    // Actualiza campos (igual que hacías)
    const { common_name, scientific_name, location, description, habitat, image, migratory } = req.body;
    butterfly.common_name = common_name;
    butterfly.scientific_name = scientific_name;
    butterfly.location = location;
    butterfly.description = description;
    butterfly.habitat = habitat;
    butterfly.image = image;
    butterfly.migratory = migratory;

    await butterfly.save(); // guarda en Mongo
    return res.status(200).json({
      message: "Mariposa actualizada correctamente",
      data: butterfly
    });
  } catch (error) {
    console.error("updateButterfly error:", error);
    return res.status(500).json({ error: "Error actualizando mariposa" });
  }
};
