const { Schema, model } = require("mongoose");

const MonumentosSchema = new Schema({
  autor: { type: String },
  ciudad: { type: String, required: true },
  coleccion: { type: String },
  descripcion_contexto: { type: String },
  descripcion_fisica: { type: String },
  editar: { type: String },
  entidad: { type: String },
  fecha_adquisicion: { type: Number },
  fecha_inauguracion: { type: Date },
  fecha_registro: { type: Date, default: Date.now },
  hallazgo: { type: String, default: "No" },
  imagenes_fb: [
    {
      nombre: { type: String, maxlength: 100 },
      url: { type: String }
    }
  ],
  images: [
    {
      fileId: { type: String },
      nombre: { type: String }
    }
  ],
  inscripciones: { type: String },
  institucion: { type: String },
  mostrar: { type: String },
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
  pdfs: [
    {
      nombre: { type: String, },
      ruta: { type: String, }
    }
  ],
  tema: { type: String },
  tipo_bien: { type: String, default: "Iconografía" }, // Nota: ¿Deseas cambiar a "Monumento"?
  tipo_monumento: { type: String },
  titulo: { type: String, required: true },
  ubicacion: { type: String },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Monumentos", MonumentosSchema, "monumentos");
