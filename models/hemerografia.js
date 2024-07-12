const { Schema, model} = require("mongoose")


const HemerografiaSchema = new Schema({
    titulo: {
      type: String,
    },
    autor: {
      type: String,
    },
    images: { // Cambiado de 'image' a 'images' y ahora es un array de strings
      type: [String],
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
    fecha_publicacion: {
      type: Date,
    },
    lugar_publicacion: {
      type: String,
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
    numero_paginas: {
      type: String,
    },
    numero_edicion: {
      type: String,
    },
    numero_publicacion: {
        type: String,
    },
    genero_periodistico: {
        type: String,
    },
    literarios: {
        type: String,
    },
    seudonimos: {
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
    periodicidad: {
        type: String,
    },
    resumen:{
        type: String,
    },
    transcripcion: {
        type: String,
    },
    
    numero_registro: {
      type: Number,
  },
    drive_id: {
      type: String,
    },
  });


module.exports = model("Hemerografia",HemerografiaSchema,"hemerografia");