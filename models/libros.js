const { Schema, model } = require("mongoose");

const LibrosSchema = new Schema({
  acceso_libro: { type: String },
  autor: { type: String },
  camara: { type: Number },
  ciudad: { type: String, required: true },
  citas_relevantes: { type: String },
  coleccion: { type: String },
  coleccion_serie: { type: String },
  colaboradores: { type: String },
  compiladores: { type: String },
  editorial: { type: String },
  editar: { type: String },
  encuadernacion: { type: String },
  fecha_adquisicion: { type: Number },
  fecha_publicacion: { type: Number },
  fecha_reimpresion: { type: Number },
  fecha_registro: { type: Date, default: Date.now },
  formato: { type: String },
  genero_literario: { type: String },
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
  imprenta: { type: String },
  institucion: { type: String },
  isbn: { type: String },
  lugar_edicion: { type: String },
  lugar_publicacion: { type: String },
  mostrar: { type: String },
  numero_edicion: { type: Number },
  numero_ejemplar: { type: String },
  numero_foto: { type: Number },
  numero_paginas: { type: Number },
  numero_registro: { type: Number },
  pais: { type: String, required: true },
  pdfs: [
    {
      nombre: { type: String, required: true },
      ruta: { type: String, required: true }
    }
  ],
  pendientes: { type: String },
  persona_registra: { type: String },
  premios: { type: String },
  prologo: { type: String },
  relacion_autor: { type: String },
  resumen: { type: String },
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
  tipo_bien: { type: String, default: "Libro" },
  titulo: { type: String, required: true },
  tomo: { type: String },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  },
  volumen: { type: String }
});

module.exports = model("Libros", LibrosSchema, "libros");
