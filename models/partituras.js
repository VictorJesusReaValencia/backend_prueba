const { Schema, model } = require("mongoose");

const PartiturasSchema = new Schema({
  audio: { type: String },
  autor: { type: String },
  ciudad: { type: String, required: true },
  clave_musical: { type: String },
  coleccion: { type: String },
  descripcion_contexto: { type: String },
  duracion: { type: String },
  editar: { type: String },
  editorial: { type: String },
  fecha_adquisicion: { type: Number },
  fecha_publicacion: { type: Date },
  fecha_registro: { type: Date, default: Date.now },
  formato: { type: String },
  genero: { type: String },
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
  instrumento: { type: String },
  institucion: { type: String },
  mostrar: { type: String },
  numero_paginas: { type: String },
  numero_registro: { type: Number },
  pais: { type: String, required: true },
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
  tema: { type: String },
  tipo_bien: { type: String, default: "Iconografía" },
  titulo: { type: String, required: true },
  ubicacion_fisica: { type: String },
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }
});

module.exports = model("Partituras", PartiturasSchema, "partituras");
