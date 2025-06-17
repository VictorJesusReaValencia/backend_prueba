const { Schema, model } = require("mongoose");

const FotoSchema = new Schema({
  autor: { type: String },
  camara: { type: String },
  ciudad: { type: String, required: false },
  coleccion: { type: String },
  descripcion: { type: String },
  dia: { type: Number },
  editar: { type: String },
  fecha: { type: Date },
  fecha_adquisicion: { type: Number },
  fecha_registro: { type: Date, default: Date.now },
  formato: { type: String },
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
  numero_album: { type: Number },
  numero_foto: { type: Number },
  pais: { type: String, required: false },
  pendientes: { type: String },
  persona_registra: { type: String },
  resumen: { type: String },
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
  tipo_bien: { type: String, default: "fotografia" },
  titulo: { type: String, required: false },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  },
  pdfs: [
    {
      nombre: { type: String, },
      ruta: { type: String, }
    }
  ]
});

module.exports = model("Fotografia", FotoSchema, "fotografias");
