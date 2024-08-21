const { Schema, model } = require("mongoose");

const CorrespondenciaSchema = new Schema({
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
    fecha: {
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
        default: "Correspondencia"
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
    tipo_correspondencia: {
        type: String,
    },
    remitente: {
        type: String,
    },
    destinatario: {
        type: String,
    },
    fecha_envio: {
        type: Date,
    },
    fecha_recepcion: {
        type: Date,
    },
    lugar_origen: {
        type: String,
    },
    lugar_destino: {
        type: String,
    },
    medio_envio: {
        type: String,
    },
    asunto: {
        type: String,
    },
    transcripcion: {
        type: String,
    },
    numero_paginas: {
        type: Number,
    },
    anexos: {
        type: String,
    },
    notas: {
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
      mostrar: {
        type: String,
      },
      editar: {
        type: String,
      },
      revisado: {
        type: String,
      },
      pendientes: {
        type: String,
      },
});

module.exports = model("Correspondencia", CorrespondenciaSchema, "correspondencia");
