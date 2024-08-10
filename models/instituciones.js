const { Schema, model } = require("mongoose");
const InstitucionesSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    tipo_institucion: {
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
    maps: {
        type: String,
    },
    numero_registro: {
        type: Number,
    },
    notas_relevantes: {
        type: String,
    },
    pendiente: {
        type: String,
    },
    persona_registra: {
        type: String,
    },
    pagina_web: {
        type: String,
    }
});

module.exports = model("Instituciones", InstitucionesSchema, "Instituciones");
