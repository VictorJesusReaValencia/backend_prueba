const { Schema, model} = require("mongoose")


const HemerografiaSchema = new Schema({
    titulo: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
    },
    image: {
      type: String,
      default: "default.jpg"
    },
    pais: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    institucion: {
      type: String,
    },
    ubicacion_fisica: {
      type: String,
    },
    anio: {
      type: Number,
    },
    mes: {
      type: Number,
    },
    dia: {
      type: Number,
    },
    fecha_adquisicion: {
      type: Number,
    },
    coleccion: {
      type: String,
    },
    tipo_bien: {
      type: String,
      default: "Hemerografía"
    },
    hallazgo: {
      type: String,
      default: "No"
    },
    persona_registra: {
      type: String,
    },
    tema: {
      type: String,
    },
    nombre_periodico: {
      type: String,
    },
    anio2: {
      type: Number,
    },
    mes2: {
      type: Number,
    },
    dia2: {
      type: Number,
    },
    num_paginas: {
      type: String,
    },
    num_edicion: {
      type: String,
    },
    num_publicacion: {
        type: String,
    },
    genero_periodistico: {
        type: String,
    },
    literarios: {
        type: String,
    },
    seudonimo: {
        type: String,
      },
    encabezado: {
    type: String,
    },
    seccion: {
        type: String,
    },
    columnas: {
        type: String,
    },
    colaboradores: {
        type: String,
    },
    tipo_publicacion: {
        type: String,
    },
    resumen:{
        type: String,
    },
    transcripcion: {
        type: String,
    },
    drive_id: {
      type: String,
    },
  });


module.exports = model("Hemerografia",HemerografiaSchema,"hemerografia");