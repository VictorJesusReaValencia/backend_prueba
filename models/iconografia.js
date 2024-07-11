const { Schema, model } = require("mongoose");

const IconografiaSchema = new Schema({
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
    tipo_iconografia: {
        type: String,
    },
    medidas: {
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
    tecnica_impresion: {
        type: String,
    },
    idioma: {
        type: String,
    },
    descripcion_contexto: {
        type: String,
    },
    drive_id: {
        type: String,
    }
});

module.exports = model("Iconografia", IconografiaSchema, "iconografia");