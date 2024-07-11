const { Schema, model } = require("mongoose");

const CorrespondenciaSchema = new Schema({
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
    drive_id: {
        type: String,
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
    tecnica_impresion: {
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
    formato: {
        type: String,
    },
    idioma: {
        type: String,
    },
    anexos: {
        type: String,
    },
    estado_carta: {
        type: String,
    }
});

module.exports = model("Correspondencia", CorrespondenciaSchema, "correspondencia");
