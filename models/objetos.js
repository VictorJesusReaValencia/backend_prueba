const { Schema, model } = require("mongoose");

const ObjetosSchema = new Schema({
  autor: { type: String },
  ciudad: { type: String, required: true },
  coleccion: { type: String },
  descripcion_contexto: { type: String },
  descripcion_fisica: { type: String },
  editar: { type: String },
  fecha: { type: Date },
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
      fileId: { type: String, required: true },
      nombre: { type: String, required: true }
    }
  ],
  institucion: { type: String },
  mostrar: { type: String },
  pais: { type: String, required: true },
  pendientes: { type: String },
  persona_registra: { type: String },
  procedencia: { type: String },
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
  tema: { type: String },
  tipo_bien: { type: String, default: "Objeto" },
  tipo_objetos: { type: String },
  titulo: { type: String, required: true },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Objetos", ObjetosSchema, "objetos");
