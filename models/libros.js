const { Schema, model } = require("mongoose");

const LibrosSchema = new Schema({
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
    drive_id: {
        type: String,
    },
    // Campos adicionales
    ISBN: {
        type: String,
    },
    editorial: {
        type: String,
    },
    imprenta: {
        type: String,
    },
    edicion: {
        type: String,
    },
    prologo: {
        type: String,
    },
    compiladores: {
        type: String,
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
    premios_reconocimientos: {
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
    }
});
module.exports = model("Libros", LibrosSchema, "libros");