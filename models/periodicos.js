const { Schema, model } = require("mongoose");

const PeriodicosSchema = new Schema({
    nombre_periodico: {
        type: String,
        required: true,
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
    tipo_bien: {
        type: String,
        default: "Periódico"
    },
    persona_registra: {
        type: String,
    },
    numero_registro: {
        type: Number,
    },
    // Campos adicionales
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
});

module.exports = model("Periodicos", PeriodicosSchema, "periodicos");
