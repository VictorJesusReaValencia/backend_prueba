const { Schema, model } = require("mongoose");

const IconografiaSchema = new Schema({
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
    tipo_iconografia: {
        type: String,
    },
    ancho: {
        type: String,
    },
    alto: {
        type: String,
    },
    tecnica: {
        type: String,
    },
    superficie: {
        type: String,
    },
    corriente: {
        type: String,
    },
    notas: {
        type: String,
    }
});
module.exports = model("Iconografia", IconografiaSchema, "iconografia");