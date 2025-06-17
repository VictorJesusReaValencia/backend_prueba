const { Schema, model } = require("mongoose");

const DocumentacionSchema = new Schema({
  autor: { type: String },
  ciudad: { type: String, required: false },
  coleccion: { type: String },
  contenido: { type: String },
  destinatario: { type: String },
  documento: { type: String },
  editar: { type: String },
  emisor: { type: String },
  fecha: { type: Date },
  fecha_adquisicion: { type: Number },
  fecha_emision: { type: Date },
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
      fileId: { type: String, required: false },
      nombre: { type: String, required: false }
    }
  ],
  institucion: { type: String },
  institucion_emisor: { type: String },
  lugar_emision: { type: String },
  mostrar: { type: String },
  notas_relevantes: { type: String },
  numero_expediente: { type: Number },
  numero_registro: { type: Number },
  pais: { type: String, required: false },
  pendientes: { type: String },
  pdfs: [
    {
      nombre: { type: String, required: false },
      ruta: { type: String, required: false }
    }
  ],
  persona_registra: { type: String },
  proposito: { type: String },
  revisado: { type: String },
  revisiones: [
    {
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      persona: { type: String, required: false },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  tema: { type: String },
  tipo_bien: { type: String, default: "Documentación" },
  tipo_documento: { type: String },
  titulo: { type: String, required: false },
  transcripcion: { type: String },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  },
  vigencia: { type: Date }
});

module.exports = model("Documentacion", DocumentacionSchema, "documentacion");
