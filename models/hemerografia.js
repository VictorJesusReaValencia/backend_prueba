const { Schema, model } = require("mongoose")

const HemerografiaSchema = new Schema({
  autor: { type: String },
  ciudad: { type: String, required: true },
  coleccion: { type: String },
  columnas: { type: String },
  editar: { type: String },
  encabezado: { type: String },
  fecha_adquisicion: { type: Number },
  fecha_publicacion: { type: Date },
  fecha_registro: { type: Date, default: Date.now }, // nueva: cuándo se registró
  genero_periodistico: { type: String },
  hallazgo: { type: String, default: "No" },
  images: [
    {
      nombre: { type: String, required: true },
      fileId: { type: String, required: true }
    }
  ],
  institucion: { type: String },
  lugar_publicacion: { type: String },
  mostrar: { type: String },
  nombre_periodico: { type: String },
  numero_carpeta: { type: String },
  numero_edicion: { type: String },
  numero_paginas: { type: String },
  numero_registro: { type: Number },
  pais: { type: String },
  pendiente: { type: String },
  periodicidad: { type: String },
  persona_registra: { type: String },
  pdfs: [
    {
      nombre: { type: String, },
      ruta: { type: String, }
    }
  ],
  revisado: { type: String, default: "No" },
  resumen: { type: String },
  seccion: { type: String },
  seudonimos: { type: String },
  tema: { type: String },
  tipo_bien: { type: String, default: "Hemerografía" },
  transcripcion: { type: String },
  ubicacion_fisica: { type: String },
  imagenes_fb: [{
    nombre: { type: String, maxlength: 50 },
    url: { type: String }
  }],
  revisiones: [ // nueva: historial de revisiones
    {
      persona: { type: String, required: true },
      fecha: { type: Date, default: Date.now },
      observacion: { type: String },
      revision_resuelta: { type: Boolean, default: false },
      tipo_revision: { type: String }
    }
  ],
  ultima_actualizacion: {
    fecha: { type: Date },
    por: { type: String }
  }

});

module.exports = model("Hemerografia", HemerografiaSchema, "hemerografia");