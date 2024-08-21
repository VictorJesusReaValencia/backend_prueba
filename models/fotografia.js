const { Schema, model} = require("mongoose")


const FotoSchema = new Schema({
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
      default: "fotografia"
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
    numero_foto: {
      type: Number,
    },
    numero_album: {
      type: Number,
    },
    formato: {
      type: String,
    },
    camara: {
      type: String,
    },
    descripcion: {
      type: String,
    },
    resumen: {
      type: String,
    },
    pendientes: {
      type: String,
    },
    mostrar: {
      type: String,
    },
    editar: {
      type: String,
    },
    revisado: {
      type: String,
    },
  });


module.exports = model("Fotografia",FotoSchema,"fotografias");