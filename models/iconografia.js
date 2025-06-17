const { Schema, model } = require("mongoose");

const IconografiaSchema = new Schema({
  alto: { type: String },
  ancho: { type: String },
  anio: { type: Number },
  autor: { type: String },
  ciudad: { type: String, required: true },
  coleccion: { type: String },
  corriente: { type: String },
  dia: { type: Number },
  editar: { type: String },
  fecha_adquisicion: { type: Number },
  fecha_registro: { type: Date, default: Date.now },
  hallazgo: { type: String, default: "No" },
  imagenes_fb: [
    {
      nombre: { type: String, maxlength: 50 },
      url: { type: String }
    }
  ],
  images: [
    {
      fileId: { type: String },
      nombre: { type: String }
    }
  ],
  institucion: { type: String },
  mes: { type: Number },
  mostrar: { type: String },
  notas: { type: String },
  numero_registro: { type: Number },
  pais: { type: String, required: true },
  pendientes: { type: String },
  persona_registra: { type: String },
  revisado: { type: String },
  revisiones: [
    {
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      persona: { type: String, required: true },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  superficie: { type: String },
  tecnica: { type: String },
  tema: { type: String },
  tipo_bien: { type: String, default: "Iconografía" },
  tipo_iconografia: { type: String },
  titulo: { type: String, required: true },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Iconografia", IconografiaSchema, "iconografia");
