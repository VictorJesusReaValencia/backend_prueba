const { Schema, model } = require("mongoose");

const PeriodicosSchema = new Schema({
  ciudad: { type: String, required: true },
  fecha_registro: { type: Date, default: Date.now },
  images: [
    {
      nombre: { type: String },
      fileId: { type: String }
    }
  ],
  institucion: { type: String },
  nombre_periodico: { type: String, required: true },
  notas: { type: String },
  numero_registro: { type: Number },
  pais: { type: String, required: true },
  persona_registra: { type: String },
  pdfs: [
    {
      nombre: { type: String, required: true },
      ruta: { type: String, required: true }
    }
  ],
  revisiones: [
    {
      persona: { type: String, required: true },
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  tipo_bien: { type: String, default: "Periódico" },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Periodicos", PeriodicosSchema, "periodicos");
