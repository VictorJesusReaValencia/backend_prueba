const { Schema, model } = require("mongoose");

const InstitucionesSchema = new Schema({
  ciudad: { type: String, required: false },
  fecha_registro: { type: Date, default: Date.now },
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
  maps: { type: String },
  nombre: { type: String, required: false },
  notas_relevantes: { type: String },
  numero_registro: { type: Number },
  pagina_web: { type: String },
  pais: { type: String, required: false },
  pendientes: { type: String },
  persona_registra: { type: String },
  revisiones: [
    {
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      persona: { type: String, required: false },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  tipo_institucion: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Instituciones", InstitucionesSchema, "Instituciones");
