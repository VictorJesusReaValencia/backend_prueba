const { Schema, model } = require("mongoose");
const PartiturasSchema = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    autor: {
        type: String,
    },
    images: [ // Cambiado a un array de objetos con propiedades 'nombre' y 'fileId'
        {
          nombre: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          }
        }
      ],
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
    fecha_adquisicion: {
        type: Number,
    },
    coleccion: {
        type: String,
    },
    tipo_bien: {
        type: String,
        default: "Iconografía"
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
    
    numero_registro: {
        type: Number,
    },
    instrumento: {
        type: String,
    },
    genero: {
        type: String,
    },
    duracion: {
        type: String,
    },
    clave_musical: {
        type: String,
    },
    numero_paginas: {
        type: String,
    },
    editorial: {
        type: String,
    },
    formato: {
        type: String,
    },
    audio: {
        type: String,
    },
    descripcion_contexto: {
        type: String,
    }
});

module.exports = model("Partituras", PartiturasSchema, "partituras");