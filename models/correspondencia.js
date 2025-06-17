const { Schema, model } = require("mongoose");

const CorrespondenciaSchema = new Schema({
    anexos: { type: String },
    asunto: { type: String },
    autor: { type: String },
    ciudad: { type: String, required: false },
    coleccion: { type: String },
    destinatario: { type: String },
    editar: { type: String },
    fecha: { type: Date },
    fecha_adquisicion: { type: Number },
    fecha_envio: { type: Date },
    fecha_recepcion: { type: Date },
    fecha_registro: { type: Date, default: Date.now },
    hallazgo: { type: String, default: "No" },
    imagenes_fb: [{
        nombre: { type: String, maxlength: 50 },
        url: { type: String }
    }],
    images: [
        {
            nombre: { type: String },
            fileId: { type: String }
        }
    ],
    institucion: { type: String },
    lugar_destino: { type: String },
    lugar_origen: { type: String },
    medio_envio: { type: String },
    mostrar: { type: String },
    notas: { type: String },
    numero_paginas: { type: Number },
    numero_registro: { type: Number },
    pais: { type: String, required: false },
    pendientes: { type: String },
    pdfs: [
        {
            nombre: { type: String, required: false },
            ruta: { type: String, required: false }
        }
    ],
    persona_registra: { type: String },
    remitente: { type: String },
    revisado: { type: String },
    revisiones: [ // nueva: historial de revisiones
        {
            persona: { type: String, required: false },
            fecha: { type: Date, default: Date.now },
            observacion: { type: String },
            revision_resuelta: { type: Boolean, default: false },
            tipo_revision: { type: String }
        }
    ],
    tema: { type: String },
    tipo_bien: { type: String, default: "Correspondencia" },
    tipo_correspondencia: { type: String },
    titulo: { type: String, required: false },
    transcripcion: { type: String },
    ubicacion_fisica: { type: String },
    ultima_actualizacion: {
        fecha: { type: Date },
        por: { type: String }
    }
});

module.exports = model("Correspondencia", CorrespondenciaSchema, "correspondencia");
