const { Schema, model } = require("mongoose");

const LibrosSchema = new Schema({
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
    fecha_adquisicion: {
        type: Number,
    },
    coleccion: {
        type: String,
    },
    tipo_bien: {
        type: String,
        default: "Libro"
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
    // Campos adicionales
    isbn: {
        type: String,
    },
    editorial: {
        type: String,
    },
    imprenta: {
        type: String,
    },
    coleccion_serie: {
        type: String,
    },
    
    pendientes: {
        type: String,
    },
    numero_edicion: {
        type: Number,
    },
    numero_paginas: {
        type: Number,
    },
    
    lugar_publicacion: {
        type: String,
    },
    lugar_edicion: {
        type: String,
    },
    prologo: {
        type: String,
    },
    compiladores: {
        type: String,
    },
    fecha_publicacion: {
        type: Date,
    },
    fecha_reimpresion: {
        type: Date,
    },
    encuadernacion: {
        type: String,
    },
    volumen: {
        type: String,
    },
    tomo: {
        type: String,
    },
    genero_literario: {
        type: String,
    },
    resumen: {
        type: String,
    },
    numero_ejemplar: {
        type: String,
    },
    relacion_autor: {
        type: String,
    },
    premios: {
        type: String,
    },
    citas_relevantes: {
        type: String,
    },
    colaboradores: {
        type: String,
    },
    acceso_libro: {
        type: String,
    },
    pdfs: [ // Cambiado a un array de objetos con propiedades 'nombre' y 'fileId'
        {
          nombre: {
            type: String,
            required: true,
          },
          ruta: {
            type: String,
            required: true,
          }
        }
      ],
});
module.exports = model("Libros", LibrosSchema, "libros");